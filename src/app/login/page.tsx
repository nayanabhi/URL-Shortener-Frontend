"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_URL_BACKEND_VERSION}/auth/login`, {
        email,
        phone: email,
        password,
      });

      const access_token = response.data;

      // Store token in local storage
      localStorage.setItem("token", access_token);

      // Redirect to dashboard
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login to Your Account
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email or Phone"
            type="text"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Login
          </Button>

          {/* Sign-up link */}
          <Box mt={2} display="flex" justifyContent="center">
            <Link href="/signup" variant="body2">
              Don&apos;t have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
