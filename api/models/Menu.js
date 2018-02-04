/**
 * Menu.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection:'mongoAdapter',
  tableName:'Menu',
  attributes: {
    id:{
      type: 'integer',
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    mName:{
      type: 'string',
    },
    mCost:{
      type: 'float', //- or double
    },
    mSuggestedPrice:{
      type: 'float', //- or double
    },
    mCustomPrice:{
      type: 'float',
    },
    mCookingTime:{
      type: 'integer',
    },
    mServingOption:{
      type: 'array',
    },
    mTag:{
      type: 'array'
    },
    mMinOrder:{
      type: 'integer'
    },

    deleted_at:{},

    //- foreign key
    dishes:{
      collection: 'Dish',
      via: 'menus',
      through: 'menudish',
    },
    chef:{
      model: 'Chef',
    },
    

  }
};

