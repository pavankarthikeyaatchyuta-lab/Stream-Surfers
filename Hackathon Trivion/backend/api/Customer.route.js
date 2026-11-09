var express=require("express");
var router=express.Router();
var Customer=require("../models/customer")

router.get("/customers",function(req,res) {
    Customer.find()
    .then(function(customers){
        res.json(customers);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.get("/customers/:id",function(req,res){
    Customer.findById(req.params.id)
    .then(function(customer){
        res.json(customer);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.post("/customers",function(req,res) {
    var customer= new Customer({
        customerName: req.body.customerName,
        phone: req.body.phone,
        mail: req.body.mail || req.body.mailid || req.body.email
    });
    customer.save()
    .then(function(customer){
        res.json(customer);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.put("/customers/:id",function(req,res){
    Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    )
    .then(function(customers){
        res.json(customers);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.delete("/customers/:id",function(req,res){
    Customer.findByIdAndDelete(req.params.id)
    .then(function(){
        res.json({Message: "Customer deleted successfully"});
    })
    .catch(function(err){
        res.status(500).json(err);
    });
});
module.exports = router;
