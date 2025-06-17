import express from "express";
import dotenv from "dotenv";

//?config dotenv and port no.
dotenv.config();
const port = process.env.PORT;

//? Create the instance for the express
const app = express();

//* Make our server listen
app.listen(port, () => console.log(`Server is running on this port:${port}`));
