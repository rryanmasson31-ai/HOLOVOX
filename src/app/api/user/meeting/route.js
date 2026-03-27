import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import MeetingModel from "@/app/models/Meeting.model";

export async function POST(){
try {
    const {hostId,name,email,meetingId}= await request.json();

if(!hostId || !name || !email || !meetingId){
    return NextResponse.json({error : "Missing required fields"}, {status:400});
}
await connectDB();
   const meeting = await MeetingModel.create({
      meetingId,
      hostId,
      participants: [
        {
          name,
          email,
          role: "host",
        },
      ],
    });
    return NextResponse.json({
      success: true,
      meeting,
    });
} catch (error) {
     return NextResponse.json({
      success: false,
      message: error.message,
    });
}
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // agar email diya hua hai
    if (email) {
      const meeting = await MeetingModel.findOne({
        "participants.email": email,
      });

      if (!meeting) {
        return NextResponse.json({
          success: false,
          message: "Meeting not found",
        });
      }

      return NextResponse.json({
        success: true,
        meeting,
      });
    }

    // agar email nahi hai to sab meetings
    const meetings = await MeetingModel.find();

    return NextResponse.json({
      success: true,
      meetings,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { meetingId, name, email } = body;

    const meeting = await MeetingModel.findOneAndUpdate(
      { meetingId },
      {
        $push: {
          participants: {
            name,
            email,
            role: "participant",
          },
        },
      },
      { new: true }
    );

    if (!meeting) {
      return NextResponse.json({
        success: false,
        message: "Meeting not found",
      });
    }

    return NextResponse.json({
      success: true,
      meeting,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}