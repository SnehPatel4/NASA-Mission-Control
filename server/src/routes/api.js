const express = require('express');

const planetRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use('/launches', launchesRouter);
api.use('/planets', planetRouter);

module.exports = api;