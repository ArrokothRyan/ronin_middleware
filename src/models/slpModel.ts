import { Query } from 'express-serve-static-core';
import Express from 'express';

export interface TransferSLPModels extends Express.Request {
    wallet_id: number,
    to : string,
    amount: number,
}


export interface ClaimSLP extends Express.Request {
    manager_code : string,
    wallet_id: number,
    owner : string,
    amount: number,
    createAt: number,
    signature : string
}
