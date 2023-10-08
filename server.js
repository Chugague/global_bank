//Importamos los paquetes necesarios para nuestro servidor
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js'
const port = 3000

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', routes);

app.listen(port, ()=>{
    console.log(`servidor corriendo en el puerto ${port}`);
})