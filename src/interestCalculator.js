function submitRate() {
  const inputAmount = document.getElementById('amount')
  const inputRate = document.getElementById('rate')
  const inputYears = document.getElementById('years')
  const outputSummary = document.getElementById('summary')
  
  let result = 0
  let years = 1
  let rate = 1.00
  let amount = 0
  
  years = inputYears.value
  amount = inputAmount.value
  rate = inputRate.value
  
  for (let i = 0; i < years; i++) {
    result += amount
    result = result * (rate/100)
  }
  
  outputSummary.innerHTML = result
}
