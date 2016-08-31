import React from 'react';

import { Button, Row, Col, Table } from 'react-bootstrap'
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import UpgradeStore from "../stores/UpgradeStore";
import UpgradeActions from "../actions/UpgradeActions";

const ProfessionUpgrade = React.createClass({
    getInitialState: function() {
        return {
            //helperUpgrades: UpgradeStore.getAllHelperUpgrades(false)
        };
    },
    componentDidMount: function() {
        UpgradeStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        UpgradeStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        //this.state.helperUpgrades = UpgradeStore.getAllHelperUpgrades(false);
        //this.setState(this.state);
    },
    buyProfessionUpgrade: function(helperName) {
        this.props.eventManager.publishLog('Bought ' + helperName + ' upgrade!', 'success');
        var helper = UpgradeStore.getHelperUpgrade(helperName);
        Object.keys(helper.cost).forEach(costKey => ResourceActions.alterResourceAmount(costKey, -helper.cost[costKey], false));
        console.log('paying ' + Object.keys(helper.cost).map(costKey => helper.cost[costKey] + ' ' + costKey).join(', ') + ' to pay for upgrade ' + helper.name);
        helper.professions.forEach(profName => {
            console.log('altering profession ' + profName + ' rate by factor ' + helper.increaseRate);
            ResourceActions.addProfessionModifier(helperName, profName, helper.increaseRate);
            UpgradeActions.buyHelperUpgrade(helperName);
        });
    },
    render: function() {
        var helpers = UpgradeStore.getVisibleUpgrades(ResourceStore.getResourcesSimple(), 'home');

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
                                        <td>{Object.keys(helper.cost).map(costKey => costKey + ': ' + helper.cost[costKey]).join(', ')}</td>
                                        <td><Button disabled={!helper.canBuy || helper.bought} onClick={() => this.buyProfessionUpgrade(helper.name)}>
                                            {helper.bought ? 'Bought' : 'Buy'}
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