var dataset = [3659, 10373, 13162, 5704]

d3.select("body").selectAll("p")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
      var barHeight = d * 5;
      return barHeight + "px";
    });
