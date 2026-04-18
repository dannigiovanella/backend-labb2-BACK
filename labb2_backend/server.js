
////// SERVER /////

//importerar Express
const express = require("express");
//Importerar CORS
const cors = require("cors");
//Importerar databasanslutning
const db = require("./db");
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



// ROUTEs

// 1. GET - Hämta arbetslivserfarenhet

app.get("/workexperience", async (req, res) => {
    try {
        // Skickar SQL-fråga till databasen om att hämta alla poster
        const result = await db.query("SELECT * FROM workexperience");

        // Skickar tillbaka datan som JSON
        res.json(result.rows);

    } catch (error) {
        // Om något går fel visas felmeddelande i konsol samt statuskod 500
        console.error("Fel vid hämtning:", error);
        res.status(500).json({ message: "Kunde inte hämta data" });
    }
});

//2. POST - Lägga till data

//3. PUT - Uppdatera data

//4. DELETE - Ta bort data




/////// STARTA SERVER /////

const PORT = process.env.PORT || 3000;

// Startar servern på en port från .env
app.listen(PORT, () => {
    console.log("server startad på port" + "" + PORT);
});