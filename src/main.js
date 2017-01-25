const d3 = require('d3')
const bets = require('./data')
const { radius, strokeWidth, imageSize } = require('./settings')

const total = bets.reduce((sum, {size}) => sum + size, 0)

// Configurate arc
let angle = 0
const arc = 
	d3.arc()
		.innerRadius(radius - strokeWidth)
		.outerRadius(radius)
		.startAngle((data, index) => {
			return angle
		})
		.endAngle(function(d, i){
			angle += d.size / total * Math.PI * 2
			return angle
		})
		.padAngle(.01)

// Create svg
const svg =
	d3.select('#bets-chart')
		.append('svg:svg')
		.attr('class', 'chart')
		.attr('width', radius * 4)
		.attr('height', radius * 3)

const chart =
	svg
		.append('svg:g')
		.attr('class', 'bets')
		.attr('transform', `translate(${radius * 2},${radius * 1.5})`)

// Create & append groups for each bet
const betsGroups = chart
	.selectAll('g.bet')
	.data(bets)
	.enter()
	.append('svg:g')
	.attr('class', 'bet')

// Create arc for each bet
betsGroups
	.append('svg:path')
	.style('fill', (d, i) => {
		return d.color;
	})
	.attr('d', arc)

// Create & append group for user in each bet
const users =
	betsGroups
		.append('g')
		.attr('class', 'user')
		.attr('transform', data => {
			const [x, y] = arc.centroid(data)

			return `translate(${x < 0 ? x - imageSize : x }, ${y < 0 ? y - imageSize : y})`
		})
		.attr('text-anchor', data => {
				const [x] = arc.centroid(data)
				return x < 0 ? 'end' : 'start'
		})

users
	.append('image')
	.attr('class', 'user__preview')
	.attr('xlink:href', data => data.preview)
	.attr('width', `${imageSize}px`)
	.attr('height', `${imageSize}px`)

const usersInfo = 
	users
		.append('g')
		.attr('class', 'user__info')
		.attr('transform', data => {
			const [x] = arc.centroid(data)
			const shift = x < 0 ? -10 : 60

			return `translate(${shift}, 20)`
		})

usersInfo
	.append('text')
	.attr('class', 'user__name')
	.text(data => data.username)

usersInfo
	.append('text')
	.attr('class', 'user__bet')
	.attr('y', '20')
	.text(data => data.size)


// 
// Timer
// 
const timer = 
	svg
		.append('g')
		.attr('class', 'timer')
		.attr('transform', `translate(${[radius * 2, radius * 1.5]})`)

const timerArcRadius = radius - 20
const timerArcAngle = 0.1 * Math.PI
const timerArc = 
	d3.arc()
		.innerRadius(timerArcRadius - strokeWidth)
		.outerRadius(timerArcRadius)
		.startAngle(data => data * timerArcAngle - timerArcRadius * Math.PI * .25)
		.endAngle(data => data * timerArcAngle + timerArcAngle - timerArcRadius * Math.PI * .25)
		.padAngle(.05)

timer
	.selectAll('g.timer')
	.data([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	.enter()
	.append('svg:path')
	.attr('id', data => data)
	.style('fill', 'gray')
	.attr('d', timerArc)