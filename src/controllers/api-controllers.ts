import { Request, Response, NextFunction } from 'express';
import {TransferSLPModels} from "../models/slpModel";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";
import {
    MarketplaceABI,
    MarketplaceContractAddress,
    RPCEndPoint,
    SLPContractAddress,
    TransferABI
} from "../utils/contractConstant";
import {getKeyPairByID} from "../utils/hdWallet";
import Wallet from "ethereumjs-wallet";
import {SettleAuctionModels} from "../models/marketplaceModels";


export class ApiControllers {
    async transferSLP(req:Request<TransferSLPModels>, res :  Response, next : NextFunction) {
        const SLPData:TransferSLPModels = req.body;

        if (!Web3.utils.isAddress(SLPData.to)) {
            res.send({"error" : "to address is not valid"})
        }

        res.type("appliation/json");
        const tx = await TransferSLPByContract(SLPData).catch((errors) => res.send(JSON.stringify(errors.receipt)));
        res.send(tx);
    }

    async createAuction(req:Request<SettleAuctionModels>, res :  Response, next : NextFunction) {
        const auctionData:SettleAuctionModels = req.body;

        res.type("appliation/json");
        const tx = await SettleAuctionByContract(auctionData).catch((errors) => res.send(JSON.stringify(errors.receipt)));
        res.send(tx);
    }

}

async function TransferSLPByContract(SLPData:TransferSLPModels) {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet

    try {
         HDWallet = await getKeyPairByID(SLPData.wallet_id)
    }catch (err) {
        throw err
    }

    const slpInstance = new web3.eth.Contract(TransferABI as AbiItem[],SLPContractAddress);

    const data = await slpInstance.methods.transfer(SLPData.to , SLPData.amount).encodeABI();
    const nonce = await web3.eth.getTransactionCount(HDWallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: SLPContractAddress,
        value: '0',
        gas: 50000,
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


async function SettleAuctionByContract(AuctionData:SettleAuctionModels) {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet
    console.log(AuctionData)
    try {
        HDWallet = await getKeyPairByID(AuctionData.wallet_id)
    }catch (err) {
        throw err
    }

    const marketplaceInstance = new web3.eth.Contract(MarketplaceABI as AbiItem[],MarketplaceContractAddress);

    const data = await marketplaceInstance.methods.settleAuction(AuctionData.seller, AuctionData.token_address, BigInt(AuctionData.amount), BigInt(AuctionData.listing_index), BigInt(AuctionData.listing_state)).encodeABI();
    const nonce = await web3.eth.getTransactionCount(HDWallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: MarketplaceContractAddress,
        value: '0',
        gas: 350000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
        data : data
    }, HDWallet.getPrivateKeyString())

    const rawTx:string = signTx.rawTransaction || ''

    console.log(signTx)
    let receipt:TransactionReceipt;
    try {
        receipt = await web3.eth.sendSignedTransaction(rawTx)
    } catch (err) {
        throw err
    }
    return receipt
}