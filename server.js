const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 8080;

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json()); //parsing JSON request body
app.use(morgan("dev")); //middleware for logging HTTP requests

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Database with { force: true }");
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome Steven." });
});

require("./routes/auth.route")(app);
require("./routes/user.route")(app);
require("./routes/pinata.route")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
