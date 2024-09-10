/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGNBQWMsNEJBQTRCO0FBQzFDLGNBQWMsNEJBQTRCO0FBQzFDLGNBQWMsMEJBQTBCO0FBQ3hDLGNBQWMsMkJBQTJCO0FBQ3pDLGNBQWMsMkJBQTJCO0FBQ3pDLGVBQWUsMkJBQTJCO0FBQzFDLFNBQVMsOEJBQThCO0FBQ3ZDLGlCQUFpQixVQUFVO0FBQzNCLGtCQUFrQixVQUFVO0FBQzVCOztBQUVBLDBCQUEwQixVQUFVOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG9CQUFvQixRQUFRLHFCQUFxQjtBQUMvRTs7QUFFQTtBQUNBLDhCQUE4QixxQ0FBcUMsU0FBUyxvREFBb0QscUNBQXFDLE1BQU0sSUFBSSxzQ0FBc0MsU0FBUyxxREFBcUQsc0NBQXNDLE1BQU07QUFDL1Q7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMjAyNC0wOC0yOC1wby1yZXF1ZXN0LWFjY2Vzcy1sYW5kaW5nLXBhZ2UvLi9zcmMvc2NyaXB0cy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzZWxlY3RvcnNcbmNvbnN0IHJhZGlvTWV0cmljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21ldHJpYycpXG5jb25zdCByYWRpb0ltcGVyaWFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltcGVyaWFsJylcbmNvbnN0IHJhZGlvUGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX3JhZGlvLWdyb3VwJylcblxuY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQnKVxuY29uc3QgaW5wdXRNZXRyaWMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtbWV0cmljJylcbmNvbnN0IGlucHV0SW1wZXJpYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtaW1wZXJpYWwnKVxuXG5jb25zdCByZXN1bHRCTUkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fYm94LXJlc3VsdC1oZWFkaW5nJylcbmNvbnN0IHJlc3VsdFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fYm94LXJlc3VsdC10ZXh0JylcbmNvbnN0IHJlc3VsdFNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fYm94LXJlc3VsdC1zcGFuJylcblxuY29uc3QgYm94V2VsY29tZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtd2VsY29tZScpXG5jb25zdCBib3hSZXN1bHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fYm94LXJlc3VsdCcpXG5cbmNvbnN0IGJtaVJlc3VsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LWhlYWRpbmcnKVxuY29uc3Qgc3BhblRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fYm94LXJlc3VsdC1zcGFuLXRleHQnKVxuY29uc3Qgc3BhbldlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19ib3gtcmVzdWx0LXNwYW4td2VpZ2h0JylcblxubGV0IG1ldHJpYyA9IHRydWVcblxuY29uc3QgdmFsdWVzID0ge1xuICBoZWlnaHRDbTogeyBtaW46IDAsIG1heDogMjUwLCB2YWx1ZTogMCB9LFxuICB3ZWlnaHRLZzogeyBtaW46IDAsIG1heDogMzUwLCB2YWx1ZTogMCB9LFxuICBoZWlnaHRGdDogeyBtaW46IDAsIG1heDogOCwgdmFsdWU6IDAgfSxcbiAgaGVpZ2h0SW46IHsgbWluOiAwLCBtYXg6IDExLCB2YWx1ZTogMCB9LFxuICB3ZWlnaHRTdDogeyBtaW46IDAsIG1heDogNzUsIHZhbHVlOiAwIH0sXG4gIHdlaWdodExiczogeyBtaW46IDAsIG1heDogMTUsIHZhbHVlOiAwIH0sXG4gIGJtaTogeyBibWlNZXRyaWM6IDAsIGJtaUltcGVyaWFsOiAwIH0sXG4gIGxvd2VyV2VpZ2h0OiB7IHZhbHVlOiAwIH0sXG4gIGhpZ2hlcldlaWdodDogeyB2YWx1ZTogMCB9LFxufVxuXG5jb25zdCBpc1ZhbGlkID0gKHZhbHVlLCB7IG1pbiwgbWF4IH0pID0+IHZhbHVlID49IG1pbiAmJiB2YWx1ZSA8PSBtYXhcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgaW5wdXRJbXBlcmlhbC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICBpbnB1dE1ldHJpYy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuICBib3hXZWxjb21lLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG4gIGJveFJlc3VsdC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICBtZXRyaWMgPSB0cnVlXG59XG5cbmZ1bmN0aW9uIGNsZWFyVmFsdWVzKCkge1xuICBPYmplY3QudmFsdWVzKHZhbHVlcykuZm9yRWFjaChlbCA9PiAoZWwudmFsdWUgPSAnJykpIC8vIFJlc2V0cyB2YWx1ZXMgaW4gb2JqZWN0IHZhbHVlcyB3aXRoIGVtbXB0eSBzdHJpbmdcbiAgT2JqZWN0LmtleXModmFsdWVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKGtleSA9PT0gJ2JtaScgfHwga2V5ID09PSAnbG93ZXJXZWlnaHQnIHx8IGtleSA9PT0gJ2hpZ2hlcldlaWdodCcpXG4gICAgICByZXR1cm5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChrZXkpLnZhbHVlID0gdmFsdWVzW2tleV0udmFsdWUgLy8gU2V0cyB0aGUgdmFsdWVzIGluIERPTSBpbnB1dHMsIGV4Y2VwdCB0aGUgYm1pIHdoaWNoIGRvZXNudCBoYXZlIGNvcnJlc3BvbmRpbmcgaW5wdXQgZmllZGxcbiAgfSlcbiAgdmFsdWVzLmJtaS5ibWlNZXRyaWMgPSAwXG4gIHZhbHVlcy5ibWkuYm1pSW1wZXJpYWwgPSAwXG4gIGJveFdlbGNvbWUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgYm94UmVzdWx0LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG59XG5cbmluaXQoKVxuY2xlYXJWYWx1ZXMoKVxuXG5jb25zdCBzZWxlY3RVbml0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAocmFkaW9NZXRyaWMuY2hlY2tlZCkge1xuICAgIGluaXQoKVxuICAgIGNsZWFyVmFsdWVzKClcbiAgICBtZXRyaWMgPSB0cnVlXG4gIH1cbiAgaWYgKHJhZGlvSW1wZXJpYWwuY2hlY2tlZCkge1xuICAgIGlucHV0SW1wZXJpYWwuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcbiAgICBpbnB1dE1ldHJpYy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIGNsZWFyVmFsdWVzKClcbiAgICBtZXRyaWMgPSBmYWxzZVxuICB9XG59XG5cbmNvbnN0IGdldFZhbHVlID0gZnVuY3Rpb24gKGUpIHtcbiAgbGV0IGVsZW1lbnRJZCA9IGUudGFyZ2V0LmlkXG4gIGxldCBlbGVtZW50VmFsdWUgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpLnZhbHVlKVxuICBpZiAoZWxlbWVudFZhbHVlID09PSB1bmRlZmluZWQgfHwgaXNOYU4oZWxlbWVudFZhbHVlKSkgcmV0dXJuXG5cbiAgaWYgKCFpc1ZhbGlkKGVsZW1lbnRWYWx1ZSwgdmFsdWVzW2VsZW1lbnRJZF0pKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKS52YWx1ZSA9IHZhbHVlc1tlbGVtZW50SWRdLm1heFxuICAgIHZhbHVlc1tlbGVtZW50SWRdLnZhbHVlID0gdmFsdWVzW2VsZW1lbnRJZF0ubWF4XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFsdWVzW2VsZW1lbnRJZF0udmFsdWUgPSBlbGVtZW50VmFsdWVcbiAgY2FsY0JNSSgpXG59XG5cbmNvbnN0IGNhbGNCTUkgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh2YWx1ZXMuaGVpZ2h0Q20udmFsdWUgfHwgdmFsdWVzLndlaWdodEtnLnZhbHVlKSB7XG4gICAgdmFsdWVzLmJtaS5ibWlNZXRyaWMgPSBwYXJzZUZsb2F0KFxuICAgICAgKFxuICAgICAgICB2YWx1ZXMud2VpZ2h0S2cudmFsdWUgLyBNYXRoLnBvdyh2YWx1ZXMuaGVpZ2h0Q20udmFsdWUgLyAxMDAsIDIpXG4gICAgICApLnRvRml4ZWQoMSksXG4gICAgKVxuICB9XG5cbiAgaWYgKHZhbHVlcy5oZWlnaHRGdC52YWx1ZSB8fCB2YWx1ZXMud2VpZ2h0U3QudmFsdWUpIHtcbiAgICB2YWx1ZXMuYm1pLmJtaUltcGVyaWFsID0gcGFyc2VGbG9hdChcbiAgICAgIChcbiAgICAgICAgKCh2YWx1ZXMud2VpZ2h0U3QudmFsdWUgKiAxNCArIHZhbHVlcy53ZWlnaHRMYnMudmFsdWUpICogNzAzKSAvXG4gICAgICAgIE1hdGgucG93KHZhbHVlcy5oZWlnaHRGdC52YWx1ZSAqIDEyICsgdmFsdWVzLmhlaWdodEluLnZhbHVlLCAyKVxuICAgICAgKS50b0ZpeGVkKDEpLFxuICAgIClcbiAgfVxuXG4gIC8vIEVuc3VyZXMgdGhlIGRpc3BsYXkgZmlyZXMgYWZ0ZXIgYWxsIHRoZSBkYXRhIGlucHV0ZWRcbiAgaWYgKHZhbHVlcy5ibWkuYm1pTWV0cmljID4gNSB8fCB2YWx1ZXMuYm1pLmJtaUltcGVyaWFsID4gNSkge1xuICAgIGNhbGNIZWFsdGh5V2VpZ2h0KClcbiAgICBkaXNwbGF5UmVzdWx0KClcbiAgfVxufVxuXG5jb25zdCBjYWxjSGVhbHRoeVdlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgbGV0IGhlaWdodCA9XG4gICAgdmFsdWVzLmhlaWdodENtLnZhbHVlIHx8XG4gICAgdmFsdWVzLmhlaWdodEZ0LnZhbHVlICogMTIgKyB2YWx1ZXMuaGVpZ2h0SW4udmFsdWVcbiAgbG93ZXJCTUkgPSAxOC41XG4gIGhpZ2hlckJNSSA9IDI0LjlcblxuICBpZiAobWV0cmljKSB7XG4gICAgdmFsdWVzLmxvd2VyV2VpZ2h0ID0gcGFyc2VGbG9hdChcbiAgICAgIChsb3dlckJNSSAqIE1hdGgucG93KGhlaWdodCAvIDEwMCwgMikpLnRvRml4ZWQoMSksXG4gICAgKVxuICAgIHZhbHVlcy5oaWdoZXJXZWlnaHQgPSBwYXJzZUZsb2F0KFxuICAgICAgKGhpZ2hlckJNSSAqIE1hdGgucG93KGhlaWdodCAvIDEwMCwgMikpLnRvRml4ZWQoMSksXG4gICAgKVxuICB9XG4gIGlmICghbWV0cmljKSB7XG4gICAgdmFsdWVzLmxvd2VyV2VpZ2h0ID0gcGFyc2VGbG9hdChcbiAgICAgIChsb3dlckJNSSAqIChNYXRoLnBvdyhoZWlnaHQsIDIpIC8gNzAzKSkudG9GaXhlZCgxKSxcbiAgICApXG4gICAgdmFsdWVzLmhpZ2hlcldlaWdodCA9IHBhcnNlRmxvYXQoXG4gICAgICAoaGlnaGVyQk1JICogKE1hdGgucG93KGhlaWdodCwgMikgLyA3MDMpKS50b0ZpeGVkKDEpLFxuICAgIClcbiAgfVxuICBjb25zb2xlLmxvZyh2YWx1ZXMpXG59XG5cbmNvbnN0IGRpc3BsYXlSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBibWlWYWx1ZSA9IHZhbHVlcy5ibWkuYm1pTWV0cmljIHx8IHZhbHVlcy5ibWkuYm1pSW1wZXJpYWxcbiAgaWYgKGJtaVZhbHVlIDwgNSB8fCBibWlWYWx1ZSA+IDEwMCkgcmV0dXJuXG4gIHZhbHVlcy5oZWlnaHRDbS52YWx1ZSB8fFxuICAgIHZhbHVlcy5oZWlnaHRGdC52YWx1ZSAqIDEyICsgdmFsdWVzLmhlaWdodEluLnZhbHVlXG4gIGJtaVJlc3VsdC5pbm5lclRleHQgPSBibWlWYWx1ZVxuICBib3hXZWxjb21lLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gIGJveFJlc3VsdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuXG4gIHN3aXRjaCAodHJ1ZSkge1xuICAgIGNhc2UgYm1pVmFsdWUgPCAxOC41OlxuICAgICAgc3BhblRleHQuaW5uZXJUZXh0ID0gJ3VuZGVyd2VpZ2h0J1xuICAgICAgYnJlYWtcbiAgICBjYXNlIGJtaVZhbHVlID49IDE4LjUgJiYgYm1pVmFsdWUgPD0gMjQuOTpcbiAgICAgIHNwYW5UZXh0LmlubmVyVGV4dCA9ICdoZWFsdGh5IHdlaWdodCdcbiAgICAgIGJyZWFrXG4gICAgY2FzZSBibWlWYWx1ZSA+PSAyNSAmJiBibWlWYWx1ZSA8PSAyOS45OlxuICAgICAgc3BhblRleHQuaW5uZXJUZXh0ID0gJ292ZXJ3ZWlnaHQnXG4gICAgICBicmVha1xuICAgIGNhc2UgYm1pVmFsdWUgPiAzMDpcbiAgICAgIHNwYW5UZXh0LmlubmVyVGV4dCA9ICdvYmVzZSdcbiAgICAgIGJyZWFrXG4gIH1cbiAgaWYgKG1ldHJpYykge1xuICAgIHNwYW5XZWlnaHQuaW5uZXJUZXh0ID0gYCR7dmFsdWVzLmxvd2VyV2VpZ2h0fSBrZ3MgLSAke3ZhbHVlcy5oaWdoZXJXZWlnaHR9IGtnc2BcbiAgfVxuXG4gIGlmICghbWV0cmljKSB7XG4gICAgc3BhbldlaWdodC5pbm5lclRleHQgPSBgJHtNYXRoLmZsb29yKHZhbHVlcy5sb3dlcldlaWdodCAvIDE0KX0gc3RvbmVzICR7TWF0aC5mbG9vcih2YWx1ZXMubG93ZXJXZWlnaHQgJSAxNCkgPT09IDAgPyAnJyA6IGAke01hdGguZmxvb3IodmFsdWVzLmxvd2VyV2VpZ2h0ICUgMTQpfSBsYnNgfSAtICR7TWF0aC5mbG9vcih2YWx1ZXMuaGlnaGVyV2VpZ2h0IC8gMTQpfSBzdG9uZXMgJHtNYXRoLmZsb29yKHZhbHVlcy5oaWdoZXJXZWlnaHQpICUgMTQgPT09IDAgPyAnJyA6IGAke01hdGguZmxvb3IodmFsdWVzLmhpZ2hlcldlaWdodCAlIDE0KX0gbGJzYH0gYFxuICB9XG59XG5cbnJhZGlvUGFyZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGVjdFVuaXQpXG5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGdldFZhbHVlKVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9