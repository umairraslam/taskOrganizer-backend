var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskSchema = new Schema({
    start: Date,
    end: Date,
    title: String,
    desc: String,
    allDay: Boolean,
    userId: String
});
module.exports = mongoose.model('Task', taskSchema);