import React from 'react';

import { Button, Row, Col, Table } from 'react-bootstrap'
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import UpgradeStore from "../stores/UpgradeStore";
import UpgradeActions from "../actions/UpgradeActions";

const ProfessionUpgrade = React.createClass({
    getInitialState: function() {
        return {
            helperUpgrades: UpgradeStore.getAllHelperUpgrades(false)
        };
    },
    componentDidMount: function() {
        UpgradeStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        UpgradeStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.state.helperUpgrades = UpgradeStore.getAllHelperUpgrades(false);
        this.setState(this.state);
    },
    buyProfessionUpgrade: function(helperName) {
        this.props.eventManager.publishLog('Bought ' + helperName + ' upgrade!', 'success');
        var helper = UpgradeStore.getHelperUpgrade(helperName);
        ResourceActions.alterResourceAmount('pizza', helper.initialCost);
        console.log('paying ' + helper.initialCost + ' pizzas ' + ' to pay for upgrade ' + helper.name);
        helper.professions.forEach(profName => {
            console.log('altering profession ' + profName + ' rate by factor ' + helper.increaseRate);
            ResourceActions.alterProfessionRate(profName, helper.increaseRate);
            UpgradeActions.buyHelperUpgrade(helperName);
        });
    },
    render: function() {
        var pizzas = ResourceStore.getResource('pizza').amount;
        var helpers = UpgradeStore.getVisibleUpgrades(pizzas, ResourceStore.getResourceRate('pizza'));

        return (
                <Row>
                    <Col md={12}>
                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th>Upgrade Name</th>
                                    <th>Cost</th>
                                    <th>Buy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpers.map(helper =>
                                    <tr>
                                        <td>{helper.name}</td>
                                        <td>{helper.initialCost}</td>
                                        <td><Button disabled={pizzas < helper.initialCost || helper.bought} onClick={() => this.buyProfessionUpgrade(helper.name)}>
                                            {helper.bought ? 'Boughtt' : 'Buy'}
                                        </Button></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>);
    }
});

module.exports = ProfessionUpgrade;