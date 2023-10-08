import jwt from 'jsonwebtoken';

const secret_key = 'ABCDE12345!';

//Funcion para generar un nuevo token
export const generarJWT = (usuario)=>{
    const token = jwt.sign(usuario, secret_key, {expiresIn:'1h'});
    return token;
}

//Funcion para validar el token
export const validateJWT = (token)=>{
    let result = false;
    jwt.verify(token, secret_key, (err, decoded)=>{
        if(err){
            console.log(err)
        } else{
            result = decoded;
        }
    })
    return result; 
}

//Middleware alternativa para proteger alguna ruta
export const JWTMiddleware = (req, res, next) =>{
    const token = req.header('Authorization').split(' ')[1];
    const verified_token = validateJWT(token);
    const response = {
        msg:'Obtener las ultimas transferencias',
        error: null,
        data: null
    };
    response.msg = 'Validacion token de acceso';
    if(verified_token){
        next();
    } else{
        response.error = 'El token es invalido';
        res.status(401).send(response);
    }
}