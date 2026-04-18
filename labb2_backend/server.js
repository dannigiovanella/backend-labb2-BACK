
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



// ROUTES
//Syntax - PostgreSQL

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

//2. POST - Lägga till arbetslivserfarenhet
app.post("/workexperience", async (req, res) => {
    try {
        //Hämtar data från request body 
        const {
            companyname,
            jobtitle,
            location,
            startdate,
            enddate,
            description
        } = req.body;

        //Validering. Inga tomma fält

        // Kontrollerar att alla fält är ifyllda
        if (
            !companyname ||
            !jobtitle ||
            !location ||
            !startdate ||
            !enddate ||
            !description
        ) {
            return res.status(400).json({
                error: "Alla fält måste fyllas i"
            });
        }

        //Tar bort eventuell whitespace(tex mellanslag) så detta inte ersätter ett värde
        if (
            companyname.trim() === "" ||
            jobtitle.trim() === "" ||
            location.trim() === "" ||
            description.trim() === ""
        ) {
            return res.status(400).json({
                error: "Fält får inte vara tomma"
            });
        }

        //INSERT - Insättning av värden med SQL-fråga
        //RETURNING * gör att den skapade posten returneras direkt från db 
        const insertQuery = `
            INSERT INTO workexperience 
            (companyname, jobtitle, location, startdate, enddate, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;


        //Kör insert queryn och skickar med värden
        const result = await db.query(insertQuery, [
            companyname,
            jobtitle,
            location,
            startdate,
            enddate,
            description
        ]);


        //Skickar tillbaka den skapade posten som JSON
        //Statuskod 201 för ny skapad post
        res.status(201).json({
            message: "Arbetserfarenhet tillagd",
            data: result.rows[0]
        });

    } catch (error) {
        //Om något går fel. I konsol:
        console.error("Fel vid POST:", error);
        //Statuskod 500 för fel med felmeddelande
        res.status(500).json({
            error: "Kunde inte läggat ill data"
        });
    }
});

//3. PUT - Uppdatera data

//4. DELETE - Ta bort data baserat på ID
try {
    //Hämtar id från url parametern
    const id = req.params.id;


    //SQL fråga för att radera en post baserat på id
    const result = await db.query(
        "DELETE FROM workexperience WHERE id = $1", [id]
    );


    // KOntroll för att se om något raderats.
    //Om 0 så finns inte post
    if (result.rowCount === 0) {
        //Statuskod 404 för att post inte hittas
        return res.status(404).json({
            error: "Posten finns inte"
        });
    }


    //Skickar tillbaka vad som raderades
    //message är vad som hände.
    res.json({
        message: "Post raderad",
    });


} catch (error) {
    //VId fel skrivs felmeddelande ut i konsol
    console.error("Fel vid DELETE:", error);
    //Statuskod 500 för fel
    res.status(500).json({
        error: "Kunde inte radera post"
    });
};


/////// STARTA SERVER /////

const PORT = process.env.PORT || 3000;

// Startar servern på en port från .env
app.listen(PORT, () => {
    console.log("server startad på port" + "" + PORT);
});