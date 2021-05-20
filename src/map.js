var country_charts = new Map();
var countries = new Map();
var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

var margin = { top: 20, right: 20, bottom: 50, left: 100 },
  width = 800 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;
// TODO figure out why there is an issue when it comes switching to laptop from desktop
var svg = d3
  .select("#map")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var bar = d3
  .select("#bar-graph")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(800, -700)");

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

var bar_tooltip = d3
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

var g = svg.append("g").attr("transform", "translate(-200, -200)");

var barX = 100;
var h = 90;
var hoverColor = "#eec42d";
var staticColor = "rgb(30,215,96)";

var projection = d3
  .geoMercator()
  .center([0, 0])
  .scale(125)
  .rotate([0, 0])
  .translate([600, 650]);

var path = d3.geoPath().projection(projection);

var promises = [d3.json("./data/world.json")];

function process_world_data([world]) {
  world.objects.countries.geometries.forEach((element) => {
    if (element.properties.hasOwnProperty("available")) {
      if (element.properties.hasOwnProperty("charts")) {
        country_charts.set(element.properties.name, element.properties.charts);
      } else {
        country_charts.set(element.properties.name, "No Data Found");
      }
    }
  });
  return [world];
}

async function read_csv([world]) {
  for (let [key, value] of country_charts.entries()) {
    country_chart = new Array();
    if (value !== "No Data Found") {
      await d3.csv("./data/" + value, function (d) {
        var song = new Object();
        song.position = d.Position;
        song.name = d["Track Name"];
        song.artist = d.Artist;
        song.streams = d.Streams;
        song.url = d.URL;
        country_chart.push(song);
      });
      countries.set(key, country_chart);
    }
  }
  return [world];
}

function ready([world]) {
  g.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      d.properties.hasOwnProperty("available")
        ? "rgb(30,215,96)"
        : "rgb(25, 20, 20)"
    )
    .style("stroke", "grey")
    .on("click", function (event, d) {
      bar.selectAll("text").remove();
      bar.selectAll("rect").remove();
      bar.selectAll("g").remove();
      if (countries.get(d.properties.name) !== undefined) {
        var chart_array = countries.get(d.properties.name);
        var data = [];
        chart_array.forEach((element) => {
          data.push(+element.streams);
        });

        var yScale = d3.scaleLinear().domain([0, d3.max(data)]);
        var xScale = d3.scaleLinear().domain([]).range([30, 705]);

        bar
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(400,100)")
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .attr("stroke", "white")
          .attr("fill", "white")
          .text("Top 10 Spotify Streams in " + d.properties.name);
        bar
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(425,510)")
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .attr("stroke", "white")
          .attr("fill", "white")
          .text("Popular Songs on Spotify");

        bar
          .selectAll("rect")
          .data(countries.get(d.properties.name))
          .enter()
          .append("rect")
          .attr("x", function (d, i) {
            return barX + i * 70;
          })
          .attr("y", function (d, i) {
            if (chart_array[0].streams > 1000000) {
              yScale.range([
                450,
                -(-(450 - Math.floor(chart_array[0].streams / 10000) - 90)),
              ]);
              return -(-(450 - Math.floor(d.streams / 10000) - 90));
            } else if (chart_array[0].streams > 100000) {
              yScale.range([
                450,
                -(-(400 - Math.floor(chart_array[0].streams / 5000) - 90)),
              ]);
              return -(-(400 - Math.floor(d.streams / 5000) - 90));
            } else {
              yScale.range([
                450,
                -(-(350 - Math.floor(chart_array[0].streams / 1000) - 90)),
              ]);
              return -(-(350 - Math.floor(d.streams / 1000) - 90));
            }
          })
          .attr("width", function (d) {
            return 35;
          })
          .attr("height", function (d) {
            if (chart_array[0].streams > 1000000) {
              return 450 - -(-(450 - Math.floor(d.streams / 10000) - 90));
            } else if (chart_array[0].streams > 100000) {
              return 450 - -(-(400 - Math.floor(d.streams / 5000) - 90));
            } else {
              return 450 - -(-(350 - Math.floor(d.streams / 1000) - 90));
            }
          })
          .attr("fill", function (d, i) {
            return "rgb(30,215,96)";
          })
          .on("mouseover", function (d, i) {
            nfObject = new Intl.NumberFormat("en-US");
            bar_tooltip
              .html(
                `<div>Song: ${i.name}</div><div>Artist: ${
                  i.artist
                }</div><div>Streams: ${nfObject.format(i.streams)}</div>`
              )
              .style("visibility", "visible");
            d3.select(this).transition().attr("fill", hoverColor);
          })
          .on("mousemove", function (event) {
            bar_tooltip
              .style("top", event.pageY - 10 + "px")
              .style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", function () {
            bar_tooltip.html(``).style("visibility", "hidden");
            d3.select(this).transition().attr("fill", staticColor);
          });

        var y_axis = d3.axisLeft().scale(yScale);
        var xAxis = d3.axisBottom().scale(xScale);

        bar
          .append("g")
          .attr("transform", "translate(90, 0)")
          .call(y_axis)
          .style("font-size", "14px")
          .style("color", "white");
        bar
          .append("g")
          .attr("transform", "translate(60,450)")
          .call(xAxis)
          .style("font-size", "14px")
          .style("color", "white");
      } else {
        bar
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(400,100)")
          .style("text-anchor", "middle")
          .style("font-size", "20px")
          .attr("stroke", "white")
          .attr("fill", "white")
          .text("Top 10 Streams in " + d.properties.name);
        bar
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(400,200)")
          .style("text-anchor", "middle")
          .style("font-size", "50px")
          .attr("stroke", "white")
          .attr("fill", "white")
          .text("No Spotify Data Found");
      }
    })
    .on("mouseover", function (event, i) {
      tooltip
        .html(`<div>Country: ${i.properties.name}`)
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
      if (i.properties.available === "True") {
        d3.select(this).transition().attr("fill", staticColor);
      } else {
        d3.select(this).transition().attr("fill", "rgb(25, 20, 20)");
      }
    });
}

Promise.all(promises).then(process_world_data).then(read_csv).then(ready);
