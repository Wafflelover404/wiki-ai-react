# Unified Backend Configuration for WikiAI React Frontend

## 🎯 Overview

The WikiAI React frontend now uses a unified environment-based configuration system that allows you to quickly switch between different backend origins without code changes.

## 📁 Files Modified

### 1. `.env.example` - Template Configuration
- Comprehensive configuration options
- Multiple backend environment presets
- Clear documentation for each option

### 2. `.env` - Active Configuration  
- Currently set to local development (localhost:9001)
- Easy to switch between environments

### 3. `lib/config.ts` - Configuration Logic
- Environment variable parsing with fallbacks
- Dynamic URL generation
- Debug logging support

### 4. `lib/api.ts` - API Integration
- All CMS endpoints now use environment-based URLs
- No more hardcoded backend URLs
- Automatic prefix handling

## 🚀 Quick Setup

### For Local Development
```bash
# .env is already configured for local development
NEXT_PUBLIC_API_URL=http://localhost:9001
NEXT_PUBLIC_WS_URL=ws://localhost:9001
```

### For Production
```bash
# Edit .env and uncomment production lines:
NEXT_PUBLIC_API_URL=https://api.wikiai.by
NEXT_PUBLIC_WS_URL=wss://api.wikiai.by
```

### For Custom Server
```bash
# Edit .env with your server details:
NEXT_PUBLIC_API_URL=http://your-server:9001
NEXT_PUBLIC_WS_URL=ws://your-server:9001
```

## 🔧 Configuration Options

### Primary Backend Settings
- `NEXT_PUBLIC_API_URL` - HTTP API server URL
- `NEXT_PUBLIC_WS_URL` - WebSocket server URL (optional, auto-derived if not set)

### Additional Settings
- `NEXT_PUBLIC_API_TIMEOUT` - Request timeout in milliseconds (default: 30000)
- `NEXT_PUBLIC_DEBUG` - Enable debug logging (default: false)
- `NEXT_PUBLIC_ENABLE_CORS_FALLBACK` - Enable mock responses on CORS errors (default: true)
- `NEXT_PUBLIC_CMS_PREFIX` - CMS API prefix (default: /api/cms)

## 📊 Available Environments

### 1. Local Development (Default)
```bash
NEXT_PUBLIC_API_URL=http://localhost:9001
NEXT_PUBLIC_WS_URL=ws://localhost:9001
```

### 2. Production Server
```bash
NEXT_PUBLIC_API_URL=https://api.wikiai.by
NEXT_PUBLIC_WS_URL=wss://api.wikiai.by
```

### 3. Custom Development Server
```bash
NEXT_PUBLIC_API_URL=http://your-dev-server:9001
NEXT_PUBLIC_WS_URL=ws://your-dev-server:9001
```

### 4. Staging Server
```bash
NEXT_PUBLIC_API_URL=https://staging.wikiai.by
NEXT_PUBLIC_WS_URL=wss://staging.wikiai.by
```

## 🔄 How to Switch Environments

### Method 1: Edit .env Directly
1. Open `.env` file
2. Comment out current configuration
3. Uncomment desired environment configuration
4. Restart the React development server

### Method 2: Copy from .env.example
```bash
# Copy production configuration
cp .env.example .env.production
# Edit .env.production with desired settings
# Then copy to .env when needed
cp .env.production .env
```

## 🛠️ Technical Implementation

### Environment Variable Parsing
```typescript
const getApiUrlFromEnv = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, ''); // Remove trailing slash
  }
  return "http://localhost:9001"; // Fallback
};
```

### Dynamic URL Generation
```typescript
// Helper functions for different URL types
export function getApiUrl(endpoint: string): string
export function getWsUrl(endpoint: string = "/ws"): string  
export function getCmsEndpointUrl(endpoint: string): string
```

### Debug Logging
When `NEXT_PUBLIC_DEBUG=true`, the configuration is logged to console:
```
🔧 API Configuration: {
  BASE_URL: "http://localhost:9001",
  WS_URL: "ws://localhost:9001", 
  CMS_PREFIX: "/api/cms",
  TIMEOUT: 30000,
  DEBUG: true,
  ENABLE_CORS_FALLBACK: true
}
```

## 📝 Usage Examples

### In API Calls
```typescript
// All API calls now use environment-based URLs
const response = await fetch(getCmsEndpointUrl("/blog/posts"), {
  headers: { "Authorization": `Bearer ${token}` }
});
```

### In Components
```typescript
// Import and use configuration
import { API_CONFIG } from "@/lib/config";

console.log(`Connecting to: ${API_CONFIG.BASE_URL}`);
```

## ✅ Benefits

1. **Quick Environment Switching** - Change backend origin without code changes
2. **Unified Configuration** - All backend settings in one place
3. **Environment-Specific** - Different configs for dev/staging/prod
4. **Fallback Support** - Sensible defaults if environment variables missing
5. **Debug Friendly** - Easy to see current configuration
6. **Type Safe** - TypeScript support for all configuration options

## 🧪 Testing Configuration

### Verify Current Configuration
```bash
# Start React app with debug enabled
NEXT_PUBLIC_DEBUG=true npm run dev
```
Check browser console for configuration output.

### Test Different Environments
```bash
# Test production locally
NEXT_PUBLIC_API_URL=https://api.wikiai.by npm run dev

# Test custom server
NEXT_PUBLIC_API_URL=http://localhost:9002 npm run dev
```

## 📋 Migration Checklist

- [x] Updated .env.example with comprehensive options
- [x] Updated .env for local development
- [x] Modified lib/config.ts for environment variables
- [x] Updated all hardcoded URLs in lib/api.ts
- [x] Added helper functions for different URL types
- [x] Added debug logging support
- [x] Tested with local development configuration

## 🎉 Ready to Use

The unified backend configuration is now complete! You can:

1. **Switch environments** by editing `.env`
2. **Add new environments** by copying from `.env.example`
3. **Debug configuration** with `NEXT_PUBLIC_DEBUG=true`
4. **Use in development** with localhost:9001
5. **Deploy to production** with api.wikiai.by

All frontend components will automatically use the configured backend origin without any code changes!
