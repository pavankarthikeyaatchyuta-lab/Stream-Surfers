var mongoose=require("mongoose");
var servicebillSchema=new mongoose.Schema({
    billNumber:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    bookingId:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    customerName:{
        type:String,
        required:true
    },
    vehicleNumber:{
        type:String,
        required:true
    },
    partsCost:{
        type:Number,
        default:0
    },
    laborCost:{
        type: Number,
        default:0
    },
    totalCost:{
        type:Number,
        required:true
    },
    billedDate:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("servicebill",servicebillSchema);
