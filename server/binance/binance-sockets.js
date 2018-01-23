import Binance from 'binance-api-node';
import moment from 'moment';
import path from 'path';

const logger = require('../logger');
import { addToFile,  readFile  } from './file-helpers'

//separate the files into hourly
const FILE_INTERVAL = "HH";
//aggregate the intervals by minute
const TIME_INTERVAL = "HH:mm";

const BinanceSockets = (client) => {
  // let endpoints = binance.websockets.subscriptions();
  // for ( let endpoint in endpoints ) {
  // 	console.log(endpoint);
  // 	//binance.websockets.terminate(endpoint);
  // }

  const logObject = {
    tickerSymbol: "",
    interval: "",
    timestamp: null,
    buy: 0,
    sell: 0,
    delta: 0,
    lastPrice:0,
  };

  const createVolumeLog = (symbolArray) => {
    const log = {};
    for (const symbol of symbolArray) {
        log[symbol] = { ...logObject };
        log[symbol].currentInterval = { ...logObject };
        log[symbol].currentInterval.tickerSymbol = symbol;
    };
    // console.log(log);
    return log;
  };

  const updateLog = (trade,obj) => {
    obj.tickerSymbol = trade.symbol;
    obj.timestamp = trade.eventTime;
    obj.interval = trade.interval;

    if(!trade.maker){ //buy
      obj.buy += trade.quantity*1;
      obj.lastPrice = trade.price;
      obj.delta = obj.buy - obj.sell;

      // logger.logGreen(JSON.stringify(obj));
    } else { //sell
      obj.sell += trade.quantity*1;
      obj.lastPrice = trade.price;
      obj.delta = obj.buy - obj.sell;
      // logger.logRed(JSON.stringify(obj));
    }
    return obj;
  }

  const fileError = (e) => {
    console.log("FILE ERROR",e);
  };


  // pass ARRAY of symbols
  const tradeSocket = (symbolArray) => {

    // create an instance of the volume log for the symbol
    const volumeLog = createVolumeLog(symbolArray);

    const socket = client.ws.trades(symbolArray, trade => {

      const now = moment(trade.eventTime);
      //this will be the object key for accumulation
      const timestamp = now.format(`YYYY-MM-DD_${TIME_INTERVAL}`);
      // set the interval for the file
      const fileTimeStamp = now.format(`YYYY-MM-DD_${FILE_INTERVAL}`);
      //add the interval value / object key
      trade.interval = timestamp;

      const tickerSymbol = trade.symbol;
      // add a new record for each minute as the key
      if(!volumeLog[tickerSymbol][timestamp]){
        volumeLog[tickerSymbol][timestamp] = { ...logObject };
        try {
          const basepath = path.resolve(process.env.PWD);
          const filedir = `${basepath}/data-files/${tickerSymbol}`;
          const filepath = `${tickerSymbol}-${fileTimeStamp}.tsv`;
          const data = addToFile(filedir, filepath, volumeLog[tickerSymbol].currentInterval, fileError);

        } catch(e) {
          console.log("FILE ERROR",e);
        }
      }

      volumeLog[tickerSymbol][timestamp] = updateLog(trade,volumeLog[tickerSymbol][timestamp]);
      volumeLog[tickerSymbol].currentInterval = updateLog(trade,volumeLog[tickerSymbol][timestamp]);
      // console.log(volumeLog[tickerSymbol].currentInterval);



    });
    return socket;
  };


  const getDepth = (symbolArray) => {
    const socket = client.ws.depthCache(symbolArray, function(symbols, depth) {
    	let max = 10; // Show 10 closest orders only
    	let bids = client.sortBids(depth.bids, max);
    	let asks = client.sortAsks(depth.asks, max);
    	console.log(symbols+" depth cache update");
    	console.log("asks", asks);
    	console.log("bids", bids);
    	console.log("ask: "+client.first(asks));
    	console.log("bid: "+client.first(bids));
    });
  };

  return { tradeSocket, getDepth };
}
export default BinanceSockets;
