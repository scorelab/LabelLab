import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Header, Grid, Progress } from 'semantic-ui-react';

import { testModel } from '../../../actions/model'

import './css/modelTester.css';

class ModelTester extends React.Component {

    handleUploadImage = (ev) => {
        ev.preventDefault();

        const { testModel, model } = this.props

        this.setState({
            image: URL.createObjectURL(this.uploadInput.files[0]),
        });

        const data = new FormData();
        data.append('image', this.uploadInput.files[0]);
        data.append('modelId', model.id);

        testModel(data)
    }

    render() {

        const { testResult } = this.props;

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
                        {this.uploadInput && (
                            <img className="preview-image" src={this.state.image} />
                        )}
                    </div>
                    <br />
                    {testResult && testResult.length > 0 && (
                        <Grid centered fluid style={{ margin: '1em' }}>
                            <div className="progress-bar-list">
                                {testResult.map((prediction, index) => (
                                    <div key={index}>
                                        <Progress percent={prediction.probability * 100}>
                                            {prediction.name}
                                        </Progress>
                                    </div>
                                ))}
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
    testResult: PropTypes.array,
    testModel: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    model: state.model.model,
    testResult: state.model.testResult
})

export default connect(mapStateToProps, { testModel })(ModelTester);