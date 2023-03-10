const express = require('express');
const cors = require('cors');
const app = express();
const fruits = require('./fruits.json')
const fs = require('fs');

app.use(cors());
app.use(express.json());

//Home route
app.get('/', (req, res) => {
    res.send('WE ARE UP AND RUNNING')
})

//All fruit route
app.get('/fruits', (req, res) => {
    try {
        res.status(200).send(fruits)
    } catch(e) {
        res.status(404).send()
    }
})

//Single fruit route
//what if fruit not found?
app.get('/fruits/:id', (req, res) => {
    let id = req.params.id;
    id = id.toLowerCase();
    let obj = fruits.find(o => o.name.toLowerCase() === id);
    let allfruits = `${fruits[0]['name']}`
    for(let i =1; i < fruits.length; i++){
        allfruits += ', ' + fruits[i]['name']
    };
    let wrongname = `ERROR 404:\nTHATS NOT A FRUIT! Please choose one of the following:\n ${allfruits}`
    if(obj) res.status(200).send(obj)
    else res.status(404).send(wrongname)
})

app.post("/fruits", (req, res) => {
    console.log(req.body['name'])
    //check it doesnt already exist to avoid duplication
    let obj = fruits.find(o => o.name.toLowerCase() === req.body['name'].toLowerCase());
    //if fruit doesnt exist process with req.body to add fruit to data
    if(!obj) {
        res.status(201).send('Fruit added successfully');
        fruits.push(req.body);
        fs.writeFileSync('./fruits.json', JSON.stringify(fruits))
    }
    //if fruit does exist return an error
    else res.status(404).send('Fruit already exists')
})

app.delete("/fruits", (req, res) => {
    console.log(req.body['name'])
    //check it already exist to avoid errors
    let obj = fruits.find(o => o.name.toLowerCase() === req.body['name'].toLowerCase());
    //if fruit does exist process with req.body to remove fruit from data
    if(obj) {
        res.status(202).send('Fruit removed successfully');
        fruits.push(req.body);
        let data = fs.readFileSync('./fruits.json');
        data = data.map(forEach(o => data[o].toLowerCase()))
        let removable = data.indexOf(req.body['name'].toLowerCase())
        data.splice(removable, 1)
        fs.writeFileSync('./fruits.json', JSON.stringify(data))
    }
    //if fruit doesn't exist return an error
    else res.status(404).send('Fruit already doesn\'t exist')
})
module.exports = app;
