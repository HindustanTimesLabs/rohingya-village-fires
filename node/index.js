var fsz = require("fsz"),
	_ = require("underscore");

_.rateLimit = function(func, rate, async) {
  var queue = [];
  var timeOutRef = false;
  var currentlyEmptyingQueue = false;
  
  var emptyQueue = function() {
    if (queue.length) {
      currentlyEmptyingQueue = true;
      _.delay(function() {
        if (async) {
          _.defer(function() { queue.shift().call(); });
        } else {
          queue.shift().call();
        }
        emptyQueue();
      }, rate);
    } else {
      currentlyEmptyingQueue = false;
    }
  };
  
  return function() {
    var args = _.map(arguments, function(e) { return e; }); // get arguments into an array
    queue.push( _.bind.apply(this, [func, this].concat(args)) ); // call apply so that we can pass in arguments as parameters as opposed to an array
    if (!currentlyEmptyingQueue) { emptyQueue(); }
  };
};

fsz.mkdirIf("img");
fsz.mkdirIf("tiles", "img");

var files = ["http://tile.stamen.com/terrain-background/4/9/5.png", "http://tile.stamen.com/terrain-background/4/10/5.png", 
"http://tile.stamen.com/terrain-background/4/10/7.png",
"http://tile.stamen.com/terrain-background/4/11/7.png",
"http://tile.stamen.com/terrain-background/4/12/7.png",
"http://tile.stamen.com/terrain-background/4/13/7.png",
"http://tile.stamen.com/terrain-background/4/14/7.png",
"http://tile.stamen.com/terrain-background/4/9/8.png",
"http://tile.stamen.com/terrain-background/4/9/9.png",
"http://tile.stamen.com/terrain-background/4/9/10.png",
"http://tile.stamen.com/terrain-background/4/9/11.png",
"http://tile.stamen.com/terrain-background/4/9/12.png",
"http://tile.stamen.com/terrain-background/4/9/13.png",
"http://tile.stamen.com/terrain-background/4/9/14.png",
"http://tile.stamen.com/terrain-background/4/10/8.png",
"http://tile.stamen.com/terrain-background/4/11/8.png",
"http://tile.stamen.com/terrain-background/4/12/8.png",
"http://tile.stamen.com/terrain-background/4/13/8.png",
"http://tile.stamen.com/terrain-background/4/14/8.png",
"http://tile.stamen.com/terrain-background/7/92/54.png",
"http://tile.stamen.com/terrain-background/7/92/55.png",
"http://tile.stamen.com/terrain-background/7/92/56.png",
"http://tile.stamen.com/terrain-background/7/92/57.png",
"http://tile.stamen.com/terrain-background/7/92/58.png",
"http://tile.stamen.com/terrain-background/9/383/223.png",
"http://tile.stamen.com/terrain-background/9/384/223.png",
"http://tile.stamen.com/terrain-background/9/385/223.png",
"http://tile.stamen.com/terrain-background/9/386/223.png",
"http://tile.stamen.com/terrain-background/9/387/223.png",
"http://tile.stamen.com/terrain-background/9/388/223.png",
"http://tile.stamen.com/terrain-background/9/389/223.png",
"http://tile.stamen.com/terrain-background/9/390/223.png",
"http://tile.stamen.com/terrain-background/9/391/223.png",
"http://tile.stamen.com/terrain-background/5/20/16.png", "http://tile.stamen.com/terrain-background/5/21/16.png", "http://tile.stamen.com/terrain-background/5/22/16.png", "http://tile.stamen.com/terrain-background/5/23/16.png", "http://tile.stamen.com/terrain-background/5/24/16.png", "http://tile.stamen.com/terrain-background/5/25/16.png", "http://tile.stamen.com/terrain-background/5/26/16.png", "http://tile.stamen.com/terrain-background/5/27/16.png", "http://tile.stamen.com/terrain-background/5/28/16.png", "http://tile.stamen.com/terrain-background/6/44/30.png", "http://tile.stamen.com/terrain-background/6/45/30.png", "http://tile.stamen.com/terrain-background/6/46/30.png", "http://tile.stamen.com/terrain-background/6/47/30.png", "http://tile.stamen.com/terrain-background/6/48/30.png", "http://tile.stamen.com/terrain-background/6/49/30.png", "http://tile.stamen.com/terrain-background/6/50/30.png", "http://tile.stamen.com/terrain-background/6/51/30.png", "http://tile.stamen.com/terrain-background/6/52/30.png",
"http://tile.stamen.com/terrain-background/4/11/5.png", "http://tile.stamen.com/terrain-background/4/12/5.png", "http://tile.stamen.com/terrain-background/4/13/5.png", "http://tile.stamen.com/terrain-background/4/14/5.png", "http://tile.stamen.com/terrain-background/4/9/6.png", "http://tile.stamen.com/terrain-background/4/10/6.png", "http://tile.stamen.com/terrain-background/4/11/6.png", "http://tile.stamen.com/terrain-background/4/12/6.png", "http://tile.stamen.com/terrain-background/4/13/6.png", "http://tile.stamen.com/terrain-background/4/14/6.png", "http://tile.stamen.com/terrain-background/4/9/7.png","http://tile.stamen.com/terrain-background/5/20/12.png", "http://tile.stamen.com/terrain-background/5/21/12.png", "http://tile.stamen.com/terrain-background/5/22/12.png", "http://tile.stamen.com/terrain-background/5/23/12.png", "http://tile.stamen.com/terrain-background/5/24/12.png", "http://tile.stamen.com/terrain-background/5/25/12.png", "http://tile.stamen.com/terrain-background/5/26/12.png", "http://tile.stamen.com/terrain-background/5/27/12.png", "http://tile.stamen.com/terrain-background/5/28/12.png", "http://tile.stamen.com/terrain-background/5/20/13.png", "http://tile.stamen.com/terrain-background/5/21/13.png", "http://tile.stamen.com/terrain-background/5/22/13.png", "http://tile.stamen.com/terrain-background/5/23/13.png", "http://tile.stamen.com/terrain-background/5/24/13.png", "http://tile.stamen.com/terrain-background/5/25/13.png", "http://tile.stamen.com/terrain-background/5/26/13.png", "http://tile.stamen.com/terrain-background/5/27/13.png", "http://tile.stamen.com/terrain-background/5/28/13.png", "http://tile.stamen.com/terrain-background/5/20/14.png", "http://tile.stamen.com/terrain-background/5/21/14.png", "http://tile.stamen.com/terrain-background/5/22/14.png", "http://tile.stamen.com/terrain-background/5/23/14.png", "http://tile.stamen.com/terrain-background/5/24/14.png", "http://tile.stamen.com/terrain-background/5/25/14.png", "http://tile.stamen.com/terrain-background/5/26/14.png", "http://tile.stamen.com/terrain-background/5/27/14.png", "http://tile.stamen.com/terrain-background/5/28/14.png", "http://tile.stamen.com/terrain-background/5/20/15.png", "http://tile.stamen.com/terrain-background/5/21/15.png", "http://tile.stamen.com/terrain-background/5/22/15.png", "http://tile.stamen.com/terrain-background/5/23/15.png", "http://tile.stamen.com/terrain-background/5/24/15.png", "http://tile.stamen.com/terrain-background/5/25/15.png", "http://tile.stamen.com/terrain-background/5/26/15.png", "http://tile.stamen.com/terrain-background/5/27/15.png", "http://tile.stamen.com/terrain-background/5/28/15.png", "http://tile.stamen.com/terrain-background/6/44/26.png", "http://tile.stamen.com/terrain-background/6/45/26.png", "http://tile.stamen.com/terrain-background/6/46/26.png", "http://tile.stamen.com/terrain-background/6/47/26.png", "http://tile.stamen.com/terrain-background/6/48/26.png", "http://tile.stamen.com/terrain-background/6/49/26.png", "http://tile.stamen.com/terrain-background/6/50/26.png", "http://tile.stamen.com/terrain-background/6/51/26.png", "http://tile.stamen.com/terrain-background/6/52/26.png", "http://tile.stamen.com/terrain-background/6/44/27.png", "http://tile.stamen.com/terrain-background/6/45/27.png", "http://tile.stamen.com/terrain-background/6/46/27.png", "http://tile.stamen.com/terrain-background/6/47/27.png", "http://tile.stamen.com/terrain-background/6/48/27.png", "http://tile.stamen.com/terrain-background/6/49/27.png", "http://tile.stamen.com/terrain-background/6/50/27.png", "http://tile.stamen.com/terrain-background/6/51/27.png", "http://tile.stamen.com/terrain-background/6/52/27.png", "http://tile.stamen.com/terrain-background/6/44/28.png", "http://tile.stamen.com/terrain-background/6/45/28.png", "http://tile.stamen.com/terrain-background/6/46/28.png", "http://tile.stamen.com/terrain-background/6/47/28.png", "http://tile.stamen.com/terrain-background/6/48/28.png", "http://tile.stamen.com/terrain-background/6/49/28.png", "http://tile.stamen.com/terrain-background/6/50/28.png", "http://tile.stamen.com/terrain-background/6/51/28.png", "http://tile.stamen.com/terrain-background/6/52/28.png", "http://tile.stamen.com/terrain-background/6/44/29.png", "http://tile.stamen.com/terrain-background/6/45/29.png", "http://tile.stamen.com/terrain-background/6/46/29.png", "http://tile.stamen.com/terrain-background/6/47/29.png", "http://tile.stamen.com/terrain-background/6/48/29.png", "http://tile.stamen.com/terrain-background/6/49/29.png", "http://tile.stamen.com/terrain-background/6/50/29.png", "http://tile.stamen.com/terrain-background/6/51/29.png", "http://tile.stamen.com/terrain-background/6/52/29.png", "http://tile.stamen.com/terrain-background/7/93/54.png", "http://tile.stamen.com/terrain-background/7/94/54.png", "http://tile.stamen.com/terrain-background/7/95/54.png", "http://tile.stamen.com/terrain-background/7/96/54.png", "http://tile.stamen.com/terrain-background/7/97/54.png", "http://tile.stamen.com/terrain-background/7/98/54.png", "http://tile.stamen.com/terrain-background/7/99/54.png", "http://tile.stamen.com/terrain-background/7/100/54.png", "http://tile.stamen.com/terrain-background/7/93/55.png", "http://tile.stamen.com/terrain-background/7/94/55.png", "http://tile.stamen.com/terrain-background/7/95/55.png", "http://tile.stamen.com/terrain-background/7/96/55.png", "http://tile.stamen.com/terrain-background/7/97/55.png", "http://tile.stamen.com/terrain-background/7/98/55.png", "http://tile.stamen.com/terrain-background/7/99/55.png", "http://tile.stamen.com/terrain-background/7/100/55.png", "http://tile.stamen.com/terrain-background/7/93/56.png", "http://tile.stamen.com/terrain-background/7/94/56.png", "http://tile.stamen.com/terrain-background/7/95/56.png", "http://tile.stamen.com/terrain-background/7/96/56.png", "http://tile.stamen.com/terrain-background/7/97/56.png", "http://tile.stamen.com/terrain-background/7/98/56.png", "http://tile.stamen.com/terrain-background/7/99/56.png", "http://tile.stamen.com/terrain-background/7/100/56.png", "http://tile.stamen.com/terrain-background/7/93/57.png", "http://tile.stamen.com/terrain-background/7/94/57.png", "http://tile.stamen.com/terrain-background/7/95/57.png", "http://tile.stamen.com/terrain-background/7/96/57.png", "http://tile.stamen.com/terrain-background/7/97/57.png", "http://tile.stamen.com/terrain-background/7/98/57.png", "http://tile.stamen.com/terrain-background/7/99/57.png", "http://tile.stamen.com/terrain-background/7/100/57.png", "http://tile.stamen.com/terrain-background/7/93/58.png", "http://tile.stamen.com/terrain-background/7/94/58.png", "http://tile.stamen.com/terrain-background/7/95/58.png", "http://tile.stamen.com/terrain-background/7/96/58.png", "http://tile.stamen.com/terrain-background/7/97/58.png", "http://tile.stamen.com/terrain-background/7/98/58.png", "http://tile.stamen.com/terrain-background/7/99/58.png", "http://tile.stamen.com/terrain-background/7/100/58.png", "http://tile.stamen.com/terrain-background/8/189/111.png", "http://tile.stamen.com/terrain-background/8/190/111.png", "http://tile.stamen.com/terrain-background/8/191/111.png", "http://tile.stamen.com/terrain-background/8/192/111.png", "http://tile.stamen.com/terrain-background/8/193/111.png", "http://tile.stamen.com/terrain-background/8/194/111.png", "http://tile.stamen.com/terrain-background/8/195/111.png", "http://tile.stamen.com/terrain-background/8/196/111.png", "http://tile.stamen.com/terrain-background/8/197/111.png", "http://tile.stamen.com/terrain-background/8/189/112.png", "http://tile.stamen.com/terrain-background/8/190/112.png", "http://tile.stamen.com/terrain-background/8/191/112.png", "http://tile.stamen.com/terrain-background/8/192/112.png", "http://tile.stamen.com/terrain-background/8/193/112.png", "http://tile.stamen.com/terrain-background/8/194/112.png", "http://tile.stamen.com/terrain-background/8/195/112.png", "http://tile.stamen.com/terrain-background/8/196/112.png", "http://tile.stamen.com/terrain-background/8/197/112.png", "http://tile.stamen.com/terrain-background/8/189/113.png", "http://tile.stamen.com/terrain-background/8/190/113.png", "http://tile.stamen.com/terrain-background/8/191/113.png", "http://tile.stamen.com/terrain-background/8/192/113.png", "http://tile.stamen.com/terrain-background/8/193/113.png", "http://tile.stamen.com/terrain-background/8/194/113.png", "http://tile.stamen.com/terrain-background/8/195/113.png", "http://tile.stamen.com/terrain-background/8/196/113.png", "http://tile.stamen.com/terrain-background/8/197/113.png", "http://tile.stamen.com/terrain-background/8/189/114.png", "http://tile.stamen.com/terrain-background/8/190/114.png", "http://tile.stamen.com/terrain-background/8/191/114.png", "http://tile.stamen.com/terrain-background/8/192/114.png", "http://tile.stamen.com/terrain-background/8/193/114.png", "http://tile.stamen.com/terrain-background/8/194/114.png", "http://tile.stamen.com/terrain-background/8/195/114.png", "http://tile.stamen.com/terrain-background/8/196/114.png", "http://tile.stamen.com/terrain-background/8/197/114.png", "http://tile.stamen.com/terrain-background/9/383/224.png", "http://tile.stamen.com/terrain-background/9/384/224.png", "http://tile.stamen.com/terrain-background/9/385/224.png", "http://tile.stamen.com/terrain-background/9/386/224.png", "http://tile.stamen.com/terrain-background/9/387/224.png", "http://tile.stamen.com/terrain-background/9/388/224.png", "http://tile.stamen.com/terrain-background/9/389/224.png", "http://tile.stamen.com/terrain-background/9/390/224.png", "http://tile.stamen.com/terrain-background/9/391/224.png", "http://tile.stamen.com/terrain-background/9/383/225.png", "http://tile.stamen.com/terrain-background/9/384/225.png", "http://tile.stamen.com/terrain-background/9/385/225.png", "http://tile.stamen.com/terrain-background/9/386/225.png", "http://tile.stamen.com/terrain-background/9/387/225.png", "http://tile.stamen.com/terrain-background/9/388/225.png", "http://tile.stamen.com/terrain-background/9/389/225.png", "http://tile.stamen.com/terrain-background/9/390/225.png", "http://tile.stamen.com/terrain-background/9/391/225.png", "http://tile.stamen.com/terrain-background/9/383/226.png", "http://tile.stamen.com/terrain-background/9/384/226.png", "http://tile.stamen.com/terrain-background/9/385/226.png", "http://tile.stamen.com/terrain-background/9/386/226.png", "http://tile.stamen.com/terrain-background/9/387/226.png", "http://tile.stamen.com/terrain-background/9/388/226.png", "http://tile.stamen.com/terrain-background/9/389/226.png", "http://tile.stamen.com/terrain-background/9/390/226.png", "http://tile.stamen.com/terrain-background/9/391/226.png", "http://tile.stamen.com/terrain-background/9/383/227.png", "http://tile.stamen.com/terrain-background/9/384/227.png", "http://tile.stamen.com/terrain-background/9/385/227.png", "http://tile.stamen.com/terrain-background/9/386/227.png", "http://tile.stamen.com/terrain-background/9/387/227.png", "http://tile.stamen.com/terrain-background/9/388/227.png", "http://tile.stamen.com/terrain-background/9/389/227.png", "http://tile.stamen.com/terrain-background/9/390/227.png", "http://tile.stamen.com/terrain-background/9/391/227.png"]

var json = [];

files.forEach((file, index) => {
  var s = file.split("terrain-background/")[1].split(".png")[0].split("/");
  var out = s[0] + "-" + s[1] + "-" + s[2] + ".png";
  json.push(out);
  if (index + 1 == files.length) fsz.writeJSON("data/tiles.json", json);
})




// var new_files = ["http://tile.stamen.com/terrain-background/5/20/16.png", "http://tile.stamen.com/terrain-background/5/21/16.png", "http://tile.stamen.com/terrain-background/5/22/16.png", "http://tile.stamen.com/terrain-background/5/23/16.png", "http://tile.stamen.com/terrain-background/5/24/16.png", "http://tile.stamen.com/terrain-background/5/25/16.png", "http://tile.stamen.com/terrain-background/5/26/16.png", "http://tile.stamen.com/terrain-background/5/27/16.png", "http://tile.stamen.com/terrain-background/5/28/16.png", "http://tile.stamen.com/terrain-background/6/44/30.png", "http://tile.stamen.com/terrain-background/6/45/30.png", "http://tile.stamen.com/terrain-background/6/46/30.png", "http://tile.stamen.com/terrain-background/6/47/30.png", "http://tile.stamen.com/terrain-background/6/48/30.png", "http://tile.stamen.com/terrain-background/6/49/30.png", "http://tile.stamen.com/terrain-background/6/50/30.png", "http://tile.stamen.com/terrain-background/6/51/30.png", "http://tile.stamen.com/terrain-background/6/52/30.png"]

// var dl_limited = _.rateLimit(dl, 100)

// new_files.forEach(dl_limited);

// function dl(file, file_index){

// 	console.log(file);

// 	var s = file.split("terrain-background/")[1].split(".png")[0].split("/");
// 	var out = s[0] + "-" + s[1] + "-" + s[2] + ".png";
	
// 	console.log(((file_index + 1) / new_files.length * 100).toFixed(2))

// 	fsz.download(file, "img/tiles/" + out);
// }