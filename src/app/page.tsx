"use client";

import { useState } from "react";
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
} from "@mui/material";

export default function CreateShortUrl() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrlPath, setShortUrlPath] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

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
        }
      );
      setSnackOpen(true);
    } catch (error) {
      console.error("Error creating shortened URL:", error);
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
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Short URL created successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
