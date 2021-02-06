from datetime import datetime
import random

colors = [
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

months = [
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

def get_color(num):
    final = []

    for i in range(num):
        final.append(colors[i%len(colors)])

    return final

def get_months(num):
    final = []
    current_date = datetime.now()
    current_month = current_date.strftime("%m")

    start = len(months) + int(current_month)
    end = start - num

    for i in range(start, end, -1):
        final.append(months[i%len(months)])
    
    return final

def get_label_data(label_data):
    final = [0 for i in range(6)]

    current_date = datetime.now()
    current_month = current_date.strftime("%m")

    for i in range(len(label_data)):
        final[int(current_month) - label_data[i]]+=1
    
    return final

def get_label_counts(labels):
    count_data = {
        "labels": [],
        "datasets": [
            {
                "data": [],
                "background_color": [],
                "hover_background_color": []
            }
        ]
    }

    for label in labels:
        count_data["labels"].append(label["label_name"])
        if label["count"]:
            count_data["datasets"][0]["data"].append(label["count"])
        else:
            count_data["datasets"][0]["data"].append(0)
        
        count_data["datasets"][0]["background_color"].append(
            "%06x" % random.randint(0, 0xFFFFFF)
        )
    
    return count_data