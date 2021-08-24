
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import Main from './Main2'
import './App.css';
import Navbar from './Navbar2'
import Marketplace from '../abis/Marketplace.json'

const App = () => {

  const [state, setState] = useState({
    account: '',
    productCount: 0,
    products: [],
    networkId: 3,
    loading: true
  })


  // handling page rerendering
  window.ethereum.on('accountsChanged', function (accounts) {
    setState(pre => { return { ...pre, account: accounts[0] } })
  })

  window.ethereum.on('chainChanged', function (networkId) {
    setState(pre => { return { ...pre, networkId: networkId } })
  })

  window.ethereum.on('message', function (product) {
    // setState(pre => { return { ...pre, networkId: networkId } })
    console.log("Products =>", product)
  })

  const loadWeb3 = async () => {

    // detect the ethereum provider
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable() 
      window.ethereum.request({ method: 'eth_requestAccounts' })
    }
    else if (window.web3) {
      new Web3(window.ethereum)

    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

    // Get the user's Ethereum account(s)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setState(pre => { return { ...pre, account: accounts[0] } })

  }

  const loadBlockchainData = async () => {

    const web3 = window.web3

    // Detect which Ethereum network the user is connected to
    let networkId = await window.web3.eth.net.getId()
    setState(pre => { return { ...pre, networkId: networkId } })

    const networkData = Marketplace.networks[state.networkId]


    if (networkData) {
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      console.log("marketplace ", marketplace.methods)

      setState(pre => { return { ...pre, marketplace } })

      const productCount = await marketplace.methods.productCount().call()
      setState(pre => { return { ...pre, productCount: productCount.toString() } })

      // Load products
      for (var i = 1; i <= productCount.toString(); i++) {
        const product = await marketplace.methods.products(i).call()
        setState(pre => {
          return {
            ...pre,
            products: [...pre.products, product]
          }
        })

      }
      console.log("state => ", state)

      setState(pre => { return { ...pre, loading: false } })
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }

  }

  const purchaseProduct = async (id, price) => {

    console.log("input => ", id, price)

    setState(pre => { return { ...pre, loading: true } })

    state.marketplace.methods.purchaseProduct(id).send({ from: state.account, value: price })

    setState(pre => { return { ...pre, loading: false } })

  }

  const createProduct = async (name, price) => {

    console.log("input => ", name, price)

    setState(pre => { return { ...pre, loading: true } })

    state.marketplace.methods.createProduct(name, price).send({ from: state.account })

    setState(pre => { return { ...pre, loading: false } })

  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])


  // To listen events we need to do a work arround
  let web = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'))

  const myContract = new web.eth.Contract(
    Marketplace.abi,
    process.env.CONTRACT_ADDRESS,
    { from: state.account }
  )

  myContract.events.ProductCreated({})
    .on('data', async function (event) {
      console.log("ProductCreated =>", event.returnValues);
      // Do something here
    }).on('error', console.error);

  myContract.events.ProductPurchased({})
    .on('data', async function (event) {
      console.log("ProductPurchased =>", event.returnValues.id.toString());
      state.products.map(product => {
        if (event.returnValues.id.toString() == product.id) {
          return {
            ...product,
            purchased: false
          }
        }
      })
    }).on('error', console.error);


  return (
    <div>
      <Navbar account={state.account} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <Main
                products={state.products}
                createProduct={createProduct}
                purchaseProduct={purchaseProduct} />
            }
          </main>
        </div>
      </div>
    </div>
  )
}

export default App;