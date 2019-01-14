class Circle extends Shape {
  constructor(color, position, size, stroke, fill, context) {
    super(color, position, context)
    this.radius = size
    this.stroke = stroke
    this.fill = fill
  }

  drawShape() {
    this.context.beginPath()
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      true
    )

    if (this.stroke) {
      this.context.strokeStyle = this.color
      this.context.lineWidth = 3
      this.context.stroke()
    }

    if (this.fill) {
      this.context.fillStyle = this.color
      this.context.fill()
    }
  }

  defineShapeInfo() {
    return { area: this.calcArea() }
  }

  calcArea() {
    return (Math.PI * Math.pow(this.radius, 2)).toFixed()
  }
}
