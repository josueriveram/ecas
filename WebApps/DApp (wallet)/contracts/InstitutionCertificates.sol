// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;
contract InstitutionCertificates {
    address public contractOwner;
    uint public lastID;
    
    struct Certificate
    {
       
        string file;
        string description;
        string active;
    }

    struct PersonCertificate
    {
        uint[] idCert;

    }
    
    mapping (uint => Certificate) certificates;
    mapping (address => PersonCertificate) certificatesToSend;       
    uint[] public certificateAccounts;
    
    constructor() 
    {
        contractOwner = msg.sender;
    }
    modifier  isOwner(){
        require(contractOwner == msg.sender);
        _;
    }
    
    function newCertificate(address _sendToAccount, string memory _file, string memory  _description) public isOwner {
       
        lastID = lastID + 1;
        Certificate storage l_certificate = certificates[lastID];
        l_certificate.file = _file;
        l_certificate.description = _description;
        l_certificate.active = "true";
        
        PersonCertificate storage certperson = certificatesToSend[_sendToAccount];
        certperson.idCert.push(lastID);
        
        certificateAccounts.push(lastID);
        certificateAccounts.length - 1;
    }
    function setCertificate(uint _ID, string memory _file, string memory  _description) public isOwner {
      
        Certificate storage l_certificate = certificates[_ID];
        
        l_certificate.file = _file;
        l_certificate.description = _description;
    }
    function setActive(uint _ID, string memory _active) public isOwner {
       
        Certificate storage l_certificate = certificates[_ID];
        l_certificate.active = _active;
    }
    
    function getCertificate(uint _ID) view public returns ( string memory, string memory, string memory) {
        Certificate memory cert = certificates[_ID];
        return (
        cert.file,
        cert.description,
        cert.active);
    }
    function getLastIndexCertificate() public view returns (uint) {
        return lastID;
    }
    function getTotalCertificates(address addr) public view returns (uint) {
        PersonCertificate memory certs = certificatesToSend[addr];
        uint  numcert = certs.idCert.length;
        return numcert;
    }
    function getCertificates(address addr) public view returns (PersonCertificate memory) {
     PersonCertificate memory certs = certificatesToSend[addr];
     return certs;
    }
}