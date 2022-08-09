import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import express from "express"
const router = express.Router()


export const verifyToken = async (req, res, next) => {

    try{
        const cookies = req.headers.cookie
        const token = cookies.split("=")[1]
        // console.log(token)

        if (token) {
            
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    return res.status(400).json({ message: "Invalid Token" });
                  }

                req.id = user._id
            })

            console.log("Token Vefification is done Successfully")

            next()
        }
        else{
            res.json({message : "No token provided"})
        }

    }
    catch(err){
        res.status(400).json("error" + err)
    }
}


router.post("/register", async (req, res) => {
    //checking if all fields are enterred or not
    const { username, email, password } = req.body
    if (!username || !password || !email) {
        res.status(400).json("Enter all the fields")
    }
    //try catch block
    try {
        //check for email already exists in database
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            res.status(400).json("User already exists")
        }

        //hasing the password and updating it
        const password = await bcrypt.hash(req.body.password, 10)

        //saving the current user data to database
        const user = new User({ username: username, email: email, password: password })
        const registeredUser = await user.save()

        console.log("The New User has been Registered")
        res.status(200).json(registeredUser)
    }
    catch (err) {
        res.status(500).json(err)
    }

})

router.post("/login", async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json("Enter all the fields")
    }

    try {

        const userExists = await User.findOne({ email: email })
        if (userExists) {
            const isMatch = await bcrypt.compare(password, userExists.password)

            if (isMatch) {
                const token = jwt.sign({ _id: userExists._id }, process.env.JWT_SECRET, {expiresIn: "5d",});

                res.cookie("jwt", token, {
                    path: "/",
                    expires: new Date(Date.now() + 1000 * 432000), // 5 days
                    httpOnly: true,
                    sameSite: "lax",
                    // secure : true
                  });

                console.log("User Login success")
                res.json({token : token, user : userExists})
            }
            else {
                res.status(400).json("Invalid Credentials")
            }
        }
        else {
            res.status(400).json("Invalid Credentials")
        }

    }
    catch (err) {
        res.status(500).json(err)
    }
})




router.post("/logout", verifyToken, async (req, res) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if (!prevToken) {
      return res.status(400).json({ message: "Couldn't find token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication failed" });
      }

      res.clearCookie("jwt")
      req.cookies[`jwt`] = "";

      console.log("User Logout Success")
      
      return res.status(200).json({ message: "Successfully Logged Out" });
    });
})






export default router