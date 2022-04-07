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
import {AccessTokenRequest} from "../models/accessTokenModels";


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

    async transferAxie(req:Request<TransferAxieModels>, res :  Response) {
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

    async getAccessToken(req:Request<AccessTokenRequest>, res : Response){
        const accessTokenRequest:AccessTokenRequest = req.params;
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
