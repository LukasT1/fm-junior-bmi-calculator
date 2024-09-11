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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyx3QkFBd0IsUUFBUSx5QkFBeUI7QUFDOUY7O0FBRUE7QUFDQSxxQ0FBcUMseUNBQXlDLFNBQVMsd0RBQXdELHlDQUF5QyxNQUFNLElBQUksMENBQTBDLFNBQVMseURBQXlELDBDQUEwQyxNQUFNO0FBQzlWO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovLzIwMjQtMDgtMjgtcG8tcmVxdWVzdC1hY2Nlc3MtbGFuZGluZy1wYWdlLy4vc3JjL3NjcmlwdHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIElucHV0RmllbGQge1xuICBjb25zdHJ1Y3RvcihpZCwgbWluLCBtYXgpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgICB0aGlzLm1pbiA9IG1pblxuICAgIHRoaXMubWF4ID0gbWF4XG4gICAgdGhpcy52YWx1ZSA9ICcnXG4gIH1cbiAgZ2V0VmFsdWUoKSB7XG4gICAgY29uc3QgdmFsID0gcGFyc2VJbnQodGhpcy5lbGVtZW50LnZhbHVlKVxuICAgIHJldHVybiBpc05hTih2YWwpID8gMCA6IHZhbFxuICB9XG5cbiAgc2V0VmFsdWUodmFsKSB7XG4gICAgaWYgKHZhbCA8IHRoaXMubWluKSB7XG4gICAgICB2YWwgPSB0aGlzLm1pblxuICAgIH0gZWxzZSBpZiAodmFsID4gdGhpcy5tYXgpIHtcbiAgICAgIHZhbCA9IHRoaXMubWF4XG4gICAgfVxuXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuZWxlbWVudC52YWx1ZSA9ICt2YWxcbiAgfVxuICBpc1ZhbGlkKCkge1xuICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0VmFsdWUoKVxuICAgIHJldHVybiB2YWwgPj0gdGhpcy5taW4gJiYgdmFsIDw9IHRoaXMubWF4XG4gIH1cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5zZXRWYWx1ZSgnJylcbiAgICB0aGlzLmVsZW1lbnQudmFsdWUgPSAnJ1xuICB9XG59XG5cbmNsYXNzIEJNSUNhbGN1bGF0b3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJhZGlvTWV0cmljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21ldHJpYycpXG4gICAgdGhpcy5yYWRpb0ltcGVyaWFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltcGVyaWFsJylcbiAgICB0aGlzLnJhZGlvUGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX3JhZGlvLWdyb3VwJylcblxuICAgIHRoaXMubWV0cmljSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICdpbnB1dFtkYXRhLXVuaXQ9XCJtZXRyaWNcIl0nLFxuICAgIClcbiAgICB0aGlzLmltcGVyaWFsSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICdpbnB1dFtkYXRhLXVuaXQ9XCJpbXBlcmlhbFwiXScsXG4gICAgKVxuXG4gICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dCcpXG4gICAgdGhpcy5pbnB1dE1ldHJpYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1tZXRyaWMnKVxuICAgIHRoaXMuaW5wdXRJbXBlcmlhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1pbXBlcmlhbCcpXG5cbiAgICB0aGlzLnJlc3VsdEJNSSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LWhlYWRpbmcnKVxuICAgIHRoaXMucmVzdWx0VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LXRleHQnKVxuICAgIHRoaXMucmVzdWx0U3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LXNwYW4nKVxuXG4gICAgdGhpcy5ib3hXZWxjb21lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2JveC13ZWxjb21lJylcbiAgICB0aGlzLmJveFJlc3VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0JylcblxuICAgIHRoaXMuYm1pUmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2JveC1yZXN1bHQtaGVhZGluZycpXG4gICAgdGhpcy5zcGFuVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LXNwYW4tdGV4dCcpXG4gICAgdGhpcy5zcGFuV2VpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICcuZm9ybV9fYm94LXJlc3VsdC1zcGFuLXdlaWdodCcsXG4gICAgKVxuICAgIHRoaXMubWV0cmljID0gdHJ1ZVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlucHV0czoge1xuICAgICAgICBoZWlnaHRDbTogbmV3IElucHV0RmllbGQoJ2hlaWdodENtJywgMCwgMjUwKSxcbiAgICAgICAgd2VpZ2h0S2c6IG5ldyBJbnB1dEZpZWxkKCd3ZWlnaHRLZycsIDAsIDUwMCksXG4gICAgICAgIGhlaWdodEZ0OiBuZXcgSW5wdXRGaWVsZCgnaGVpZ2h0RnQnLCAwLCA4KSxcbiAgICAgICAgaGVpZ2h0SW46IG5ldyBJbnB1dEZpZWxkKCdoZWlnaHRJbicsIDAsIDExKSxcbiAgICAgICAgd2VpZ2h0U3Q6IG5ldyBJbnB1dEZpZWxkKCd3ZWlnaHRTdCcsIDAsIDc1KSxcbiAgICAgICAgd2VpZ2h0TGJzOiBuZXcgSW5wdXRGaWVsZCgnd2VpZ2h0TGJzJywgMCwgMTUpLFxuICAgICAgfSxcbiAgICAgIHJlc3VsdHM6IHtcbiAgICAgICAgYm1pTWV0cmljOiAwLFxuICAgICAgICBibWlJbXBlcmlhbDogMCxcbiAgICAgICAgbG93ZXJXZWlnaHQ6IDAsXG4gICAgICAgIGhpZ2hlcldlaWdodDogMCxcbiAgICAgIH0sXG4gICAgfVxuXG4gICAgdGhpcy5yYWRpb1BhcmVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnNlbGVjdFVuaXQuYmluZCh0aGlzKSlcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuc3RhdGUuaW5wdXRzKS5mb3JFYWNoKGlucHV0RmllbGQgPT4ge1xuICAgICAgaW5wdXRGaWVsZC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UoZSkgLy8gUmVzcG9uZCB0byBpbnB1dCBjaGFuZ2VzXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudXBkYXRlVUkoe1xuICAgICAgaW5wdXRNZXRyaWM6IHRydWUsXG4gICAgICBpbnB1dEltcGVyaWFsOiBmYWxzZSxcbiAgICAgIGJveFdlbGNvbWU6IHRydWUsXG4gICAgICBib3hSZXN1bHQ6IGZhbHNlLFxuICAgIH0pXG4gICAgdGhpcy5tZXRyaWMgPSB0cnVlXG4gIH1cblxuICB1cGRhdGVVSShlbGVtZW50cykge1xuICAgIGZvciAobGV0IFtlbGVtZW50LCBzaG93XSBvZiBPYmplY3QuZW50cmllcyhlbGVtZW50cykpIHtcbiAgICAgIHRoaXMuc2hvd0VsZW1lbnQodGhpc1tlbGVtZW50XSwgc2hvdylcbiAgICB9XG4gIH1cblxuICBjbGVhclZhbHVlcygpIHtcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuc3RhdGUuaW5wdXRzKS5mb3JFYWNoKGlucHV0ID0+IGlucHV0LmNsZWFyKCkpXG4gICAgdGhpcy5zdGF0ZS5yZXN1bHRzLmJtaU1ldHJpYyA9IDBcbiAgICB0aGlzLnN0YXRlLnJlc3VsdHMuYm1pSW1wZXJpYWwgPSAwXG5cbiAgICB0aGlzLnVwZGF0ZVVJKHtcbiAgICAgIGJveFdlbGNvbWU6IHRydWUsXG4gICAgICBib3hSZXN1bHQ6IGZhbHNlLFxuICAgIH0pXG4gIH1cblxuICBzaG93RWxlbWVudChlbGVtZW50LCBzaG93KSB7XG4gICAgaWYgKHNob3cpIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIH1cbiAgfVxuXG4gIHNlbGVjdFVuaXQoKSB7XG4gICAgaWYgKHRoaXMucmFkaW9NZXRyaWMuY2hlY2tlZCkge1xuICAgICAgdGhpcy5tZXRyaWMgPSB0cnVlXG4gICAgICB0aGlzLmluaXQoKVxuICAgICAgdGhpcy5jbGVhclZhbHVlcygpXG4gICAgfVxuICAgIGlmICh0aGlzLnJhZGlvSW1wZXJpYWwuY2hlY2tlZCkge1xuICAgICAgdGhpcy5tZXRyaWMgPSBmYWxzZVxuICAgICAgdGhpcy51cGRhdGVVSSh7XG4gICAgICAgIGlucHV0TWV0cmljOiBmYWxzZSxcbiAgICAgICAgaW5wdXRJbXBlcmlhbDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UoZSkge1xuICAgIGNvbnN0IGVsZW1lbnRJZCA9IGUudGFyZ2V0LmlkIC8vIEdldCB0aGUgaW5wdXQncyBJRFxuICAgIGNvbnN0IGlucHV0RmllbGQgPSB0aGlzLnN0YXRlLmlucHV0c1tlbGVtZW50SWRdIC8vIEZpbmQgdGhlIG1hdGNoaW5nIElucHV0RmllbGRcblxuICAgIGlmIChpbnB1dEZpZWxkKSB7XG4gICAgICBpbnB1dEZpZWxkLnNldFZhbHVlKGUudGFyZ2V0LnZhbHVlKSAvLyBVcGRhdGUgdGhlIHN0YXRlXG4gICAgfVxuICAgIHRoaXMuY2FsY0JNSSgpXG4gIH1cblxuICBjYWxjQk1JKCkge1xuICAgIGlmICh0aGlzLm1ldHJpYykge1xuICAgICAgdGhpcy5zdGF0ZS5yZXN1bHRzLmJtaU1ldHJpYyA9IHBhcnNlRmxvYXQoXG4gICAgICAgIChcbiAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0cy53ZWlnaHRLZy5nZXRWYWx1ZSgpIC9cbiAgICAgICAgICBNYXRoLnBvdyh0aGlzLnN0YXRlLmlucHV0cy5oZWlnaHRDbS5nZXRWYWx1ZSgpIC8gMTAwLCAyKVxuICAgICAgICApLnRvRml4ZWQoMSksXG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1ldHJpYykge1xuICAgICAgdGhpcy5zdGF0ZS5yZXN1bHRzLmJtaUltcGVyaWFsID0gcGFyc2VGbG9hdChcbiAgICAgICAgKFxuICAgICAgICAgICgodGhpcy5zdGF0ZS5pbnB1dHMud2VpZ2h0U3QuZ2V0VmFsdWUoKSAqIDE0ICtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRzLndlaWdodExicy5nZXRWYWx1ZSgpKSAqXG4gICAgICAgICAgICA3MDMpIC9cbiAgICAgICAgICBNYXRoLnBvdyhcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRzLmhlaWdodEZ0LmdldFZhbHVlKCkgKiAxMiArXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRzLmhlaWdodEluLmdldFZhbHVlKCksXG4gICAgICAgICAgICAyLFxuICAgICAgICAgIClcbiAgICAgICAgKS50b0ZpeGVkKDEpLFxuICAgICAgKVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKVxuICB9XG4gIGNhbGNIZWFsdGh5V2VpZ2h0KCkge1xuICAgIGxldCBoZWlnaHQgPVxuICAgICAgdGhpcy5zdGF0ZS5oZWlnaHRDbS52YWx1ZSB8fFxuICAgICAgdGhpcy5zdGF0ZS5oZWlnaHRGdC52YWx1ZSAqIDEyICsgdGhpcy5zdGF0ZS5oZWlnaHRJbi52YWx1ZVxuICAgIGNvbnN0IGxvd2VyQk1JID0gMTguNVxuICAgIGNvbnN0IGhpZ2hlckJNSSA9IDI0LjlcblxuICAgIGlmICh0aGlzLm1ldHJpYykge1xuICAgICAgdGhpcy5zdGF0ZS5sb3dlcldlaWdodCA9IHBhcnNlRmxvYXQoXG4gICAgICAgIChsb3dlckJNSSAqIE1hdGgucG93KGhlaWdodCAvIDEwMCwgMikpLnRvRml4ZWQoMSksXG4gICAgICApXG4gICAgICB0aGlzLnN0YXRlLmhpZ2hlcldlaWdodCA9IHBhcnNlRmxvYXQoXG4gICAgICAgIChoaWdoZXJCTUkgKiBNYXRoLnBvdyhoZWlnaHQgLyAxMDAsIDIpKS50b0ZpeGVkKDEpLFxuICAgICAgKVxuICAgIH1cbiAgICBpZiAoIXRoaXMubWV0cmljKSB7XG4gICAgICB0aGlzLnN0YXRlLmxvd2VyV2VpZ2h0ID0gcGFyc2VGbG9hdChcbiAgICAgICAgKGxvd2VyQk1JICogKE1hdGgucG93KGhlaWdodCwgMikgLyA3MDMpKS50b0ZpeGVkKDEpLFxuICAgICAgKVxuICAgICAgdGhpcy5zdGF0ZS5oaWdoZXJXZWlnaHQgPSBwYXJzZUZsb2F0KFxuICAgICAgICAoaGlnaGVyQk1JICogKE1hdGgucG93KGhlaWdodCwgMikgLyA3MDMpKS50b0ZpeGVkKDEpLFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlSZXN1bHQoKSB7XG4gICAgbGV0IGJtaVZhbHVlID0gdGhpcy5zdGF0ZS5ibWkuYm1pTWV0cmljIHx8IHRoaXMuc3RhdGUuYm1pLmJtaUltcGVyaWFsXG4gICAgaWYgKGJtaVZhbHVlIDwgNSB8fCBibWlWYWx1ZSA+IDEwMCkgcmV0dXJuXG4gICAgdGhpcy5ibWlSZXN1bHQuaW5uZXJUZXh0ID0gYm1pVmFsdWVcbiAgICB0aGlzLmJveFdlbGNvbWUuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICB0aGlzLmJveFJlc3VsdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuXG4gICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICBjYXNlIGJtaVZhbHVlIDwgMTguNTpcbiAgICAgICAgdGhpcy5zcGFuVGV4dC5pbm5lclRleHQgPSAndW5kZXJ3ZWlnaHQnXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIGJtaVZhbHVlID49IDE4LjUgJiYgYm1pVmFsdWUgPD0gMjQuOTpcbiAgICAgICAgdGhpcy5zcGFuVGV4dC5pbm5lclRleHQgPSAnaGVhbHRoeSB3ZWlnaHQnXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIGJtaVZhbHVlID49IDI1ICYmIGJtaVZhbHVlIDw9IDI5Ljk6XG4gICAgICAgIHRoaXMuc3BhblRleHQuaW5uZXJUZXh0ID0gJ292ZXJ3ZWlnaHQnXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIGJtaVZhbHVlID4gMzA6XG4gICAgICAgIHRoaXMuc3BhblRleHQuaW5uZXJUZXh0ID0gJ29iZXNlJ1xuICAgICAgICBicmVha1xuICAgIH1cbiAgICBpZiAodGhpcy5tZXRyaWMpIHtcbiAgICAgIHRoaXMuc3BhbldlaWdodC5pbm5lclRleHQgPSBgJHt0aGlzLnN0YXRlLmxvd2VyV2VpZ2h0fSBrZ3MgLSAke3RoaXMuc3RhdGUuaGlnaGVyV2VpZ2h0fSBrZ3NgXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1ldHJpYykge1xuICAgICAgdGhpcy5zcGFuV2VpZ2h0LmlubmVyVGV4dCA9IGAke01hdGguZmxvb3IodGhpcy5zdGF0ZS5sb3dlcldlaWdodCAvIDE0KX0gc3RvbmVzICR7TWF0aC5mbG9vcih0aGlzLnN0YXRlLmxvd2VyV2VpZ2h0ICUgMTQpID09PSAwID8gJycgOiBgJHtNYXRoLmZsb29yKHRoaXMuc3RhdGUubG93ZXJXZWlnaHQgJSAxNCl9IGxic2B9IC0gJHtNYXRoLmZsb29yKHRoaXMuc3RhdGUuaGlnaGVyV2VpZ2h0IC8gMTQpfSBzdG9uZXMgJHtNYXRoLmZsb29yKHRoaXMuc3RhdGUuaGlnaGVyV2VpZ2h0KSAlIDE0ID09PSAwID8gJycgOiBgJHtNYXRoLmZsb29yKHRoaXMuc3RhdGUuaGlnaGVyV2VpZ2h0ICUgMTQpfSBsYnNgfSBgXG4gICAgfVxuICB9XG59XG5cbm5ldyBCTUlDYWxjdWxhdG9yKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==