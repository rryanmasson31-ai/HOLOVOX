"use client";
import React, { useState } from "react";
import {
  Video,
  Cloud,
  HardDrive,
  Share2,
  Trash2,
  Play,
  Download,
  MoreVertical,
} from "lucide-react";

const RecordingsPage = () => {
  const [activeTab, setActiveTab] = useState("cloud");

  const recordings = {
    cloud: [
      {
        title: "Team Standup Meeting",
        date: "Today",
        duration: "30 min",
      },
      {
        title: "Client Discussion",
        date: "Yesterday",
        duration: "45 min",
      },
    ],
    local: [
      {
        title: "UI Review Recording",
        date: "2 days ago",
        duration: "20 min",
      },
    ],
    shared: [
      {
        title: "Project Demo",
        date: "Shared by Ali",
        duration: "50 min",
      },
    ],
    trash: [],
  };

  const tabs = [
    { key: "cloud", label: "Cloud Recordings", icon: Cloud },
    { key: "local", label: "Computer Recordings", icon: HardDrive },
    { key: "shared", label: "Shared with Me", icon: Share2 },
    { key: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-[#1A1835] text-white p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Recordings</h1>
        <p className="text-white/60 text-sm">
          Manage your meeting recordings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                activeTab === tab.key
                  ? "bg-[#E9164B]"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Recordings List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        {recordings[activeTab].length === 0 ? (
          <div className="text-center py-12">
            <Video className="mx-auto mb-4 text-white/40" size={40} />
            <p className="text-white/60">No recordings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recordings[activeTab].map((rec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition"
              >
                {/* Info */}
                <div>
                  <p className="font-medium">{rec.title}</p>
                  <p className="text-sm text-white/60">
                    {rec.date} • {rec.duration}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  
                  <button className="p-2 hover:bg-white/10 rounded-lg">
                    <Play className="w-4 h-4" />
                  </button>

                  <button className="p-2 hover:bg-white/10 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>

                  <button className="p-2 hover:bg-white/10 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingsPage;