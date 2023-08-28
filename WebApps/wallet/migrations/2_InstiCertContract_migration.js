let InstitutionCertificates = artifacts.require("./InstitutionCertificates.sol");
module.exports = function(deployer){
    deployer.deploy(InstitutionCertificates);
}