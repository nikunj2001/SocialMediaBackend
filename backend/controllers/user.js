const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
exports.register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        console.log(email);
        let user  = await User.findOne({email});
        if(user){
         return res.status(404).json({success:false,message:"user already exist"}) 

        }
        user = await User.create({name,email,password,avatar:{publid_id:"Sample",url:"sampleUrl"}});
            const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET);
            res.status(200).cookie("token",token,{expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
                }).json({success:true,user,token});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.login = async (req,res)=>{
    try {
        const {email,password} =req.body;
        const user = await User.findOne({email}).select("+password");
        console.log(user);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
            console.log(user);
            const isMatched = await bcrypt.compare(password,user.password);
          

            if(!isMatched){
                return res.status(400).json({
                success:false,
                message:"Wrong Password"
            })
        }
            const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET);
            res.status(200).cookie("token",token,{expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true
                }).json({success:true,user,token});
            
        }
     catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
exports.logout = async(req,res)=>{
    try {
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({success:true,message:"Logged Out"});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.followUser = async (req,res)=>{
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        if(!userToFollow){
            res.status(404).json({
            success:false,
            message:"User not found"
        })
        }
       
        if(loggedInUser.following.includes(userToFollow._id)){
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            const indexFollowers = userToFollow.follower.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexFollowing,1);
            userToFollow.follower.splice(indexFollowing,1);
            await loggedInUser.save();
            await userToFollow.save();
            res.status(200).json({
            success:true,
            message:"User unfollowed"
        })
            }else{
                 loggedInUser.following.push(userToFollow._id);
                 userToFollow.follower.push(loggedInUser._id);
            console.log(userToFollow.follower);
            console.log(loggedInUser.following);

                 await loggedInUser.save();
                 await userToFollow.save();
        res.status(200).json({
            success:true,
            message:"User followed"
        })
    }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updatePassword = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        const {oldPassword,newPassword} = req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:"Please provide old and new password"
            }); 
        }
        const isMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Old password"
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success:true,
            message:"Password updated"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateProfile = async (req,res)=>{
    try {
        const user = User.findById(req.user._id);
        const {name,email} = req.body;
        if(name){
            user.name= name;
        }   
        console.log(name);     
        if(email){
            user.email = email;
        }
        console.log(email);
        console.log(user);
        await user.save(function (){});
        res.status(200).json({
            success:true,
            message:"PROFILE  UPDATED"
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}
exports.deleteUser = async (req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        const posts=user.posts;
        const followers=user.follower;
        const userId = user._id;
        const following=user.following;
        await user.remove();
        res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true});        
        for(let i=0;i<posts.length;i++){
            const post = await Post.findById(posts[i]);
            await post.remove();
        }
        // removing from followers following
            for(let i=0;i<followers.length;i++){
                const follower =await User.findById(followers[i]);
                const index = follower.following.indexOf(userId);
                follower.following.splice(index,1);
                await follower.save()
            }
            for(let i=0;i<following.length;i++){
                const follows =await User.findById(following[i]);
                const index = follows.follower.indexOf(userId);
                follows.follower.splice(index,1);
                await follows.save()
            }
        res.status(200).json({
            success:true,
            message:"Profile deteled"
        })
    } catch (error) {
     res.status(500).json({
         success:false,message:error.message
     })   
    }
}
exports.myProfile=async (req,res)=>{
    try {
        const user = await User.findById(req.user._id).populate("posts");
         res.status(200).json({
         success:true,user
     })  
    } catch (error) {
         res.status(500).json({
         success:false,message:error.message
     })  
    }
}
exports.getUserPfile =async (req,res)=>{

    try {
        const user = await User.findById(req.params.id).populate("posts");
        if(!user){
             res.status(404).json({
         success:false,message:"User not Found"
     }) 
    }
         res.status(200).json({
         success:true,user
     }) 
    } catch (error) {
         res.status(500).json({
         success:false,message:error.message
     }) 
    }
}
exports.getAllUser = async(req,res)=>{
    try {
       const  user = await User.find({});
        res.status(200).json({
         success:true,user
     }) 
    } catch (error) {
         res.status(500).json({
         success:false,message:error.message
     }) 
    }
}