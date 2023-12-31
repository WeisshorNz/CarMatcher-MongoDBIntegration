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
  });
};

// Update Car
const updateCar = (_id, car) => {
  try {
    const objectId = mongoose.Types.ObjectId.createFromHexString(_id); // Convert _id to ObjectId
    Car.findOneAndUpdate({ _id: objectId }, car, { new: true }).then(
      (updatedCar) => {
        if (updatedCar) {
          console.info("Car Updated!");
        } else {
          console.error("Car not found.");
        }
        mongoose.connection.close();
      }
    );
  } catch (error) {
    console.error("Invalid _id:", error);
  }
};

// List All Cars
const listCars = () => {
  Car.find().then((cars) => {
    console.info(cars);
    console.info(`${cars.length} cars`);
    mongoose.connection.close();
  });
};

// Remove Car
const removeCar = (_id, car) => {
  Car.findOneAndRemove({ _id }, car).then((car) => {
    console.info("Car Removed!");
    mongoose.connection.close();
  });
};

// Find Car
const findCar = (name) => {
  // Make case insensitive
  const search = new RegExp(name, "i");
  Car.find({ $or: [{ body: search }, { color: search }] }).then((car) => {
    console.info(car);
    console.info(`${car.length} matches`);
    mongoose.connection.close();
  });
};

// Export All Methods
export { addCar, findCar, updateCar, removeCar, listCars };
