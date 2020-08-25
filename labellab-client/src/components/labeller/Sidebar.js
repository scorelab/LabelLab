import React, { PureComponent } from 'react'
import {
  Header,
  List,
  Label,
  Icon,
  Button,
  Form,
  Checkbox,
  Radio,
  Select,
  Popup,
  Grid,
} from 'semantic-ui-react'
import { shortcuts, colors } from './utils'
import Hotkeys from 'react-hot-keys'

const headerIconStyle = { fontSize: '0.8em', float: 'right' }
export default class Sidebar extends PureComponent {
  render() {
    const {
      title,
      onSelect,
      labels,
      selected,
      toggles,
      onToggle,
      filter,
      style,
      onBack,
      onSkip,
      onHome,
      labeldata,
      onFormChange,
      models,
      makePrediction
    } = this.props

    const getSelectHandler = ({ label_type, id }) =>
      label_type === 'bbox' || label_type === 'polygon' ? () => onSelect(id) : null
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1em 0.5em',
          borderRight: '1px solid #ccc',
          height: '100%',
          ...style
        }}
      >
        <Header size="large" style={{ flex: '0 0 auto' }}>
          {title}
          <Popup
            flowing
            content={
              <Grid columns={2} style={{ width: '400px' }}>
                <Grid.Row>
                  <Grid.Column width={7}>Select Label:</Grid.Column>
                  <Grid.Column width={9}>
                    <Label>0</Label>-<Label>9</Label> and <Label>q</Label>,{' '}
                    <Label>w</Label>, <Label>e</Label>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={7}>Unselect Label:</Grid.Column>
                  <Grid.Column width={9}>
                    <Label>Esc</Label>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={7}>Delete Polygon:</Grid.Column>
                  <Grid.Column width={9}>
                    Select Polygon + <Label>Del</Label>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            }
            header="Shortcuts"
            trigger={<Icon link name="keyboard" style={headerIconStyle} />}
          />
        </Header>
        <List divided selection style={{ flex: 1, overflowY: 'auto' }}>
          {labels.map((label, i) =>
            ListItem({
              shortcut: shortcuts[i],
              label,
              color: colors[i],
              onSelect: getSelectHandler(label),
              selected: selected === label.id,
              disabled: filter ? !filter(label) : false,
              onToggle: onToggle,
              isToggled: toggles && toggles[label.id],
              labeldata: labeldata[label.id],
              onFormChange,
              models,
              makePrediction
            })
          )}
          <Hotkeys keyName="esc" onKeyDown={() => onSelect(null)} />
        </List>
        <div style={{ flex: '0 0 auto', display: 'flex' }}>
          <Button onClick={onHome}>Home</Button>
          <span style={{ flex: 1 }} />
          <Button onClick={onBack}>Back</Button>
          <span style={{ flex: 0.3 }} />
          <Button secondary onClick={onSkip}>
            Skip
          </Button>
        </div>
      </div>
    )
  }
}

const iconMapping = {
  bbox: 'object ungroup outline',
  polygon: 'pencil alternate'
}

const label_typeHidable = {
  bbox: true,
  polygon: true,
  text: false,
  select: false,
  'select-one': false
}
function ListItem({
  shortcut,
  label,
  onSelect,
  onToggle,
  color,
  selected = false,
  disabled = false,
  isToggled = false,
  labeldata,
  onFormChange,
  models,
  makePrediction
}) {
  const icons = []

  if (onToggle && label_typeHidable[label.label_type]) {
    icons.push(
      <Button
        key="visibility-icon"
        icon={isToggled ? 'eye' : 'eye slash'}
        style={{ padding: 5 }}
        onClick={e => {
          onToggle(label)
          e.stopPropagation()
        }}
      />
    )
  }

  const iconlabel_Type = iconMapping[label.label_type]
  const figureIcon = iconlabel_Type ? (
    <Icon
      key="label_type-icon"
      name={iconlabel_Type}
      style={{ opacity: 0.5, display: 'inline-block', marginLeft: 5 }}
    />
  ) : null

  function genSublist(label) {
    const sublistStyle = { fontSize: '12px' }
    if (label.label_type === 'text') {
      const filteredModels = (models || []).filter(
        ({ label_type }) => label_type === 'object_classification'
      )
      const options = filteredModels.map(({ id, label_name }) => ({
        value: id,
        text: label_name
      }))
      const fillInDOM =
        filteredModels.length > 0 ? (
          <div>
            Fill in using a model prediction:
            <Select
              options={options}
              placeholder="Select a model"
              onChange={async (e, { value }) => {
                const m = models.find(({ id }) => id === value)
                const text = (await makePrediction(m)).join(', ')
                onFormChange(label.id, [text])
              }}
            />
          </div>
        ) : null
      return (
        <List style={sublistStyle}>
          <List.Item>
            <Form>
              <Form.Input
                label={label.prompt}
                style={{ width: '100%' }}
                value={labeldata[0] || ''}
                onChange={(e, { value }) => onFormChange(label.id, [value])}
              />
              {fillInDOM}
            </Form>
          </List.Item>
        </List>
      )
    }

    if (label.label_type === 'select') {
      const { options } = label
      const handleChange = function (option) {
        return (e, { checked }) =>
          onFormChange(
            label.id,
            checked
              ? labeldata.concat([option])
              : labeldata.filter(x => x !== option)
          )
      }

      const items = options.map(option => (
        <List.Item key={option}>
          <Checkbox
            label={option}
            checked={labeldata.indexOf(option) !== -1}
            onChange={handleChange(option)}
          />
        </List.Item>
      ))
      return <List style={sublistStyle}>{items}</List>
    }

    if (label.label_type === 'select-one') {
      const { options } = label
      const items = options.map(option => (
        <List.Item key={option}>
          <Radio
            label={option}
            checked={labeldata.indexOf(option) !== -1}
            onChange={(e, { checked }) => onFormChange(label.id, [option])}
          />
        </List.Item>
      ))
      return <List style={sublistStyle}>{items}</List>
    }

    return null
  }

  return (
    <List.Item
      onClick={onSelect}
      disabled={disabled}
      active={selected}
      key={label.id}
      style={{ fontSize: '1.3em' }}
    >
      <Hotkeys
        keyName={shortcut}
        onKeyDown={() => !disabled && onSelect && onSelect()}
      >
        <Label color={color} horizontal>
          {shortcut}
        </Label>
        {label.label_name}
        {figureIcon}
        <span style={{ float: 'right' }}>{icons}</span>
        {genSublist(label)}
      </Hotkeys>
    </List.Item>
  )
}
