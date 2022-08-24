import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button } from 'semantic-ui-react'
import './css/notfound.css'
class NotFound extends Component {
  render() {
    return (
      <div className="main">
        <Header textAlign="center">
          <Header.Content>
            <div className='heading'>
              <div>4 </div>
              <div className='green'>0 </div>
              <div>4</div>
            </div>
            <br />
            <Header as='h2' content="OOPS! PAGE NOT FOUND" />
            <br />
            <Header as='h3' content="The page you requested could not be found" />
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

export default NotFound
