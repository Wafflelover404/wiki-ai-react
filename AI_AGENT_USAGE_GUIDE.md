# AI Agent Commands - Usage Guide

## Overview
The AI Agent is now integrated into the WikiAi React frontend and provides powerful command-based interactions with the knowledge base.

## Available Commands

### 1. File Content Access
```html
<file-content>filename.md</file-content>
```
Retrieves the full content of a specific file by filename.

### 2. File Access by ID
```html
<file-id>123</file-id>
```
Retrieves file content using the database ID instead of filename.

### 3. Fuzzy Search
```html
<fuzzy-search>search term</fuzzy-search>
```
Searches across all available filenames using fuzzy matching and similarity scoring.

### 4. Knowledge Base Search
```html
<kb-search>query</kb-search>
```
Performs keyword-based search across the entire knowledge base.

### 5. Semantic Search
```html
<semantic-search>query</semantic-search>
```
Uses AI-powered semantic search with enhanced relevance scoring and analysis.

## Usage Examples

### Single Command
```
<file-content>ЦЕННОСТИ КОМПАНИИ.md</file-content>
```

### Multiple Commands
```
Analyze company values and search for related communication rules:
<file-content>ЦЕННОСТИ КОМПАНИИ.md</file-content>
<fuzzy-search>правила</fuzzy-search>
<kb-search>communication</kb-search>
<semantic-search>company values</semantic-search>
```

## Frontend Integration

### Login Page
- Navigate to `/login` to access the enhanced login form
- Three tabs available: Sign In, Create Org, AI Agent
- AI Agent tab provides:
  - Command input area with syntax highlighting
  - Help button showing all available commands
  - Execute button with loading states
  - Real-time response display
  - File listing with ID mapping

### Features
- **Real-time Processing**: Commands execute immediately with visual feedback
- **Error Handling**: Clear error messages for failed commands
- **File Management**: Load and display available files with IDs
- **Help System**: Built-in command reference and examples
- **Multiple Commands**: Support for batch command execution

## Backend Integration

### API Endpoints
The frontend integrates with the AI agent backend through these API endpoints:

- `POST /ai-agent/execute` - Execute commands
- `GET /ai-agent/files` - Get available files with ID mapping
- `POST /ai-agent/file-content/{filename}` - Get file content
- `POST /ai-agent/file-id/{id}` - Get file by ID
- `POST /ai-agent/fuzzy-search` - Fuzzy filename search
- `POST /ai-agent/kb-search` - Knowledge base search
- `POST /ai-agent/semantic-search` - Semantic search

### WebSocket Integration
The semantic search uses WebSocket connections for real-time AI-powered search results with:
- Enhanced metadata (ai_ranked, relevance, enhanced_context)
- AI-Agent prefixed overviews
- Real-time status updates

## Getting Started

1. **Access the AI Agent**: Go to the login page and click the "AI Agent" tab
2. **Load Files**: Click "Load Files" to see available documents with IDs
3. **Show Help**: Click "Show Help" to see all command syntax
4. **Execute Commands**: Enter commands in the text area and click "Execute Command"
5. **View Results**: See real-time responses in the response area

## Demo Commands to Try

```html
<!-- Get file content -->
<file-content>ПРИНЯТОЕ РЕШЕНИЕ.md</file-content>

<!-- Search for company rules -->
<semantic-search>Правила компании</semantic-search>

<!-- Find files about communication -->
<fuzzy-search>коммуникации</fuzzy-search>

<!-- Multiple commands -->
<file-content>ЦЕННОСТИ КОМПАНИИ.md</file-content>
<kb-search>company values</kb-search>
```

The AI Agent provides a powerful, command-driven interface to interact with your knowledge base, supporting both simple file access and advanced AI-powered search capabilities.
