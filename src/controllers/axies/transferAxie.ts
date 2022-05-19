import {TransferAxieModels} from "../../models/axieModels";
import Web3 from "web3";
import {AxieContractABI, AxieContractAddress, RPCEndPoint} from "../../utils/contractConstant";
import Wallet from "ethereumjs-wallet";
import {getKeyPairByID, getKeyPairBySeedAndID} from "../../utils/hdWallet";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";
import {CheckRonBalance, SendRonToAddress} from "../../utils/services";

export async function TransferAxieByContract(TransferAxie:TransferAxieModels) {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet
    //From Address
    try{
        HDWallet = await getKeyPairBySeedAndID(TransferAxie.from_team_code,TransferAxie.from_scholar_id)
    } catch (err) {
        console.log("ERR: Fail to get sender account." ,err)
        throw err
    }

    //To address
    let ReceiverHDWallet:Wallet
    try{
        ReceiverHDWallet = await getKeyPairBySeedAndID(TransferAxie.to_team_code,TransferAxie.to_scholar_id)
    } catch (err) {
        console.log("ERR: Fail to get receiver account.", err)
        throw err
    }

    let balance = await CheckRonBalance(web3,HDWallet.getAddressString())
    console.log(Number(balance))
    if(Number(balance) < 1000000000000000 ) {
        await SendRonToAddress(web3,HDWallet.getAddressString()).catch(function (err) { throw err })
        await new Promise(f => setTimeout(f, 3000));
        console.log("Finish send RON to : ", HDWallet.getAddressString())
    }


    const AxieInstance = new web3.eth.Contract(AxieContractABI as AbiItem[],AxieContractAddress);

    const data = await AxieInstance.methods.safeTransferFrom(HDWallet.getAddressString(), ReceiverHDWallet.getAddressString(), TransferAxie.token_id).encodeABI();
    const nonce = await web3.eth.getTransactionCount(HDWallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: AxieContractAddress,
        value: '0',
        gas: 200000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
        data : data
    }, HDWallet.getPrivateKeyString())

    let receipt:TransactionReceipt;
    try {
        receipt = await web3.eth.sendSignedTransaction(signTx.rawTransaction??'')
    } catch (err) {
        throw err
    }
    console.log("Transfer : ", receipt.transactionHash)
    return receipt
}

