var step = 0;

var pi = Math.PI,
    tau = 2 * pi;

var width = Math.max(960, window.innerWidth),
    height = window.innerHeight;

// Initialize the projection to fit the world in a 1×1 square centered at the origin.
var projection = d3.geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);

var path = d3.geoPath()
    .projection(projection);

var tile = d3.tile()
    .size([width, height]);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

var raster = svg.append("g");

var vector = svg.append("path");

d3.queue()
  .defer(d3.csv, "data/myanmar-fires.csv")
  .defer(d3.json, "data/steps.json")
  .await(ready)

function ready(error, fires, steps){
  if (error) throw error;

  var fires_out = [];

  fires.forEach(function(d) {
    fires_out.push({
      type: "Feature",
      properties: {date: d.acq_date},
      geometry: {type: "Point", coordinates: [+d.longitude, +d.latitude]}
    });
  });

  vector
      .datum({type: "FeatureCollection", features: fires_out});

  transform(steps[0]);

  $(window).scroll(function(){

    var window_height = $(window).height();
    var story_height = $(document).height() - window_height;
    var scroll_height = $(window).scrollTop();
    var scroll_pct = scroll_height / story_height;

    var steps_length = steps.length;
    var curr_step = Math.round(steps_length * scroll_pct);
        $("#counter").html("window height: " + window_height + "<br /> story height: " + story_height + "<br />scroll height: " + scroll_height + "<br/>scroll pct: " + (scroll_pct * 100).toFixed(2) + "<br />total steps: " + steps_length + "<br />current step: " + curr_step);
    transform(steps[curr_step]);
  });

};

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
  
    $("#objects").append(JSON.stringify(transform) + ",");

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

function stringify(scale, translate) {
  var k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}
