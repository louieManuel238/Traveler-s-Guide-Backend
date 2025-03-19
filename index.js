import express from "express";
import cors from 'cors';
import 'dotenv/config';
import geminiRoute from './routes/GeminiRoute.js';
import placesRoute from './routes/PlacesRoute.js';
const PORT = process.env.PORT ||8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('assets'));


app.use("/api/gemini",geminiRoute);
app.use("/api/places",placesRoute);
app.listen(PORT, () => console.log(`App running on port ${PORT}`));