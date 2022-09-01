import React, { useEffect } from 'react';
import checkoutItem from '../checkoutItem';
import Auth from '../../utils/auth';
import './style.css';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

const stripePromise = loadStripe('pk_test_51LXFykLV2oOJPgrv1Gzdsp4JUD7d54Q16U4Ba2whg8vIvBcC6apN8sQaU0udrKOi0ZGSXD4ybcaMzSFNbA82RXQA00BiUxeTev');

const checkout = () => {
  const state = useSelector(state => state);

  const dispatch = useDispatch(); 

  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    async function getCheckout() {
      const checkout = await idbPromise('checkout', 'get');
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...checkout] });
    };
  
    if (!state.cart.length) {
      getCart();
    }
  }, [state.checkout.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];
  
    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });
    getCheckout({
      variables: { products: productIds }
    });
  }
  
  // stripe 
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  
  if (!state.cartOpen) {
    return (
      <div className="checkout-closed" onClick={toggleCart}>
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  }


  return (
  <div className="checkout">
    <div className="close" onClick={toggleCart}>[close]</div>
    <h2>Shopping Cart</h2>
    {state.cart.length ? (
        <div>
        {state.cart.map(item => (
            <CartItem key={item._id} item={item} />
        ))}
        <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {
            Auth.loggedIn() ?
                <button onClick={submitCheckout}>
                Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
        </div>
        </div>
    ) : (
        <h3>
        Error, nothing is in your cart!
        </h3>
    )}
    </div>
  );
};

export default checkout;