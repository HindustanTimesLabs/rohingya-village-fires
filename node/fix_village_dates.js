// 9/10/2017 ---> 2017-09-10

var io = require("indian-ocean"),
	moment = require("moment"),
	jz = require("jeezy");

var json = io.readDataSync("data/villages.json");

json.objects.villages.geometries.forEach(geom => {
	var props = geom.properties;
	var s = props.date.split("/");
	var m = jz.str.numberPrependZeros(s[0], 2);
	var d = jz.str.numberPrependZeros(s[1], 2);
	var y = "2017";
	geom.properties.date = y + "-" + m + "-" + d;
	return geom;
});

io.writeDataSync("data/villages.json", json);
