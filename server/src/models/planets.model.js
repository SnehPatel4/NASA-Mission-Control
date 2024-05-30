const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  const promise = new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets are found!`);
        resolve();
      });
  });
}
async function getAllPlanets() {
  return await planets.find({}, {
    '_id': 0,
    '__v': 0,
  });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch(err) {
    console.log(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
/*
 - createReadStream() is used to open file as a readable stream that returns EventEmitter   that will be handle later
 - we use 'fs' module because the csv-parse module's parse() does not take directly .csv file for parsing it take 'streams' of data so we read data in stream using createReadStream()
 - parse() function converts the streams into array of objects
 - we can give input streams to parse() using pipe()
 - pipe() is used to connects source and destination. here i/p streams provided to parse() so parse() return array of objects. 
 - we give option comment to tell comment start with '#' and column: true means it gives each row of .csv(comma seprated value) as JS object. 
 - 'habitable planets' means the planets where there is some possiblity of life (planets like earth)
 - from .csv file there are many colums from among them we use some columns that describe some propety for habitable planet :
   * koi_disposition column describe current status of planets
   * koi_insol column describe amount of light the planet get for habitable planet it's range should be 0.36 to 1.11
   * koi_prad columns describe the radius of planet for habitable planet it's radius should be less than 1.6
 */
