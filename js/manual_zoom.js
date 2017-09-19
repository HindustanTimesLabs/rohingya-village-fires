var step = 0;

var zoom_steps = [
{k: 4096, x: -344.96000000000004, y: 532.3226650156835},
{k: 10914.814567153868, x: -2092.880542707245, y: 968.440198502344},
{k: 23788.88445794547, x: -5402.103865289242, y: 1661.6597651964128},
{k: 93975.69113396567, x: -23414.623346292552, y: 5808.923180028318}
];


var pi = Math.PI,
    tau = 2 * pi;

var width = Math.max(960, window.innerWidth),
    height = 600

// Initialize the projection to fit the world in a 1×1 square centered at the origin.
var projection = d3.geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);
var path = d3.geoPath()
    .projection(projection);

var tile = d3.tile()
    .size([width, height]);

var zoom = d3.zoom()
    .scaleExtent([1 << 12, 1 << 17])
    .on("zoom", zoomed);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var raster = svg.append("g");

var vector = svg.append("path");

d3.csv("myanmar-fires.csv", type, function(error, fires) {
  if (error) throw error;

  vector
      .datum({type: "FeatureCollection", features: fires});

  // Compute the projected initial center.
  var center = projection([93.6, 20]);

  // Apply a zoom transform equivalent to projection.{scale,translate,center}.
  svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1 << 12)
          .translate(-center[0], -center[1]));

  transform(zoom_steps[step])
  $("#button").click(function(){
    ++step;
    transform(zoom_steps[step]);
  });

});

function transform(transform){
  
  var tiles = tile
      .scale(transform.k)
      .translate([transform.x, transform.y])
      ();

  var last_projection = projection;

  projection
      .scale(transform.k / tau)
      .translate([transform.x, transform.y]);

  vector
    
      .attr("d", path);

  
    var image = raster
        .attr("transform", stringify(tiles.scale, tiles.translate))
      .selectAll("image")
      .data(tiles, function(d) { return d; });  
      image.exit().remove();



    image.enter().append("image")
        .attr("xlink:href", function(d){ 
          return "img/tiles/" + d[2] + "-" + d[0] + "-" + d[1] + ".png"; 
        })
        .attr("x", function(d) { return d[0] * 256; })
        .attr("y", function(d) { return d[1] * 256; })
        .attr("width", 256)
        .attr("height", 256);
  
}



function zoomed() {
  
    var transform = d3.event.transform;
  
    $("#objects").append(JSON.stringify(transform));

    var tiles = tile
        .scale(transform.k)
        .translate([transform.x, transform.y])
        ();
  
    projection
        .scale(transform.k / tau)
        .translate([transform.x, transform.y]);
  
    vector
        .attr("d", path);
  
    var image = raster
        .attr("transform", stringify(tiles.scale, tiles.translate))
      .selectAll("image")
      .data(tiles, function(d) { return d; });
  
    image.exit().remove();
  
    image.enter().append("image")
        .attr("xlink:href", function(d){ 
          return "img/tiles/" + d[2] + "-" + d[0] + "-" + d[1] + ".png"; 
        })
        .attr("x", function(d) { return d[0] * 256; })
        .attr("y", function(d) { return d[1] * 256; })
        .attr("width", 256)
        .attr("height", 256);
  
}

function type(d) {
  return {
    type: "Feature",
    properties: {date: d.acq_date},
    geometry: {type: "Point", coordinates: [+d.longitude, +d.latitude]}
  };
}

function stringify(scale, translate) {
  var k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}