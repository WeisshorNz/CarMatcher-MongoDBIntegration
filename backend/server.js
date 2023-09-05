const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

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

    const response = await axios.post(apiAddress,imageBinary,{ headers });

    // res.json(response.data);

           //filter to only capture high probabilty json data received only. 
    const highProbabilityPredictions = [];
    for (const prediction of response.data.predictions) {
      if (prediction.probability >= 0.6) {
        highProbabilityPredictions.push(prediction);
      }
    }

    res.json(highProbabilityPredictions);

  } catch (error) {
    console.error("Error making the prediction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while making the prediction." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}, yeah boy!`);
});
