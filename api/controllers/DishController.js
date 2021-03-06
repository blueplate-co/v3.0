/**
 * DishController
 *
 * @description :: Server-side logic for managing Dishes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const uuidv4 = require('uuid/v4'); //- random unique string
module.exports = {
	create: function(req, res){

        //- create new dish
        var data = {};

        //- update
        //- chef id
        var cid = req.param('chefID');
        data.dName = req.param('name');
        data.dDescribe = req.param('describe');

        //- cost
        data.dCost = parseInt(req.param('cost')); //- number
        data.dSuggestedPrice = parseInt(req.param('suggestedPrice')); //- number
        data.dCustomPrice = parseInt(req.param('customPrice')); //- number

        //- prepare time
        data.dCookingTime = parseInt(req.param('prepareTime')); //- minutes

        //- tags
        data.dTag = req.param('tags').split(','); //- array

        //- minimum order
        data.dMinOrder = req.param('minOrder'); //- number
        

        //- create unique id
        var uuid = uuidv4();
        data.dish_id = uuid;

        //- upload image
        data.dImageName = req.param('dishImageName');
        ImageService.saveImage({
            req: req,
            res: res,
            fileInput: 'dishImage',
        });
        console.log(data);
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
                res.set('Content-Type', 'application/json');
                return res.json(200, {
                    error: false,
                    message: 'added new dish',
                    data:
                    {
                        update_dish_id: created_dish.dish_id,
                        create_dish_id: created_dish.id,
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

    //- view allergy by dish id

    //- view dietary by dish id

    //- add multiple ingredients to dish
    addIngredientsToDish: function(req, res)
    {   
        //- must be create_dish_id
        var did = req.param('create_dish_id');

        //- array id ingredients
        var ingredients = req.param('ingredientsID');
        // var ingredients = [
        //     {dish:"9b4f2d0c-de06-4e78-aca6-cb55afda8aec", "ingredient": "1"},
        //     {dish:"9b4f2d0c-de06-4e78-aca6-cb55afda8aec", "ingredient": "2"},
        //     {dish:"9b4f2d0c-de06-4e78-aca6-cb55afda8aec", "ingredient": "3"}
        // ];
        var converted = LodashService.convertToCreate({
            plainString: ingredients,
            fixedID: did,
            fixedName: 'dish',
            fixedName2: 'ingredient',
        });
        sails.log(converted);

        DishIngredient
        .findOrCreate(converted)
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

    //- delete all ingredients are not in the list
    deleteIngredientsFromDish:function(req, res)
    {
        //- get list of new Ingredients in dish
        //- this must be a create_dish_id
        var did = req.param('create_dish_id');
        //- current list => an array of id [1,2]
        var currentIngredientList = req.param('currentIngredientList');
        // sails.log(JSON.parse(currentIngredientList));
        //- get current ingredient list by dish ID
        DishIngredient
        .find({
            select: ['ingredient', 'dish']
        })
        .where({
            dish: did,
            ingredient: {'!': JSON.parse(currentIngredientList)}
        })
        .then(function(found_data){

            //- update data
            var count = 0;
            for(var i=0; i<found_data.length;)
            {
                DishIngredient.update(found_data[i].id, {
                    deletedAt: new Date()
                }).exec(function(err, updated_data){
                    if(err) res.badRequest();
                });
                i++;
                count++;
            }

            if(count==found_data.length)
            {
                return 1;
            }
            
            return 0;
            
        })
        .then(function(result){
            if(result == 1)
            {
                return res.json(200, {
                    error: false,
                    message: 'deleted ingredients',
                    data: null
                });
            }
        })
        .catch(function(err){
            return res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
        
        
    },

    //- add multiple ingredients to dish
    addAllergiesToDish: function(req, res)
    {
        //- must be create_dish_id
        var did = req.param('create_dish_id');
        //- string
        var allergies = req.param('allergies');
        // var allergies = [
        //     {dish:did, allergies: 1},
        //     {dish:did, allergies: 2},
        //     {dish:did, allergies: 3}
        // ];

        if(allergies.length > 0)
        {
            var converted = LodashService.convertToCreate({
                plainString: allergies,
                fixedID: did,
                fixedName: 'dish',
                fixedName2: 'allergy',
            });
    
            DishAllergy
            .create(converted)
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
        }else{
            res.ok('Allergy is null');
        }
        
    },

    //- add multiple ingredients to dish
    addDietariesToDish: function(req, res)
    {
        //- must be create_dish_id
        var did = req.param('create_dish_id');

        //- array of object ingredients
        var dietaries = req.param('dietaries'); //- []
        // var dietaries = [
        //     {dish:did, dietaries: 1},
        //     {dish:did, dietaries: 2},
        //     {dish:did, dietaries: 3}
        // ];
        if(dietaries.length > 0)
        {
            var converted = LodashService.convertToCreate({
                plainString: dietaries,
                fixedID: did,
                fixedName: 'dish',
                fixedName2: 'dietary',
            });
    
            DishDietary
            .create(converted)
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
        }else{
            res.ok('dietary is null');
        }
        
    },

    //- update by dish id
    update: function(req, res){
        if(req.method === 'PUT')
        {
            //- must be update_dish_id
            var did = req.param('update_dish_id');
            sails.log(did);
             //- update random field
            //- this is must be an object {}
            // var data = JSON.parse(req.param('data'));//- using for postman
            var data = JSON.parse(req.param('data'));
            sails.log(typeof(data));
            
            var fileName = req.param('dishImageName');
            var imageName = {};
            if(fileName != null)
            {
                //- upload image seperately
                imageName = {dImageName: fileName};
                ImageService.saveImage({
                    req: req,
                    res: res,
                    fileInput: 'dishImage'
                });
                sails.log('Upload image success');
                
            }
            sails.log('----------');
            sails.log(_.assign(data, imageName));
            sails.log(_.assign(data, {
                updatedAt: new Date()
            }));

            Dish
            .update(
            {
                dish_id: did
            }
            , 
            // {
            //     dDescribe: 'hehe2',
            //     dCost: 2,
            //     updatedAt: new Date()
            // }
            data
            )
            .then(function(updated_data){
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

    //- view dishes by chef ID
    viewByChefID: function(req, res){

        //- view by creates_chef_id
        var cid = req.param('create_chef_id');
        Dish
        .find()
        .where({
            chef: cid,
            deletedAt: null
        })
        .then(function(dish_found){
            if(_.isEmpty(dish_found))
            {
                res.json(200, {
                    error: false,
                    message: 'Dish not found',
                    data: [],
                });
            }else{
                res.json(200, {
                    error: false,
                    message: 'Dish found',
                    data: dish_found,
                });
            }
        })
        .catch(function(err){
            res.json(500, {
                error: true,
                message: 'errors',
                data: err
            });
        });
    },

    //- view dish - ingredient by chef id
    viewDishIngredient: function(req, res)
    {
        var dishID = req.param('create_dish_id');

        DishIngredient
        .find()
        .where({
            dish: dishID
        })
        .then(function(found_data){

        })
        .catch(function(err){
            res.negotiate({
                error: true,
                message: 'Errors',
                data: err
            });
        });
    },

    //- view dish - allergy by chef id
    viewDishAllergy: function(req, res)
    {
        var dishID = req.param('create_dish_id');

        DishAllergy
        .find()
        .where({
            dish: dishID
        })
        .then(function(found_data){

        })
        .catch(function(err){
            res.negotiate({
                error: true,
                message: 'Errors',
                data: err
            });
        });;
    },

    //- view dish - dietary by chef id
    viewDishDietary: function(req, res)
    {
        var dishID = req.param('create_dish_id');

        DishDietary
        .find()
        .where({
            dish: dishID
        })
        .then(function(found_data){

        })
        .catch(function(){

            res.negotiate({
                error: true,
                message: 'Errors',
                data: err
            });

        });
    },


    //- delete by dish id
    //- soft delete
    delete: function(req, res)
    {
        var dishID = req.param('update_dish_id');
        Dish
        .update({
            // id: dishID,
            dish_id: dishID,
        },{
            deletedAt: new Date()
        })
        .then(function(deleted_data){
            res.ok({
                error: false,
                message: 'Soft deleted single dish',
                data: deleted_data
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

    deleteAll:function(req, res)
    {
        DishIngredient
        .destroy({})
        .exec(function(err){
            if(err)res.badRequest(err);
            res.ok();
        });
        // res.ok();
    },

    //- delete multiple dish by dish array of object
    deleteMultiple: function(req, res)
    {
        //- ["",""]
        var dishIDData = req.param('update_dish_id_array'); 
        
        //- using postman
        // let d2 = JSON.parse(dishIDData);
        // console.log('dish id type: ',typeof(d2));
        // console.log(JSON.parse(dishIDData));

        // console.log('dish id array: ', dishIDData);
        Dish
        .update({ 
            // dish_id: JSON.parse(dishIDData), //- using postman
            dish_id: dishIDData
        }
        ,{
            deletedAt: new Date()
        })
        .then(function(deleted_data){
            res.ok({
                error: false,
                message: 'Deleted success...',
                data: deleted_data
            });
        })
        .catch(function(err){
            res.negotiate({
                error: true,
                message: 'Errors',
                data: err
            });
        });
    }
    
};

