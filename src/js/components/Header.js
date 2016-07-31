import React from 'react';

import { Row, Col } from 'react-bootstrap';

export default class Header extends React.Component {
  render () {
    return (
      <Row>
         <Col md={12}>
            <p> Header </p>
          </Col>
      </Row>
    );
  }
}