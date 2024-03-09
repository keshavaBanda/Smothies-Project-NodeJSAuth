const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email required"],
        unique: true,
        lowercase: [true, "email should be lowercase"],
        validate: [isEmail, "Please Enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "password required"],
        minlength: [6, "password must be minimum 6 characters"]
    }
})

//before saving data
UserSchema.pre('save', async function (next) {
    console.log('ready to create a user', this);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

//after saving data
UserSchema.post('save', function (doc, next) {
    console.log('user was created and saved', doc);
    next();
})

//static login function
UserSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    console.log('user===>',user);
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
}

//creating model
const User = mongoose.model('user', UserSchema)

//export the model;
module.exports = User;
