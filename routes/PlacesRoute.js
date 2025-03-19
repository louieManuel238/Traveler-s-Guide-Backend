import express from "express";
import {getPlacesLocation, getPlacesLocationforGemini} from "../controllers/Places/placesController.js";

const router = express.Router();


router.get("/search", getPlacesLocation);
router.get("/getPlace", getPlacesLocationforGemini);

export default router;