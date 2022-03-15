import Wallet from "ethereumjs-wallet";

const etherWallet = require("ethereumjs-wallet");
const bip39 = require("bip39")
require('dotenv').config()

export async function getKeyPairByID(id:Number) {
    const mnemonic = process.env.SEED;
    const keyBuffer = await bip39.mnemonicToSeed(mnemonic)
    const masterWallet = etherWallet.hdkey.fromMasterSeed(keyBuffer);
    const path = "m/44'/60'/0'/0/"+id;
    const wallet:Wallet = masterWallet.derivePath(path).getWallet();
    return wallet
}

