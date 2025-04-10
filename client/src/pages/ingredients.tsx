import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Ingredients() {
  const [_, navigate] = useLocation();
  
  // Redirect to inventory - ingredients are managed through inventory
  useEffect(() => {
    navigate("/inventory");
  }, [navigate]);
  
  return null;
}
