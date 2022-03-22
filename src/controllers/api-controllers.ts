import { Request, Response, NextFunction } from 'express';
import {ClaimSLP, TransferSLPModels} from "../models/slpModel";
import Web3 from "web3";
import {SettleAuctionModels} from "../models/marketplaceModels";
import {TransferAxieModels} from "../models/axieModels";
import {TransferAxieByContract} from "./axies/transferAxie";
import {SettleAuctionByContract} from "./marketplace/createOrder";
import {TransferSLPByContract} from "./slp/transferSLP";
import {ClaimSLPByContract} from "./slp/claimSLP";


export class ApiControllers {
    async transferSLP(req:Request<TransferSLPModels>, res :  Response) {
        const SLPData:TransferSLPModels = req.body;

        if (!Web3.utils.isAddress(SLPData.to)) {
            res.send({"error" : "to address is not valid"})
        }

        res.type("appliation/json");
        const tx = await TransferSLPByContract(SLPData).catch((errors) => res.send(JSON.stringify(errors.receipt)));
        res.send(tx);
    }

    async createAuction(req:Request<SettleAuctionModels>, res :  Response) {
        const auctionData:SettleAuctionModels = req.body;

        res.type("appliation/json");
        const tx = await SettleAuctionByContract(auctionData).catch((errors) =>
        {
            if(errors.receipt != undefined) {
                errors.receipt.error = errors.message
                res.send(errors.receipt)
            }else {
                res.send({"error": errors.message})
            }

        });
        res.send(tx);
    }

    async transferAxie(req:Request<TransferAxieModels>, res :  Response) {
        const transferData:TransferAxieModels = req.body;
        res.type("appliation/json");

        const tx = await TransferAxieByContract(transferData).catch((errors) =>
        {
            if(errors.receipt != undefined) {
                errors.receipt.error = errors.message
                res.send(errors.receipt)
            }else {
                res.send({"error": errors.message})
            }

        });
        res.send(tx);

    }

    async claimSLP(req:Request<ClaimSLP>, res : Response) {
        const transferData:ClaimSLP = req.body;
        res.type("appliation/json");

        const tx = await ClaimSLPByContract(transferData).catch((errors) =>
        {
            if(errors.receipt != undefined) {
                errors.receipt.error = errors.message
                res.send(errors.receipt)
            }else {
                res.send({"error": errors.message})
            }

        });
        res.send(tx);
    }

}






// async function TransferAxieByContract(TransferAxie:TransferAxieModels) {
//     const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
//     let HDWallet:Wallet
//
//     try {
//         HDWallet = await getKeyPairByID(TransferAxie.wallet_id)
//     }catch (err) {
//         throw err
//     }
//
//     const AxieInstance = new web3.eth.Contract(AxieContractABI as AbiItem[],AxieContractAddress);
//
//     const data = await AxieInstance.methods.safeTransferFrom(HDWallet.getAddressString() , TransferAxie.to_address, TransferAxie.token_id).encodeABI();
//     const nonce = await web3.eth.getTransactionCount(HDWallet.getAddressString())
//
//     const signTx = await web3.eth.accounts.signTransaction({
//         to: AxieContractAddress,
//         value: '0',
//         gas: 200000,
//         gasPrice: '1000000000',
//         nonce: nonce,
//         chainId: 2020,
//         data : data
//     }, HDWallet.getPrivateKeyString())
//
//     let receipt:TransactionReceipt;
//     try {
//         receipt = await web3.eth.sendSignedTransaction(signTx.rawTransaction??'')
//     } catch (err) {
//         throw err
//     }
//     return receipt
// }