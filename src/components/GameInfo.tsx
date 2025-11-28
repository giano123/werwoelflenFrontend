import { Card } from 'react-bootstrap';
import type { GameState, GamePhase, RoleName } from '../types';
import './GameInfo.css';

const PHASE_NAMES: Record<GamePhase, string> = {
  NIGHT_WOLVES: '🌙 Nacht - Werwölfe',
  NIGHT_SEER: '🌙 Nacht - Seher',
  NIGHT_WITCH: '🌙 Nacht - Hexe',
  DAY_DISCUSSION: '☀️ Tag - Diskussion',
  DAY_VOTING: '☀️ Tag - Abstimmung',
  RESULT: '🏆 Ergebnis'
};

const ROLE_NAMES: Record<RoleName, string> = {
  WEREWOLF: '🐺 Werwolf',
  VILLAGER: '👤 Dorfbewohner',
  SEER: '🔮 Seher',
  WITCH: '🧪 Hexe',
  HUNTER: '🏹 Jäger'
};

const FACTION_NAMES = {
  WOLVES: '🐺 Werwölfe',
  VILLAGE: '🏘️ Dorf',
  NEUTRAL: '⚖️ Neutral'
};

interface GameInfoProps {
  gameState: GameState;
}

const GameInfo = ({ gameState }: GameInfoProps) => {
  const isNightPhase = gameState.currentPhase.startsWith('NIGHT');

  return (
    <div className="game-info">
      <Card>
        <Card.Body>
          <div className="game-info-header">
            <div>
              <h4 style={{ margin: 0 }}>🎮 Spielinfo</h4>
            </div>
            <div className="day-counter">Tag {gameState.dayNumber}</div>
          </div>

          <div className={`phase-display ${isNightPhase ? 'night' : 'day'}`}>
            {PHASE_NAMES[gameState.currentPhase] || gameState.currentPhase}
          </div>
          <div className="phase-description">{gameState.phaseDescription}</div>

          <div className="info-section">
            <div className="info-label">Deine Rolle</div>
            <div className={`role-indicator role-${gameState.ownRole.toLowerCase()}`}>
              {ROLE_NAMES[gameState.ownRole] || gameState.ownRole}
            </div>
          </div>

          <div className="info-section">
            <div className="info-label">Fraktion</div>
            <div className="info-value">
              {FACTION_NAMES[gameState.ownFaction] || gameState.ownFaction}
            </div>
          </div>

          <div className="info-section">
            <div className="info-label">Status</div>
            <div className={`status-badge ${gameState.isAlive ? 'status-alive' : 'status-dead'}`}>
              {gameState.isAlive ? '✅ Lebendig' : '💀 Tot'}
            </div>
          </div>

          {gameState.ownRole === 'WITCH' && gameState.ownStateFlags && (
            <div className="info-section">
              <div className="info-label">Tränke</div>
              <div className="potion-status">
                <div className={`potion-item ${gameState.ownStateFlags.healPotion ? 'available' : 'used'}`}>
                  <span className="potion-icon">🧪</span>
                  <span className="potion-label">
                    Heilen {gameState.ownStateFlags.healPotion ? '✓' : '✗'}
                  </span>
                </div>
                <div className={`potion-item ${gameState.ownStateFlags.poisonPotion ? 'available' : 'used'}`}>
                  <span className="potion-icon">☠️</span>
                  <span className="potion-label">
                    Gift {gameState.ownStateFlags.poisonPotion ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {gameState.lastInspection && (
            <div className="inspection-result">
              <h6>🔮 Letzte Untersuchung</h6>
              <div className="info-value">
                <strong>{gameState.lastInspection.username}</strong> ist{' '}
                <strong>{ROLE_NAMES[gameState.lastInspection.role]}</strong>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default GameInfo;

