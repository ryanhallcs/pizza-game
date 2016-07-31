import React from 'react';
import { Button } from 'react-bootstrap';
var numeral = require('numeral');

const SingleResource = React.createClass({
    changeRate: function(rateDelta) {
        this.props.resourceManager.alterResourceRate(this.props.resource.name, rateDelta);
    },
    render: function() {
        var resource = this.props.resource;
        if (!resource.enabled) {
            return <div></div>;
        }

        var displayAmount = numeral(resource.amount).format('0.00');
 
        var displayRate = '';
        if (resource.ratePerSecond != 0) {
            var sign = resource.ratePerSecond > 0 ? '+' : '-';
            displayRate = '(' + sign + numeral(resource.ratePerSecond).format('0.00') + '/s) ';
        }

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

        return (
            <div> 
                {resource.name}: {displayAmount} {displayRate} {displayChangeRateNeg}{displayChangeRatePos}
            </div> 
        );
    }
});

export default SingleResource;