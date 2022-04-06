import Web3 from "web3";
import {RPCEndPoint} from "../../utils/contractConstant";
import {CreateRandomMessage, GetAccessToken} from "../../external/services";
import Wallet from "ethereumjs-wallet";
import {getKeyPairBySeedAndID} from "../../utils/hdWallet";
import {AccessTokenReceipt, AccessTokenRequest} from "../../models/accessTokenModels";


export async function RequestGetAccessToken(accessTokenRequest:AccessTokenRequest):Promise<any> {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet

    try{
        HDWallet = await getKeyPairBySeedAndID(accessTokenRequest.manager_code,accessTokenRequest.wallet_id)
        // HDWallet = await getKeyPairBySeedAndID("MRA",2)
    } catch (err) {
        throw err
    }

    const randomMsg = await CreateRandomMessage().catch(function (err) {
        throw err
    })

    const signMsg = web3.eth.accounts.sign(randomMsg, HDWallet.getPrivateKeyString())

    const accessToken = await GetAccessToken(HDWallet.getAddressString(),randomMsg, signMsg.signature).catch(function (err) {
        throw err
    })

    let receipt:AccessTokenReceipt = { access_token : accessToken }
    return receipt
}