import express from "express";
import { generateItinerary} from "../controllers/GenAI/geminiController.js";

const router = express.Router();


router.get("/itinerary", generateItinerary)
        .post("/itinerary", generateItinerary);

export default router;