/**
 * DishController
 *
 * @description :: Server-side logic for managing Dishes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
module.exports = {
	create: function(req, res){

        //- create new dish
        var data = {};

        //- update
        //- chef id
        var cid = req.param('chefID');

        data.dDescribe = req.param('describe');
        //- upload image
        data.dImageName = req.param('dishImageName');
        ImageService.saveImage({
            req: req,
            res: res,
            fileInput: 'dishImage',
        });

        // data.dName = req.param('name');
        // data.dDescribe = req.param('describe');
        // data.dCost = req.param('cost');
        // data.dCookingTime = req.param('cookingTime');
        // //- serving option, dietary, food allergy
        // //- must be an array
        // data.dServingOption = req.param('servingOption');
        // data.dDietary = req.param('dietary');
        // data.dFoodAllergy = req.param('allergy');
        // data.dTag = req.param('tag');
        // data.ingredients = req.param('ingredients'); //- must be an array of ingredient's id

        // //- chef id
        // var cid = req.param('chefID');

        // //- upload image
        // data.dImageName = req.param('dishImageName');
        // ImageService.saveImage({
        //     req: req,
        //     res: res,
        //     fileInput: 'DishImage',
        // });
        
        //- finding chef
        Chef
        .findOne({})
        .where({
            id: cid,
        })
        .then(function(found_data){
            data.chef = found_data.id;
            sails.log(data);
            //- insert to dish data 
            Dish
            .create(data)
            .then(function(created_dish){
                sails.log(created_dish);
                // var did = created_dish.id;
                return res.json(200, {
                    error: false,
                    message: 'added new dish',
                    data:
                    {
                        dishID: created_dish.id
                    } 
                    
                    
                });
            })
            .catch(function(err){
                return res.json(500, {error: true, message: 'Cannot add new dish', data: err});
            });
            
            // found_data.dishes.add(data);
            // return found_data.dishes.save(function(err){});

            // res.json(200, {error: false, message: 'found', data: found_data});

        }).catch(function(err){
            res.json(500, {error: true, message: 'Errors', data: err});
        });

    },

    //- view all dish
    viewAll: function(req, res){
       
        Dish
        .find({})
        .where({
            id: did
        })
        .then(function(dish){
            res.json(200, {
                error: false,
                message: 'Dish found',
                data: dish,
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
    },

    //- view dish by dish id
    viewByID: function(req, res){
        //- view by dish id
        var did = req.param('dishID');
        Dish
        .findOne({})
        .where({
            id: did
        })
        .then(function(dish){
            res.json(200, {
                error: false,
                message: 'Dish found',
                data: dish,
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
    },

    //- view all dish with limit
    viewLimit: function(req, res){
        var limit = parseInt(req.param('limit'));
        Dish
        .find({})
        .limit(limit)
        .where({
            id: did
        })
        .then(function(dish){
            res.json(200, {
                error: false,
                message: 'Dish found',
                data: dish,
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
    },

    //- add multiple ingredients to dish
    addIngredientsToDish: function(req, res)
    {
        var did = req.param('dishID');

        //- array of object ingredients
        var ingredients = req.param('ingredientsID');
        // var ingredients = [
        //     {dish:did, ingredient: 1},
        //     {dish:did, ingredient: 2},
        //     {dish:did, ingredient: 3}
        // ];

        DishIngredient
        .create(ingredients)
        .then(function(created_data){
            res.created({
                error: false,
                message: 'added new ingredient to dish',
                data: {
                    created_data
                }
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true, 
                message: 'Cannot insert ingredient', 
                data: err
            });
        });
    },

    //- update ingredients to dish
    //- by dishID
    updateIngredientsToDish:function()
    {
        //- get list of new Ingredients in dish
        var did = req.param('dishID');
        //- this must be type of [{},{}]
        var ingredients = req.param('ingredientsID');
        //- get current ingredient list by dish ID
        DishIngredient
        .find({})
        .where({
            dish: did
        })
        .then(function(found_data){

            sails.log(found_data);

            res.ok({
                error: false,
                message: 'update ingredients',
                data: found_data
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
        //- compare new list to current list
        
    },

    //- add multiple ingredients to dish
    addAllergiesToDish: function(req, res)
    {
        var did = req.param('dishID');
        //- array of object ingredients
        var allergies = req.param('allergies');
        // var allergies = [
        //     {dish:did, allergies: 1},
        //     {dish:did, allergies: 2},
        //     {dish:did, allergies: 3}
        // ];

        DishAllergy
        .create(allergies)
        .then(function(created_data){
            res.created({
                error: false,
                message: 'added new allergy to dish',
                data: {
                    created_data
                }
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true, 
                message: 'Cannot insert allergy', 
                data: err
            });
        });
    },

    //- add multiple ingredients to dish
    addDietariesToDish: function(req, res)
    {
        var did = req.param('dishID');

        //- array of object ingredients
        var dietaries = req.param('dietaries');
        // var dietaries = [
        //     {dish:did, dietaries: 1},
        //     {dish:did, dietaries: 2},
        //     {dish:did, dietaries: 3}
        // ];

        DishDietary
        .create(dietaries)
        .then(function(created_data){
            res.created({
                error: false,
                message: 'added new dietary to dish',
                data: {
                    created_data
                }
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true, 
                message: 'Cannot insert dietary', 
                data: err
            });
        });
    },

    //- update by dish id
    update: function(req, res){
        if(req.method === 'PUT')
        {
            var did = req.param('dishID');
            sails.log(did);
             //- update random field
            //- this is must be an object {}
            var data = req.param('data');
            var fileName = req.param('dishImageName');
            if(fileName != null)
            {
                //- upload image seperately
                ImageService.saveImage({
                    req: req,
                    res: res,
                    fileInput: 'dishImage'
                });
                sails.log('Upload image success');
            }
            
            var did2 = mongoose.Types.ObjectId("5a75c3ebb6b348a425519728");
            sails.log(typeof(did2));

            Dish
            .update(
            {
                id: mongoose.Types.ObjectId("5a75c3ebb6b348a425519728")
                // createdAt: '2018-02-06 14:37:17.943'
            }
            , JSON.parse(data))
            .then(function(updated_data){
                sails.log(updated_data[0].id);
                sails.log(typeof(updated_data[0].id));
                return res.json(200, {
                    error: false,
                    message: 'Dish updated...',
                    data: updated_data
                });
            }).catch(function(err){
                return res.json(500, {
                    error: true,
                    message: 'Errors',
                    data: err
                });
            });

        }
        
        
    },

    //- view by chef ID
    viewByChefID: function(req, res){
        //- view by dish id
        var cid = req.param('chefID');
        Dish
        .findOne({})
        .where({
            chef: cid
        })
        .then(function(chef){
            res.json(200, {
                error: false,
                message: 'Chef found',
                data: chef,
            });
        })
        .catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
    },


    //- delete by dish id
    delete: function(req, res)
    {
        var did = req.param('dishID');
        Dish
        .destroy({
            id: did
        }).catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
    }
    
};

