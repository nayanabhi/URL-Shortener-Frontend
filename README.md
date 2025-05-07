## 🔗 URL Shortener Service

A compact and efficient **URL Shortener Application 🚀 — ideal for generating and managing short links for long URLs.

### ✨ Features

- 🔐 **Shorten long URLs** into easy-to-share links
- 🚀 **Fast redirection** from short URL to original link
- 🧩 **Modular & scalable** NestJS architecture
-  ⚡ **Rate Limiting & Caching** using **Redis** to prevent abuse and improve performance
-  🌐 **Frontend built with Next.js** for creating, managing, and previewing shortened URLs via a sleek UI

---

### 📌 Example

```http
POST /shorten
Body: { "url": "https://example.com/very/long/url" }

Response:
{
  "shortUrl": `${domain}/abc123`
}

GET /abc123
→ Redirects to: https://example.com/very/long/url

```

## 🛠 Tech Stack

- 🌐 **NestJS** — Backend framework
- 🗄️ **PostgreSQL / MongoDB / Redis** — (Optional) for URL storage
- ⚙️ **TypeScript** — Static typing and maintainability
-  🧠 **Redis** — Used for rate limiting and caching
- 🖼️ **Next.js** — Frontend for managing and previewing shortened URLs

---

## 📚 Extendable Features

This service is designed to be extensible. You can easily add:

- ✅ **Authentication & authorization** (e.g., API key-based access)
- 📈 **Detailed analytics** (click counts, referrers, geolocation)
- 🗓️ **URL expiration dates** or limited-use links
- 📷 **QR code generation** for shortened URLs
- 📬 **Email or SMS** link sharing integrations
-  ♻️ **Auto-expiry** support for temporary URLs (if implemented)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
