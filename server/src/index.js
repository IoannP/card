import { readFile, writeFile } from 'fs/promises';
import express from 'express';
import yml from 'js-yaml';
import cors from 'cors';

import cardData from '../assets/cardData.js';

export default () => {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: '*' }));

  app.get('/settings', (_req, res, next) => {
    const settingsFilePath = `${process.cwd()}/assets/cardSettings.yml`;
    readFile(settingsFilePath, 'utf8')
      .then((data) => {
        const jsonData = yml.load(data);
        res.json(jsonData);
      })
      .catch((error) => next(error));
  });
  app.put('/settings', (req, res, next) => {
    const settingsFilePath = `${process.cwd()}/assets/cardSettings.yml`;
    const settingsData = yml.dump(req.body);

    writeFile(settingsFilePath, settingsData)
      .then(() => res.status(204).end())
      .catch((error) => next(error));
  });
  app.get('/data', (_req, res) => res.json(cardData));

  app.use((_req, res, _next, error) => {
    res.status(500).json({ error: error.message });
  })  
  return app;
};
