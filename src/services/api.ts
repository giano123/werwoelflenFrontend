import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  LobbyState,
  CreateLobbyRequest,
  GameState,
  VoteActionRequest,
  PowerActionRequest,
  ChatMessage,
  ChatMessageRequest,
  WolfVictim,
  InspectionResult
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', data),
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', data),
  getMe: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),
};

export const lobbyAPI = {
  create: (data: CreateLobbyRequest): Promise<AxiosResponse<LobbyState>> =>
    api.post('/lobbies', data),
  getState: (code: string): Promise<AxiosResponse<LobbyState>> =>
    api.get(`/lobbies/${code}/state`),
  join: (code: string): Promise<AxiosResponse<LobbyState>> =>
    api.post(`/lobbies/${code}/join`),
  leave: (code: string): Promise<AxiosResponse<void>> =>
    api.post(`/lobbies/${code}/leave`),
  setReady: (code: string, ready: boolean): Promise<AxiosResponse<void>> =>
    api.post(`/lobbies/${code}/ready?ready=${ready}`),
  start: (code: string): Promise<AxiosResponse<GameState>> =>
    api.post(`/lobbies/${code}/start`),
};

export const gameAPI = {
  getState: (gameId: number): Promise<AxiosResponse<GameState>> =>
    api.get(`/games/${gameId}/state`),
  getByLobbyCode: (lobbyCode: string): Promise<AxiosResponse<{ id: number }>> =>
    api.get(`/games/lobby/${lobbyCode}`),
  submitVote: (gameId: number, targetPlayerId: number): Promise<AxiosResponse<void>> =>
    api.post(`/games/${gameId}/actions/vote`, { targetPlayerId } as VoteActionRequest),
  submitPower: (gameId: number, actionType: string, targetPlayerId: number): Promise<AxiosResponse<void>> =>
    api.post(`/games/${gameId}/actions/power`, { actionType, targetPlayerId } as PowerActionRequest),
  transitionToVoting: (gameId: number): Promise<AxiosResponse<void>> =>
    api.post(`/games/${gameId}/transition-to-voting`),
  getWolfVictim: (gameId: number): Promise<AxiosResponse<WolfVictim>> =>
    api.get(`/games/${gameId}/wolf-victim`),
  getInspectionResult: (gameId: number): Promise<AxiosResponse<InspectionResult>> =>
    api.get(`/games/${gameId}/inspection-result`),
  getChat: (gameId: number, since?: string): Promise<AxiosResponse<ChatMessage[]>> =>
    api.get(`/games/${gameId}/chat${since ? `?since=${since}` : ''}`),
  sendChat: (gameId: number, content: string): Promise<AxiosResponse<void>> =>
    api.post(`/games/${gameId}/chat`, { content } as ChatMessageRequest),
};

export default api;

