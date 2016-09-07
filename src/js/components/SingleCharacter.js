import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import CharacterStore from "../stores/CharacterStore";
import ProfessionUpgrade from "./ProfessionUpgrade";

const CharacterSection = React.createClass({
  componentDidMount: function() {
    this.saySomething(CharacterStore.getCharacterGreeting(this.props.context));
  },
  saySomething: function(message, type='info') {
    this.props.eventManager.publishLog(this.props.context.name.replace('-', ' ') + ": " + message, type);
  },
  giveResource: function(res, amount) {
    this.props.resourceManager.alterResourceAmount(res, amount);
    this.saySomething("Thanks!");
  },
  render: function() {
    var hasPizza = this.props.resourceManager.getResource('pizza').amount > 0;

    return (
      <Row>
        <Col md={12}>
          <Row> <Col md={12}> <Button onClick={this.props.stackManager.popDisplay}>Back</Button> </Col> </Row>
          <Row>
            <Col md={12}>
              <Jumbotron>
                <h1>{this.props.context.name.replace('-', ' ')}</h1>
                <p>{this.props.context.description}</p>
                <Button disabled={!hasPizza} onClick={() => this.giveResource('pizza', -1)}>Give Pizza</Button>
              </Jumbotron>
            </Col> 
          </Row>
          <Row>
            <Col md={12}>
              <ProfessionUpgrade type={this.props.context.name} eventManager={this.props.eventManager} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
});

export default CharacterSection;