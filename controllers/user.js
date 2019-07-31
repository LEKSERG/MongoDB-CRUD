const Joi = require('@hapi/joi');
const { User, Article } = require('../models') 

// JOI Validator Schema
const idValidator = Joi.object().keys({
    id: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required()
});

function getAll (req, res) {
    
    User.find( {}, (err, foundUsers ) =>{
        if(err) {
            res.send(err)
        }
        if (foundUsers.length === 0) {
            res.send(`User list is empty, to create new:
            POST to /user `);        
        } else {
            res.send(foundUsers);   
        }
    })
};

function getOne (req, res) {
    const id = Joi.validate(req.params, idValidator);
    if(id.error) {
        return res.status(400).send("Provide valid id" + "\n" + id.error.details[0].message);
    } else {
        User.findById( id.value.id, (err, foundedUser ) =>{
            if (err) {
                return res.status(404).send("Can't find. Doesn't exist, try another id");
            }
                res.send(foundedUser);
        });
    }
};

function getUserArticles (req, res) {
    const userId = Joi.validate( req.params, idValidator);
    if(userId.error) {
        return res.status(400).send("Provide valid id" + "\n" + userId.error.details[0].message);
    } else {
        Article.find({owner: userId.value.id})
        .populate('owner')
        .exec( (err, foundArticles ) =>{
            if(err) {
                res.send(err);
            }
            if (foundArticles.length === 0) {
                res.send(`Article list is empty, to create new:
                POST to /articles `);        
            } else {
                res.send(foundArticles);   
            }
        })
    }
}

function createOne ( req, res ) {
    
    User.create(req.body, (err, user) => {
        if (err) {
            res.status(500).send(err.errors.role.properties)
        } 
            res.send(user);                
    });
};

function deleteOne ( req, res ) {

    const user = Joi.validate(req.params, idValidator);
    if(user.error) {
        return res.status(400).send("Provide valid id" + "\n" + user.error.details[0].message);
    } else {    
        User.findByIdAndRemove({_id: user.value.id}, (err) => {
            if (err) {
                return res.status(404).send("Can't delete. Doesn't exist, try another id");
            }
                res.send(`User with id: ${user.value.id} deleted successfully`);
        });
    }
}

function updateOne ( req, res ) {

    const id = Joi.validate(req.params, idValidator);
    if (id.error) {
        return res.status(400).send("Provide valid id" + "\n" + id.error.details[0].message);
    } else {
        User.findByIdAndUpdate({_id: id.value.id}, req.body, (err) => {
            if (err) {
                return res.status(404).send("Can't update. Doesn't exist, try another id");
            }
            res.send(`User with id: ${id.value.id} successfully updated`);
        });
    }
}    

module.exports = { getAll, getOne, getUserArticles, createOne, deleteOne, updateOne }