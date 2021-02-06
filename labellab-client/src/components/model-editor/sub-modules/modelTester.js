import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Header, Grid, Progress } from 'semantic-ui-react';

import { testModel } from '../../../actions'

import './css/modelTester.css';

class ModelTester extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            image: null
        }
    }

    handleUploadImage = (ev) => {
        ev.preventDefault();

        const { testModel, model, modelId } = this.props

        this.setState({
            image: URL.createObjectURL(this.uploadInput.files[0]),
        });

        const data = new FormData();
        data.append('image', this.uploadInput.files[0]);
        data.append('modelId', model.id || modelId);

        testModel(data, model.id || modelId)
    }

    render() {

        const { testResult } = this.props;
        const { image } = this.state

        return (
            <Card centered className="model-tester-card" fluid>
                <Card.Content>
                    <Header>Test</Header>
                </Card.Content>
                <Card.Content>
                    <div className="test-card-top">
                        <input
                            ref={(ref) => {
                                this.uploadInput = ref;
                            }}
                            className="inputfile"
                            onChange={this.handleUploadImage}
                            type="file"
                            id="inputfile"
                        />
                        <label className="ui button" htmlFor="inputfile">
                            Choose a file
                        </label>
                        {this.uploadInput && image && (
                            <img className="preview-image" src={image} />
                        )}
                    </div>
                    <br />
                    {testResult && Object.keys(testResult).length > 0 && (
                        <Grid centered fluid style={{ margin: '1em' }}>
                            <div className="progress-bar-list">
                                {
                                    Object.keys(testResult).map((category, index) => {
                                        return <div key={index}>
                                            <Progress percent={testResult[category] * 100} progress>
                                                {category}
                                            </Progress>
                                        </div>
                                    })
                                }
                            </div>
                        </Grid>
                    )}
                </Card.Content>
            </Card>
        );
    }
}

ModelTester.propTypes = {
    model: PropTypes.object,
    testResult: PropTypes.object,
    testModel: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    model: state.model.model,
    testResult: state.model.testResult
})

export default connect(mapStateToProps, { testModel })(ModelTester);