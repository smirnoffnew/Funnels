const express = require('express');
const funnelRouter = express.Router();

const funnelController = require('../controllers/funnelController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const multerImage = require('../libs/multerScreenshot.js');
const multerBackground = require('../libs/multerBackground.js');

funnelRouter.get('/svg',
    enshureToken,
    verifyToken,
    funnelController.getFunnelsSvg);
funnelRouter.post('/url',
    enshureToken,
    verifyToken,
    funnelController.createUrlForCollaborate);
funnelRouter.post('/:projectId',
    enshureToken,
    verifyToken,
    funnelController.createFunnel);
funnelRouter.delete('/:projectId/:funnelId',
    enshureToken,
    verifyToken,
    funnelController.deleteFunnel);
funnelRouter.get('/:projectId',
    enshureToken,
    verifyToken,
    funnelController.getAllFunnelsInProject);
funnelRouter.get('/',
    enshureToken,
    verifyToken,
    funnelController.getAllCollaboratedToUserFunnels);
funnelRouter.get('/diagram/:funnelId',
    enshureToken,
    verifyToken,
    funnelController.getFunnelById);
funnelRouter.patch('/diagram/:funnelId',
    enshureToken,
    verifyToken,
    multerBackground.single('funnelBackground'),
    funnelController.addFunnelDiagramAndBackground);
funnelRouter.post('/template/:templateId',
    enshureToken,
    verifyToken,
    funnelController.createFunnelTemplate);
funnelRouter.patch('/:funnelId',
    enshureToken,
    verifyToken,
    funnelController.updateFunnel);
funnelRouter.post('/diagram/screenshot',
    enshureToken,
    verifyToken,
    multerImage.single('screenshot'),
    funnelController.getScreenshot);

funnelRouter.post('/node/createUrl',
    enshureToken,
    verifyToken,
    funnelController.createUrl
);

// funnelRouter.patch('/node/updateFunnel', 
// funnelController.addFunnelDescription
// )

// funnelRouter.patch('/node/updateNode', 
// funnelController.updateNode
// )

funnelRouter.get('/node/:hash',
    funnelController.counterUrl
);

funnelRouter.post('/node/getCounter',
    funnelController.getCounterByIdNodeAndIdFunnel
);

funnelRouter.get('/node/static/getCounter/:funnelId',
    funnelController.getCounterByIdFunnel
);

funnelRouter.patch('/node/counter',
    funnelController.counterNode
);

funnelRouter.delete('/node/delete/:nodeId/:funnelId',
    funnelController.deleteNodeById
);


module.exports = funnelRouter;
