import React, { Component } from 'react'
import { object } from 'prop-types'
import Web3 from 'web3'
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config'
// import { etherscan_api_key } from '../secret'
import KittyCoreABI from '../contracts/KittyCoreABI.json'
const web3 = new Web3(new Web3.providers.HttpProvider())

class Browser extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      kittyID: '',
      data: [],
      imgUrl: '',
      notFound: false
    }
  }

  // State handling functions

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  bigKittyError = () => {
    this.setState({
      kittyID: '',
      data: [],
      imgUrl: '',
      notFound: true
    })
  }

  // Kitty Helper Functions

  getImage = () => {
    fetch(`https://api.cryptokitties.co/kitties/${this.state.kittyID}`)
      .then(res => res.json())
      .catch(err => console.log(err))
      .then(result => result ? this.setState({ imgUrl: result.image_url }) : this.bigKittyError())
  }

  convertBirthday = time => {
    const newTime = new Date(0)
    newTime.setUTCSeconds(time)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return newTime.toLocaleDateString('en-US', options)
  }

  randomKitty = async () => {
    let num = Math.random() * (862515 - 1) + 1;
    this.setState({kittyID: Math.floor(num)})
    this.fetchKitty()
  }

  fetchKitty = async () => {
    const { getKitty } = this.context.drizzle.contracts.CryptoKitties.methods
    const kitty = await getKitty(this.state.kittyID).call()
    this.setState({ data: kitty, notFound: false })
    this.getImage()
  }

  handleSubmit = event => {
    event.preventDefault()
    this.fetchKitty()
  }

  componentDidMount() {
    const { drizzle } = this.context
    const web3 = new Web3(window.web3.currentProvider)
    const kittyContract = new web3.eth.Contract(
      KittyCoreABI,
      CONTRACT_ADDRESS
    )
    drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract
    })
  }

  render() {
    const kitty = this.state.data
    return (
      <div className="browser">
        <h1>Kitty Browser</h1>
        <form onSubmit={this.handleSubmit}>
          <label>Kitty ID:</label>
          <br />
          <input
            type="number"
            name="kittyID"
            value={this.state.kittyID}
            onChange={this.handleChange}
            max="862515"
          />
          <input type="submit" value="Find Kitty" />
          <button type="button" onClick={() => this.randomKitty()}>Random Kitty</button>
        </form>

        {this.state.notFound ?  <h3>Kitty was not found!</h3> : null}

        {this.state.data.genes ? (
          <div>
            <h3>Genes</h3>
            <p>{kitty.genes}</p>
            <h3>Generation</h3>
            <p>{kitty.generation}</p>
            <h3>Birth Time</h3>
            <p>{this.convertBirthday(kitty.birthTime)}</p>
            <img src={this.state.imgUrl} alt="kitty" />
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
