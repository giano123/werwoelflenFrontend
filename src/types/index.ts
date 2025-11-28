export enum LobbyStatus {
  OPEN = 'OPEN',
  IN_GAME = 'IN_GAME',
  CLOSED = 'CLOSED'
}

export enum GameStatus {
  STARTING = 'STARTING',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED'
}

export enum GamePhase {
  NIGHT_WOLVES = 'NIGHT_WOLVES',
  NIGHT_SEER = 'NIGHT_SEER',
  NIGHT_WITCH = 'NIGHT_WITCH',
  DAY_DISCUSSION = 'DAY_DISCUSSION',
  DAY_VOTING = 'DAY_VOTING',
  RESULT = 'RESULT'
}

export enum RoleName {
  WEREWOLF = 'WEREWOLF',
  VILLAGER = 'VILLAGER',
  SEER = 'SEER',
  WITCH = 'WITCH',
  HUNTER = 'HUNTER'
}

export enum Faction {
  VILLAGE = 'VILLAGE',
  WOLVES = 'WOLVES',
  NEUTRAL = 'NEUTRAL'
}

export enum ActionType {
  VOTE_LYNCH = 'VOTE_LYNCH',
  VOTE_WOLF_KILL = 'VOTE_WOLF_KILL',
  SEER_INSPECT = 'SEER_INSPECT',
  WITCH_HEAL = 'WITCH_HEAL',
  WITCH_POISON = 'WITCH_POISON',
  HUNTER_SHOOT = 'HUNTER_SHOOT'
}

export enum ChatChannel {
  LOBBY = 'LOBBY',
  DAY = 'DAY',
  NIGHT_WOLVES = 'NIGHT_WOLVES',
  SYSTEM = 'SYSTEM'
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatarConfig?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LobbyMember {
  userId: number;
  username: string;
  isReady: boolean;
  avatarConfig?: string;
}

export interface LobbyState {
  id: number;
  lobbyCode: string;
  hostUserId: number;
  maxPlayers: number;
  status: LobbyStatus;
  settingsJson?: string;
  members: LobbyMember[];
}

export interface CreateLobbyRequest {
  maxPlayers?: number;
  settingsJson?: string;
}

export interface PlayerInfo {
  playerId: number;
  username: string;
  seatNumber: number;
  isAlive: boolean;
  revealedRole: boolean;
  role: RoleName | null;
}

export interface PlayerStateFlags {
  healPotion?: boolean;
  poisonPotion?: boolean;
  hunterShotAvailable?: boolean;
}

export interface WolfVictim {
  playerId: number;
  username: string;
}

export interface InspectionResult {
  playerId: number;
  username: string;
  role: RoleName;
}

export interface GameState {
  gameId: number;
  status: GameStatus;
  currentPhase: GamePhase;
  dayNumber: number;
  winnerFaction: Faction | null;
  ownRole: RoleName;
  ownFaction: Faction;
  isAlive: boolean;
  ownStateFlags: PlayerStateFlags;
  players?: PlayerInfo[];
  availableActions?: ActionType[];
  phaseDescription: string;
  wolfVictim: WolfVictim | null;
  lastInspection: InspectionResult | null;
}

export interface VoteActionRequest {
  targetPlayerId: number;
}

export interface PowerActionRequest {
  actionType: ActionType;
  targetPlayerId: number;
}

export interface ChatMessage {
  id: number;
  senderUsername: string;
  content: string;
  channel: ChatChannel;
  timestamp: string;
}

export interface ChatMessageRequest {
  content: string;
}

