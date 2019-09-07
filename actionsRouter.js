const express = require ('express');
const router = express.Router();
const projectDB = require ("./data/helpers/projectModel");
const actionDB = require ('./data/helpers/actionModel');



// ============Validation Schema============

function validateProjectId (req, res, next){
    console.log ("validate query:",req.query);
    const project_id = req.query.project_id;
    if (project_id == undefined) {
        res.status(400).json({errorMessage: "A project id is required for the action."})
    } else {
        projectDB.get (project_id)
        .then (project => {
            if (project == null) {
                res.status(404).json({message: "The project with the specified id does not exist."})
            } else {
                next ();
            }
        })
        .catch (err => res.status(500).json({error: "The project could not be retrieved."}));
    }
  }
//============End Schema============

router.get('/', (req, res) => {
    actionDB.get() 
    .then (actions=>res.status(200).json(actions))
    .catch (err=> res.status(500).json({error:
            "The list of actions could not be retrieved."}));
    
});

router.get('/:id', (req, res) => {
    actionDB.get(req.params.id)
    .then(action => {
        console.log("actions", action);
        if (action==undefined) {
            res.status(404).json({message:
                "The action with the specified ID does not exist."});
        } else {
            res.status(200).json(action)
        }
    })
    .catch(err => res.status(500).json({error:
            "The action information could not be retrieved."}));
});

router.post('/', validateProjectId, (req, res, next) => {
    const query = req.query;
    if(query.project_id == undefined || query.description == undefined || query.notes == undefined) {
        res.status(400).json({errorMessage:
                    "Please provide project id, description, and notes for the action."});
    } else {
        console.log("query",query);
        actionDB.insert({project_id: query.project_id, description: query.description, notes: query.notes})
        .then(action => res.status(201).json(action))
        .catch(err=>res.status(500).json({error:
                    "There was an error while saving the action to the database"}));
    }
});

router.delete('/:id', (req,res) => {
    actionDB.remove(req.params.id)
    .then(num => {
        if(num < 1) {
            res.status(404).json({message:
            "The action with the specified ID does not exist."
            });
        } else {
            res.sendStatus(200);
            
        }
    })
    .catch (err => res.status(500).json({error: "The action could not be removed."}));
});

router.put('/:id', validateProjectId, (req, res, next) => {
    if(req.query.project_id == undefined || req.query.description == undefined || req.query.notes == undefined){
        res.status(400).json({errorMessage: "Please provide project id, description, and notes for the project."});
    } else {
        actionDB.update(req.params.id, {project_id:req.query.project_id, description:req.query.description, notes: req.query.notes})
        .then(action=> {
        if (action != null){
            res.status(200).json(action);
        } else {
            res.status(404).json({message:"The action with the specified ID does not exist."});
        }
    
    })
    .catch (err => res.status(500).json({error:"The action information could not be modified."}));
}
})


module.exports = router 