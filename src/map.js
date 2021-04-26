var country_charts = new Map();
var countries = new Map();
var svg = d3.select("svg");
var g = svg.append("g");
var projection = d3
  .geoMercator()
  .center([0, 0])
  .scale(225)
  .rotate([0, 0])
  .translate([750, 800]);

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
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
      console.log(d);
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(d.properties.name + "<br/>")
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
}

// add a catch here
Promise.all(promises).then(process_world_data).then(read_csv).then(ready);
