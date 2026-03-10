import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App'
import './index.css'
import './global.css'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import store from './service/auth/store';
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
import Success from './layout/response/Success';
import Error from './layout/response/Error';
import RouteError from './layout/response/RouteError';
import Category from './page/admin/Category';

function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: ECommerceHomePage,
    errorElement: <RouteError />,
  },
  {
    path: "/products",
    Component: AllProductList,
    errorElement: <RouteError />,
  },
  {
    path: "/products/:id",
    Component: ProductDetail,
    errorElement: <RouteError />,
  },
  {
    path: "/cart",
    element: (
      <RequireAuth>
        <Cart />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/checkout",
    element: (
      <RequireAuth>
        <CheckOut />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
  },

  {
    path: "/success",
    element: (
      <RequireAuth>
        <Success />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/error",
    Component: Error,
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/orders",
    element: (
      <RequireAuth>
        <OrdersHistory />
      </RequireAuth>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/dashboard",
    element: <App />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/dashboard",
        Component : Dashboard
      },
      {
        path: "/dashboard/users",
        Component: Users,
      },
      {
        path: "/dashboard/products",
        Component: Products,
      },
      {
        path: "/dashboard/orders",
        Component: Orders,
      },
      {
        path : "/dashboard/categories",
        Component : Category,
      }
    ]
  },
  {
    path: "/login",
    Component: Login,
    errorElement: <RouteError />,
  },
  {
    path: "/register",
    Component: Register,
    errorElement: <RouteError />,
  },
  {
    path: "*",
    Component: Error,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)