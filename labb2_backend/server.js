
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

        //Objekt för felmeddelande
        const errorMessage = {
            error: {
                message: "Kunde inte hämta data",
                status: 500
            }
        };

        res.status(500).json(errorMessage);
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


        //Validering. 
        // Kontrollerar att alla fält är ifyllda
        if (
            !companyname ||
            !jobtitle ||
            !location ||
            !startdate ||
            !enddate ||
            !description
        ) {

            //Objekt för felmeddelande
            const errorMessage = {
                error: {
                    message: "Alla fält måste fyllas i",
                    status: 400
                }
            };

            return res.status(400).json(errorMessage);
        }

        //Tar bort eventuell whitespace(tex mellanslag) så detta inte ersätter ett värde
        if (
            companyname.trim() === "" ||
            jobtitle.trim() === "" ||
            location.trim() === "" ||
            description.trim() === ""
        ) {

            //Objekt för felmeddelande
            const errorMessage = {
                error: {
                    message: "Fält får inte vara tomma",
                    status: 400
                }
            };

            return res.status(400).json(errorMessage);
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

        //Objekt för felmeddelande. Statuskod 500 för fel med felmeddelande
        const errorMessage = {
            error: {
                message: "Kunde inte lägga till data",
                status: 500
            }
        };
        return res.status(500).json(errorMessage);
    }
});

//3. PUT - Uppdatera data

//4. DELETE - Ta bort data baserat på ID
app.delete('/workexperience/:id', async (req, res) => {
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

            //Objekt för felmeddelande. Statuskod 404 för att post inte hittas
            const errorMessage = {
                error: {
                    message: "Posten finns inte",
                    status: 404
                }
            };

            return res.status(404).json(errorMessage);
        }


        //Skickar tillbaka vad som raderades
        //message är vad som hände.
        res.json({
            message: "Post raderad",
        });


    } catch (error) {
        //VId fel skrivs felmeddelande ut i konsol
        console.error("Fel vid DELETE:", error);

        //Objket för felmeddelande. Statuskod 500 för fel
        const errorMessage = {
            error: {
                message: "Kunde inte radera post",
                status: 500
            }
        };

        return res.status(500).json(errorMessage);
    }
});


/////// STARTA SERVER /////

const PORT = process.env.PORT || 3000;

// Startar servern på en port från .env
app.listen(PORT, () => {
    console.log("server startad på port" + "" + PORT);
});