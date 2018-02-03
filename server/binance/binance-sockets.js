import Binance from 'binance-api-node';
import moment from 'moment';
import path from 'path';
import dotenv from 'dotenv'

const logger = require('../logger');
import { addToFile,  readFile  } from './file-helpers'

//separate the files into hourly
// const FILE_INTERVAL = "HH";
const FILE_INTERVAL = process.env.FILE_INTERVAL;
console.log("FILE_INTERVAL",FILE_INTERVAL);

//aggregate the intervals by minute
// const TIME_INTERVAL = "HH:mm";
const TIME_INTERVAL = process.env.TIME_INTERVAL;

const BASE_PATH = process.env.DATA_DIRECTORY || path.resolve(process.env.PWD);

const BinanceSockets = (client) => {
  // let endpoints = binance.websockets.subscriptions();
  // for ( let endpoint in endpoints ) {
  // 	console.log(endpoint);
  // 	//binance.websockets.terminate(endpoint);
  // }

  const logObject = {
    tickerSymbol: "",
    interval: "",
    marketBuy: 0,
    marketSell: 0,
    marketVolume: 0,
    marketTrades: 0,
    marketDelta: 0,
    open: 0,
    low: 0,
    high: 0,
    close: 0,
    volume: 0,
    totalTrades: 0,
    buyVolume: 0,
    b0_p:0,
    b0_q:0,
    b1_p:0,
    b1_q:0,
    b2_p:0,
    b2_q:0,
    b3_p:0,
    b3_q:0,
    b4_p:0,
    b4_q:0,
    a0_p:0,
    a0_q:0,
    a1_p:0,
    a1_q:0,
    a2_p:0,
    a3_q:0,
    a3_p:0,
    a3_q:0,
    a4_p:0,
    a4_q:0,

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

  const formatTrades = (trade,obj) => {
    obj.tickerSymbol = trade.symbol;
    // obj.timestamp = trade.eventTime;
    obj.interval = trade.interval;

    if(!trade.maker){ //marketBuy
      obj.marketBuy += trade.quantity*1;
      // obj.lastPrice = trade.price;
      obj.marketDelta = obj.marketBuy - obj.marketSell;
      // logger.logGreen(JSON.stringify(obj));
    } else { //marketSell
      obj.marketSell += trade.quantity*1;
      // obj.lastPrice = trade.price;
      obj.marketDelta = obj.marketBuy - obj.marketSell;
      // logger.logRed(JSON.stringify(obj));
    }
    obj.marketVolume += trade.quantity*1;
    obj.marketTrades += 1;
    return obj;
  }

  const formatDepth = (depthObj,obj) => {
    const {bids, asks} = depthObj;
    for(const bid in bids){
      obj[`b${bid}_p`] = Number(bids[bid].price);
      obj[`b${bid}_q`] = Number(bids[bid].quantity);
    }

    for(const ask in asks){
      obj[`a${ask}_p`] = Number(asks[ask].price);
      obj[`a${ask}_q`] = Number(asks[ask].quantity);
    }
    return obj;
  };

  const formatCandle = (trade,obj) => {
    obj.open = Number(trade.open);
    obj.low = Number(trade.low);
    obj.high = Number(trade.high);
    obj.close = Number(trade.close);
    obj.volume = Number(trade.volume);
    obj.totalTrades = Number(trade.trades);
    // obj.quoteVolume = Number(trade.quoteVolume);
    obj.buyVolume = Number(trade.buyVolume);
    // obj.quoteBuyVolume = Number(trade.quoteBuyVolume);
    return obj;
  };

  const fileError = (e) => {
    console.log("FILE ERROR",e);
  };


  const updateLog = (data, formatFun) => {
    const now = moment(data.eventTime);
    const tickerSymbol = data.symbol;
    const timestamp = now.format(`YYYY-MM-DD_${TIME_INTERVAL}`);
    // console.log("volumeLog[tickerSymbol][timestamp]",volumeLog[tickerSymbol][timestamp])
    if(volumeLog[tickerSymbol][timestamp]) {
      volumeLog[tickerSymbol][timestamp] = formatFun(data, volumeLog[tickerSymbol][timestamp]);
      volumeLog[tickerSymbol].currentInterval = formatFun(data, volumeLog[tickerSymbol][timestamp]);
      // console.log(volumeLog[tickerSymbol].currentInterval)
    }
  };

  const writeDataFile = (tickerSymbol, timestamp) => {
    if(!volumeLog[tickerSymbol][timestamp]){
      volumeLog[tickerSymbol][timestamp] = { ...logObject };
      try {
        const filedir = `${BASE_PATH}/data-files/${tickerSymbol}`;
        const filepath = `${tickerSymbol}-${fileTimeStamp}.tsv`;
        const data = addToFile(filedir, filepath, volumeLog[tickerSymbol].currentInterval, fileError);

      } catch(e) {
        console.log("FILE ERROR",e);
      }
    }
  };

  // create an instance of the volume log for the symbol
  let volumeLog = null;

  // pass ARRAY of symbols
  const tradeSocket = (symbolArray) => {

    // create an instance of the volume log for the symbol
    if (volumeLog === null ) {
      console.log("VOLUMELOG not started")
      volumeLog = createVolumeLog(symbolArray);
    }

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

          const filedir = `${BASE_PATH}/data-files/${tickerSymbol}`;
          const filepath = `${tickerSymbol}-${fileTimeStamp}.tsv`;
          const data = addToFile(filedir, filepath, volumeLog[tickerSymbol].currentInterval, fileError);

        } catch(e) {
          console.log("FILE ERROR",e);
        }
      }


      volumeLog[tickerSymbol][timestamp] = formatTrades(trade,volumeLog[tickerSymbol][timestamp]);
      volumeLog[tickerSymbol].currentInterval = formatTrades(trade,volumeLog[tickerSymbol][timestamp]);
      // console.log(volumeLog[tickerSymbol].currentInterval);
    });
    return socket;
  };



  const getDepth = (symbolArray) => {
    const depthObject = symbolArray.map(sym => ({symbol:sym, level:5}))
    const socket = client.ws.partialDepth(depthObject, (depthData) => {
      // console.log(depthData);
      updateLog(depthData, formatDepth);
    });
  };


  const getCandles = (symbolArray) => {
    if (volumeLog === null ) volumeLog = createVolumeLog(symbolArray);
    const socket = client.ws.candles(symbolArray, '1m', candleData => {
      updateLog(candleData, formatCandle);
    });
    return socket;
  };

  return { tradeSocket, getDepth, getCandles };
}
export default BinanceSockets;
