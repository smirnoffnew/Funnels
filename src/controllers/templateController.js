const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const Template = require('../models/template.js');
const Funnel = require('../models/funnel.js');


module.exports = {
    createTemplate: async function (req, res) {
        Funnel.findById(req.params.funnelId)
            .exec()
            .then(result => {
                new Template({
                    _id: new mongoose.Types.ObjectId,
                    templateName: req.body.templateName,
                    templateAuthor: result.funnelAuthor,
                    templateBody: result.funnelBody
                })
                    .save()
                    .then(result => {
                        res
                            .status(200)
                            .json({message: "Template saved successfully!"});
                    })

            })
            .catch(err => {
                res
                    .status(400)
                    .json({error: err.message});
            });
    },
    deleteTemplate: async function (req, res) {
        Template
            .findOneAndDelete({_id: req.params.templateId})
            .exec()
            .then(result =>{
                res
                    .status(200)
                    .json({message: "Template deleted succesfully!"});
            })
    },
    getAllOwnTemplates: async function (req, res) {
        Template
            .find({templateAuthor: req.authData.profile._id})
            .exec()
            .then(templates =>{
                res
                    .status(200)
                    .json({data: templates});
            })
    },
    getTemplateById: async function (req, res) {
        Template
            .findOne({_id: req.params.templateId})
            .exec()
            .then(template =>{
                res
                    .status(200)
                    .json({data: template});
            })
    },
    updateTemplate: async function (req, res) {
        Template
            .findOneAndUpdate({_id: req.params.templateId},
                {templateBody:req.body.templateBody},
                {new: true})
            .exec()
            .then(template =>{
                res
                    .status(200)
                    .json({message:"Template updated successfully!", data: template});
            })
    },
};