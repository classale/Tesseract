const cvs = document.querySelector("canvas"),
	ctx = cvs.getContext("2d")

function getAngle(angle) {
	return document.getElementById(angle).value / 10
}



cvs.width = innerWidth
cvs.height = innerHeight

var fl = 200

var angleXY = angleYZ = angleXZ = angleXW = angleYW = angleZW = 0
var angleXYIncr = angleYZIncr = angleXZIncr = angleXWIncr = angleYWIncr = angleZWIncr = 0


class Matrix {
	constructor(value) {
		this.value = value;
		this.row = value.length;
		this.column = value[0].length;
	}

	multiplication(matrix) {
		var aNumRows = this.row, aNumCols = this.column,
			bNumRows = matrix.row, bNumCols = matrix.column,
			m = new Array(aNumRows);
		for (var r = 0; r < aNumRows; ++r) {
			m[r] = new Array(bNumCols);
			for (var c = 0; c < bNumCols; ++c) {
				m[r][c] = 0;						 
				for (var i = 0; i < aNumCols; ++i) {
					m[r][c] += this.value[r][i] * matrix.value[i][c];
				}
			}
		}
		return new Matrix(m);
	}
}

function XYROT(angle) {
	let dangle = angle / 180 * Math.PI
	return new Matrix([
		[Math.cos(dangle), Math.sin(dangle), 0, 0],
		[-Math.sin(dangle), Math.cos(dangle), 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]	
	])
}

function YZROT(angle) {
	let dangle = angle / 180 * Math.PI
	return new Matrix([
		[1, 0, 0, 0],
		[0, Math.cos(dangle), Math.sin(dangle), 0],
		[0, -Math.sin(dangle), Math.cos(dangle), 0],
		[0, 0, 0, 1]	
	])
}

function XZROT(angle) {
	let dangle = angle / 180 * Math.PI
	return new Matrix([
		[Math.cos(dangle), 0, -Math.sin(dangle), 0],
		[0, 1, 0, 0],
		[Math.sin(dangle), 0, Math.cos(dangle), 0],
		[0, 0, 0, 1]	
	])
}

function XWROT(angle) {
	let dangle = angle / 180 * Math.PI
	return new Matrix([
		[Math.cos(dangle), 0, 0, Math.sin(dangle)],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[-Math.sin(dangle), 0, 0, Math.cos(dangle)]	
	])
}

function YWROT(angle) {
	let dangle = angle / 180 * Math.PI
	return new Matrix([
		[1, 0, 0, 0],
		[0, Math.cos(dangle), 0, -Math.sin(dangle)],
		[0, 0, 1, 0],
		[0, Math.sin(dangle), 0, Math.cos(dangle)]	
	])
}

function ZWROT(angle) {
	let dangle = angle / 180 * Math.PI
	return new Matrix([
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, Math.cos(dangle), -Math.sin(dangle)],
		[0, 0, Math.sin(dangle), Math.cos(dangle)]	
	])
}

class Point {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	getRot(angleXY) {
		return new Matrix([[this.x, this.y, this.z, this.w]]).multiplication(XYROT(angleXY)).multiplication(YZROT(angleYZ)).multiplication(XZROT(angleXZ)).multiplication(XWROT(angleXW)).multiplication(YWROT(angleYW)).multiplication(ZWROT(angleZW))
	}

	getX() {
		let x = this.getRot(angleXY).value[0][0]
		let z = this.getRot(angleXY).value[0][2]
		let w = this.getRot(angleXY).value[0][3]
		let nx = (x * fl) / (w + fl)
		let nz = (z * fl) / (w + fl)
		return (nx * fl) / (nz + fl)
	}

	getY() {
		let y = this.getRot(angleXY).value[0][1]
		let z = this.getRot(angleXY).value[0][2]
		let w = this.getRot(angleXY).value[0][3]
		let ny = (y * fl) / (w + fl)
		let nz = (z * fl) / (w + fl)
		return (ny * fl) / (nz + fl)
	}
}

class Tesseract {
	constructor() {
		this.Points = [
			/*	(50,50,50,50)    ,
				(50,50,50,-50)   ,
				(50,50,-50,50)   ,
				(50,50,-50,-50)  ,
				(50,-50,50,50)   ,
				(50,-50,50,-50)  ,
				(50,-50,-50,50)  ,
				(50,-50,-50,-50) ,
				(-50,50,50,50)   ,
				(-50,50,50,-50)  ,
				(-50,50,-50,50)  ,
				(-50,50,-50,-50) ,
				(-50,-50,50,50)  ,
				(-50,-50,50,-50) ,
				(-50,-50,-50,50) ,
				(-50,-50,-50,-50)*/
			new Point(50,50,50,50)    ,
			new Point(50,50,50,-50)   ,
			new Point(50,50,-50,50)   ,
			new Point(50,50,-50,-50)  ,
			new Point(50,-50,50,50)   ,
			new Point(50,-50,50,-50)  ,
			new Point(50,-50,-50,50)  ,
			new Point(50,-50,-50,-50) ,
			new Point(-50,50,50,50)   ,
			new Point(-50,50,50,-50)  ,
			new Point(-50,50,-50,50)  ,
			new Point(-50,50,-50,-50) ,
			new Point(-50,-50,50,50)  ,
			new Point(-50,-50,50,-50) ,
			new Point(-50,-50,-50,50) ,
			new Point(-50,-50,-50,-50)
		]
	}

	Edges = [
		// first square
    [ 0,  1], [ 0,  2], [ 0,  4], [ 0,  8],
              [ 1,  3], [ 1,  5], [ 1,  9],
              [ 2,  3], [ 2,  6], [ 2, 10],
                        [ 3,  7], [ 3, 11],
              [ 4,  5], [ 4,  6], [ 4, 12],
                        [ 5,  7], [ 5, 13],
                        [ 6,  7], [ 6, 14],
                                  [ 7, 15],
              [ 8,  9], [ 8, 10], [ 8, 12],
                        [ 9, 11], [ 9, 13],
                        [10, 11], [10, 14],
                                  [11, 15],
                        [12, 13], [12, 14],
                                  [13, 15],
                                  [14, 15]
	]

	draw() {
		this.Points.forEach(e => {
			ctx.beginPath()
			ctx.arc(e.getX() + 200, e.getY() + 200, 5, Math.PI * 2, 0)
			ctx.closePath()
			ctx.fillStyle = "black"
			ctx.fill()
		})
		/*for(let i = 0; i < this.Points.length; i++) {
			ctx.fillStyle = "red"
			ctx.fillText(i, this.Points[i].getX() + 200, this.Points[i].getY() + 200)
		}*/
		this.Edges.forEach(e => {
				ctx.beginPath()
				ctx.moveTo(this.Points[e[0]].getX() + 200, this.Points[e[0]].getY() + 200)
				ctx.lineTo(this.Points[e[1]].getX() + 200, this.Points[e[1]].getY() + 200)
				ctx.closePath()
				ctx.stroke()
		})
	}
	
}

tesseract = new Tesseract()

function draw() {
	ctx.clearRect(0, 0, cvs.width, cvs.height)
	tesseract.draw()
}

document.querySelectorAll(".angle").forEach(e => {
	e.onchange = () => {
		if(e.value == 0) {
			eval(`angle${e.id} = 0`)
		}
	}
})

function update() {
	angleXYIncr = getAngle("XY")
	angleYZIncr = getAngle("YZ")
	angleXZIncr = getAngle("XZ")
	angleXWIncr = getAngle("XW")
	angleYWIncr = getAngle("YW")
	angleZWIncr = getAngle("ZW")
	document.querySelectorAll("div").forEach(e => {
		eval(`e.querySelector(".value").innerHTML = " = "+angle${e.className}Incr`)
	})
	fl = Number(document.querySelector("#FL").value)
	document.querySelector(".FL").querySelector(".value").innerHTML = ` = ${fl}`
	
	angleXY += angleXYIncr
	angleYZ += angleYZIncr
	angleXZ += angleXZIncr
	angleXW += angleXWIncr
	angleYW += angleYWIncr
	angleZW += angleZWIncr
}

(function loop() {
	draw()
	update()
	requestAnimationFrame(loop)
})()