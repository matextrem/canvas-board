import Circle from './classes/Circle.js'
import Parallelogram from './classes/Parallelogram.js'

Object.prototype.containDot = function(mouseX, mouseY) {
  const dx = mouseX - this.x
  const dy = mouseY - this.y
  return Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(dotRadius, 2)
}

// General vars
const resetButton = document.querySelector('.Button--reset')
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const blue = '#005293'
const yellow = '#FECB00'
const red = '#FF0000'
const black = '#000000'
const dotRadius = 5.5

// Vars for draggable elements
let isDragging = false
let selection = null
let dragOffX = 0
let dragOffY = 0
let updatePoint = null

let points = []

// User Interaction
// Gets the mouse position acording to the event it was called
const getMousePosition = e => {
  let x = e.pageX || e.clientX || e.x
  let y = e.pageY || e.clientY || e.y
  x -= canvas.offsetLeft
  y -= canvas.offsetTop
  return { x, y }
}

// get the initial click moment and check it this click is on a dot
const mouseDown = function(e) {
  const mouse = getMousePosition(e)
  const mouseX = mouse.x
  const mouseY = mouse.y

  for (let i = points.length - 2; i >= 0; i--) {
    if (points[i].containDot(mouseX, mouseY)) {
      const dot = points[i]
      updatePoint = i
      dragOffX = mouseX - dot.x
      dragOffY = mouseY - dot.y
      isDragging = true
      selection = dot
      return
    }
  }

  if (selection) selection = null
}

// get the mouse movement and call function to update the coordinates
const mouseMove = function(e) {
  if (isDragging) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    const mouse = getMousePosition(e)

    selection.x = mouse.x
    selection.y = mouse.y
  }
  updateScreen(selection, updatePoint)
}

// stop view updates
const mouseUp = function(e) {
  isDragging = false
}

// Show the toltip when mouse is over the point
const toggleTooltip = function(position, size) {
  canvas.addEventListener(
    'mousemove',
    e => {
      let tip = ''
      const mouse = getMousePosition(e)
      if (position.containDot(mouse.x, mouse.y)) {
        tip = position.tip || ''
      }
      context.font = '12px Arial'
      context.fillStyle = black //<======= here
      context.fillText(tip, position.x + 5, position.y - 10, size)
    },
    true
  )
}

const writeDotNumber = function(number, position, size) {
  const dotNumberPos = 10
  context.font = '10px Arial'
  context.fillText(
    number,
    position.x - dotNumberPos,
    position.y - dotNumberPos,
    size
  )
  toggleTooltip(position, 200)
}

const updateScreen = function(selection, updatePoint) {
  context.clearRect(0, 0, canvas.width, canvas.height)
  if (selection && isDragging) {
    points[updatePoint] = selection
    points[updatePoint].tip = `X: ${selection.x} Y: ${selection.y}`
  }

  const parallelogram = new Parallelogram(blue, { points }, context)
  parallelogram.drawShape()

  const len = points.length - 2
  for (let i = len; i >= 0; i--) {
    const dot = new Circle(red, points[i], dotRadius, false, true, context)
    points[i].dot = dot
    dot.drawShape()
    writeDotNumber(i + 1, points[i], 80)
  }
  const innerCircle = new Circle(
    yellow,
    parallelogram.shapeInfo.center,
    Math.sqrt(parallelogram.shapeInfo.area / Math.PI),
    true,
    false,
    context
  )
  innerCircle.drawShape()

  const info = {
    parallelogram: parallelogram.shapeInfo,
    circle: innerCircle.shapeInfo
  }
  displayInfo(info)
}

const displayInfo = function(info) {
  const pointElements = document.querySelectorAll('.Info-content--point')
  const parallelogramPoints = info.parallelogram.points
  const parallelogram = info.parallelogram
  const circle = info.circle
  pointElements.forEach(
    (pointEl, i) => (pointEl.textContent = parallelogramPoints[i].tip)
  )

  document.querySelector(
    '.Info-content--parallelogramArea'
  ).textContent = `Parallelogram: ${parallelogram.area}`
  document.querySelector('.Info-content--circleArea').textContent = `Circle: ${
    circle.area
  }`
  document.querySelector('.Info-none').classList.add('u-hidden')
  document.querySelector('.Info-content').classList.remove('u-hidden')
}

// Call the mouse position, verify how many dots are in the screen, call the dots/parallelogram draw function. Manage events
const handleMouseClick = function(e) {
  const position = getMousePosition(e)
  const dot = new Circle(red, position, dotRadius, false, true, context)
  const point = {
    ...position,
    tip: `X: ${position.x} Y: ${position.y}`,
    dot
  }

  if (points.length < 3) {
    points.push(point)

    dot.drawShape()
    writeDotNumber(points.length, point, 80)
  }

  if (points.length === 3) {
    canvas.removeEventListener('click', handleMouseClick)
    updateScreen()
    canvas.addEventListener('mousedown', mouseDown, true)
    canvas.addEventListener('mousemove', mouseMove, true)
    canvas.addEventListener('mouseup', mouseUp, true)
  }
}

// Reset
const resetBoard = () => {
  context.closePath()
  context.clearRect(0, 0, canvas.width, canvas.height)
  points = []
  canvas.removeEventListener('mousedown', mouseDown, true)
  canvas.removeEventListener('mousemove', mouseMove, true)
  canvas.removeEventListener('mouseup', mouseUp, true)
  canvas.addEventListener('click', handleMouseClick)
}

const initBoard = function() {
  canvas.addEventListener('click', handleMouseClick)
  resetButton.addEventListener('click', resetBoard)
}

initBoard()
