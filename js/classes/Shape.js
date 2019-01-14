class Shape {
  constructor(color, position, context) {
    // code
    this.color = color
    this.position = position
    this.context = context
  }

  get area() {
    return this.calcArea()
  }
  get shapeInfo() {
    return this.defineShapeInfo()
  }

  drawShape() {}
  calcArea() {
    return 0
  }
  defineShapeInfo() {
    return {}
  }
}
