import {ClaimSLP} from "../../models/slpModel";
import Web3 from "web3";
import {RPCEndPoint, SLPContractABI, SLPContractAddress} from "../../utils/contractConstant";
import Wallet from "ethereumjs-wallet";
import {getKeyPairByID, getKeyPairBySeedAndID} from "../../utils/hdWallet";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";

export async function ClaimSLPByContract(ClaimData:ClaimSLP) {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet

    try {
        HDWallet = await getKeyPairBySeedAndID(ClaimData.manager_code, ClaimData.wallet_id)
    }catch (err) {
        throw err
    }

    const slpInstance = new web3.eth.Contract(SLPContractABI as AbiItem[],SLPContractAddress);

    const data = await slpInstance.methods.checkpoint(ClaimData.owner , ClaimData.amount,ClaimData.createAt, web3.utils.hexToBytes(ClaimData.signature)).encodeABI();
    const nonce = await web3.eth.getTransactionCount(HDWallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: SLPContractAddress,
        value: '0',
        gas: 100000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
        data : data
    }, HDWallet.getPrivateKeyString())

    const rawTx:string = signTx.rawTransaction || ''

    let receipt:TransactionReceipt;
    try {
        receipt = await web3.eth.sendSignedTransaction(rawTx)
    } catch (err) {
        throw err
    }
    return receipt
}