var country_charts = new Map();
var svg = d3.select("svg");
var g = svg.append("g");
var projection = d3
  .geoMercator()
  .center([0, 0])
  .scale(225)
  .rotate([0, 0])
  .translate([750, 800]);

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

function ready([world]) {
  console.log(country_charts);
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
    .append("title")
    .text(function (d) {
      return d.properties.name;
    });
}

// add a catch here
Promise.all(promises).then(process_world_data).then(ready);
