const projectsRouter = require ('./projectsRouter');
const actionsRouter = require ('./actionsRouter');
const express = require('express');
const server = express();


server.use(express.json());
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

module.exports = server