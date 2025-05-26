"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { QRCodeSVG } from "qrcode.react";
import debounce from "lodash.debounce";

export default function CreateShortUrl() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(null);
  const [shortUrlPath, setShortUrlPath] = useState("");
  const [finalUrlPath, setFinalUrlPath] = useState("");
  const [token, setToken] = useState("");
  const tokenRef = useRef(token);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const checkAlias = useCallback(
    debounce(async (value: string) => {
      console.log(54356344, value);
      if (!value || value.length > 7 || !/^[a-zA-Z0-9-]+$/.test(value)) {
        setAvailable(null);
        return;
      }

      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_URL_BACKEND_VERSION}/url/checkAlias?alias=${value}`,
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
          },
        }
      );
      const data = await res?.data;
      console.log(435345, data);
      setAvailable(data.available);
      setLoading(false);
    }, 500),
    []
  );

  const handleChange = (e) => {
    setShortUrlPath(e.target.value);
    checkAlias(e.target.value);
  };

  useEffect(() => {
    // Check if localStorage is available on the client-side
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Call your backend to store the URL mapping
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_URL_BACKEND_VERSION}/url/shorten`,
        {
          originalUrl,
          shortUrlPath,
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
      setFinalUrlPath(response?.data?.shortUrlPath);
      setQrCodeUrl(`${window.location.origin}/${response?.data?.shortUrlPath}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    } finally {
      setLoading(false);
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
      <Button
        variant="outlined"
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "#fff",
          borderColor: "#ffffff", // green border
          backgroundColor: "rgba(0, 0, 0, 0.4)", // green fill
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.6)", // slightly darker on hover
            borderColor: "#ffffff",
          },
        }}
      >
        Logout
      </Button>
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
                  autoComplete="off"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Custom Path"
                  fullWidth
                  value={shortUrlPath}
                  onChange={handleChange}
                  variant="outlined"
                  autoComplete="off"
                  error={
                    !!shortUrlPath && !/^[a-zA-Z0-9]{1,7}$/.test(shortUrlPath)
                  }
                  slotProps={{
                    htmlInput: { maxLength: 7 },
                    input: {
                      endAdornment: (
                        <Tooltip
                          title="Only a-z, A-Z and 0-9 allowed. Max 7 characters."
                          placement="top"
                          arrow
                        >
                          <InfoOutlinedIcon sx={{ ml: 1, cursor: "pointer" }} />
                        </Tooltip>
                      ),
                    },
                  }}
                />
                <div className="mt-1 text-sm">
                  {!loading && available === true && shortUrlPath && (
                    <span className="text-green-600">
                      ✅ Alias is available
                    </span>
                  )}
                  {!loading && available === false && shortUrlPath && (
                    <span className="text-red-600">❌ Alias already taken</span>
                  )}
                </div>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
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

            {finalUrlPath && (
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
                      href={`/${finalUrlPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${window.location.origin}/${finalUrlPath}`}
                    </a>
                  </Box>
                </Typography>

                {qrCodeUrl && (
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <QRCodeSVG value={qrCodeUrl} size={256} />
                  </Box>
                )}
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
