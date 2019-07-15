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
    of_a_kind = (result[keys[i]] >= 3) ? rack_prop : false
  }
  result.isRun = (run_score.length === arr.length) ? true : false
  result.isThreePairs = (pair_score === 3) ?  true : false
  result.isTwoTrios = (trio_score === 2) ?  true : false
  result.ofAKind = (result.isTwoTrios) ? false : of_a_kind
  return result
}

function triageScore(obj) {
  var result = obj;
  if (obj.isRun) {
    result = "run"
  } else if (obj.isThreePairs) {
    results = "three pairs"
  } else if (obj.isTwoTrios){
    results = "two trios"
  } else if (obj.ofAKind) {
    results = obj.ofAKind.toString()
    results += " of a kind "
    results += Object.keys(obj.ofAKind)[0]
  }
  return result
}

function scoreGroup(obj) {
  var score = 0
  var keys = Object.keys(obj)
  var factor = (keys[0] === 1) ? obj[keys[0]] : keys[0]
  if (obj[keys[i]] > 3) {
    score = "above 3"
  } else {
    score = factor * 100
  }
}

var roll_arr = diceRoll(6, 6)
var results = (qualify(roll_arr, 1, 5)) ? rackRolls(roll_arr) : false
var turn_log = (results) ? results : "farkle"
var scores = (results) ? triageScore(turn_log) : "farkle"
var score = (results.ofAKind) ? scoreGroup(results.ofAKind) : "no score group"
console.log(roll_arr)
console.log(turn_log)
console.log(scores)
