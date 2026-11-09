var mongoose=require("mongoose");
var vehicleSchema=new mongoose.Schema({
    VehicleNumber:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },
    ownerName:{
        type:String,
        required:true
    },
    ownerPhone:{
        type:Number,
        required:true
    }
});
module.exports=mongoose.model("vehicle",vehicleSchema);