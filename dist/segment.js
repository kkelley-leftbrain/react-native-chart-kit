var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import Path from "paths-js/path";
import { plus, onCircle } from "paths-js/ops";
// Simplified version of path.js Sector, where instead of carving a section
// of a larger circle and filling, we're only concerned with an arc (a/A) command
// on a path generating the pie "crust". This was strictly for design purposes
export default function(_a) {
  var _b, _c;
  var center = _a.center,
    r = _a.r,
    R = _a.R,
    start = _a.start,
    end = _a.end;
  var epsilon = 10e-5;
  if (Math.abs(end - 2 * Math.PI) < epsilon) {
    end = 2 * Math.PI - epsilon;
  }
  var a = plus(center, onCircle(R, start));
  var b = plus(center, onCircle(R, end));
  var large = end - start > Math.PI ? 1 : 0;
  var path = (_b = (_c = Path()).moveto.apply(_c, a)).arc.apply(
    _b,
    __spreadArrays([R, R, 0, large, 1], b)
  );
  return {
    path: path
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxlQUFlLENBQUM7QUFDakMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFOUMsMkVBQTJFO0FBQzNFLGlGQUFpRjtBQUNqRiw4RUFBOEU7QUFDOUUsTUFBTSxDQUFDLE9BQU8sV0FBVSxFQUE0Qjs7UUFBMUIsTUFBTSxZQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsS0FBSyxXQUFBLEVBQUUsR0FBRyxTQUFBO0lBQ2hELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN0QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFO1FBQ3pDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7S0FDN0I7SUFFRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2QyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLElBQUksSUFBSSxHQUFHLENBQUEsS0FBQSxDQUFBLEtBQUEsSUFBSSxFQUFFLENBQUEsQ0FDZCxNQUFNLFdBQUksQ0FBQyxDQUFDLENBQUEsQ0FDWixHQUFHLDJCQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUssQ0FBQyxFQUFDLENBQUM7SUFFaEMsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJO0tBQ1gsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGF0aCBmcm9tIFwicGF0aHMtanMvcGF0aFwiO1xuaW1wb3J0IHsgcGx1cywgb25DaXJjbGUgfSBmcm9tIFwicGF0aHMtanMvb3BzXCI7XG5cbi8vIFNpbXBsaWZpZWQgdmVyc2lvbiBvZiBwYXRoLmpzIFNlY3Rvciwgd2hlcmUgaW5zdGVhZCBvZiBjYXJ2aW5nIGEgc2VjdGlvblxuLy8gb2YgYSBsYXJnZXIgY2lyY2xlIGFuZCBmaWxsaW5nLCB3ZSdyZSBvbmx5IGNvbmNlcm5lZCB3aXRoIGFuIGFyYyAoYS9BKSBjb21tYW5kXG4vLyBvbiBhIHBhdGggZ2VuZXJhdGluZyB0aGUgcGllIFwiY3J1c3RcIi4gVGhpcyB3YXMgc3RyaWN0bHkgZm9yIGRlc2lnbiBwdXJwb3Nlc1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeyBjZW50ZXIsIHIsIFIsIHN0YXJ0LCBlbmQgfSkge1xuICBjb25zdCBlcHNpbG9uID0gMTBlLTU7XG4gIGlmIChNYXRoLmFicyhlbmQgLSAyICogTWF0aC5QSSkgPCBlcHNpbG9uKSB7XG4gICAgZW5kID0gMiAqIE1hdGguUEkgLSBlcHNpbG9uO1xuICB9XG5cbiAgbGV0IGEgPSBwbHVzKGNlbnRlciwgb25DaXJjbGUoUiwgc3RhcnQpKTtcbiAgbGV0IGIgPSBwbHVzKGNlbnRlciwgb25DaXJjbGUoUiwgZW5kKSk7XG5cbiAgbGV0IGxhcmdlID0gZW5kIC0gc3RhcnQgPiBNYXRoLlBJID8gMSA6IDA7XG4gIGxldCBwYXRoID0gUGF0aCgpXG4gICAgLm1vdmV0byguLi5hKVxuICAgIC5hcmMoUiwgUiwgMCwgbGFyZ2UsIDEsIC4uLmIpO1xuXG4gIHJldHVybiB7XG4gICAgcGF0aDogcGF0aFxuICB9O1xufVxuIl19
