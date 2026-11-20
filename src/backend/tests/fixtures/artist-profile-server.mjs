// Disposable E2E server only. No Supabase import, auth credentials or real data.
import express from 'express';
import cors from 'cors';
import { createArtistDatabase, postgresArtistClient } from './artistDatabase.mjs';
import { createArtistRepository } from '../../repositories/artistRepository.js';
import { createArtistRouter } from '../../routes/artistRoutes.js';

const db = await createArtistDatabase();
const repository = createArtistRepository({ getClient: async () => postgresArtistClient(db) });
const app = express();
app.use(cors({ origin: 'http://localhost:5174' }));
app.use('/api/v1/artists', createArtistRouter(repository));
app.get('/fixture-broken-image', (req, res) => res.status(404).end());
app.get('/health', (req, res) => res.json({ fixture: true }));
const server = app.listen(5098, '127.0.0.1', () => console.log('091 disposable PostgreSQL API on 5098'));
function close() { server.close(async () => { await db.close(); process.exit(0); }); }
process.on('SIGTERM', close);
process.on('SIGINT', close);
