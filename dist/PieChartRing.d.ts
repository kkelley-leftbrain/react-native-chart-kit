/// <reference types="react" />
import { ViewStyle } from "react-native";
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
declare type PieChartState = {};
declare class PieChartRing extends AbstractChart<PieChartProps, PieChartState> {
  render(): JSX.Element;
}
export declare function genPaths(
  data: Array<any>,
  accessor: string,
  center: Array<number>,
  r: number,
  R: number,
  compute: any
): {
  paths: any[];
};
export declare function linear(
  [a, b]: [any, any],
  [c, d]: [any, any],
  offset?: number
): (x: any) => any;
export declare function plus([a, b]: [any, any], [c, d]: [any, any]): any[];
export declare function times(k: any, [a, b]: [any, any]): number[];
export declare function onCircle(r: any, angle: any): void;
export default PieChartRing;
//# sourceMappingURL=PieChartRing.d.ts.map
