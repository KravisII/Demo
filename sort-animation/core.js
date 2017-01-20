'use strict';
// Extension Functions
Array.prototype.swap = function(i, j) {
  [this[j], this[i]] = [this[i], this[j]];
  status.push({
    i: i,
    j: j,
    iValue: nums[i],
    jValue: nums[j],
    type: 'swap'
  });
};

// Tool Functions
/**
 * Abbreviate of console.log
 * @return {null} null
 */
function log() {
  console.log(...arguments);
}

/**
 * Create an element with tag, class and id attribute
 * @param  {string}             tag     element tag name
 * @param  {[string]}           classes element class name(s)
 * @param  {string}             id      element id
 * @return {HTMLelement} new element
 */
function createElement(tag, classes, id) {
  let element = document.createElement(tag);
  if (Array.isArray(classes)) {
    if (classes.length !== 0) {
      element.classList.add(...classes);
    }
  } else {
    if (typeof classes !== 'string') {
      throw new TypeError('className is not string');
    }
    element.classList.add(classes);
  }
  if (typeof id === 'string') {
    element.setAttribute('id', id);
  }
  return element;
}

/**
 * [getIntRandom description]
 * @param  {[type]} max [description]
 * @param  {[type]} min [description]
 * @return {[type]}     [description]
 */
function getIntRandom(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * [generateNums description]
 * @param  {[type]} length [description]
 * @param  {[type]} max    [description]
 * @param  {[type]} min    [description]
 * @return {[type]}        [description]
 */
function generateNums(length, max, min) {
  const nums = [];
  for (let i = 0; i < length; i++) {
    nums.push(getIntRandom(max, min));
  }
  return nums;
}

// Global Values
const arrayList = document.querySelector('.array-list');

// Main Functions

/**
 * Generate a num list to HTML document
 * @param  {[number]}       array     List of number
 * @return {[HTMLElement]}  Elements
 */
function generateList(array) {
  const length = array.length;
  for (let i = 0; i < length; i += 1) {
    let arrayItem = createElement('li', 'array-item');
    arrayItem.style.height = `${(nums[i] / numsMax) * 100}%`;
    arrayList.appendChild(arrayItem);
  }
  return document.querySelectorAll('.array-item');
}

/**
 * Quick Sort
 * @param {number[]} nums Array
 * @return {number[]} result
 */
function quickSort(nums) {
  const partition = function(left, right) {
    status.push({
      type: 'range',
      left: left,
      right: right
    });
    const pivotValue = nums[right];
    status.push({
      type: 'pivot',
      pivot: right,
      pivotValue: pivotValue
    });
    let store = left;
    for (let i = left; i < right; i++) {
      if (nums[i] <= pivotValue) {
        nums.swap(store, i);
        store++;
      }
    }
    nums.swap(right, store);
    return store;
  };

  const sort = function(left, right) {
    if (left < right) {
      let newPivot = partition(left, right);
      sort(left, newPivot - 1);
      sort(newPivot + 1, right);
    }
  };

  sort(0, nums.length - 1);
  return nums;
}

/**
 * Draw HTML Interface
 * @return {null} [description]
 */
function draw() {
  if (status.length === 0) {
    clearInterval(drawInterval);
    for (let i = 0; i < arrayItems.length; i++) {
      arrayItems[i].classList.remove('range', 'pivot');
    }
    return;
  }
  let current = status.shift();

  switch (current.type) {
    case 'swap':
      arrayItems[current.i].classList.add('swap');
      arrayItems[current.j].classList.add('swap');

      arrayItems[current.i].style.height = `${current.iValue * 100 / numsMax}%`;
      arrayItems[current.j].style.height = `${current.jValue * 100 / numsMax}%`;

      setTimeout(() => {
        arrayItems[current.i].classList.remove('swap');
        arrayItems[current.j].classList.remove('swap');
      }, 500);
      break;
    case 'range':
      for (let i = 0; i < arrayItems.length; i++) {
        arrayItems[i].classList.remove('range');
      }
      for (let i = current.left; i <= current.right; i++) {
        arrayItems[i].classList.add('range');
      }
      break;
    case 'pivot':
      for (let i = 0; i < arrayItems.length; i++) {
        arrayItems[i].classList.remove('pivot');
      }
      arrayItems[current.pivot].classList.add('pivot');
      break;
    default:
      break;
  }
}

const nums = generateNums(20, 5, 100);
const numsMax = Math.max(...nums);
const arrayItems = generateList(nums);
const status = [];

quickSort(nums);
let drawInterval = setInterval(draw, 500);
