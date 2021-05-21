var margin = { top: 20, right: 20, bottom: 50, left: 100 },
  width = 1000 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

// setting up canvas
var svg = d3
  .select("#line-graph")
  .attr("width", 1200)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + 100 + "," + margin.top + ")")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// settinng up tooltip
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "line-tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("padding", "10px")
  .style("background", "rgba(0,0,0,0.6)")
  .style("border-radius", "4px")
  .style("color", "#fff");

// for converting time stamp
var parseTime = d3.timeParse("%Y%m%d");
// for formating timestamp for only month and day
var formatTime = d3.timeFormat("%B %e");

// X Axis that goes the width of the svg
var xAxis = d3.scaleTime().range([0, width]);
// Y Axis that goes the height of the svg
var yAxis = d3.scaleLinear().range([height, 0]);

// line variable for connecting all the dots
var valueline = d3
  .line()
  .x(function (d) {
    return xAxis(d.date);
  })
  .y(function (d) {
    return yAxis(d.streams);
  });

// read csv file
d3.csv("./data/april2021_global.csv", function (d) {
  return d;
}).then(function (data) {
  // groups all the data by song in order to have miltiple lines
  var sumstat = d3.group(data, (d) => d.song);
  // Although i have saved the data in the group this will be helpful for the tooltip
  data.forEach(function (d) {
    d.song = d.song;
    d.date = parseTime(d.date);
    d.streams = +d.streams;
  });

  xAxis.domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );
  yAxis.domain([
    0,
    d3.max(data, function (d) {
      return d.streams;
    }),
  ]);

  // adss path for all three lines
  svg
    .selectAll("path")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", "rgb(30, 215, 96)")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 3)
    .attr("d", (d) => {
      return d3
        .line()
        .x((d) => xAxis(d.date)) //so the connection goes to the right place in the x axis
        .y((d) => yAxis(+d.streams))(d[1]); //so the connection goes to the right place in the y axis
    });

  // adds dots to all the connections in order to add tooltips
  svg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function (d) {
      return xAxis(d.date);
    })
    .attr("cy", function (d) {
      return yAxis(d.streams);
    })
    .style("fill", "white")
    .on("mouseover", function (event, d) {
      nfObject = new Intl.NumberFormat("en-US");
      tooltip
        .html(
          `<div>Song: ${d.song}</div><div>Day: ${formatTime(
            d.date
          )}</div><div>Streams: ${nfObject.format(d.streams)}</div>`
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px")
        .style("visibility", "visible");
    })
    .on("mouseout", function () {
      tooltip.html(``).style("visibility", "hidden");
    });

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("stroke", "white")
    .call(d3.axisBottom(xAxis))
    .style("color", "white")
    .style("font-size", "14px");

  svg
    .append("g")
    .attr("stroke", "white")
    .call(d3.axisLeft(yAxis))
    .style("font-size", "14px")
    .style("color", "white")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("font-size", "14px")
    .style("text-anchor", "end")
    .attr("fill", "white")
    .text("Number of Streams");

  // adds a text label for the each of the lines and places them at the rightmost point
  svg
    .append("text")
    .attr("transform", "translate(" + (width + 10) + "," + 100 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("font-size", "14px")
    .attr("fill", "white")
    .text("Peaches");
  svg
    .append("text")
    .attr("transform", "translate(" + (width + 10) + "," + 270 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("font-size", "14px")
    .attr("fill", "white")
    .text("Levitating");
  svg
    .append("text")
    .attr("transform", "translate(" + (width + 10) + "," + 310 + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("font-size", "14px")
    .attr("fill", "white")
    .text("Leave The Door Open");
});
