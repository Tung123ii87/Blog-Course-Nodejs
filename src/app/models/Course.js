const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Course = new Schema({
    _id: { type: Number,},
    name: {type:String, require: true},
    description: {type:String,},
    image: {type:String,},
    videoId: {type:String, require: true},
    level: {type:String,},
    slug: { type: String, slug: 'name', unique: true },
  }, {
    _id: false,
    timestamps: true,
  });

mongoose.plugin(slug);
Course.plugin(AutoIncrement);
Course.plugin(mongooseDelete, { 
  deletedAt : true,
  overrideMethods: 'all', });

module.exports = mongoose.model('Course', Course);
