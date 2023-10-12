import express from 'express';
import { getMovies,watchList, ratings, watchedList, checkRating, checkList, searchMovie, addMovie, removeMovie } from '../controllers/movies.js';

const router = express.Router();

router.get('/:genre', getMovies);
router.get('/search/:search', searchMovie);
router.patch('/add/:userId/:movieId', addMovie)
router.delete('/removeMovie/:userId/:movieId', removeMovie)
router.get('/watchList/:userId', watchList)
router.patch('/updateRating/:movieId/:userId/:rating', ratings)
router.get('/checkRating/:userId/:movie_id', checkRating)
router.get('/checkList/:userId/:movie_id', checkList)
router.get('/watchedList/:userId', watchedList)

export default router;