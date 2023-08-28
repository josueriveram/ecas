export class PointService{
    constructor(contract){
        this.contract = contract;
    }

    async getLoyaltyPointTotal(account) {
        // console.log(this.contract.getLoyaltyPointTotal(account));
        return (await this.contract.getLoyaltyPointTotal(account)).toNumber();
    }
    async getOperations(account){
       
        let opers = await this.contract.getOperations(account);
        //console.log(opers);
        return opers[0];
    }
    async getOperations2(account){
       
        let opers = await this.contract.getOperations2(account);
        //console.log(opers);
        return opers;
    }
    async getOperation(id){
       
        let oper = await this.contract.getOperation(id);
        console.log(oper);
      //console.log(oper.points.toNumber());
        return this.mapOperations(oper);
    }

    mapOperations(oper) {
  
            return {
                typeOperation: oper[0],
                description: oper[1],
                points: oper[2].negative===1?oper[2].words[0]*-1:oper[2].words[0]
            }

    }
}