const layerOptions = [
  {
    name: 'Conv2D',
    settings: [
      {
        label: 'Filters',
        type: 'input'
      },
      {
        label: 'Kernel Size',
        type: 'input'
      },
      {
        label: 'X Strides',
        type: 'input'
      },
      {
        label: 'Y Strides',
        type: 'input'
      }
    ]
  },
  {
    name: 'Activation',
    settings: [
      {
        label: 'Activation',
        type: 'dropdown',
        options: ['relu', 'exponential', 'linear', 'sigmoid', 'softmax', 'tanh']
      }
    ]
  },
  {
    name: 'MaxPool2D',
    settings: [
      {
        label: 'Pool Size X',
        type: 'input'
      },
      {
        label: 'Pool Size Y',
        type: 'input'
      }
    ]
  },
  { name: 'GlobalAveragePooling2D' },
  {
    name: 'Dense',
    settings: [
      {
        label: 'Units',
        type: 'input'
      }
    ]
  },
  {
    name: 'Dropout',
    settings: [
      {
        label: 'Rate',
        type: 'input'
      }
    ]
  },
  { name: 'Flatten' }
]

export default layerOptions
