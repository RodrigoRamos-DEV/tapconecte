// PrivateRoute.js
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, isAdmin }) {
  const user = auth.currentUser;
  
  if (!user) return <Navigate to="/login" />;
  if (isAdmin && user.email !== "admin@exemplo.com") return <Navigate to="/login" />;
  
  return children;
}