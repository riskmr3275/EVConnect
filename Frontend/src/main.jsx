import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import rootReducers from "../src/reducer/index.jsx"
import {configureStore} from "@reduxjs/toolkit"
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.jsx'

const store=configureStore({
  reducer:rootReducers
})
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
  toastClassName={({ type }) =>
    type === "success"
      ? "bg-green-600 text-white font-medium rounded-lg p-4 shadow-lg"
      : type === "error"
      ? "bg-red-600 text-white font-medium rounded-lg p-4 shadow-lg"
      : "bg-gray-800 text-white font-medium rounded-lg p-4 shadow-lg"
  }
  bodyClassName="text-sm"
  progressClassName="bg-white"
/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
