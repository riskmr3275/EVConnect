const stationMasterService = require('../services/stationMasterServices');

class StationMasterController{
    async createStationMaster(req,res){
        try{
            const {name,email,password,contactNumber,accountType,gender,dateOfBirth,stationId,shift} = req.body;
            const stationMaster= await stationMasterService.createStationMaster({
                name,
                email,
                password,
                contactNumber,
                accountType,
                gender,
                dateOfBirth,
                stationId,
                shift,
                user:req.user,
            })
            return res.status(201).json({message:"Station Master Created Successfully",stationMaster});
        }
        catch(error){
            return res.status(400).json({message:error.message});
        }
    }

    async getStationMaster(req,res){
        try{

        }
        catch(error){
            return res.status(400).json({message:error.message});
        }
    }
    
    async updateStationMaster(req,res){
        try{

        }
        catch(error){
            return res.status(400).json({message:error.message});
        }
    }
}

module.exports = new StationMasterController();