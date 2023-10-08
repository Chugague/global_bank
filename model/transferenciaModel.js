import {createPool} from '../db/db.js';

class Transferencia {
    constructor(id_cuenta_enviador, id_cuenta_recibidor, monto, comentario, fecha){
        this.id_cuenta_enviador = id_cuenta_enviador,
        this.id_cuenta_recibidor = id_cuenta_recibidor,
        this.monto = monto,
        this.comentario = comentario,
        this.fecha = fecha
    }
    //Funcion para realizar una transferencia
    async transferir(){ 
        let result = null;
        const pool = await createPool();
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Verificar si hay suficiente saldo en la cuenta enviadora
            const [chequeoCuenta] = await connection.execute('SELECT balance FROM cuentas WHERE id_cuenta = ?;', [this.id_cuenta_enviador]);
            if (chequeoCuenta.length === 0 || chequeoCuenta[0].balance < this.monto) {
            throw new Error('Saldo insuficiente para realizar la transferencia.');
        }

            //Registrar la transaccion en la tabla transferencias
            await connection.execute(`INSERT INTO transferencias(id_cuenta_enviador, id_cuenta_recibidor, monto, comentario) VALUES(?,?,?,?);`, 
            [this.id_cuenta_enviador, this.id_cuenta_recibidor, this.monto, this.comentario]);

            //Quitar el saldo a la cuenta que envia dinero
            await connection.execute('UPDATE cuentas SET balance = balance - ? WHERE id_cuenta = ?;', 
            [this.monto, this.id_cuenta_enviador]);

            // Sumar el saldo a la cuenta que recibe el dinero
            await connection.execute('UPDATE cuentas SET balance = balance + ? WHERE id_cuenta = ?;', 
            [this.monto, this.id_cuenta_recibidor]);

            const query = 'SELECT * FROM transferencias ORDER BY id_transferencia DESC LIMIT 1;';
            const [rows] = await connection.execute(query, []);

            console.log('Última transferencia:', rows);

            await connection.commit();
            result = rows
            connection.release();
        
        } catch (error) {
            await connection.rollback();
            console.log('Error en la transferencia: ',error);
        }
        return result
        }
    
    //Funcion para obtener las ultimas 10 transferencias realizadas por el usuario de la cuenta
    obtenerTransferencias = async(id_cuenta)=>{
        let result = null;
        try{
            const pool = await createPool();
            const connection = await pool.getConnection();
            const query = 'SELECT * FROM transferencias WHERE id_cuenta_enviador = ? OR id_cuenta_recibidor = ?  ORDER BY id_transferencia DESC LIMIT 10;';
            const [rows] = await connection.execute(query, [id_cuenta, id_cuenta]);
            if(rows.length == 0){
                result = 'No hay transferencias disponibles para esta cuenta.';
                console.log('No hay transferencias disponibles para esta cuenta.');
            }
            if(rows.length > 0){
                result = rows;
            }
            connection.release();
        } catch(error){
            console.log('Error al obtener las transacccones', error);
        }
        return new Promise((resolve,reject)=>{
            resolve(result);
        });
    }
}

export {Transferencia};


