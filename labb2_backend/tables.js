

//LÄGG TILL TABELLER

//Kopplar mot databasanslutning
const db = require("./db");

//Funktion som lägger till tabell för arbetslivserfarenhet
//Funkton körs vid serverstart

async function createTable() {
    try {
        //Skapar tabell med SQL-fråga till db
        await db.query(`
        CREATE TABLE IF NOT EXISTS workexperience (
            id SERIAL PRIMARY KEY,
            companyname TEXT NOT NULL,
            jobtitle TEXT NOT NULL,
            location TEXT NOT NULL,
            startdate DATE NOT NULL,
            enddate DATE NOT NULL,
            description TEXT NOT NULL
      );
    `);
        console.log("Table created");

        //Om något går fel visas felmeddelande i konsol
    } catch (error) {
        console.log("Error creating table", error);
    } 
}

//Exporterar funktion
module.exports = createTable;