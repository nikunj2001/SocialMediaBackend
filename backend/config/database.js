const mongoose = require("mongoose");

 exports.dbConnect=async()=>{
     const DB_URL ="mongodb://0.0.0.0:27017/socialMedia";
    await mongoose.connect(DB_URL).then(x=>{
         console.log("Connected......DB");
     }).catch(err=>{
         console.log(err);
     })
}
