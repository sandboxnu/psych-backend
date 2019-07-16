var mongoose = require('mongoose');
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-plugin-autoinc');

var DataSchema = new Schema({
	'time': String,
	'completionID': String,
	'experimentID': Number,
	'configID': Number,  //foreign key to Configs collection?
	'data': String,
});

DataSchema.plugin(autoIncrement.plugin, { model: 'DataRecord', field: 'experimentID', startAt: 1});

module.exports = mongoose.model('DataRecord', DataSchema);