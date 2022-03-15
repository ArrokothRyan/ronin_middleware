var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
sendToken('0xcf135aa988cfc6dc63cbbbc680b5a1276a2c9941', 1);
function sendToken(receiver, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var web3, contractAddr, contractAbi, pvKey, account, account_from, slpInstance, data, nonce, signTx, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    web3 = new Web3(new Web3.providers.HttpProvider('http://18.178.61.253:8547/'));
                    contractAddr = '0xa8754b9fa15fc18bb59458815510e40a12cd2014';
                    contractAbi = [
                        // transfer
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "_to",
                                    "type": "address"
                                },
                                {
                                    "name": "_value",
                                    "type": "uint256"
                                }
                            ],
                            "name": "transfer",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "type": "function"
                        }
                    ];
                    pvKey = "6002e77da56f8cba516b7cdb44c4ac587a473efe7d40aeb843bb6afe2590c3b3";
                    account = web3.eth.accounts.privateKeyToAccount(pvKey);
                    account_from = {
                        privateKey: account.privateKey,
                        accountaddress: account.address
                    };
                    slpInstance = new web3.eth.Contract(contractAbi, contractAddr);
                    return [4 /*yield*/, slpInstance.methods.transfer(account_from.accountaddress, 1).encodeABI()];
                case 1:
                    data = _a.sent();
                    console.log(data);
                    return [4 /*yield*/, web3.eth.getTransactionCount(account_from.accountaddress)];
                case 2:
                    nonce = _a.sent();
                    return [4 /*yield*/, web3.eth.accounts.signTransaction({
                            to: contractAddr,
                            value: '0',
                            gas: 450000,
                            gasPrice: '1000000000',
                            nonce: nonce,
                            chainId: 2020,
                            data: data
                        }, account_from.privateKey)];
                case 3:
                    signTx = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, web3.eth.sendSignedTransaction(signTx.rawTransaction).then(console.log)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    console.log(e_1);
                    throw e_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
