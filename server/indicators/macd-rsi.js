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

import { sma, ema, rsi } from 'technicalindicators';
import dataForge  from 'data-forge';
import path from 'path';

/** load custom helper methods **/
import {loadCsv,writeCsv} from '../services/csv';
import Vector from '../services/matrix';

const BASE_PATH = process.env.DATA_DIRECTORY || path.resolve(process.env.PWD);

/**
 * [fileToDataFrame description]
 * @param  {[type]} tickerSymbol [description]
 * @param  {[type]} fileDate     [description]
 * @return {[type]}              [description]
 */
const fileToDataFrame = (tickerSymbol, fileDate) => {
  const filedir = `${BASE_PATH}/data-files/${tickerSymbol}`;
  const filepath = `${tickerSymbol}-${fileDate}.tsv`;
  const df = loadCsv(`${filedir}/${filepath}`);
  return df;
};

const dataFrameToFile = (tickerSymbol, fileDate, dataFrame) => {
  const filedir = `${BASE_PATH}/data-files/${tickerSymbol}`;
  const filepath = `${tickerSymbol}-${fileDate}.csv`;
  const df = writeCsv(`${filedir}/${filepath}`,dataFrame);
  console.log(`writing file - ${filedir}/${filepath}`)
  return df;
};

const dataframe = fileToDataFrame("XLMBTC", "2018-01-31_");

const closes = dataframe
                .parseFloats('close')
                .getSeries('close')
                .toArray();

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
const slowMA = ema({period : slowLength, values : closes})


const fastMA_slice = fastMA.slice((slowLength-fastLength));
const macd = Vector.subtractVectors(fastMA_slice, slowMA);


const signal = sma({period : signalLength, values : macd})
const rsi_data = rsi({period : rsiLength, values : macd})


const macd_slice = macd.slice(Math.abs(signal.length - macd.length));
const hist = Vector.subtractVectors(macd_slice, signal);

// const indicators = [signal, hist, macd, rsi_data];

const indicators = [signal, hist, macd, rsi_data].map( indicator => Array(closes.length - indicator.length)
                                                                      .fill(indicator[0])
                                                                      .concat(indicator));

const indicatorSeries = indicators.map( indicator => new dataForge.Series(indicator));

// const empty_cells_signal = Array(closes.length - signal.length).fill(signal[0]);
// const empty_cells_hist = Array(closes.length - hist.length).fill(hist[0]);
// const empty_cells_macd = Array(closes.length - macd.length).fill(macd[0]);
// const empty_cells_rsi = Array(closes.length - rsi_data.length).fill(rsi_data[0]);


// pad array of empty cells with the first value and create Series
const signal_series = new dataForge.Series(empty_cells_signal.concat(signal));
const hist_series = new dataForge.Series(empty_cells_hist.concat(hist));
const macd_series = new dataForge.Series(empty_cells_hist.concat(macd));
const rsi_series = new dataForge.Series(empty_cells_rsi.concat(rsi_data));

const final_df = dataframe
                    .withSeries({
                      macd: macd_series,
                      macdSignal: signal_series,
                      macdHist: hist_series,
                      rsi: rsi_series,
                    });
// console.log(final_df.head(10).toString())
// console.log(final_df.tail(10).toString())
dataFrameToFile("XLMBTC", "2macd2018-01-31_",final_df);
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
