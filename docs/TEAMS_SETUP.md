# Microsoft Teams Integration Setup

This guide explains how to set up Microsoft Teams notifications for project creation events.

## Overview

When a new project is created, a notification is sent to your Teams channel with:
- Project name and configuration
- Resource group name
- Direct link to the repository

## Setup Steps

### 1. Create an Incoming Webhook in Teams

1. Open **Microsoft Teams**
2. Navigate to the channel where you want notifications
3. Click the **...** (more options) next to the channel name
4. Select **Connectors**
5. Find **Incoming Webhook** and click **Configure**
6. Give it a name (e.g., "Phoenix Project Notifications")
7. Optionally upload a custom icon
8. Click **Create**
9. **Copy the webhook URL** - you'll need this!

### 2. Configure the Webhook URL

#### Option A: GitHub Actions (Workflow Notifications)

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **Variables** tab
3. Click **New repository variable**
4. Name: `TEAMS_WEBHOOK_URL`
5. Value: Paste the webhook URL from step 1
6. Click **Add variable**

> **Note**: Use Variables (not Secrets) so the URL can be used in workflow steps.

#### Option B: Web Portal

Add to your `.env` file:
```env
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/your-webhook-url
```

#### Option C: GitHub App

Add to your environment:
```env
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/your-webhook-url
```

### 3. Test the Integration

Create a test project to verify notifications are working.

## Notification Examples

### Project Created
![Project Created](images/teams-project-created.png)

```
🚀 New Project Created
━━━━━━━━━━━━━━━━━━━━━
Project:      myapi
Organization: nl
Environment:  dev
Tech Stack:   fastapi
Region:       euw

Resource Group: nl-dev-myapi-rg-euw

[View Repository]
```

### Initialization Complete
![Initialization Complete](images/teams-init-complete.png)

```
✅ Project myapi initialized successfully!
Stack: fastapi
Environment: dev

[Start Coding]
```

## Adaptive Card Schema

The notifications use Microsoft Adaptive Cards for rich formatting. Here's the schema:

```json
{
  "type": "message",
  "attachments": [{
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.4",
      "body": [
        {
          "type": "TextBlock",
          "text": "🚀 New Project Initialized",
          "weight": "Bolder",
          "size": "Large"
        },
        {
          "type": "FactSet",
          "facts": [
            {"title": "Project", "value": "myapi"},
            {"title": "Organization", "value": "nl"},
            {"title": "Environment", "value": "dev"},
            {"title": "Tech Stack", "value": "fastapi"}
          ]
        }
      ],
      "actions": [
        {
          "type": "Action.OpenUrl",
          "title": "View Repository",
          "url": "https://github.com/org/myapi"
        }
      ]
    }
  }]
}
```

## Customization

### Change Notification Content

Edit the notification in:
- **Workflow**: `.github/workflows/template-setup.yml` (search for "Teams notification")
- **Web Portal**: `platform/web-portal/src/lib/teams.ts`
- **GitHub App**: `platform/github-app/src/index.ts`

### Add More Actions

You can add additional buttons to the Adaptive Card:

```json
"actions": [
  {
    "type": "Action.OpenUrl",
    "title": "View Repository",
    "url": "https://github.com/org/repo"
  },
  {
    "type": "Action.OpenUrl",
    "title": "View Actions",
    "url": "https://github.com/org/repo/actions"
  },
  {
    "type": "Action.OpenUrl",
    "title": "Azure Portal",
    "url": "https://portal.azure.com/#resource/subscriptions/xxx"
  }
]
```

## Troubleshooting

### Notifications not appearing

1. **Check webhook URL** - Ensure it's correctly set
2. **Check channel permissions** - Make sure the webhook is enabled
3. **Check workflow logs** - Look for "Teams notification failed" messages
4. **Test webhook directly**:
   ```bash
   curl -H "Content-Type: application/json" \
     -d '{"text": "Test message"}' \
     "YOUR_WEBHOOK_URL"
   ```

### Rate Limiting

Teams webhooks have rate limits:
- ~4 messages per second per webhook
- If you hit limits, consider batching notifications

### Security

- **Never commit webhook URLs** to source control
- Use environment variables or GitHub secrets
- Rotate webhook URLs periodically
- Consider IP restrictions if available

## Alternative: Power Automate

For more complex workflows, consider using Power Automate:

1. Create a new flow with "When an HTTP request is received" trigger
2. Add Teams "Post a message" action
3. Use the HTTP endpoint URL instead of the webhook URL

This allows for:
- Conditional notifications
- Approval workflows
- Integration with other Microsoft 365 services
