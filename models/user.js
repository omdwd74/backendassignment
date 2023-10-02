const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required:[true,'user cant be blank']
    },
    email:{
        type:String,
        required:[true,'Not blank'],
        unique:true

    },
    password:{
        type:String,
        required:[true,'Cant be blank']
    },
    confirmPassword:{
        type:String,
        required:[true,'Cant be blank'],
        validate :{
            validator:function (data){
                return data === this.password;

            },
            message: 'Passwords do not match'
        }
    }

}) 
userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}


userSchema.pre('save' , async function (next){
    try{
        if(!this.isModified('password')) return next();
        this.password =  await bcrypt.hash(this.password,12);
        // this.password  hashed
        next();
        
    }
    catch(err){
        return next(err);
    }
})

module.exports = mongoose.model('User',userSchema);