export const categoryOptions = [
    { key: 1, value: 'general', text: 'general' },
    { key: 2, value: 'images', text: 'images' },
    { key: 3, value: 'labels', text: 'labels' },
    {
      key: 4,
      value: 'image labelling',
      text: 'image labelling'
    },
    { key: 5, value: 'models', text: 'models' }
  ],
  entityTypeOptions = [
    { key: 1, value: 'image', text: 'image' },
    { key: 2, value: 'label', text: 'label' },
    { key: 3, value: 'model', text: 'model' },
    { key: 4, value: 'issue', text: 'issue' }
  ],
  statusOptions = [
    { key: 1, value: 'Open', text: 'Open' },
    { key: 2, value: 'In Progress', text: 'In Progress' },
    { key: 3, value: 'Review', text: 'Review' },
    { key: 4, value: 'Done', text: 'Done' },
    { key: 5, value: 'Closed', text: 'Closed' }
  ],
  priorityOptions = [
    { key: 1, value: 'Critical', text: 'Critical' },
    { key: 2, value: 'High', text: 'High' },
    { key: 3, value: 'Medium', text: 'Medium' },
    { key: 4, value: 'Low', text: 'Low' },
  ],
  teamsOptions = [
    { key: 1, value: 'images', role: 'images', text: 'images' },
    { key: 2, value: 'labels', role: 'labels', text: 'labels' },
    {
      key: 3,
      value: 'image labelling',
      role: 'image labelling',
      text: 'image labelling'
    },
    { key: 4, value: 'models', role: 'models', text: 'models' }
  ],
  statusColorOptions = {
    'Open': 'grey',
    'In Progress': 'blue',
    'Review': 'orange',
    'Done': 'green',
    'Closed': 'red'
  },
  priorityColorOptions = {
    'Critical': 'red',
    'High': 'orange',
    'Medium': 'blue',
    'Low': 'green',
  }
  