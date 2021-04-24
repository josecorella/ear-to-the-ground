var projection = d3.geoMercator().center([0, 0]).scale(150).rotate([0, 0]);

var svg = d3.select("svg");
var path = d3.geoPath().projection(projection);
var g = svg.append("g");

var promises = [d3.json("../data/world.json")];

Promise.all(promises).then(ready);

function ready([world]) {
  console.log(world);
  g.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path);
}
