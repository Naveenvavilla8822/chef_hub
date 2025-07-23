import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'H@cker22',
  database: 'chef_hub'
});

export default pool;
