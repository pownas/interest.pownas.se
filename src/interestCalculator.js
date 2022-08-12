function submitRate() {
  const inputAmount = document.getElementById('amount')
  const inputRate = document.getElementById('rate')
  const inputYears = document.getElementById('years')
  const inputRadioOnce = document.getElementById('once')
  const inputRadioMonthly = document.getElementById('monthly')
  const inputRadioYearly = document.getElementById('yearly')
  const outputSummary = document.getElementById('summary')
  
  let result = 0
  let years = 1
  let rate = 1.00
  let amount = 0
  
  years = parseFloat(inputYears.value)
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  
  for (let i = 0; i < years; i++) {
    if(inputRadioYearly.checked || inputRadioOnce.checked && i < 1)
      result = result + amount
    if(inputRadioMonthly.checked)
      result = result + (amount*12)
    result = (result * (rate/100)) + result
  }
  
  outputSummary.innerHTML = result
}
