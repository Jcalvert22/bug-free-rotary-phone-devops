//app.js
//es5 syntax => const express = require('express')
//es6 syntax => import { express } from 'module-name'

import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
//import { readFile } from 'fs';
//import * as fs from 'node:fs';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const files = fs.readFile('.');
let myVar = 'demo purposes';


app.use(express.json()); 
// middlewares aka endpoints aka 'get to slash' {http verb} to slash { you name your endpoint}
app.get('/', (req, res) => {
  //res.send('Hello Express'); //string response
  //res.sendFile('index.html');
  res.sendFile(join(__dirname,'public','index.html'));
})


app.get('/api/json', (req,res) =>{
  const myVar = 'Hello from server!';
  res.json({ myVar });
})

app.post('/api/body', (req, res) => {
  console.log("the body:", req.body);
  console.log("client request with body param:", req.body.name); 
  res.json({"name": req.query.name});
});




//start the server.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})







// app.get('/inject', (req, res) => {
//   // Inject a server variable into barry.html
//   fs.files(join(__dirname, 'public', 'index.html'), 'utf8')
//     .then(html => {
//       // Replace a placeholder in the HTML (e.g., {{myVar}})
//       const injectedHtml = html.replace('{{myVar}}', myVar);
//       res.send(injectedHtml);
//     })
//     .catch(err => {
//       res.status(500).send('Error loading page');
//     });
// })
