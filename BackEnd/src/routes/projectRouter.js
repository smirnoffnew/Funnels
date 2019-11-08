const express = require('express');
const projectRouter = express.Router();

const projectController = require('../controllers/projectController.js');
const enshureToken = require('../libs/enshureToken.js');
const lastModified = require('../libs/lastModified.js');
const verifyToken = require('../libs/verifyToken.js');
const lastActive = require('../libs/lastActive');


projectRouter.post('/',
    enshureToken,
    verifyToken,
    lastActive,
    projectController.createProject); 
projectRouter.delete('/:project_id/:col_id',
    enshureToken,
    projectController.deleteCollaborator);
projectRouter.delete('/:project_id',
    enshureToken,
    verifyToken,
    lastActive,
    projectController.deleteProject);
projectRouter.get('/',
    enshureToken,
    lastModified,
    verifyToken,
    lastActive,
    projectController.getAllUserProject);
projectRouter.patch('/:project_id',
    enshureToken,
    projectController.addCollaborator);


module.exports = projectRouter;
