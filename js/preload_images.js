d3.json("data/tiles.json", function(error, data){
	if (error) throw error;

	data.forEach(function(img){

		preloadImage("img/tiles/" + img);

	});

});

function preloadImage(url){
  var img = new Image();
  img.src = url;
}