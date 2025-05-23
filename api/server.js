import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const limiteurRequetes = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(limiteurRequetes);

app.post('/api/session/start', async (req, res) => {
  try {
    const { pseudo } = req.body;
    
    let userId = null;
    if (pseudo) {
      const utilisateur = await prisma.user.upsert({
        where: { pseudo },
        update: {},
        create: { pseudo }
      });
      userId = utilisateur.id;
    }
    
    const session = await prisma.session.create({
      data: {
        userId,
        startAt: new Date()
      }
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur création session:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/checkpoint', async (req, res) => {
  try {
    const { sessionId, poiId, elapsedMs } = req.body;
    
    if (!sessionId || !poiId || typeof elapsedMs !== 'number') {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    await prisma.checkpoint.create({
      data: {
        sessionId,
        poiId,
        atMs: elapsedMs
      }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur checkpoint:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/session/end', async (req, res) => {
  try {
    const { sessionId, totalMs } = req.body;
    
    if (!sessionId || typeof totalMs !== 'number') {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        endAt: new Date(),
        durationMs: totalMs
      }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Erreur fin session:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    
    const sessions = await prisma.session.findMany({
      where: {
        durationMs: { not: null },
        endAt: { not: null }
      },
      include: {
        user: true,
        checkpoints: true
      },
      orderBy: {
        durationMs: 'asc'
      },
      take: limit
    });
    
    const leaderboard = sessions
      .filter(session => session.checkpoints.length >= 5)
      .map(session => ({
        pseudo: session.user?.pseudo || 'Anonyme',
        bestMs: session.durationMs,
        completedAt: session.endAt
      }));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Erreur leaderboard:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalSessions = await prisma.session.count();
    const completedSessions = await prisma.session.count({
      where: {
        durationMs: { not: null },
        endAt: { not: null }
      }
    });
    const totalCheckpoints = await prisma.checkpoint.count();
    
    res.json({
      totalSessions,
      completedSessions,
      totalCheckpoints,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

async function demarrerServeur() {
  try {
    await prisma.$connect();
    console.log('✅ Base de données connectée');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});

demarrerServeur();
