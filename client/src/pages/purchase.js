import React, { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Jumbotron from '../components/Jumbotron';
import { ADD_ORDER  }from '../utils/mutations';
import { idbPromise } from "../utils/helpers";

function purchase() {

const [addOrder] = useMutation(ADD_ORDER);

useEffect(() => {
  async function saveOrder() {
    const cart = await idbPromise('cart', 'get');
    const products = cart.map(item => item._id);

    if (products.length) {
        const { data } = await addOrder({ variables: { products } });
        const productData = data.addOrder.products;
      
        productData.forEach((item) => {
          idbPromise('cart', 'delete', item);
        });
      }
    
  }

  saveOrder();
}, [addOrder]);

setTimeout(function(){ window.location.assign("/")}, 3000);

    return (
      <div>
        <Jumbotron>
          <h1>Confirmed!</h1>
          <h2>
            You have successfully completed your purchase!
          </h2>
          <h2>
            Thank you! You'll now be directed back to the homepage!
          </h2>
        </Jumbotron>
      </div>
    );
};

export default purchase;