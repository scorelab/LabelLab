import pandas as pd
from utils.classifier import Classifier

data = [['1.PNG', "text"],
        ['2.PNG', "text"],
        ['3.PNG', "text"],
        ['6.PNG', "face"],
        ['5.PNG', "text"],
        ['4.PNG', "text"],
        ['7.PNG', "face"],
        ['8.PNG', "face"]]
image_data = pd.DataFrame(data, columns = ['imagename', 'label']) 

# Create model
cl = Classifier()

# Set hyperparameters
cl.set_learning_rate(0.01)
cl.set_optimizer("Adam")
cl.set_loss("Binary Cross Entropy")
cl.set_metrics("Accuracy")
cl.set_batch_size(1)
cl.set_epochs(5)

# Add image preprocessing
cl.add_preprocessing_steps([
    {
        "name": "Center",
        "settings": [{
            "name": "Type",
            "value": "Samplewise"
        }]
    },
    {
        "name": "STD Normalization",
        "settings": [{
            "name": "Type",
            "value": "Samplewise"
        }]
    },
    {
        "name": "ZCA Whitening",
    },
    {
        "name": "Rotation Range",
        "settings": [{
            "name": "Range",
            "value": 1.1
        }]
    },
    {
        "name": "Width Shift Range",
        "settings": [{
            "name": "Range",
            "value": 1.1
        }]
    },
    {
        "name": "Height Shift Range",
        "settings": [{
            "name": "Range",
            "value": 1.1
        }]
    },
    {
        "name": "Shear Range",
        "settings": [{
            "name": "Range",
            "value": "85"
        }]
    },
    {
        "name": "Zoom Range",
        "settings": [{
            "name": "Range",
            "value": "0.23"
        }]
    },
    {
        "name": "Channel Shift Range",
        "settings": [{
            "name": "Range",
            "value": "9.2"
        }]
    },
    {
        "name": "Horizontal Flip",
    },
    {
        "name": "Vertical Flip",
    },
    {
        "name": "Rescale",
        "settings": [{
            "name": "Factor",
            "value": .1/.255
        }]
    },
], 0.2)

# Load the data
cl.load_data(data=image_data, directory="./public/uploads", test_split=0.3)

# Set the layers
cl.set_transfer_source("VGG19")
cl.add_layers(
    [
        {
            "name": "Conv2D",
            "settings": [
                {"name": "Filters", "value": 32},
                {"name": "Kernel Size", "value": 3},
                {"name": "X Strides", "value": 1},
                {"name": "Y Strides", "value": 1},
                ]
        },
        {
            "name": "Activation",
            "settings": [{"name": "Activation", "value": "relu"}]
        },
        {
            "name": "MaxPool2D",
            "settings": [
                {"name": "Pool Size X", "value": 2},
                {"name": "Pool Size Y", "value": 2},
                ]
        },
        {
            "name": "Dropout",
            "settings": [{"name": "Rate", "value": 0.1}]
        },
        {
            "name": "Flatten"
        },
        {
            "name": "Dense",
            "settings": [{"name": "Units", "value": 10}]
        },
        {
            "name": "Activation",
            "settings": [{"name": "Activation", "value": "relu"}]
        },
        {
            "name": "Dense",
            "settings": [{"name": "Units", "value": 2}]
        },
        # {
        #     "name": "GlobalAveragePooling2D"
        # }, 
    ]
)

# Compile
cl.compile()

# Fit
cl.fit()