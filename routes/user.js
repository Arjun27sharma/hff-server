import { verifyToken } from "./auth.js";
import express from "express"
import User from "../models/User.js";
const router = express.Router()

router.get("/user", verifyToken, async (req, res) => {

    try{

        const currentUserId = req.id
        const currentUser = await User.find({_id : currentUserId})
        res.status(200).json(currentUser)
    }
    catch(err){
        res.status(400).json(err)
    }
})

router.put("/:userId", verifyToken, async (req, res) => {
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId, 
            {
                $set : req.body
            },
            {new : true}
        )
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})

router.delete("/", async (req, res) => {
    try{
        await User.deleteMany()
        res.status(200).json("Deleted all users")
    }
    catch(err){
        console.log(err)
    }
})


export default router