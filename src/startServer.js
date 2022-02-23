const app = require('express')();

const PORT = 80;
app.listen(PORT, () => console.log(`Server iniciado en el puerto ${PORT}`));

module.exports = app;
