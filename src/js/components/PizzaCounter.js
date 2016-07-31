import React from 'react';

const PizzaCounter = React.createClass({
    getInitialState: function() {
        return {
            pizza: 0,
            timerSet: false,
            rate: 0
        };
    },
    updatePizzaCount: function(pizzaDelta) {
        this.setState({
            pizza: this.state.pizza + pizzaDelta, 
            timerSet: this.state.timerSet,
            rate: this.state.rate
        });
    },
    makeSinglePizza: function() {
        this.updatePizzaCount(1);
    },
    makePizzaAuto: function() {
        this.updatePizzaCount(this.state.rate);
    },
    updateRate: function(rateDelta, pizzaCost) {

        var rateCost = 10;
        var rateIncrease = 0.1;
        if (this.state.rate > 0) {
            rateCost = this.state.rate * 100 / 2;
            rateIncrease = this.state.rate * 10;
        }

        if (!this.state.timerSet) {
            setInterval(this.makePizzaAuto, 1000);
        }

        this.setState({
            pizza: this.state.pizza - rateCost,
            timerSet: true,
            rate: this.state.rate + rateIncrease
        });
    },
    render: function() {
        var autoPizzaButton;
        var rateCost = 10;
        var rateIncrease = 0.1;
        if (this.state.rate > 0) {
            rateCost = this.state.rate * 100 / 2;
            rateIncrease = this.state.rate * 10;
        }

        if (this.state.pizza >= rateCost) {
            autoPizzaButton =  <button onClick={this.updateRate}> Increase pizza rate (+{rateIncrease}/s): {rateCost} pizzas </button>
        }

        var rate = "";
        if (this.state.rate > 0) {
            rate = "(+" + this.state.rate + "/s)";
        }

        return (
        <div>
            <button onClick={this.makeSinglePizza}>Make a pizza</button>
            {autoPizzaButton}
            <p> Pizza: {this.state.pizza} {rate}</p>
        </div>
        );
    }
});
export default PizzaCounter;