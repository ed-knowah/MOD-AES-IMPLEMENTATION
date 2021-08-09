require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
//const mongoUrl ="mongodb://localhost/patientDatabase";
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");

//Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//console.log("i am here" + process.cwd())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

//
//session CONFIG
const store = new mongoSession({
  uri: process.env.DB_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    expires: new Date(Date.now() + 30 * 86400 * 1),
  })
);

//Connect to MongoCloud database
(async function () {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return console.log(`Successfully connected to database..`);
  } catch (error) {
    console.log(`Error connecting to DB`, error);
    return process.exit(1);
  }
})();

// ROUTES
app.use("/", userRoutes.router);
app.use("/", fileRoutes.router);

app.listen(PORT, () => {
  console.log(`Your app is running on port ${PORT}..`);
});
