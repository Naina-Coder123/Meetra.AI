"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

import { useTRPC } from "@/trpc/client";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let _client: StreamVideoClient | undefined;
    let _call: Call | undefined;

    const init = async () => {
      try {
        _client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
          user: {
            id: userId,
            name: userName,
            image: userImage,
          },
          tokenProvider: generateToken,
        });

        _call = _client.call("default", meetingId);

        await _call.camera.disable();
        await _call.microphone.disable();

        if (mounted) {
          setClient(_client);
          setCall(_call);
        }
      } catch (error) {
        console.error("CALL CONNECT ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;

      if (_call) {
        void _call.leave().catch(() => {});
      }

      if (_client) {
        void _client.disconnectUser().catch(() => {});
      }
    };
  }, [meetingId, userId, userName, userImage, generateToken]);

  if (loading || !client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};