
//Databasanslutning med PostgreSQL och Render

//Läsr nin data från .env
require("dotenv").config();

///Importerar Pool från pg för hantering av anrop
const { Pool } = require("pg");

const pool = new Pool({
    //URL-anslutning till db i Render
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

//Exporterar pool
module.exports = pool;


