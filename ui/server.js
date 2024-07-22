const { createServer } = require('http');
const { parse } = require('url');
const express = require('express');
const path = require('path');
const process = require('process');
const chalk = require('chalk');
const log = console.log;

const newDirectory = path.join(process.cwd(), "ui");
process.chdir(newDirectory);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = express();

app.use(express.static(newDirectory));

app.get('/a', (req, res) => {
  res.sendFile(path.join(newDirectory, 'a.html'));
});

app.get('/b', (req, res) => {
  res.sendFile(path.join(newDirectory, 'b.html'));
});

app.get('*', (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  
  if (pathname === '/') {
    res.sendFile(path.join(newDirectory, 'index.html'));
  } else {
    res.status(404).send('Page not found');
  }
});

const server = createServer(app);

server.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

server.listen(port, hostname, () => {
  log(chalk.green(`>_ Running at http://${hostname}:${port}`));
});