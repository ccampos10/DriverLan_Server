const app = require('./startServer');
const { json } = require('express');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cors = require('cors');

let ListaBlanca = [];

const opcionesCors = {
    origin: (o, callback) => {
        if (ListaBlanca.indexOf(o) !== -1) {
            callback(null, true);
        }
        else {
            ListaBlanca.push(o);
            callback(null, true);
        }
    },
    credentials: true,
    allowedHeaders: [
        'content-type',
        'tipo'
    ]
}

app.use(cors(opcionesCors));
app.use(fileUpload());
app.use(json());
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    // cookie: {'sameSite': 'none', 'secure': 'true'}
}));