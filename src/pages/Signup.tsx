import React from "react";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { SignupForm } from "../components/auth/SignupForm";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/canvas" />;
  }

  return (
    <AuthLayout
      title="CollabCanvas"
      subtitle="Create your account to get started"
      switchText="Already have an account?"
      switchLink="/login"
      switchLinkText="Sign in"
    >
      <SignupForm />
    </AuthLayout>
  );
}
