const monthData = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]
exports.getLabelData = function(labelData) {
	let final = []
	for (let i = 0; i < 6; i++) {
		final.push(0)
	}
	let currentDate = new Date()
	let currentMonth = currentDate.getMonth()

	for (let i = 0; i < labelData.length; i++) {
		final[currentMonth - labelData[i]]++
	}

	return final
}
