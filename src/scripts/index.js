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
    return isNaN(val) ? 0 : val
  }

  setValue(val) {
    if (val < this.min) {
      val = this.min
    } else if (val > this.max) {
      val = this.max
    }

    this.value = this.element.value = +val
  }
  isValid() {
    const val = this.getValue()
    return val >= this.min && val <= this.max
  }
  clear() {
    this.setValue('')
    this.element.value = ''
  }
}

class BMICalculator {
  constructor() {
    this.radioMetric = document.getElementById('metric')
    this.radioImperial = document.getElementById('imperial')
    this.radioParent = document.querySelector('.form__radio-group')

    this.metricInputs = document.querySelectorAll(
      'input[data-unit="metric"]',
    )
    this.imperialInputs = document.querySelectorAll(
      'input[data-unit="imperial"]',
    )

    this.input = document.querySelector('.form__input')
    this.inputMetric = document.querySelector('.form__input-metric')
    this.inputImperial = document.querySelector('.form__input-imperial')

    this.resultBMI = document.querySelector('.form__box-result-heading')
    this.resultText = document.querySelector('.form__box-result-text')
    this.resultSpan = document.querySelector('.form__box-result-span')

    this.boxWelcome = document.querySelector('.form__box-welcome')
    this.boxResult = document.querySelector('.form__box-result')

    this.bmiResult = document.querySelector('.form__box-result-heading')
    this.spanText = document.querySelector('.form__box-result-span-text')
    this.spanWeight = document.querySelector(
      '.form__box-result-span-weight',
    )
    this.metric = true

    this.state = {
      inputs: {
        heightCm: new InputField('heightCm', 0, 250),
        weightKg: new InputField('weightKg', 0, 500),
        heightFt: new InputField('heightFt', 0, 8),
        heightIn: new InputField('heightIn', 0, 11),
        weightSt: new InputField('weightSt', 0, 75),
        weightLbs: new InputField('weightLbs', 0, 15),
      },
      results: {
        bmiMetric: 0,
        bmiImperial: 0,
        lowerWeight: 0,
        higherWeight: 0,
      },
    }

    this.radioParent.addEventListener('change', this.selectUnit.bind(this))
    Object.values(this.state.inputs).forEach(inputField => {
      inputField.element.addEventListener('input', e => {
        this.handleInputChange(e) // Respond to input changes
      })
    })
  }

  init() {
    this.updateUI({
      inputMetric: true,
      inputImperial: false,
      boxWelcome: true,
      boxResult: false,
    })
    this.metric = true
  }

  updateUI(elements) {
    for (let [element, show] of Object.entries(elements)) {
      this.showElement(this[element], show)
    }
  }

  clearValues() {
    Object.values(this.state.inputs).forEach(input => input.clear())
    this.state.results.bmiMetric = 0
    this.state.results.bmiImperial = 0

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
    if (this.radioMetric.checked) {
      this.metric = true
      this.init()
      this.clearValues()
    }
    if (this.radioImperial.checked) {
      this.metric = false
      this.updateUI({
        inputMetric: false,
        inputImperial: true,
      })
    }
  }

  handleInputChange(e) {
    const elementId = e.target.id // Get the input's ID
    const inputField = this.state.inputs[elementId] // Find the matching InputField

    if (inputField) {
      inputField.setValue(e.target.value) // Update the state
    }
    this.calcBMI()
  }

  calcBMI() {
    if (this.metric) {
      this.state.results.bmiMetric = parseFloat(
        (
          this.state.inputs.weightKg.getValue() /
          Math.pow(this.state.inputs.heightCm.getValue() / 100, 2)
        ).toFixed(1),
      )
    }

    if (!this.metric) {
      this.state.results.bmiImperial = parseFloat(
        (
          ((this.state.inputs.weightSt.getValue() * 14 +
            this.state.inputs.weightLbs.getValue()) *
            703) /
          Math.pow(
            this.state.inputs.heightFt.getValue() * 12 +
              this.state.inputs.heightIn.getValue(),
            2,
          )
        ).toFixed(1),
      )
    }
    console.log(this.state)
  }
  calcHealthyWeight() {
    let height =
      this.state.heightCm.value ||
      this.state.heightFt.value * 12 + this.state.heightIn.value
    const lowerBMI = 18.5
    const higherBMI = 24.9

    if (this.metric) {
      this.state.lowerWeight = parseFloat(
        (lowerBMI * Math.pow(height / 100, 2)).toFixed(1),
      )
      this.state.higherWeight = parseFloat(
        (higherBMI * Math.pow(height / 100, 2)).toFixed(1),
      )
    }
    if (!this.metric) {
      this.state.lowerWeight = parseFloat(
        (lowerBMI * (Math.pow(height, 2) / 703)).toFixed(1),
      )
      this.state.higherWeight = parseFloat(
        (higherBMI * (Math.pow(height, 2) / 703)).toFixed(1),
      )
    }
  }

  displayResult() {
    let bmiValue = this.state.bmi.bmiMetric || this.state.bmi.bmiImperial
    if (bmiValue < 5 || bmiValue > 100) return
    this.bmiResult.innerText = bmiValue
    this.boxWelcome.classList.add('hidden')
    this.boxResult.classList.remove('hidden')

    switch (true) {
      case bmiValue < 18.5:
        this.spanText.innerText = 'underweight'
        break
      case bmiValue >= 18.5 && bmiValue <= 24.9:
        this.spanText.innerText = 'healthy weight'
        break
      case bmiValue >= 25 && bmiValue <= 29.9:
        this.spanText.innerText = 'overweight'
        break
      case bmiValue > 30:
        this.spanText.innerText = 'obese'
        break
    }
    if (this.metric) {
      this.spanWeight.innerText = `${this.state.lowerWeight} kgs - ${this.state.higherWeight} kgs`
    }

    if (!this.metric) {
      this.spanWeight.innerText = `${Math.floor(this.state.lowerWeight / 14)} stones ${Math.floor(this.state.lowerWeight % 14) === 0 ? '' : `${Math.floor(this.state.lowerWeight % 14)} lbs`} - ${Math.floor(this.state.higherWeight / 14)} stones ${Math.floor(this.state.higherWeight) % 14 === 0 ? '' : `${Math.floor(this.state.higherWeight % 14)} lbs`} `
    }
  }
}

new BMICalculator()
