import Pie from "paths-js/pie";
import Segment from "./segment";
import Linear from "paths-js/linear";
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
      avoidFalseZero = false
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
      this.props.accessor,
      this.props.center || [0, 0], //center
      this.props.radius || 0, //r
      this.props.height / 2.5, //R
      {}
    );
    const total = this.props.data.reduce((sum, item) => {
      return sum + item[this.props.accessor];
    }, 0);

    console.log("new chart render");
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

    const pathsG = (
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

export function genPaths(
  data: Array<any>,
  accessor: string,
  center: Array<number>,
  r: number,
  R: number,
  compute
) {
  // const accessor = x => x["total"];
  // const data = [
  //   { category: "one", total: 25 },
  //   { category: "two", total: 25 },
  //   { category: "three", total: 25 },
  //   { category: "four", total: 25 }
  // ];
  // console.log("data ", data);
  // console.log("accessor ", accessor);
  let values = data.map(item => item[accessor]);
  console.log("values ", values);
  // const center = [200, 200];
  // const compute = {};
  let s = sum(values);
  const onepercent = s / 100;
  if (values.some(item => item < onepercent * 3)) {
    values = values.map(item => {
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
  let scale = linear([0, s], [0, 2 * Math.PI], 10);
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
          end: scale(t + value) - offset,
          offset: offset
        })
      })
    );
    t += value;
  });

  return { paths };
}

export function linear([a, b], [c, d], offset = 0) {
  let f = x => {
    // console.log("linear x ", x);
    return c + ((d - c) * (x - a)) / (b - a);
  };

  // f.inverse = () => linear([c, d], [a, b])
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
