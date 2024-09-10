// Import necessary components and hooks from Agora SDK and React
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteUsers,
  useClientEvent,
} from "agora-rtc-react";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";
import AgoraRTC from "agora-rtc-sdk-ng";
import { configType } from "./config";

// Define the shape of the Agora context
interface AgoraContextType {
  localCameraTrack: ICameraVideoTrack | null;
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
  children: React.ReactNode;
}

// Create the Agora context
const AgoraContext = createContext<AgoraContextType | null>(null);

// AgoraProvider component to provide the Agora context to its children
export const AgoraProvider: React.FC<AgoraContextType> = ({ children, localCameraTrack, localMicrophoneTrack }) => (
  <AgoraContext.Provider value={{ localCameraTrack, localMicrophoneTrack, children }}>
    {children}
  </AgoraContext.Provider>
);

// Custom hook to access the Agora context
export const useAgoraContext = () => {
  const context = useContext(AgoraContext);
  if (!context) throw new Error("useAgoraContext must be used within an AgoraProvider");
  return context;
};

// AgoraManager component responsible for handling Agora-related logic and rendering UI
export const AgoraManager = ({ config, children }: { config: configType; children: React.ReactNode }) => {
  // Retrieve local camera and microphone tracks and remote users
  const agoraEngine = useRTCClient();
  const { isLoading: isLoadingCam } = useLocalCameraTrack();
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const remoteUsers = useRemoteUsers();
  const [role, setRole] = useState("host"); // Default role is host
  const [localCameraTrack, setLocalCameraTrack] = useState<ICameraVideoTrack | null>(null);
  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Join the Agora channel with the specified configuration
  useJoin({
    appid: config.appId,
    channel: config.channelName,
    token: config.rtcToken,
    uid: config.uid,
  });

  useClientEvent(agoraEngine, "user-joined", (user) => {
    console.log("The user" , user.uid , " has joined the channel");
  });

  useClientEvent(agoraEngine, "user-left", (user) => {
    console.log("The user" , user.uid , " has left the channel");
  });

  useClientEvent(agoraEngine, "user-published", (user, mediaType) => {
    console.log("The user" , user.uid , " has published media in the channel");
  });

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
    if(event.target.value === "host")
    {
      agoraEngine.setClientRole("host").then(() => {
        // Your code to handle the resolution of the promise
        console.log("Client role set to host successfully");
      }).catch((error) => {
        // Your code to handle any errors
        console.error("Error setting client role:", error);
      });    }
    else{
      agoraEngine.setClientRole("audience").then(() => {
        // Your code to handle the resolution of the promise
        console.log("Client role set to host successfully");
      }).catch((error) => {
        // Your code to handle any errors
        console.error("Error setting client role:", error);
      });
    }
  };

  console.log(2222222 , remoteUsers)

  useEffect(() => {
      const initAgora = async () => {
        // resolution = 720p
        const cameraTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: {
            frameRate: 60,
            bitrateMin: 600,
            bitrateMax: 1000,
            width : 1280,
            height: 720
          }
        });
      
         // resolution = 480p
  
        //  const cameraTrack = await AgoraRTC.createCameraVideoTrack({
        //   encoderConfig: {
        //     frameRate: 30,
        //     bitrateMin: 600,
        //     bitrateMax: 1000,
        //     width : 854,
        //     height: 480
        //   }
        // });
  
        setLocalCameraTrack(cameraTrack);
        const client = agoraEngine;
        await client.join(config.appId, config.channelName, config.rtcToken, config.uid);
        const audioTrack =  await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true,  // Bật Acoustic Echo Cancellation (Loại bỏ tiếng vọng)
          AGC: true,  // Bật Automatic Gain Control (Điều chỉnh mức âm thanh tự động)
          ANS: true,  // Bật Automatic Noise Suppression (Loại bỏ tiếng ồn tự động),
          encoderConfig: {
            bitrate: 64,  // Bitrate âm thanh (trong kbps) // 128 , 192 ,256 , 320
            sampleRate: 48000,  // Tần số mẫu âm thanh (Hz)
            // stereo  : true
          }
        });
        await client.publish([audioTrack, cameraTrack]);
      };
  
      initAgora()
    return () => {
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
    };
  }, []);
  
  // Check if devices are still loading
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div>Loading devices...</div>;

  // Render the AgoraProvider and associated UI components
  return (
    <AgoraProvider localCameraTrack={localCameraTrack} localMicrophoneTrack={localMicrophoneTrack}>
      {children}

      <div id="videos" >
        {/* Render the local video track */}
        <div className="vid" style={{ height: 300, width: 600 }}>
          <LocalVideoTrack track={localCameraTrack} play={true} />
        </div>
        {/* Render remote users' video and audio tracks */}
        {remoteUsers.map((remoteUser) => (
          <div className="vid" style={{ height: 300, width: 600 }} key={remoteUser.uid}>
            <RemoteUser user={remoteUser} playVideo={true} playAudio={true} />
          </div>
        ))}       
      </div>
    </AgoraProvider>
  );
};

// Export the AgoraManager component as the default export
export default AgoraManager;
