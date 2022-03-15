import { Query } from 'express-serve-static-core';
import Express from 'express';

export interface TransferSLPModels extends Express.Request {
    wallet_id: number,
    to : string,
    amount: number,
}

