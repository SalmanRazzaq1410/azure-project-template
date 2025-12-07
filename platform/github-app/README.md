# Phoenix Project Initializer - GitHub App

A GitHub App that automates project initialization when repositories are created from the azure-project-template.

## Features

- **Auto-detection**: Detects when repos are created from the template
- **Smart initialization**: Auto-configures if repo name follows the pattern
- **Slash commands**: Users can run `/init` in issues to configure
- **Workflow integration**: Triggers the initialization workflow
- **Issue management**: Creates setup issues and closes them on completion

## Setup

### 1. Create a GitHub App

1. Go to **GitHub Settings** → **Developer settings** → **GitHub Apps**
2. Click **New GitHub App**
3. Fill in:
   - **Name**: `Phoenix Project Initializer`
   - **Homepage URL**: Your org URL
   - **Webhook URL**: Your deployment URL (e.g., `https://your-app.vercel.app/api/webhook`)
   - **Webhook secret**: Generate a secure secret
4. Set permissions:
   - **Repository permissions**:
     - Actions: Read & write
     - Contents: Read
     - Issues: Read & write
     - Metadata: Read
   - **Organization permissions**:
     - Members: Read (optional, for team-based access)
5. Subscribe to events:
   - `Repository`
   - `Issue comment`
   - `Workflow run`
6. Click **Create GitHub App**
7. Generate and download the private key

### 2. Install the App

1. Go to your GitHub App settings
2. Click **Install App**
3. Select your organization
4. Choose **All repositories** or select specific repos

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `APP_ID`: From GitHub App settings
- `WEBHOOK_SECRET`: The secret you set
- `PRIVATE_KEY`: Base64 encoded private key

### 4. Deploy

#### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

#### Option B: Railway

```bash
railway login
railway init
railway up
```

#### Option C: Local Development

```bash
# Install smee for webhook forwarding
npm install -g smee-client

# Create a channel at https://smee.io
smee -u https://smee.io/YOUR_CHANNEL -t http://localhost:3000/api/webhook

# In another terminal
npm install
npm run dev
```

## Usage

### Automatic Initialization

When a user creates a repo named like `nl-dev-myapp-fastapi`, the app automatically:
1. Detects the template usage
2. Parses the repo name
3. Triggers the initialization workflow

### Manual Initialization

For repos with any name:
1. User creates repo from template
2. App creates a setup issue
3. User replies with `/init org=nl env=dev project=myapp stack=fastapi`
4. App triggers the workflow
5. Issue is closed on success

## Slash Commands

```
/init org=<org> env=<env> project=<name> stack=<stack> [region=<region>]
```

**Example:**
```
/init org=nl env=dev project=myapi stack=fastapi region=euw
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│  GitHub Events  │────▶│   GitHub App     │
└─────────────────┘     └────────┬─────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ repo.created  │      │ issue_comment   │      │ workflow_run    │
│               │      │ (/init command) │      │ (completed)     │
└───────┬───────┘      └────────┬────────┘      └────────┬────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Create Issue  │      │ Trigger         │      │ Close Setup     │
│ or Auto-Init  │      │ Workflow        │      │ Issues          │
└───────────────┘      └─────────────────┘      └─────────────────┘
```
