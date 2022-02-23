const app = require('./startServer');
const { User } = require('./dataBase');
const { isLogin, processRuta} = require('./functions');
const fs = require('fs');
const path = require('path');

require('./Middleware');

//comprobacion de que el server esta levantado
app.get('/', isLogin, (req, res) => res.sendStatus(200) );

// ---------------------- Cuentas----------------------------
app.post('/register', (req, res) => {
    const data = req.body;
    const user = new User.model({
        userName: data.username,
        email: data.email,
        password: data.password
    });
    
    user.save((err, doc) => {
        if (err) {
            if (err.keyValue && err.keyValue.userName) {
                res.status(400).send('El nombre que intenta ingresar ya esta registrado');
            }
            else if (err.keyValue && err.keyValue.email) {
                res.status(400).send('El correo que intenta ingresar ya esta registrado');
            }
            else res.status(400).send('Tubimos un error inesperado');
        } else res.sendStatus(200);
    });
});
app.post('/login', async (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    let respuesta = (await User.buscarUser(user, password))[0];
    if (typeof respuesta != 'string') {
        req.session.userID = respuesta._id;
        res.status(200).send();
    }
    else res.status(400).send(respuesta);
});
app.get('/logout', isLogin, (req, res) => {
    req.session.destroy();
    res.status(200).send('Success!');
});

// ----------------------- rutas ----------------------------
app.get('/rutaD/file/:ruta' /*!!!cambiar 'file' por archivo o parecido*/, isLogin, (req, res) => res.download(processRuta(req.params.ruta)));
app.get('/ruta/file/:ruta', isLogin, async (req, res) => {
    try {
        let ruta = processRuta(req.params.ruta);
        let dir = fs.existsSync(ruta) ? await fs.promises.opendir(ruta) : undefined;
        let contenido = { archivos: [], rutas: []};

        if (dir) {
            for await (const dirent of dir) {
                if (dirent.isDirectory()) contenido.rutas.push(dirent.name)
                else {contenido.archivos.push(dirent.name)};
            }
            res.status(200).send(contenido);
        } else res.status(404).send();
    } catch (err) {
        console.log(err);
    }
});
app.post('/ruta/file/:ruta', isLogin, (req, res) => {
    let ruta = processRuta(req.params.ruta);
    if (req.headers.tipo == 'uploadFiles') {
        console.log('reciviendo archivo');
        
        //mejorar fon forEach() !!!!!!!!!!!!!!!!!!
        for (const i in req.files) {
            let file = req.files[i];
            let rutaDestino = path.join('./', ruta, file.name);
            file.mv(rutaDestino);
            console.log(`Archivo ${file.name} resivido en ${rutaDestino}`);
        };
        res.status(200).send();
    }
    else if (req.headers.tipo == 'newFolder') {
        try {
            console.log('creando una nueva carpeta');
            
            if (!fs.existsSync(ruta)) {
                fs.mkdirSync(ruta);
                console.log(`Carpeta creada en ${ruta}`);
                res.status(200).send();
            }
            else {
                console.log('La carpeta ya existe');
                res.sendStatus(400);
            }
                
        } catch (err) {
            console.log(err);
        }
    }
    else res.sendStatus(400);
});