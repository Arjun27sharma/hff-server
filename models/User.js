import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    avatar_url : {
        type : String
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    role : {
        type : String,
        default : "user"
    },
    instagram_link : {
        type : String
    },
    twitter_link : {
        type : String
    },
    linkedin_link : {
        type : String
    },
    other_link : {
        type : String
    }
}, {timestamps : true})

const User = mongoose.model("User", userSchema)
export default User