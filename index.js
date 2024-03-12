const express = require("express");
const app = express();
const port = 3000;
const route = require("./routes");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const engine = require("express-handlebars");

// Static file
// truy cap localhost + public / static path
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());

app.use(methodOverride("_method"));

// Template Engine
app.engine(
	"hbs",
	engine.engine({
		extname: ".hbs",
		helpers: {
			sum: (a, b) => a + b,
		},
	})
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// HTTP logger
app.use(morgan("combined"));

route(app);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
