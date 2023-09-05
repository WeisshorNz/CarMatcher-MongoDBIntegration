#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { addCar, findCar } from "./index.js";

const { prompt } = inquirer;
const program = new Command();

// Car Questions
const questions = [
  {
    type: "input",
    name: "body",
    message: "Body Type",
  },
  {
    type: "input",
    name: "model",
    message: "Car Model",
  },
  {
    type: "input",
    name: "make",
    message: "Car Make",
  },
  {
    type: "input",
    name: "color",
    message: "Car Color",
  },
  {
    type: "input",
    name: "year",
    message: "Car Year",
  },
  {
    type: "input",
    name: "price",
    message: "Car Price",
  },
];

program.version("1.0.0").description("Car Management System");

// program
//   .command("add <body> <model> <make> <color> <year> <price>")
//   .alias("a")
//   .description("Add a Car")
//   .action((body, model, make, color, year, price) => {
//     addCar({ body, model, make, color, year, price });
//   });

program
  .command("add")
  .alias("a")
  .description("Add a Car")
  .action(() => {
    prompt(questions).then((answers) => {
      addCar(answers);
    });
  });

program
  .command("find <name>")
  .alias("f")
  .description("Find a Car")
  .action((name) => findCar(name));

program.parse(process.argv);
