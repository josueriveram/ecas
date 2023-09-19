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

namespace ApiBienestar.Services
{
    public class FContractPoint
    {
        string url = "https://goerli.infura.io/v3/cdb89857fae544a7b7a862decac4c8c4"; //EndPoint de INFURA donde está desplegado el contrato
        string privateKey = ""; //Private Key de la cuenta del Owner del contract
        string contract = "0x4206E1a260CC21CE2400B49A38032750f0290543"; //Contrato LoyaltyPoint
        BigInteger chainID = new BigInteger(5); //ID de la RED Goerli

        public async Task<string> NewOperation(string _account, string _type, string _description, BigInteger point)
        {
            var account = new Account(privateKey, chainID);
            var web3 = new Web3(account, url);
            var newPointFunctionMessage = new NewOperationsFunction
            {

                SendToAccount = _account,
                Type = _type,
                Description = _description,
                Gas = 2500000
            };


            var newPointHandler = web3.Eth.GetContractTransactionHandler<NewOperationsFunction>();
            var resp = await newPointHandler.SendRequestAndWaitForReceiptAsync(contract, newPointFunctionMessage);

            return resp.TransactionHash;

        }
        [Function("newOperations")]
        public class NewOperationsFunction : FunctionMessage
        {
            [Parameter("address", "_sendToAccount", 1)]
            public string SendToAccount { get; set; }

            [Parameter("string", "_tfile", 2)]
            public string Type { get; set; }

            [Parameter("string", "_description", 3)]
            public string Description { get; set; }
            
            [Parameter("int", "_point", 3)]
            public string Point { get; set; }
        }
    }
}
