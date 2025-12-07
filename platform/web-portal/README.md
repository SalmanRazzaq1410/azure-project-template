# Phoenix Developer Portal

A beautiful Internal Developer Platform (IDP) for creating and managing projects from the azure-project-template.

## Features

- **Visual Project Creation**: Interactive form with tech stack selection
- **GitHub Integration**: Creates repos directly from the template
- **Auto-Initialization**: Triggers the setup workflow automatically
- **Project Dashboard**: View all your organization's projects
- **Modern UI**: Built with Next.js 14 and Tailwind CSS

## Screenshots

### Create Project
![Create Project](docs/create-project.png)

### Project List
![Project List](docs/project-list.png)

## Setup

### Prerequisites

- Node.js 18+
- GitHub Personal Access Token with `repo` scope

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your GitHub token
```

### Configuration

Edit `.env`:

```env
# Required
GITHUB_TOKEN=ghp_your_token_here

# Optional - customize these
TEMPLATE_OWNER=phoenixvc
TEMPLATE_REPO=azure-project-template
TARGET_OWNER=phoenixvc
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Azure Static Web Apps

```yaml
# .github/workflows/azure-static-web-apps.yml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/platform/web-portal"
          output_location: ".next"
```

## Adding Authentication (Optional)

### GitHub OAuth

1. Create an OAuth App at https://github.com/settings/developers
2. Add environment variables:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=generate-a-secret
   NEXTAUTH_URL=http://localhost:3000
   ```
3. Install NextAuth: `npm install next-auth`
4. See [NextAuth.js docs](https://next-auth.js.org/) for implementation

### Azure AD SSO

For enterprise environments, you can add Azure AD authentication:

```env
AZURE_AD_CLIENT_ID=your-app-id
AZURE_AD_CLIENT_SECRET=your-secret
AZURE_AD_TENANT_ID=your-tenant-id
```

## API Endpoints

### POST /api/create-project

Create a new project from the template.

**Request:**
```json
{
  "org": "nl",
  "env": "dev",
  "project": "myapi",
  "techstack": "fastapi",
  "region": "euw",
  "description": "My awesome API",
  "isPrivate": true
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://github.com/org/myapi",
  "name": "myapi",
  "full_name": "org/myapi"
}
```

### GET /api/list-projects

List all projects in the organization.

**Response:**
```json
{
  "projects": [
    {
      "id": 123,
      "name": "myapi",
      "full_name": "org/myapi",
      "description": "My awesome API",
      "html_url": "https://github.com/org/myapi",
      "created_at": "2024-01-15T10:00:00Z",
      "language": "Python",
      "private": true
    }
  ]
}
```

## Customization

### Adding New Tech Stacks

Edit `src/components/ProjectForm.tsx`:

```typescript
const TECH_STACKS = [
  // ... existing stacks
  {
    id: 'rust',
    name: 'Rust',
    description: 'High-performance systems API',
    icon: '🦀',
    color: 'bg-orange-100 text-orange-800',
  },
];
```

### Adding New Organizations

```typescript
const ORGANIZATIONS = [
  // ... existing orgs
  { id: 'new', name: 'NEW', description: 'New Organization' },
];
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Browser                               │
│                         │                                    │
│                         ▼                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js Application                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  Project    │  │  Project    │  │  API        │  │   │
│  │  │  Form       │  │  List       │  │  Routes     │  │   │
│  │  └─────────────┘  └─────────────┘  └──────┬──────┘  │   │
│  └───────────────────────────────────────────┼──────────┘   │
│                                              │               │
└──────────────────────────────────────────────┼───────────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │    GitHub API       │
                                    │  - Create repo      │
                                    │  - Trigger workflow │
                                    │  - List repos       │
                                    └─────────────────────┘
```

## License

MIT
