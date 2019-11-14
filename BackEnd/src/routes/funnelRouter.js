const express = require('express');
const funnelRouter = express.Router();

const funnelController = require('../controllers/funnelController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const multerImage = require('../libs/multerScreenshot.js');
const multerBackground = require('../libs/multerBackground.js');
const lastActive = require('../libs/lastActive');

/**test svg */
funnelRouter.get('/one_svg',
    
    funnelController.getFunnelsSvg);
/**test svg */
funnelRouter.get('/svg',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.getFunnelsSvg);
funnelRouter.post('/url',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.createUrlForCollaborate);
funnelRouter.post('/:projectId',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.createFunnel); 
funnelRouter.delete('/:projectId/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.deleteFunnel);
funnelRouter.get('/:projectId',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.getAllFunnelsInProject);
funnelRouter.get('/',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.getAllCollaboratedToUserFunnels);
funnelRouter.get('/diagram/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.getFunnelById);
funnelRouter.patch('/diagram/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    multerBackground.single('funnelBackground'),
    funnelController.addFunnelDiagramAndBackground); 
funnelRouter.post('/template/:templateId',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.createFunnelTemplate);
funnelRouter.patch('/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.updateFunnel);
funnelRouter.post('/diagram/screenshot',
    enshureToken,
    verifyToken,
    lastActive,
    multerImage.single('screenshot'),
    funnelController.getScreenshot); 

funnelRouter.post('/node/createUrl',
    enshureToken,
    verifyToken,
    lastActive,
    funnelController.createUrl
);

funnelRouter.get('/node/getStatus/:funnelId/:nodeId', 
    // enshureToken,
    // verifyToken,
    funnelController.getNodeStatus
)

funnelRouter.patch('/node/status', 
    // enshureToken,
    // verifyToken,
    funnelController.updateStatus
);

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

funnelRouter.get('/node/getallstatus/:funnelId',
    funnelController.getAllFunnelsNodeDevStatus
);


module.exports = funnelRouter;
