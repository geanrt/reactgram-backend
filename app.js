/* eslint-disable no-undef */
require("dotenv").config();

const cors    = require("cors");
const express = require("express");
const path    = require("path");

const port = process.env.PORT;

const app = express();

// CONFIG JSON AND FORM DATA
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// solve CORS
app.use(cors({credentials: true, origin: "https://test-reactgram-br.netlify.app"}));

// upload directore
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// db connection
const db = require("./config/db.js");
db()

// ROUTES
const router = require("./routes/Router.js");
app.use(router);

app.listen(port, () => {
  console.log("App rodando na porta " + port);
});
