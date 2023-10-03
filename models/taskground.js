const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true,
        // trim: true
    },
    task: {
        type: String,
        // required: true,
        // trim: true
    },
    dueDate: {
        type: Date,
        // required: true
    },
    status: {
        type: Number,
        // required: true
    }
});
// taskSchema.pre('save',async function(next) {
//    if (this.title) {
//         this.title = this.title.toUpperCase();
//     }

//     // Continue with the save operation
//     next();
// });
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;