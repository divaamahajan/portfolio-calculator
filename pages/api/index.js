async function getDates(symbol = 'AAPL,GOOGL', date_from = '2023-01-25', date_to = '2023-01-31', allocation = [0.5, 0.5], initialBalance = 1000) {
  const key = process.env.MARKETSTACK_API_KEY;
  let url = `http://api.marketstack.com/v1/eod?access_key=${key}&symbols=${symbol}&date_from=${date_from}&date_to=${date_to}`
  console.log("Inside API symbol", symbol)
  const res = await fetch(url, {
    method: 'GET',
  })
  const data = await res.json();
  let finalData = {};
  finalData['data'] = {};
  let symbolArray = symbol.split(',');

  const combinedObject = symbolArray.reduce((obj, key, index) => {
    obj[key] = allocation[index];
    return obj;
  }, {});

  for (let i = 0; i < data.data.length; i++) {
    let eachDataPoint = data.data[i];
    let symbol = eachDataPoint.symbol;
    let date = eachDataPoint.date.slice(0, 10);
    let formatedData = {
      name: symbol,
      open: (eachDataPoint.open * initialBalance * combinedObject[symbol] / eachDataPoint.open).toFixed(2),
      high: (eachDataPoint.high * initialBalance * combinedObject[symbol] / eachDataPoint.open).toFixed(2),
      low: (eachDataPoint.low * initialBalance * combinedObject[symbol] / eachDataPoint.open).toFixed(2),
      close: (eachDataPoint.close * initialBalance * combinedObject[symbol] / eachDataPoint.open).toFixed(2),
      volume: eachDataPoint.volume,
    }
    if (finalData['data'][symbol]) {
      finalData['data'][symbol][date] = formatedData;
    } else {
      finalData['data'][symbol] = {};
      finalData['data'][symbol][date] = formatedData;
    }
  }
  return finalData;
}

export default async function handler(req, res) {
  let method = req.method;
  let body = JSON.parse(req.body);
  if (method === 'POST') {
    getDates(body.symbol, body.date_from, body.date_to, body.allocation, body.initialBalance)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
  }
}