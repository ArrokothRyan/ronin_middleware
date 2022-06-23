import Web3 from "web3";
import {throws} from "assert";
import {TransactionReceipt} from "web3-core";
const privateKeyToAddress = require('ethereum-private-key-to-address')
require('dotenv').config()


export async function CheckRonBalance(web3:Web3, wallet:string) {
    let balance = await web3.eth.getBalance(web3.utils.toChecksumAddress(wallet)).catch((error) => throws(error))
    return balance
}

export async function SendRonToAddress(web3:Web3, to_address:string) {
    const nonce = await web3.eth.getTransactionCount(privateKeyToAddress(process.env.FAUCET_KEY??""))
    console.log(privateKeyToAddress(process.env.FAUCET_KEY??""));

    const signTx = await web3.eth.accounts.signTransaction({
        to: to_address,
        value: '1000000000000000',
        gas: 21000,
        gasPrice: '1000000000',
        nonce: nonce,
        chainId: 2020,
    }, process.env.FAUCET_KEY??"")
    const rawTx:string = signTx.rawTransaction || ''
    let txReceipt:TransactionReceipt;

    try {
        txReceipt = await web3.eth.sendSignedTransaction(rawTx)
    } catch (err) {
        throw err
    }
    return txReceipt
}

