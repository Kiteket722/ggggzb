import { FormEvent, useEffect, useState } from "react";
import { GoldAmount } from "./GoldAmount";
import { ItemPickerModal } from "./ItemPickerModal";
import { createDealTicket, GameState, LootItem } from "../lib/gameApi";
import { MIN_WITHDRAW } from "../lib/items";

type WithdrawModalProps = {
  items: LootItem[];
  onClose: () => void;
  onUpdate: (state: GameState) => void;
};

export function WithdrawModal({ items, onClose, onUpdate }: WithdrawModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");
  const [dealTime, setDealTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItems = items.filter((item) => selectedIds.has(item.id));
  const selectedTotal = selectedItems.reduce((total, item) => total + item.value, 0);
  const canSubmit = !submitting && selectedTotal >= MIN_WITHDRAW;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting && !pickerOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, submitting, pickerOpen]);

  const toggleItem = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (selectedItems.length === 0) {
      setError("Выберите хотя бы один предмет.");
      return;
    }
    if (selectedTotal < MIN_WITHDRAW) {
      setError(`Минимальная сумма вывода — ${MIN_WITHDRAW} голды.`);
      return;
    }
    if (!nickname.trim() || !location.trim() || !dealTime) {
      setError("Заполните все поля.");
      return;
    }

    setSubmitting(true);
    try {
      const state = await createDealTicket({
        kind: "withdraw",
        nickname,
        location,
        dealTime: new Date(dealTime).toISOString(),
        itemIds: selectedItems.map((item) => item.id),
      });
      onUpdate(state);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать тикет.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => !submitting && onClose()}>
        <div
          className="modal modal-wide panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="withdraw-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 id="withdraw-modal-title" className="section-title">Вывод предметов</h2>
          <p className="hint">Выбранные предметы исчезнут из инвентаря после создания тикета.</p>

          <button
            type="button"
            className="withdraw-picker-row"
            onClick={() => setPickerOpen(true)}
            disabled={submitting || items.length === 0}
          >
            <span className="withdraw-picker-label">Предметы на вывод</span>
            <span className="hint">
              {items.length === 0
                ? "В инвентаре пусто"
                : selectedItems.length > 0
                  ? `${selectedItems.length} шт.`
                  : "Не выбрано"}
            </span>
            <GoldAmount amount={selectedTotal} />
          </button>

          <form className="modal-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Ник</span>
              <input value={nickname} maxLength={32} onChange={(event) => setNickname(event.target.value)} />
            </label>
            <label className="field">
              <span>Локация</span>
              <input value={location} maxLength={64} onChange={(event) => setLocation(event.target.value)} />
            </label>
            <label className="field">
              <span>Время сделки</span>
              <input type="datetime-local" value={dealTime} onChange={(event) => setDealTime(event.target.value)} />
            </label>

            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Отмена
              </button>
              <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                {submitting ? "Создаем..." : "Создать тикет"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {pickerOpen && (
        <ItemPickerModal
          items={items}
          selectedIds={selectedIds}
          onToggle={toggleItem}
          onDone={() => setPickerOpen(false)}
        />
      )}
    </>
  );
}
