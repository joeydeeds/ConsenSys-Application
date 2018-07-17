import React, { Component } from 'react'
import { object } from 'prop-types'
import Web3 from 'web3'
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config'
// import { etherscan_api_key } from '../secret'
import KittyCoreABI from '../contracts/KittyCoreABI.json';

const web3 = new Web3(new Web3.providers.HttpProvider())

class Browser extends Component {
  constructor(props, context) {
    super(props)
    // this.state = {
    //   data: []
    // }
  }

  componentDidMount() {
    const { drizzle } = this.context
    const state = drizzle.store.getState()
    // console.log(state)

    // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
    const web3 = new Web3(window.web3.currentProvider);
    // Initialize the contract instance
    const kittyContract = new web3.eth.Contract(
      KittyCoreABI, // import the contracts's ABI and use it here
      CONTRACT_ADDRESS,
    );
    // Add the contract to the drizzle store
    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });
  }

  render() {
    return (
      <div className="browser">
        <h1>Kitty Browser</h1>

        {/* Input to type in the kitty ID here */}

        {/* Display Kitty info here */}
      </div>
    )
  }
}

Browser.contextTypes = {
  drizzle: object
}

export default Browser
