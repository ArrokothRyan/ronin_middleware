import {ClaimSLP, ClaimSLPRequest} from "../../models/slpModel";
import Web3 from "web3";
import {RPCEndPoint, SLPContractABI, SLPContractAddress} from "../../utils/contractConstant";
import Wallet from "ethereumjs-wallet";
import {getKeyPairByID, getKeyPairBySeedAndID} from "../../utils/hdWallet";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";
import {GetClaimInfo} from "../../external/services";
import {errors} from "ethers";
import {throws} from "assert";

export async function ClaimSLPByContract(Userinfo:ClaimSLPRequest) {
    let claimData = await GetClaimInfo(Userinfo).catch((errors) => {
        throw errors
    })

    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    const slpInstance = new web3.eth.Contract(SLPContractABI as AbiItem[],SLPContractAddress);

    const data = await slpInstance.methods.checkpoint(claimData.wallet.getAddressString() , claimData.amount,claimData.createAt, web3.utils.hexToBytes(claimData.signature)).encodeABI();
    const nonce = await web3.eth.getTransactionCount(claimData.wallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: SLPContractAddress,
        value: '0',
        gas: 100000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
        data : data
    }, claimData.wallet.getPrivateKeyString())

    const rawTx:string = signTx.rawTransaction || ''

    let receipt:TransactionReceipt;
    try {
        receipt = await web3.eth.sendSignedTransaction(rawTx)
    } catch (err) {
        throw err
    }
    return receipt
}