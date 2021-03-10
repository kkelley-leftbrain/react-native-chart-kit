import Segment from "./segment";
import { sum, enhance } from "paths-js/ops";
import React from "react";
import { View, ViewStyle } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";

import AbstractChart, { AbstractChartProps } from "./AbstractChart";

export interface PieChartProps extends AbstractChartProps {
  data: Array<any>;
  width: number;
  height: number;
  accessor: string;
  backgroundColor: string;
  paddingLeft: string;
  center?: Array<number>;
  absolute?: boolean;
  hasLegend?: boolean;
  style?: Partial<ViewStyle>;
  avoidFalseZero?: boolean;
  radius?: number;
  debug?: boolean;
}

type PieChartState = {};

class PieChartRing extends AbstractChart<PieChartProps, PieChartState> {
  render() {
    const {
      style = {},
      backgroundColor,
      absolute = false,
      hasLegend = true,
      avoidFalseZero = true
    } = this.props;

    const { borderRadius = 0 } = style;
    const debug = this.props.debug || false;
    if (debug) {
      console.log(
        "Data passed to pie: ",
        JSON.stringify(this.props.data, null, "\t")
      );
    }

    const chart = genPaths(
      this.props.data,
      this.props.accessor, // something like 'total' or 'population', etc.
      this.props.center || [0, 0], //center
      this.props.radius || 0, //r
      this.props.height / 2.5, //R
      {}
    );
    const total = this.props.data.reduce((sum, item) => {
      return sum + item[this.props.accessor];
    }, 0);

    const paths = chart.paths.map((c, i) => {
      let value: string;

      if (absolute) {
        value = c.item[this.props.accessor];
      } else {
        if (total === 0) {
          value = 0 + "%";
        } else {
          const percentage = Math.round(
            (100 / total) * c.item[this.props.accessor]
          );
          value = Math.round((100 / total) * c.item[this.props.accessor]) + "%";
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
              x={this.props.width / 2.5 - 24}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12
              }
            />
          ) : null}
          {hasLegend ? (
            <Text
              fill={c.item.legendFontColor}
              fontSize={c.item.legendFontSize}
              fontFamily={c.item.legendFontFamily}
              x={this.props.width / 2.5}
              y={
                -(this.props.height / 2.5) +
                ((this.props.height * 0.8) / this.props.data.length) * i +
                12 * 2
              }
            >
              {`${value} ${c.item.name}`}
            </Text>
          ) : null}
        </G>
      );
    });

    return (
      <View
        style={{
          width: this.props.width,
          height: this.props.height,
          padding: 0,
          ...style
        }}
      >
        <Svg width={this.props.width} height={this.props.height}>
          <G>
            {this.renderDefs({
              width: this.props.height,
              height: this.props.height,
              ...this.props.chartConfig
            })}
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
  }
}

// Generates the "Pie Ring" in order to meet the design spec
// Equivalent of 'Pie' exported from paths.js, will refactor / move later on
export function genPaths(
  data: Array<any>,
  accessor: string,
  center: Array<number>,
  r: number,
  R: number,
  compute
) {
  let values = data.map(item => item[accessor]);
  let s = sum(values);
  // console.log("original sum: ", s.toLocaleString());
  const onepercent = s / 100;
  const threepercent = onepercent * 3;
  // 5% seems like a safe bet for things getting too small to observe
  const THRESHOLD = onepercent * 5;
  let below = (x, t) => {
    return x < t && x > 0;
  };
  // Assuming the 5% from above, let's not pull from a category
  // unless it's got more than 15% so things don't get jacked up
  let above = (x, t) => {
    return x > t * 2.5;
  };
  if (values.some(item => below(item, THRESHOLD))) {
    const belowcount = values.filter(x => below(x, THRESHOLD)).length;
    const safecount = values.filter(x => above(x, THRESHOLD)).length;

    values = values.map(item => {
      if (above(item, THRESHOLD)) {
        // Split the 3% reduction (per outlier) among the available segments
        item -= (threepercent * belowcount) / safecount;
      } else if (below(item, THRESHOLD)) {
        // Add 3% to the outliers
        item += threepercent;
      }
      return item;
    });
  }
  s = s === 0 ? 1 : s;
  let scale = linear([0, s], [0, 2 * Math.PI]);
  let paths = [];
  let t = 0;
  let offset = 0.1;
  data.forEach((item, i) => {
    let value = values[i];
    paths.push(
      enhance(compute, {
        item: item,
        index: i,
        path: Segment({
          center: center,
          r: 0,
          R: 100,
          start: scale(t) + offset,
          end: scale(t + value) - offset
        })
      })
    );
    // Starting point of next segment
    t += value;
  });

  return { paths };
}

// All ripped from paths.js.
// Will clean up / properly import later

export function linear([a, b], [c, d]) {
  let f = x => {
    return c + ((d - c) * (x - a)) / (b - a);
  };

  return f;
}

export function plus([a, b], [c, d]) {
  return [a + c, b + d];
}

export function times(k, [a, b]) {
  return [k * a, k * b];
}

export function onCircle(r, angle) {
  times(r, [Math.sin(angle), -Math.cos(angle)]);
}

export default PieChartRing;
