var express=require("express");
var router=express.Router();
var Servicebooking=require("../models/servicebooking")

router.get("/servicebookings",function(req,res) {
    Servicebooking.find()
    .then(function(servicebookings){
        res.json(servicebookings);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.get("/servicebookings/:id",function(req,res){
    Servicebooking.findById(req.params.id)
    .then(function(servicebooking){
        res.json(servicebooking);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.post("/servicebookings",function(req,res) {
    var servicebooking= new Servicebooking({
        bookingId: req.body.bookingId,
        customerName: req.body.customerName,
        vehicleNumber: req.body.vehicleNumber,
        vehicleModel: req.body.vehicleModel,
        serviceType: req.body.serviceType,
        bookingDate: req.body.bookingDate,
        mechanicName:req.body.mechanicName,
        estimatedCost:req.body.estimatedCost,
        status:req.body.status
    });
    servicebooking.save()
    .then(function(servicebooking){
        res.json(servicebooking);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.put("/servicebookings/:id",function(req,res){
    Servicebooking.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    )
    .then(function(servicebookings){
        res.json(servicebookings);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.delete("/servicebookings/:id",function(req,res){
    Servicebooking.findByIdAndDelete(req.params.id)
    .then(function(){
        res.json({Message: "Service booking deleted successfully"});
    })
    .catch(function(err){
        res.status(500).json(err);
    });
});
module.exports = router;