var b_margin = { top: 20, right: 20, bottom: 50, left: 100 },
  b_width = 800 - b_margin.left - b_margin.right,
  b_height = 700 - b_margin.top - b_margin.bottom;

var hoverColor = "#eec42d";
var staticColor = "rgb(30,215,96)";

var canvas = d3
  .select("#dua_breakdown")
  .attr("width", b_width + b_margin.left + b_margin.right)
  .attr("height", b_height + b_margin.top + b_margin.bottom)
  .attr("transform", "translate(" + -75 + "," + b_margin.top + ")")
  .append("g")
  .attr("transform", "translate(" + b_margin.left + "," + b_margin.top + ")");

var canvas2 = d3
  .select("#bieber_breakdown")
  .attr("width", b_width + b_margin.left + b_margin.right)
  .attr("height", b_height + b_margin.top + b_margin.bottom)
  .attr("transform", "translate(" + 675 + "," + -678 + ")")
  .append("g")
  .attr("transform", "translate(" + b_margin.left + "," + b_margin.top + ")");

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

d3.csv("./data/dua_breakdown.csv").then(function (data) {
  var root = d3
    .stratify()
    .id(function (d) {
      return d.name;
    })
    .parentId(function (d) {
      return d.parent;
    })(data);
  root.sum(function (d) {
    return +d.streams;
  });

  d3.treemap().size([b_width, b_height]).padding(4)(root);

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
    .style("fill", "rgb(30,215,96)")
    .on("mouseover", function (event, i) {
      nfObject = new Intl.NumberFormat("en-US");
      tooltip
        .html(
          `<div>Day: ${formatTime(
            parseTime(i.id)
          )}</div><div>Streams: ${nfObject.format(i.value)}</div>`
        )
        .style("visibility", "visible");
      d3.select(this).attr("fill", hoverColor);
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
      return d.x0 + 10;
    })
    .attr("y", function (d) {
      return d.y0 + 20;
    })
    .text(function (d) {
      return formatTime(parseTime(d.data.name));
    })
    .attr("font-size", "12px")
    .attr("fill", "black");

  canvas
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(325, 650)")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("stroke", "white")
    .attr("fill", "white")
    .text("Levitating by Dua Lipa");
});

d3.csv("./data/bruno_breakdown.csv").then(function (data) {
  var root = d3
    .stratify()
    .id(function (d) {
      return d.name;
    })
    .parentId(function (d) {
      return d.parent;
    })(data);
  root.sum(function (d) {
    return +d.streams;
  });

  d3.treemap().size([b_width, b_height]).padding(4)(root);

  canvas2
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
    .style("fill", "rgb(30,215,96)")
    .on("mouseover", function (event, i) {
      nfObject = new Intl.NumberFormat("en-US");
      tooltip
        .html(
          `<div>Day: ${formatTime(
            parseTime(i.id)
          )}</div><div>Streams: ${nfObject.format(i.value)}</div>`
        )
        .style("visibility", "visible");
      d3.select(this).attr("fill", hoverColor);
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
  canvas2
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr("x", function (d) {
      return d.x0 + 10;
    })
    .attr("y", function (d) {
      return d.y0 + 20;
    })
    .text(function (d) {
      return formatTime(parseTime(d.data.name));
    })
    .attr("font-size", "12px")
    .attr("fill", "black");

  canvas2
    .append("text")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("transform", "translate(330, 650)")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .attr("stroke", "white")
    .attr("fill", "white")
    .text("Leave The Door Open by Bruno Mars");
});
