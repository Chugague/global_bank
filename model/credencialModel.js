//Necesitamos importar la base de datos y los paquetes de seguridad ya que aqui se manejan las credenciales de acceso
import {createPool} from '../db/db.js';
import bcrypt from 'bcrypt';
import { generarJWT} from '../utils/jwt.js';

class Credencial{
    _contrasena = null
    _email = null;
    constructor(id_usuario,){
        this.id_usuario = id_usuario;
    }

    get contrasena(){
        return this._contrasena
    }
    set contrasena(contrasena){
        this._contrasena = contrasena
    }
    get email(){
        return this._email
    }
    set email(email){
        this._email = email
    }

    //Funcion para crear una nueva credencial cuando se cree un nuevo usuario y almacenarlas en la base de datos
    async crear() {
        let result = null;
        const hashed_password = await bcrypt.hash(this._contrasena, 10);
        const pool = await createPool();
        const connection = await pool.getConnection();

        try {
            connection.beginTransaction();
            const query = 'INSERT INTO credenciales(email, contrasena, id_usuario) VALUES (?,?,?);';
            const [rows] = await connection.query(query, [this.email, hashed_password, this.id_usuario]);
            if (rows.insertId > 0) {
                result = rows.insertId;
                connection.commit();
            } else {
                connection.rollback();
            }
            connection.release();
        } catch (error) {
            console.log('insertar credencial error: ', error);
        }
        return result;
    };

    //Funcion para verificar nuestras credenciales y acceder a nuestra cuenta de banco
    async login(){
        let result = false;
        const pool = await  createPool();
        const connection = await pool.getConnection();
        try{
            const query = 'SELECT * FROM credenciales WHERE email = ? ;';
            const [rows]= await connection.query(query, [this._email]);


            if(rows.length > 0){
                const credencial = rows[0];
                //comprobamos la contrasena introducida con la de la contrasena hasheada en la base de datos
                const bcrypt_result = await bcrypt.compare(this._contrasena, credencial.contrasena);

                //Si el bcrypt fue exitoso devolvemos la informacion del usuario y su token para entrar a su cuenta
                if(bcrypt_result){
                    const query = `SELECT u.id_usuario, u.nombreCompleto, u.RUT, u.direccion, u.telefono
                    FROM usuarios u
                    INNER JOIN credenciales c ON u.id_usuario = c.id_usuario
                    WHERE c.email = ? ;`;
                    const [rows] = await connection.query(query, [this.email]);
                    const usuario = rows[0];
                    const token_acceso = generarJWT(usuario);
                    result = {token_acceso: token_acceso};
                } else{
                    result = false
                }
            }
        }catch(error){
            console.log('Error de login de usuario: ', error);

        }
        connection.release();
        return result;  
    };
}

export {Credencial};