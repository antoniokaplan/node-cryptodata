//@version=3
study(title="Directional Movement Index", shorttitle="DMI")
len = input(14, minval=1, title="DI Length")
lensig = input(14, title="ADX Smoothing", minval=1, maxval=50)

//change - difference between current and previous
const delta = (vector, index) => {
  if(vector.length == 0 || index === 0 || vector.length <= index) return 0;
  return Number(vector[index]) - Number(vector[index-1])
}
/** returns array of the same length as input, first number is 0 (no change yet) **/
const deltaVector = (vector) => (
  vector.map( (item,i) => delta(vector,i) )
)

up = change(high)
down = -change(low)
plusDM = na(up) ? na : (up > down and up > 0 ? up : 0)
minusDM = na(down) ? na : (down > up and down > 0 ? down : 0)
trur = rma(tr, len)
plus = fixnan(100 * rma(plusDM, len) / trur)
minus = fixnan(100 * rma(minusDM, len) / trur)
sum = plus + minus
adx = 100 * rma(abs(plus - minus) / (sum == 0 ? 1 : sum), lensig)

plot(plus, color=blue, title="+DI")
plot(minus, color=orange, title="-DI")
plot(adx, color=red, title="ADX")
