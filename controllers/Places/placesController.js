import axios from 'axios'; 

const url = `https://places.googleapis.com/v1/places:searchText?key=${process.env.PLACES_API_KEY}`;
let request = {
    textQuery: "",
    locationBias: {
        circle: {
            center: {latitude: 37.7937, longitude: -122.4089},
            radius: 10000
        }
    }
  };

const headers = {headers: { 
    'Content-Type': 'application/json',
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location'
 }};

// 
// 'X-Goog-FieldMask': '*'
const getPlacesLocation = async (req, res) => {
    request.textQuery = req.body.textQuery;
    // request.locationBias.circle.center.latitude = req.body.location.lat;
    // request.locationBias.circle.center.longitude = req.body.location.lng;
    try {
        const response = await axios.post(url, request, headers);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching places:", error);
        throw error;
    }
};

const getPlacesLocationforGemini = async (textQuery, location) => {
    request.textQuery = textQuery;
    request.locationBias.circle.center.latitude = location.lat;
    request.locationBias.circle.center.longitude = location.lng;
    console.log(textQuery)
    try {
        const response = await axios.post(url, request, headers);
        if (response && response.data.places[0]) {
            console.log(response.data.places[0])
            return {lat: response.data.places[0].location.latitude, lng: response.data.places[0].location.longitude};
        }
        else{
            return location;
        }
    } catch (error) {
        console.error("Error fetching places:", error);
        throw error;
    }
};


export {getPlacesLocation, getPlacesLocationforGemini};
