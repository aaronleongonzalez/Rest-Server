require('./config/config')

const express = require('express')
const mongoose = require('mongoose');

mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);



const colors = require('colors');

const app = express()

const bodyParser = require('body-parser');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use (require('./routes/usuario'))

/*mongoose.connect('mongodb://localhost:27017/cafe', (err, res)=>{
    if (err) throw  err;

    console.log('====== Base de datos ONLINE ======'.green)
});*/

let conex = async () => {
    await mongoose.connect('mongodb://localhost:27017/cafe', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

conex().then(() => console.log('------ BD Conectada -------'.green))
    .catch(err => console.log(err));



app.listen(process.env.PORT, ()=> {
    console.log(`====== Servidor activo en el puerto ${process.env.PORT} ======`.yellow);
})
