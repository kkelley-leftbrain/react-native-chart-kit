import Path from "paths-js/path";
import { plus, onCircle } from "paths-js/ops";

export default function({ center, r, R, start, end, offset }) {
  const epsilon = 10e-5;
  if (Math.abs(end - 2 * Math.PI) < epsilon) {
    end = 2 * Math.PI - epsilon;
  }

  const ogstart = start - offset;
  const ogend = end + offset;
  console.log("=============");
  console.log("\t ogstart: ", ogstart);
  console.log("\t ogend: ", ogend);
  console.log("\t\tdifference: ", ogend - ogstart);
  console.log(
    "\t\tpercentage: ",
    ((ogend - ogstart) / (2 * Math.PI)) * 100,
    "%"
  );
  // we need some sort of minimum threshold for display, 3% seems
  // reasonable
  const threshold = ((2 * Math.PI) / 100) * 2;
  console.log(
    "Threshold: ",
    threshold,
    ", ",
    (threshold / (2 * Math.PI)) * 100,
    "%"
  );
  // const difference = end - start;
  // if (difference < threshold) {
  //   end = start + threshold;
  // }
  console.log("-------------");
  console.log("\t start: ", start);
  console.log("\t end: ", end);
  console.log("\t\tdifference: ", end - start);
  console.log("\t\tpercentage: ", ((end - start) / (2 * Math.PI)) * 100, "%");
  console.log("=============");

  let a = plus(center, onCircle(R, start));
  let b = plus(center, onCircle(R, end));
  //   let c = plus(center, onCircle(r, end));
  //   let d = plus(center, onCircle(r, start));

  let large = end - start > Math.PI ? 1 : 0;
  // console.log("r ", r);
  // console.log("R ", R);
  // console.log("center ", center);
  // console.log("start ", start);
  // console.log("end ", end);
  let path = Path()
    .moveto(...a)
    .arc(R, R, 0, large, 1, ...b);
  // .lineto(...c)
  // .arc(r, r, 0, large, 0, ...d)
  // .closepath();

  //   let midAngle = (start + end) / 2;
  //   let midRadius = (r + R) / 2;
  //   let centroid = plus(center, onCircle(midRadius, midAngle));

  return {
    path: path
    // centroid: centroid
  };
}
