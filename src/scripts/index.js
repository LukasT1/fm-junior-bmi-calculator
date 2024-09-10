// selectors
const radioMetric = document.getElementById('metric')
const radioImperial = document.getElementById('imperial')
const radioParent = document.querySelector('.form__radio-group')

const input = document.querySelector('.form__input')
const inputMetric = document.querySelector('.form__input-metric')
const inputImperial = document.querySelector('.form__input-imperial')

const resultBMI = document.querySelector('.form__box-result-heading')
const resultText = document.querySelector('.form__box-result-text')
const resultSpan = document.querySelector('.form__box-result-span')

const boxWelcome = document.querySelector('.form__box-welcome')
const boxResult = document.querySelector('.form__box-result')

const bmiResult = document.querySelector('.form__box-result-heading')
const spanText = document.querySelector('.form__box-result-span-text')
const spanWeight = document.querySelector('.form__box-result-span-weight')

let metric = true

const values = {
  heightCm: { min: 0, max: 250, value: 0 },
  weightKg: { min: 0, max: 350, value: 0 },
  heightFt: { min: 0, max: 8, value: 0 },
  heightIn: { min: 0, max: 11, value: 0 },
  weightSt: { min: 0, max: 75, value: 0 },
  weightLbs: { min: 0, max: 15, value: 0 },
  bmi: { bmiMetric: 0, bmiImperial: 0 },
  lowerWeight: { value: 0 },
  higherWeight: { value: 0 },
}

const isValid = (value, { min, max }) => value >= min && value <= max

function init() {
  inputImperial.classList.add('hidden')
  inputMetric.classList.remove('hidden')
  boxWelcome.classList.remove('hidden')
  boxResult.classList.add('hidden')
  metric = true
}

function clearValues() {
  Object.values(values).forEach(el => (el.value = '')) // Resets values in object values with emmpty string
  Object.keys(values).forEach(key => {
    if (key === 'bmi' || key === 'lowerWeight' || key === 'higherWeight')
      return
    document.getElementById(key).value = values[key].value // Sets the values in DOM inputs, except the bmi which doesnt have corresponding input fiedl
  })
  values.bmi.bmiMetric = 0
  values.bmi.bmiImperial = 0
  boxWelcome.classList.remove('hidden')
  boxResult.classList.add('hidden')
}

init()
clearValues()

const selectUnit = function () {
  if (radioMetric.checked) {
    init()
    clearValues()
    metric = true
  }
  if (radioImperial.checked) {
    inputImperial.classList.remove('hidden')
    inputMetric.classList.add('hidden')
    clearValues()
    metric = false
  }
}

const getValue = function (e) {
  let elementId = e.target.id
  let elementValue = parseInt(document.getElementById(elementId).value)
  if (elementValue === undefined || isNaN(elementValue)) return

  if (!isValid(elementValue, values[elementId])) {
    document.getElementById(elementId).value = values[elementId].max
    values[elementId].value = values[elementId].max
    return
  }
  values[elementId].value = elementValue
  calcBMI()
}

const calcBMI = function () {
  if (values.heightCm.value || values.weightKg.value) {
    values.bmi.bmiMetric = parseFloat(
      (
        values.weightKg.value / Math.pow(values.heightCm.value / 100, 2)
      ).toFixed(1),
    )
  }

  if (values.heightFt.value || values.weightSt.value) {
    values.bmi.bmiImperial = parseFloat(
      (
        ((values.weightSt.value * 14 + values.weightLbs.value) * 703) /
        Math.pow(values.heightFt.value * 12 + values.heightIn.value, 2)
      ).toFixed(1),
    )
  }

  // Ensures the display fires after all the data inputed
  if (values.bmi.bmiMetric > 5 || values.bmi.bmiImperial > 5) {
    calcHealthyWeight()
    displayResult()
  }
}

const calcHealthyWeight = function () {
  let height =
    values.heightCm.value ||
    values.heightFt.value * 12 + values.heightIn.value
  lowerBMI = 18.5
  higherBMI = 24.9

  if (metric) {
    values.lowerWeight = parseFloat(
      (lowerBMI * Math.pow(height / 100, 2)).toFixed(1),
    )
    values.higherWeight = parseFloat(
      (higherBMI * Math.pow(height / 100, 2)).toFixed(1),
    )
  }
  if (!metric) {
    values.lowerWeight = parseFloat(
      (lowerBMI * (Math.pow(height, 2) / 703)).toFixed(1),
    )
    values.higherWeight = parseFloat(
      (higherBMI * (Math.pow(height, 2) / 703)).toFixed(1),
    )
  }
  console.log(values)
}

const displayResult = function () {
  let bmiValue = values.bmi.bmiMetric || values.bmi.bmiImperial
  if (bmiValue < 5 || bmiValue > 100) return
  values.heightCm.value ||
    values.heightFt.value * 12 + values.heightIn.value
  bmiResult.innerText = bmiValue
  boxWelcome.classList.add('hidden')
  boxResult.classList.remove('hidden')

  switch (true) {
    case bmiValue < 18.5:
      spanText.innerText = 'underweight'
      break
    case bmiValue >= 18.5 && bmiValue <= 24.9:
      spanText.innerText = 'healthy weight'
      break
    case bmiValue >= 25 && bmiValue <= 29.9:
      spanText.innerText = 'overweight'
      break
    case bmiValue > 30:
      spanText.innerText = 'obese'
      break
  }
  if (metric) {
    spanWeight.innerText = `${values.lowerWeight} kgs - ${values.higherWeight} kgs`
  }

  if (!metric) {
    spanWeight.innerText = `${Math.floor(values.lowerWeight / 14)} stones ${Math.floor(values.lowerWeight % 14) === 0 ? '' : `${Math.floor(values.lowerWeight % 14)} lbs`} - ${Math.floor(values.higherWeight / 14)} stones ${Math.floor(values.higherWeight) % 14 === 0 ? '' : `${Math.floor(values.higherWeight % 14)} lbs`} `
  }
}

radioParent.addEventListener('change', selectUnit)
input.addEventListener('input', getValue)
