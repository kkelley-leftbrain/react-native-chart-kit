import Path from "paths-js/path";
import { plus, onCircle } from "paths-js/ops";

// Simplified version of path.js Sector, where instead of carving a section
// of a larger circle and filling, we're only concerned with an arc (a/A) command
// on a path generating the pie "crust". This was strictly for design purposes
export default function({ center, r, R, start, end }) {
  const epsilon = 10e-5;
  if (Math.abs(end - 2 * Math.PI) < epsilon) {
    end = 2 * Math.PI - epsilon;
  }

  let a = plus(center, onCircle(R, start));
  let b = plus(center, onCircle(R, end));

  let large = end - start > Math.PI ? 1 : 0;
  let path = Path()
    .moveto(...a)
    .arc(R, R, 0, large, 1, ...b);

  return {
    path: path
  };
}
