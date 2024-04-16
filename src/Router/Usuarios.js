const { db, } = require('../firebase');
const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');

router.get("/", async (req, res) => {
   
    res.json("hola mundo");
}

);

router.post("/Usuario/Registro", async (req, res) => {
    const { Apellido,contrasena,Rol ,Correo,Nombre,Usuario, Area_trabajo,Cargo,Comision} = req.body;
  try{
    const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el número de rondas de hashing

    await db.collection('Usuarios').add({
        Apellido: Apellido,
        contrasena: hashedPassword,
        Correo: Correo,
        Nombre: Nombre,
        Usuario: Usuario,
        rol:Rol,
        Area_trabajo:Area_trabajo,
        Cargo:Cargo,
        Comision:Comision
      });
  
    res.status(200).json({ message: "Datos guardados correctamente en base de datos" });
  }catch(error){
        res.status(500).json({message:"Algo salio mal",error:error});
  }

});


module.exports=router
