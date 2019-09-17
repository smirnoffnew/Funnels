const express = require('express');
const collaboratorRouter = express.Router();

const collaboratorController = require('../controllers/collaboratorController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const lastModified = require('../libs/lastModified.js');
const enshureCollaborateToken = require('../libs/enshureCollaborateToken.js');


collaboratorRouter.post('/',
    enshureToken,
    enshureCollaborateToken,
    verifyToken,
    collaboratorController.createCollaborator);
collaboratorRouter.patch('/:profileId/:funnelId',
    enshureToken,
    verifyToken,
    collaboratorController.changeCollaboratorPermissions);
collaboratorRouter.delete('/:profileId/:funnelId',
    enshureToken,
    verifyToken,
    collaboratorController.deleteCollaborator);
collaboratorRouter.post('/',
    enshureToken,
    enshureToken,
    lastModified,
    collaboratorController.getAllFunnelsCollaborators);

module.exports = collaboratorRouter;
