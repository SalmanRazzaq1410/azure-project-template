# Contributing to {{PROJECT}}

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Create a branch** for your changes: `git checkout -b feature/your-feature-name`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites

- Docker (recommended) or your tech stack's runtime
- Git

### Using Dev Container (Recommended)

1. Install [VS Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open the project in VS Code
3. Click "Reopen in Container" when prompted

### Manual Setup

#### Python (FastAPI)
```bash
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Node.js
```bash
npm install
npm run dev
```

#### Go
```bash
go mod download
go run main.go
```

#### .NET
```bash
dotnet restore
dotnet run
```

## Code Standards

### General
- Follow the existing code style
- Write meaningful commit messages
- Keep changes focused and atomic
- Add tests for new features

### Python
- Follow PEP 8
- Use type hints
- Run `ruff check .` and `black .` before committing

### JavaScript/TypeScript
- Use ESLint and Prettier
- Run `npm run lint` before committing

### Go
- Run `go fmt` and `golangci-lint run` before committing

### .NET
- Follow Microsoft's C# coding conventions

## Pull Request Process

1. Ensure your PR description clearly describes the problem and solution
2. Link any related issues
3. Update documentation if needed
4. Ensure all CI checks pass
5. Request review from maintainers

### PR Title Format
```
type: brief description

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
- `feat: add user authentication`
- `fix: resolve database connection timeout`
- `docs: update API documentation`

## Reporting Issues

When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, versions, etc.)
- Relevant logs or screenshots

## Questions?

Feel free to open an issue for questions or discussions.
