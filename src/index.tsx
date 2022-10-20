import React from "react";
import ReactDOM from "react-dom/client";
import {
  IdentityDelete,
  IdentityGenerate,
  IdentityLoad,
  Index,
  RootError,
  RootRoute,
} from "./routes/Root/RootRoute";
import { GlobalStyle } from "./components/GlobalStyle";
import { rootStore, RootStoreContext } from "./store/RootStore";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HubRoute } from "./routes/Root/HubRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <RootError />,
    children: [
      {
        path: "identity/generate",
        element: <IdentityGenerate />,
      },
      {
        path: "identity/delete",
        element: <IdentityDelete />,
      },
      {
        path: "identity/load",
        element: <IdentityLoad />,
      },
      {
        path: "/",
        element: <Index />,
      },
    ],
  },
  {
    path: "/hub/",
    element: <HubRoute />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={rootStore}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </RootStoreContext.Provider>
  </React.StrictMode>
);
