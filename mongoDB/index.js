import mongoose from "mongoose";
import Car from "./models/car.js";

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to db
const db = mongoose.connect("mongodb://localhost:27017/carcli", {
  useNewUrlParser: true, // Use the new URL parser
  useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
});

// Add Car
const addCar = (car) => {
  Car.create(car).then((car) => {
    console.info("New Car Added!");
    mongoose.connection.close();
    return car; // Close the connection
  });
};

// Find Car
const findCar = (name) => {
  // Make case insensitive
  const search = new RegExp(name, "i");
  Car.find({ $or: [{ body: search }, { color: search }] }).then((car) => {
    console.info(car);
    console.info(`${car.length} matches`);
    mongoose.connection.close(); // Close the connection
  });
};

// Export All Methods
export { addCar, findCar };
