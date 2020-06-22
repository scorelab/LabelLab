import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Header, Card, Grid, Button, Radio, Form } from 'semantic-ui-react'
import { setExportType } from '../../../actions/model'

import './css/exporter.css'

class Exporter extends Component {
    handleChange = (e, { value }) => {
        this.props.setExportType(value)
    }
    render() {
        const { model } = this.props
        return (
            <Card centered fluid className="exporter-card">
                <Card.Content>
                    <Header>Export</Header>
                </Card.Content>
                <Card.Content>
                    {model && <Grid columns={2}>
                        <Grid.Column textAlign="left">
                            <Form>
                                <Form.Field>
                                    <Radio
                                        label='Keras .h5'
                                        name='radioGroup'
                                        value='h5'
                                        checked={model.exportType === 'h5'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label='SavedModel'
                                        name='radioGroup'
                                        value='savedmodel'
                                        checked={model.exportType === 'savedmodel'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Radio
                                        label='ONNX'
                                        name='radioGroup'
                                        value='onnx'
                                        checked={model.exportType === 'onnx'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                        <Grid.Column><Button content="Export" /></Grid.Column>
                    </Grid>}
                </Card.Content>
            </Card>
        )
    }
}

Exporter.propTypes = {
    model: PropTypes.object,
    setExportType: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    model: state.model.model,
})

export default connect(
    mapStateToProps,
    { setExportType }
)(Exporter)
