import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { transactionEndpoints } from '../../services/api';
import { apiConnector } from '../../services/apiconnector';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ bookingId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setInitializing(true);
      const response = await apiConnector('POST', transactionEndpoints.CREATE_PAYMENT_INTENT_API, {
        bookingId,
        amount
      });
      
      if (response.data.success && response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment. Please try again.');
      onCancel(); // Close modal on error
    } finally {
      setInitializing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        console.error('Payment failed:', error);
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        await apiConnector('POST', transactionEndpoints.CONFIRM_PAYMENT_API, {
          paymentIntentId: paymentIntent.id,
          bookingId
        });
        
        toast.success('Payment successful!');
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (initializing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Initializing Payment</h3>
            <p className="text-gray-600">Please wait while we set up your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Complete Payment</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount to pay:</span>
              <span className="text-2xl font-bold text-green-600">₹{amount}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ₹${amount}`
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Your payment is secured by Stripe</p>
          <p>We never store your card details</p>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ bookingId, amount, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        bookingId={bookingId}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default PaymentModal;