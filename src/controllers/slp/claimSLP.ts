import {ClaimSLPRequest, CustomReceipt} from "../../models/slpModel";
import Web3 from "web3";
import {RPCEndPoint, SLPContractABI, SLPContractAddress} from "../../utils/contractConstant";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";
import {GetClaimInfo} from "../../external/services";
import {errors} from "ethers";
import {CustomError} from "../../utils/error";
import {CheckRonBalance, SendRonToAddress} from "../../utils/services";


export async function ClaimSLPByContract(Userinfo:ClaimSLPRequest):Promise<any> {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));

    let claimData = await GetClaimInfo(Userinfo).catch((errors) => {
        throw errors
    })
    console.log("[SLP Claim] Address : ", claimData.wallet.getAddressString() , "Can Claim : ", claimData.amount)

    let balance = await CheckRonBalance(web3,claimData.wallet.getAddressString())

    if(Number(balance) < 1000000000000000 && claimData.amount > 0) {
        await SendRonToAddress(web3,claimData.wallet.getAddressString()).catch(function (err) { throw err })
        await new Promise(f => setTimeout(f, 3000));
        console.log("Finish send RON to : ", claimData.wallet.getAddressString())
    }

    const slpInstance = new web3.eth.Contract(SLPContractABI as AbiItem[],SLPContractAddress);
    const data = await slpInstance.methods.checkpoint(claimData.wallet.getAddressString() , claimData.amount,claimData.createAt, web3.utils.hexToBytes(claimData.signature)).encodeABI();
    const nonce = await web3.eth.getTransactionCount(claimData.wallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: SLPContractAddress,
        value: '0',
        gas: 150000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
        data : data
    }, claimData.wallet.getPrivateKeyString())

    const rawTx:string = signTx.rawTransaction || ''

    let txReceipt:TransactionReceipt;

    try {
        txReceipt = await web3.eth.sendSignedTransaction(rawTx)
    } catch (err) {
        throw err
    }

    let receipt:CustomReceipt = { amount : claimData.amount , ...txReceipt}
    return receipt
}