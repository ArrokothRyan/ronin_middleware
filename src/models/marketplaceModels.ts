import { Query } from 'express-serve-static-core';
import Express from 'express';

export interface SettleAuctionModels extends Express.Request {
    wallet_id : number,
    seller: string,
    token_address : string,
    amount: number,
    listing_index : number,
    listing_state : string
}

