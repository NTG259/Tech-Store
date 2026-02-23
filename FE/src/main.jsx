import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Users from "./page/admin/Users";
import Dashboard from "./page/admin/Dashboard";
import Orders from "./page/admin/Orders";
import Products from "./page/admin/Products";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/users",
        element: <Users></Users>,
      },
      {
        path: "/products",
        element: <Products></Products>,
      },
      {
        path: "/orders",
        element: <Orders></Orders>,
      }
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
