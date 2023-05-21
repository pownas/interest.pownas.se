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

function getInputValues() {
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)
}

function submitRate() {
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
  outputSummary.innerHTML = Math.round(getJson.result)
}

function saveToJSON() { 
  getInputValues()
  amount = parseFloat(inputAmount.value)
  rate = parseFloat(inputRate.value)
  years = parseFloat(inputYears.value)

  var jsonObject = { 
    'amount': amount,
    'rate': rate,
    'years': years,
    'result': result,
  };

  //Lagrar ned jsonObject i localStorage med namnet: "savedJsonObject" på användarens dator. 
  localStorage.setItem('savedJsonObject', JSON.stringify(jsonObject));
}