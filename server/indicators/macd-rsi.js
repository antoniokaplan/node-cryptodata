//AK47-macd-rsi
// https://github.com/anandanand84/technicalindicators

/**
//Use Current Chart Resolution?
// const useCurrentRes = true;
// const resCustom = 60;
// smd = input(true, title="Show MacD & Signal Line? Also Turn Off Dots Below")
// sd = input(true, title="Show Dots When MacD Crosses Signal Line?")
// sh = input(true, title="Show Histogram?")
// macd_colorChange = input(true,title="Change MacD Line Color-Signal Line Cross?")
// hist_colorChange = input(true,title="MacD Histogram 4 Colors?")
*/

import { sma, ema } from 'technicalindicators';
import dataForge  from 'data-forge';
import path from 'path';

/** load custom helper methods **/
import loadCsv from '../services/csv';
import Vector from '../services/matrix';

const BASE_PATH = process.env.DATA_DIRECTORY || path.resolve(process.env.PWD);

const fileToDataFrame = (tickerSymbol, fileDate) => {
  const filedir = `${BASE_PATH}/data-files/${tickerSymbol}`;
  const filepath = `${tickerSymbol}-${fileDate}.tsv`;
  const df = loadCsv(`${filedir}/${filepath}`);
  return df;
};

const dataframe = fileToDataFrame("XLMBTC", "2018-01-31_");

// var columns = dataframe.getColumns().where(column => column.name == "close");
// var data = columns.toArray();
// var columnSubset = df.subset(["Some-Column", "Some-Other-Column"]);
const closes = dataframe
                .parseFloats('close')
                .getSeries('close')
                .toArray();

// console.log("DATAFRAME-",dataframe.getColumnNames());
console.log("DATAFRAME rows-", closes.length);
console.log("DATAFRAME-",typeof closes[4]);

/**
  * define constants for speeds of calculations
  * @TODO create function to run through variety of input values to test regression fit
  */
const fastLength = 4;
const slowLength = 13;
const signalLength = 4;
const rsiLength = 10;

// /** calculate exponential moving average as vector **/
const fastMA = ema({period : fastLength, values : closes})
console.log("fastMA",fastMA.length);
const slowMA = ema({period : slowLength, values : closes})
console.log("slowMA",slowMA.length);

const fastMA_slice = fastMA.slice((slowLength-fastLength));
const macd = Vector.subtractVectors(fastMA_slice, slowMA);
console.log("macd length",macd.length );

const signal = sma({period : signalLength, values : macd})
console.log("signal length",signal.length );

const macd_slice = macd.slice(Math.abs(signal.length - macd.length));
const hist = Vector.subtractVectors(macd_slice, signal);
console.log("hist",hist.length);


//
// outMacD = security(tickerid, res, macd)
// outSignal = security(tickerid, res, signal)
// outRsi = security(tickerid, res, rsi)
// outHist = security(tickerid, res, hist)
//
// histA_IsUp = outHist > outHist[1] and outHist > 0
// histA_IsDown = outHist < outHist[1] and outHist > 0
// histB_IsDown = outHist < outHist[1] and outHist <= 0
// histB_IsUp = outHist > outHist[1] and outHist <= 0
//
// //MacD Color Definitions
// macd_IsAbove = outMacD >= outSignal
// macd_IsBelow = outMacD < outSignal
//
// plot_color = hist_colorChange ? histA_IsUp ? aqua : histA_IsDown ? blue : histB_IsDown ? red : histB_IsUp ? maroon :yellow :gray
// macd_color = macd_colorChange ? macd_IsAbove ? lime : red : red
// signal_color = macd_colorChange ? macd_IsAbove ? yellow : yellow : red
//
// circleYPosition = outSignal
//
// plot(smd and outMacD ? outMacD : na, title="MACD", color=macd_color, linewidth=4)
// plot(outRsi,title="RSI",color=black,linewidth=1)
// plot(smd and outSignal ? outSignal : na, title="Signal Line", color=signal_color, style=line ,linewidth=2)
// plot(sh and outHist ? outHist : na, title="Histogram", color=plot_color, style=histogram, linewidth=4)
// plot(sd and cross(outMacD, outSignal) ? circleYPosition : na, title="Cross", style=histogram, linewidth=1, color=macd_color)
// hline(0, '0 Line', linestyle=solid, linewidth=2, color=white)
export default { dataframe };
