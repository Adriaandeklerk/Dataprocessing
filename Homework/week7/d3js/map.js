// Dataprocessing week 7
// Design for a linked view d3 map
// Adriaan de Klerk - 10323929
// Sources used:
// https://suffenus.wordpress.com/2014/01/07/making-interactive-maps-with-d3-for-total-beginners/
// set domain colours and legend labels
var colour_domain = [10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 150000000, 200000000]
var labels_legend = ["10 M -", "10 M +", "50 M+", "100 M+", "500 M+", "1 B+", "5 B+", "10 B+", "50 B+", "100 B+", "150 B+"]

var colour = d3.scale.threshold()
    .domain(colour_domain)
    .range(["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"]);

// set dimensions
var width = 900,
    height = 600;

// append tooltip element
var div = d3.select("#chart1").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append svg element for choreopleth
var svg = d3.select("#chart1").append("svg:svg")
    .attr("width", 900)
    .attr("height", 600)
    .call(d3.behavior.zoom().on("zoom", function() {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    }))
    .append("g")
var path = d3.geo.path()


// load data files for US map and data
queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "data2.csv")
    .await(loading);

// function for checking the files and parsing data
function loading(error, us, data) {
    if (error && error.target.status === 404) {
        console.log("File not found")
    }
    if (data.length === 0) {
        console.log("File empty")
    }
    var combineIdEarnings = {};
    var combineIdName = {};
    var combineIdRate = {};
    var combineNumbers = {};
    var combinePop = {};

    data.forEach(function(d) {
        combineIdEarnings[d.id] = +d.earnings;
        combineIdName[d.id] = d.name;
        combineIdRate[d.id] = +d.rate;
        combineNumbers[d.id] = +d.num;
        combinePop[d.id] = +d.population
    });

    // append colours to US counties map
    svg.append("g")
        .attr("class", "county")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
            return colour(combineIdEarnings[d.id]);
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
                .style("top", (d3.event.pageY - 20) + "px");
        })

        // on mouseout reset opacity
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(100)
                .style("opacity", 1);
            div.transition().duration(100)
                .style("opacity", 0);
        })
        // on click begin to draw the barchart
        .on("click", function(d) {
            id = combineNumbers[d.id]
            drawbar(data, id);
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
        .attr("y", function(d, i) {
            return height - (i * legend_height) - 2 * legend_height - 10;
        })
        .attr("width", 20)
        .attr("height", legend_height)
        .style("fill", function(d, i) {
            return colour(d);
        })
        .style("opacity", 0.8);

    // add label descriptions
    legend.append("text")
        .attr("x", 50)
        .attr("y", function(d, i) {
            return height - (i * legend_height) - legend_height - 15;
        })
        .text(function(d, i) {
            return labels_legend[i];

            // NOT WORKING, was meant to update the barchart when selecting a year
            d3.select('#opts')
                .on('change', function() {
                    id = combineNumbers[d.id];
                    var data = data;
                    drawbar(data, id);
                });
        });
};

function drawbar(data, id) {
    // set dimensions
    var margin = {
        top: 10,
        right: 10,
        bottom: 90,
        left: 10
    };
    var width = 500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // set scales for x and y axis
    var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)
    var yScale = d3.scale.linear()
        .range([height, 0]);

    // create x and y axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    // create tooltip element
    var tooltip = d3.select("#chart2").append("div").attr("class", "toolTip");

    // append svg element in page
    var svgContainer = d3.select("#chart2").append("svg:svg")
        .attr("id", "barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("class", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set domains for axis
    xScale.domain(data.map(function(d) {
        return data[id].name;
    }));
    yScale.domain([0, 3000]);

    // append x-axis in chart
    var xAxis_g = svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text");

    // append y-axis in chart
    var yAxis_g = svgContainer.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 2).attr("dy", ".71em")
        .style("text-anchor", "end").text("Number of farms");

    // draw the bars
    svgContainer.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 190)
        .attr("width", 100)
        .attr("y", function(d) {
            return yScale(data[id].rate);
        })
        .attr("height", function(d) {
            return height - yScale(data[id].rate);
        })

        // add mouse interactivity for tooltip
        .on("mousemove", function(d) {
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((data[id].name) + "<br>" + "Total population: " + (data[id].population));
        })
        .on("mouseout", function(d) {
            tooltip.style("display", "none");
        });

    // add farms variable to rect
    svgContainer.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", 240)
        .attr("y", function(d) {
            return yScale(data[id].rate) + 1;
        })
        .attr("dy", ".75em")
        .text(function(d) {
            return data[id].rate;
        });

    // add title to chart
    svgContainer.append("svg:text")
        .attr("class", "title")
        .attr("x", 150)
        .attr("y", 20)
        .text("Total farms per county");
};
