import React, { Component } from "react";
import { connect } from "react-redux";
import { Image, List, Dimmer, Loader } from "semantic-ui-react";
import { imagePreview } from "../../actions/index";

class ImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClick = data => {
    if (data) {
      this.props.imagePreview(data);
    }
  };
  render() {
    return (
      <div>
        <List divided selection verticalAlign="middle">
          {this.props.actions.isfetching ? (
            <Dimmer active>
              <Loader indeterminate>Loading</Loader>
            </Dimmer>
          ) : null}
          {this.props.images &&
            this.props.images.map((image, index) => (
              <List.Item key={index} onClick={() => this.handleClick(image)}>
                <Image
                  size={"mini"}
                  src={`http://localhost:4000/static/uploads/${
                    image.image_url
                  }`}
                  circular
                />
                <List.Content>
                  <List.Header>{image.image_name}</List.Header>
                </List.Content>
                <br />
                {/* <Popup trigger={<Button floated='right'>Options</Button>} flowing hoverable>
								<Grid centered divided columns={2}>
									<Grid.Column textAlign='center'>
										<Button>Rename</Button>
									</Grid.Column>
									<Grid.Column textAlign='center'>
										<Button>Delete</Button>
									</Grid.Column>
								</Grid>
							</Popup> */}
              </List.Item>
            ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    images: state.projects.currentProject.images,
    actions: state.projects.projectActions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    imagePreview: data => {
      return dispatch(imagePreview(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageList);
