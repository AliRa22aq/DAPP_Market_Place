import React, { useState } from 'react';


const Main = ({ products, createProduct, purchaseProduct }) => {

  const [productPrice, setProductPrice] = useState()
  const [productName, setProductName] = useState()


  const OnAddProduct = () => {
    if (!productName && !productPrice) return;

    console.log("Hello")
    const name = productName
    const price = window.web3.utils.toWei(productPrice, 'Ether')


    createProduct(name, price)
  }


  return (
    <div id="content">
      <h1>Add Product</h1>
      <div className="form-group mr-sm-2">
        <input
          type="text"
          onChange={(e) => { setProductName(e.target.value) }}
          value={productName}
          className="form-control"
          placeholder="Product Name"
          required />
      </div>
      <div className="form-group mr-sm-2">
        <input
          id="productPrice"
          type="number"
          onChange={(e) => { setProductPrice(e.target.value) }}
          value={productPrice}
          className="form-control"
          placeholder="Product Price"
          required />
      </div>
      <button type="submit" className="btn btn-primary" onClick={OnAddProduct} >Add Product</button>
      <p> </p>
      <h2>Buy Product</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Owner</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="productList">
          {products && products.map((product, key) => {
            return (
              <tr key={key}>
                <th scope="row">{product.id.toString()}</th>
                <td>{product.name}</td>
                <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                <td>{product.owner}</td>
                <td>
                  {!product.purchased
                    ? <button
                      name={product.id.toString()}
                      value={product.price.toString()}
                      onClick={(event) => {
                        purchaseProduct(event.target.name, event.target.value)
                      }}
                    >
                      Buy
                    </button>
                    : null
                  }
                </td>
              </tr>
            )
          })}          </tbody>
      </table>
    </div>
  );
}


export default Main;