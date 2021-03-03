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
export default function(_a) {
  var _b, _c;
  var center = _a.center,
    r = _a.r,
    R = _a.R,
    start = _a.start,
    end = _a.end,
    offset = _a.offset;
  var epsilon = 10e-5;
  if (Math.abs(end - 2 * Math.PI) < epsilon) {
    end = 2 * Math.PI - epsilon;
  }
  // const ogstart = start - offset;
  // const ogend = end + offset;
  // console.log("=============");
  // console.log("\t ogstart: ", ogstart);
  // console.log("\t ogend: ", ogend);
  // console.log("\t\tdifference: ", ogend - ogstart);
  // console.log(
  //   "\t\tpercentage: ",
  //   ((ogend - ogstart) / (2 * Math.PI)) * 100,
  //   "%"
  // );
  // we need some sort of minimum threshold for display, 3% seems
  // reasonable
  // const threshold = ((2 * Math.PI) / 100) * 2;
  // console.log(
  //   "Threshold: ",
  //   threshold,
  //   ", ",
  //   (threshold / (2 * Math.PI)) * 100,
  //   "%"
  // );
  // const difference = end - start;
  // if (difference < threshold) {
  //   end = start + threshold;
  // }
  // console.log("-------------");
  // console.log("\t start: ", start);
  // console.log("\t end: ", end);
  // console.log("\t\tdifference: ", end - start);
  // console.log("\t\tpercentage: ", ((end - start) / (2 * Math.PI)) * 100, "%");
  // console.log("=============");
  var a = plus(center, onCircle(R, start));
  var b = plus(center, onCircle(R, end));
  //   let c = plus(center, onCircle(r, end));
  //   let d = plus(center, onCircle(r, start));
  var large = end - start > Math.PI ? 1 : 0;
  // console.log("r ", r);
  // console.log("R ", R);
  // console.log("center ", center);
  // console.log("start ", start);
  // console.log("end ", end);
  var path = (_b = (_c = Path()).moveto.apply(_c, a)).arc.apply(
    _b,
    __spreadArrays([R, R, 0, large, 1], b)
  );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VnbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZWdtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxPQUFPLElBQUksTUFBTSxlQUFlLENBQUM7QUFDakMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFOUMsTUFBTSxDQUFDLE9BQU8sV0FBVSxFQUFvQzs7UUFBbEMsTUFBTSxZQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsQ0FBQyxPQUFBLEVBQUUsS0FBSyxXQUFBLEVBQUUsR0FBRyxTQUFBLEVBQUUsTUFBTSxZQUFBO0lBQ3hELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN0QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFO1FBQ3pDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7S0FDN0I7SUFFRCxrQ0FBa0M7SUFDbEMsOEJBQThCO0lBQzlCLGdDQUFnQztJQUNoQyx3Q0FBd0M7SUFDeEMsb0NBQW9DO0lBQ3BDLG9EQUFvRDtJQUNwRCxlQUFlO0lBQ2Ysd0JBQXdCO0lBQ3hCLCtDQUErQztJQUMvQyxRQUFRO0lBQ1IsS0FBSztJQUNMLCtEQUErRDtJQUMvRCxhQUFhO0lBQ2IsK0NBQStDO0lBQy9DLGVBQWU7SUFDZixtQkFBbUI7SUFDbkIsZUFBZTtJQUNmLFVBQVU7SUFDVix1Q0FBdUM7SUFDdkMsUUFBUTtJQUNSLEtBQUs7SUFDTCxrQ0FBa0M7SUFDbEMsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUM3QixJQUFJO0lBQ0osZ0NBQWdDO0lBQ2hDLG9DQUFvQztJQUNwQyxnQ0FBZ0M7SUFDaEMsZ0RBQWdEO0lBQ2hELCtFQUErRTtJQUMvRSxnQ0FBZ0M7SUFFaEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkMsNENBQTRDO0lBQzVDLDhDQUE4QztJQUU5QyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLHdCQUF3QjtJQUN4Qix3QkFBd0I7SUFDeEIsa0NBQWtDO0lBQ2xDLGdDQUFnQztJQUNoQyw0QkFBNEI7SUFDNUIsSUFBSSxJQUFJLEdBQUcsQ0FBQSxLQUFBLENBQUEsS0FBQSxJQUFJLEVBQUUsQ0FBQSxDQUNkLE1BQU0sV0FBSSxDQUFDLENBQUMsQ0FBQSxDQUNaLEdBQUcsMkJBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBSyxDQUFDLEVBQUMsQ0FBQztJQUNoQyxnQkFBZ0I7SUFDaEIsZ0NBQWdDO0lBQ2hDLGdCQUFnQjtJQUVoQixzQ0FBc0M7SUFDdEMsaUNBQWlDO0lBQ2pDLGdFQUFnRTtJQUVoRSxPQUFPO1FBQ0wsSUFBSSxFQUFFLElBQUk7UUFDVixxQkFBcUI7S0FDdEIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGF0aCBmcm9tIFwicGF0aHMtanMvcGF0aFwiO1xuaW1wb3J0IHsgcGx1cywgb25DaXJjbGUgfSBmcm9tIFwicGF0aHMtanMvb3BzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHsgY2VudGVyLCByLCBSLCBzdGFydCwgZW5kLCBvZmZzZXQgfSkge1xuICBjb25zdCBlcHNpbG9uID0gMTBlLTU7XG4gIGlmIChNYXRoLmFicyhlbmQgLSAyICogTWF0aC5QSSkgPCBlcHNpbG9uKSB7XG4gICAgZW5kID0gMiAqIE1hdGguUEkgLSBlcHNpbG9uO1xuICB9XG5cbiAgLy8gY29uc3Qgb2dzdGFydCA9IHN0YXJ0IC0gb2Zmc2V0O1xuICAvLyBjb25zdCBvZ2VuZCA9IGVuZCArIG9mZnNldDtcbiAgLy8gY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpO1xuICAvLyBjb25zb2xlLmxvZyhcIlxcdCBvZ3N0YXJ0OiBcIiwgb2dzdGFydCk7XG4gIC8vIGNvbnNvbGUubG9nKFwiXFx0IG9nZW5kOiBcIiwgb2dlbmQpO1xuICAvLyBjb25zb2xlLmxvZyhcIlxcdFxcdGRpZmZlcmVuY2U6IFwiLCBvZ2VuZCAtIG9nc3RhcnQpO1xuICAvLyBjb25zb2xlLmxvZyhcbiAgLy8gICBcIlxcdFxcdHBlcmNlbnRhZ2U6IFwiLFxuICAvLyAgICgob2dlbmQgLSBvZ3N0YXJ0KSAvICgyICogTWF0aC5QSSkpICogMTAwLFxuICAvLyAgIFwiJVwiXG4gIC8vICk7XG4gIC8vIHdlIG5lZWQgc29tZSBzb3J0IG9mIG1pbmltdW0gdGhyZXNob2xkIGZvciBkaXNwbGF5LCAzJSBzZWVtc1xuICAvLyByZWFzb25hYmxlXG4gIC8vIGNvbnN0IHRocmVzaG9sZCA9ICgoMiAqIE1hdGguUEkpIC8gMTAwKSAqIDI7XG4gIC8vIGNvbnNvbGUubG9nKFxuICAvLyAgIFwiVGhyZXNob2xkOiBcIixcbiAgLy8gICB0aHJlc2hvbGQsXG4gIC8vICAgXCIsIFwiLFxuICAvLyAgICh0aHJlc2hvbGQgLyAoMiAqIE1hdGguUEkpKSAqIDEwMCxcbiAgLy8gICBcIiVcIlxuICAvLyApO1xuICAvLyBjb25zdCBkaWZmZXJlbmNlID0gZW5kIC0gc3RhcnQ7XG4gIC8vIGlmIChkaWZmZXJlbmNlIDwgdGhyZXNob2xkKSB7XG4gIC8vICAgZW5kID0gc3RhcnQgKyB0aHJlc2hvbGQ7XG4gIC8vIH1cbiAgLy8gY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tXCIpO1xuICAvLyBjb25zb2xlLmxvZyhcIlxcdCBzdGFydDogXCIsIHN0YXJ0KTtcbiAgLy8gY29uc29sZS5sb2coXCJcXHQgZW5kOiBcIiwgZW5kKTtcbiAgLy8gY29uc29sZS5sb2coXCJcXHRcXHRkaWZmZXJlbmNlOiBcIiwgZW5kIC0gc3RhcnQpO1xuICAvLyBjb25zb2xlLmxvZyhcIlxcdFxcdHBlcmNlbnRhZ2U6IFwiLCAoKGVuZCAtIHN0YXJ0KSAvICgyICogTWF0aC5QSSkpICogMTAwLCBcIiVcIik7XG4gIC8vIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTtcblxuICBsZXQgYSA9IHBsdXMoY2VudGVyLCBvbkNpcmNsZShSLCBzdGFydCkpO1xuICBsZXQgYiA9IHBsdXMoY2VudGVyLCBvbkNpcmNsZShSLCBlbmQpKTtcbiAgLy8gICBsZXQgYyA9IHBsdXMoY2VudGVyLCBvbkNpcmNsZShyLCBlbmQpKTtcbiAgLy8gICBsZXQgZCA9IHBsdXMoY2VudGVyLCBvbkNpcmNsZShyLCBzdGFydCkpO1xuXG4gIGxldCBsYXJnZSA9IGVuZCAtIHN0YXJ0ID4gTWF0aC5QSSA/IDEgOiAwO1xuICAvLyBjb25zb2xlLmxvZyhcInIgXCIsIHIpO1xuICAvLyBjb25zb2xlLmxvZyhcIlIgXCIsIFIpO1xuICAvLyBjb25zb2xlLmxvZyhcImNlbnRlciBcIiwgY2VudGVyKTtcbiAgLy8gY29uc29sZS5sb2coXCJzdGFydCBcIiwgc3RhcnQpO1xuICAvLyBjb25zb2xlLmxvZyhcImVuZCBcIiwgZW5kKTtcbiAgbGV0IHBhdGggPSBQYXRoKClcbiAgICAubW92ZXRvKC4uLmEpXG4gICAgLmFyYyhSLCBSLCAwLCBsYXJnZSwgMSwgLi4uYik7XG4gIC8vIC5saW5ldG8oLi4uYylcbiAgLy8gLmFyYyhyLCByLCAwLCBsYXJnZSwgMCwgLi4uZClcbiAgLy8gLmNsb3NlcGF0aCgpO1xuXG4gIC8vICAgbGV0IG1pZEFuZ2xlID0gKHN0YXJ0ICsgZW5kKSAvIDI7XG4gIC8vICAgbGV0IG1pZFJhZGl1cyA9IChyICsgUikgLyAyO1xuICAvLyAgIGxldCBjZW50cm9pZCA9IHBsdXMoY2VudGVyLCBvbkNpcmNsZShtaWRSYWRpdXMsIG1pZEFuZ2xlKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwYXRoOiBwYXRoXG4gICAgLy8gY2VudHJvaWQ6IGNlbnRyb2lkXG4gIH07XG59XG4iXX0=
