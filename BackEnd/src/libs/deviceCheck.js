module.exports = function (req, res, next){
    let device = req.body.device
    if( device.match(/Android/i)
    || device.match(/webOS/i)
    || device.match(/iPhone/i)
    || device.match(/iPad/i)
    || device.match(/iPod/i)
    || device.match(/BlackBerry/i)
    || device.match(/Windows Phone/i)
    ){
       return 'mobile';
     }
    else {
       return 'desktop';
     }
}