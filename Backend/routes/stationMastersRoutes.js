const express=require("express");
const router=express.Router();

const { createStationMaster, getStationMaster,updateStationMaster } = require('../controllers/stationMastersController');
const { auth,isOwner,isStationMaster } = require('../middlewares/Auth');

router.post('/addStationMaster',auth,isOwner,createStationMaster);
router.get('/getStationMaster/:id',getStationMaster);
router.post('/updateStationMaster/:id',auth,isStationMaster,updateStationMaster);



module.exports = router;