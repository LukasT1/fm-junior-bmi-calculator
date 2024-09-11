/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/


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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQywyQ0FBMkMsUUFBUSw0Q0FBNEM7QUFDcEk7O0FBRUE7QUFDQSxjQUFjLHFEQUFxRDtBQUNuRTtBQUNBLGNBQWMsdURBQXVEO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSwyQkFBMkIsS0FBSyw0QkFBNEI7QUFDM0UsVUFBVTtBQUNWO0FBQ0E7QUFDQSxlQUFlLDRCQUE0QixLQUFLLDRCQUE0QjtBQUM1RSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMjAyNC0wOC0yOC1wby1yZXF1ZXN0LWFjY2Vzcy1sYW5kaW5nLXBhZ2UvLi9zcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY2xhc3MgSW5wdXRGaWVsZCB7XG4gIGNvbnN0cnVjdG9yKGlkLCBtaW4sIG1heCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICAgIHRoaXMubWluID0gbWluXG4gICAgdGhpcy5tYXggPSBtYXhcbiAgICB0aGlzLnZhbHVlID0gJydcbiAgfVxuICBnZXRWYWx1ZSgpIHtcbiAgICBjb25zdCB2YWwgPSBwYXJzZUludCh0aGlzLmVsZW1lbnQudmFsdWUpXG4gICAgcmV0dXJuIGlzTmFOKHZhbCkgPyAnJyA6IHZhbFxuICB9XG5cbiAgc2V0VmFsdWUodmFsKSB7XG4gICAgaWYgKHZhbCA8IHRoaXMubWluKSB7XG4gICAgICB2YWwgPSB0aGlzLm1pblxuICAgIH0gZWxzZSBpZiAodmFsID4gdGhpcy5tYXgpIHtcbiAgICAgIHZhbCA9IHRoaXMubWF4XG4gICAgfVxuXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuZWxlbWVudC52YWx1ZSA9IHZhbFxuICB9XG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc2V0VmFsdWUoJycpXG4gIH1cbn1cblxuY2xhc3MgQk1JQ2FsY3VsYXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmFkaW9NZXRyaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWV0cmljJylcbiAgICB0aGlzLnJhZGlvSW1wZXJpYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1wZXJpYWwnKVxuICAgIHRoaXMucmFkaW9QYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fcmFkaW8tZ3JvdXAnKVxuXG4gICAgdGhpcy5pbnB1dE1ldHJpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1tZXRyaWMnKVxuICAgIHRoaXMuaW5wdXRJbXBlcmlhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1pbXBlcmlhbCcpXG5cbiAgICB0aGlzLmJveFdlbGNvbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fYm94LXdlbGNvbWUnKVxuICAgIHRoaXMuYm94UmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2JveC1yZXN1bHQnKVxuXG4gICAgdGhpcy5yZXNldEljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faGVhZGluZy1pY29uJylcblxuICAgIHRoaXMuYm1pUmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2JveC1yZXN1bHQtaGVhZGluZycpXG4gICAgdGhpcy5zcGFuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LXNwYW4tdGV4dCcpXG4gICAgdGhpcy5zcGFuV2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICcuZm9ybV9fYm94LXJlc3VsdC1zcGFuLXdlaWdodCcsXG4gICAgKVxuICAgIHRoaXMubWV0cmljID0gdHJ1ZVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1ldHJpYzoge1xuICAgICAgICBoZWlnaHRDbTogbmV3IElucHV0RmllbGQoJ2hlaWdodENtJywgMCwgMjUwKSxcbiAgICAgICAgd2VpZ2h0S2c6IG5ldyBJbnB1dEZpZWxkKCd3ZWlnaHRLZycsIDAsIDUwMCksXG4gICAgICB9LFxuICAgICAgaW1wZXJpYWw6IHtcbiAgICAgICAgaGVpZ2h0RnQ6IG5ldyBJbnB1dEZpZWxkKCdoZWlnaHRGdCcsIDAsIDgpLFxuICAgICAgICBoZWlnaHRJbjogbmV3IElucHV0RmllbGQoJ2hlaWdodEluJywgMCwgMTEpLFxuICAgICAgICB3ZWlnaHRTdDogbmV3IElucHV0RmllbGQoJ3dlaWdodFN0JywgMCwgNzUpLFxuICAgICAgICB3ZWlnaHRMYnM6IG5ldyBJbnB1dEZpZWxkKCd3ZWlnaHRMYnMnLCAwLCAxMyksXG4gICAgICB9LFxuICAgICAgcmVzdWx0czoge1xuICAgICAgICBibWk6IDAsXG4gICAgICAgIGxvd2VyV2VpZ2h0OiAwLFxuICAgICAgICBoaWdoZXJXZWlnaHQ6IDAsXG4gICAgICB9LFxuICAgIH1cblxuICAgIHRoaXMuaW5wdXRMaXN0ZW5lcih0aGlzLnN0YXRlLmltcGVyaWFsKVxuICAgIHRoaXMuaW5wdXRMaXN0ZW5lcih0aGlzLnN0YXRlLm1ldHJpYylcbiAgICB0aGlzLnJhZGlvUGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMuc2VsZWN0VW5pdC5iaW5kKHRoaXMpKVxuICAgIHRoaXMucmVzZXRJY29uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGVhclZhbHVlcy5iaW5kKHRoaXMpKVxuICB9XG5cbiAgdXBkYXRlVUkoZWxlbWVudHMpIHtcbiAgICBmb3IgKGxldCBbZWxlbWVudCwgc2hvd10gb2YgT2JqZWN0LmVudHJpZXMoZWxlbWVudHMpKSB7XG4gICAgICB0aGlzLnNob3dFbGVtZW50KHRoaXNbZWxlbWVudF0sIHNob3cpXG4gICAgfVxuICB9XG5cbiAgY2xlYXJWYWx1ZXMoKSB7XG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLnN0YXRlLm1ldHJpYykuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5jbGVhcigpKVxuICAgIE9iamVjdC52YWx1ZXModGhpcy5zdGF0ZS5pbXBlcmlhbCkuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5jbGVhcigpKVxuICAgIHRoaXMuc3RhdGUucmVzdWx0cy5ibWkgPSAwXG5cbiAgICB0aGlzLnVwZGF0ZVVJKHtcbiAgICAgIGJveFdlbGNvbWU6IHRydWUsXG4gICAgICBib3hSZXN1bHQ6IGZhbHNlLFxuICAgIH0pXG4gIH1cblxuICBzaG93RWxlbWVudChlbGVtZW50LCBzaG93KSB7XG4gICAgaWYgKHNob3cpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdFVuaXQoKSB7XG4gICAgdGhpcy5tZXRyaWMgPSAhdGhpcy5tZXRyaWNcbiAgICBjb25zb2xlLmxvZyh0aGlzLm1ldHJpYylcbiAgICB0aGlzLnVwZGF0ZVVJKHtcbiAgICAgIGlucHV0TWV0cmljOiB0aGlzLm1ldHJpYyxcbiAgICAgIGlucHV0SW1wZXJpYWw6ICF0aGlzLm1ldHJpYyxcbiAgICB9KVxuICAgIHRoaXMuZGlzcGxheVJlc3VsdCgpXG4gICAgLy8gdGhpcy5jbGVhclZhbHVlcygpXG4gIH1cblxuICBpbnB1dExpc3RlbmVyKGlucHV0KSB7XG4gICAgT2JqZWN0LnZhbHVlcyhpbnB1dCkuZm9yRWFjaChpbnB1dEZpZWxkID0+IHtcbiAgICAgIGlucHV0RmllbGQuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGUgPT4ge1xuICAgICAgICB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlKGUpIC8vIFJlc3BvbmQgdG8gaW5wdXQgY2hhbmdlc1xuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UoZSkge1xuICAgIGNvbnN0IGVsZW1lbnRJZCA9IGUudGFyZ2V0LmlkIC8vIEdldCB0aGUgaW5wdXQncyBJRFxuICAgIGNvbnN0IGlucHV0RmllbGQgPVxuICAgICAgdGhpcy5zdGF0ZS5tZXRyaWNbZWxlbWVudElkXSB8fCB0aGlzLnN0YXRlLmltcGVyaWFsW2VsZW1lbnRJZF0gLy8gRmluZCB0aGUgbWF0Y2hpbmcgSW5wdXRGaWVsZFxuICAgIGlmIChpbnB1dEZpZWxkKSB7XG4gICAgICBpbnB1dEZpZWxkLnNldFZhbHVlKGUudGFyZ2V0LnZhbHVlKSAvLyBVcGRhdGUgdGhlIHN0YXRlXG4gICAgfVxuICAgIHRoaXMuY29udmVydFVuaXRzKClcbiAgICB0aGlzLmNhbGNCTUkoKVxuICB9XG5cbiAgY29udmVydFRvSW1wZXJpYWwoW2hlaWdodCwgd2VpZ2h0XSkge1xuICAgIGNvbnNvbGUubG9nKGhlaWdodCwgd2VpZ2h0KVxuICAgIGNvbnN0IHRvdGFsU3RvbmVzID0gd2VpZ2h0ICogMC4xNTc0N1xuICAgIGNvbnN0IHdlaWdodFN0ID0gTWF0aC50cnVuYyh0b3RhbFN0b25lcylcbiAgICBjb25zdCB3ZWlnaHRMYnMgPSBNYXRoLnJvdW5kKCh0b3RhbFN0b25lcyAtIHdlaWdodFN0KSAqIDE0KVxuXG4gICAgY29uc3QgdG90YWxJbmNoZXMgPSBoZWlnaHQgKiAwLjM5MzcwMVxuICAgIGNvbnN0IGhlaWdodEZ0ID0gTWF0aC50cnVuYyh0b3RhbEluY2hlcyAvIDEyKVxuICAgIGNvbnN0IGhlaWdodEluID0gTWF0aC5yb3VuZCh0b3RhbEluY2hlcyAlIDEyKVxuXG4gICAgcmV0dXJuIHsgaGVpZ2h0RnQsIGhlaWdodEluLCB3ZWlnaHRTdCwgd2VpZ2h0TGJzIH1cbiAgfVxuXG4gIGNvbnZlcnRUb01ldHJpYyhbZmVldHMsIGluY2hlcywgc3RvbmVzLCBsYnNdKSB7XG4gICAgY29uc29sZS5sb2coZmVldHMsIGluY2hlcywgc3RvbmVzLCBsYnMpXG4gICAgY29uc3Qgd2VpZ2h0S2cgPSBNYXRoLnJvdW5kKHN0b25lcyAqIDYuMzUwMjkgKyBsYnMgKiAwLjQ1MzU5MilcbiAgICBjb25zdCBoZWlnaHRDbSA9IE1hdGgucm91bmQoKGZlZXRzICogMTIgKyBpbmNoZXMpICogMi41NClcbiAgICByZXR1cm4geyBoZWlnaHRDbSwgd2VpZ2h0S2cgfVxuICB9XG5cbiAgY29udmVydFVuaXRzKCkge1xuICAgIGNvbnN0IGN1cnJlbnRVbml0ID0gdGhpcy5tZXRyaWMgPyAnbWV0cmljJyA6ICdpbXBlcmlhbCdcbiAgICBjb25zdCBvcHBvc2l0ZVVuaXQgPSB0aGlzLm1ldHJpYyA/ICdpbXBlcmlhbCcgOiAnbWV0cmljJ1xuXG4gICAgY29uc3QgY3VycmVudFZhbHVlcyA9IE9iamVjdC52YWx1ZXModGhpcy5zdGF0ZVtjdXJyZW50VW5pdF0pLm1hcChlbCA9PlxuICAgICAgZWwuZ2V0VmFsdWUoKSxcbiAgICApXG5cbiAgICBjb25zdCBjb252ZXJ0ZWQgPVxuICAgICAgdGhpcy5tZXRyaWMgP1xuICAgICAgICB0aGlzLmNvbnZlcnRUb0ltcGVyaWFsKGN1cnJlbnRWYWx1ZXMpXG4gICAgICA6IHRoaXMuY29udmVydFRvTWV0cmljKGN1cnJlbnRWYWx1ZXMpXG5cbiAgICBPYmplY3Qua2V5cyhjb252ZXJ0ZWQpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlW29wcG9zaXRlVW5pdF0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICB0aGlzLnN0YXRlW29wcG9zaXRlVW5pdF1ba2V5XS5zZXRWYWx1ZShjb252ZXJ0ZWRba2V5XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpXG4gIH1cblxuICBjYWxjQk1JKCkge1xuICAgIGNvbnN0IHdlaWdodCA9IHRoaXMuc3RhdGUubWV0cmljLndlaWdodEtnLmdldFZhbHVlKClcbiAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnN0YXRlLm1ldHJpYy5oZWlnaHRDbS5nZXRWYWx1ZSgpXG5cbiAgICBpZiAoaGVpZ2h0ID4gMCAmJiB3ZWlnaHQgPiAwKSB7XG4gICAgICB0aGlzLnN0YXRlLnJlc3VsdHMuYm1pID1cbiAgICAgICAgTWF0aC5yb3VuZCgod2VpZ2h0IC8gTWF0aC5wb3coaGVpZ2h0IC8gMTAwLCAyKSkgKiAxMCkgLyAxMFxuICAgICAgdGhpcy5jYWxjSGVhbHRoeVdlaWdodCgpXG4gICAgfVxuICB9XG5cbiAgY2FsY0hlYWx0aHlXZWlnaHQoKSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5zdGF0ZS5tZXRyaWMuaGVpZ2h0Q20uZ2V0VmFsdWUoKVxuICAgIGNvbnN0IGxvd2VyQk1JID0gMTguNVxuICAgIGNvbnN0IGhpZ2hlckJNSSA9IDI0LjlcblxuICAgIHRoaXMuc3RhdGUucmVzdWx0cy5sb3dlcldlaWdodCA9IGxvd2VyQk1JICogTWF0aC5wb3coaGVpZ2h0IC8gMTAwLCAyKVxuICAgIHRoaXMuc3RhdGUucmVzdWx0cy5oaWdoZXJXZWlnaHQgPSBoaWdoZXJCTUkgKiBNYXRoLnBvdyhoZWlnaHQgLyAxMDAsIDIpXG4gICAgdGhpcy5kaXNwbGF5UmVzdWx0KClcbiAgfVxuXG4gIGRpc3BsYXlSZXN1bHQoKSB7XG4gICAgbGV0IGJtaSA9IHRoaXMuc3RhdGUucmVzdWx0cy5ibWlcbiAgICBpZiAoYm1pIDwgNSB8fCBibWkgPiAxMDApIHJldHVyblxuICAgIHRoaXMuYm1pUmVzdWx0LmlubmVyVGV4dCA9IGJtaVxuICAgIHRoaXMudXBkYXRlVUkoe1xuICAgICAgYm94V2VsY29tZTogZmFsc2UsXG4gICAgICBib3hSZXN1bHQ6IHRydWUsXG4gICAgfSlcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgY2FzZSBibWkgPCAxOC41OlxuICAgICAgICB0aGlzLnNwYW5UZXh0LmlubmVyVGV4dCA9ICd1bmRlcndlaWdodCdcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgYm1pID49IDE4LjUgJiYgYm1pIDw9IDI0Ljk6XG4gICAgICAgIHRoaXMuc3BhblRleHQuaW5uZXJUZXh0ID0gJ2hlYWx0aHkgd2VpZ2h0J1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSBibWkgPj0gMjUgJiYgYm1pIDw9IDI5Ljk5OlxuICAgICAgICB0aGlzLnNwYW5UZXh0LmlubmVyVGV4dCA9ICdvdmVyd2VpZ2h0J1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSBibWkgPiAyOS45OTpcbiAgICAgICAgdGhpcy5zcGFuVGV4dC5pbm5lclRleHQgPSAnb2Jlc2UnXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmICh0aGlzLm1ldHJpYykge1xuICAgICAgdGhpcy5zcGFuV2VpZ2h0LmlubmVyVGV4dCA9IGAke3RoaXMuc3RhdGUucmVzdWx0cy5sb3dlcldlaWdodC50b0ZpeGVkKDEpfSBrZ3MgLSAke3RoaXMuc3RhdGUucmVzdWx0cy5oaWdoZXJXZWlnaHQudG9GaXhlZCgxKX0ga2dzYFxuICAgIH1cblxuICAgIGlmICghdGhpcy5tZXRyaWMpIHtcbiAgICAgIGNvbnN0IHsgd2VpZ2h0U3Q6IGxvd2VyV2VpZ2h0U3QsIHdlaWdodExiczogbG93ZXJXZWlnaHRMYnMgfSA9XG4gICAgICAgIHRoaXMuY29udmVydFRvSW1wZXJpYWwoWzAsIHRoaXMuc3RhdGUucmVzdWx0cy5sb3dlcldlaWdodF0pXG4gICAgICBjb25zdCB7IHdlaWdodFN0OiBoaWdoZXJXZWlnaHRTdCwgd2VpZ2h0TGJzOiBoaWdoZXJXZWlnaHRMYnMgfSA9XG4gICAgICAgIHRoaXMuY29udmVydFRvSW1wZXJpYWwoWzAsIHRoaXMuc3RhdGUucmVzdWx0cy5oaWdoZXJXZWlnaHRdKVxuXG4gICAgICB0aGlzLnNwYW5XZWlnaHQuaW5uZXJUZXh0ID0gYFxuICAgICAgICAke1xuICAgICAgICAgIGxvd2VyV2VpZ2h0TGJzID09PSAwID9cbiAgICAgICAgICAgIE1hdGguZmxvb3IobG93ZXJXZWlnaHRTdClgc3RgXG4gICAgICAgICAgOiBgJHtNYXRoLmZsb29yKGxvd2VyV2VpZ2h0U3QpfSBzdCAke01hdGgucm91bmQobG93ZXJXZWlnaHRMYnMpfSBsYnNgXG4gICAgICAgIH0gLSAke1xuICAgICAgICAgIGhpZ2hlcldlaWdodExicyA9PT0gMCA/XG4gICAgICAgICAgICBNYXRoLmZsb29yKGhpZ2hlcldlaWdodFN0KWBzdGBcbiAgICAgICAgICA6IGAke01hdGguZmxvb3IoaGlnaGVyV2VpZ2h0U3QpfSBzdCAke01hdGgucm91bmQobG93ZXJXZWlnaHRMYnMpfSBsYnNgXG4gICAgICAgIH1gXG4gICAgfVxuICB9XG59XG5cbm5ldyBCTUlDYWxjdWxhdG9yKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==