//app.js
//es5 syntax => const express = require('express')
//es6 syntax => import { express } from 'module-name'

import express from 'express'
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { MongoClient , ServerApiVersion} from 'mongodb';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const files = fs.readFile('.');
const uri = process.env.MONGO_URI;
const myVar = 'injected from server';



app.use(express.static(join(__dirname, 'public')));
app.use(express.json()); 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// middlewares aka endpoints aka 'get to slash' {http verb} to slash { you name your endpoint}

app.get('/', (req, res) => {
  //res.send('Hello Express'); //string response
  //res.sendFile('index.html');
  res.sendFile(join(__dirname,'public','index.html'));
})


app.get('/inject', (req, res) => {
  readFile(join(__dirname, 'public', 'index.html'), 'utf8')
    .then(html => {

      const injectedHtml = html.replace ('{{myVar}}', myVar);
      res.send(injectedHtml);
    })
    .catch(err => {
      res.status(500).send('Error loading page');
    });
})

app.get('/api/json', (req,res) =>{
  const myVar = 'Hello from server!';
  res.json({ myVar });
})

app.post('/api/body', (req, res) => {
  console.log("the body:", req.body);
  console.log("client request with body param:", req.body.name); 
  res.json({"name": req.query.name});
})



app.get('/api/query', (req, res) => {
  console.log("client request with query param:", req.query.name); 
  res.json({"message": req.query.name});
});

app.get('/api/url/:iaddasfsd', (req,res) => {
  console.log(req.params.iaddasfsd);
  res.json({"message": `Hi, ${req.params.iaddasfsd}, How are you?`});
}); 

//start the server.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})







// app.get('/inject', (req, res) => {
//   // Inject a server variable into barry.html
//   readFile.files(join(__dirname, 'public', 'index.html'), 'utf8')
//     .then(html => {
//       // Replace a placeholder in the HTML (e.g., {{myVar}})
//       const injectedHtml = html.replace('{{myVar}}', myVar);
//       res.send(injectedHtml);
//     })
//     .catch(err => {
//       res.status(500).send('Error loading page');
//     });
// })
