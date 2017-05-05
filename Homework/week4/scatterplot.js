// Adriaan de Klerk - 10323929
//
// Dataprocessing week 4
// Design for a scatterplot using d3
//
// Scatterplot displaying GDP per capita, inflation and
// population of the largest city of a country.


// Create dimensions for the scatterplot
var margin = {top: 30, right: 30, bottom: 40, left: 50},
    width = 1400 - margin.left - margin.right,
    height = 768 - margin.top - margin.bottom;

    // Set x value to GDP per capita
    var xValue = function(d) { return d.GDP;},
        xScale = d3.scale.linear().range([0, width]),
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // Set y value to inflation level
    var yValue = function(d) { return d["Inflation"];},
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // Set colour depending on population data
    var cValue = function(d) { return d.Population;},
        color = d3.scale.category10();

    // Create SVG element for chart in the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Create tooltip element
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load the CSV file
    d3.csv("dataworldbankCSV.csv", function(error, data) {

      // For each category, convert string format to numbers
      data.forEach(function(d) {
        d["Inflation"] = +d["Inflation"];
        d["GDP"] = +d["GDP"];
        d["Population"] = +d["Population"];
      });

      // Scale the data so circles don't overlap with axes
      xScale.domain([d3.min(data, xValue)-5000, d3.max(data, xValue)+20]);
      yScale.domain([d3.min(data, yValue)-4, d3.max(data, yValue)+1]);

      // Create x axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("GDP per capita");

      // Create y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 8)
          .attr("dy", ".75em")
          .style("text-anchor", "end")
          .text("Inflation");

       // Add a title to chart
       svg.append("svg:text")
  		   .attr("class", "title")
  	   .attr("x", 20)
  	   .attr("y", 0)
  	   .text("Scatterplot GDP, inflation and biggest city per country");

      // Create the dots in scatterplot and have circles scale with third
      // variable (population of largest city)
      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", function(d) {
              return d["Population"]/500000})
          .attr("cx", xMap)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cValue(d));})
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", 1);
              tooltip.html(d["Country"] + "<br/> " +
              "GDP per capita: $" + xValue(d) + ", Inflation: " + yValue(d)
              + "<br/>" + "Population largest city: "  + d["Population"])
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });
      });
