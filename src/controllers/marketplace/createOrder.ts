import {SettleAuctionModels} from "../../models/marketplaceModels";
import Web3 from "web3";
import {MarketplaceABI, MarketplaceContractAddress, RPCEndPoint} from "../../utils/contractConstant";
import Wallet from "ethereumjs-wallet";
import {getKeyPairByID} from "../../utils/hdWallet";
import {AbiItem} from "web3-utils";
import {TransactionReceipt} from "web3-core";

export async function SettleAuctionByContract(AuctionData:SettleAuctionModels) {
    const web3 = new Web3(new Web3.providers.HttpProvider(RPCEndPoint));
    let HDWallet:Wallet
    try {
        HDWallet = await getKeyPairByID(AuctionData.wallet_id)
    }catch (err) {
        throw err
    }

    const marketplaceInstance = new web3.eth.Contract(MarketplaceABI as AbiItem[],MarketplaceContractAddress);

    const data = await marketplaceInstance.methods.settleAuction(AuctionData.seller, AuctionData.token_address, BigInt(AuctionData.amount), BigInt(AuctionData.listing_index), BigInt(AuctionData.listing_state)).encodeABI();
    const nonce = await web3.eth.getTransactionCount(HDWallet.getAddressString())

    const signTx = await web3.eth.accounts.signTransaction({
        to: MarketplaceContractAddress,
        value: '0',
        gas: 500000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
        data : data
    }, HDWallet.getPrivateKeyString())

    const rawTx:string = signTx.rawTransaction || ''

    let receipt:TransactionReceipt;
    try {
        receipt = await web3.eth.sendSignedTransaction(rawTx)
    } catch (err) {
        throw err
    }
    return receipt
}
