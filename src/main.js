const d3 = require('d3')

const bets = [
	{
		size: 3,
		color: 'blue'
	},
	{
		size: 2,
		color: 'green'
	},
	{
		size: 1,
		color: 'red'
	},
]
const total = bets.reduce((sum, {size}) => sum + size, 0)

const radius = 200
const strokeWidth = 5

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


const chart =
	d3.select('body')
		.append('svg:svg')
		.attr('class', 'chart')
		.attr('width', radius * 2)
		.attr('height', radius * 2)
		.append('svg:g')
		.attr('transform', `translate(${radius},${radius})`)

const betsGroups = chart
	.selectAll('g.bet')
	.data(bets)
	.enter()
	.append('svg:g')
	.attr('class', 'bet')

betsGroups
	.append('svg:path')
	.style('fill', (d, i) => {
		return d.color;
	})
	.attr('d', arc)

betsGroups
	.append('div')
	.attr('class', 'user')