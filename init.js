'use strict'

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

function rackRolls(arr) {
  var result = {}
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
  if (run_score.length === arr.length) {
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
    result.test_score = {
      ofAKind : of_a_kind,
      noScore : no_score,
      rawScore : raw_score
    }
  }
  return result
}

function triageScore(obj) {
  var result = obj;
  if (!Number(obj)) {
    result = obj
  }
  return result
}

function scoreGroup(obj) {
  var score = 0
  var keys = Object.keys(obj)
  var factor = (keys[0] === 1) ? obj[keys[0]] : keys[0]
  switch (obj[keys[0]]) {
    case 3 :
      score = factor * 100
    case 4 :
      score = 1000
      break
    case 5 :
      score = 2000
      break
    default:
      console.log("in a pig's eye")
  }
}

var roll_arr = diceRoll(6, 6)
var results = (qualify(roll_arr, 1, 5)) ? rackRolls(roll_arr) : false
var turn_log = (results) ? results : "farkle"
var scores = (results) ? triageScore(turn_log) : "farkle"
console.log(roll_arr)
console.log(turn_log)
console.log(scores)
