const Joi = require('@hapi/joi');
const { Article, User } = require('../models') 

// JOI Validator Schema
const idValidator = Joi.object().keys({
    id: Joi.string().regex(/^[a-zA-Z0-9]{24}$/).required()
});

function getAll (req, res) {

    Article.find( req.query || {})
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
};

function createOne ( req, res ) {

    const userId = Joi.validate({ id: req.body.owner}, idValidator);
    if(userId.error) {
        return res.status(400).send("Provide valid id" + "\n" + userId.error.details[0].message);
    } else {
        User.findById( userId.value.id, (err) =>{
            if (err) {
                return res.status(404).send("Can't find. Doesn't exist, try another id");
            }
                Article.create(req.body, (err, article) => {
                    if (err) {
                        res.status(500).send(err.errors.role.properties)
                    } 
                        User.findByIdAndUpdate(userId.value.id, {$inc: {numberOfArticles: 1}}, (err) => {
                            if (err) {
                                return res.status(404).send("Can't update. Doesn't exist, try another id");
                            }
                            res.send(article);
                        });        
                });
        });
    }
};

function deleteOne ( req, res ) {

    const id = Joi.validate(req.params, idValidator);
    if(id.error) {
        return res.status(400).send("Provide valid id" + "\n" + id.error.details[0].message);
    } else {    
        Article.findById({_id: id.value.id}, (err, article) => {            
            if (err) {
                return res.status(404).send("Can't find article. Doesn't exist, try another id");
            }
                User.findById({_id: article.owner}, (err) => {
                    if(err) {
                        return res.status(404).send("Can't find user. Doesn't exist, try another id");
                    }
                    Article.findByIdAndRemove({_id: article._id}, (err, article) => {
                        if (err) {
                            return res.status(404).send("Can't delete. Doesn't exist, try another id");
                        }
                            User.findByIdAndUpdate({_id: article.owner}, {$inc: {numberOfArticles: -1}}, (err) => {
                                if (err) {
                                    return res.status(404).send("Can't update. Doesn't exist, try another id");
                                }
                                res.send(`Article with id: ${article._id} deleted successfully`);                                
                            }); 
                    });
                })
        });
    }
}

function updateOne ( req, res ) {
    
    const id = Joi.validate(req.params, idValidator);
    if(id.error) {
        return res.status(400).send("Provide valid id" + "\n" + id.error.details[0].message);
    } else {    
        Article.findById({_id: id.value.id}, (err, article) => {
            if (err) {
                return res.status(404).send("Can't find article. Doesn't exist, try another id");
            }
                User.findById({_id: article.owner}, (err) => {
                    if(err) {
                        return res.status(404).send("Can't find user. Doesn't exist, try another id");
                    }
                    Article.findByIdAndUpdate({_id: id.value.id}, req.body, (err) => {
                        if (err) {
                            return res.status(404).send("Can't update. Doesn't exist, try another id");
                        }
                        res.send(`Article with id: ${id.value.id} successfully updated`);
                    });
                });
        });
    }
}    

module.exports = { getAll, createOne, deleteOne, updateOne }