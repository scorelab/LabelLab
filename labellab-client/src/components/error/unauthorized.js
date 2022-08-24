import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button } from 'semantic-ui-react'
import './css/notfound.css'
class Unauthorized extends Component {
  render() {
    return (
      <div className="main">
        <Header textAlign="center">
          <Header.Content>
            <div className='heading'>
              <div>4 </div>
              <div className='green'>0 </div>
              <div>1</div>
            </div>
            <br />
            <Header as='h2' content="UNAUTHORIZED" />
            <br />
            <Header as='h3' content="You do not have the required permissions to view this page" />
            <br/>
            <Link to="/">
              <Button basic color='green'>
                Go to Dashboard
              </Button>
            </Link>
          </Header.Content>
        </Header>
      </div>
    )
  }
}

export default Unauthorized
