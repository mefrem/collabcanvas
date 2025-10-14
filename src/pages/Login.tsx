import React from "react";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/canvas" />;
  }

  return (
    <AuthLayout
      title="CollabCanvas"
      subtitle="Sign in to start collaborating"
      switchText="Don't have an account?"
      switchLink="/signup"
      switchLinkText="Sign up"
    >
      <LoginForm />
    </AuthLayout>
  );
}
