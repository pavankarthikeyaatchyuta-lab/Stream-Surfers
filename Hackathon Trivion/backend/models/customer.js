var mongoose=require("mongoose");
var customerSchema=new mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    mail:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("customer",customerSchema);