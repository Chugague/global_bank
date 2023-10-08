# Mi Aplicación Bancaria
Creador: Kevin Ugalde

¡Bienvenido a Mi Aplicación Bancaria! Esta es una aplicación web que te permite realizar transferencias bancarias, administrar tu perfil y ver las últimas transferencias realizadas. ¡Sigue leyendo para conocer más sobre cómo usar la aplicación!

## Características

- Realiza transferencias de dinero entre cuentas.
- Administra tu perfil: modifica tus datos personales.
- Visualiza las últimas transferencias realizadas.

## Requisitos

- Node.js y npm instalados en tu máquina.
- MySQL Server para la base de datos.

## Instalación

1. Descomprime esta carpeta donde quieras la Aplicacion
2. Navega hasta la carpeta del proyecto en la línea de comandos.
3. Ejecuta el siguiente comando para instalar las dependencias: npm i express cors dotenv mysql2 jsonswebtoken nodemon bcrypt
4. Configura la conexión a la base de datos en el archivo `.env`.
5. Crea la base de datos usando el archivo global_bank_sql.sql

## Uso

1. Inicia el servidor ejecutando el siguiente comando: npm run dev
2. Abre tu navegador web y visita `http://localhost:3000` para acceder a la aplicación o si tienes Visual Studio utiliza el live server
3. Empieza a utilizar la aplicacion y crea nuevos usuarios, modificalos y crea transferencias.
