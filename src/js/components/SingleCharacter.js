import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import CharacterStore from "../stores/CharacterStore";

const CharacterSection = React.createClass({
  componentDidMount: function() {
    this.props.eventManager.publishLog(this.props.context.name.replace('-', ' ') + ": " + CharacterStore.getCharacterGreeting(this.props.context), 'info');
  },
  render: function() {
    return (
      <Row>
        <Col md={12}>
          <Row> <Col md={12}> <Button onClick={this.props.stackManager.popDisplay}>Back</Button> </Col> </Row>
          <Row>
            <Col md={12}>
              <Jumbotron>
                <h1>{this.props.context.name.replace('-', ' ')}</h1>
                <p>{this.props.context.description}</p>
              </Jumbotron>
            </Col> 
          </Row>
        </Col>
      </Row>
    );
  }
});

export default CharacterSection;