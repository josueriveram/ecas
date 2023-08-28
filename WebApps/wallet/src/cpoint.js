import PointsContract from "./contracts/LoyaltyPoints.json";
import contract from "truffle-contract";

export default async(provider) => {
    try{
    const cpoints = contract(PointsContract);
    cpoints.setProvider(provider);
    let instance = await cpoints.deployed();
    return instance;
    }catch(e){return null;}
};