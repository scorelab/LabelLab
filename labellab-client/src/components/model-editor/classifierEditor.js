import React, { Component } from 'react'
import {Grid, Segment, Header} from "semantic-ui-react"

import "./css/classifierEditor.css"

class ClassifierEditor extends Component {
    render() {
        return (
          <Grid stackable columns={3}>
            <Grid.Column width={4}>
              <Segment className="classifier-column-heading">
                <Header>Classes</Header>
              </Segment>
            </Grid.Column>
            <Grid.Column width={7}>
              <Segment className="classifier-column-heading">
                <Header>Train</Header>
              </Segment>
            </Grid.Column>
            <Grid.Column width={5}>
              <Segment className="classifier-column-heading">
                <Header>Export/Test</Header>
              </Segment>
            </Grid.Column>
          </Grid>
        )
    }
}

export default ClassifierEditor;