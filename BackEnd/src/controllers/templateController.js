const mongoose   = require("mongoose");
const Template   = require('../models/template.js');
const Funnel     = require('../models/funnel.js');


module.exports = {

    createTemplate: async function (req, res) {
        Funnel.findById(req.params.funnelId)
            .exec()
            .then(result => {
                return new Template({
                    _id: new mongoose.Types.ObjectId,
                    templateName: req.body.templateName,
                    templateAuthor: result.funnelAuthor,
                    templateBody: result.funnelBody
                })
                .save()
            })
            .then(result => {
                return res.status(200).json({
                    message: `Template ${result.templateName} saved successfully!`
                });
            })
            .catch(err => {
                return res.status(400).json({
                    error: err.message
                })
            });
    },

    deleteTemplate: async function (req, res) {
        Template
            .findOneAndDelete({_id: req.params.templateId})
            .exec()
            .then(result =>{
                return res.status(200).json({
                        message: `Template  ${result.templateName} deleted successfully!`
                    });
            })
            .catch(err => {
                return res.status(400).json({
                    error: err.message
                })
            });
    },

    getAllOwnTemplates: async function (req, res) {
        Template
            .find({templateAuthor: req.authData.profileId})
            .exec()
            .then(templates =>{
                res.status(200)
                    .json({data: templates});
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },

    getTemplateById: async function (req, res) {
        Template
            .findOne({_id: req.params.templateId})
            .exec()
            .then(template =>{
                res.status(200)
                    .json({data: template});
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },

    updateTemplate: async function (req, res) {
        Template
            .findOneAndUpdate(
                {_id: req.params.templateId},
                {templateBody: req.body.templateBody},
                {new: true}
            )
            .exec()
            .then(template =>{
                return res.status(200).json({
                    message: "Template updated successfully!",
                    data: template
                });
            })
            .catch(err => {
                return res.status(400).json({
                    error: err.message
                })
            });
    },
};
