# Azure Project Template

A production-ready template for creating Azure-deployed applications with multiple tech stack options.

## Quick Start

### 1. Create Repository from Template

Click **"Use this template"** → **"Create a new repository"**

> Name your repo anything you want (e.g., `my-awesome-api`)

### 2. Initialize Your Project

After creating the repo, you have two options:

#### Option A: Visual Form (Recommended)

1. Go to **Actions** tab
2. Click **"🚀 Initialize Project"**
3. Click **"Run workflow"**
4. Fill in the form and click **"Run workflow"**

![Workflow Form](docs/workflow-form.png)

#### Option B: Auto-Configuration

Name your repo following this pattern:
```
{org}-{env}-{project}-{techstack}
```

Example: `nl-dev-myapi-fastapi`

The workflow will auto-configure based on the name.

### 3. Start Developing

```bash
git clone https://github.com/your-org/your-repo
cd your-repo
make install
make dev
```

## Available Tech Stacks

| Stack | Description | Port |
|-------|-------------|------|
| `fastapi` | Python FastAPI - Simple REST API | 8000 |
| `fastapi-hexagonal` | Python with Clean Architecture/DDD | 8000 |
| `nodejs` | Node.js Express | 3000 |
| `go` | Go with standard library | 8080 |
| `dotnet` | .NET 8 Minimal API | 8080 |
| `flutter` | Flutter mobile/web | 80 |
| `reactnative` | React Native (Expo) | 19000 |

## Project Structure

After initialization, your project will have:

```
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint, test, build
│   │   └── deploy.yml          # Azure deployment
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml
│   └── CODEOWNERS
├── infra/
│   ├── main.bicep              # Infrastructure as Code
│   └── modules/                # Modular Azure resources
│       ├── app-service.bicep
│       ├── container-app.bicep
│       ├── postgres.bicep
│       ├── key-vault.bicep
│       ├── storage.bicep
│       ├── app-insights.bicep
│       └── redis.bicep
├── config/
│   ├── dev.json
│   ├── staging.json
│   └── prod.json
├── tests/
├── .devcontainer/              # VS Code dev container
├── docker-compose.yml          # Local development
├── Makefile                    # Common commands
├── CONTRIBUTING.md
└── [tech-stack-specific files]
```

## Configuration Options

| Option | Values | Description |
|--------|--------|-------------|
| Organization | `nl`, `pvc`, `tws`, `mys` | Your organization code |
| Environment | `dev`, `staging`, `prod` | Target environment |
| Region | `euw`, `eus`, `wus`, `san`, `saf` | Azure region |
| Tech Stack | See table above | Application framework |

## Common Commands

```bash
make install      # Install dependencies
make dev          # Run development server
make test         # Run tests
make lint         # Run linters
make format       # Format code
make docker-build # Build Docker image
make docker-run   # Run with Docker Compose
```

## Azure Infrastructure

The template includes Bicep modules for:

- **App Service** - Traditional web app hosting
- **Container Apps** - Serverless containers
- **PostgreSQL** - Managed database
- **Key Vault** - Secrets management
- **Storage Account** - Blob storage
- **Application Insights** - Monitoring
- **Redis Cache** - Caching layer

Deploy with:
```bash
az deployment sub create \
  --location westeurope \
  --template-file infra/main.bicep \
  --parameters infra/parameters/dev.bicepparam
```

## CI/CD

- **CI** runs on every push: lint, test, build, security scan
- **Deploy** runs on push to `main`: deploys to Azure

Required GitHub Secrets:
- `AZURE_CREDENTIALS` - Service principal for Azure

Required GitHub Variables:
- `ACR_NAME` - Azure Container Registry name
- `WEBAPP_NAME` or `CONTAINER_APP_NAME` - Deployment target

## Development

### Using Dev Container (Recommended)

1. Install [VS Code](https://code.visualstudio.com/)
2. Install [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open repo in VS Code
4. Click "Reopen in Container"

### Using Docker Compose

```bash
docker-compose up
```

This starts:
- Your application
- PostgreSQL database
- Redis cache

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT
