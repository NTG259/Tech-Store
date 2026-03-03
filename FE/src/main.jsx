import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App'
import './index.css'
import './global.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Users from "./page/admin/Users";
import Dashboard from "./page/admin/Dashboard";
import Orders from "./page/admin/Orders";
import Products from "./page/admin/Products";
import ECommerceHomePage from './page/client/HomePage';
import AllProductList from './page/client/ViewAllProductPage'
import ProductDetail from './page/client/ProductDetail';
import Cart from './page/client/Cart';
import CheckOut from './page/client/CheckOut';
import Profile from './page/client/Profile';
import OrdersHistory from './page/client/OrderHistory';
import Login from './page/auth/Login';
import Register from './page/auth/Register';

const router = createBrowserRouter([
  {
    path: "/",
    Component: ECommerceHomePage,
  },
  {
    path: "/products",
    Component: AllProductList,
  },
  {
    path: "/products/:id",
    Component: ProductDetail,
  },
  {
    path: "/cart",
    Component : Cart,
  },
  {
    path : "/checkout",
    Component : CheckOut,
  },
  {
    path : "/profile",
    Component : Profile,
  },
  {
    path : "/orders",
    Component : OrdersHistory,
  },
  {
    path: "/dashboard",
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/dashboard/users",
        element: <Users></Users>,
      },
      {
        path: "/dashboard/products",
        element: <Products></Products>,
      },
      {
        path: "/dashboard/orders",
        element: <Orders></Orders>,
      },
    ]
  },
  {
    path: "/login",
    Component : Login,
  },
  {
    path: "/register",
    Component : Register,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
