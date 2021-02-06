import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    Card,
    Header,
    Dropdown,
    Grid
} from 'semantic-ui-react'

import ModelParameterEditor from "./modelParameterEditor"
import {
    setModelParameter,
    uploadModel,
    trainModel
} from '../../../actions'
import lossOptions from './options/lossOptions'
import optimizerOptions from './options/optimizerOptions'
import metricOptions from './options/metricOptions'

import './css/uploadBuilder.css'

class UploadBuilder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fileName: ""
        }

        this.lossDropdownOptions = this.getDropdownOptions(lossOptions)
        this.optimizerDropdownOptions = this.getDropdownOptions(optimizerOptions)
        this.metricDropdownOptions = this.getDropdownOptions(metricOptions)
    }

    getDropdownOptions = options => {
        return options.map(option => {
            return {
                key: option,
                text: option,
                value: option
            }
        })
    }

    handleUploadFile = (ev) => {
        ev.preventDefault();

        const { uploadModel, model } = this.props

        this.setState({
            file: URL.createObjectURL(this.uploadInput.files[0]),
            fileName: this.uploadInput.files[0].name
        });

        const data = new FormData();
        data.append('modelFile', this.uploadInput.files[0]);

        uploadModel(data, model.id)
    }

    render() {
        const {
            model,
            setModelParameter,
            trainModel
        } = this.props

        const { fileName } = this.state

        return (
            <Card centered fluid className="upload-model-card">
                <Card.Content>
                    <Header>Custom</Header>
                </Card.Content>
                <Card.Content>
                    <Grid columns={2}>
                        <Grid.Row>
                            <ModelParameterEditor
                                model={model}
                                setModelParameter={setModelParameter}
                                trainModel={trainModel}
                            />
                            <Grid.Column width={12}>
                                <div className="test-card-top">
                                    <input
                                        ref={(ref) => {
                                            this.uploadInput = ref;
                                        }}
                                        className="inputfile"
                                        onChange={this.handleUploadFile}
                                        type="file"
                                        id="inputfile"
                                    />
                                    <label className="ui button fluid" htmlFor="inputfile">
                                        Upload Model {fileName && `(${fileName})`}
                                    </label>
                                    {this.uploadInput && (
                                        <img className="preview-image" src={this.state.image} />
                                    )}
                                </div>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
                <Card.Content>
                    <div>
                        <Grid columns={3} divided centered>
                            <Grid.Row>
                                <Grid.Column>
                                    <Dropdown
                                        fluid
                                        placeholder="Loss..."
                                        selection
                                        defaultValue={model.loss}
                                        options={this.lossDropdownOptions}
                                        onChange={(event, { value }) =>
                                            setModelParameter('loss', value)
                                        }
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown
                                        fluid
                                        placeholder="Optimizer..."
                                        selection
                                        defaultValue={model.optimizer}
                                        options={this.optimizerDropdownOptions}
                                        onChange={(event, { value }) =>
                                            setModelParameter('optimizer', value)
                                        }
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Dropdown
                                        fluid
                                        placeholder="Metric..."
                                        selection
                                        defaultValue={model.metric}
                                        options={this.metricDropdownOptions}
                                        onChange={(event, { value }) =>
                                            setModelParameter('metric', value)
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </Card.Content>

            </Card>
        )
    }
}

UploadBuilder.propTypes = {
    setModelParameter: PropTypes.func.isRequired,
    uploadModel: PropTypes.func.isRequired,
    trainModel: PropTypes.func.isRequired,
    model: PropTypes.object
}

const mapStateToProps = state => ({
    model: state.model.model
})

export default connect(
    mapStateToProps,
    {
        setModelParameter,
        uploadModel,
        trainModel
    }
)(UploadBuilder)
