import React from 'react';
import { Row, Col, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import ResourceStore from "../stores/ResourceStore";
import ResourceActions from "../actions/ResourceActions";
var numeral = require('numeral');

const SingleResource = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        ResourceStore.addChangeListener(this._onChangeResource);
    },
    componentWillUnmount: function() {
        ResourceStore.removeChangeListener(this._onChangeResource);
    },
    _onChangeResource: function() {
        this.setState(this.state);
    },
    changeRate: function(rateDelta) {
        ResourceActions.alterResourceRate(this.props.resource.name, rateDelta);
    },
    render: function() {
        var resource = this.props.resource;
        if (!resource.enabled) {
            return <tr></tr>;
        }

        var displayAmount = numeral(resource.amount).format('0.00');
        var rateSummary = ResourceStore.getRateDetails(resource.name);
 
        var displayRate = '+0.00/s';
        if (resource.calculatedRate != 0) {
            var sign = resource.calculatedRate > 0 ? '+' : '-';
            displayRate = '' + sign + numeral(resource.calculatedRate).format('0.00') + '/s ';
        }

        var professionSummary = rateSummary.professions.map(prof => {
            return '' + prof.amount + ' ' + prof.name + 's: +' + numeral(prof.ratePerSecond * prof.amount).format('0.00') + '/s';
        }).join('\n');

        var modifierSummary = rateSummary.upgrades.join(', ');
        var costSummary = rateSummary.costs.map(cost => Object.keys(cost)[0] + ': -' + numeral(cost[Object.keys(cost)[0]]).format('0.00') + '/s');
        var passiveCostSummary = rateSummary.passiveCosts.map(pCost => Object.keys(pCost)[0] + ': -' + numeral(pCost[Object.keys(pCost)[0]]).format('0.00') + '/s');

        var resourceSummary = (
            <ul>
                <li>Professions: {professionSummary}</li>
                <li>Modifiers: {modifierSummary}</li>
                <li>Costs: {costSummary}</li>
                <li>Passive costs: {passiveCostSummary}</li>
            </ul>
        );

        var popover = 
            (<Popover id="popover-trigger-hover-focus" title="Resource Summary" href="#">
                {resourceSummary}
            </Popover>);

        var imageUrl = "../../images/" + resource.name + ".png";

        return (
            <Row className="main-layout-border single-resource ">
                <Col md={6}>
                    {resource.name}
                    <br />
                    <img src={imageUrl} />
                </Col>
                <Col md={6}>
                    <h3>{displayAmount}</h3>
                    <br />
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                        <Button><h3>{displayRate}</h3></Button>
                    </OverlayTrigger>
                </Col>
            </Row>
        );
    }
});

export default SingleResource;