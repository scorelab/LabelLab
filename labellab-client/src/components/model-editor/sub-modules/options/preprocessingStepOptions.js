const preprocessingStepOption = [
  {
    name: 'Center',
    settings: [
      {
        label: 'Type',
        type: 'dropdown',
        options: ['Samplewise', 'Featurewise']
      }
    ]
  },
  {
    name: 'STD Normalization',
    settings: [
      {
        label: 'Type',
        type: 'dropdown',
        options: ['Samplewise', 'Featurewise']
      }
    ]
  },
  {
    name: 'ZCA Whitening'
  },
  {
    name: 'Rotation Range',
    settings: [
      {
        label: 'Range',
        type: 'input'
      }
    ]
  },
  {
    name: 'Width Shift Range',
    settings: [
      {
        label: 'Range',
        type: 'input'
      }
    ]
  },
  {
    name: 'Height Shift Range',
    settings: [
      {
        label: 'Range',
        type: 'input'
      }
    ]
  },
  {
    name: 'Shear Range',
    settings: [
      {
        label: 'Range',
        type: 'input'
      }
    ]
  },
  {
    name: 'Zoom Range',
    settings: [
      {
        label: 'Range',
        type: 'input'
      }
    ]
  },
  {
    name: 'Channel Shift Range',
    settings: [
      {
        label: 'Range',
        type: 'input'
      }
    ]
  },
  {
    name: 'Horizontal Flip'
  },
  {
    name: 'Vertical Flip'
  },
  {
    name: 'Rescale',
    settings: [
      {
        label: 'Factor',
        type: 'input'
      }
    ]
  }
]

export default preprocessingStepOption
