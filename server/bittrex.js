const binance = require('node-binance-api');
binance.options({
  'APIKEY':'yoOTv1LOaPGRcxY9qUmInfBpePo4hDia0c21cSvKOuOwFjckCHewwfuRWPFtDamy',
  'APISECRET':'MTbJHp8tVP6zqyhRYCisb7mrcZt5IZv8SZ8gMx2vtT92RxEGhUbeRto9zPpESxnR'
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
