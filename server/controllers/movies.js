import { db } from '../index.js'
import axios from "axios";

export const getMovies = async (req,res) => {
    try{
        const sql = 'SELECT * FROM movies where genre = ? ORDER BY RAND() LIMIT 8';
        db.query(sql,[req.params.genre], (err, rows) => {
            if (err) {
            res.status(500).json({ error: err.message });
            return;
            }
            return res.status(200).json({ movies: rows });
        })
    } catch (error){
        res.status(404).json({ message: error.message });
    }
}

export const getMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const sql = 'SELECT * FROM movies WHERE id = ?';
        db.query(sql, [movieId], (err, rows) => {
            if (err) {
            res.status(500).json({ error: err.message });
            return;
            }
            return res.json( rows[0] );
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const searchMovie = async (req, res) => {
    try {
        const searchQuery = req.params.search;
        
        const sql = 'SELECT * FROM movies WHERE title LIKE ? OR genre LIKE ? ORDER BY title asc';
        const searchValue = `%${searchQuery}%`;
        db.query(sql, [searchValue, searchValue], async (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            } else if(!rows.length){
                rows= await axios(`https://api.themoviedb.org//3/search/multi?query=${searchQuery}&api_key=f0813082f58206e7891d2eb221cfba23&page=1`);
                return res.status(200).json(rows.data.results);
            }
            return res.status(200).json(rows);
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const addMovie = async (req, res) => {
    const { userId, movieId } = req.params;
    try {
    const userRows = await queryAsync(db, 'SELECT movies FROM users WHERE id = ?', [userId]);
    console.log(userRows)
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userMovies = JSON.parse(userRows[0].movies || '[]');

    if (!userMovies.includes(movieId)) {
      userMovies.push(movieId);

      await db.query('UPDATE users SET movies = ? WHERE id = ?', [JSON.stringify(userMovies), userId]);
    }

    res.status(200).json({ message: 'Movie added to user' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const watchList = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userRows = await queryAsync(db, 'SELECT movies FROM users WHERE id = ?', [userId]);
        const userMovies = JSON.parse(userRows[0].movies || '[]');
        console.log(userMovies)
        const movieDataPromises = userMovies.map(async (movieId) => {
            // Call an external API (e.g., replace 'your-movie-api-url' with the actual API URL)
            const externalApiResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=f0813082f58206e7891d2eb221cfba23&language=en-US`);
      
            // Extract the relevant movie data from the API response
            const movieData = externalApiResponse.data;
      
            return movieData;
        });

        const userMovieData = (await Promise.all(movieDataPromises));
    
        res.status(200).json(userMovieData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const ratings = async (req,res) => {
    const { userId, movieId, rating } = req.params;
    try {
        const existingRating = await queryAsync(db, 'SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?', [userId, movieId]);
        if (existingRating.length === 0) {
            // If no rating exists, insert a new rating
            const insertQuery = 'INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)';
            await db.query(insertQuery, [userId, movieId, rating]);
            res.status(201).send('Rating added successfully.');
          } else {
            const currentRating = existingRating[0];
            // If a rating exists and is different, update it
            if (currentRating.rating !== rating) {
              const updateQuery = 'UPDATE ratings SET rating = ? WHERE user_id = ? AND movie_id = ?';
              await db.query(updateQuery, [rating, userId, movieId]);
              res.status(200).send('Rating updated successfully.');
            } else {
              // If the rating is the same, no update is needed
              res.status(200).send('Rating is the same no update required.');
            }}
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const checkList = async (req, res) => {
    const {userId, movie_id} = req.params;
    try {
        const userRows = await queryAsync(db, 'SELECT movies FROM users WHERE id = ?', [userId]);
        const userMovies = JSON.parse(userRows[0].movies || '[]');
        console.log(userMovies)
        let flag = false;
        userMovies.map(async (movieId) => {
            if(movieId === movie_id){
               flag = true;
            }
        });
    
        res.status(200).json(flag);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const removeMovie = async (req, res) => {
    const { userId, movieId } = req.params;
    try {
      const userRows = await queryAsync(db, 'SELECT movies FROM users WHERE id = ?', [userId]);
      console.log(userRows);
  
      if (userRows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userMovies = JSON.parse(userRows[0].movies || '[]');
  
      if (userMovies.includes(movieId)) {
        // Remove the movieId from the user's movie list
        const updatedMovies = userMovies.filter((id) => id !== movieId);
  
        await db.query('UPDATE users SET movies = ? WHERE id = ?', [JSON.stringify(updatedMovies), userId]);
        res.status(200).json({ message: 'Movie removed from user' });
      } else {
        res.status(404).json({ message: 'Movie not found in user list' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


export const checkRating = async (req, res) => {
    const {userId, movie_id} = req.params;
    try {
        console.log(userId),
        console.log(movie_id)
        let flag = true;
        const existingRating = await queryAsync(db, 'SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?', [userId, movie_id]);
        if (existingRating.length === 0) {
            flag = false
        } 

        res.status(200).json({Available: flag, value: existingRating[0].rating});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const watchedList = async (req, res) => {
    console.log(1)
    const userId = req.params.userId;
    console.log(userId)
    try {
        const userRows = await queryAsync(db, 'SELECT movie_id FROM ratings WHERE user_id = ?', [userId]);
        
        const movieDataPromises = userRows.map(async (movie_id) => {
            // Call an external API (e.g., replace 'your-movie-api-url' with the actual API URL)
            const externalApiResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id.movie_id}?api_key=f0813082f58206e7891d2eb221cfba23&language=en-US`);
            // Extract the relevant movie data from the API response
            const movieData = externalApiResponse.data;
            
            return movieData;
        });
        
        const userMovieData = (await Promise.all(movieDataPromises));
        
        res.status(200).json(userMovieData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
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