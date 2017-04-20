// load in data set
var dataset = [3659, 10373, 13162, 5704];

// width and height
var svgWidth = 500;
var svgHeight = 500;
var barPadding = 1

var xScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d[0]; })])
								 .range([barPadding, svgWidth - barPadding * 2]);

var yScale = d3.scale.linear()
					 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
					 .range([svgHeight - barPadding, barPadding]);

var rScale = d3.scale.linear()
					 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
					 .range([2, 5]);

//Define X axis
var xAxis = d3.svg.axis()
				  .scale(xScale)
				  .orient("bottom");

//Create SVG element
var svg = d3.select("body")
			.append("svg")
			.attr("width", svgWidth)
			.attr("height", svgHeight);

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
    return svgHeight - d / 50;
    })
   .attr("width", svgWidth / dataset.length - barPadding)
   .attr("height", function (d) {
     return d;
    })
    .attr("fill", function(d) {
    return "rgb(0, 0, " + (d * 1) + ")";
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
        return i * (svgWidth / dataset.length) + 45;
   })
   .attr("text-anchor", "middle")
   .attr("y", function(d) {
        return svgHeight - (d / 60);
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");
