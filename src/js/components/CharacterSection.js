import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import CharacterStore from "../stores/CharacterStore";
import SingleCharacter from "./SingleCharacter";

const CharacterSection = React.createClass({
  switchToCharacterScreen: function(character) {
    this.props.stackManager.pushDisplay(character.name, SingleCharacter, character);
  },
  render: function() {
    var characters = CharacterStore.getCharacters(this.props.place);
    console.log(JSON.stringify(characters));
    var colWidth = Math.floor(12.0 / characters.length);

    return (
      <Row>
        {characters.map(character => (
          <Col key={character.name} md={colWidth}>
            <Button bsStyle="danger" bsSize="small" onClick={() => this.switchToCharacterScreen(character)}> {character.name.replace('-', ' ')} </Button>
          </Col>
        ))}
      </Row>
    );
  }
});

export default CharacterSection;