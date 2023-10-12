import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import initializeDatabase from './models/db.js'
import movieRoutes from './routes/movies.js'; 
import userRoutes from './routes/users.js'
import {fetchAndStoreMovies, dummyUsers} from './synthetic_data.js'

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

export const db = initializeDatabase();

app.get('/', (req,res) => {
    res.send('APP IS RUNNING')
})
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
//fetchAndStoreMovies();
//dummyUsers();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});