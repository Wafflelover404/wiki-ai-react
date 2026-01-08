# Unified FileReader Component

A comprehensive, reusable file viewer component that supports multiple file types with fullscreen functionality.

## Features

- **Multiple File Types**: PDF, Word documents (.doc/.docx), images, and text files
- **Fullscreen Mode**: Toggle fullscreen viewing for better readability
- **Responsive Design**: Works on desktop and mobile devices
- **Download Support**: Built-in download functionality
- **Loading States**: Proper loading and error handling
- **Accessible**: Full keyboard navigation and screen reader support

## File Types Supported

| File Type | Extensions | Viewer |
|-----------|-------------|---------|
| PDF | `.pdf` | Native PDF viewer with fullscreen |
| Word | `.doc`, `.docx` | Native document viewer |
| Excel | `.xls`, `.xlsx` | Native spreadsheet viewer |
| Images | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp` | Image viewer with fullscreen |
| Text/Code | `.txt`, `.md`, `.js`, `.ts`, `.json`, etc. | Syntax-highlighted text viewer |

## Backend Integration

**API Endpoint**: `/files/content/{filename}`
- Returns file content as base64 with proper MIME type
- Supports all formats listed above
- Enforces organization-based access control
- Includes proper download headers

**Download Method**: Uses `/files/content/{filename}` with download attribute
- Creates temporary anchor element for download
- Works across all file types
- No separate download endpoint needed

## Basic Usage

```tsx
import { UnifiedFileReader } from "@/components/ui/file-reader"

function MyComponent() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const file = {
    filename: "document.pdf",
    size: 1024000,
    upload_date: "2024-01-08T10:00:00Z",
    content_type: "application/pdf",
    indexed: true
  }

  return (
    <>
      <Button onClick={() => {
        setSelectedFile(file)
        setIsOpen(true)
      }}>
        Open File
      </Button>

      <UnifiedFileReader
        file={selectedFile}
        token={userToken}
        open={isOpen}
        onOpenChange={setIsOpen}
        showDownload={true}
      />
    </>
  )
}
```

## Hook Usage (Recommended)

For easier state management, use the included hook:

```tsx
import { useFileReader } from "@/hooks/use-file-reader"

function MyComponent() {
  const { openFile, FileReaderComponent } = useFileReader()

  const file = {
    filename: "document.pdf",
    size: 1024000,
    upload_date: "2024-01-08T10:00:00Z",
    content_type: "application/pdf",
    indexed: true
  }

  return (
    <>
      <Button onClick={() => openFile(file)}>
        Open File
      </Button>

      <FileReaderComponent token={userToken} />
    </>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|----------|-------------|
| `file` | `FileReaderItem \| null` | `null` | The file to display |
| `token` | `string \| null` | `null` | Authentication token |
| `open` | `boolean` | `false` | Controls dialog visibility |
| `onOpenChange` | `(open: boolean) => void` | Required | Called when dialog opens/closes |
| `showDownload` | `boolean` | `true` | Show/hide download button |
| `className` | `string` | `""` | Additional CSS classes |

## FileReaderItem Interface

```tsx
interface FileReaderItem {
  filename: string
  size: number
  upload_date: string
  content_type: string
  metadata?: any
  indexed: boolean
}
```

## Integration Examples

### Admin Files Page
```tsx
// Already integrated in /app/app/admin/files/page.tsx
<UnifiedFileReader
  file={selectedFile}
  token={token}
  open={!!selectedFile}
  onOpenChange={(open) => !open && setSelectedFile(null)}
/>
```

### User Files Page
```tsx
// Already integrated in /app/app/files/page.tsx
<UnifiedFileReader
  file={selectedFile}
  token={token}
  open={isViewOpen}
  onOpenChange={setIsViewOpen}
/>
```

## Features Details

### Fullscreen Mode
- PDF and Word documents: Uses native browser fullscreen API
- Images: Expands to full viewport
- Text files: Optimized reading experience
- Escape key exits fullscreen
- Toggle button in viewer controls

### Error Handling
- Invalid file types show appropriate error messages
- Network errors are handled gracefully
- Loading states for all file types
- Base64 content normalization

### Performance
- Lazy loading of file content
- Memory cleanup with URL.revokeObjectURL()
- Efficient base64 processing
- Responsive image scaling

## Styling

The component uses Tailwind CSS classes and can be customized through:
- `className` prop for additional styles
- CSS variables for theme customization
- Responsive breakpoints built-in

## Browser Support

- **PDF**: Chrome, Firefox, Safari, Edge
- **Word**: Chrome, Firefox, Edge (Safari limited)
- **Images**: All modern browsers
- **Fullscreen**: All modern browsers with Fullscreen API

## Migration from Old Components

### Before (Multiple Components)
```tsx
// Separate PDF, Word, and Image viewers
{file.endsWith('.pdf') && <PDFViewer />}
{file.endsWith('.doc') && <WordViewer />}
{file.endsWith('.png') && <ImageViewer />}
```

### After (Unified Component)
```tsx
// Single component handles all types
<UnifiedFileReader file={file} token={token} />
```

## Contributing

When adding new file types:
1. Create viewer component in `file-reader.tsx`
2. Add file type detection logic
3. Update this documentation
4. Test across browsers

## Dependencies

- React 18+
- Lucide React (icons)
- Tailwind CSS
- Browser native APIs (Fullscreen, Blob, etc.)
