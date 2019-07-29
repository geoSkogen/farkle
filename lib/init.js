'use strict'

// DOM
function setDice(roll_arr) {
  var divs = []
  var div = {}
  var text = {}
  roll_shell.innerHTML = ""
  for (let i = 0; i < roll_arr.length; i++) {
    div = die_build_D6(roll_arr[i],i.toString())
    roll_shell.appendChild(div)
    div.addEventListener( "click", function () {
      toggleHighlight(this)
    })
    divs.push({ el: div, val: roll_arr[i] })
  }
  return divs
}

function toggleHighlight(el) {
  var vals = ["false","true"]
  var style_str = "2px solid black"
  var threshold = (roll_status.results.yes_score.length === dice_rolls) ? 1 : 2
  if (vals.indexOf(el.value)) {
    el.value = vals[0]
    el.style.border = "2px solid black"
  } else {
    if (roll_status.results.roll_rack[el.name] > threshold) {
      el.value = vals[1]
      style_str = "4px solid " + colors[roll_status.results.roll_rack[el.name]]
    } else if (qualify_vals.indexOf(Number(el.name)) > -1) {
      el.value = vals[1]
      style_str = "4px solid " + colors[0]
    }
    el.style.border = style_str
  }
}

function toggleDisplay(el_arr,disp_arr,index_arr) {
  for (let i = 0; i < el_arr.length; i++) {
    el_arr[i].style.display = (index_arr[i]) ? disp_arr[1] : disp_arr[0]
  }
}

function die_build_D6(int,str) {

  // DOM - Dice Graphic
  // row types - two in a row, one in a row, none in a row
  // roll 'recipes' - build the die face from row types with arguments

  function two_in_a_row(arg) {
    //accepts true/false argument for vertical padding
    var shell = document.createElement("div")
    var dots = [document.createElement("i"), document.createElement("i")]
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
  result.id = str
  result.className = "diegram"
  result.name = int.toString()
  result.value = "false"
  rows = roll_call()
  rows.forEach( (row) => { result.appendChild(row)} )
  return result
}

function highlightScoreDice(dom_obj_arr) {
  dom_obj_arr.forEach( (d) => { toggleHighlight(d.el)} )
}

function writeRollStatus(obj) {
  var divs = []
  var roll_index = 0
  var row_totals = obj.score_log
  var roll_total = {
    die_face: "this roll",
    row_label: obj.score_label,
    row_score: obj.roll_score
  }
  var turn_total = {
    die_face: "total",
    row_label: obj.score_log.length.toString(),
    row_score: obj.test_score
  }

  console.log(JSON.stringify(row_totals))
  console.log(JSON.stringify(roll_total))
  console.log(JSON.stringify(turn_total))

  function makeRow(row_num, index_num, this_row) {
    var row_shell = document.createElement("div")
    var row_div = document.createElement("div")
    var row_text = this_row.die_face + ": " + this_row.row_label +
      " - score:" + this_row.row_score
    var row_node = document.createTextNode(row_text)
    row_div.appendChild(row_node)
    row_div.className = "throw_row"
    row_div.id = this_row.row_label + "_" + index_num.toString() +
      "_" + row_num.toString()
    row_shell.appendChild(row_div)
    row_shell.className = "flexOuterCenter"
    row_shell.id = "row_" + index_num.toString() + "_" + row_num.toString()
    return row_shell
  }

  score_shell.innerHTML = ""
  for (let i = 0; i < row_totals.length; i++) {
    roll_index++
    var tag_shell = document.createElement("div")
    var tag_text = document.createTextNode(roll_index.toString())
    tag_shell.className = "flexOuterStart"
    tag_shell.style.margin = "0 0 0 33%"
    tag_shell.appendChild(tag_text)
    divs.push(tag_shell)
    for (let ii = 0; ii < row_totals[i].length; ii++) {
      var row_data = row_totals[i][ii]
      var new_row = makeRow((ii+1), roll_index, row_data)
      divs.push(new_row)
    }
  }
  var roll_row = makeRow(0,0,roll_total)
  var turn_row = makeRow(-1,-1,turn_total)
  divs.push(roll_row)
  divs.push(turn_row)

  divs.forEach( (e) => {
    score_shell.appendChild(e)
  })
/*
  var keys = Object.keys(obj)
  var keys_keys = {}
  score_shell.innerHTML = ""
  for (let i = 0; i < keys.length; i++) {
    score_shell.innerHTML += keys[i] + ":<br/>"
    keys_keys = Object.keys(obj[keys[i]])
    if (keys_keys.length) {
      for (let ii = 0; ii < keys_keys.length; ii++) {
        score_shell.innerHTML += [keys_keys[ii]] + ":<br/>"
        score_shell.innerHTML += obj[keys[i]][keys_keys[ii]] + "<br/><br/>"
      }
    } else {
      score_shell.innerHTML += obj[keys[i]] + "<br/><br/>"
    }
  }
*/
}

//LOGIC
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

function getQualified(rolls,no_scores) {
  var result = []
  for (let i = 0; i < rolls.length; i++) {
    if (no_scores.indexOf(rolls[i]) === -1) {
      result.push(rolls[i])
    }
  }
  return result
}

function getScoreGroup(arr) {
  var result = {}
  var keys = []
  arr.forEach( (e) => {
    keys = Object.keys(e)
    result = (e[keys[0]] > 2) ? e : result
  })
  return result
}

function getRowScore(str, int) {
  var group = {}
  var set = []
  var result = 0
  if (int > 2) {
    group[str] = int
    result = scoreGroup(group)
  } else {
    for (let i = 0; i < int; i++) {
      set.push(str)
    }
    result = scoreRaw(set)
  }
  return result
}

function makeNewTableData(roll_label, arr, obj, test_score) {
  var result = []
  var nouns = ["zero","one","two","three","four","five"]
  var labels = ["straight","three pairs","pair of triplets",
    "four-of-a-kind plus a pair","six-of-a-kind"]
  var key = ""
  var val = 0
  var table_label = ""
  var score = ""
  var keylog = ""
  if (roll_label === "combo") {
    for (let i = 0; i < arr.length; i++) {
      if (keylog.indexOf(arr[i].toString()) === -1) {
        val = obj[arr[i].toString()]
        key = arr[i].toString()
        keylog += key
        table_label = nouns[val]
        table_label += (val > 2) ? " of a kind" : ""
        score = getRowScore(key,val)
        result.push({die_face: key, row_label: table_label, row_score: score})
      }
    }
  } else if (labels.indexOf(roll_label) > -1) {
    result.push({
      die_face: Object.keys(obj).join(","),
      row_label: roll_label,
      row_score: test_score
    })
  }
  return result
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
  var of_a_kind = []
  var score_group = {}
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
    if (result.roll_rack[keys[i]] > 1) { of_a_kind.push(rack_prop) }
    if (result.roll_rack[keys[i]] < 3) {
      for (let ii = 0; ii < result.roll_rack[keys[i]]; ii++) {
        if (qualify_vals.indexOf(Number(keys[i])) != -1) {
          raw_score.push(Number(keys[i]))
        } else {
          no_score.push(Number(keys[i]))
        }
      }
    }
  }
  result.raw_roll = arr
  result.yes_score = arr
  result.of_a_kind = of_a_kind
  if (run_score.length === dice_rolls) {
    result.test_score = 1500
    result.score_label = "straight"
  } else if (pair_score === 3) {
    result.test_score = 1500
    result.score_label = "three pairs"
  } else if (trio_score === 2) {
    result.test_score = 2500
    result.score_label = "two triplets"
  } else if (pair_score === 1 && four_score === 1) {
    result.test_score = 1500
    result.score_label = "four-of-a-kind plus a pair"
  } else if (six_score === 1) {
    result.score_label === "six-of-a-kind"
    result.test_score = 3000
  } else {
    score_group = (of_a_kind.length) ? getScoreGroup(of_a_kind) : false
    result.test_score += (score_group) ? scoreGroup(score_group) : 0
    result.test_score += (raw_score.length) ? scoreRaw(raw_score) : 0
    result.no_score = (no_score.length) ? no_score : false
    result.yes_score = getQualified(arr, no_score)
    result.score_label = "combo"
  }
  result.table_data = makeNewTableData(
    result.score_label,result.yes_score,result.roll_rack,result.test_score
  )
  return result
}

function initRoll(dice_rolls) {
  var roll_arr = diceRoll(dice_rolls, dice_sides)
  var dice_arr = setDice(roll_arr)
  var roll_results = rackRolls(roll_arr)
  return { dice: dice_arr, results: roll_results }
}

function yourTurn() {
  score_arr.push(roll_status.results.test_score)
  turn_index++
  roll_status = {}
  score_shell.innerHTML = ""
  roll_shell.innerHTML = ""
  toggleDisplay(
    buttons,
    display_arr,
    [1,0,0,0]
  )
}

//LOGIC vars
var player_arr = []
var score_arr = [0]
var turn_index = 0
var dice_rolls = 6
var dice_sides = 6
var qualify_vals = [1,5]
var roll_status = {}
/*
roll status { test_score: 0, yes_score = []}
*/
//DOM vars
var roll_button = document.querySelector("#roll_button")
var re_roll_button = document.querySelector("#re_roll_button")
var no_roll_button = document.querySelector("#no_roll_button")
var your_turn_button = document.querySelector("#your_turn_button")
var buttons = document.querySelectorAll(".go_button")
var score_shell = document.querySelector("#score_shell")
var roll_shell = document.querySelector("#roll_shell")
var display_arr = ['none','block']
var colors = ["firebrick","lightgrey","powderblue","limegreen","gold","orange","inidgo"]

//Event Listeners

roll_button.addEventListener("click", () => {
  var allow_pairs = false
  var disp_index = [0,0,0,1]
  roll_status = initRoll(dice_rolls)
  roll_status.results.roll_score = roll_status.results.test_score
  roll_status.results.score_log = []
  roll_status.results.score_log.push(roll_status.results.table_data)
  allow_pairs = (roll_status.results.yes_score.length === dice_rolls) ? true : false
  if (roll_status.results.yes_score.length) {
    disp_index = (roll_status.results.no_score) ? [0,1,1,0] : [0,0,0,1]
  }
  toggleDisplay(buttons,display_arr,disp_index)
  highlightScoreDice(roll_status.dice)
  writeRollStatus(roll_status.results)
})

re_roll_button.addEventListener("click", () => {
  var disp_index = [0,0,0,1]
  var new_roll = initRoll(roll_status.results.no_score.length)
  var new_score = 0
  if (new_roll.results.test_score) {
    disp_index = (new_roll.results.no_score) ? [0,1,1,0] : [0,0,0,1]
    new_score = new_roll.results.test_score
  }
  roll_status.results.raw_roll = new_roll.results.raw_roll
  roll_status.results.roll_rack = new_roll.results.roll_rack
  roll_status.results.test_score += new_score
  roll_status.results.roll_score = new_score
  roll_status.results.no_score = (new_roll.results.no_score) ? new_roll.results.no_score : []
  roll_status.results.yes_score = new_roll.results.yes_score
  roll_status.results.score_label = new_roll.results.score_label
  roll_status.results.of_a_kind = new_roll.results.of_a_kind
  roll_status.results.score_log.push(new_roll.results.table_data)
  roll_status.dice = new_roll.dice
  toggleDisplay(buttons,display_arr,disp_index)
  highlightScoreDice(roll_status.dice)
  writeRollStatus(roll_status.results)
})

your_turn_button.addEventListener("click", yourTurn)

no_roll_button.addEventListener("click", yourTurn)
