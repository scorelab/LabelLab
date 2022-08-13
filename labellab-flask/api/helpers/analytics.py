import json
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

issue_labels = {
    'priority': ['Critical', 'High','Medium','Low'],
    'category': ['general','images','labels','image labelling','models'],
    'status': ['Open','In Progress','Review','Done','Closed']
}

issue_colors = {
    'priority' : [
        'rgba(219, 40, 40, 0.8)',
        'rgba(242, 113, 28, 0.8)',
        'rgba(33, 133, 208, 0.8)',
        'rgba(33, 186, 69, 0.8)',
    ],
    'category' : [
        'rgba(118, 118, 118, 1)',
        'rgba(219, 40, 40, 0.8)',
        'rgba(242, 113, 28, 0.8)',
        'rgba(33, 133, 208, 0.8)',
        'rgba(33, 186, 69, 0.8)',
    ],
    'status' : [
        'rgba(118, 118, 118, 1)',
        'rgba(33, 133, 208, 1)',
        'rgba(242, 113, 28, 1)',
        'rgba(33, 186, 69, 1)',
        'rgba(219, 40, 40, 1)',
    ]
}

issue_data_type = ['priority','category','status']

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
    dataset_labels = {}
    for label in labels:
        if label["label_name"] in dataset_labels:
            dataset_labels[label["label_name"]]+=1
        else:
            dataset_labels[label["label_name"]]=1
    
    count_data = {
        "labels": [],
        "datasets": [
            {
                "data": [],
                "backgroundColor": [],
            }
        ]
    }

    for label in dataset_labels:
        count_data["labels"].append(label)
        count_data["datasets"][0]["data"].append(dataset_labels[label])
        r = random.randint(0,255)
        g = random.randint(0,255)
        b = random.randint(0,255)
        count_data["datasets"][0]["backgroundColor"].append(
            f'rgba({r},{g},{b}, 0.8)'
        )
    
    return count_data

def get_issue_data(issues):
    map = {}
    data = {
        'priority' : [0 for i in range(4)],
        'category' : [0 for i in range(5)],
        'status' : [0 for i in range(5)]
    }
    for type in issue_data_type:
        map[type] = {}
        for i in range(len(issue_labels[type])):
            map[type][issue_labels[type][i]] = i

    for issue in issues:
        for type in issue_data_type:
            data[type][map[type][issue[type]]]+=1
    
    return data