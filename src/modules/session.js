import axios from 'axios';

class GestionnaireSession {
  constructor() {
    this.apiBase = import.meta.env.VITE_API_BASE || '/api';
    this.sessionActuelle = null;
    this.tempsDebut = null;
  }

  async demarrerSession(pseudo = null) {
    try {
      this.tempsDebut = Date.now();
      
      const response = await axios.post(`${this.apiBase}/session/start`, {
        pseudo: pseudo || null
      });
      
      this.sessionActuelle = response.data.sessionId;
      return this.sessionActuelle;
    } catch (error) {
      console.error('Erreur démarrage session:', error);
      this.sessionActuelle = this.genererIdLocal();
      return this.sessionActuelle;
    }
  }

  async enregistrerCheckpoint(sessionId, poiId) {
    if (!sessionId || !this.tempsDebut) return;

    try {
      const tempsEcoule = Date.now() - this.tempsDebut;
      
      await axios.post(`${this.apiBase}/checkpoint`, {
        sessionId,
        poiId,
        elapsedMs: tempsEcoule
      });
    } catch (error) {
      console.error('Erreur enregistrement checkpoint:', error);
    }
  }

  async terminerSession(sessionId) {
    if (!sessionId || !this.tempsDebut) return;

    try {
      const tempsTotal = Date.now() - this.tempsDebut;
      
      await axios.post(`${this.apiBase}/session/end`, {
        sessionId,
        totalMs: tempsTotal
      });
      
      this.sessionActuelle = null;
      this.tempsDebut = null;
    } catch (error) {
      console.error('Erreur fin session:', error);
    }
  }

  async obtenirLeaderboard(limite = 10) {
    try {
      const response = await axios.get(`${this.apiBase}/leaderboard?limit=${limite}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération leaderboard:', error);
      return [];
    }
  }

  genererIdLocal() {
    return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  obtenirSessionActuelle() {
    return this.sessionActuelle;
  }

  obtenirTempsDebut() {
    return this.tempsDebut;
  }
}

export const gestionnaireSession = new GestionnaireSession();
