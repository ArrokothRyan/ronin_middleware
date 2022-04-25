import Express from 'express';

export interface TeamCodeModel extends Express.Request{
    team_code : string,
    team_id: number
}

export interface AccessTokenReceipt {
    access_token : number
}
