/* Dataprocessing week 3
Name: Adriaan de Klerk
10323929
Design for a bar chart in d3 */

// load in data set
var dataset = [3659, 10373, 13162, 5704]

// width and height
margin = {top: 20, right: 20, bottom: 20, left: 50}
var svgWidth = 500;
var svgHeight = 500;
var barPadding = 1;

// set domain and range for x and y axis
var xScale = d3.scale.ordinal()
       .domain(["Social housing", "Private rental", "Owner-occupied", "Student housing"])
       .rangePoints([0, svgWidth]);

var yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) { return d[1]; })])
      .range([0, svgHeight]);

// create tooltip element
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// create an svg element in page
var svg = d3.select("body").append("svg")
    .attr("width", svgWidth + margin.left + margin.right)
    .attr("height", svgHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// initiate the axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// create axes
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + svgHeight + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Housing production");

// create the bars
svg.selectAll("rect")
   .data(dataset)
  .enter().append("rect")
  .attr("x", function(d, i) {
     return i * (svgWidth / dataset.length)
     })
  .attr("y", function(d) {
     return svgHeight - d / 60;
     })
  .attr("width", svgWidth / dataset.length - barPadding)
  .attr("height", function (d) {
    return d;
   })
  .attr("class", "bar")

  // show tooltip when mouse is moved on a bar in the chart
    .on("mousemove", function(d){
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html(d + " housing units", function (dataset, i) {
          return dataset[i]
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");
      });
});
