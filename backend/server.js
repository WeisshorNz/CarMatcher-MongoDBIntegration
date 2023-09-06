import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Car from "../mongoDB/models/car.js";

dotenv.config();

const app = express();
const port = 4000;
const apiAddress = process.env.API_ADDRESS;

app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "POST",
};

app.use(cors(corsOptions));

mongoose.connect("mongodb://localhost:27017/carcli", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const carTypeKeywords = ["sedan", "suv", "hatchback", "pickup", "truck"];
const colorKeywords = ["black", "blue", "grey", "white", "red"];

app.post("/api/analyse-image", async (req, res) => {
  try {
    const imageBinary = req.body;
    const predictionKey = process.env.PREDICTION_KEY;
    const contentType = process.env.CONTENT_TYPE;

    const headers = {
      "Prediction-Key": predictionKey,
      "Content-Type": contentType,
    };
    const response = await axios.post(apiAddress, imageBinary, { headers });

    const predictions = response.data.predictions;

    const categorizedPredictions = {
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

      return highestPrediction;
    }

    res.json({ carType: highestCarType, carColor: highestColor });
  } catch (error) {
    console.error("Error analysing the image:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analysing the image." });
  }
});

app.post("/api/search-cars", async (req, res) => {
  try {
    const { carType, carColor } = req.body;

    const matchingCars = await Car.find({
      carType: carType,
      color: carColor,
    }).limit(6);

    res.json(matchingCars);
  } catch (error) {
    console.error("Error searching for cars:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for cars." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}, yeah boy!`);
});
