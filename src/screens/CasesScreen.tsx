import { useState } from "react";
import { CASE_COVER } from "../lib/items";
import { CaseModal } from "../components/CaseModal";
import { FreeCaseCard } from "../components/FreeCaseCard";
import { CaseView, GameState, RankUp } from "../lib/gameApi";
import { GoldAmount } from "../components/GoldAmount";

const HERO_IMAGE = "https://images.pexels.com/photos/4874342/pexels-photo-4874342.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";

type CasesScreenProps = {
  state: GameState;
  onUpdate: (state: GameState) => void;
  onRankUp: (rankUp: RankUp) => void;
};

export function CasesScreen({ state, onUpdate, onRankUp }: CasesScreenProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openCaseView: CaseView | undefined = state.cases.find((caseView) => caseView.key === openKey);

  return (
    <section className="cases-screen">
      <div className="hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="hero-overlay">
          <span className="eyebrow">Zombix</span>
          <h1 className="hero-title">Кейсы</h1>
          <p className="hero-subtitle">Открывайте кейсы за голду и выбивайте редкие награды</p>
        </div>
      </div>

      <FreeCaseCard
        freeCase={state.freeCase}
        lastFreeCaseAt={state.lastFreeCaseAt}
        serverTime={state.serverTime}
        onUpdate={onUpdate}
        onRankUp={onRankUp}
      />

      <div className="section-head">
        <h2 className="section-title">Все кейсы</h2>
        <p className="hint">Всего открыто: {state.searches}</p>
      </div>

      <ul className="case-grid">
        {state.cases.map((caseView) => (
          <li key={caseView.key}>
            <button type="button" className="case-tile" onClick={() => setOpenKey(caseView.key)}>
              <img className="case-cover" src={CASE_COVER} alt="" draggable={false} />
              <span className="case-tile-name">{caseView.name}</span>
              <span className="case-tile-price">
                <GoldAmount amount={caseView.price} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openCaseView && (
        <CaseModal
          key={openCaseView.key}
          caseView={openCaseView}
          gold={state.gold}
          onClose={() => setOpenKey(null)}
          onUpdate={onUpdate}
          onRankUp={onRankUp}
        />
      )}
    </section>
  );
}
