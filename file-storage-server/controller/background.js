const fs = require("fs");
const lignator = require('lignator');
module.exports = {
  uploadBg: async function (req, res) {
    res.json({
      link: `${req.get('host')}/funnelBackgrounds/${req.body.funnelId}/${req.file.filename}`,
    });
  },
  deleteBg: async function (req, res) {
    let folderArray = req.body.folder
    folderArray.map(folder => {
      let dirPath = `${process.cwd()}/${process.env.BACKGROUND_STORE}${folder}`;
      return new Promise((resolve, reject) => {
          fs.exists(dirPath, function (exists) {
            if (!exists) reject()
            else resolve(dirPath)
          })
        }).then(dirPath => {
          lignator.remove(dirPath);
          res.json({
            body: `Folder of funnel with id: ${req.body.folder} deleted successfully`
          });
        })
        .catch(() => {
          res
            .status(400)
            .json({
              error: `Folder of funnel with id: ${req.body.folder} not found in the filestorage`
            });
        });
    })
  }
};