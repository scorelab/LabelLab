export const categoryOptions = [
    { key: 1, value: 'all', text: 'all' },
    { key: 2, value: 'general', text: 'general' },
    { key: 3, value: 'images', text: 'images' },
    { key: 4, value: 'labels', text: 'labels' },
    {
      key: 5,
      value: 'image labelling',
      text: 'image labelling'
    },
    { key: 6, value: 'models', text: 'models' }
  ],
  entityTypeOptions = [
    { key: 1, value: 'all', text: 'all' },
    { key: 2, value: 'image', text: 'image' },
    { key: 3, value: 'label', text: 'label' },
    { key: 4, value: 'model', text: 'model' },
    { key: 5, value: 'issue', text: 'issue' }
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
  statusOptions = {
    'Open': 'grey',
    'In Progress': 'blue',
    'Review': 'orange',
    'Done': 'green',
    'Closed': 'red'
  },
  priorityOptions = {
    'Critical': 'red',
    'High': 'orange',
    'Medium': 'blue',
    'Low': 'green',
  },
  options = {
    entityTypeOptions: ['image', 'label', 'model', 'issue'],
    categoryOptions: ['general', 'images', 'labels', 'image labelling', 'models'],
    statusOptions: ['Open', 'In Progress', 'Review', 'Done', 'Closed'],
    priorityOptions: ['Critical', 'High', 'Medium', 'Low']
  }