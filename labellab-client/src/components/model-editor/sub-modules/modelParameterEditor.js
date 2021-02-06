import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Grid,
    Icon,
    Button,
    Input,
    Popup
} from 'semantic-ui-react'

class ModelParameterEditor extends Component {
    render() {
        const { model, setModelParameter, trainModel } = this.props

        return (
            <Grid.Column width={4}>
                Epochs
                <Popup
                    content="Number of times the data is fed to the model"
                    trigger={
                        <Icon
                            name="question"
                            size="small"
                            className="question-icon"
                        ></Icon>
                    }
                />
                <br />
                <Input
                    fluid
                    placeholder="Epochs..."
                    size="mini"
                    defaultValue={model.epochs}
                    onChange={e => setModelParameter('epochs', e.target.value)}
                />
                <br />
                <br />
        Batch Size
                <Popup
                    content="Number of training examples used in one iteration"
                    trigger={
                        <Icon
                            name="question"
                            size="small"
                            className="question-icon"
                        ></Icon>
                    }
                />
                <br />
                <Input
                    fluid
                    placeholder="Batch Size..."
                    size="mini"
                    defaultValue={model.batchSize}
                    onChange={e => setModelParameter('batchSize', e.target.value)}
                />
                <br />
                <br />
        Learning Rate
                <Popup
                    content="Decides how much parameters change when the model is fed with data"
                    trigger={
                        <Icon
                            name="question"
                            size="small"
                            className="question-icon"
                            onClick={null}
                        ></Icon>
                    }
                />
                <br />
                <Input
                    fluid
                    placeholder="Learning Rate..."
                    size="mini"
                    defaultValue={model.learningRate}
                    onChange={e =>
                        setModelParameter('learningRate', e.target.value)
                    }
                />
                <br />
                <br />
                <Button positive onClick={() => trainModel(model.id)}>Train</Button>
            </Grid.Column>)
    }
}

ModelParameterEditor.propTypes = {
    setModelParameter: PropTypes.func.isRequired,
    trainModel: PropTypes.func.isRequired,
    model: PropTypes.object
}

export default ModelParameterEditor