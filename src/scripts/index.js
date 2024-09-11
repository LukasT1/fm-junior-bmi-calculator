'use strict'

class InputField {
  constructor(id, min, max) {
    this.element = document.getElementById(id)
    this.min = min
    this.max = max
    this.value = ''
  }
  getValue() {
    const val = parseInt(this.element.value)
    return isNaN(val) ? '' : val
  }

  setValue(val) {
    if (val < this.min) {
      val = this.min
    } else if (val > this.max) {
      val = this.max
    }

    this.value = this.element.value = val
  }
  clear() {
    this.setValue('')
  }
}

class BMICalculator {
  constructor() {
    this.radioMetric = document.getElementById('metric')
    this.radioImperial = document.getElementById('imperial')
    this.radioParent = document.querySelector('.form__radio-group')

    this.inputMetric = document.querySelector('.form__input-metric')
    this.inputImperial = document.querySelector('.form__input-imperial')

    this.boxWelcome = document.querySelector('.form__box-welcome')
    this.boxResult = document.querySelector('.form__box-result')

    this.resetIcon = document.querySelector('.form__heading-icon')

    this.bmiResult = document.querySelector('.form__box-result-heading')
    this.spanText = document.querySelector('.form__box-result-span-text')
    this.spanWeight = document.querySelector(
      '.form__box-result-span-weight',
    )
    this.metric = true

    this.state = {
      metric: {
        heightCm: new InputField('heightCm', 0, 250),
        weightKg: new InputField('weightKg', 0, 500),
      },
      imperial: {
        heightFt: new InputField('heightFt', 0, 8),
        heightIn: new InputField('heightIn', 0, 11),
        weightSt: new InputField('weightSt', 0, 75),
        weightLbs: new InputField('weightLbs', 0, 13),
      },
      results: {
        bmi: 0,
        lowerWeight: 0,
        higherWeight: 0,
      },
    }

    this.inputListener(this.state.imperial)
    this.inputListener(this.state.metric)
    this.radioParent.addEventListener('change', this.selectUnit.bind(this))
    this.resetIcon.addEventListener('click', this.clearValues.bind(this))
  }

  updateUI(elements) {
    for (let [element, show] of Object.entries(elements)) {
      this.showElement(this[element], show)
    }
  }

  clearValues() {
    Object.values(this.state.metric).forEach(input => input.clear())
    Object.values(this.state.imperial).forEach(input => input.clear())
    this.state.results.bmi = 0

    this.updateUI({
      boxWelcome: true,
      boxResult: false,
    })
  }

  showElement(element, show) {
    if (show) {
      element.classList.remove('hidden')
    } else {
      element.classList.add('hidden')
    }
  }

  selectUnit() {
    this.metric = !this.metric
    console.log(this.metric)
    this.updateUI({
      inputMetric: this.metric,
      inputImperial: !this.metric,
    })
    this.displayResult()
    // this.clearValues()
  }

  inputListener(input) {
    Object.values(input).forEach(inputField => {
      inputField.element.addEventListener('input', e => {
        this.handleInputChange(e) // Respond to input changes
      })
    })
  }

  handleInputChange(e) {
    const elementId = e.target.id // Get the input's ID
    const inputField =
      this.state.metric[elementId] || this.state.imperial[elementId] // Find the matching InputField
    if (inputField) {
      inputField.setValue(e.target.value) // Update the state
    }
    this.convertUnits()
    this.calcBMI()
  }

  convertToImperial([height, weight]) {
    console.log(height, weight)
    const totalStones = weight * 0.15747
    const weightSt = Math.trunc(totalStones)
    const weightLbs = Math.round((totalStones - weightSt) * 14)

    const totalInches = height * 0.393701
    const heightFt = Math.trunc(totalInches / 12)
    const heightIn = Math.round(totalInches % 12)

    return { heightFt, heightIn, weightSt, weightLbs }
  }

  convertToMetric([feets, inches, stones, lbs]) {
    console.log(feets, inches, stones, lbs)
    const weightKg = Math.round(stones * 6.35029 + lbs * 0.453592)
    const heightCm = Math.round((feets * 12 + inches) * 2.54)
    return { heightCm, weightKg }
  }

  convertUnits() {
    const currentUnit = this.metric ? 'metric' : 'imperial'
    const oppositeUnit = this.metric ? 'imperial' : 'metric'

    const currentValues = Object.values(this.state[currentUnit]).map(el =>
      el.getValue(),
    )

    const converted =
      this.metric ?
        this.convertToImperial(currentValues)
      : this.convertToMetric(currentValues)

    Object.keys(converted).forEach(key => {
      if (this.state[oppositeUnit].hasOwnProperty(key)) {
        this.state[oppositeUnit][key].setValue(converted[key])
      }
    })
    console.log(this.state)
  }

  calcBMI() {
    const weight = this.state.metric.weightKg.getValue()
    const height = this.state.metric.heightCm.getValue()

    if (height > 0 && weight > 0) {
      this.state.results.bmi =
        Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10
      this.calcHealthyWeight()
    }
  }

  calcHealthyWeight() {
    const height = this.state.metric.heightCm.getValue()
    const lowerBMI = 18.5
    const higherBMI = 24.9

    this.state.results.lowerWeight = lowerBMI * Math.pow(height / 100, 2)
    this.state.results.higherWeight = higherBMI * Math.pow(height / 100, 2)
    this.displayResult()
  }

  displayResult() {
    let bmi = this.state.results.bmi
    if (bmi < 5 || bmi > 100) return
    this.bmiResult.innerText = bmi
    this.updateUI({
      boxWelcome: false,
      boxResult: true,
    })

    switch (true) {
      case bmi < 18.5:
        this.spanText.innerText = 'underweight'
        break
      case bmi >= 18.5 && bmi <= 24.9:
        this.spanText.innerText = 'healthy weight'
        break
      case bmi >= 25 && bmi <= 29.99:
        this.spanText.innerText = 'overweight'
        break
      case bmi > 29.99:
        this.spanText.innerText = 'obese'
        break
    }
    if (this.metric) {
      this.spanWeight.innerText = `${this.state.results.lowerWeight.toFixed(1)} kgs - ${this.state.results.higherWeight.toFixed(1)} kgs`
    }

    if (!this.metric) {
      const { weightSt: lowerWeightSt, weightLbs: lowerWeightLbs } =
        this.convertToImperial([0, this.state.results.lowerWeight])
      const { weightSt: higherWeightSt, weightLbs: higherWeightLbs } =
        this.convertToImperial([0, this.state.results.higherWeight])

      this.spanWeight.innerText = `
        ${
          lowerWeightLbs === 0 ?
            Math.floor(lowerWeightSt)`st`
          : `${Math.floor(lowerWeightSt)} st ${Math.round(lowerWeightLbs)} lbs`
        } - ${
          higherWeightLbs === 0 ?
            Math.floor(higherWeightSt)`st`
          : `${Math.floor(higherWeightSt)} st ${Math.round(lowerWeightLbs)} lbs`
        }`
    }
  }
}

new BMICalculator()
