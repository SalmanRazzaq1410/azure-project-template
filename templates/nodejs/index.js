const express = require('express');
const cors = require('cors');

// Configuration
const config = {
  port: process.env.PORT || 3000,
  environment: process.env.ENVIRONMENT || '{{ENV}}',
  project: '{{PROJECT}}',
  org: '{{ORG}}',
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${config.project}`,
    org: config.org,
    env: config.environment,
    project: config.project,
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: config.environment,
    version: process.env.npm_package_version || '1.0.0',
  });
});

app.get('/ready', (req, res) => {
  // Add your readiness checks here (database connection, etc.)
  res.json({ status: 'ready' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.environment === 'dev' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`${config.project} running on port ${config.port} in ${config.environment} mode`);
  });
}

module.exports = app;
