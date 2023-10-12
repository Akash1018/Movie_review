import { db } from "./index.js";
import axios from "axios";


export const fetchAndStoreMovies = async () => {
    let page = 1;
    let totalMovies = 0;
  
    while (totalMovies < 300) { // Fetch 10,000 movies
      try {
        const response = await axios(`${process.env.REACT_APP_BACK_END}/movie/upcoming?api_key=f0813082f58206e7891d2eb221cfba23&page=${page}&language=en-US`);
        const movies = response.data.results;
        const genre = "Upcoming";
        for (const movie of movies) {
          console.log(1)
          const { id, original_title, poster_path, overview, vote_average, vote_count } = movie;
          
          
          // Check if the movie with the same ID already exists in the database
          const existingMovie = await queryAsync(db, 'SELECT id FROM movies WHERE id = ?', [id]);
          console.log(2)
          console.log(existingMovie)
          if (!existingMovie.length) {
            // If the movie doesn't exist, insert it into the database
            const insertSql = 'INSERT INTO movies (id, title, poster_path, overview, genre, rating, vote_count) VALUES (?, ?, ?, ?, ?, ?, ?)';
            await db.query(insertSql, [id, original_title, poster_path, overview, genre, vote_average, vote_count]);
          } else {
            console.log(`Movie with ID ${id} already exists. Skipping.`);
          }
        }
    
        totalMovies += movies.length;
        page++;
        console.log(`Fetched ${totalMovies} movies.`);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    break;
  }
  }}

const generateRandomUserData = () => {
  const username = `user_${Math.floor(Math.random() * 10000)}`;
  const email = `user${Math.floor(Math.random() * 10000)}@example.com`;
  const movies = JSON.stringify(generateRandomMovieList());
  return { username, email, movies };
}


const generateRandomMovieList =() => {
  const movieList = [];
  for (let i = 0; i < 10; i++) {
    movieList.push(`Movie ${Math.floor(Math.random() * 50000)}`);
  }
  return movieList;
}

export const dummyUsers = () => {
  const users = [];
  for (let i = 0; i < 5000; i++) {
    const userData = generateRandomUserData();
    users.push([userData.username, userData.email, userData.movies]);
  }

  const sql = 'INSERT INTO users (username, email, movies) VALUES ?';
  db.query(sql, [users], (err) => {
    if (err) throw err;
    console.log('Users inserted successfully');
  });
}

const queryAsync = async (db, sql, values) => {
  return new Promise((resolve, reject) => {
      db.query(sql, values, (err, rows) => {
          if (err) {
              reject(err);
          } else {
              resolve(rows);
          }
      });
  });
}