# Azure Project Template - Implementation Scripts

## Usage

1. Navigate to your azure-project-template repo:
   ```powershell
   cd C:\Users\smitj\repos\azure-project-template
   ```

2. Create scripts folder:
   ```powershell
   mkdir scripts
   ```

3. Copy all .ps1 files to the scripts folder

4. Run the main script:
   ```powershell
   .\add-implementations.ps1
   ```

## What it does

- Creates infrastructure files (Bicep + parameters)
- Creates Hexagonal API implementation
- Creates .gitignore
- Commits and pushes to GitHub

## Files

- `add-implementations.ps1` - Main script (run this)
- `scripts/create-infra.ps1` - Infrastructure files
- `scripts/create-api-hexagonal.ps1` - Hexagonal API
- `scripts/create-gitignore.ps1` - .gitignore file
