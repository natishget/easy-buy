import { AppDispatch } from "@/state/store";
import { pushNotificationSubscribeAsync } from "@/state/API/ApiSlice";
import { useDispatch } from "react-redux";

const toUint8Array = (base64: string) => {

  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
};

export async function registerPush() {
    const dispatch = useDispatch<AppDispatch>();
  if (!("serviceWorker" in navigator)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  // register and wait until active
  await navigator.serviceWorker.register("/sw.js");
  const reg = await navigator.serviceWorker.ready;

  const vapid = process.env.NEXT_PUBLIC_VAPID_KEY;
  if (!vapid) throw new Error("VAPID key missing");

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: toUint8Array(vapid),
  });

  console.log("Push subscription:", JSON.stringify(sub));

  await dispatch(pushNotificationSubscribeAsync(sub));
}
