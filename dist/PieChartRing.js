var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import Segment from "./segment";
import { sum, enhance } from "paths-js/ops";
import React from "react";
import { View } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";
var PieChartRing = /** @class */ (function(_super) {
  __extends(PieChartRing, _super);
  function PieChartRing() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  PieChartRing.prototype.render = function() {
    var _this = this;
    var _a = this.props,
      _b = _a.style,
      style = _b === void 0 ? {} : _b,
      backgroundColor = _a.backgroundColor,
      _c = _a.absolute,
      absolute = _c === void 0 ? false : _c,
      _d = _a.hasLegend,
      hasLegend = _d === void 0 ? true : _d,
      _e = _a.avoidFalseZero,
      avoidFalseZero = _e === void 0 ? true : _e;
    var _f = style.borderRadius,
      borderRadius = _f === void 0 ? 0 : _f;
    var debug = this.props.debug || false;
    if (debug) {
      console.log(
        "Data passed to pie: ",
        JSON.stringify(this.props.data, null, "\t")
      );
    }
    var chart = genPaths(
      this.props.data,
      this.props.accessor, // something like 'total' or 'population', etc.
      this.props.center || [0, 0], //center
      this.props.radius || 0, //r
      this.props.height / 2.5, //R
      {}
    );
    var total = this.props.data.reduce(function(sum, item) {
      return sum + item[_this.props.accessor];
    }, 0);
    var paths = chart.paths.map(function(c, i) {
      var value;
      if (absolute) {
        value = c.item[_this.props.accessor];
      } else {
        if (total === 0) {
          value = 0 + "%";
        } else {
          var percentage = Math.round(
            (100 / total) * c.item[_this.props.accessor]
          );
          value =
            Math.round((100 / total) * c.item[_this.props.accessor]) + "%";
          if (avoidFalseZero && percentage === 0) {
            value = "<1%";
          } else {
            value = percentage + "%";
          }
        }
      }
      return (
        <G key={Math.random()}>
          <Path
            d={c.path.path.print()}
            fill={"none"}
            stroke={c.item.color}
            strokeWidth={20}
            strokeLinecap={"round"}
          />
          {hasLegend ? (
            <Rect
              width="16px"
              height="16px"
              fill={c.item.color}
              rx={8}
              ry={8}
              x={_this.props.width / 2.5 - 24}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12
              }
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              fontFamily={c.item.legendFontFamily}
              x={_this.props.width / 2.5}
              y={
                -(_this.props.height / 2.5) +
                ((_this.props.height * 0.8) / _this.props.data.length) * i +
                12 * 2
              }
            >
              {value + " " + c.item.name}
            </Text>
          ) : null}
        </G>
      );
    });
    return (
      <View
        style={__assign(
          { width: this.props.width, height: this.props.height, padding: 0 },
          style
        )}
      >
        <Svg width={this.props.width} height={this.props.height}>
          <G>
            {this.renderDefs(
              __assign(
                { width: this.props.height, height: this.props.height },
                this.props.chartConfig
              )
            )}
          </G>
          <Rect
            width="100%"
            height={this.props.height}
            rx={borderRadius}
            ry={borderRadius}
            fill={backgroundColor}
          />
          <G
            x={
              this.props.width / 2 / 2 +
              Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
            }
            y={this.props.height / 2}
          >
            {paths}
          </G>
        </Svg>
      </View>
    );
  };
  return PieChartRing;
})(AbstractChart);
// Generates the "Pie Ring" in order to meet the design spec
// Equivalent of 'Pie' exported from paths.js, will refactor / move later on
export function genPaths(data, accessor, center, r, R, compute) {
  var values = data.map(function(item) {
    return item[accessor];
  });
  var s = sum(values);
  // console.log("original sum: ", s.toLocaleString());
  var onepercent = s / 100;
  // 3% seems like a safe bet for things getting too small to observe
  var THRESHOLD = onepercent * 3;
  var below = function(x, t) {
    return x < t && x > 0;
  };
  // Assuming the 3% from above, let's not pull from a category
  // unless it's got more than 7% so things don't get jacked up
  var above = function(x, t) {
    return x > t * 2.5;
  };
  if (
    values.some(function(item) {
      return below(item, THRESHOLD);
    })
  ) {
    var belowcount_1 = values.filter(function(x) {
      return below(x, THRESHOLD);
    }).length;
    var safecount_1 = values.filter(function(x) {
      return above(x, THRESHOLD);
    }).length;
    values = values.map(function(item) {
      if (above(item, THRESHOLD)) {
        item -= onepercent * belowcount_1;
      } else if (below(item, THRESHOLD)) {
        item += onepercent * safecount_1;
      }
      return item;
    });
    // console.log("values after remap: ", sum(values).toLocaleString());
  }
  s = s === 0 ? 1 : s;
  var scale = linear([0, s], [0, 2 * Math.PI], 10);
  var paths = [];
  var t = 0;
  var offset = 0.1;
  data.forEach(function(item, i) {
    var value = values[i];
    paths.push(
      enhance(compute, {
        item: item,
        index: i,
        path: Segment({
          center: center,
          r: 0,
          R: 100,
          start: scale(t) + offset,
          end: scale(t + value) - offset,
          offset: offset
        })
      })
    );
    t += value;
  });
  return { paths: paths };
}
// All ripped from paths.js.
// Will clean up / properly import later
export function linear(_a, _b, offset) {
  var a = _a[0],
    b = _a[1];
  var c = _b[0],
    d = _b[1];
  if (offset === void 0) {
    offset = 0;
  }
  var f = function(x) {
    return c + ((d - c) * (x - a)) / (b - a);
  };
  return f;
}
export function plus(_a, _b) {
  var a = _a[0],
    b = _a[1];
  var c = _b[0],
    d = _b[1];
  return [a + c, b + d];
}
export function times(k, _a) {
  var a = _a[0],
    b = _a[1];
  return [k * a, k * b];
}
export function onCircle(r, angle) {
  times(r, [Math.sin(angle), -Math.cos(angle)]);
}
export default PieChartRing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnRSaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BpZUNoYXJ0UmluZy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsSUFBSSxFQUFhLE1BQU0sY0FBYyxDQUFDO0FBQy9DLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFNUQsT0FBTyxhQUFxQyxNQUFNLGlCQUFpQixDQUFDO0FBb0JwRTtJQUEyQixnQ0FBMkM7SUFBdEU7O0lBb0lBLENBQUM7SUFuSUMsNkJBQU0sR0FBTjtRQUFBLGlCQWtJQztRQWpJTyxJQUFBLEtBTUYsSUFBSSxDQUFDLEtBQUssRUFMWixhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLEtBQUEsRUFDVixlQUFlLHFCQUFBLEVBQ2YsZ0JBQWdCLEVBQWhCLFFBQVEsbUJBQUcsS0FBSyxLQUFBLEVBQ2hCLGlCQUFnQixFQUFoQixTQUFTLG1CQUFHLElBQUksS0FBQSxFQUNoQixzQkFBcUIsRUFBckIsY0FBYyxtQkFBRyxJQUFJLEtBQ1QsQ0FBQztRQUVQLElBQUEsS0FBcUIsS0FBSyxhQUFWLEVBQWhCLFlBQVksbUJBQUcsQ0FBQyxLQUFBLENBQVc7UUFDbkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO1FBQ3hDLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FDVCxzQkFBc0IsRUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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RSxDQUFDLFFBQUE7SUFDNUIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxNQUFNLFVBQVUsUUFBUSxDQUFDLENBQUMsRUFBRSxLQUFLO0lBQy9CLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELGVBQWUsWUFBWSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlZ21lbnQgZnJvbSBcIi4vc2VnbWVudFwiO1xuaW1wb3J0IHsgc3VtLCBlbmhhbmNlIH0gZnJvbSBcInBhdGhzLWpzL29wc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgVmlldywgVmlld1N0eWxlIH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgRywgUGF0aCwgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHsgQWJzdHJhY3RDaGFydFByb3BzIH0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcbiAgcmFkaXVzPzogbnVtYmVyO1xuICBkZWJ1Zz86IGJvb2xlYW47XG59XG5cbnR5cGUgUGllQ2hhcnRTdGF0ZSA9IHt9O1xuXG5jbGFzcyBQaWVDaGFydFJpbmcgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFBpZUNoYXJ0UHJvcHMsIFBpZUNoYXJ0U3RhdGU+IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTGVnZW5kID0gdHJ1ZSxcbiAgICAgIGF2b2lkRmFsc2VaZXJvID0gdHJ1ZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgeyBib3JkZXJSYWRpdXMgPSAwIH0gPSBzdHlsZTtcbiAgICBjb25zdCBkZWJ1ZyA9IHRoaXMucHJvcHMuZGVidWcgfHwgZmFsc2U7XG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgXCJEYXRhIHBhc3NlZCB0byBwaWU6IFwiLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLnByb3BzLmRhdGEsIG51bGwsIFwiXFx0XCIpXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJ0ID0gZ2VuUGF0aHMoXG4gICAgICB0aGlzLnByb3BzLmRhdGEsXG4gICAgICB0aGlzLnByb3BzLmFjY2Vzc29yLCAvLyBzb21ldGhpbmcgbGlrZSAndG90YWwnIG9yICdwb3B1bGF0aW9uJywgZXRjLlxuICAgICAgdGhpcy5wcm9wcy5jZW50ZXIgfHwgWzAsIDBdLCAvL2NlbnRlclxuICAgICAgdGhpcy5wcm9wcy5yYWRpdXMgfHwgMCwgLy9yXG4gICAgICB0aGlzLnByb3BzLmhlaWdodCAvIDIuNSwgLy9SXG4gICAgICB7fVxuICAgICk7XG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnByb3BzLmRhdGEucmVkdWNlKChzdW0sIGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBzdW0gKyBpdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdO1xuICAgIH0sIDApO1xuXG4gICAgY29uc3QgcGF0aHMgPSBjaGFydC5wYXRocy5tYXAoKGMsIGkpID0+IHtcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nO1xuXG4gICAgICBpZiAoYWJzb2x1dGUpIHtcbiAgICAgICAgdmFsdWUgPSBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodG90YWwgPT09IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDAgKyBcIiVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gTWF0aC5yb3VuZChcbiAgICAgICAgICAgICgxMDAgLyB0b3RhbCkgKiBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl1cbiAgICAgICAgICApO1xuICAgICAgICAgIHZhbHVlID0gTWF0aC5yb3VuZCgoMTAwIC8gdG90YWwpICogYy5pdGVtW3RoaXMucHJvcHMuYWNjZXNzb3JdKSArIFwiJVwiO1xuICAgICAgICAgIGlmIChhdm9pZEZhbHNlWmVybyAmJiBwZXJjZW50YWdlID09PSAwKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IFwiPDElXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGVyY2VudGFnZSArIFwiJVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RyBrZXk9e01hdGgucmFuZG9tKCl9PlxuICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICBkPXtjLnBhdGgucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgZmlsbD17XCJub25lXCJ9XG4gICAgICAgICAgICBzdHJva2U9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgIHN0cm9rZVdpZHRoPXsyMH1cbiAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9e1wicm91bmRcIn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxuICAgICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjUgLSAyNH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBmaWxsPXtjLml0ZW0ubGVnZW5kRm9udENvbG9yfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgeD17dGhpcy5wcm9wcy53aWR0aCAvIDIuNX1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMiAqIDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7YCR7dmFsdWV9ICR7Yy5pdGVtLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8Vmlld1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgcGFkZGluZzogMCxcbiAgICAgICAgICAuLi5zdHlsZVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8U3ZnIHdpZHRoPXt0aGlzLnByb3BzLndpZHRofSBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fT5cbiAgICAgICAgICA8Rz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckRlZnMoe1xuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICAgIC4uLnRoaXMucHJvcHMuY2hhcnRDb25maWdcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9XG4gICAgICAgICAgICByeD17Ym9yZGVyUmFkaXVzfVxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIGZpbGw9e2JhY2tncm91bmRDb2xvcn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxHXG4gICAgICAgICAgICB4PXtcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy53aWR0aCAvIDIgLyAyICtcbiAgICAgICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHk9e3RoaXMucHJvcHMuaGVpZ2h0IC8gMn1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cGF0aHN9XG4gICAgICAgICAgPC9HPlxuICAgICAgICA8L1N2Zz5cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbi8vIEdlbmVyYXRlcyB0aGUgXCJQaWUgUmluZ1wiIGluIG9yZGVyIHRvIG1lZXQgdGhlIGRlc2lnbiBzcGVjXG4vLyBFcXVpdmFsZW50IG9mICdQaWUnIGV4cG9ydGVkIGZyb20gcGF0aHMuanMsIHdpbGwgcmVmYWN0b3IgLyBtb3ZlIGxhdGVyIG9uXG5leHBvcnQgZnVuY3Rpb24gZ2VuUGF0aHMoXG4gIGRhdGE6IEFycmF5PGFueT4sXG4gIGFjY2Vzc29yOiBzdHJpbmcsXG4gIGNlbnRlcjogQXJyYXk8bnVtYmVyPixcbiAgcjogbnVtYmVyLFxuICBSOiBudW1iZXIsXG4gIGNvbXB1dGVcbikge1xuICBsZXQgdmFsdWVzID0gZGF0YS5tYXAoaXRlbSA9PiBpdGVtW2FjY2Vzc29yXSk7XG4gIGxldCBzID0gc3VtKHZhbHVlcyk7XG4gIC8vIGNvbnNvbGUubG9nKFwib3JpZ2luYWwgc3VtOiBcIiwgcy50b0xvY2FsZVN0cmluZygpKTtcbiAgY29uc3Qgb25lcGVyY2VudCA9IHMgLyAxMDA7XG4gIC8vIDMlIHNlZW1zIGxpa2UgYSBzYWZlIGJldCBmb3IgdGhpbmdzIGdldHRpbmcgdG9vIHNtYWxsIHRvIG9ic2VydmVcbiAgY29uc3QgVEhSRVNIT0xEID0gb25lcGVyY2VudCAqIDM7XG4gIGxldCBiZWxvdyA9ICh4LCB0KSA9PiB7XG4gICAgcmV0dXJuIHggPCB0ICYmIHggPiAwO1xuICB9O1xuICAvLyBBc3N1bWluZyB0aGUgMyUgZnJvbSBhYm92ZSwgbGV0J3Mgbm90IHB1bGwgZnJvbSBhIGNhdGVnb3J5XG4gIC8vIHVubGVzcyBpdCdzIGdvdCBtb3JlIHRoYW4gNyUgc28gdGhpbmdzIGRvbid0IGdldCBqYWNrZWQgdXBcbiAgbGV0IGFib3ZlID0gKHgsIHQpID0+IHtcbiAgICByZXR1cm4geCA+IHQgKiAyLjU7XG4gIH07XG4gIGlmICh2YWx1ZXMuc29tZShpdGVtID0+IGJlbG93KGl0ZW0sIFRIUkVTSE9MRCkpKSB7XG4gICAgY29uc3QgYmVsb3djb3VudCA9IHZhbHVlcy5maWx0ZXIoeCA9PiBiZWxvdyh4LCBUSFJFU0hPTEQpKS5sZW5ndGg7XG4gICAgY29uc3Qgc2FmZWNvdW50ID0gdmFsdWVzLmZpbHRlcih4ID0+IGFib3ZlKHgsIFRIUkVTSE9MRCkpLmxlbmd0aDtcblxuICAgIHZhbHVlcyA9IHZhbHVlcy5tYXAoaXRlbSA9PiB7XG4gICAgICBpZiAoYWJvdmUoaXRlbSwgVEhSRVNIT0xEKSkge1xuICAgICAgICBpdGVtIC09IG9uZXBlcmNlbnQgKiBiZWxvd2NvdW50O1xuICAgICAgfSBlbHNlIGlmIChiZWxvdyhpdGVtLCBUSFJFU0hPTEQpKSB7XG4gICAgICAgIGl0ZW0gKz0gb25lcGVyY2VudCAqIHNhZmVjb3VudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJ2YWx1ZXMgYWZ0ZXIgcmVtYXA6IFwiLCBzdW0odmFsdWVzKS50b0xvY2FsZVN0cmluZygpKTtcbiAgfVxuICBzID0gcyA9PT0gMCA/IDEgOiBzO1xuICBsZXQgc2NhbGUgPSBsaW5lYXIoWzAsIHNdLCBbMCwgMiAqIE1hdGguUEldLCAxMCk7XG4gIGxldCBwYXRocyA9IFtdO1xuICBsZXQgdCA9IDA7XG4gIGxldCBvZmZzZXQgPSAwLjE7XG4gIGRhdGEuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IHZhbHVlc1tpXTtcbiAgICBwYXRocy5wdXNoKFxuICAgICAgZW5oYW5jZShjb21wdXRlLCB7XG4gICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICBwYXRoOiBTZWdtZW50KHtcbiAgICAgICAgICBjZW50ZXI6IGNlbnRlcixcbiAgICAgICAgICByOiAwLFxuICAgICAgICAgIFI6IDEwMCxcbiAgICAgICAgICBzdGFydDogc2NhbGUodCkgKyBvZmZzZXQsXG4gICAgICAgICAgZW5kOiBzY2FsZSh0ICsgdmFsdWUpIC0gb2Zmc2V0LFxuICAgICAgICAgIG9mZnNldDogb2Zmc2V0XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICk7XG4gICAgdCArPSB2YWx1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIHsgcGF0aHMgfTtcbn1cblxuLy8gQWxsIHJpcHBlZCBmcm9tIHBhdGhzLmpzLlxuLy8gV2lsbCBjbGVhbiB1cCAvIHByb3Blcmx5IGltcG9ydCBsYXRlclxuXG5leHBvcnQgZnVuY3Rpb24gbGluZWFyKFthLCBiXSwgW2MsIGRdLCBvZmZzZXQgPSAwKSB7XG4gIGxldCBmID0geCA9PiB7XG4gICAgcmV0dXJuIGMgKyAoKGQgLSBjKSAqICh4IC0gYSkpIC8gKGIgLSBhKTtcbiAgfTtcblxuICByZXR1cm4gZjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsdXMoW2EsIGJdLCBbYywgZF0pIHtcbiAgcmV0dXJuIFthICsgYywgYiArIGRdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGltZXMoaywgW2EsIGJdKSB7XG4gIHJldHVybiBbayAqIGEsIGsgKiBiXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uQ2lyY2xlKHIsIGFuZ2xlKSB7XG4gIHRpbWVzKHIsIFtNYXRoLnNpbihhbmdsZSksIC1NYXRoLmNvcyhhbmdsZSldKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGllQ2hhcnRSaW5nO1xuIl19
