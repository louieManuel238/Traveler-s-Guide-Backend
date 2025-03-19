import { GoogleGenerativeAI } from "@google/generative-ai";
import schema from './schema.json' with { type: "json" };
import {getPlacesLocationforGemini} from '../Places/placesController.js';

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash" ,
    generationConfig:{
    responseMimeType: "application/json",
    responseSchema: schema,
  },

});

const generateItinerary = async (req, res) => {
    const {place, startDate, endDate, budget, squad, adventure, pace, 
        accommodation, transportation, dietaryRestrictions, specialRequirements} = req.body.message;
    let selectedAdventures = Object.keys(adventure).filter(key => adventure[key]);
    let selectedDietaryRestrictions = Object.keys(dietaryRestrictions).filter(key => dietaryRestrictions[key]);
    let selectedSpecialRequirements = Object.keys(specialRequirements).filter(key => specialRequirements[key]);
    let selectedTransportation = Object.keys(transportation).filter(key => transportation[key]);
    let selectedAccommodation = Object.keys(accommodation).filter(key => accommodation[key]);

    selectedAdventures = selectedAdventures.length > 0 
        ? selectedAdventures 
        : ["no preference"];
        
    selectedDietaryRestrictions = selectedDietaryRestrictions.length > 0 
        ? selectedDietaryRestrictions 
        : ["no preference"];
        
    selectedSpecialRequirements = selectedSpecialRequirements.length > 0 
        ? selectedSpecialRequirements 
        : ["no preference"];
        
    selectedTransportation = selectedTransportation.length > 0 
        ? selectedTransportation 
        : ["no preference"];
        
    selectedAccommodation = selectedAccommodation.length > 0 
        ? selectedAccommodation 
        : ["no preference"];


    const prompt = `Create a travel itinerary to ${place} 
    from ${startDate} to ${endDate}, here are my preferences, 
    Budget: ${budget}, squad: ${squad}, pace of travel: ${pace}
    accommodation: ${selectedAccommodation}, transportation: ${selectedTransportation},
    adventure preference: ${selectedAdventures}, dietary restrcitions: ${selectedDietaryRestrictions},
    other requirements, ${selectedSpecialRequirements}.
    include top attractions. 
    make the most of the day 
    `;
   

    try{
        if(place ==="" || startDate == "" || endDate == "") return res.status(404).send("Missing Basic requirements (place, start-end date")

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());
        if (Object.keys(data).length !== 0) {
            for (const day of data.Activities) {
                for (const activity of day.activity) {
                    const textQuery = activity.place;
                    const locationBias = {
                        lat: Number(activity.location.lat),
                        lng: Number(activity.location.lng),
                    };
                    activity.location = await getPlacesLocationforGemini(textQuery, locationBias);
                }
            }
        }
        
        res.json(data );
    }catch(error){
        console.error("No Intinerary Data Result:", error);
    }
};

export {generateItinerary};