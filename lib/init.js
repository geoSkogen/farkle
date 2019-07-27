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
  var result = { roll_rack: {}, test_score : 0 }
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
    if (result.roll_rack[arr[i].toString()]) {
      result.roll_rack[arr[i].toString()] += 1
    } else {
      result.roll_rack[arr[i].toString()] = 1
    }
    run_score += (run_score.indexOf(arr[i].toString()) === -1) ? arr[i].toString() : ""
  }
  keys = Object.keys(result.roll_rack)
  for (let i = 0; i < keys.length; i++) {
    rack_prop = {}
    rack_prop[keys[i]] = result.roll_rack[keys[i]]
    pair_score += (result.roll_rack[keys[i]] === 2) ? 1 : 0
    trio_score += (result.roll_rack[keys[i]] === 3) ? 1 : 0
    four_score += (result.roll_rack[keys[i]] === 4) ? 1 : 0
    six_score += (result.roll_rack[keys[i]] === 6) ? 1 : 0
    of_a_kind = (result.roll_rack[keys[i]] > 2) ? rack_prop : of_a_kind
    if (result.roll_rack[keys[i]] < 3) {
      for (let ii = 0; ii < result.roll_rack[keys[i]]; ii++) {
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
  var dice = setDice(roll_arr)
  var results = (qualify(roll_arr, 1, 5)) ? rackRolls(roll_arr) : {}
  return results
}

function yourTurn() {
  score_arr.push(roll_status.test_score)
  turn_index++
  roll_status = {}
  score_shell.innerHTML = ""
  toggleDisplay(
    buttons,
    display_arr,
    [1,0,0,0]
  )
}

// DOM

function setDice(roll_arr) {
  var shell = document.querySelector("#roll_shell")
  var divs = []
  var div = {}
  var text = {}
  shell.innerHTML = ""
  for (let i = 0; i < roll_arr.length; i++) {
    div = die_build_D6(roll_arr[i])
    shell.appendChild(div)
    divs.push({ el: div, val: roll_arr[i] })
  }
  return divs
}

function toggleDisplay(el_arr,disp_arr,index_arr) {
  for (let i = 0; i < el_arr.length; i++) {
    el_arr[i].style.display = (index_arr[i]) ? disp_arr[1] : disp_arr[0]
  }
}

function die_build_D6(int) {

  // DOM - Dice Graphic
  // row types - two in a row, one in a row, none in a row
  // roll 'recipes' - build the die face from row types with arguments

  function two_in_a_row(arg) {
    //accepts true/false argument for vertical padding
    var shell = document.createElement("div")
    var dots = [document.createElement("i"), document.createElement("i")]
    shell.id = nouns[int]
    shell.className = "flexOuterCenter"
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = "fas fa-circle"
      dots[i].style.padding = (arg) ? "6px 10px" : "0px 10px"
      shell.appendChild(dots[i])
    }
    return shell
  }

  function one_in_a_row(row_index, arg) {
    //accepts argument 1,2, or 3 for row index
    //accepts true/false argument for extra vertical padding
    var padding_rules = ["0px 0px","6px 10px","0px 0px","6px 10px"]
    var class_appends = ["Center","End","Center","Start"]
    var shell = document.createElement("div")
    var dot = document.createElement("i")
    dot.className = "fas fa-circle"
    shell.className = "flexOuter" + class_appends[row_index]
    shell.style.padding = (arg) ? "28px 10px" : padding_rules[row_index]
    shell.appendChild(dot)
    return shell
  }

  function none_in_a_row() {
    var el = document.createElement("div")
    el.style.height = "16px"
    return el
  }

  function roll_zero() {
    var row = none_in_a_row()
    return [row]
  }

  function roll_one() {
    var row = one_in_a_row(0, true)
    return [row]
  }

  function roll_two() {
    var row1 = one_in_a_row(1, false)
    var row2 = none_in_a_row()
    var row3 = one_in_a_row(3, false)
    return [row1, row2, row3]
  }

  function roll_three() {
    var row1 = one_in_a_row(1, false)
    var row2 = one_in_a_row(2, false)
    var row3 = one_in_a_row(3, false)
    return [row1, row2, row3]
  }

  function roll_four() {
    var row1 = two_in_a_row(true)
    var row2 = none_in_a_row()
    var row3 = two_in_a_row(true)
    return [row1, row2, row3]
  }

  function roll_five() {
    var row1 = two_in_a_row(true)
    var row2 = one_in_a_row(2, false)
    var row3 = two_in_a_row(true)
    return [row1, row2, row3]
  }

  function roll_six() {
    var row1 = two_in_a_row(true)
    var row2 = two_in_a_row(false)
    var row3 = two_in_a_row(true)
    return [row1, row2, row3]
  }

  // Main - creates shell element; appends rows based on numeric argument

  var nouns = ["zero","one","two","three","four","five","six"]
  var result = document.createElement("div")
  var rows = []
  var d6 = [
    roll_zero,
    roll_one,
    roll_two,
    roll_three,
    roll_four,
    roll_five,
    roll_six
  ]
  var roll_call = d6[int]
  console.log(roll_call)
  result.id = nouns[int]
  result.className = "diegram"
  rows = roll_call()
  rows.forEach( (row) => { result.appendChild(row)} )
  return result
}

function writeRollStatus(obj) {
  var keys = Object.keys(obj)
  var keys_keys = {}
  score_shell.innerHTML = ""
  for (let i = 0; i < keys.length; i++) {
    score_shell.innerHTML += keys[i] + ":<br/>"
    keys_keys = Object.keys(roll_status[keys[i]])
    if (keys_keys.length) {
      for (let ii = 0; ii < keys_keys.length; ii++) {
        score_shell.innerHTML += [keys_keys[ii]] + ":<br/>"
        score_shell.innerHTML += roll_status[keys[i]][keys_keys[ii]] + "<br/><br/>"
      }
    } else {
      score_shell.innerHTML += roll_status[keys[i]] + "<br/><br/>"
    }
  }
}

//LOGIC

var score_arr = [0]
var turn_index = 0
var dice_rolls = 6
var roll_status = {}

//DOM

var roll_button = document.querySelector("#roll_button")
var re_roll_button = document.querySelector("#re_roll_button")
var no_roll_button = document.querySelector("#no_roll_button")
var your_turn_button = document.querySelector("#your_turn_button")
var buttons = document.querySelectorAll(".go_button")
var score_shell = document.querySelector("#score_shell")
var display_arr = ['none','block']

roll_button.addEventListener("click", () => {
  var keys = {}
  var disp_index = [0,0,0,1]
  roll_status = initRoll(dice_rolls)
  keys = Object.keys(roll_status)
  if (keys.length) {
    disp_index = (roll_status.no_score) ? [0,1,1,0] : [0,0,0,1]
  }
  toggleDisplay(buttons,display_arr,disp_index)
  writeRollStatus(roll_status)
})

re_roll_button.addEventListener("click", () => {
  var disp_index = [0,0,0,1]
  var new_roll = initRoll(roll_status.no_score.length)
  var keys = Object.keys(new_roll)
  if (keys.length) {
    disp_index = (roll_status.no_score) ? [0,1,1,0] : [0,0,0,1]
    roll_status.roll_rack = new_roll.roll_rack
    roll_status.test_score += new_roll.test_score
    roll_status.no_score = (new_roll.no_score) ? new_roll.no_score : []
  }
  toggleDisplay(buttons,display_arr,disp_index)
  writeRollStatus(roll_status)
})

your_turn_button.addEventListener("click", yourTurn)

no_roll_button.addEventListener("click", yourTurn)
