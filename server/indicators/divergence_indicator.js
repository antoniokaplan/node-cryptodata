//@version=3
study(title="Divergence Indicator")

osc = rsi(close, 14)

// Bullish
bullishPrice = low
priceMins = bullishPrice > bullishPrice[1] and bullishPrice[1] < bullishPrice[2]

priceRightMin = valuewhen(priceMins, bullishPrice[1], 0)
priceLeftMin = valuewhen(priceMins, bullishPrice[1], 1)

oscRightMin = valuewhen(priceMins, osc[1], 0)
oscLeftMin = valuewhen(priceMins, osc[1], 1)

bullishNDiv = priceLeftMin > priceRightMin and oscLeftMin < oscRightMin
bullishHDiv = priceLeftMin < priceRightMin and oscLeftMin > oscRightMin

bullishNSig = bullishNDiv and not bullishNDiv[1] and bullishPrice[1] < bullishPrice
bullishHSig = bullishHDiv and not bullishHDiv[1] and bullishPrice[1] > bullishPrice

plot(bullishNSig ? 1 : 0, title="Normal Bullish Divergence", style=histogram, linewidth=3, color=green)
plot(bullishHSig ? 1 : 0, title="Hidden Bullish Divergence", style=histogram, linewidth=1, color=green)

// Bearish
bearishPrice = high
priceMaxs = bearishPrice < bearishPrice[1] and bearishPrice[1] > bearishPrice[2]

priceRightMax = valuewhen(priceMaxs, bearishPrice[1], 0)
priceLeftMax = valuewhen(priceMaxs, bearishPrice[1], 1)

oscRightMax = valuewhen(priceMaxs, osc[1], 0)
oscLeftMax = valuewhen(priceMaxs, osc[1], 1)

bearishNDiv = priceLeftMax < priceRightMax and oscLeftMax > oscRightMax
bearishHDiv = priceLeftMax > priceRightMax and oscLeftMax < oscRightMax

bearishNSig = bearishNDiv and not bearishNDiv[1] and bearishPrice[1] < bearishPrice
bearishHSig = bearishHDiv and not bearishHDiv[1] and bearishPrice[1] > bearishPrice

plot(bearishNSig ? 1 : 0, title="Normal Bearish Divergence", style=histogram, linewidth=3, color=red)
plot(bearishHSig ? 1 : 0, title="Hidden Bearish Divergence", style=histogram, linewidth=1, color=red)
