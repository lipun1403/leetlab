import React, { useState } from "react";
import { X } from "lucide-react";

const ShareModel = ({ isOpen, onClose, problemUrl }) => {
  const platforms = [
    {
      name: "Twitter",
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        problemUrl
      )}`,
      loginUrl: "https://twitter.com/login",
    },
    {
      name: "Facebook",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        problemUrl
      )}`,
      loginUrl: "https://www.facebook.com/login",
    },
    {
      name: "LinkedIn",
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        problemUrl
      )}`,
      loginUrl: "https://www.linkedin.com/login",
    },
    {
      name: "WhatsApp",
      shareUrl: `https://wa.me/?text=${encodeURIComponent(problemUrl)}`,
      loginUrl: "https://web.whatsapp.com/",
    },
    {
      name: "Telegram",
      shareUrl: `https://telegram.me/share/url?url=${encodeURIComponent(
        problemUrl
      )}`,
      loginUrl: "https://web.telegram.org/",
    },
    {
      name: "Discord",
      shareUrl: "https://discord.com/",
      loginUrl: "https://discord.com/login",
    },
  ];

const handleBack = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-300 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">Share to</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Platforms */}
        <div className="p-6 space-y-4">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex justify-between items-center"
            >
              <a
                href={platform.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-grey-100 btn-outline"
              >
                Share on {platform.name}
              </a>
              <a
                href={platform.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost bg-primary btn-sm"
              >
                Login
              </a>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="p-4 flex justify-end">
          <button onClick={handleBack} className="btn btn-ghost btn-outline">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModel;