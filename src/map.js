var projection = d3
  .geoMercator()
  .center([0, 0])
  .scale(225)
  .rotate([0, 0])
  .translate([750, 800]);

var country_names = new Map();
var svg = d3.select("svg");
var path = d3.geoPath().projection(projection);
var g = svg.append("g");

var promises = [d3.json("./data/world.json")];

Promise.all(promises).then(ready);

function ready([world]) {
  g.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d, i) => (i % 2 == 0 ? "rgb(30,215,96)" : "rgb(25, 20, 20)"))
    .style("stroke", "grey")
    .attr("d", path)
    .append("title")
    .text(function (d, i) {
      return d.properties.name;
    });
}
