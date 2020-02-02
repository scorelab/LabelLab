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

exports.getLabelCounts = function(labels) {
  let countData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      }
    ]
  }
  labels.forEach(label => {
    countData.labels.push(label.name)
    label.count
      ? countData.datasets[0].data.push(label.count)
      : countData.datasets[0].data.push(0)
    countData.datasets[0].backgroundColor.push(
      '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    )
  })

  return countData
}
