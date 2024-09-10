import { useState } from "react";
import { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraManager } from "../agora-manager/agoraManager";
import config from "../agora-manager/config";

export function GetStarted() {
  const agoraEngine = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: config.selectedProduct }));
  
  // setting streamVideo
  //const agoraEngine = useRTCClient(AgoraRTC.createClient({ mode: 'live', codec: 'h264' }));
  // CALL VIDEO CASE 2 

 //const agoraEngine = useRTCClient(AgoraRTC.createClient({  mode: "rtc", codec: "h264" }));
  const [joined, setJoined] = useState(false);

  const handleJoinClick = () => {
    setJoined(true);
  };

  const handleLeaveClick = () => {
    setJoined(false);
  };

  const renderActionButton = () => {
    return joined ? (
      <button onClick={handleLeaveClick}>Leave</button>
    ) : (
      <button onClick={handleJoinClick}>Join</button>
    );
  };
  
  return (
    <div>
      <h1>Begin call video</h1>
      {renderActionButton()}
      {joined && (
        <AgoraRTCProvider client={agoraEngine}>
          <AgoraManager config={config} children={undefined} >
          </AgoraManager>
        </AgoraRTCProvider>
      )}
    </div>
  );
}

export default GetStarted;
