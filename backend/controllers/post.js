const res = require("express/lib/response")
const Post = require("../models/Post")
const User = require("../models/User");
exports.createPost=async (req,res)=>{
        try {
            const newPostData = {
                caption:req.body.caption,
                image:{
                    publid_id:"req.body.public_id",
                    url:"req.body.url"
                },
                owner:req.user._id,

            }
            const post = await Post.create(newPostData);
            const user = await User.findById(req.user._id);
            user.posts.push(post._id);
            await user.save();
            res.status(201).json({
                success:true,
                post
            });
        } catch (error) {
            res.status.json({
                success:false,message:error.message
            })
        }
}

exports.likeAndUnlikePost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({
                  success:true,
                  message:"Post not found"
              })
        }
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Post Unliked"
            })
        }else{
              post.likes.push(req.user._id);
              await post.save();
              return res.status(200).json({
                  success:true,
                  message:"Post liked"
              })
        }
      
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.deletePost = async (req,res)=>{
    try {
        const post =   await Post.findById(req.params.id);   
        if(!post){
            return res.status(400).json({
                  success:true,
                  message:"Post not found"
              })
        }
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        await post.remove();
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();
        res.status(200).json({
            success:true,
            message:"Post Deleted"
        })  
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.getPostOffFollowing = async (req,res)=>{
      try {
        const user = await User.findById(req.user._id);
        const posts = await Post.find({
            owner:{
                $in: user.following
            }
        })
        res.status(200).json({
            success:true,
            posts
        })         
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.updateCaption = async (req,res)=>{
     try {
        const post = await Post.findById(req.params.id);
        console.log(req.params.id);
        if(!post){
             res.json({
            success:false,
            message:"Post not found"
        })
        return;
        }
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }
        post.caption=req.body.caption;
         res.json({
            success:true,
            message:"Caption updated"
        })

    } catch (error) {
         res.json({
            success:false,
            message:error.message
        })
    }
}

