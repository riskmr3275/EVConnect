const express = require('express');
const router = express.Router();

const { createStation,getAllStations,getStationById,updateStation,deleteStation,getStationsByLocation } = require('../controllers/stationController');
const { auth,isOwner } = require('../middlewares/Auth');


router.post('/addStation',auth,isOwner,createStation);
router.get('/getAllStations',getAllStations);
router.get('/getStationById/:id',getStationById);
router.post('/updateStation/:id',auth,isOwner,updateStation);
router.delete('/deleteStation/:id',auth,isOwner,deleteStation);
router.get('/getStationByLocation',getStationsByLocation);


module.exports = router;