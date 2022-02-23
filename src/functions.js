const path = require('path');

const isLogin = (req, res, next) => {
    //console.log(req.session.userID);
    if (req.session.userID) next()
    else res.sendStatus(401);
}

const processRuta = ruta => {
    ruta = ruta.replace('R', '');
    while (ruta.indexOf('-') != -1) ruta = ruta.replace('-', '/');
    ruta = path.join('./data/Directorio', ruta);
    
    if (ruta.indexOf(path.join('./data/Directorio')) == 0) return ruta;
    else return undefined;
}

module.exports = {
    isLogin: isLogin,
    processRuta: processRuta
}