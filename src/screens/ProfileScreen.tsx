import { useState } from "react";
import { DealTicket, GameState } from "../lib/gameApi";
import { KIND_LABELS, STATUS_LABELS } from "../lib/dealLabels";
import { AdminTickets } from "../admin/AdminTickets";
import { DealTicketModal } from "../components/DealTicketModal";
import { GoldAmount } from "../components/GoldAmount";
import { WithdrawModal } from "../components/WithdrawModal";
import { RANK_META } from "../lib/ranks";
import { RankRewardsModal } from "../components/RankRewardsModal";

type ProfileScreenProps = {
  state: GameState;
  onUpdate: (state: GameState) => void;
  adminToken: string | null;
  onAdminAuthLost: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function TicketRow({ ticket }: { ticket: DealTicket }) {
  const status = STATUS_LABELS[ticket.status];
  return (
    <li className="list-row">
      <div>
        <p className="list-title">
          Тикет №{ticket.number} · {KIND_LABELS[ticket.kind]}
        </p>
        <p className="hint">
          {ticket.nickname} · {ticket.location} · {dateFormatter.format(new Date(ticket.deal_time))}
        </p>
        <GoldAmount amount={ticket.amount} />
      </div>
      <span className={`badge ${status.className}`}>{status.text}</span>
    </li>
  );
}

export function ProfileScreen({ state, onUpdate, adminToken, onAdminAuthLost }: ProfileScreenProps) {
  const [dealOpen, setDealOpen] = useState<"deposit" | "withdraw" | null>(null);
  const [showRanks, setShowRanks] = useState(false);

  return (
    <section className="profile-screen">
      <div>
        <h1 className="page-title">Профиль</h1>
        <p className="page-subtitle">Баланс, статистика и история сделок</p>
        {adminToken && (
          <div className="admin-banner">
            <span className="badge badge-success">Администратор</span>
            <button type="button" className="btn btn-secondary" onClick={onAdminAuthLost}>
              Выйти из админки
            </button>
          </div>
        )}
      </div>

      <div className="panel rank-panel">
        <div className="rank-header">
          <div className="rank-info">
            <span className="rank-nickname">{state.nickname ?? "Игрок"}</span>
            <button
              type="button"
              className="rank-badge rank-badge-clickable"
              style={{
                color: RANK_META[state.rank.index].color,
                borderColor: RANK_META[state.rank.index].color,
              }}
              onClick={() => setShowRanks(true)}
            >
              {state.rank.name}
            </button>
          </div>
          <span className="rank-xp-text">
            {state.rank.isMaxRank
              ? `${state.xp} XP`
              : `${state.xp} / ${state.rank.nextThreshold} XP`}
          </span>
        </div>
        <div className="rank-progress-bar">
          <div
            className="rank-progress-fill"
            style={{
              width: `${state.rank.progressPct}%`,
              background: RANK_META[state.rank.index].gradient,
            }}
          />
        </div>
        {!state.rank.isMaxRank && (
          <p className="hint rank-next-hint">
            До ранга {RANK_META[state.rank.index + 1].name}: {state.rank.nextThreshold - state.xp} XP
          </p>
        )}
      </div>

      <div className="stat-grid">
        <div className="panel stat-card">
          <span className="stat-label">Баланс</span>
          <strong className="stat-value">
            <GoldAmount amount={state.gold} />
          </strong>
          <div className="deal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setDealOpen("withdraw")}>
              Вывести
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setDealOpen("deposit")}>
              Пополнить
            </button>
          </div>
        </div>
        <div className="panel stat-card">
          <span className="stat-label">Открыто кейсов</span>
          <strong className="stat-value">{state.searches}</strong>
        </div>
        <div className="panel stat-card">
          <span className="stat-label">Предметов в инвентаре</span>
          <strong className="stat-value">{state.loot.length}</strong>
        </div>
      </div>

      <div className="panel">
        <h2 className="section-title">{adminToken ? "Тикеты игроков" : "Мои тикеты"}</h2>
        {adminToken ? (
          <AdminTickets accessToken={adminToken} onAuthLost={onAdminAuthLost} />
        ) : state.tickets.length === 0 ? (
          <p className="hint">Здесь появятся ваши тикеты на вывод и пополнение.</p>
        ) : (
          <ul className="list">
            {state.tickets.map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </ul>
        )}
      </div>

      {dealOpen === "deposit" && (
        <DealTicketModal onClose={() => setDealOpen(null)} onUpdate={onUpdate} />
      )}
      {dealOpen === "withdraw" && (
        <WithdrawModal items={state.loot} onClose={() => setDealOpen(null)} onUpdate={onUpdate} />
      )}
      {showRanks && (
        <RankRewardsModal currentIndex={state.rank.index} onClose={() => setShowRanks(false)} />
      )}
    </section>
  );
}
