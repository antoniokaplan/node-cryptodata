// https://github.com/HyperCubeProject/binance-api-node
import Binance from 'binance-api-node';
import moment from 'moment';
import dotenv from 'dotenv'

// import { addToFile,  readFile  } from './file-helpers'
const config = require('./config')(process.env);
import BinanceSockets from './binance/binance-sockets'
import BinanceRest from './binance/binance-rest'

dotenv.config();
// Authenticated client, can make signed calls
const client = Binance({
  apiKey: process.env.BINANCE_KEY.API_KEY,
  apiSecret: process.env.BINANCE_KEY.SECRET_KEY,
});
const binanceRest = BinanceRest(client);
const binanceSockets = BinanceSockets(client);

(async function getAllSymbols(){
  const ticker = await binanceRest.getAllTickers();
  console.log("binanceRest.symbolArray",binanceRest.symbolArray);
  binanceSockets.tradeSocket(binanceRest.symbolArray);
  binanceSockets.getCandles(binanceRest.symbolArray);
})();
