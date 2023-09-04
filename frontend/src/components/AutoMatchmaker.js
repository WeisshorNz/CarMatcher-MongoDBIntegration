import React, { useState } from "react";
import axios from "axios";
import "../styling/autoMatchmaker.css";
import tHeart from "../images/tHeart.png";
import carData from "../data/carData.json";
import { FaRegHeart } from "react-icons/fa";

function AutoMatchmaker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState("");
  const [matchingCars, setMatchingCars] = useState([]);

  // const apiUrl = "http://localhost:4000/api";
  const apiUrl = "https://m3-prediction-api.azurewebsites.net/api";
  const headers = {
    "Content-Type": "image/jpeg",
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const response = await axios.post(apiUrl, reader.result, { headers });

          const result = response.data;

          if (result && result.length >= 2) {
            const firstElement = result[0];
            const secondElement = result[1];

            const firstTagName = firstElement.tagName; // CarType
            const secondTagName = secondElement.tagName; // Colour

            const matchingCars = carData.filter(
              (car) =>
                car.carType.toLowerCase() === firstTagName.toLowerCase() &&
                car.color.toLowerCase() === secondTagName.toLowerCase()
            );

            setMatchingCars(matchingCars);

            setRecognitionResult(
              `Sounds like your type is ${firstTagName} & ${secondTagName}! 😉
            Here's a few suitors that just may work:`
            );
          } else {
            console.error("Insufficient data in the response.");
            setRecognitionResult(
              "No matches available 🥺 Maybe it's time to find a bike?"
            );
            setMatchingCars([]);
          }
        } catch (error) {
          console.error("Error uploading and recognising the image:", error);
        }
      };
    } catch (error) {
      console.error("Error uploading and recognising the image:", error);
    }
  };

  return (
    <div className="autoMatchmaker-container">
      <div className="heading-container">
        <img src={tHeart} alt="Heart Logo" className="heart-logo" />
        <h1>Turner's AutoMatchmaker</h1>
        <img src={tHeart} alt="Heart Logo" className="heart-logo" />
      </div>
      <div className="hero-container">
        <br />
        <div className="input-container">
          <h3>
            Upload an image below of what you're liking the look of, and we'll
            match you with one of our sweet rides for sale that's just your
            style!
          </h3>
          <input
            type="file"
            className="file-upload"
            alt="uploadedImage"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <br /> <br /> <br />
          <button>Match Me!</button>
        </div>{" "}
      </div>{" "}
      <div className="result-container">
        <h2>Auto-Matchmaking Result:</h2>
        <div className="result-image">
          {selectedImage && (
            <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
          )}
        </div>
        <p>{recognitionResult}</p>
        <h3>Matching Car Options:</h3>
        <div className="matching-cars">
          {matchingCars.map((car, index) => (
            <div className="car-card" key={index}>
              <img
                className="car-image"
                src={car.image}
                alt={`${car.make} ${car.model}`}
              />
              <div className="car-info">
                <p className="car-info-heading">
                  Car Type: <span>{car.carType}</span>
                </p>
                <p className="car-info-heading">
                  Make: <span>{car.make}</span>
                </p>
                <p className="car-info-heading">
                  Model:<span>{car.model}</span>
                </p>
                <p className="car-info-heading">
                  Year: <span>{car.year}</span>
                </p>
                <p className="car-info-heading">
                  Price: <span>${car.price}</span>
                </p>
                <p className="car-info-heading">
                  Color: <span>{car.color}</span>
                </p>
              </div>
              <div className="icon-container">
                <FaRegHeart className="heart-icon" />
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
    </div>
  );
}

export default AutoMatchmaker;
