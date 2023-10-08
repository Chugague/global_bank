import {createPool} from '../db/db.js';

class Usuario{
    _id = null;
    constructor(nombreCompleto, rut, direccion, telefono){
        this.nombreCompleto = nombreCompleto,
        this.rut = rut,
        this.direccion = direccion,
        this.telefono = telefono
    }    
    get id(){
        return this._id
    }
    set id(id){
        this._id = id
    }

    //Funcion para crear un nuevo usuario en nuestra base de datos
    async crear(){
        let result = null;
        const pool = await createPool();
        const connection = await pool.getConnection();
        console.log('usuario: ', this.nombreCompleto, this.rut);
        try{
            connection.beginTransaction();

            const query = 'INSERT INTO usuarios(nombreCompleto, RUT, direccion, telefono) VALUES (?,?,?,?);';
            const [rows] = await connection.query(query, [this.nombreCompleto, this.rut, this.direccion, this.telefono]);
            console.log('rows insertar usuario: ', rows);
            
            if(rows.insertId > 0){
                    const [rows2] = await connection.execute('SELECT id_usuario,nombreCompleto,RUT,direccion,telefono FROM usuarios WHERE id_usuario = ?', [rows.insertId]);
                    result = rows2[0];
                    connection.commit();
                } else{
                    connection.rollback();
                }
            }catch(error){
            connection.rollback();
            console.log('insertar usuario error: ', error);
        }
        connection.release();
        return result;
    };

    //Funcion para que el usuario pueda modificar sus datos, la contrasena y correo no se pueden modificar debido que puede afectar las credenciales
    async modificar(){
        let result = false;
        const pool = await createPool();
        const connection = await pool.getConnection();
        try{
            console.log(this.nombreCompleto, this.rut, this.direccion, this.telefono, this.id);
            const query = 'UPDATE usuarios SET nombreCompleto = ?, rut = ?, direccion = ?, telefono = ? WHERE id_usuario = ?';
            const [rows]= await connection.query(query, [this.nombreCompleto, this.rut, this.direccion, this.telefono, this.id]);
            console.log('Actualizacion de usuario', query);
            if(rows.changedRows > 0){
                result = true;
            } 
        }catch(error){
            console.log('Error al modificar el usuario', error);
        }
        connection.release();
        return result
    };

    //Funcion para obtener un usuario por medio de su nombre y rut como se solicita para realizar una transferencia
    async obtenerUsuario(){
        let result = false;
        const pool = await createPool();
        const connection = await pool.getConnection();
        try{
            const query = 'SELECT id_usuario FROM usuarios WHERE nombreCompleto = ? AND RUT = ? ;';
            const [rows]= await connection.query(query, [this.nombreCompleto, this.rut]);
            console.log('Obtencion de usuario', query);
            if(rows.length > 0){
                result = rows[0].id_usuario;
            } 
        }catch(error){
            console.log('Error al obtener el usuario', error);
        }
        connection.release();
        return result
    };

    //Funcion para que un usuario pueda eliminar su cuenta bancaria, Esto elimina su cuenta de usuario, credenciales y cuentas bancarias.
    async eliminar(){
        let result = false;
        const pool = await createPool();
        const connection = await pool.getConnection();
        try{
            const query = 'DELETE FROM usuarios WHERE id_usuario = ? ;';
            const [rows]= await connection.query(query, [this.id]);
            console.log('Eliminacion de cuentas', rows.affectedRows);
            if(rows.affectedRows > 0){
                result = true;
            } 
        }catch(error){
            console.log('Error al eliminar el usuario', error);
        }
        connection.release();
        return result
    };

}

export {Usuario};

