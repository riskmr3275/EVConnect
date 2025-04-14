// const stationMasterService = require('../services/stationMasterServices');

// class StationMasterController{
//     async createStationMaster(req,res){
//         try{
//             const {name,email,password,contactNumber,accountType,gender,dataOfBirth,stationId,shift} = req.body;
//             const stationMaster= await stationMasterService.createStationMaster({
//                 name,
//                 email,
//                 password,
//                 contactNumber,
//                 accountType,
//                 gender,
//                 dataOfBirth,
//                 stationId,
//                 shift,
//             })
//             return res.status(201).json({message:"Station Master Created Successfully",stationMaster});
//         }
//         catch(error){
//             return res.status(400).json({message:error.message});
//         }
//     }


// }