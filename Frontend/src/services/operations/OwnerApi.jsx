import { useNavigate } from "react-router-dom";
import { setToken } from "../../slices/authSlice";
import { toast } from "react-toastify";
import { setUser,setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { stationEndpoints  } from "../api";
 
const {
  ADD_STATION
} = stationEndpoints;

export function addingStation(station,token) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...");
      dispatch(setLoading(true));
      console.log("object  from woner pai",station)
      const {
        name,
        companyName,
        ownerType,
        address,
        latitude,
        longitude,
        totalSlots,
        contact,
        district,
        state,
        pincode,
    }=station;
      try {
        const response = await apiConnector(
            "POST",
            ADD_STATION,
            {
              name,
              companyName,
              ownerType,
              address: address +" " + district +" "+ state+" " + pincode,
              latitude,
              longitude,
              totalSlots,
              contact,
            },
            {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // optional but good to include
            }
          ).catch((error) => console.log("error from frontend", error));
          
        console.log("Adding Station API RESPONSE............", response);
  
        if (!response.data.success) {
          throw new Error(response.data.message);
         
        }
        toast.success("Station Added");
        
      } catch (error) {
        console.log("Adding Station ERROR............", error);
        toast.error("Adding Station Failed");
        dispatch(setLoading(false));
      }
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    };
  }