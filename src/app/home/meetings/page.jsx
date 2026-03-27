"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  Users,
  Plus,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const MeetingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  const user = {
    meetingId: "123-456-789",
  };

  const createMeeting = () => {
    const id = uuidv4().slice(0, 6);
    router.push(`/meeting/${id}?role=host`);
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(user.meetingId);
    alert("Copied!");
  };

  const upcomingMeetings = [
    {
      title: "UI/UX Review",
      date: "Today",
      time: "3:00 PM",
    },
    {
      title: "Team Standup",
      date: "Tomorrow",
      time: "10:00 AM",
    },
  ];

  const previousMeetings = [
    {
      title: "Client Meeting",
      date: "Yesterday",
      duration: "45 min",
    },
    {
      title: "Design Discussion",
      date: "2 days ago",
      duration: "30 min",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1835] text-white p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <p className="text-white/60 text-sm">
          Manage and schedule your meetings
        </p>
      </div>

      {/* Top Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        {/* Schedule */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <Calendar className="mb-3 text-[#E9164B]" />
          <h3 className="font-semibold">Schedule Meeting</h3>
          <p className="text-sm text-white/60 mb-4">
            Plan a meeting for later
          </p>
          <button className="px-4 py-2 bg-[#E9164B] rounded-lg text-sm">
            Schedule
          </button>
        </div>

        {/* Instant */}
        <div
          onClick={createMeeting}
          className="p-6 bg-[#E9164B] rounded-2xl cursor-pointer hover:scale-105 transition"
        >
          <Video className="mb-3" />
          <h3 className="font-semibold">Start Instant Meeting</h3>
          <p className="text-sm opacity-80">
            Start meeting right now
          </p>
        </div>

        {/* Personal Room */}
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <Users className="mb-3 text-[#E9164B]" />
          <h3 className="font-semibold">Personal Room</h3>
          <p className="text-sm text-white/60 mb-3">
            Always available meeting room
          </p>

          <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
            <span className="text-sm">{user.meetingId}</span>
            <button onClick={copyMeetingId}>
              <Copy className="w-4 h-4 text-[#E9164B]" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["upcoming", "previous"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === tab
                ? "bg-[#E9164B]"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >
            {tab === "upcoming" ? "Upcoming" : "Previous"}
          </button>
        ))}
      </div>

      {/* Meetings List */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        
        {/* Upcoming */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcomingMeetings.map((meeting, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-black/20 rounded-xl"
              >
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-white/60">
                    {meeting.date} • {meeting.time}
                  </p>
                </div>

                <button className="px-4 py-2 bg-[#E9164B] rounded-lg text-sm">
                  Join
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Previous */}
        {activeTab === "previous" && (
          <div className="space-y-4">
            {previousMeetings.map((meeting, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-black/20 rounded-xl"
              >
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-white/60">
                    {meeting.date} • {meeting.duration}
                  </p>
                </div>

                <button className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                  Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State (optional future use) */}
      {/* You can show when no meetings */}
    </div>
  );
};

export default MeetingsPage;