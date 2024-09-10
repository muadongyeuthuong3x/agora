import { EncryptionMode, UID, SDK_MODE } from "agora-rtc-sdk-ng";
import { RtcRole } from "agora-access-token";

// Cấu hình cho Agora
const expirationTimeInSeconds = 3600;
const appId = "55761689fef24bb985c11f4c4d61aa80";
const appCertificate = "4aab0ae5cd954da7b1b80bd5a410b62f";
const channelName = "App call video";
const role = RtcRole.PUBLISHER; // Vai trò người dùng

const token = "007eJxTYNDe7RX/zsL28uqCtUfbZyyfd+hbg3HXIWm71cFx5gtOXbVRYDA1NTczNLOwTEtNMzJJSrK0ME02NEwzSTZJMTNMTLQwOMbxIK0hkJHh4IflDIxQCOLzMTgWFCgkJ+bkKJRlpqTmMzAAACQ1JOY="

console.log("Generated token: 55761689fef24bb985c11f4c4d61aa80", token);

export const config: configType = {
  uid: 0,
  appId: appId,
  channelName: channelName,
  appCertificate: appCertificate,
  role: role,
  rtcToken: token,
  serverUrl: "",
  proxyUrl: "http://localhost:8080/",
  tokenExpiryTime: expirationTimeInSeconds,
  token: token,
  encryptionMode: "aes-128-gcm2" as EncryptionMode,
  salt: "",
  encryptionKey: "",
  destUID: 2,
  destChannelName: "",
  destChannelToken: "",
  secondChannel: "",
  secondChannelToken: "",
  secondChannelUID: 2,
  selectedProduct: "rtc" as SDK_MODE
};

export type configType = {
  uid: UID;
  appId: string;
  channelName: string;
  rtcToken: string | undefined | any;
  role: string| number; // Đảm bảo kiểu chính xác
  appCertificate: string;
  serverUrl: string;
  proxyUrl: string;
  tokenExpiryTime: number;
  token: string;
  encryptionMode: EncryptionMode;
  salt: string;
  encryptionKey: string;
  destUID: number;
  destChannelName: string;
  destChannelToken: string;
  secondChannel: string;
  secondChannelToken: string;
  secondChannelUID: number;
  selectedProduct: SDK_MODE;
};

export default config;
