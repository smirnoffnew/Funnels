const express = require('express');
const collaboratorRouter = express.Router();

const collaboratorController = require('../controllers/collaboratorController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const lastModified = require('../libs/lastModified.js');
const enshureCollaborateToken = require('../libs/enshureCollaborateToken.js');
const lastActive = require('../libs/lastActive');


collaboratorRouter.post('/',
    enshureToken,
    //enshureCollaborateToken,
    verifyToken,
    lastActive,
    collaboratorController.createCollaborator);

collaboratorRouter.patch('/:profileId/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    collaboratorController.changeCollaboratorPermissions);

collaboratorRouter.delete('/:profileId/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    collaboratorController.deleteCollaborator);

collaboratorRouter.get('/',
    enshureToken,
    verifyToken,
    lastActive,
    lastModified,
    collaboratorController.getAllFunnelsCollaborators);

collaboratorRouter.get('/funnel/:funnelId',
    enshureToken,
    lastModified,
    verifyToken,
    lastActive,
    collaboratorController.getAllCollaboratorsByFunnelId);


module.exports = collaboratorRouter;
