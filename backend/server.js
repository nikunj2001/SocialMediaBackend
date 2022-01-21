const app = require("./app")
const {dbConnect} = require("./config/database")

console.log(dbConnect);
dbConnect();
app.listen(process.env.PORT,()=>{
    console.log("SErver rrunning");
})