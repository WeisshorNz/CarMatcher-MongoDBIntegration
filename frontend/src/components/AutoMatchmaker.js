import React, { useState } from "react";
import axios from "axios";
import "../styling/autoMatchmaker.css";
import tHeart from "../images/tHeart.png";
import { FaRegHeart } from "react-icons/fa";

function AutoMatchmaker() {
  // const [selectedImage, setSelectedImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState("");
  const [matchingCars, setMatchingCars] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  const apiUrl = "http://localhost:4000/api/analyse-image";

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
          const response = await axios.post(apiUrl, reader.result);

          const { carType, carColor } = response.data;

          setRecognitionResult(
            `Sounds like your type is ${carType} & ${carColor}! 😉
            Here's a few suitors that just may work:`
          );

          searchMatchingCars(carType, carColor);

          setUploadedImage(URL.createObjectURL(file));
        } catch (error) {
          console.error("Error uploading and recognising the image:", error);
        }
      };
    } catch (error) {
      console.error("Error uploading and recognising the image:", error);
    }
  };

  const searchMatchingCars = async (carType, carColor) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/search-cars",
        {
          carType,
          carColor,
        }
      );

      setMatchingCars(response.data);
    } catch (error) {
      console.error("Error searching for cars:", error);
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
          {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}
        </div>
        <p>{recognitionResult}</p>
        <h3>Matching Car Options:</h3>
        <div className="matching-cars">
          {/* Display the matching cars */}
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
