const User = require("../models/User")

const jwt = require("jsonwebtoken");
exports.isAuthenticated=async(req,res,next)=>{
        try {
            const token= req.cookies;
            console.log(req.cookies);
            if(!token){
                return res.status(401).json({
                    message:"Please Login first"
                })
            }
            console.log(typeof  token.token);
            const decoded = await jwt.verify(token.token,process.env.JWT_SECRET);
            console.log(decoded,"hiuk");
            req.user = await User.findById(decoded._id);
            next();
        } catch (error) {
            res.status(500).json({
                message:error.message
            })
        }
}