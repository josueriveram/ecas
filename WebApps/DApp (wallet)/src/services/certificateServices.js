export class CertificateService{
    constructor(contract){
        this.contract = contract;
    }
    
    async getTotalCertificates(account) {
        return (await this.contract.getTotalCertificates(account)).toNumber();
    }

    async getCertificates(account){
       
        let certs = await this.contract.getCertificates(account);
        //console.log(certs);
        return certs[0];
    }
    
    async getCertificate(id){
       
        let cert = await this.contract.getCertificate(id);
        //console.log(cert);
        return this.mapCertificates(cert);
    }
    

    mapCertificates(cert) {
  
            return {
                file: cert[0],
                descripction: cert[1],
                active: cert[2]
            }

    }
}