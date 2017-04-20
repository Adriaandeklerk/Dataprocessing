// create global variable data
var data

// access file
//d3.json("KNMIdata2.json", function(error, json) {
  //if (error) return console.warn(error);
//  data = json;
//});
data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

var chart = d3.select(".chart");
  var bar = chart.selectAll("div");
    var barUpdate = bar.data(data);
  var barEnter = barUpdate.enter().append("div");
    barEnter.style("width", function(d) { return x(d) + "px"; });
    barEnter.text(function(d) { return d; });
    //<script src="barchart.js"></script>
