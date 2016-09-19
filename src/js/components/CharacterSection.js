import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import CharacterStore from "../stores/CharacterStore";
import SingleCharacter from "./SingleCharacter";
import DisplayActions from "../actions/DisplayActions";

const CharacterSection = React.createClass({
  getInitialState: function() {
    return {
      characters: []
    }
  },
  componentDidMount: function() {
    CharacterStore.addChangeListener(this._onChangeCharacter);
    this._onChangeCharacter();
  },
  componentWillUnmount: function() {
    CharacterStore.removeChangeListener(this._onChangeCharacter);
  },
  _onChangeCharacter: function() {
    this.state.characters = CharacterStore.getCharacters(this.props.place);
    this.setState(this.state);
  },
  switchToCharacterScreen: function(character) {
    var characterJsx = <SingleCharacter context={character} />;
    DisplayActions.pushDisplay(character.name, characterJsx);
  },
  render: function() {
    var characters = this.state.characters;
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