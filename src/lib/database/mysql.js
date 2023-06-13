import mysql from 'mysql2/promise'
//import dotenv from 'dotenv'

//dotenv.config()

// create database connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: '123',
//   database: 'registrytotal',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// })

// export async function mysqlconnFn(sql: string, params: string[]) {
//   const connection = await pool.getConnection()
//   try {
//     const [results] = await connection.query(sql, params)
//     return results
//   } finally {
//     connection.release()
//   }
// }

// let mysqlconn = null;

// export function mysqlconnFn() {

//     if (!mysqlconn) {
//         mysqlconn = mysql.createConnection({ 
//             host: 'localhost',
//             user: 'root',
//             password: '123',
//             database: 'registrytotal'
//         });
//     }

//     return mysqlconn;
// }

