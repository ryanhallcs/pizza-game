import React from 'react';

import Header from "../components/Header";
import Footer from "../components/Footer";
import PizzaState from "./PizzaState";

import { Grid } from 'react-bootstrap';

export default class Main extends React.Component {
  render () {
    return (
      <Grid bsClass={'fluid fill'}>
        <Header />
        <PizzaState />
        <Footer />
      </Grid>
    );
  }
}