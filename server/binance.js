const binance = require('node-binance-api');
binance.options({
  'APIKEY':'yoOTv1LOaPGRcxY9qUmInfBpePo4hDia0c21cSvKOuOwFjckCHewwfuRWPFtDamy',
  'APISECRET':'MTbJHp8tVP6zqyhRYCisb7mrcZt5IZv8SZ8gMx2vtT92RxEGhUbeRto9zPpESxnR'
});
// binance.marketSell("XVGBTC", 8000);
var quantity = 8000, price = 0.00001061;
binance.sell("XVGBTC", quantity, price, {}, function(response) {
	console.log("Limit Buy response", response);
	console.log("order id: " + response.orderId);
});
console.log('eeeee');
// binance.balance(function(balances) {
// 	console.log("balances()", balances);
// 	if ( typeof balances.ETH !== "undefined" ) {
// 		console.log("ETH balance: ", balances.ETH.available);
// 	}
// });
binance.prices(function(ticker) {
  console.log("prices()", ticker);
  console.log("Price of BNB: ", ticker.BNBBTC);
});
// binance.sell('XVGBTC', 8000, 0, "MARKET");
