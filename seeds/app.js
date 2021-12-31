const mongoose = require("mongoose");
const Animal = require("../models/animal");
const Shelter = require("../models/shelter");
const names = require("./names");
const animals = require("random-animals-api");

mongoose.connect("mongodb://localhost:27017/animal-shelter");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDBAnimals = async () => {
  await Animal.deleteMany({});
  const allShelters = await Shelter.find({});
  for (let i = 0; i < 50; i++) {
    const randomYear = Math.floor(Math.random() * 16);
    const randomMonth = Math.floor(Math.random() * 12);
    const imgUrl = await animals.cat().catch((error) => console.error(error));
    const shelter = sample(allShelters);
    const newAnimal = new Animal({
      name: sample(names),
      shelter: shelter,
      age: { years: randomYear, months: randomMonth },
      type: "cat",
      image: imgUrl,
    });
    shelter.animals.push(newAnimal);
    await newAnimal.save();
    await shelter.save();
  }
};

const seedDBShelters = async () => {
  await Shelter.deleteMany({});
  await Shelter.insertMany([
    {
      name: "Przyjazna Buda",
      address: {
        country: "Poland",
        city: "Golub-Dobrzyn",
        street: "Pilsudskiego 12",
      },
      email: "przyjaznabuda@gmail.com",
    },
    {
      name: "Pelna miska",
      address: {
        country: "Poland",
        city: "Brodnica",
        street: "Sudecka 2",
      },
      email: "pelnamiska@gmail.com",
    },
    {
      name: "Reksio",
      address: {
        country: "Poland",
        city: "Rypin",
        street: "Waligóry 123",
      },
      email: "reksio@gmail.com",
    },
    {
      name: "Koci zakątek",
      address: {
        country: "Poland",
        city: "Torun",
        street: "Szosa Chelminska 22",
      },
      email: "kocizakatek@gmail.com",
    },
  ])
    .then(function () {
      mongoose.connection.close();
      console.log("Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
};

// seedDBShelters();

// seedDBAnimals().then(() => {
//   mongoose.connection.close();
//   console.log("created animals");
// });
