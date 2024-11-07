const bttn = document.querySelector('#test-click')
const inputArea = document.querySelector('#input-field')
const paragraphBox = document.querySelector("#paragraph-box")
const startBttn = document.querySelector('#start-bttn')
const wpm_container = document.querySelector('#wpm_con')
const time_container = document.querySelector('#time_con')
const accuracy_container = document.querySelector('#acc_con')

let index_no = 0
let mainArray = []
let spanArray = []
let modArray = []
let typedChar
let r_time = 0
let curr_input = ''
let middle_char = 30
let scroll_amnt = 10
let curr_input_array = []
let latest_arr_count = 0

let char_typedCount = 0
let char_typedWrong = 0
let char_typedCorrect = 0

let timer
let count = 0
let array_count = 0

let typedChar_arr = []
let charCheckWrong = false

const words = [
  
    "jude fired juice free jerk ride feud kid urge ride fuel deer ire jerk kid fierce feud juice ire juice free deer ride urge fury kid free ride fierce urge kid feud free fuel ride urge kid ire juice fuel fierce ire deer ride kid free ride fierce urge fury ride feud ire fuel free ride juice deer fire feud ride fierce deer",
    "free ride deer juice jerk ire urge deer fuel fire kid ire ride fury fuel ire free jerk kid deer fire ire juice feud ire fury free deer ire feud juice kid ride feud ride deer ire fury juice ride ire kid free fury ride fuel ire fierce juice ire fuel free ride juice kid ire ride feud ire kid fierce deer ire free juice",
    "jerk kid ire feud juice ire deer free ire ride juice deer ire ride juice kid ire juice ire deer fury ire ride kid deer ire jerk ride ire free feud ire kid feud ire deer juice ire feud ire deer fire ride ire juice kid ire free ire jerk juice ire fuel ire deer ire fire ire feud ire ride ire juice ire fuel ire deer",
    "free ride ire deer juice ire fuel ire kid ire ride ire free ire juice ire jerk ire deer ire juice ire free ire ride ire deer ire fuel ire juice ire deer ire free ire fuel ire jerk ire fuel ire free ire deer ire juice ire free ire fuel ire ride ire deer ire jerk ire juice ire free ire fuel ire juice ire ride ire",
    "i  re juice ire fuel ire deer ire free ire juice ire deer ire ride ire fuel ire deer ire juice ire free ire fuel ire deer ire juice ire fuel ire ride ire deer ire juice ire free ire ride ire deer ire juice ire free ire fuel ire juice ire ride ire free ire juice ire ride ire juice ire free ire juice ire fuel ire ride"
  
]

function again() {
  resetVal()
  inputArea.focus()
  startBttn.innerHTML = 'Again'
  init()
  check()
  time_counter()
}

function resetVal() {
  paragraphBox.scrollLeft = 0;
  clearInterval(timer)
  inputArea.value = ''
  latest_arr_count = 0;
  time_container.innerText = '0'
  wpm_container.innerText = ''
  accuracy_container.innerText = ''
  char_typedWrong = 0
  count = 0
  charCheckWrong = false
  array_count = 0
  typedChar_arr = []
}

function focus_now() {
  inputArea.focus()
}

function start() {
  startBttn.innerHTML = 'Start'
  inputArea.value = ''
  resetVal()
  paragraphBox.innerHTML = "Press Start button to begin......"
}

function randomWords() {
  return Math.floor(Math.random() * words.length)
}

function init() {
  paragraphBox.innerHTML = ''
  words[randomWords()].split('').forEach(ch => {
    const span_char = document.createElement('span')
    span_char.innerText = ch
    paragraphBox.appendChild(span_char)
  })
}

function changeSpace(s) {
  if (s == ' ') {
    s = '&nbsp;'
  }
  return s
}

function create_Array() {
  curr_input = inputArea.value
  curr_input_array = curr_input.split('').map(changeSpace)

  spanArray = paragraphBox.querySelectorAll('span')
  spanArray.forEach(e => {
    if (e.innerHTML == ' ') {
      e.innerHTML = '&nbsp;'
    }
  })
}

let index_char = -1
function check() {
  create_Array()

  let s = []
  spanArray.forEach(e => {
    s.push(e.innerHTML)
  })

  spanArray[0].classList.add('cursor-highlight')

  spanArray.forEach((char, index) => {
    typedChar = curr_input_array[index]

    if (typedChar == null) {                     //If the test has not yet started
      char.classList.remove('wrong')
      char.classList.remove('correct')
    } else if (typedChar == char.innerHTML) {    //If the char typed matches 
      char.classList.remove('wrong')
      char.classList.add('correct')
      charCheckWrong = false
    } else if (typedChar != char.innerHTML) {                                     //If the char does not match
      char.classList.remove('correct')
      char.classList.add('wrong')
      charCheckWrong = true
    }

    // Highlighting the wrong and cursor-highlight
    if (index == curr_input_array.length) {
      if (char === ' ') char.classList.add('space-wrong')
      char.classList.add('cursor-highlight')
    } else {
      char.classList.remove('cursor-highlight')
    }

    // Adjust scrolling to center the current typed character
    if (index === curr_input_array.length - 1) {
      const charWidth = char.offsetWidth; // Get the width of the current character
      const charLeft = char.offsetLeft;  // Get the left position of the character
      const boxWidth = paragraphBox.offsetWidth; // Get the width of the paragraph box
      const scrollOffset = charLeft + charWidth / 2 - boxWidth / 2; // Calculate scroll position to center the character
      paragraphBox.scrollLeft = Math.max(0, scrollOffset);
    }

    if (curr_input_array.length == spanArray.length) {
      clearInterval(timer)
      char_typedWrong = determine_wrong_counts()

      console.log(char_typedWrong, "= wrong counts")
      calculate_wpm()
      calculate_acc()
      startBttn.focus()
    }
  })

  typedChar_arr.push(charCheckWrong)
}

function calculate_acc() {
  let acc = Math.round(((spanArray.length - char_typedWrong) / (spanArray.length)) * 100)
  accuracy_container.innerText = acc + '%'
}

function time_counter() {
  timer = setInterval(() => {
    count++
    time_container.innerText = count
  }, 1002)
}

function calculate_wpm() {
  let wpm_score = Math.round(((spanArray.length) / 5) / (count / 60))
  wpm_container.innerText = wpm_score
}

function determine_wrong_counts() {
  let typedWrong = 0
  for (let i = 0; i < typedChar_arr.length; i++) {
    if (typedChar_arr[i] == true) {
      typedWrong += 1
    }
  }
  return typedWrong
}

function ignored_Key(e_key) {
  const ignore_keys = {
    'Shift': 0,
    'Alt': 0,
    'Control': 0,
  }
  return ignore_keys[e_key] ?? -1
}

inputArea.addEventListener('keydown', (e) => {
  let name = e.key
  if (name == 'Backspace') {
    if (curr_input_array.length > spanArray.length * 0.90) {
      paragraphBox.scrollLeft -= 0
    } else {
      paragraphBox.scrollLeft -= spanArray.length / 10
    }
  }
  else if (ignored_Key(name) == 0) paragraphBox.scrollLeft += 0
  else {
    paragraphBox.scrollLeft += spanArray.length / 10
  }

}, false)

start()
