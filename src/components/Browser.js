import React, { Component } from 'react'
import { object } from 'prop-types'
import Web3 from 'web3'
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config'
// import { etherscan_api_key } from '../secret'
import KittyCoreABI from '../contracts/KittyCoreABI.json'

const web3 = new Web3(new Web3.providers.HttpProvider())

// 1512627536 = December 07 2017

class Browser extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      kittyID: '',
      data: []
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = async event => {
    event.preventDefault()
    const { getKitty } = this.context.drizzle.contracts.CryptoKitties.methods
    const kitty = await getKitty(this.state.kittyID).call()
    this.setState({ data: kitty })
  }

  componentDidMount() {
    const { drizzle } = this.context
    // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
    const web3 = new Web3(window.web3.currentProvider)
    // Initialize the contract instance
    const kittyContract = new web3.eth.Contract(
      KittyCoreABI, // import the contracts's ABI and use it here
      CONTRACT_ADDRESS
    )
    // Add the contract to the drizzle store
    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract
    })

  }

  render() {
    const kitty = this.state.data
    const time = new Date(0)
    return (
      <div className="browser">
        <h1>Kitty Browser</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Kitty ID:</label>
          <input
            type="number"
            name="kittyID"
            value={this.state.kittyName}
            onChange={this.handleChange}
          />
          <input type="submit" value="Find Kitty" />
        </form>
        {this.state.data.genes ? (
          <div>
            <h3>Genes</h3>
            <p>{kitty.genes}</p>
            <h3>Generation</h3>
            <p>{kitty.generation}</p>
            <h3>Birth Time</h3>
            <p>{time.setUTCSeconds(kitty.birthTime)}</p>
          </div>
        ) : null}
      </div>
    )
  }
}

Browser.contextTypes = {
  drizzle: object
}

export default Browser
