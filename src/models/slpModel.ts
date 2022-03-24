import { Query } from 'express-serve-static-core';
import Express from 'express';
import Wallet from "ethereumjs-wallet";

export interface TransferSLPModels extends Express.Request {
    wallet_id: number,
    to : string,
    amount: number,
}


export interface ClaimSLPRequest extends Express.Request {
    manager_code : string,
    wallet_id: number
}



export interface ClaimSLP extends Express.Request {
    wallet : Wallet
    owner : string,
    amount: number,
    createAt: number,
    signature : string
}
