"use client";

import { useEffect, use } from "react";

export default function RedirectPage({
  params,
}: {
  params: Promise<{ endPoint: string }>;
}) {
  const { endPoint } = use(params);
  try {
    useEffect(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${process.env.NEXT_PUBLIC_URL_BACKEND_VERSION}/url/redirect?endPoint=${endPoint}`;
    }, [endPoint]);

    return <p>Redirecting...</p>;
  } catch (error) {
    console.error("Redirection failed:", error);
  }
}
