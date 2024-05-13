import setupServer from '../src/index.js';

const run = () => {
  const server = setupServer();
  const port = process.env.SERVER_PORT || 3000;

  server.listen(port, () => console.info(`Listening on port ${port}`));
};

run();