import Express from 'express';

export interface TransferAxieModels extends Express.Request {
    from_team_code: string,
    from_scholar_id : number,
    to_team_code : string,
    to_scholar_id : number,
    token_id : number
}

