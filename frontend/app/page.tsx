"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";

interface Feed {
  _id: string;
  message: string;
  createdAt?: string;
}

export default function HomePage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchFeeds();

    socket.on("connect", () => {
      console.log("Socket Connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    socket.on("new-feed", (newFeed: Feed) => {
      setFeeds((prev) => [newFeed, ...prev]);
    });

    return () => {
      socket.off("new-feed");
    };
  }, []);

  const fetchFeeds = async () => {
    try {
      const response = await fetch("https://realtime-feed-app.onrender.com/feed");
      const data = await response.json();
      setFeeds(data);
    } catch (error) {
      setError("Failed to fetch feeds");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Realtime Feed
        </h1>
        <p className="text-slate-600">Stay updated with the latest updates in real-time.</p>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        {feeds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 italic">No updates yet. Stay tuned!</p>
          </div>
        ) : (
          feeds.map((feed) => (
            <div
              key={feed._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 text-lg leading-relaxed">
                    {feed.message}
                  </p>
                  {feed.createdAt && (
                    <span className="text-xs text-slate-400 mt-2 block">
                      {new Date(feed.createdAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}