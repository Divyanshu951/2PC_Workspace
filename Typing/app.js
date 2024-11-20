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
let curr_input = ''
let middle_char = 30
let scroll_amnt = 10
let curr_input_array = []
let latest_arr_count = 0

let char_typedCount = 0
let char_typedWrong = 0
let char_typedCorrect = 0

let timer
let count = 120  // Set initial timer value to 120 seconds
let array_count = 0

let typedChar_arr = []
let charCheckWrong = false

// New variables for tracking total practice time
let totalPracticeTime = 0
let totalPracticeInterval // Interval for tracking total practice time

window.onbeforeunload = function() {
  return "Input will be lost if you leave the page, are you sure?";
};

const words = [
    "jude fired juie ire ride deer ride feud deer jerk fire ire ride free ire juie ire ride deer ire fuel ire ride fury ire juie ride free kid ride feud ire deer ride free ire kid deer ire fury ride ire jerk kid fire ire ride fury ire fuel ire juie ire ride ire kid deer ire feud ire deer ire ride ire free ire ride"
]

function toggleFullscreen() {
  const paragraphBox = document.getElementById("paragraph-box");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const statsContainer = document.getElementById("stats-container");
  const mainContainer = document.getElementById("main-container");
  const fullscreenStartButton = document.getElementById("fullscreen-start-bttn"); // Get new Start button

  if (paragraphBox.classList.contains("fullscreen")) {
    // Exit fullscreen
    paragraphBox.classList.remove("fullscreen");
    statsContainer.classList.remove("fullscreen-stats");
    mainContainer.style.backgroundColor = ""; // Restore default background
    fullscreenStartButton.style.display = "none"; // Hide fullscreen Start button
    fullscreenBtn.innerText = "🔳"; // Restore fullscreen icon
  } else {
    // Enter fullscreen
    paragraphBox.classList.add("fullscreen");
    statsContainer.classList.add("fullscreen-stats");
    mainContainer.style.backgroundColor = "#1e1e30"; // Set background color
    fullscreenStartButton.style.display = "block"; // Show fullscreen Start button
    fullscreenBtn.innerText = "❌"; // Change to exit icon
  }
}

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
  stopTotalPracticeTimer() // Stop total practice time when reset
  inputArea.value = ''
  latest_arr_count = 0;
  time_container.innerText = '120'
  wpm_container.innerText = ''
  accuracy_container.innerText = ''
  char_typedWrong = 0
  count = 120  // Reset count to 120
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
    } else if (typedChar != char.innerHTML) {    //If the char does not match
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
      const charWidth = char.offsetWidth
      const charLeft = char.offsetLeft
      const boxWidth = paragraphBox.offsetWidth
      const scrollOffset = charLeft + charWidth / 2 - boxWidth / 2
      paragraphBox.scrollLeft = Math.max(0, scrollOffset)
    }

    if (curr_input_array.length == spanArray.length) {
      clearInterval(timer)
      stopTotalPracticeTimer() // Stop total practice timer when finished
      displayResults()
    }
  })

  typedChar_arr.push(charCheckWrong)
}

function calculate_acc() {
  let acc = Math.round(((spanArray.length - char_typedWrong) / (spanArray.length)) * 100)
  accuracy_container.innerText = acc + '%'
}

function time_counter() {
  time_container.innerText = count;
  
  startTotalPracticeTimer() // Start counting total practice time
  
  // Initialize the countdown timer
  timer = setInterval(() => {
    count--;
    time_container.innerText = count;

    if (count <= 0) { // Check if timer has reached 0
      clearInterval(timer);
      stopTotalPracticeTimer() // Stop total practice timer when session ends
      displayResults();
    }
  }, 1000); // Update every second
}

function calculate_wpm() {
  let wpm_score = Math.round(((spanArray.length) / 5) / ((120 - count) / 60))
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

function displayResults() {
  char_typedWrong = determine_wrong_counts()
  console.log(char_typedWrong, "= wrong counts")
  calculate_wpm()
  calculate_acc()
  startBttn.focus()
}

function ignored_Key(e_key) {
  const ignore_keys = {
    'Shift': 0,
    'Alt': 0,
    'Control': 0,
  }
  return ignore_keys[e_key] ?? -1
}

function addLine() {
  const newLine = prompt("Enter the new line of text:")
  if (newLine) {
    words.push(newLine)
    init()
  }
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

// Functions to start and stop the total practice time counter
function startTotalPracticeTimer() {
  clearInterval(totalPracticeInterval); // Clear any previous interval
  totalPracticeInterval = setInterval(() => {
    totalPracticeTime++;
    let minutes = Math.floor(totalPracticeTime / 60); // Minutes
    let seconds = totalPracticeTime % 60; // Remaining seconds
    document.getElementById('total-time-value').innerText = `${minutes} min ${seconds} sec`; // Update display
  }, 1000);
}

function stopTotalPracticeTimer() {
  clearInterval(totalPracticeInterval);
}

start()
