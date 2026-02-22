# WikiAI React

**[English](README.md)** | **[Русский](README.ru.md)**

A modern Next.js 16 frontend application for the GraphTalk knowledge base system. Provides an intuitive web interface for querying knowledge bases, managing files, interacting with AI-powered search capabilities, and comprehensive administrative tools.

## Features

### Core Functionality
- **AI-Powered Search**: Semantic search with real-time streaming responses and AI-agent enhanced mode
- **Advanced File Management**: Upload, view, and manage knowledge base documents with comprehensive metadata
- **AI Agent Interface**: Command-based interactions with special XML-like syntax for advanced queries
- **Multi-Tenant Support**: Organization-based architecture with user management and access control
- **Real-time Analytics**: Comprehensive dashboard with query volume tracking and user behavior metrics
- **Content Management System**: Integrated CMS for blogs, help articles, and media management
- **Interactive Quiz System**: Create and manage quizzes with detailed analytics and reporting
- **API Key Management**: Secure API key generation with granular permissions and usage tracking

### User Interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS 4 and Radix UI components
- **WebSocket Streaming**: Real-time token-by-token LLM responses
- **Admin Dashboard**: Comprehensive administrative interface with real-time metrics
- **Organization Management**: Multi-tenant organization lifecycle management
- **Invite System**: Secure invite-based user registration with expiration controls

## Tech Stack

### Frontend Framework
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19, Tailwind CSS 4
- **Components**: Radix UI, shadcn/ui component library
- **State Management**: Zustand for global state
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet for geographic features

### Backend Integration
- **API Client**: Custom API client with environment-based configuration
- **WebSocket**: Real-time streaming for AI responses
- **Authentication**: JWT-based authentication with session management
- **File Handling**: Multi-format file viewer and upload system

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- GraphTalk backend running at `http://localhost:9001` (or configure any other URL in .env)

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

### Authentication

Navigate to `/login` to access the application. Three authentication modes available:

#### Sign In
- Authenticate with email and password
- Organization-based access control
- Session management with automatic renewal

#### Create Organization
- Register new organization with invite system
- Multi-step registration process
- Admin approval workflow

#### AI Agent Mode
- Direct AI agent commands (no authentication required)
- Real-time AI interactions
- Command-based query system

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

### Search Modes

#### Standard Search
- Fast keyword-based search
- Real-time result highlighting
- File and content filtering

#### AI-Agent Enhanced Search
- Enhanced search strategy with AI processing
- Relevance scoring and ranking
- Context-aware result processing
- Real-time streaming responses

### File Management

#### File Viewer
The unified file viewer supports:
- PDF documents with page navigation
- Word documents (.doc, .docx) with formatting preservation
- Images (png, jpg, svg, webp) with zoom capabilities
- Text files with syntax highlighting
- Fullscreen mode and download functionality

#### File Upload
- Drag-and-drop interface
- Batch upload support
- Progress tracking
- File type validation
- Metadata extraction

### Admin Dashboard

#### Analytics Overview
- Real-time query volume tracking
- User behavior analytics
- Performance metrics
- Configurable time periods (7, 14, 30, 90 days)

#### Organization Management
- Create and approve organizations
- Status management (pending, active, rejected)
- Invite system with expiration controls
- User membership management

#### Content Management
- Blog post creation and editing
- Help article management
- Media file organization
- Content publishing workflow

### Quiz System

#### Quiz Creation
- Interactive quiz builder
- Multiple question types
- Rich text support
- Media integration

#### Quiz Analytics
- Response tracking
- Performance metrics
- User engagement analytics
- Detailed reporting

## Project Structure

```
wiki-ai-react/
├── app/                    # Next.js App Router pages
│   ├── app/               # Main application pages
│   │   ├── files/         # File management interface
│   │   ├── admin/         # Admin dashboard
│   │   │   ├── dashboard/ # Analytics dashboard
│   │   │   ├── organizations/ # Organization management
│   │   │   ├── search/    # Admin search interface
│   │   │   └── content/   # Content management
│   │   ├── chat/          # Chat interface
│   │   ├── search/        # Public search interface
│   │   └── settings/      # User settings
│   ├── login/             # Authentication pages
│   ├── invite/            # Invite system
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── cms-*.tsx         # CMS components
│   ├── admin-*.tsx       # Admin components
│   ├── file-*.tsx        # File management components
│   └── *.tsx            # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
│   ├── api.ts           # API client functions
│   ├── config.ts        # Configuration constants
│   └── utils.ts         # Utility functions
├── styles/              # Global styles
└── public/               # Static assets
```

## Key Components

| Component | Description |
|-----------|-------------|
| `UnifiedFileReader` | Multi-format file viewer with fullscreen and download |
| `ChatInterface` | Real-time chat with WebSocket streaming |
| `AICommandInput` | AI Agent command parser and executor |
| `SearchPanel` | Semantic and keyword search UI with AI-agent mode |
| `FileUpload` | Drag-and-drop file upload with progress tracking |
| `AdminDashboard` | Comprehensive admin interface with real-time metrics |
| `OrganizationManager` | Multi-tenant organization lifecycle management |
| `ContentManager` | CMS interface for blogs and help articles |
| `QuizBuilder` | Interactive quiz creation and management |

## API Integration

The frontend communicates with the GraphTalk backend via:

### REST API Endpoints
- **Authentication**: `/login`, `/logout`, `/organizations`
- **File Operations**: Upload, download, and metadata management
- **User Management**: Profile, settings, and preferences
- **Admin Functions**: Organization management, analytics, content management
- **Quiz System**: Quiz creation, submission, and analytics
- **CMS API**: Blog posts, help articles, and media management

### WebSocket Connection
- **Real-time Streaming**: `/ws/query` for token-by-token AI responses
- **Live Updates**: Real-time notifications and status updates
- **Interactive Chat**: Persistent chat sessions with history

### Environment-Based Configuration
All API calls use environment-based configuration for easy backend switching between development, staging, and production environments.

## Development

### Local Development

```bash
# Run development server
pnpm dev

# Run linter
pnpm lint

# Type checking
pnpm type-check
```

### Build and Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Export static site (if needed)
pnpm export
```

### Environment Variables

Key environment variables for development:

```bash
# Backend API URLs
NEXT_PUBLIC_API_URL=http://localhost:9001
NEXT_PUBLIC_WS_URL=ws://localhost:9001

# Application Settings
NEXT_PUBLIC_APP_NAME=WikiAI
NEXT_PUBLIC_APP_VERSION=1.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_AGENT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CMS=true
```

## Documentation

- [AI Agent Usage Guide](AI_AGENT_USAGE_GUIDE.md) - Comprehensive guide for AI Agent commands
- [Unified Backend Config](UNIFIED_BACKEND_CONFIG.md) - Backend integration configuration
- [WebSocket Streaming](REACT_WEBSOCKET_STREAMING_COMPLETE.md) - Real-time streaming implementation
- [Components README](components/ui/README.md) - UI component documentation
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Project implementation overview

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add unit tests for new features
- Update documentation for API changes

## License

This project is private and proprietary.

## Support

For support and questions:
- Check the documentation in the `/docs` directory
- Review the implementation guides
- Contact the development team through project channels
