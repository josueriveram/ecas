using Nethereum.Web3;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts.CQS;
using Nethereum.Util;
using Nethereum.Web3.Accounts;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.Contracts;
using Nethereum.Contracts.Extensions;
using System;
using System.Numerics;
using System.Threading;
using System.Threading.Tasks;
using Nethereum.RPC.Eth.DTOs;
using ApiBienestar.Auxiliar;

namespace ApiBienestar.Services
{
    public class FContractCert
    {
        string url = "https://goerli.infura.io/v3/cdb89857fae544a7b7a862decac4c8c4"; //End Point de INFURA donde está desplegado el contrato
        string privateKey = ""; //Private Key de la cuenta del Owner del contract
        string contract = "0xcf1c153eA7191e618a3d0EA855ac27fD49b3a038"; //Contrato InstitutionsCertificate
        BigInteger chainID = new BigInteger(5); //ID de la RED Goerli

        public string GetContract()
        {
            return contract;
        }

        public async Task<string> GetLastIndex()
        {
            string resp = "";

            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);

            var lastindexmsg = new GetLastIndexCertificateFunction
            {

                Gas = 2500000
            };
            var lastindexHandler = web3.Eth.GetContractQueryHandler<GetLastIndexCertificateFunction>();

            var lastindex = lastindexHandler.QueryAsync<BigInteger>(contract, lastindexmsg);
            resp = lastindex.Result.ToString();

            return resp;
        }
        public async Task<string> GetTotalCertificate(string _addr)
        {
            string resp = "";

            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);

            var lastindexmsg = new GetTotalCertificatesFunction
            {
                Address= _addr,
                Gas = 2500000
            };
            var lastindexHandler = web3.Eth.GetContractQueryHandler<GetTotalCertificatesFunction>();

            var lastindex = lastindexHandler.QueryAsync<BigInteger>(contract, lastindexmsg);
            resp = lastindex.Result.ToString();

            return resp;
        }
        public async Task<TransactionReceipt> NewCertificate(string _account, string _file, string _description)
        {
            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);
            var newCertFunctionMessage = new NewCertificateFunction
            {

                SendToAccount = _account,

                File = _file,
                Description = _description,
                Gas = 3000000
            };


            var newCertHandler = web3.Eth.GetContractTransactionHandler<NewCertificateFunction>();
            var resp = await newCertHandler.SendRequestAndWaitForReceiptAsync(contract, newCertFunctionMessage);

            return resp;

        }
        public async Task<TransactionReceipt> RevokeCertificate(int _id)
        {
            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);
            var setActiveFunctionMessage = new SetActiveCertificateFunction
            {

               ID= new BigInteger(_id),
               Active = "false",
               Gas = 3000000
            };


            var newCertHandler = web3.Eth.GetContractTransactionHandler<SetActiveCertificateFunction>();
            var resp = await newCertHandler.SendRequestAndWaitForReceiptAsync(contract, setActiveFunctionMessage);

            return resp;

        }
        public async Task<Certificate> GetCertificate(int index)
        {
            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);
            var getCertFunctionMessage = new GetCertificateFunction
            {
                ID = new BigInteger(index),
                Gas = 2500000
            };
            var CertHandler = web3.Eth.GetContractQueryHandler<GetCertificateFunction>();

            var cert = await CertHandler.QueryDeserializingToObjectAsync<GetCertificateOutputDTO>(getCertFunctionMessage, contract);
            Certificate c = new Certificate();
            c.File = cert.File;
            c.Description = cert.Description;
            c.Active = cert.Active;
            return c;
        }
        public async Task<TransactionReceipt> SetCertificate(int _id, string _file, string _description)
        {
            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);
            var setCertFunctionMessage = new SetCertificateFunction
            {
               ID = new BigInteger(_id),
               File = _file,
               Description = _description,
               Gas = 3000000
            };


            var setCertHandler = web3.Eth.GetContractTransactionHandler<SetCertificateFunction>();
            var resp = await setCertHandler.SendRequestAndWaitForReceiptAsync(contract, setCertFunctionMessage);

            return resp;

        }

        [Function("getLastIndexCertificate", "uint")]
        public class GetLastIndexCertificateFunction : FunctionMessage
        {

        }


        [Function("getTotalCertificates", "uint")]
        public class GetTotalCertificatesFunction : FunctionMessage
        {
            [Parameter("address", "_addr", 1)]
            public string Address { get; set; }
        }


        [Function("newCertificate")]
        public class NewCertificateFunction : FunctionMessage
        {
            [Parameter("address", "_sendToAccount", 1)]
            public string SendToAccount { get; set; }

            [Parameter("string", "_file", 2)]
            public string File { get; set; }

            [Parameter("string", "_description", 3)]
            public string Description { get; set; }
        }
        
        
        [Function("setActive")] // Nombre identico a la función del contrato
        public class SetActiveCertificateFunction : FunctionMessage
        {
            [Parameter("uint", "_ID", 1)]
            public BigInteger ID { get; set; }

            [Parameter("string", "_active", 2)]
            public string Active { get; set; }

           
        }


        [Function("getCertificate", "string")]
        public class GetCertificateFunction : FunctionMessage
        {
            [Parameter("uint", "_ID", 1)]
            public BigInteger ID { get; set; }
        }

        [FunctionOutput]
        public class GetCertificateOutputDTO : IFunctionOutputDTO
        {
            [Parameter("string", "file", 1)]
            public virtual string File { get; set; }
            [Parameter("string", "description", 2)]
            public virtual string Description { get; set; }
            [Parameter("string", "active", 3)]
            public virtual string Active { get; set; }
        }

        [Function("setCertificate")]
        public class SetCertificateFunction : FunctionMessage
        {
            [Parameter("uint", "_ID", 1)]
            public BigInteger ID { get; set; }

            [Parameter("string", "_file", 2)]
            public string File { get; set; }

            [Parameter("string", "_description", 2)]
            public string Description { get; set; }
        }


    }
}
