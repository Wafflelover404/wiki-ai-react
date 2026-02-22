# WikiAi React

A modern Next.js frontend application for the GraphTalk knowledge base system. Provides an intuitive web interface for querying knowledge bases, managing files, and interacting with AI-powered search capabilities.

## Features

- **AI-Powered Search**: Semantic search with real-time streaming responses
- **File Management**: Upload, view, and manage knowledge base documents
- **AI Agent**: Command-based interactions with special XML-like syntax
- **Organization Support**: Multi-tenant architecture with user management
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **WebSocket Streaming**: Real-time token-by-token LLM responses

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS 4
- **Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Maps**: Leaflet

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- GraphTalk backend running at `http://localhost:9001` (Or u can configure any other url at .env)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your backend URL

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Environment Configuration

Edit `.env` to configure backend connection:

```bash
# Local Development
NEXT_PUBLIC_API_URL=http://localhost:9001
NEXT_PUBLIC_WS_URL=ws://localhost:9001

# Production
NEXT_PUBLIC_API_URL=https://api.wikiai.by
NEXT_PUBLIC_WS_URL=wss://api.wikiai.by
```

## Usage

### Login

Navigate to `/login` to access the application. Three tabs available:
- **Sign In**: Authenticate with email/password
- **Create Org**: Register new organization
- **AI Agent**: Direct AI agent commands (no auth required)

### AI Agent Commands

Use special XML-like commands in the AI Agent tab:

```html
<!-- Get file content -->
<file-content>filename.md</file-content>

<!-- Get file by ID -->
<file-id>123</file-id>

<!-- Fuzzy search filenames -->
<fuzzy-search>search term</fuzzy-search>

<!-- Knowledge base search -->
<kb-search>query</kb-search>

<!-- Semantic AI search -->
<semantic-search>query</semantic-search>
```

Example with multiple commands:
```
Analyze company values and find communication rules:
<file-content>ЦЕННОСТИ КОМПАНИИ.md</file-content>
<fuzzy-search>правила</fuzzy-search>
<semantic-search>company values</semantic-search>
```

### File Viewer

The unified file viewer supports:
- PDF documents
- Word documents (.doc, .docx)
- Images (png, jpg, svg, webp)
- Text files with syntax highlighting

Features include fullscreen mode and download functionality.

## Project Structure

```
wiki-ai-react/
├── app/                    # Next.js App Router pages
│   ├── app/               # Main application pages
│   │   ├── files/         # File management
│   │   ├── admin/         # Admin panel
│   │   ├── chat/          # Chat interface
│   │   └── settings/     # User settings
│   └── login/             # Authentication
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   └── *.tsx            # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
├── styles/              # Global styles
└── public/               # Static assets
```

## Key Components

| Component | Description |
|-----------|-------------|
| `UnifiedFileReader` | Multi-format file viewer with fullscreen |
| `ChatInterface` | Real-time chat with WebSocket streaming |
| `AICommandInput` | AI Agent command parser and executor |
| `SearchPanel` | Semantic and keyword search UI |
| `FileUpload` | Drag-and-drop file upload |

## API Integration

The frontend communicates with the GraphTalk backend via:

- **REST API**: File operations, authentication, user management
- **WebSocket**: Real-time streaming queries (`/ws/query`)
- **RAG API**: Semantic search and document retrieval

All API calls use environment-based configuration for easy backend switching.

## Development

```bash
# Run linter
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## Documentation

- [AI Agent Usage Guide](AI_AGENT_USAGE_GUIDE.md)
- [Unified Backend Config](UNIFIED_BACKEND_CONFIG.md)
- [WebSocket Streaming](REACT_WEBSOCKET_STREAMING_COMPLETE.md)
- [Components README](components/ui/README.md)

## License

This project is private and proprietary.
