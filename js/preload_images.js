d3.json("data/first_tiles.json", function(error, data){
	if (error) throw error;

	data.forEach(function(img, index){

		preloader("img/tiles/" + img, index);
		
	});

});

d3.json("data/tiles.json", function(error, data){
	if (error) throw error;

	data.forEach(function(img, index){

		preloader("img/tiles/" + img, index);
		
	});

});

// better image preloading @ https://perishablepress.com/press/2009/12/28/3-ways-preload-images-css-javascript-ajax/
function preloader(url, index) {
	$("body").append("<div id='preload-" + index + "'></div>");
	if (document.getElementById) {
		document.getElementById("preload-" + index).style.background = "url(" + url + ") no-repeat -9999px -9999px";
	}
}

function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
