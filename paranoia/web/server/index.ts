import express, { json } from "express";

const PORT: number = +process.env.PARANOIA_PORT || 8080;

const app = express();

app.use(json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
