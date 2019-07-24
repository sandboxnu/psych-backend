var mongoose = require('mongoose');
var Schema = mongoose.Schema
var autoIncrement = require('mongoose-plugin-autoinc');

var ConfigSchema = new Schema({
	'time': String,
	'configID': Number, 
	'configData': String,
});

ConfigSchema.methods.getConfigID = function() {
    return this.configID
};

ConfigSchema.plugin(autoIncrement.plugin, { model: 'Config', field: 'configID', startAt: 1});

module.exports = mongoose.model('Config', ConfigSchema);