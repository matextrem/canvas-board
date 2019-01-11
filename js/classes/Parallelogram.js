import Shape from './Shape.js'

export default class Parallelogram extends Shape {
  drawShape() {
    const points = this.position.points
    if (points.length === 3) {
      points.push({
        x: points[0].x + points[2].x - points[1].x,
        y: points[0].y + points[2].y - points[1].y
      })
    }

    this.context.strokeStyle = this.color
    this.context.beginPath()
    this.context.moveTo(points[0].x, points[0].y)
    this.context.lineTo(points[1].x, points[1].y)
    this.context.lineTo(points[2].x, points[2].y)
    this.context.lineTo(points[3].x, points[3].y)
    this.context.closePath()
    this.context.lineWidth = 3
    this.context.stroke()
  }

  calcArea() {
    const points = this.position.points
    const AC = Math.sqrt(
      Math.pow(points[3].x - points[0].x, 2) +
        Math.pow(points[3].y - [points[0].y], 2)
    )
    const BD = Math.sqrt(
      Math.pow(points[2].x - points[1].x, 2) +
        Math.pow(points[2].y - [points[1].y], 2)
    )
    const area = (AC * BD).toFixed()
    return area
  }

  defineShapeInfo() {
    const points = this.position.points
    const centerX = (points[0].x + points[1].x + points[2].x + points[3].x) / 4
    const centerY = (points[0].y + points[1].y + points[2].y + points[3].y) / 4
    const base = Math.max(
      Math.sqrt(
        Math.pow(points[3].x - points[0].x, 2) +
          Math.pow(points[3].y - [points[0].y], 2)
      ),
      Math.sqrt(
        Math.pow(points[1].x - points[0].x, 2) +
          Math.pow(points[1].y - [points[0].y], 2)
      )
    )
    const area = this.calcArea()
    const height = area / base

    return {
      center: {
        x: centerX,
        y: centerY
      },
      base,
      area,
      height,
      points
    }
  }
}
