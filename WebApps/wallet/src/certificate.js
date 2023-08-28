import CertificatesContract from "./contracts/InstitutionCertificates.json";
import contract from "truffle-contract";

export default async(provider) => {
    try{
    const certificates = contract(CertificatesContract);
    certificates.setProvider(provider);
    let instance = await certificates.deployed();
    return instance;
    }catch(e){
        return null
    }
};