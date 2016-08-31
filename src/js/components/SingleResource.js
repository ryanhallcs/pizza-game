import React from 'react';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
var numeral = require('numeral');

const SingleResource = React.createClass({
    changeRate: function(rateDelta) {
        this.props.resourceManager.alterResourceRate(this.props.resource.name, rateDelta);
    },
    render: function() {
        var resource = this.props.resource;
        if (!resource.enabled) {
            return <tr></tr>;
        }

        var displayAmount = numeral(resource.amount).format('0.00');
 
        var displayRate = '';
        if (resource.calculatedRate != 0) {
            var sign = resource.calculatedRate > 0 ? '+' : '-';
            displayRate = '' + sign + numeral(resource.calculatedRate).format('0.00') + '/s ';
        }

        // Profession Effects
        var professions = this.props.resourceManager.professions;
        var relevantProfessions = Object.keys(professions).filter(prof => professions[prof].resources.find(name => name == resource.name) != undefined);
        var amountSummary = relevantProfessions.map(prof => {
            var profObj = professions[prof];
            return '' + profObj.amount + ' ' + profObj.name + 's'
        }).join('\n');

        // Modifier Effects
        var relevantModifiers = relevantProfessions.reduce((prev, cur) =>
            { 
                var prof = professions[cur];
                prof.modifiers.forEach(mod => prev[mod.modifierName] = mod.rateFactor);
                return prev;
            }, {});
        var modifierSummary = Object.keys(relevantModifiers).map(modKey => modKey + ': x' + relevantModifiers[modKey]).join('\n');

        // Higher Level Resource Effects
        var relevantResources = this.props.resourceManager.getAllResources().filter(res => this.props.resourceManager.getResourceRate(res.name) > 0 
            && res.amount > 0 
            && res.cost != undefined 
            && res.cost.hasOwnProperty(resource.name));
        var costSummary = relevantResources.map(res => res.name + ': -' + numeral(res.cost[resource.name] 
            * this.props.resourceManager.getResourceRate(res.name)).format('0.00')).join(', ');

        var resourceSummary = (
            <ul>
                <li>Professions: {amountSummary}</li>
                <li>Modifiers: {modifierSummary}</li>
                <li>Costs: {costSummary}</li>
            </ul>
        );

        var devMode = true;
        var displayChangeRatePos;
        var displayChangeRateNeg;
        if (devMode) {
            displayChangeRatePos = (
                <Button bsSize="xsmall" bsStyle="success" onClick={this.changeRate.bind(this, 0.2)}>+</Button>
            );
            displayChangeRateNeg = (
                <Button bsSize="xsmall" bsStyle="danger" onClick={this.changeRate.bind(this, -0.2)}>-</Button>
            );
        }

        var popover = 
            (<Popover id="popover-trigger-hover-focus" title="Resource Summary" href="#">
                {resourceSummary}
            </Popover>);

        return (
            <tr key={resource.name}>
                <td>{resource.name}</td>
                <td>{displayAmount}</td>
                <td>
                    <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                        <Button>{displayRate}</Button>
                    </OverlayTrigger>
                </td>
            </tr>
        );
    }
});

export default SingleResource;