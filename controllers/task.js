const Task = require('../models/task');

module.exports = {
    async saveTask(req, res) {
        try {
            var task = new Task();
            task.start = req.payload.start;
            task.end = req.payload.end;
            task.desc = req.payload.desc;
            task.title = req.payload.title;
            task.allDay = req.payload.allDay;
            task.userId = req.payload.userId;
            let response = await task.save();
            return {object:response, message:"Task has ben saved successfully!"};
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    async getTasks(req, res) {
        try {
            let response = await Task.find();
            return response;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    async getTasksByUser(req, res) {
        try {
            let response = await Task.find({userId: req.params.userId});
            return response;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    async updateTask(req, res) {
        try {
            let response = await Task.update({ _id: req.params.id }, req.payload);
            return {object:response, message:"Task has ben updated successfully!"};
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    async deleteTask(req, res) {
        try {
            let response = await Task.find({ _id: req.params.id }).remove();
            return {message:"Task has ben deleted successfully!"};
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
}