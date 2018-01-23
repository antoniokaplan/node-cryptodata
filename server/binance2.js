const api = require('binance');
const binanceRest = new api.BinanceRest({
    key: 'yoOTv1LOaPGRcxY9qUmInfBpePo4hDia0c21cSvKOuOwFjckCHewwfuRWPFtDamy', // Get this from your account on binance.com
    secret: 'MTbJHp8tVP6zqyhRYCisb7mrcZt5IZv8SZ8gMx2vtT92RxEGhUbeRto9zPpESxnR', // Same for this
    timeout: 150000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 100000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false
    /*
     * Optional, default is false. Binance's API returns objects with lots of one letter keys.  By
     * default those keys will be replaced with more descriptive, longer ones.
     */
},
function(response) {

  	console.log("session setup", response);
  	// console.log("order id: " + response);

});
// binance.newOrder({
//                     symbol: 'BNBBTC',
//                     side: 'SELL',
//                     type: 'LIMIT',
//                     timeInForce: 'GTC',
//                     quantity: 5,
//                     price: 0.000635,
//                     timestamp: 1503258350918
//                 })
//                 .then((response) => {
//                     expect(response).to.deep.equal({
//                         symbol: 'BNBBTC',
//                         orderId: 1497927,
//                         clientOrderId: 'dxkJuIgVohXkBsnI2Crnee',
//                         transactTime: 1503258363847
//                     });
//                 });
const sellObject = {
    "symbol": "XVGBTC",
    "type":"MARKET",
    "quantity": 500
    // "clientOrderId": "myOrder1",
    // "transactTime": 1499827319559
};


binanceRest.newOrder(sellObject,function(response) {
	console.log("Limit Buy response", response);
	console.log("order id: " + response);
})
