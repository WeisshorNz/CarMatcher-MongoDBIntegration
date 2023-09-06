const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const apiAddress = process.env.API_ADDRESS;

app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));
app.use(cors());

app.post("/api", async (req, res) => {
  try {
    const imageBinary = req.body;
    const predictionKey = process.env.PREDICTION_KEY;
    const contentType = process.env.CONTENT_TYPE;

    const headers = {
      "Prediction-Key": predictionKey,
      "Content-Type": contentType,
    };

    const response = await axios.post(apiAddress, imageBinary, { headers });

    const carTypeKeywords = ["sedan", "suv", "hatchback", "pickup", "truck"];
    const colorKeywords = ["black", "blue", "grey", "white", "red"];

    const predictions = response.data.predictions;

    let categorizedPredictions = {
      carType: [],
      color: [],
    };

    for (const prediction of predictions) {
      const predictionText = prediction.tagName.toLowerCase();

      if (carTypeKeywords.includes(predictionText)) {
        categorizedPredictions.carType.push(predictionText);
      } else if (colorKeywords.includes(predictionText)) {
        categorizedPredictions.color.push(predictionText);
      }
    }

    const highestCarType = getHighestProbability(
      categorizedPredictions.carType,
      predictions
    );
    const highestColor = getHighestProbability(
      categorizedPredictions.color,
      predictions
    );

    function getHighestProbability(category, predictions) {
      let highestProbability = -1;
      let highestPrediction = "";

      for (const prediction of predictions) {
        const predictionText = prediction.tagName.toLowerCase();

        if (
          category.includes(predictionText) &&
          prediction.probability > highestProbability
        ) {
          highestProbability = prediction.probability;
          highestPrediction = predictionText;
        }
      }

      return capitalizeFirstLetter(highestPrediction);
    }

    function capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    //  categorizedPredictions = {
    //    carType: capitalizeFirstLetter(highestCarType),
    //    color: capitalizeFirstLetter(highestColor),
    //  };

    res.json({
      carType: capitalizeFirstLetter(highestCarType),
      carColor: capitalizeFirstLetter(highestColor),
    });

    
  } catch (error) {
    console.error("Error making the prediction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while making the prediction." });
  }
});
// Connect to the MongoDB database
mongoose.connect("mongodb://localhost:27017/luis_cli", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the 'cars' collection
const carSchema = new mongoose.Schema({
  body: String,
  color: String,
  image: String,
  make: String,
  model: String,
  price: Number,
  year: Number,
});

// Create a model based on the schema
const Car = mongoose.model('Car', carSchema);


const categorizedPredictions = {
  "carType": "Truck",
  "carColor": "Black"
};

// Define a route to fetch data based on categorizedPredictions
app.get('/api/cars', async (req, res) => {
  try {
    // Use Mongoose to query the 'cars' collection based on categorizedPredictions
    const cars = await Car.find({
      body: categorizedPredictions.carType,
      color: categorizedPredictions.carColor,
    });

    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data from the database.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}, yeah boy!`);
});
