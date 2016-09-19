import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import CharacterStore from "../stores/CharacterStore";
import CharacterActions from "../actions/CharacterActions";
import ProfessionUpgrade from "./ProfessionUpgrade";
import EventActions from "../actions/EventActions";
import ResourceActions from "../actions/ResourceActions";
import ResourceStore from "../stores/ResourceStore";
import DisplayActions from "../actions/DisplayActions";

const SingleCharacter = React.createClass({
  getInitialState: function() {
    return {
      pizza: ResourceStore.getResource('pizza').amount,
      character: null
    };
  },
  componentDidMount: function() {
    this.saySomething(CharacterStore.getCharacterGreeting(this.props.context));
    ResourceStore.addChangeListener(this._onChangeResource);
    CharacterStore.addChangeListener(this._onChangeCharacter);
    this._onChangeCharacter();
  },
  componentWillUnmount: function() {
    ResourceStore.removeChangeListener(this._onChangeResource);
    CharacterStore.removeChangeListener(this._onChangeCharacter);
  },
  _onChangeResource: function() {
    this.state.pizza = ResourceStore.getResource('pizza').amount;
    this.setState(this.state);
  },
  _onChangeCharacter: function() {
    this.state.character = CharacterStore.getCharacter(this.props.context.name);
    this.setState(this.state);
  },
  saySomething: function(message, type='info') {
    EventActions.publish(this.props.context.name.replace('-', ' ') + ": " + message, type);
  },
  giveResource: function(res, amount) {
    ResourceActions.alterResourceAmount(res, -amount);
    CharacterActions.giveResource(this.props.context.name, res, amount);
    this.saySomething("Thanks!");
  },
  render: function() {
    var hasPizza = this.state.pizza >= 1;

    if (this.state.character == null) {
      return <div></div>;
    }

    var pizzas = this.state.character.given['pizza'];
    if (pizzas == null) {
      pizzas = 0;
    }

    return (
      <Row>
        <Col md={12}>
          <Row> <Col md={12}> <Button onClick={DisplayActions.popDisplay}>Back</Button> </Col> </Row>
          <Row>
            <Col md={12}>
              <Jumbotron>
                <h1>{this.state.character.name.replace('-', ' ')}</h1>
                <p>{this.state.character.description}</p>
                <p>{'Pizzas given: ' + pizzas}</p>
                <Button disabled={!hasPizza} onClick={() => this.giveResource('pizza', 1)}>Give Pizza</Button>
              </Jumbotron>
            </Col> 
          </Row>
          <Row>
            <Col md={12}>
              <ProfessionUpgrade type={this.state.character.name} />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
});

export default SingleCharacter;