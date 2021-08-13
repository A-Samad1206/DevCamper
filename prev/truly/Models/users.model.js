const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    }
})
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(5);
        this.password = await bcrypt.hash(this.password, salt)
        next()
    }
    catch (err) {
        console.log(err)
        next(err)
    }
})

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    }
    catch (err) {
        next(err)
    }
}

module.exports = mongoose.model('user', userSchema);