const stationMasterService = require('../services/stationMasterServices');

class StationMasterController{
    async createStationMaster(req,res){
        try{
            const {name,email,setPassword,contactNumber,accountType,gender,dateOfBirth,stationId,shift} = req.body;
            const stationMaster= await stationMasterService.createStationMaster({
                name,
                email,
                password:setPassword,
                contactNumber,
                accountType,
                gender,
                dateOfBirth,
                stationId,
                shift,
                user:req.user,
            })
            return res.status(201).json({message:"Station Master Created Successfully",stationMaster,success:true});
        }
        catch(error){
            return res.status(400).json({success:false,message:error.message});
        }
    }

    async getStationMaster(req, res) {
        try {
            const { id } = req.params;
            const stationMaster = await stationMasterService.getStationMasterById(id);
            if (!stationMaster) {
                return res.status(404).json({ message: "Station Master not found" });
            }
            return res.status(200).json({ message: "Station Master retrieved successfully", stationMaster });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    
    async updateStationMaster(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedStationMaster = await stationMasterService.updateStationMaster(id, updatedData);
            if (!updatedStationMaster) {
                return res.status(404).json({ message: "Station Master not found" });
            }
            return res.status(200).json({ message: "Station Master updated successfully", updatedStationMaster });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new StationMasterController();