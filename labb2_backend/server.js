
////// SERVER /////

//importerar Express
const express = require("express");
//Importerar CORS
const cors = require("cors");
//Importerar funktion som skapar databastabell
const createTable = require("./tables");

//Hämtar data/variabler från .env-fil (ex: PORT och DATABAS_URL)
require("dotenv").config();


//Skapar express applikation
const app = express();

//CORS - Tillåter requests från andra domäner
app.use(cors());
//Gör att server kan läsa JSON data
app.use(express.json());

///// DATABAS - via db.js och tables.js ////

//Kör funktion som skapar tabell
createTable();


/////// STARTA SERVER /////

const PORT = process.env.PORT;

// Startar servern på en port från .env
app.listen(PORT, () => {
    console.log("server startad på port" + "" + PORT);
});