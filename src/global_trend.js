var margin = { top: 20, right: 20, bottom: 50, left: 100 },
  width = 1000 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

var svg = d3
  .select("#line-graph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + 250 + "," + margin.top + ")")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

var parseTime = d3.timeParse("%Y%m%d");
var formatTime = d3.timeFormat("%B %e");

var xAxis = d3.scaleTime().range([0, width]);
var yAxis = d3.scaleLinear().range([height, 0]);

var valueline = d3
  .line()
  .x(function (d) {
    return xAxis(d.date);
  })
  .y(function (d) {
    return yAxis(d.streams);
  });

d3.csv("./data/april2021_global.csv").then(function (data) {
  data.forEach(function (d) {
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

  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)
    .attr("fill", "none")
    .attr("stroke", "rgb(30, 215, 96)")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 3);

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
          `<div>Day: ${formatTime(d.date)}</div><div>Streams: ${nfObject.format(
            d.streams
          )}</div>`
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
});
