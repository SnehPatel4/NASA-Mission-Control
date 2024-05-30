const http = require("http");

require('dotenv').config();

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require('./models/launches.model');
const { mongoConnect } = require("./services/mongo");

const PORT = process.env.PORT || 8000; // this helps when you host the site host can configure port accourding to his requirement otherwise site is run on by default 8000 port.

const server = http.createServer(app);

// we have to load planets before server is start listening.
async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
