const http = require('http')

const expensiveCalculation = {
  /**
   * Very expensive calculations, reuslts are valid for 5+ seconds 
   * 
   * @returns {Promise<String>} some result
   */
  async calculateData() {
    return await (new Promise(resolve => setTimeout(() => {
      resolve('result')
    }, 1000)))
  }
}

/* ---------- edit below this line ---------------- */

const CACHE_LIFETIME = 4000;
let waitingForCalculationQueue = [];
const cachedCalculation = {
	value: null,
	time: 0,
	calculationStarted: false,
};

const startCalculation = async () => {
	cachedCalculation.calculationStarted = true;
	const result = await expensiveCalculation.calculateData();
	cachedCalculation.value = result;
	cachedCalculation.time = Date.now();
	cachedCalculation.calculationStarted = false;
	waitingForCalculationQueue.forEach(res => {
		res.write(`${result}`);
		res.end();
	});
	waitingForCalculationQueue = [];
}

const responseWithCachedCalculation = (res) => {
	const { value, time, calculationStarted } = cachedCalculation;
	if (value != null && Date.now() - time < CACHE_LIFETIME) {
		res.write(`${value}`);
		res.end();
	} else {
		waitingForCalculationQueue.push(res);
		if (!calculationStarted) {
			startCalculation();
		}
	}
}


http.createServer(async (req, res) => {
	responseWithCachedCalculation(res);
}).listen(5000)
