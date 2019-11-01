const express = require('express');
const templateRouter = express.Router();

const templateController = require('../controllers/templateController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const lastActive = require('../libs/lastActive');


templateRouter.post('/:funnelId',
    enshureToken,
    verifyToken,
    lastActive,
    templateController.createTemplate);
templateRouter.delete('/:templateId',
    enshureToken,
    verifyToken,
    lastActive,
    templateController.deleteTemplate);
templateRouter.get('/', enshureToken,
    verifyToken,
    lastActive,
    templateController.getAllOwnTemplates);
templateRouter.get('/:templateId',
    enshureToken,
    verifyToken,
    lastActive,
    templateController.getTemplateById);
templateRouter.patch('/update/:templateId',
    enshureToken,
    verifyToken,
    lastActive,
    templateController.updateTemplate);

module.exports = templateRouter;
