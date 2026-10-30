import { DealKind, DealStatus } from "./gameApi";

export const KIND_LABELS: Record<DealKind, string> = {
  withdraw: "Вывод",
  deposit: "Пополнение",
};

export const STATUS_LABELS: Record<DealStatus, { text: string; className: string }> = {
  in_progress: { text: "В процессе", className: "badge-warning" },
  completed: { text: "Завершен", className: "badge-success" },
  rejected: { text: "Отклонен", className: "badge-error" },
};
