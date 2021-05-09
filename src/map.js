var country_charts = new Map();
var countries = new Map();
var svg = d3.select("svg");
var g = svg.append("g");
var barX = 100;
var h = 90;

var projection = d3
  .geoMercator()
  .center([0, 0])
  .scale(220)
  .rotate([0, 0])
  .translate([750, 650]);

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .html("<div id='tipDiv'></div>");
var tipSVG = d3
  .select("#tipDiv")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 500)
  .style("opacity", 0);

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
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.style("left", "500px").style("top", "250px");

      tipSVG.transition().duration(200).style("opacity", 1);
      tipSVG.style("left", "0").style("top", "250px");

      if (countries.get(d.properties.name) !== undefined) {
        var chart_array = countries.get(d.properties.name);
        tipSVG
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(500,50)")
          .style("text-anchor", "middle")
          .attr("fill", "black")
          .text(d.properties.name);
        tipSVG
          .selectAll("rect")
          .data(countries.get(d.properties.name))
          .enter()
          .append("rect")
          .attr("x", function (d, i) {
            return barX + i * 85;
          })
          .attr("y", function (d, i) {
            if (chart_array[0].streams > 1000000) {
              return -(-(450 - Math.floor(d.streams / 10000) - 90));
            } else if (chart_array[0].streams > 100000) {
              return -(-(400 - Math.floor(d.streams / 5000) - 90));
            } else {
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
          .text(function (d) {
            return d.name;
          });
      } else {
        tipSVG
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(500,50)")
          .style("text-anchor", "middle")
          .attr("fill", "black")
          .text(d.properties.name);
        tipSVG
          .append("text")
          .attr("font-family", "Arial, Helvetica, sans-serif")
          .attr("transform", "translate(500,250)")
          .style("text-anchor", "middle")
          .style("font", "50px times")
          .attr("fill", "black")
          .text("No Spotify Data Found 🤷🏽‍♂️");
      }
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
      tipSVG.transition().duration(500).style("opacity", 0);
      tipSVG.selectAll("text").remove();
      tipSVG.selectAll("rect").remove();
    });
}

// add a catch here
Promise.all(promises).then(process_world_data).then(read_csv).then(ready);
