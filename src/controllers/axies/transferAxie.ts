import {TransferAxieModels} from "../../models/axieModels";
import Web3 from "web3";
import {AxieContractABI, AxieContractAddress, RPCEndPoint} from "../../utils/contractConstant";
import Wallet from "ethereumjs-wallet";
import {getKeyPairByID} from "../../utils/hdWallet";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";

export async function TransferAxieByContract(TransferAxie:TransferAxieModels) {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet

    try {
        HDWallet = await getKeyPairByID(TransferAxie.wallet_id)
    }catch (err) {
        throw err
    }

    const AxieInstance = new web3.eth.Contract(AxieContractABI as AbiItem[],AxieContractAddress);

    const data = await AxieInstance.methods.safeTransferFrom(HDWallet.getAddressString() , TransferAxie.to_address, TransferAxie.token_id).encodeABI();
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
    return receipt
}