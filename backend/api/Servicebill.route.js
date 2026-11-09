var express=require("express");
var router=express.Router();
var Servicebill=require("../models/servicebill");

router.get("/servicebills",function(req,res) {
    Servicebill.find()
    .then(function(servicebills){
        res.json(servicebills);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.get("/servicebills/:id",function(req,res){
    Servicebill.findById(req.params.id)
    .then(function(servicebill){
        res.json(servicebill);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});

function handleCreateBill(req, res) {
  const bookingId = req.body.bookingId;
  const customerName = req.body.customerName;
  const vehicleNumber = req.body.vehicleNumber;
  const partsCost = Number(req.body.partsCost || 0);
  const laborCost = Number(req.body.laborCost || 0);

  const totalCost = Number(req.body.totalCost || req.body.totalAmount || (partsCost + laborCost));
  const billNumber = req.body.billNumber || Math.floor(100000 + Math.random() * 900000);

  const bill = new Servicebill({
    billNumber: billNumber,
    bookingId: bookingId,
    customerName: customerName,
    vehicleNumber: vehicleNumber,
    partsCost: partsCost,
    laborCost: laborCost,
    totalCost: totalCost
  });

  bill.save()
    .then(function (savedBill) {
      return res.status(201).json(savedBill);
    })
    .catch(function (err) {
      return res.status(400).json({ error: err.message });
    });
}

router.post('/service-bills', handleCreateBill);
router.post('/servicebills', handleCreateBill);

router.put("/servicebills/:id",function(req,res){
    Servicebill.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    )
    .then(function(servicebills){
        res.json(servicebills);
    })
    .catch(function(err){
        res.status(500).json(err);
    })
});
router.delete("/servicebills/:id",function(req,res){
    Servicebill.findByIdAndDelete(req.params.id)
    .then(function(){
        res.json({Message: "Service bill deleted successfully"});
    })
    .catch(function(err){
        res.status(500).json(err);
    });
});
module.exports = router;
