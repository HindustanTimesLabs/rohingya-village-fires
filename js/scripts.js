var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

var resp = {};
if (isMobile){
  resp.map_width = Math.max(768, window.innerWidth);
} else {
  resp.map_width = Math.max(1440, window.innerWidth);
}

var step = 0;

var pi = Math.PI,
    tau = 2 * pi;

var width = resp.map_width,
    height = Math.max(window.innerHeight, 600);

// Initialize the projection to fit the world in a 1×1 square centered at the origin.
var projection = d3.geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);

var path = d3.geoPath()
    .projection(projection)
    .pointRadius(4);

var tile = d3.tile()
    .size([width, height]);

var svg = d3.select("#map-wrapper")
    .attr("width", width)
    .attr("height", height);

var raster = svg.append("g");



// TIMELINE MAP INITIALIZATION
var timeline_width = Math.min(800, window.innerWidth - 20), timeline_height = Math.min(500, window.innerHeight);

var timeline_projection = d3.geoMercator();

var timeline_path = d3.geoPath()
    .projection(timeline_projection)
    .pointRadius(2);

var timeline_svg = d3.select("#timeline-map").append("svg")
    .attr("width", timeline_width)
    .attr("height", timeline_height);

timeline_svg.append("rect")
    .attr("width", timeline_width)
    .attr("height", timeline_height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "#334d5c")

d3.queue()
  .defer(d3.csv, "data/myanmar-fires.csv")
  .defer(d3.json, "data/steps.json")
  .defer(d3.json, "data/myanmar.json")
  .defer(d3.json, "data/rakhine.json")
  .defer(d3.json, "data/villages.json")
  .defer(d3.csv, "data/fires.csv")
  .defer(d3.json, "data/zoom.json")
  .defer(d3.json, "data/bangladesh.json")
  .defer(d3.json, "data/labels.json")
  .await(ready);

function ready(error, fires, steps, myanmar, rakhine, villages, daily_fires, zoom, bangladesh, labels){
  if (error) throw error;

  drawSubUnits(myanmar, "myanmar", svg, path);
  labelMyanmar(myanmar, svg, path);

  var fires_out = [];

  fires.forEach(function(d) {
    fires_out.push({
      type: "Feature",
      properties: {date: d.acq_date, id: d.id},
      geometry: {type: "Point", coordinates: [+d.longitude, +d.latitude]}
    });
  });

  var fires_data = {type: "FeatureCollection", features: fires_out}

  drawPoints(fires_data, svg, path);

  scrollyMap();
  function scrollyMap(){
    
    function scrollBehavior(){
      if (getScrollPct() <= 1){
        transform(getTransform(getScrollPct(), steps))
        $("#map-wrapper").removeClass("scrolling").css("margin-top", 0);
      } else {
        transform(steps[steps.length - 1])
        $("#map-wrapper").addClass("scrolling").css("margin-top", getStoryHeight());
      }
      if (getScrollPct() > .91 && getScrollPct() < .98){
        $(".myanmar").fadeOut()
      } else if (getScrollPct() >= .98){
        $(".myanmar").hide();
      } else {
        $(".myanmar").show()
      }
    }
    scrollBehavior();
    $(window).scroll(scrollBehavior);
  }



  // TIMELINE MAP

  var day = 0;


  centerZoom(zoom, timeline_svg, timeline_path, timeline_projection, timeline_width, timeline_height);

  drawSubUnits(myanmar, "myanmar-tl", timeline_svg, timeline_path);
  drawSubUnits(rakhine, "rakhine-tl", timeline_svg, timeline_path);
  drawSubUnits(bangladesh, "bangladesh-tl", timeline_svg, timeline_path);

  drawPlaces(labels, timeline_svg, timeline_projection);

  drawVillages(filterVillageData(0));

  var interval = d3.interval(function(){
    if (day == daily_fires.length - 1){
      day = -1;
    } else {
      ++day;
    }
    drawVillages(filterVillageData(day));
  }, 750);

  function filterVillageData(day){

    var out = {};

    // deep clone villages json
    var cloned = JSON.parse(JSON.stringify(villages));

    out.type = cloned.type;
    out.arcs = cloned.arcs;
    out.objects = {};
    out.objects.villages = {};
    out.objects.villages.type = cloned.objects.villages.type;
    // basically filtering into the geometries
    out.objects.villages.geometries = [];

    for (var i = 0; i <= day; i++){
      var date = daily_fires[i].date;
      $(".timeline-date").html(daily_fires[i].date_text);
      $(".timeline-villages").html("<span class='red-color'>" + daily_fires[i].fires + "</span> villages seen burning");
  
      // filter cloned geometries by date
      cloned.objects.villages.geometries.forEach(function(geom){
        if (geom.properties.date == date) out.objects.villages.geometries.push(geom);
      });
    }

    return out;

  }

};

function drawPlaces(data, svg, projection){

  svg.selectAll(".place-label")
      .data(topojson.feature(data, data.objects.places).features)
    .enter().append("text")
      .attr("class", function(d){ return "place-label " + d.properties.type; })
      .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
      .text(function(d) { return d.properties.name; });
}

function drawVillages(data){

  var bg = 6, sm = 3;

  var circle_village = timeline_svg.selectAll(".circle-village")
      .data(topojson.feature(data, data.objects.villages).features, function(d){ return d.properties.id; })

  circle_village.exit()
      .attr("r", sm)
    .transition()
      .attr("r", 1e-10)
      .remove();

  circle_village
    .transition()
      .style("fill", "grey")
      .attr("r", sm)

  circle_village.enter().append("circle")
      .attr("class", "circle-village")
      .attr("cx", function(d){ return timeline_projection(d.geometry.coordinates)[0]; })
      .attr("cy", function(d){ return timeline_projection(d.geometry.coordinates)[1]; })
      .style("fill", "red")
      .attr("r", 0)
    .transition(1000)
      .attr("r", bg);
}

function getStoryHeight(){
  return $(window).height() * ($("#story-wrapper").find("p").length);
}

function getTransform(scroll_pct, steps){

  var steps_length = steps.length;
  var curr_step = Math.round(steps_length * scroll_pct);
  

  var window_height = $(window).height();
  var story_height = getStoryHeight();
  var scroll_height = $(window).scrollTop();
  $("#counter").html("window height: " + window_height + "<br /> story height: " + story_height + "<br />scroll height: " + scroll_height + "<br/>scroll pct: " + (scroll_pct * 100).toFixed(2) + "<br />total steps: " + steps_length + "<br />current step: " + curr_step);
  
  return steps[curr_step];
}

function getScrollPct(){
  var window_height = $(window).height();
  var story_height = getStoryHeight();
  var scroll_height = $(window).scrollTop();
  return scroll_height / story_height;
}

function transform(transform){

  var ww = $(window).width();
  var tx_var = ww <= 768 && ww > 480 ? "x_md" : 
    ww <= 480 ? "x_sm" : 
    "x";

  var tiles = tile
      .scale(transform.k)
      .translate([transform[tx_var], transform.y])
      ();

  var last_projection = projection;

  projection
      .scale(transform.k / tau)
      .translate([transform[tx_var], transform.y]);

  d3.selectAll(".village")
      .attr("d", path);

  d3.select(".myanmar")
      .attr("d", path)

  d3.select(".myanmar-label")
      .attr("x", function(d){ return path.centroid(d)[0]; })
      .attr("y", function(d){ return path.centroid(d)[1]; })
  
  var image = raster
      .attr("transform", stringify(tiles.scale, tiles.translate))
    .selectAll("image")
    .data(tiles, function(d) { return d; });  
    image.exit().remove();

  image.enter().append("image")
      .attr("xlink:href", function(d){ 
        // return "https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"
        return "img/tiles/" + d[2] + "-" + d[0] + "-" + d[1] + ".png"; 
      })
      .attr("x", function(d) { return d[0] * 256; })
      .attr("y", function(d) { return d[1] * 256; })
      .attr("width", 256)
      .attr("height", 256);
  
}

function drawPoints(data, svg, path){

  svg.append("path")
      .datum(data)
      .attr("d", path)
      .attr("class", "village");

}

function drawSubUnits(data, cl, svg, path){
  svg.selectAll(".subunit." + cl)
      .data(topojson.feature(data, data.objects.polygons).features)
    .enter().append("path")
      .attr("class", "subunit " + cl)
      .attr("d", path);
}

function labelMyanmar(data, svg, path){
  svg.selectAll(".myanmar-label")
      .data(topojson.feature(data, data.objects.polygons).features)
    .enter().append("text")
      .attr("class", "myanmar-label")
      .attr("x", function(d){ return path.centroid(d)[0]; })
      .attr("y", function(d){ return path.centroid(d)[1]; })
      .text("Myanmar")
}


function stringify(scale, translate) {
  var k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
}

function centerZoom(data, svg, path, projection, width, height){
  
  var o = topojson.mesh(data, data.objects.polygons, function(a, b) { return a === b; });

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(o),
      s = .8 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  return o;
}

// THE BAR CHART

function drawChart(){
  $("#bar-chart").empty();

  var x_var = "date_text", y_var = "fires";

  var setup = d3.marcon()
      .top(20)
      .bottom(20)
      .width(Math.min(800, window.innerWidth - 20))
      .height(Math.min(400, window.innerHeight))
      .element("#bar-chart")

  setup.render();

  var chart_width = setup.innerWidth(), chart_height = setup.innerHeight(), chart_svg = setup.svg();

  var x = d3.scaleBand()
    .rangeRound([0, chart_width])
    .padding(.2);

  var y = d3.scaleLinear()
    .range([chart_height, 0])

  d3.queue()
      .defer(d3.csv, "data/fires.csv")
      .await(fires_ready);

  function fires_ready(error, fires){

    fires.forEach(function(row){
      row.fires = +row.fires;
      return row;
    });

    // domains
    x.domain(fires.map(function(d){ return d[x_var]; }));
    y.domain([0, d3.max(fires, function(d){ return d[y_var]; })])

    var x_axis = d3.axisBottom()
        .ticks(5)
        .tickFormat(function(d, i){
          d = d.replace(", 2017", "");
          if (i == 0 || d == "Sep. 1") {

          } else {
            d = d.split(". ")[1]
          }
          return d;
        })
        .scale(x)

    chart_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + chart_height + ")")
        .call(x_axis)

    var y_axis = d3.axisRight(y)
        .tickSize(chart_width)
        .tickFormat(function(d, i, ticks){ return i == ticks.length - 1 ? d + " fires" : d })


    chart_svg.append("g")
        .attr("class", "y axis")
        .call(customYAxis);

    function customYAxis(g) {
      g.call(y_axis);
      g.select(".domain").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
      g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
    }


    redraw(fires);

  }

  function redraw(data){

    // join
    var bar = chart_svg.selectAll(".bar")
      .data(data, function(d){ return d[x_var]; });

    var amount = chart_svg.selectAll(".amount")
      .data(data, function(d){ return d[x_var]; });

    // update
    bar
      .transition()
        .attr("y", function(d){ return y(d[y_var]); })
        .attr("height", function(d){ return chart_height - y(d[y_var]); });

    amount
      .transition()
        .attr("y", function(d){ return y(d[y_var]); })
        .text(function(d){ return d[y_var]; });

    // enter
    bar.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){ return x(d[x_var]); })
        .attr("y", function(d){ return y(d[y_var]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d){ return chart_height - y(d[y_var]); });

    amount.enter().append("text")
        .attr("class", "amount")
        .attr("x", function(d){ return x(d[x_var]) + x.bandwidth() / 2; })
        .attr("y", function(d){ return y(d[y_var]); })
        .attr("dy", 16)
        .text(function(d){ return d[y_var] != 0 ? d[y_var] : ""; });

  }
}
drawChart();
$(window).smartresize(drawChart);