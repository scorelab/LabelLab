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
  Select
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
      openHotkeys,
      onBack,
      onSkip,
      onHome,
      labelData,
      onFormChange,
      models,
      makePrediction
    } = this.props

    const hotkeysButton = openHotkeys ? (
      <Icon
        link
        name="keyboard"
        style={headerIconStyle}
        onClick={openHotkeys}
      />
    ) : null

    const getSelectHandler = ({ type, id }) =>
      type === 'bbox' || type === 'polygon' ? () => onSelect(id) : null

    const modelOptions = [
      { value: 'frcnn', text: 'Faster RCNN' },
      { value: 'yolo', text: 'YOLOv3' },
      { value: 'mrcnn', text: 'Mask RCNN' }
    ]
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
          {hotkeysButton}
        </Header>
        <Header size="tiny">Generate bounding box using ML model</Header>
        <Select
          placeholder="Select a model"
          options={modelOptions}
          style={{ marginBottom: '10px' }}
        />
        <Button primary fluid>
          Generate
        </Button>
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
              labelData: labelData[label.id],
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

const typeHidable = {
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
  isToggled = false
}) {
  const icons = []

  if (onToggle && typeHidable[label.type]) {
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

  const iconType = iconMapping[label.type]
  const figureIcon = iconType ? (
    <Icon
      key="type-icon"
      name={iconType}
      style={{ opacity: 0.5, display: 'inline-block', marginLeft: 5 }}
    />
  ) : null

  return (
    <List.Item
      onClick={onSelect}
      disabled={disabled}
      active={selected}
      key={label.id}
      style={{ fontSize: '1em' }}
    >
      <Hotkeys
        keyName={shortcut}
        onKeyDown={() => !disabled && onSelect && onSelect()}
      >
        <Label color={color} horizontal>
          {shortcut}
        </Label>
        {label.name}
        {figureIcon}
      </Hotkeys>
    </List.Item>
  )
}
