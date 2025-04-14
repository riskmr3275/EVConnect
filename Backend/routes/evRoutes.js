const express=require("express");
const router=express.Router();

const { createEV, getEV, getEVById, updateEV, deleteEV } = require("../controllers/evController");
const { auth,isOwner,isStationMaster,isUser } = require('../middlewares/Auth');

router.post("/addEV",auth,isUser,createEV);
router.get("/getEV",auth,isUser, getEV);
router.get("/getEVById/:id",auth,isUser, getEVById);
router.post("/updateEV/:id",auth,isUser, updateEV);
router.delete("/deleteEV/:id",auth,isUser, deleteEV);


module.exports = router;