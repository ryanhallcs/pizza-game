import React from 'react';

import { Row, Col } from 'react-bootstrap';

export default class Header extends React.Component {
  render () {
    return (
      <Row className='header-footer'>
         <Col md={12}>
            <p> Pizza Game </p>
          </Col>
      </Row>
    );
  }
}