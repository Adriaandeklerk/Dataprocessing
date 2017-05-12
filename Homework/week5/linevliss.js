// Dataprocessing week 5
// Multiple line chart
// Adriaan de Klerk - 10323929
// Design for a multiseries line graph showing temperatures in two cities

// Set dimensions for svg element
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create timeParse variable to format dates
var parseTime = d3.timeParse("%Y%m%d")

// Scale x and y axis
var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

// Define lines and corresponding data
var line1 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.average); });

var line2 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.min); });

var line3 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.max); });

// Create tooltip element
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "#000")

  // Load the json file
  d3.json("vlissingengoed.json", function(error, data) {
        // For each category, convert string format to numbers
        data.forEach(function(d) {
          d["average"] = +d["average"];
          d["min"] = +d["min"];
          d["max"] = +d["max"];
          return d;
      }, function(error, data) { // Check for errors
        if (error) throw error;})

  // Scale domains with data set
  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y.domain(d3.extent([d3.min(data, function(d) { return d.min;}), d3.max(data, function(d) {return d.max;})]));

  // Add the x-axis
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style("font-family", "Georgia")
    .append("text")

    // Add label to x-axis
    svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-family", "Georgia")
      .style("font-size", "10px")
      .text("Months");

  // Add y-axis
  g.append("g")
      .call(d3.axisLeft(y))
      .style("font-family", "Georgia")
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Temperature in ºC(0,1)");
     
      // Add the title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .style("font-family", "Georgia")
        .text("Temperature in Vlissingen and Rotterdam in 2016");

  // Draw different lines for average, min and max temperature
  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1);

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line2);

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line3);

// Make a legend for the different lines
      svg.append("text")
                 .attr("x", 1050)
                 .attr("y", 35)
                 .attr("class", "legend")
                 .style("font-weight", "bold")
                 .text("Legend:");
      
      svg.append("text")
                .attr("x", 1050)
                .attr("y", 60)
                .attr("class", "legend")
                .text("Maximum temperature");
      svg.append("line")
          .style("stroke", "red")
          .attr("stroke-width", 1.5)
          .attr("x1", 950)
          .attr("y1", 35)
          .attr("x2", 980)
          .attr("y2", 35);

      svg.append("text")
                .attr("x", 1050)
                .attr("y", 80)
                .text("Average temperature");
      svg.append("line")
          .style("stroke", "orange")
          .attr("stroke-width", 1.5)
          .attr("x1", 950)
          .attr("y1", 55)
          .attr("x2", 980)
          .attr("y2", 55);

      svg.append("text")
                .attr("x", 1050)
                .attr("y", 100)
                .text("Minimum temperature");
      svg.append("line")
          .style("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("x1", 950)
          .attr("y1", 75)
          .attr("x2", 980)
          .attr("y2", 75);

      // Add focus for tooltip
      var focus = g.append("g")
          .attr("class", "focus")
          .style("display", "none");

      // Create a line that follows hovering tooltip
      focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
          .attr("y2", height);

      focus.append("line")
          .attr("class", "y-hover-line hover-line")
          .attr("x1", width)
          .attr("x2", width);

      // Add a circle that is placed on the mouselocation
      focus.append("circle")
          .attr("r", 7.5);

      focus.append("text")
          .attr("x", 15)
        	.attr("dy", ".31em");

      // Add a rect on top of the graphs with mouse interactivity
      svg.append("rect")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

      // Function that should return the tooltip when mouse is placed on
      // the element (but is not working)
      function mousemove() {
        focus.select("text").text(function(d) { return d.average; });
        focus.select(".x-hover-line").attr("y2", height - y(d.average));
        focus.select(".y-hover-line").attr("x2", width + width);
      }

});
