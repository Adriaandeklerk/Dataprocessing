// Dataprocessing week 6
// Design for a linked view d3 map
// Adriaan de Klerk - 10323929
// Sources used:
// https://suffenus.wordpress.com/2014/01/07/making-interactive-maps-with-d3-for-total-beginners/

// set domain colours and legend labels
var colour_domain = [10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 150000000, 200000000]
var labels_legend = ["10 M -", "50 M", "100 M", "500 M", "1 B", "5 B", "10 B", "50 B", "100 B", "150 B", "200 B +"]

var colour = d3.scale.threshold()
.domain(colour_domain)
.range(["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]);

// set dimensions
var width = 1060,
    height = 600;

// append tooltip element
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// append svg element for choreopleth
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  var path = d3.geo.path()

// load data files for US map and data
queue()
  .defer(d3.json, "us.json")
  .defer(d3.csv, "data2.csv")
  .await(loading);

// function for checking the files and converting data
function loading(error, us, data) {
  if (error && error.target.status === 404) {
      console.log("File not found")
    }
  if(data.length === 0){
  console.log("File empty")
  }
  var combineIdEarnings = {};
  var combineIdName = {};

data.forEach(function(d) {
  combineIdEarnings[d.id] = +d.earnings;
  combineIdName[d.id] = d.name;
  d["rate"] = +d["rate"];
});

// append colours to US counties map
svg.append("g")
  .attr("class", "county")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.counties).features)
  .enter().append("path")
  .attr("d", path)
  .style ( "fill" , function (d) {
    return colour (combineIdEarnings[d.id]);
  })
  .style("opacity", 1)

// add interactivity on mouseover
  .on("mouseover", function(d) {
  d3.select(this).transition().duration(100).style("opacity", 0.7);
  div.transition().duration(100)
  .style("opacity", 1);

// show tooltip on mouseover
  div.text(combineIdName[d.id] + " : $" + combineIdEarnings[d.id])
  .style("left", (d3.event.pageX) + "px")
  .style("top", (d3.event.pageY -30) + "px");
  })

// on mouseout reset opacity
  .on("mouseout", function() {
  d3.select(this)
  .transition().duration(100)
  .style("opacity", 1);
  div.transition().duration(100)
  .style("opacity", 0);
  })

// add a title to the map
svg.append("svg:text")
       .attr("class", "title")
       .attr("x", 400)
       .attr("y", 20)
       .text("Total earnings(TH$) per U.S. county in 2001");

// add a legend element
var legend = svg.selectAll("g.legend")
  .data(colour_domain)
  .enter().append("g")
  .attr("class", "legend");

var legend_height = 20;

// create legend rects
legend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return height - (i*legend_height) - 2*legend_height - 10;})
  .attr("width", 20)
  .attr("height", legend_height)
  .style("fill", function(d, i) { return colour(d); })
  .style("opacity", 0.8);

// add label descriptions
legend.append("text")
  .attr("x", 50)
  .attr("y", function(d, i){ return height - (i*legend_height) - legend_height - 15;})
  .text(function(d, i){ return labels_legend[i];

// add title
legend.append("text")
  .attr("x", 50)
  .attr("y", 100)
  .text("Legend:")

  // set dimensions for scatterplot
  var margin = {top: 30, right: 30, bottom: 40, left: 50},
      width = 1400 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set x value and axis
  var xValue = function(d) { return d.earnings;},
      xScale = d3.scale.linear().range([0, width]),
      xMap = function(d) { return xScale(xValue(d));},
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // set y value and axis
  var yValue = function(d) { return d["rate"];},
      yScale = d3.scale.linear().range([height, 0]),
      yMap = function(d) { return yScale(yValue(d));},
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  var cValue = function(d) { return d.rate;},
  color = d3.scale.category10();

  var svg2 = d3.select("#container").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
  .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // create tooltip element
  var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  // scale x and y axis with data
  xScale.domain([d3.min(data, xValue)-5000, d3.max(data, xValue)+20]);
  yScale.domain([d3.min(data, yValue)-400, d3.max(data, yValue)]);

  // create x-axis
  svg2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Total earnings 2001");

  // create y-axis
  svg2.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 8)
          .attr("dy", ".75em")
          .style("text-anchor", "end")
          .text("Amount of farms")

  // append data to scatterplot
  svg2.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 5)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cValue(d));})

          // add mouse interactivity and tooltip
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(100)
                   .style("opacity", 1);
              tooltip.html(d["name"] + ": <br/> " +
              "Total earnings: $" + xValue(d) + ", Amount of farms: " + yValue(d))
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(100)
                   .style("opacity", 0);
                 });
               });
             };
