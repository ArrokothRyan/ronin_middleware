import  express, { Router, Request, Response, NextFunction } from 'express';
import { ApiControllers } from '../controllers/api-controllers';


const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


const apiControllers = new ApiControllers;

export class ApiRouter {
    router: Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/transferSLP', jsonParser, apiControllers.transferSLP);
        this.router.post('/createAuction', jsonParser, apiControllers.createAuction);
        this.router.post('/transferAxie', jsonParser , apiControllers.transferAxieByTeamCode);
        this.router.post('/claimSLP', jsonParser , apiControllers.claimSLP);
        this.router.get('/getAccessToken/:team_code/:team_id', jsonParser , apiControllers.getAccessToken);
        this.router.get('/getWalletAddress/:team_code/:team_id', jsonParser , apiControllers.getWalletAddress);
    }
}