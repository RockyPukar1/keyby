import { createHashRouter } from "react-router-dom";
import ProfileDetails from "./pages/ProfileDetails";
import Home from "./pages/Home";

export const router = createHashRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/profile/:id",
    element: <ProfileDetails />
  }
]);