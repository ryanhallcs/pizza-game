import React from 'react';

import { Jumbotron, Button, Row, Col, Table, Popover, OverlayTrigger } from 'react-bootstrap'
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
import UpgradeStore from "../stores/UpgradeStore";
import UpgradeActions from "../actions/UpgradeActions";
import EventActions from "../actions/EventActions";

const ProfessionUpgrade = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChange);
        UpgradeStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChange);
        UpgradeStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(this.state);
    },
    buyProfessionUpgrade: function(helperName) {
        EventActions.publish('Bought ' + helperName + ' upgrade!', 'success');
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
        var helpers = UpgradeStore.getVisibleUpgrades(ResourceStore.getResourcesSimple(), this.props.type);

        var popovers = helpers.reduce((result, helper) => {
            result[helper.name] = (<Popover id="popover-trigger-hover-focus" title="Upgrade Summary" href="#">
                <ul>
                    {helper.professions.map(prof => (
                        <li key={prof}>{'Makes ' + prof + 's ' + helper.increaseRate + 'x more effective'}</li>
                    ))}
                </ul>
            </Popover>);
            return result;
        }, {});
        
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
                                <tr key={helper.name}>
                                    <td>
                                        <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popovers[helper.name]}>
                                            <p>{helper.name}</p>
                                        </OverlayTrigger>
                                    </td>
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


export default ProfessionUpgrade;