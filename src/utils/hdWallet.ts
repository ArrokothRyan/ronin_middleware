import Wallet from "ethereumjs-wallet";
import {errors} from "ethers";
import {CustomError} from "./error";

const etherWallet = require("ethereumjs-wallet");
const bip39 = require("bip39")
require('dotenv').config()

const ManagerSeed = {
    MRA: process.env.MRASeed,
    K: process.env.KSeed,
    OW: process.env.OWSeed,
    AD: process.env.ADSeed
}


function GetSeed(obj:any ,teamCode:string) {
    return obj[teamCode]
}


export async function getKeyPairByID(id:number) {
    const mnemonic = process.env.SEED;
    const keyBuffer = await bip39.mnemonicToSeed(mnemonic)
    const masterWallet = etherWallet.hdkey.fromMasterSeed(keyBuffer);
    const path = "m/44'/60'/0'/0/"+id;
    const wallet:Wallet = masterWallet.derivePath(path).getWallet();
    return wallet
}


export async function getKeyPairBySeedAndID(teamCode:string,id:number) {
    const mnemonic = GetSeed(ManagerSeed,teamCode);
    if(mnemonic === undefined) {
        throw new CustomError("Manager Code not found");
    }
    const keyBuffer = await bip39.mnemonicToSeed(mnemonic)
    const masterWallet = etherWallet.hdkey.fromMasterSeed(keyBuffer);
    const path = "m/44'/60'/0'/0/"+id;
    const wallet:Wallet = masterWallet.derivePath(path).getWallet();
    return wallet
}

