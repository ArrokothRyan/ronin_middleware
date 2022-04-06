import Express from 'express';

export interface AccessTokenRequest extends Express.Request{
    manager_code : string,
    wallet_id: number
}

export interface AccessTokenReceipt {
    access_token : number
}
