import Web3 from "web3";
import {RPCEndPoint} from "../utils/contractConstant";
import {ClaimSLP, ClaimSLPRequest} from "../models/slpModel";
import {getKeyPairBySeedAndID} from "../utils/hdWallet";
import Wallet from "ethereumjs-wallet";
import axios from "axios";
import {CustomError} from "../utils/error";


export async function GetClaimInfo(claimData:ClaimSLPRequest):Promise<ClaimSLP>{
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet
    try {
        HDWallet = await getKeyPairBySeedAndID(claimData.manager_code, claimData.wallet_id)
    }catch (err) {
        throw err
    }

    const randomMsg = await CreateRandomMessage().catch(function (err) {
        throw err
    })

    const signMsg = web3.eth.accounts.sign(randomMsg, HDWallet.getPrivateKeyString())


    const accessToken = await GetAccessToken(HDWallet.getAddressString(),randomMsg, signMsg.signature).catch(function (err) {
        throw err
    })

    const claimInfo = await GetClaimParams(accessToken,HDWallet.getAddressString(),randomMsg,signMsg.signature).catch(function (err) {
        throw err
    })

    if (claimInfo.rawClaimableTotal == 0 ) {
        throw new CustomError("Claimable total 0");
    }

    const signature = {
        wallet: HDWallet,
        amount: claimInfo.blockchainRelated.signature.amount,
        createAt: claimInfo.blockchainRelated.signature.timestamp,
        signature : claimInfo.blockchainRelated.signature.signature,
        real_total: claimInfo.total
    } as ClaimSLP


    return signature;
}

export async function CreateRandomMessage() {
    const res = await axios.post("https://graphql-gateway.axieinfinity.com/graphql", {
        "operationName": "CreateRandomMessage",
        "variables": {},
        "query": "mutation CreateRandomMessage{createRandomMessage}"
    }).catch(function (err) {
        throw err
    })
    return res.data.data.createRandomMessage

}

export async function GetAccessToken(walletAddress:string, randomMsg:string, sign: string) {
    const accessTokenReq = await axios.post("https://graphql-gateway.axieinfinity.com/graphql", {
        "operationName": "CreateAccessTokenWithSignature",
        "variables": {
            "input": {
                "mainnet": "ronin",
                "owner": walletAddress,
                "message": randomMsg,
                "signature": sign
            }
        },
        "query": "mutation CreateAccessTokenWithSignature($input: SignatureInput!)\n{createAccessTokenWithSignature(input: $input)\n{newAccount result accessToken __typename}}"
    }).catch(function (err){
        throw err
    })
    return accessTokenReq.data.data.createAccessTokenWithSignature.accessToken
}


async function GetClaimParams(accessToken:string, _owner:string, _message:string, _signature:string) {
    const claimInfo = await axios.post("http://game-api-pre.skymavis.com/v1/players/me/items/1/claim", {
        "operationName": "CreateAccessTokenWithSignature",
        "variables": {
            "input": {
                "mainnet": "ronin",
                "owner": _owner,
                "message": _message,
                "signature": _signature
            }
        },
        "query": "mutation CreateAccessTokenWithSignature($input: SignatureInput!)\n{createAccessTokenWithSignature(input: $input)\n{newAccount result accessToken __typename}}"
    }, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36',
                'Authorization': 'Bearer ' + accessToken
            }
        }
    // const claimInfo = await axios.get("https://game-api-pre.skymavis.com/v1/players/"+_owner+"/items/1", {
    //     headers :{
    //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36',
    //         'Authorization': 'Bearer '+accessToken
    //     }
    // }
    ).catch(function (err){
        throw err
    })

    if (claimInfo.data.blockchainRelated.signature == null) {
        throw new CustomError("Can not claim now.")
    }
    // if (claimInfo.data.total == 0) {
    //     throw new CustomError("Can not claim now.")
    // }
    return claimInfo.data
}