// Stub for GameSession entity — stores data in localStorage
const STORAGE_KEY = "shino_game_sessions";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export const GameSession = {
  async list(sortField, limit) {
    let sessions = load();
    if (sortField === "-created_date") {
      sessions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    return sessions.slice(0, limit);
  },

  async create(data) {
    const sessions = load();
    const session = { ...data, id: Date.now(), created_date: new Date().toISOString() };
    sessions.push(session);
    save(sessions);
    return session;
  },
};
