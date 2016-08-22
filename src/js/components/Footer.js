import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default class Footer extends React.Component {
  render () {
    return (
      <Row className='header-footer'>
         <Col md={12}>
            <p> Footer </p>
          </Col>
      </Row>
    );
  }
}