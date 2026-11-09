var express=require("express");
var router=express.Router();
var Vehicle=require("../models/vehicle")

router.get("/vehicles",function(req,res) {
    Vehicle.find()
    .then(function(vehicles){
        res.json(vehicles);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.get("/vehicles/:id",function(req,res){
    Vehicle.findById(req.params.id)
    .then(function(vehicle){
        res.json(vehicle);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.post("/vehicles",function(req,res) {
    var vehicle= new Vehicle({
        VehicleNumber: req.body.VehicleNumber,
        model: req.body.model,
        ownerName: req.body.ownerName,
        ownerPhone: req.body.ownerPhone
    });
    vehicle.save()
    .then(function(vehicle){
        res.json(vehicle);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.put("/vehicles/:id",function(req,res){
    Vehicle.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    )
    .then(function(vehicles){
        res.json(vehicles);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.delete("/vehicles/:id",function(req,res){
    Vehicle.findByIdAndDelete(req.params.id)
    .then(function(){
        res.json({Message: "Vehicle deleted successfully"});
    })
    .catch(function(err){
        res.status(500).json(err);
    });
});
module.exports = router;