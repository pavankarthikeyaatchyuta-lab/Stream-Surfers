var mongoose=require("mongoose");
var servicebookingSchema=new mongoose.Schema({
    bookingId:{
        type:String,
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
    vehicleModel:{
        type:String,
        required:true
    },
    serviceType:{
        type: String,
        required:true
    },
    bookingDate:{
        type:Date,
        required:true
    },
    mechanicName:{
        type:String,
        required:true
    },
    estimatedCost:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","In Progress","Completed","Booked"],
        default:"Booked"
    }
});
module.exports=mongoose.model("servicebooking",servicebookingSchema);
