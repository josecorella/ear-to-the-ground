var b_margin = { top: 20, right: 20, bottom: 50, left: 100 },
  b_width = 800 - b_margin.left - b_margin.right,
  b_height = 700 - b_margin.top - b_margin.bottom;

var hoverColor = "#eec42d";
var staticColor = "rgb(30,215,96)";

var canvas = d3
  .select("#breakdown")
  .attr("width", 1000)
  .attr("height", b_height + b_margin.top + b_margin.bottom)
  .attr("transform", "translate(" + 150 + "," + b_margin.top + ")")
  .append("g")
  .attr("transform", "translate(" + 10 + "," + b_margin.top + ")");

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "d3-tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("padding", "10px")
  .style("background", "rgba(0,0,0,0.6)")
  .style("border-radius", "4px")
  .style("color", "#fff");

var parseTime = d3.timeParse("%Y%m%d");
var formatTime = d3.timeFormat("%B %e");

var color = d3
  .scaleOrdinal()
  .domain([
    "Levitating (feat. DaBaby) by Dua Lipa",
    "Peaches (feat. Daniel Caesar & Giveon) by Justin Bieber",
    "Leave The Door Open by Bruno Mars Anderson .Paak Silk Sonic",
  ])
  .range(["#20d4d4", "#1ed760 ", "#1e48d4"]);
var opacity = d3.scaleLinear().domain([5, 10]).range([0.8, 1]);

d3.csv("./data/breakdown.csv").then(function (data) {
  var root = d3
    .stratify()
    .id(function (d) {
      return d.name;
    })
    .parentId(function (d) {
      return d.parent;
    })(data);
  root.sum(function (d) {
    if (d.song !== "") {
      return +d.name;
    }
  });

  d3.treemap().size([b_width, b_height]).padding(3)(root);

  canvas
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return d.x0;
    })
    .attr("y", function (d) {
      return d.y0;
    })
    .attr("width", function (d) {
      return d.x1 - d.x0;
    })
    .attr("height", function (d) {
      return d.y1 - d.y0;
    })
    .style("stroke", "white")
    .style("fill", function (d) {
      return color(d.data.song);
    })
    .style("opacity", function (d) {
      console.log(d.value / 1000000);
      return opacity(d.value / 1000000);
    })
    .on("mouseover", function (event, i) {
      nfObject = new Intl.NumberFormat("en-US");
      tooltip
        .html(
          `<div>Day: ${formatTime(
            parseTime(i.data.parent)
          )}</div><div>Streams: ${nfObject.format(i.value)}</div>`
        )
        .style("visibility", "visible");
      d3.select(this).transition().attr("fill", hoverColor);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function (event, i) {
      tooltip.html(``).style("visibility", "hidden");
      d3.select(this).transition().attr("fill", staticColor);
    });
  canvas
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 5;
    })
    .attr("y", function (d) {
      return d.y0 + 10;
    })
    .text(function (d) {
      return formatTime(parseTime(d.data.parent));
    })
    .attr("font-size", "6px")
    .attr("fill", "black");
  canvas
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(700,20)")
    .attr("fill", "white");

  var legend = d3.legendColor().title("Songs").titleWidth(100).scale(color);

  canvas.select(".legend").call(legend);
});
