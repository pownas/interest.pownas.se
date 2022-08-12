function submitRate() {
  const inputAmount = document.getElementById('amount')
  const inputRate = document.getElementById('rate')
  const inputYears = document.getElementById('years')
  const inputHowOften = document.getElementByName('howOften')
  const outputSummary = document.getElementById('summary')
  
  let result = 0
  let years = 1
  let rate = 1.00
  let amount = 0
  
  years = parseFloat(inputYears.value)
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  
  for (let i = 0; i < years; i++) {
    if(inputHowOften.value == "yearly" || inputHowOften.value == "once" && i < 1)
      result = result + amount
    if(inputHowOften.value == "monthly")
      result = result + (amount*12)
    result = (result * (rate/100)) + result
  }
  
  outputSummary.innerHTML = result
}
