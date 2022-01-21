const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jew = require('jsonwebtoken')
const userSchema= mongoose.Schema({
        name:{
            type:String,
            required:[true,"Please enter a name"]
        },
        avatar:{
            public_id:String,
            url:String
        },
        email:{
            type:String,
            required:[true,"Please enter a name"]
            ,unique:[true,"Email already exists"]
        },
        password:{
            type:String,
            required:[true,"Please enter a password"]
            ,minlength:[6,"Password must be 6 char long"]
        },posts:[
            {
            type:mongoose.Schema.Types.ObjectId,
            }
        ],
        follower:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"

        }
        ],
        following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"

        }
        ]
});

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

userSchema.methods.createToken = async ()=>{
       return jwt.sign({_id:this._id},"POOOOOORVVVIIII")
}
module.exports = mongoose.model("User",userSchema);