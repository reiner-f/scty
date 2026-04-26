import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import { RequestStatus } from "@/types";

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "d MMM yyyy", { locale: ro });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "d MMM yyyy, HH:mm", { locale: ro });
  } catch {
    return dateString;
  }
}

export function getCurrentDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getCurrentDateTime(): string {
  return new Date().toISOString();
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    accepted: "Acceptată",
    rejected: "Respinsă",
    pending: "În așteptare",
  };
  return labels[status];
}

export function getStatusColor(status: RequestStatus): string {
  const colors: Record<RequestStatus, string> = {
    accepted: "bg-status-accepted",
    rejected: "bg-status-rejected",
    pending: "bg-status-pending",
  };
  return colors[status];
}

export function getStatusTextColor(status: RequestStatus): string {
  const colors: Record<RequestStatus, string> = {
    accepted: "text-status-accepted",
    rejected: "text-status-rejected",
    pending: "text-status-pending",
  };
  return colors[status];
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
