const w = 1000;
const h = 800;

var projection = d3.geoMercator().center([0, 5]).scale(150).rotate([-180, 0]);

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var path = d3.geoPath().projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("world-110m2.json").then(function (topology) {
  g.selectAll("path")
    .data(topojson.feature(topology, topology.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path);
});
