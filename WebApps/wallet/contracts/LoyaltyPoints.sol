// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;
contract LoyaltyPoints {
    address public contractOwner;
    uint public lastID;
    
    struct Operation
    {
       
        string typeOperation;
        string description;
        int points;
    }

    struct PersonOperations
    {
        uint[] idOperation;
        uint totalPoints;

    }
    
    mapping (uint => Operation) operations;
    mapping (address => PersonOperations) personoperations;       
    uint[] public OperationsAccounts;
    
    constructor() 
    {
        contractOwner = msg.sender;
    }
    
    modifier  isOwner(){
        require(contractOwner == msg.sender);
        _;
    }
    
    function newOperations(address _sendToAccount, string memory _tfile, string memory  _description, int _point) public isOwner {
       
        //Validar si se puede realizar la operación de acuerdo al tipo y saldo
       
        uint pt = getLoyaltyPointTotal(_sendToAccount);
        
        if (_point < 0 && pt == 0) { revert(); }
        if (_point < 0 && int(pt) < abs(_point)) { revert(); 
            
        }
          
           
        lastID = lastID + 1;
        Operation storage l_operation  = operations[lastID];
        l_operation.typeOperation = _tfile;
        l_operation.description = _description;
        l_operation.points = _point;
        
        
        PersonOperations storage personope =personoperations[_sendToAccount];
        int ptos = int(personope.totalPoints) + _point;
        personope.totalPoints = uint(ptos); 
        personope.idOperation.push(lastID);

        OperationsAccounts.push(lastID);
        OperationsAccounts.length - 1;
   
        
    }
    
    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
    
    
    function getOperation(uint _ID) view public returns ( string memory, string memory, int ) {
        Operation memory opera = operations[_ID];
        return (
        opera.typeOperation,
        opera.description,
        opera.points
        );
    }
    function getLastIndexOperation() public view returns (uint) {
        return lastID;
    }
    function getLoyaltyPointTotal(address addr) public view returns (uint) {
        PersonOperations memory personope = personoperations[addr];
        uint totalpoints = personope.totalPoints;
        return totalpoints;
    }
    function getOperations(address addr) public view returns (PersonOperations memory) {
     PersonOperations memory personope = personoperations[addr];
     
     return personope;
    }
     function getOperations2(address addr) public view returns (Operation[] memory) {
    
     PersonOperations memory personope = personoperations[addr];
      Operation[] memory transact = new Operation[](personope.idOperation.length);
     for(uint8 i=0;i< personope.idOperation.length;i++){
         
        Operation memory opera = operations[personope.idOperation[i]];
        
         transact[i] = opera;
       
     }
     
     
     return transact;
    }
}