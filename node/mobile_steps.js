var io = require("indian-ocean");

var steps = io.readDataSync("data/steps.json");

steps.forEach(step => {
	step.x_md = step.x - 330;
	step.x_sm = step.x - 500;
	return step;
});

io.writeDataSync("data/steps.json", steps);