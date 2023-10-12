import mysql from 'mysql'

const initializeDatabase = () => {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.message);
      return;
    }
    console.log('Connected to MySQL database.');
  });

  const createMoviesTable = `CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    genre VARCHAR(255),
    overview VARCHAR(255),
    poster_path VARCHAR(100),
    rating FLOAT,
    vote_count INT
  )`;

  const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    movies TEXT
  )`;
  const createRatingTable = `CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    movie_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 10)
  );`

  connection.query(createMoviesTable, (err) => {
    if (err) {
      console.error('Error creating movies table:', err.message);
    }
  });

  connection.query(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    }
  });
  connection.query(createRatingTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    }
  });

  return connection;
}

export default initializeDatabase;