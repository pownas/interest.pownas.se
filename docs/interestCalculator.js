const inputAmount = document.getElementById('amount')
const inputRate = document.getElementById('rate')
const inputYears = document.getElementById('years')
const inputRadioOnce = document.getElementById('once')
const inputRadioWeekly = document.getElementById('weekly')
const inputRadioMonthly = document.getElementById('monthly')
const inputRadioYearly = document.getElementById('yearly')
const outputResult = document.getElementById('hiddenResult')
const outputSummary = document.getElementById('summary')

let result = 0
let amount = 0
let rate = 1.00
let years = 1
let frequency = "once"

function getInputValues() {
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)

  if(inputRadioYearly.checked)
    frequency = "once"
  if(inputRadioYearly.checked)
    frequency = "yearly"
  if(inputRadioMonthly.checked)
    frequency = "monthly"
  if(inputRadioWeekly.checked)
    frequency = "weekly"
}

function submitRate() {
  result = 0
  getInputValues()
  
  for (let i = 0; i < years; i++) {
    if(inputRadioYearly.checked || inputRadioOnce.checked && i < 1)
      result = result + amount
    if(inputRadioMonthly.checked)
      result = result + (amount*12)
    if(inputRadioWeekly.checked)
      result = result + (amount*52)
    
    result = (result * (rate/100)) + result
  }
  
  outputSummary.innerHTML = Math.round(result)

  saveToJSON()
}


var localJsonObject = JSON.parse(localStorage.getItem('savedJsonObject'));

if (localJsonObject != null){
  loadJsonToForm(localJsonObject)
}

function loadJsonToForm(getJson){
  inputAmount.value = getJson.amount
  inputRate.value = getJson.rate
  inputYears.value = getJson.years
  outputResult.value = getJson.result
  outputSummary.innerHTML = (getJson.result).toLocaleString('sv-SE', {
    style: 'currency',
    currency: 'SEK',
  })
  
  if(getJson.frequency == "once")
    inputRadioOnce.checked = true
  else
    inputRadioOnce.checked = false
  
  if(getJson.frequency == "yearly")
    inputRadioYearly.checked = true
  else
    inputRadioYearly.checked = false

  if(getJson.frequency == "montly")
    inputRadioMonthly.checked = true
  else
    inputRadioMonthly.checked = false

  if(getJson.frequency == "weekly")
    inputRadioWeekly.checked = true
  else
    inputRadioWeekly.checked = false
  
}

function saveToJSON() { 
  getInputValues()
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)

  var jsonObject = { 
    'amount': amount,
    'frequency': frequency,
    'rate': rate,
    'years': years,
    'result': result,
  };

  //Lagrar ned jsonObject i localStorage med namnet: "savedJsonObject" på användarens dator. 
  localStorage.setItem('savedJsonObject', JSON.stringify(jsonObject));
}