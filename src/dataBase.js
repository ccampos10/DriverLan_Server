const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/driverLan', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

mongoose.connection.on('open', () => {console.log('Se a conectado la base de datos')})
mongoose.connection.on('error', (err) => {console.log('Se produjo un error: ', err)})

const estructuraUser = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const modelUser = mongoose.model('user', estructuraUser);

const buscarUser = async (user, password) => {
    let data = await modelUser.find({userName: user})
    if (data.length == 1) {
        if (data[0].password == password) return data
        else return ['El password es incorrecto']
    }
    else if (data.length > 1) return ['Error inseperado en la base de datos']
    else {
        data = await modelUser.find({email: user})
        if (data.length == 1) {
            if (data[0].password == password) return data
            else return ['El password es incorrecto']
        }
        else if (data.length > 1) return ['Error inseperado en la base de datos']
        else return ['El usuario es incorrecto']
    }
}

module.exports = {
    User: {
        model: modelUser,
        buscarUser: buscarUser
    }
}