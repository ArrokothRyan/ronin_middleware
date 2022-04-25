import { Request, Response, NextFunction } from 'express';
import {ClaimSLP, ClaimSLPRequest, CustomReceipt, TransferSLPModels} from "../models/slpModel";
import Web3 from "web3";
import {SettleAuctionModels} from "../models/marketplaceModels";
import {TransferAxieModels} from "../models/axieModels";
import {TransferAxieByContract} from "./axies/transferAxie";
import {SettleAuctionByContract} from "./marketplace/createOrder";
import {TransferSLPByContract} from "./slp/transferSLP";
import {ClaimSLPByContract} from "./slp/claimSLP";
import {RequestGetAccessToken} from "./accesstoken/getAccessToken";
import {TeamCodeModel} from "../models/teamCodeModels";
import {CustomError} from "../utils/error";
import bip39 from "bip39";
import etherWallet from "ethereumjs-wallet";
import Wallet from "ethereumjs-wallet";
import {getKeyPairBySeedAndID} from "../utils/hdWallet";


export class ApiControllers {
    async transferSLP(req:Request<TransferSLPModels>, res :  Response) {
        const SLPData:TransferSLPModels = req.body;

        if (!Web3.utils.isAddress(SLPData.to)) {
            res.send({"error" : "to address is not valid"})
        }

        res.type("application/json");
        const tx = await TransferSLPByContract(SLPData).catch((errors) => res.send(JSON.stringify(errors.receipt)));
        res.send(tx);
    }

    async createAuction(req:Request<SettleAuctionModels>, res :  Response) {
        const auctionData:SettleAuctionModels = req.body;

        res.type("application/json");
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

    async transferAxieByTeamCode(req:Request<TransferAxieModels>, res : Response) {
        const transferData:TransferAxieModels = req.body;
        res.type("application/json");

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


    async getAccessToken(req:Request<TeamCodeModel>, res : Response){
        const accessTokenRequest:TeamCodeModel = req.params;
        res.type("application/json");

        const tx:CustomReceipt = await RequestGetAccessToken(accessTokenRequest).catch((errors) => {
            if (errors.receipt != undefined) {
                errors.receipt.error = errors.message
                res.send(errors.receipt)
                return
            } else {
                res.send({"error": errors.message})
                return
            }

        });
        res.send(tx);
    }

    async getWalletAddress(req:Request<TeamCodeModel>, res : Response){
        const getWalletAddressRequest:TeamCodeModel = req.params;
        res.type("application/json");
        const wallet  = await getKeyPairBySeedAndID(getWalletAddressRequest.team_code, getWalletAddressRequest.team_id)
        res.send({address : wallet.getAddressString()});
    }

    async claimSLP(req:Request<ClaimSLPRequest>, res : Response) {
        const claimData:ClaimSLPRequest = req.body;
        res.type("application/json");

        const tx:CustomReceipt = await ClaimSLPByContract(claimData).catch((errors) => {
            if (errors.receipt != undefined) {
                errors.receipt.error = errors.message
                res.send(errors.receipt)
                return
            } else {
                res.send({"error": errors.message})
                return
            }

        });
        res.send(tx);


    }

}
