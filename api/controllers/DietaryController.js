/**
 * DietaryController
 *
 * @description :: Server-side logic for managing Dietaries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    create: function(req, res)
    {
        var data = {};
        data.dName = req.param('name');
        data.dDescription = req.param('describe');

        Dietary
        .create(data)
        .then(function(created_data){
            res.created({
                error: false,
                message: 'created new dietary',
                data: created_data
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

    viewAll: function(req, res)
    {
        Dietary
        .find({})
        .then(function(found_data){
            res.created({
                error: false,
                message: 'view all',
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
    },

    viewAllWithLimit: function(req, res)
    {
        //- limit will be a number
        var limit = parseInt(req.param('limit'));
        Dietary
        .find({})
        .limit(limit)
        .then(function(found_data){
            res.created({
                error: false,
                message: 'view all',
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
    }

};
