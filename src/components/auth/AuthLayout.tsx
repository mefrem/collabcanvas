import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  switchText,
  switchLink,
  switchLinkText,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
        <p className="text-gray-600 text-center mb-8">{subtitle}</p>
        {children}
        <p className="text-center mt-6 text-sm">
          {switchText}{" "}
          <Link to={switchLink} className="text-blue-600 hover:underline">
            {switchLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};
