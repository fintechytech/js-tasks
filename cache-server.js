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

http.createServer(async (req, res) => {
  const result = await expensiveCalculation.calculateData()
  res.write(`${result}`)
  res.end()
}).listen(5000)
