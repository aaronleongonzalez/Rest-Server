const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore');
const Usuario = require('../models/usuario')

app.get('/usuario', function (req, res) {

    let usuarios;

    let conex = async ()=> {
       usuarios =  await Usuario.find({estado:true})
           .limit(Number(req.query.cantidad || 0));
    }

    conex().then(() => {
        console.log(`------ Usuarios -------`.rainbow);
        console.log({usuarios});
        res.json({
            ok: true,
            usuarios,
            numeroUsuarios: usuarios.length
        })
    })
        .catch(err => console.log(err));
})


app.post('/usuario', function (req, res) {

    let body = req.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    if(usuario.role === 'USER_ROLE'){
        let conex = async () => {
            await usuario.save();
        }

        conex().then(() => console.log(`------ Usuario ${usuario} creado correctamente -------`.green))
            .catch(err => console.log(err));

        res.json({
            ok: true,
            nombre: usuario.nombre,
            email: usuario.email
        })


    } else {
        console.log(`El rol ${usuario.role} no es correcto`.red)

        res.status(400).json({
            ok: false,
            mensaje: `El rol ${usuario.role} no es correcto`
        });
    }




})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    let actualizarUsuario = async () => {
        await Usuario.findByIdAndUpdate(id, body);
    }

    actualizarUsuario()
        .then(() => console.log(`------ Usuario actualizado correctamente -------`.green))
        .catch(err => console.log(err));


    res.json({
        id
    })
})

app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    let eliminarUsuario = async () =>{
        await Usuario.findByIdAndUpdate(id,{
            estado: false
        });
    }

    eliminarUsuario()
        .then(() => {
            console.log(`------ Usuario con id: ${id} ha sido borrado correctamente -------`.red);
            res.json({
                ok: true,
                id: id,
                msg: 'Borrado correctamente'
            })

        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = app;
