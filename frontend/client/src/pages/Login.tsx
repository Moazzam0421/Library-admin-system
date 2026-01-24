import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ added

  const handleLogin = async () => {
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            id="email"
            name="email"
            autoComplete="email"   // ✅ fixed
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password with Show / Hide */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              name="password"
              value={password}
              autoComplete="current-password" // ✅ fixed
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Button type="button" className="w-full" onClick={handleLogin}>
            Login
          </Button>

          <p
            className="text-sm text-center text-blue-600 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}