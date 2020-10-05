const http = require('http')

const expensiveCalculation = {
  /**
   * Very expensive calculations, reuslts are valid for 5+ seconds 
   * 
   * @param {string} param some query parameter
   * @returns {Promise<String>} some result
   */
  async calculateData(param) {
    return await (new Promise(resolve => setTimeout(() => {
      resolve(`result for ${param}`)
    }, 1000)))
  }
}

/* ---------- edit below this line ---------------- */

const CACHE_LIFETIME = 4000;
const waitingForCalculationQueue = {};
const cachedCalculations = {};
const calculationStartedFor = [];

const responseToQueue = (param, value) => {
  waitingForCalculationQueue[param].forEach(res => {
    res.write(`${value}`);
    res.end();
  });
  waitingForCalculationQueue[param] = [];
}

const startCalculation = async (param) => {
  calculationStartedFor.push(param);
  const result = await expensiveCalculation.calculateData(param);
  cachedCalculations[param] = result;
  setTimeout(() => {
    cachedCalculations[param] = null;
  }, CACHE_LIFETIME);
  const calculationStartedForIndex = calculationStartedFor.findIndex(el => el === param);
  delete calculationStartedFor[calculationStartedForIndex];

  responseToQueue(param, result);
}

const responseWithCachedCalculation =  (res, param) => {
  const value = cachedCalculations[param];
  if (value != null) {
    res.write(`${value}`);
    res.end();
  } else {
    if (!waitingForCalculationQueue[param]) {
      waitingForCalculationQueue[param] = [];
    }
    waitingForCalculationQueue[param].push(res);
    if (!calculationStartedFor.includes(param)) {
      startCalculation(param);
    }
  }
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const param = url.searchParams.get('query_param')

  responseWithCachedCalculation(res, param);
}).listen(5000)
