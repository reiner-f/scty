import { useState, useCallback } from "react";
import { Notification } from "@/types";
import { generateId } from "@/utils/helpers";

const NOTIFICATION_DURATION = 5000;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: Notification["type"], message: string) => {
      const newNotification: Notification = {
        id: generateId("notif"),
        type,
        message,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        removeNotification(newNotification.id);
      }, NOTIFICATION_DURATION);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notifySuccess = useCallback(
    (message: string) => addNotification("success", message),
    [addNotification]
  );

  const notifyError = useCallback(
    (message: string) => addNotification("error", message),
    [addNotification]
  );

  const notifyInfo = useCallback(
    (message: string) => addNotification("info", message),
    [addNotification]
  );

  const notifyWarning = useCallback(
    (message: string) => addNotification("warning", message),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning,
  };
}
