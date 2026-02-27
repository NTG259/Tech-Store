import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

const router = createBrowserRouter([
  {
    path: "/store",
    Component: ECommerceHomePage,
  },
  {
    path: "/store/products",
    Component: AllProductList,
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
  // {
  //   path: "/login",
  //   element: <LoginPage></LoginPage>,
  // },
  // {
  //   path: "/register",
  //   element: <RegisterPage></RegisterPage>,
  // },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
