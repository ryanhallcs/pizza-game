import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import CharacterStore from "../stores/CharacterStore";
import ProfessionUpgrade from "./ProfessionUpgrade";
import EventActions from "../actions/EventActions";
import ResourceActions from "../actions/ResourceActions";
import ResourceStore from "../stores/ResourceStore";
import DisplayActions from "../actions/DisplayActions";

const SingleCharacter = React.createClass({
  getInitialState: function() {
    return {
      pizza: ResourceStore.getResource('pizza').amount
    };
  },
  componentDidMount: function() {
    this.saySomething(CharacterStore.getCharacterGreeting(this.props.context));
    ResourceStore.addChangeListener(this._onChangeResource);
  },
  componentWillUnmount: function() {
    ResourceStore.removeChangeListener(this._onChangeResource);
  },
  _onChangeResource: function() {
    this.state.pizza = ResourceStore.getResource('pizza').amount;
    this.setState(this.state);
  },
  saySomething: function(message, type='info') {
    EventActions.publish(this.props.context.name.replace('-', ' ') + ": " + message, type);
  },
  giveResource: function(res, amount) {
    ResourceActions.alterResourceAmount(res, amount);
    this.saySomething("Thanks!");
  },
  render: function() {
    var hasPizza = this.state.pizza >= 1;

    return (
      <Row>
        <Col md={12}>
          <Row> <Col md={12}> <Button onClick={DisplayActions.popDisplay}>Back</Button> </Col> </Row>
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
              <ProfessionUpgrade type={this.props.context.name} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
});

export default SingleCharacter;