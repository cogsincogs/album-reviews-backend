'use strict';

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const URI = process.env.ATLAS_URI;

// App
const app = express();

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(URI);    
}

const Cat = mongoose.model('Cat', { name: String });

app.get('/', (req, res) => {
    const kitty = new Cat({ name: "Louis" });
    kitty.save();

    res.send(kitty);
});

app.get('/cats', (req, res) => {
    Cat.find({ name: "Louis" }).then(cats => {
        res.send(cats);
    }).catch(err => {
        res.send("Error: " + err);        
    })
})

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});