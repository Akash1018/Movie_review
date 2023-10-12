import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../index.js'

export const signin = async (req,res) => {
   const { email, password } = req.body;
   try {
        let rows = await queryAsync(db, 'SELECT * FROM users WHERE email = ?', [email]);
        rows = rows.map(result => ({ ...result }));
        console.log(rows)
        if (rows.length === 0) {
          return res.status(404).json({ message: "User doesn't exist" });
        }
        const existingUser = rows[0];
        console.log(existingUser)
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({ email: existingUser.email,id: existingUser.id}, "process.env.TOKEN", { expiresIn: "1h"});

        res.status(200).json({ result: existingUser, token});
   } catch (error) {
        res.status(500).json({ message: 'Something went wrong'});
   }
}

export const signup = async (req,res) => {
    const { email,password,confirmPassword,firstName,lastName } = req.body;
    try {
      const rows = await queryAsync(db, 'SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
          console.log(1)
          return res.status(400).json({ message: 'User already exists.' });
        }
        if(password.length <8) return res.status(400).json({ message: 'Password should be of length 8 or more'})
        if(password !== confirmPassword) return res.status(400).json({message: "Password don't match"});

        const hashedPassword = await bcrypt.hash(password, 12);
        const insertResult =  db.query(
          'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
          [email, hashedPassword, `${firstName} ${lastName}`]
        );
        const userId = insertResult.insertId;
        
        const token = jwt.sign({ email: insertResult.email,id: userId}, "process.env.TOKEN", { expiresIn: "1h"});

        res.status(200).json({ result: { id: userId, email, name: `${firstName} ${lastName}` }, token });
    } catch (error) {
        res.status(500).json({message:error.message});
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