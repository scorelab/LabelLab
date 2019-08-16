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
exports.getMonths = function(num) {
	let final = []
	let currentDate = new Date()
	let currentMonth = currentDate.getMonth()

	for (
		let i = monthData.length + currentMonth;
		i > monthData.length + currentMonth - num;
		i--
	) {
		final.push(monthData[i % monthData.length])
	}

	return final
}
