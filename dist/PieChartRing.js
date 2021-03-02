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
      avoidFalseZero = _e === void 0 ? false : _e;
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
      this.props.accessor,
      this.props.center || [0, 0], //center
      this.props.radius || 0, //r
      this.props.height / 2.5, //R
      {}
    );
    var total = this.props.data.reduce(function(sum, item) {
      return sum + item[_this.props.accessor];
    }, 0);
    console.log("new chart render");
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
      console.log("I'm c: ", c.path.path.print());
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
    var pathsG = (
      <G
        x={
          this.props.width / 2 / 2 +
          Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
        }
        y={this.props.height / 2}
      >
        {paths}
      </G>
    );
    // console.log("pathsG: ", pathsG);
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
export function genPaths(data, accessor, center, r, R, compute) {
  // const accessor = x => x["total"];
  // const data = [
  //   { category: "one", total: 25 },
  //   { category: "two", total: 25 },
  //   { category: "three", total: 25 },
  //   { category: "four", total: 25 }
  // ];
  // console.log("data ", data);
  // console.log("accessor ", accessor);
  var values = data.map(function(item) {
    return item[accessor];
  });
  console.log("values ", values);
  // const center = [200, 200];
  // const compute = {};
  var s = sum(values);
  var onepercent = s / 100;
  if (
    values.some(function(item) {
      return item < onepercent * 3;
    })
  ) {
    values = values.map(function(item) {
      if (item > onepercent * 3) {
        item = item - onepercent;
      } else {
        item = item + onepercent * 4;
      }
      return item;
    });
  }
  console.log("updated values", values);
  s = s === 0 ? 1 : s;
  console.log("sum of values ", s);
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
export function linear(_a, _b, offset) {
  var a = _a[0],
    b = _a[1];
  var c = _b[0],
    d = _b[1];
  if (offset === void 0) {
    offset = 0;
  }
  var f = function(x) {
    // console.log("linear x ", x);
    return c + ((d - c) * (x - a)) / (b - a);
  };
  // f.inverse = () => linear([c, d], [a, b])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGllQ2hhcnRSaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BpZUNoYXJ0UmluZy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFDO0FBRWhDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzVDLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsSUFBSSxFQUFhLE1BQU0sY0FBYyxDQUFDO0FBQy9DLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFNUQsT0FBTyxhQUFxQyxNQUFNLGlCQUFpQixDQUFDO0FBb0JwRTtJQUEyQixnQ0FBMkM7SUFBdEU7O0lBaUpBLENBQUM7SUFoSkMsNkJBQU0sR0FBTjtRQUFBLGlCQStJQztRQTlJTyxJQUFBLEtBTUYsSUFBSSxDQUFDLEtBQUssRUFMWixhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLEtBQUEsRUFDVixlQUFlLHFCQUFBLEVBQ2YsZ0JBQWdCLEVBQWhCLFFBQVEsbUJBQUcsS0FBSyxLQUFBLEVBQ2hCLGlCQUFnQixFQUFoQixTQUFTLG1CQUFHLElBQUksS0FBQSxFQUNoQixzQkFBc0IsRUFBdEIsY0FBYyxtQkFBRyxLQUFLLEtBQ1YsQ0FBQztRQUVQLElBQUEsS0FBcUIsS0FBSyxhQUFWLEVBQWhCLFlBQVksbUJBQUcsQ0FBQyxLQUFBLENBQVc7UUFDbkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO1FBQ3hDLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FDVCxzQkFBc0IsRUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFD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QUFBO0lBQ2hDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRUQsTUFBTSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBTTtRQUFMLENBQUMsUUFBQSxFQUFFLENBQUMsUUFBQTtJQUM1QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVELE1BQU0sVUFBVSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUs7SUFDL0IsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRUQsZUFBZSxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGllIGZyb20gXCJwYXRocy1qcy9waWVcIjtcbmltcG9ydCBTZWdtZW50IGZyb20gXCIuL3NlZ21lbnRcIjtcbmltcG9ydCBMaW5lYXIgZnJvbSBcInBhdGhzLWpzL2xpbmVhclwiO1xuaW1wb3J0IHsgc3VtLCBlbmhhbmNlIH0gZnJvbSBcInBhdGhzLWpzL29wc1wiO1xuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgVmlldywgVmlld1N0eWxlIH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuaW1wb3J0IHsgRywgUGF0aCwgUmVjdCwgU3ZnLCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS1zdmdcIjtcblxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHsgQWJzdHJhY3RDaGFydFByb3BzIH0gZnJvbSBcIi4vQWJzdHJhY3RDaGFydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xuICBkYXRhOiBBcnJheTxhbnk+O1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWNjZXNzb3I6IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yOiBzdHJpbmc7XG4gIHBhZGRpbmdMZWZ0OiBzdHJpbmc7XG4gIGNlbnRlcj86IEFycmF5PG51bWJlcj47XG4gIGFic29sdXRlPzogYm9vbGVhbjtcbiAgaGFzTGVnZW5kPzogYm9vbGVhbjtcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XG4gIGF2b2lkRmFsc2VaZXJvPzogYm9vbGVhbjtcbiAgcmFkaXVzPzogbnVtYmVyO1xuICBkZWJ1Zz86IGJvb2xlYW47XG59XG5cbnR5cGUgUGllQ2hhcnRTdGF0ZSA9IHt9O1xuXG5jbGFzcyBQaWVDaGFydFJpbmcgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PFBpZUNoYXJ0UHJvcHMsIFBpZUNoYXJ0U3RhdGU+IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBhYnNvbHV0ZSA9IGZhbHNlLFxuICAgICAgaGFzTGVnZW5kID0gdHJ1ZSxcbiAgICAgIGF2b2lkRmFsc2VaZXJvID0gZmFsc2VcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IHsgYm9yZGVyUmFkaXVzID0gMCB9ID0gc3R5bGU7XG4gICAgY29uc3QgZGVidWcgPSB0aGlzLnByb3BzLmRlYnVnIHx8IGZhbHNlO1xuICAgIGlmIChkZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiRGF0YSBwYXNzZWQgdG8gcGllOiBcIixcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodGhpcy5wcm9wcy5kYXRhLCBudWxsLCBcIlxcdFwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFydCA9IGdlblBhdGhzKFxuICAgICAgdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgdGhpcy5wcm9wcy5hY2Nlc3NvcixcbiAgICAgIHRoaXMucHJvcHMuY2VudGVyIHx8IFswLCAwXSwgLy9jZW50ZXJcbiAgICAgIHRoaXMucHJvcHMucmFkaXVzIHx8IDAsIC8vclxuICAgICAgdGhpcy5wcm9wcy5oZWlnaHQgLyAyLjUsIC8vUlxuICAgICAge31cbiAgICApO1xuICAgIGNvbnN0IHRvdGFsID0gdGhpcy5wcm9wcy5kYXRhLnJlZHVjZSgoc3VtLCBpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gc3VtICsgaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICB9LCAwKTtcblxuICAgIGNvbnNvbGUubG9nKFwibmV3IGNoYXJ0IHJlbmRlclwiKTtcbiAgICBjb25zdCBwYXRocyA9IGNoYXJ0LnBhdGhzLm1hcCgoYywgaSkgPT4ge1xuICAgICAgbGV0IHZhbHVlOiBzdHJpbmc7XG5cbiAgICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgICB2YWx1ZSA9IGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0b3RhbCA9PT0gMCkge1xuICAgICAgICAgIHZhbHVlID0gMCArIFwiJVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHBlcmNlbnRhZ2UgPSBNYXRoLnJvdW5kKFxuICAgICAgICAgICAgKDEwMCAvIHRvdGFsKSAqIGMuaXRlbVt0aGlzLnByb3BzLmFjY2Vzc29yXVxuICAgICAgICAgICk7XG4gICAgICAgICAgdmFsdWUgPSBNYXRoLnJvdW5kKCgxMDAgLyB0b3RhbCkgKiBjLml0ZW1bdGhpcy5wcm9wcy5hY2Nlc3Nvcl0pICsgXCIlXCI7XG4gICAgICAgICAgaWYgKGF2b2lkRmFsc2VaZXJvICYmIHBlcmNlbnRhZ2UgPT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gXCI8MSVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSBwZXJjZW50YWdlICsgXCIlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhcIkknbSBjOiBcIiwgYy5wYXRoLnBhdGgucHJpbnQoKSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RyBrZXk9e01hdGgucmFuZG9tKCl9PlxuICAgICAgICAgIDxQYXRoXG4gICAgICAgICAgICBkPXtjLnBhdGgucGF0aC5wcmludCgpfVxuICAgICAgICAgICAgZmlsbD17XCJub25lXCJ9XG4gICAgICAgICAgICBzdHJva2U9e2MuaXRlbS5jb2xvcn1cbiAgICAgICAgICAgIHN0cm9rZVdpZHRoPXsyMH1cbiAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9e1wicm91bmRcIn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8UmVjdFxuICAgICAgICAgICAgICB3aWR0aD1cIjE2cHhcIlxuICAgICAgICAgICAgICBoZWlnaHQ9XCIxNnB4XCJcbiAgICAgICAgICAgICAgZmlsbD17Yy5pdGVtLmNvbG9yfVxuICAgICAgICAgICAgICByeD17OH1cbiAgICAgICAgICAgICAgcnk9ezh9XG4gICAgICAgICAgICAgIHg9e3RoaXMucHJvcHMud2lkdGggLyAyLjUgLSAyNH1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIHtoYXNMZWdlbmQgPyAoXG4gICAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgICBmaWxsPXtjLml0ZW0ubGVnZW5kRm9udENvbG9yfVxuICAgICAgICAgICAgICBmb250U2l6ZT17Yy5pdGVtLmxlZ2VuZEZvbnRTaXplfVxuICAgICAgICAgICAgICBmb250RmFtaWx5PXtjLml0ZW0ubGVnZW5kRm9udEZhbWlseX1cbiAgICAgICAgICAgICAgeD17dGhpcy5wcm9wcy53aWR0aCAvIDIuNX1cbiAgICAgICAgICAgICAgeT17XG4gICAgICAgICAgICAgICAgLSh0aGlzLnByb3BzLmhlaWdodCAvIDIuNSkgK1xuICAgICAgICAgICAgICAgICgodGhpcy5wcm9wcy5oZWlnaHQgKiAwLjgpIC8gdGhpcy5wcm9wcy5kYXRhLmxlbmd0aCkgKiBpICtcbiAgICAgICAgICAgICAgICAxMiAqIDJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7YCR7dmFsdWV9ICR7Yy5pdGVtLm5hbWV9YH1cbiAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9HPlxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhdGhzRyA9IChcbiAgICAgIDxHXG4gICAgICAgIHg9e1xuICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAyIC8gMiArXG4gICAgICAgICAgTnVtYmVyKHRoaXMucHJvcHMucGFkZGluZ0xlZnQgPyB0aGlzLnByb3BzLnBhZGRpbmdMZWZ0IDogMClcbiAgICAgICAgfVxuICAgICAgICB5PXt0aGlzLnByb3BzLmhlaWdodCAvIDJ9XG4gICAgICA+XG4gICAgICAgIHtwYXRoc31cbiAgICAgIDwvRz5cbiAgICApO1xuICAgIC8vIGNvbnNvbGUubG9nKFwicGF0aHNHOiBcIiwgcGF0aHNHKTtcbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFN2ZyB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0gaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH0+XG4gICAgICAgICAgPEc+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJEZWZzKHtcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgICAgICAgICAuLi50aGlzLnByb3BzLmNoYXJ0Q29uZmlnXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICA8L0c+XG4gICAgICAgICAgPFJlY3RcbiAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICBoZWlnaHQ9e3RoaXMucHJvcHMuaGVpZ2h0fVxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cbiAgICAgICAgICAgIHJ5PXtib3JkZXJSYWRpdXN9XG4gICAgICAgICAgICBmaWxsPXtiYWNrZ3JvdW5kQ29sb3J9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8R1xuICAgICAgICAgICAgeD17XG4gICAgICAgICAgICAgIHRoaXMucHJvcHMud2lkdGggLyAyIC8gMiArXG4gICAgICAgICAgICAgIE51bWJlcih0aGlzLnByb3BzLnBhZGRpbmdMZWZ0ID8gdGhpcy5wcm9wcy5wYWRkaW5nTGVmdCA6IDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5PXt0aGlzLnByb3BzLmhlaWdodCAvIDJ9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3BhdGhzfVxuICAgICAgICAgIDwvRz5cbiAgICAgICAgPC9Tdmc+XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuUGF0aHMoXG4gIGRhdGE6IEFycmF5PGFueT4sXG4gIGFjY2Vzc29yOiBzdHJpbmcsXG4gIGNlbnRlcjogQXJyYXk8bnVtYmVyPixcbiAgcjogbnVtYmVyLFxuICBSOiBudW1iZXIsXG4gIGNvbXB1dGVcbikge1xuICAvLyBjb25zdCBhY2Nlc3NvciA9IHggPT4geFtcInRvdGFsXCJdO1xuICAvLyBjb25zdCBkYXRhID0gW1xuICAvLyAgIHsgY2F0ZWdvcnk6IFwib25lXCIsIHRvdGFsOiAyNSB9LFxuICAvLyAgIHsgY2F0ZWdvcnk6IFwidHdvXCIsIHRvdGFsOiAyNSB9LFxuICAvLyAgIHsgY2F0ZWdvcnk6IFwidGhyZWVcIiwgdG90YWw6IDI1IH0sXG4gIC8vICAgeyBjYXRlZ29yeTogXCJmb3VyXCIsIHRvdGFsOiAyNSB9XG4gIC8vIF07XG4gIC8vIGNvbnNvbGUubG9nKFwiZGF0YSBcIiwgZGF0YSk7XG4gIC8vIGNvbnNvbGUubG9nKFwiYWNjZXNzb3IgXCIsIGFjY2Vzc29yKTtcbiAgbGV0IHZhbHVlcyA9IGRhdGEubWFwKGl0ZW0gPT4gaXRlbVthY2Nlc3Nvcl0pO1xuICBjb25zb2xlLmxvZyhcInZhbHVlcyBcIiwgdmFsdWVzKTtcbiAgLy8gY29uc3QgY2VudGVyID0gWzIwMCwgMjAwXTtcbiAgLy8gY29uc3QgY29tcHV0ZSA9IHt9O1xuICBsZXQgcyA9IHN1bSh2YWx1ZXMpO1xuICBjb25zdCBvbmVwZXJjZW50ID0gcyAvIDEwMDtcbiAgaWYgKHZhbHVlcy5zb21lKGl0ZW0gPT4gaXRlbSA8IG9uZXBlcmNlbnQgKiAzKSkge1xuICAgIHZhbHVlcyA9IHZhbHVlcy5tYXAoaXRlbSA9PiB7XG4gICAgICBpZiAoaXRlbSA+IG9uZXBlcmNlbnQgKiAzKSB7XG4gICAgICAgIGl0ZW0gPSBpdGVtIC0gb25lcGVyY2VudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW0gPSBpdGVtICsgb25lcGVyY2VudCAqIDQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcbiAgfVxuICBjb25zb2xlLmxvZyhcInVwZGF0ZWQgdmFsdWVzXCIsIHZhbHVlcyk7XG4gIHMgPSBzID09PSAwID8gMSA6IHM7XG4gIGNvbnNvbGUubG9nKFwic3VtIG9mIHZhbHVlcyBcIiwgcyk7XG4gIGxldCBzY2FsZSA9IGxpbmVhcihbMCwgc10sIFswLCAyICogTWF0aC5QSV0sIDEwKTtcbiAgbGV0IHBhdGhzID0gW107XG4gIGxldCB0ID0gMDtcbiAgbGV0IG9mZnNldCA9IDAuMTtcbiAgZGF0YS5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gdmFsdWVzW2ldO1xuICAgIHBhdGhzLnB1c2goXG4gICAgICBlbmhhbmNlKGNvbXB1dGUsIHtcbiAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIHBhdGg6IFNlZ21lbnQoe1xuICAgICAgICAgIGNlbnRlcjogY2VudGVyLFxuICAgICAgICAgIHI6IDAsXG4gICAgICAgICAgUjogMTAwLFxuICAgICAgICAgIHN0YXJ0OiBzY2FsZSh0KSArIG9mZnNldCxcbiAgICAgICAgICBlbmQ6IHNjYWxlKHQgKyB2YWx1ZSkgLSBvZmZzZXQsXG4gICAgICAgICAgb2Zmc2V0OiBvZmZzZXRcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0ICs9IHZhbHVlO1xuICB9KTtcblxuICByZXR1cm4geyBwYXRocyB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGluZWFyKFthLCBiXSwgW2MsIGRdLCBvZmZzZXQgPSAwKSB7XG4gIGxldCBmID0geCA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coXCJsaW5lYXIgeCBcIiwgeCk7XG4gICAgcmV0dXJuIGMgKyAoKGQgLSBjKSAqICh4IC0gYSkpIC8gKGIgLSBhKTtcbiAgfTtcblxuICAvLyBmLmludmVyc2UgPSAoKSA9PiBsaW5lYXIoW2MsIGRdLCBbYSwgYl0pXG4gIHJldHVybiBmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGx1cyhbYSwgYl0sIFtjLCBkXSkge1xuICByZXR1cm4gW2EgKyBjLCBiICsgZF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lcyhrLCBbYSwgYl0pIHtcbiAgcmV0dXJuIFtrICogYSwgayAqIGJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25DaXJjbGUociwgYW5nbGUpIHtcbiAgdGltZXMociwgW01hdGguc2luKGFuZ2xlKSwgLU1hdGguY29zKGFuZ2xlKV0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQaWVDaGFydFJpbmc7XG4iXX0=
