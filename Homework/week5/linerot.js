// Dataprocessing week 5
// Multiple line chart
// Adriaan de Klerk - 10323929
// Design for a multiseries line graph showing temperatures in two cities

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line1 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.average); });

var line2 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.min); });

var line3 = d3.line()
    .x(function(d) { return x(parseTime(d.date)); })
    .y(function(d) { return y(d.max); });

  // Get the data
  d3.json("rotterdamgoed.json", function(error, data) {
        // For each category, convert string format to numbers
        data.forEach(function(d) {
          d["average"] = +d["average"];
          d["min"] = +d["min"];
          d["max"] = +d["max"];
          return d;
      }, function(error, data) {
        if (error) throw error;})

  x.domain(d3.extent(data, function(d) { return parseTime(d.date); }));
  y.domain(d3.extent([d3.min(data, function(d) { return d.min;}), d3.max(data, function(d) {return d.max;})]));

  // Add the x-axis
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style("font-family", "Georgia")
    .append("text")
    .select(".domain")
      .remove();

    // Add label to x-axis
    svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-family", "Georgia")
      .style("font-size", "10px")
      .text("Months");

    // Add the title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .style("font-family", "Georgia")
        .text("Temperature in Vlissingen and Rotterdam in 2016");

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
      g.append("line")
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
      g.append("line")
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
      g.append("line")
          .style("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("x1", 950)
          .attr("y1", 75)
          .attr("x2", 980)
          .attr("y2", 75);

});
