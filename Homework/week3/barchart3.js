// load in data set
var dataset = [3659, 10373, 13162, 5704];

// width and height
var svgWidth = 500;
var svgHeight = 100;
var barPadding = 1

// create an svg element in page
var svg = d3.select("body")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")

   .attr("x", function(d, i) {
    return i * (svgWidth / dataset.length)
    })
   .attr("y", function(d) {
    return svgHeight - d / 150;
    })
   .attr("width", svgWidth / dataset.length - barPadding)
   .attr("height", function (d) {
     return d;
    });

// KLEUR TOEVOEGEN

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d){
     return d;
   })
   .attr("x", function(d, i) {
        return i * (svgWidth / dataset.length) + 40;
   })
   .attr("y", function(d) {
        return svgHeight - (d / 150);
   });
