const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');
dotenv.config();

// Import your API routes
const authRouter = require('../api/routes/auth');
const statusRouter = require('../api/routes/status');

const newDirectory = path.join(process.cwd(), 'ui');
process.chdir(newDirectory);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const log = console.log;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware to parse JSON requests
  server.use(express.json());

  // API routes
  server.use('/api/auth', authRouter);
  server.use('/api/status', statusRouter);

  server.use(express.static(path.join(__dirname, 'public')))
  server.use('/_next', express.static(path.join(__dirname, '.next')))

  // Handle Next.js requests
  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  // Create and start the HTTP server
  createServer(server)
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      log(chalk.green(`>_ Ready on http://${hostname}:${port}`));
    });
});