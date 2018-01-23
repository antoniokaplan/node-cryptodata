// https://github.com/HyperCubeProject/binance-api-node
import Binance from 'binance-api-node';
import moment from 'moment';

const logger = require('../logger');
import { addToFile,  readFile  } from './file-helpers';

const BinanceRest = (client) => {

  const errorLogger = (e) => {
    console.log(e);
  };

  const symbolArray = [];

  const parseSymbols = (tickerData) => {
    for (const symbol in tickerData) {
      if(symbol !== '123456' && symbol.slice(-3)==("BTC")) symbolArray.push(symbol);
    }
    return symbolArray;
  }

  async function getAllTickers() {
    const tickerData = await client.allBookTickers(errorLogger);
    // console.log("bookTickers", tickerData);
    const tickerSymbols = parseSymbols(tickerData);
    // console.log(tickerSymbols);
    return {tickerData, tickerSymbols};
  }


  async function f1() {
    const quantity = await calc_quantity_btc(symbol, 0.02);
    console.log("quantity BNBBTC - ",quantity); // 10
  }
  // f1();

  async function calc_quantity_btc(symbol, btc_val){
    const prices = await client.prices();
    const price = prices[symbol];
    console.log("PRICES  - ",symbol, price[symbol]); // 10
    console.log('Math.floor(btc_val / price)',Math.floor(btc_val / price))
    return Math.floor(btc_val / price);
  }

  /**
  btc_ammount or quantity
  */
  async function marketOrder(order){
    console.log("order",order)
    const response = await client.order({
      symbol: order.symbol,
      type:"MARKET",
      quantity: (order.btc_ammount) ? await calc_quantity_btc(order.symbol, order.btc_ammount) : order.quantity,
      side: order.side,
      recvWindow: 10000
    });
    console.log(response);
    return response;
  }

  function limitOrder(){

  }

  const buyOrder = {
    symbol: 'XRPBTC',
    // quantity: 500,
    btc_ammount: 0.1,
    side: 'buy',
  };
  // marketOrder(buyOrder);



  // const clean = client.ws.candles('ETHBTC', '1m', candle => {
  //   console.log(candle)
  // })

  // After you're done
  // clean()

  // const clean = client.ws.partialDepth({ symbol: 'ETHBTC', level: 10 }, depth => {
  //   console.log(depth)
  // });

  //
  const sellOrder = {
    symbol: 'VIBEBTC',
    // quantity: 500,
    btc_ammount: 0.1,
    side: 'SELL',
  };

  return { getAllTickers, symbolArray };
};

// export default {
//   setClient,
//   getAllTickers,
// }
export default BinanceRest;
