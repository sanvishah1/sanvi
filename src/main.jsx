import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layout from './Layout.jsx';
import Todo from "./Todo";
import HabitTracker from './HabitTracker.jsx';
import Dashboard from './Dashboard.jsx';
import Planner from './Planner.jsx';
import './index.css';
import VisionVault from './VisionVault.jsx';

import { GlobalProvider } from "./context/GlobalContext"; // 🧠 Global context

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Todo /> },
      { path: "/habits", element: <HabitTracker /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/planner", element: <Planner /> },
      { path: "/vision-vault", element: <VisionVault /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </React.StrictMode>,
);
