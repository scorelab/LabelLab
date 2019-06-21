import React, { Component } from "react";
import { Card, Placeholder } from "semantic-ui-react";

class CardLoader extends Component {
  render() {
    return (
      <React.Fragment>
        <Card>
          <Placeholder style={{ height: 125 }}>
            <Placeholder.Image square />
          </Placeholder>
          <Card.Content>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length="very short" />
                <Placeholder.Line length="medium" />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Card.Content>
        </Card>
        <Card>
          <Placeholder style={{ height: 125 }}>
            <Placeholder.Image square />
          </Placeholder>
          <Card.Content>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length="very short" />
                <Placeholder.Line length="medium" />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Card.Content>
        </Card>
        <Card>
          <Placeholder style={{ height: 125 }}>
            <Placeholder.Image square />
          </Placeholder>
          <Card.Content>
            <Placeholder>
              <Placeholder.Header>
                <Placeholder.Line length="very short" />
                <Placeholder.Line length="medium" />
              </Placeholder.Header>
              <Placeholder.Paragraph>
                <Placeholder.Line length="short" />
              </Placeholder.Paragraph>
            </Placeholder>
          </Card.Content>
        </Card>
      </React.Fragment>
    );
  }
}
export default CardLoader;
