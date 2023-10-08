import {createPool} from '../db/db.js';

class Cuenta{
    constructor(tipo_cuenta, balance, id_usuario){
        this.tipo_cuenta = tipo_cuenta,
        this.balance = balance,
        this.id_usuario = id_usuario
    }
    get tipo_cuenta(){
        return this._tipo_cuenta
    }
    set tipo_cuenta(tipo_cuenta){
        this._tipo_cuenta = tipo_cuenta
    }
    get id_usuario(){
        return this._id_usuario
    }
    set id_usuario(email){
        this._id_usuario = email
    }

    //Funcion para crear una nueva cuenta que puede ser de ahorro como corriente. Un usuario nuevo posee 1 cuenta nueva de cada una
    async crear() {
        let result = null;
        const pool = await createPool();
        const connection = await pool.getConnection();

        //Ingresamos los valores a  la base de datos
        try {
            connection.beginTransaction();
            const query = 'INSERT INTO cuentas(tipo_cuenta, balance, id_usuario) VALUES (?,?,?);';
            const [rows] = await connection.query(query, [this.tipo_cuenta, this.balance, this.id_usuario]);
            if (rows.insertId > 0) {
                result = rows.insertId;
                connection.commit();
            } else {
                connection.rollback();
            }
            connection.release();
        } catch (error) {
            console.log('insertar cuenta error: ', error);
        }
        return result;
    };

    //Funcion para obtener alguna cuenta en especifica, nos sirve para tener los datos necesarios para realizar una transferencia
        async obtenerCuenta(){
        let result = false;
        const pool = await createPool();
        const connection = await pool.getConnection();
        try{
            const query = 'SELECT id_cuenta FROM cuentas WHERE tipo_cuenta = ? AND id_usuario = ?';
            const [rows]= await connection.query(query, [this.tipo_cuenta, this.id_usuario]);
            console.log('Obtencion de numero de cuenta', rows);
            if(rows.length > 0){
                result = rows[0].id_cuenta;

            } 
        }catch(error){
            console.log('Error al obtener el usuario', error);
        }
        connection.release();
        return result
    };
}

export {Cuenta};