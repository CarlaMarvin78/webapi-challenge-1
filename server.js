const actionDB = require ("./data/helpers/actionModel");
const projectDB = require ("./data/helpers/projectModel");
const express = require('express');
const server = express();


server.use(express.json());

server.get('/api/projects', (req, res) => {
    projectDB.get() 
    .then (projects=>res.status(200).json(projects))
    .catch (err=> res.status(500).json({error:
            "The list of projects could not be retrieved."}));
    
});

server.get('/api/projects/:id', (req, res) => {
    projectDB.get(req.params.id)
    .then(project => {
        console.log("projects",project);
        if (project==undefined) {
            res.status(404).json({message:
                "The project with the specified ID does not exist."});
        } else {
            res.status(200).json(project)
        }
    })
    .catch(err => res.status(500).json({error:
            "The project information could not be retrieved."}));
});

server.post('/api/projects', (req, res) => {
    const query = req.query;
    if(query.name == undefined || query.description == undefined) {
        res.status(400).json({errorMessage:
                    "Please provide name and description for the project."});
    } else {
        console.log("query",query);
        projectDB.insert({name: query.name, description: query.description})
        .then(project => res.status(201).json(project))
        .catch(err=>res.status(500).json({error:
                    "There was an error while saving the project to the database"}));
    }
});

server.delete('/api/projects/:id', (req,res) => {
    projectDB.remove(req.params.id)
    .then(num => {
        if(num < 1) {
            res.status(404).json({message:
            "The project with the specified ID does not exist."
            });
        } else {
            res.sendStatus(200);
            
        }
    })
    .catch (err => res.status(500).json({error: "The project could not be removed."}));
});

server.put('/api/projects/:id', (req, res) => {
    if(req.query.name == undefined || req.query.description == undefined){
        res.status(400).json({erroMessage: "Please provide name and description for the project."});
    } else {
        projectDB.update(req.params.id, {name:req.query.name, description:req.query.description})
        .then(project=> {
        if (project != null){
            res.status(200).json(project);
        } else {
            res.status(404).json({message:"The project with the specified ID does not exist."});
        }
    
    })
    .catch (err => res.status(500).json({error:"The project information could not be modified."}));
}
})

module.exports = server     