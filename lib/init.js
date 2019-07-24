'use strict'

//ROLL & SCORING LOGIC

function diceRoll(number_of_dice, number_of_sides) {
  var arr = []
  for (let i = 0; i < number_of_dice; i++) {
    arr.push(Math.ceil(Math.random()*number_of_sides))
  }
  return arr
}

function qualify(arr, val1, val2) {
  var result = false
  arr.forEach( (e) => {
    result = ( e === val1 || e === val2 ) ? true : result
  })
  return result
}

function scoreRaw(arr) {
  var result = 0
  arr.forEach( (e) => {
    result += (Number(e) === 1) ? 100 : 50
  })
  return result
}

function scoreGroup(obj) {
  var score = 0
  var keys = Object.keys(obj)
  var factor = (Number(keys[0]) === 1) ? obj[keys[0]] : keys[0]
  switch (obj[keys[0]]) {
    case 3 :
      score = factor * 100
      break
    case 4 :
      score = 1000
      break
    case 5 :
      score = 2000
      break
    default:
      score = 0
  }
  return score
}

function rackRolls(arr) {
  var result = { test_score : 0 }
  var keys = []
  var run_score = ""
  var pair_score = 0
  var trio_score = 0
  var four_score = 0
  var six_score = 0
  var no_score = []
  var raw_score = []
  var rack_prop = {}
  var of_a_kind = false
  for (let i = 0; i < arr.length; i++) {
    if (result[arr[i].toString()]) {
      result[arr[i].toString()] += 1
    } else {
      result[arr[i].toString()] = 1
    }
    run_score += (run_score.indexOf(arr[i].toString()) === -1) ? arr[i].toString() : ""
  }
  keys = Object.keys(result)
  for (let i = 0; i < keys.length; i++) {
    rack_prop = {}
    rack_prop[keys[i]] = result[keys[i]]
    pair_score += (result[keys[i]] === 2) ? 1 : 0
    trio_score += (result[keys[i]] === 3) ? 1 : 0
    four_score += (result[keys[i]] === 4) ? 1 : 0
    six_score += (result[keys[i]] === 6) ? 1 : 0
    of_a_kind = (result[keys[i]] > 2) ? rack_prop : of_a_kind
    if (result[keys[i]] < 3) {
      for (let ii = 0; ii < result[keys[i]]; ii++) {
        if (keys[i] === '1' || keys[i] === '5') {
          raw_score.push(keys[i])
        } else {
          no_score.push(keys[i])
        }
      }
    }
  }
  if (run_score.length === dice_rolls) {
    result.test_score = 1500
  } else if (pair_score === 3) {
    result.test_score = 1500
  } else if (trio_score === 2) {
    result.test_score = 2500
  } else if (pair_score === 1 && four_score === 1) {
    result.test_score = 1500
  } else if (six_score === 1) {
    result.test_score = 3000
  } else {
    result.test_score += (of_a_kind) ? scoreGroup(of_a_kind) : 0
    result.test_score += (raw_score.length) ? scoreRaw(raw_score) : 0
    result.no_score = (no_score.length) ? no_score : false
  }
  return result
}

function initRoll(dice_rolls) {
  var roll_arr = diceRoll(dice_rolls, 6)
  var dice = setDice(dice_rolls, roll_arr)
  var results = (qualify(roll_arr, 1, 5)) ? rackRolls(roll_arr) : false
  var turn_log = (results) ? results : "farkle"
  return turn_log
}

// DOM
function setDice(dice_rolls, roll_arr) {
  var shell = document.querySelector("#roll_shell")
  var divs = []
  var div = {}
  var text = {}
  shell.innerHTML = ""
  for (let i = 0; i < dice_rolls; i++) {
    div = document.createElement("div")
    text = document.createTextNode(roll_arr[i].toString())
    div.id = "die_" + (i+1).toString()
    div.className = "die"
    div.appendChild(text)
    shell.appendChild(div)
    divs.push({ el: div })
  }
  return divs
}

function toggleDisplay(arr,disp_arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log("was:")
    console.log(arr[i].id)
    console.log(arr[i].style.display)
    if (!disp_arr.indexOf(arr[i].style.display)) {
      arr[i].style.display = disp_arr[1]
    } else {
      arr[i].style.display = disp_arr[0]
    }
    console.log("is now:")
    console.log(arr[i].id)
    console.log(arr[i].style.display)
  }
}

//LOGIC

var score_arr = [0]
var turn_index = 0
var dice_rolls = 6

//DOM

var roll_button = document.querySelector("#roll_button")
var re_roll_button = document.querySelector("#re_roll_button")
var display_arr = ['none','block']

roll_button.addEventListener("click", () => {
  var roll_status = initRoll(dice_rolls)
  var keys = Object.keys(roll_status)
  toggleDisplay([roll_button,re_roll_button],display_arr)
  document.querySelector("#score_shell").innerHTML = ""
  for (let i = 0; i < keys.length; i++) {
    document.querySelector("#score_shell").innerHTML += keys[i] + ":<br/>"
    document.querySelector("#score_shell").innerHTML += roll_status[keys[i]] + "<br/><br/>"
  }
})
