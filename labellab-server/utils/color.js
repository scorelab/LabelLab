const colorData = [
	'rgba(255, 99, 132, 0.6)',
	'rgba(54, 162, 235, 0.6)',
	'rgba(255, 206, 86, 0.6)',
	'rgba(75, 192, 192, 0.6)',
	'rgba(153, 102, 255, 0.6)',
	'rgba(255, 159, 64, 0.6)',
	'rgba(255, 99, 110, 0.6)',
	'rgba(54, 150, 200, 0.6)',
	'rgba(255, 150, 255, 0.6)',
	'rgba(75, 255, 255, 0.6)',
	'rgba(255, 102, 255, 0.6)',
	'rgba(255, 50, 200, 0.6)',
	'rgba(255, 255, 132, 0.6)'
]

exports.getColor = function(num) {
	let final = []
	for (let i = 1; i <= num; i++) {
		final.push(colorData[i % colorData.length])
	}
	return final
}
