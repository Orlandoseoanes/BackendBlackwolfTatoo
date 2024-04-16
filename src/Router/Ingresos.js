const { db, } = require('../firebase');
const { Router } = require("express");
const { route } = require('./Ingresos');
const router = Router();

router.post("/Ingresos/Registro", async (req, res) => {
    const { Fecha, Valor_Tatuaje,Nombre_Empleado,Sala_tatuaje,Cliente,Comision } = req.body;
    try {
        await db.collection('Ingresos').add({
            Fecha: Fecha,
            Valor_Tatuaje: Valor_Tatuaje,
            Nombre_Empleado:Nombre_Empleado,
            Sala_tatuaje:Sala_tatuaje,
            Comision:Comision,
            Cliente:Cliente
        });
        res.status(200).json({ message: "Datos guardados correctamente en base de datos" });
    } catch (error) {
        res.status(500).json({ message: "Algo salio mal", error: error });
    }
} );


// traer todos los ingresos

router.get("/Ingresos", async (req, res) => {

    try {
        const ingresos = [];
        const querySnapshot = await db.collection('Ingresos').get();
        querySnapshot.forEach(doc => {
            ingresos.push({
                id: doc.id,
                valor: doc.data().Valor_Tatuaje,
                fecha: doc.data().Fecha,
                Nombre_Empleado:doc.data().Nombre_Empleado,
            });
        });
        res.status(200).json(ingresos);
    } catch (error) {
        res.status(500).json({ message: "Algo salio mal", error: error
    });
    }

});

//traer ingresos por empleado

router.get("/Ingresos/:Nombre_Empleado", async (req, res) => {
    const Nombre_Empleado = req.params.Nombre_Empleado;
    try {
        const ingresos = [];
        const querySnapshot = await db.collection('Ingresos').where('Nombre_Empleado', '==', Nombre_Empleado).get();
        querySnapshot.forEach(doc => {
            ingresos.push({
                id: doc.id,
                valor: doc.data().Valor_Tatuaje,
                fecha: doc.data().Fecha,
            });
        });
        res.status(200).json({message: `Ingresos del  empleado ${Nombre_Empleado}`, ingresos});
    } catch (error) {
        res.status(500).json({ message: "Algo salio mal", error: error });
    }
}
);

//registros completos
router.get("/Ingreso", async (req, res) => {
    try{
        const ingresos = [];
        const querySnapshot = await db.collection('Ingresos').get();
        querySnapshot.forEach(doc => {
            ingresos.push({
                id: doc.id,
                data: doc.data()
            });
        });
        res.status(200).json(ingresos);

    } catch(error) {
        res.status(500).json({ message: "Algo salio mal", error: error });
    }
});



router.get("/CalcularDinerototal",async(req,res)=>{
    try{
        let totalIngresosBrutos = 0; // Inicializamos el total de ingresos brutos
        const gananciasPorEmpleado = {}; // Objeto para almacenar las ganancias de cada empleado
        let comisionTotal = 0; // Inicializamos la comisión total del estudio

        const querySnapshot = await db.collection('Ingresos').get();
        querySnapshot.forEach(doc => {
            const valorTatuaje = doc.data().Valor_Tatuaje;
            const empleado = doc.data().Nombre_Empleado;
            const comisionPorcentaje = doc.data().Comision;

            // Sumar el valor del tatuaje al total de ingresos brutos
            totalIngresosBrutos += valorTatuaje;

            // Calcular la ganancia neta y la comisión de cada tatuador
            const comision = valorTatuaje * (comisionPorcentaje / 100);
            const gananciaNeta = valorTatuaje - comision;

            // Agregar las ganancias y la comisión al objeto de ganancias por empleado
            if (!gananciasPorEmpleado[empleado]) {
                gananciasPorEmpleado[empleado] = {
                    ganancia: 0,
                    comision: 0
                };
            }
            gananciasPorEmpleado[empleado].ganancia += gananciaNeta;
            gananciasPorEmpleado[empleado].comision += comision;
        });

        // Calcular la comisión total del estudio (sumatoria de las comisiones de los empleados)
        for (const empleado in gananciasPorEmpleado) {
            comisionTotal += gananciasPorEmpleado[empleado].comision;
        }

        res.status(200).json({ 
            total: totalIngresosBrutos,
            gananciasPorEmpleado: gananciasPorEmpleado,
            GananciasEstudio: comisionTotal
        });
    } catch (error) {
        res.status(500).json({ message: "Algo salió mal", error: error });
    }
});







module.exports=router
