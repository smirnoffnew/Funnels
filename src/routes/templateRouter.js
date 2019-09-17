const express = require('express');
const templateRouter = express.Router();

const templateController = require('../controllers/templateController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');


templateRouter.post('/:funnelId',
    enshureToken,
    verifyToken,
    templateController.createTemplate);
templateRouter.delete('/:templateId',
    enshureToken,
    verifyToken,
    templateController.deleteTemplate);
templateRouter.get('/', enshureToken,
    verifyToken,
    templateController.getAllOwnTemplates);
templateRouter.get('/:templateId',
    enshureToken,
    verifyToken,
    templateController.getTemplateById);
templateRouter.patch('/update/:templateId',
    enshureToken,
    verifyToken,
    templateController.updateTemplate);

module.exports = templateRouter;
