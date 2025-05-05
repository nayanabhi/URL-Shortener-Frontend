"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function CreateShortUrl() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrlPath, setShortUrlPath] = useState("");
  const [token, setToken] = useState("");
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();
  useEffect(() => {
    // Check if localStorage is available on the client-side
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Call your backend to store the URL mapping
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_URL_BACKEND_VERSION}/url/shorten`,
        {
          originalUrl,
          shortUrlPath,
          userId: "1",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSnack({
        open: true,
        message: "Short URL created successfully!",
        severity: "success",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message
          ? `Failed to create short URL! ${error.response?.data?.message}`
          : "Failed to create short URL!";

        setSnack({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      } else {
        setSnack({
          open: true,
          message: "An unknown error occurred.",
          severity: "error",
        });
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={10}
          sx={{ borderRadius: 3, padding: 3, backgroundColor: "#ffffffee" }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              fontWeight={700}
            >
              URL Shortener
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Original URL"
                  type="url"
                  fullWidth
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Custom Path"
                  fullWidth
                  required
                  value={shortUrlPath}
                  onChange={(e) => setShortUrlPath(e.target.value)}
                  variant="outlined"
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  background: "linear-gradient(to right, #43cea2, #185a9d)",
                  color: "white",
                  fontWeight: "bold",
                  paddingY: 1.5,
                }}
              >
                Create Short URL
              </Button>
            </form>

            {shortUrlPath && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  Your Short URL:&nbsp;
                  <Box
                    component="span"
                    sx={{ color: "#1976d2", wordBreak: "break-word" }}
                  >
                    <a
                      href={`/${shortUrlPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${window.location.origin}/${shortUrlPath}`}
                    </a>
                  </Box>
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Snackbar
          open={snack.open}
          autoHideDuration={4000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity} sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
