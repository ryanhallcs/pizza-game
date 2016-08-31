import React from 'react';

import { Jumbotron, Button, Row, Col, Table } from 'react-bootstrap'
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import UpgradeStore from "../stores/UpgradeStore";
import UpgradeActions from "../actions/UpgradeActions";

const Park = React.createClass({
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
        var helpers = UpgradeStore.getVisibleUpgrades(ResourceStore.getResourcesSimple(), 'park');
        
        return (
            <Row> <Col md={12}>
                <Row> <Col md={12}> <h1> You're at Humboldt Park! </h1> </Col> </Row>
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
                </Row>
             </Col> </Row>);
    }
});


export default Park;