const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

// console.log(process.env)

//Crear servidor de express
const app = express();
//Base de datos
dbConnection();

app.use(cors());

//Directorio publico
//use es un middleware
app.use(express.static("public"));

//Lectura y parseo del body
app.use(express.json());

//Rutas
//auth // crear, login , renew
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.get("*", (req, req) => {
	res.sendFile(__dirname + "/public/index.html");
});
//CRUD: Eventos

//escuchar peticiones
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
