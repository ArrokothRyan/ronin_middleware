import Express from 'express';

export interface TransferAxieModels extends Express.Request {
    wallet_id : number,
    to_address : string,
    token_id : number
}

