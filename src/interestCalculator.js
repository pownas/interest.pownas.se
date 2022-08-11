function submitRate() {
  const inputAmount = document.getElementById('amount')
  const inputRate = document.getElementById('rate')
  const inputYears = document.getElementById('years')
  const outputSummary = document.getElementById('summary')
  
  let result = 0;
  
  for (let i = 0; i < inputYears.value; i++) {
    result += inputAmount.value
    result = result * (inputRate.value/100)
  }
  
  outputSummary.innerHTML = result
}
