class GestionnaireSession {
  constructor() {
    this.sessionActuelle = null;
    this.tempsDebut = null;
    this.checkpoints = [];
  }

  async demarrerSession(pseudo = null) {
    this.tempsDebut = Date.now();
    this.sessionActuelle = this.genererIdLocal();
    this.checkpoints = [];
    
    return this.sessionActuelle;
  }

  async enregistrerCheckpoint(sessionId, poiId) {
    if (!sessionId || !this.tempsDebut) return;

    const tempsEcoule = Date.now() - this.tempsDebut;
    
    // Enregistrer le checkpoint localement
    const checkpoint = {
      poiId,
      atMs: tempsEcoule,
      timestamp: new Date().toISOString()
    };
    
    this.checkpoints.push(checkpoint);
  }

  async terminerSession(sessionId) {
    if (!sessionId || !this.tempsDebut) return;
    
    this.sessionActuelle = null;
    this.tempsDebut = null;
    this.checkpoints = [];
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
