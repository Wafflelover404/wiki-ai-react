"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Target, 
  Award, 
  Star,
  Users,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Building,
  Zap,
  Shield,
  Database,
  QrCode,
  Image,
  Download,
  X,
  Moon,
  Sun,
  Languages,
  Settings,
  Cloud,
  Search,
  BarChart3
} from 'lucide-react'
import { useTranslation } from '@/src/i18n'
import { useTheme } from 'next-themes'

export default function LeafletPage() {
  const { t, locale, changeLanguage, availableLanguages } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [exportStatus, setExportStatus] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [qrColor, setQrColor] = useState('#3b82f6')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const leafletRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const showStatus = (message: string, isError = false) => {
    setExportStatus(message)
    setTimeout(() => setExportStatus(''), 3000)
  }

  const exportAsPDF = async () => {
    setIsExporting(true)
    showStatus('Generating PDF...')
    
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: false
      })
      
      // Get current theme state
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      console.log('Current theme for PDF:', currentTheme)
      
      // Use theme-aware colors
      const isDarkTheme = currentTheme === 'dark'
      const bgColor = isDarkTheme ? [15, 23, 42] : [248, 250, 252] // #0f172a or #f8fafc
      const textColor = isDarkTheme ? [255, 255, 255] : [15, 23, 42] // white or dark
      const primaryColor = [59, 130, 246] // #3b82f6
      const mutedColor = isDarkTheme ? [148, 163, 184] : [100, 116, 139] // #94a3b8 or #64748b
      
      console.log('PDF colors - Dark:', isDarkTheme, 'BG:', bgColor, 'Text:', textColor)
      
      // Page 1 - Front
      // Draw gradient background FIRST
      pdf.setFillColor(220, 200, 240) // Purple
      pdf.rect(0, 0, 297, 210, 'F')
      pdf.setFillColor(200, 220, 250) // Blue
      pdf.rect(100, 50, 197, 160, 'F')
      pdf.setFillColor(240, 200, 220) // Pink
      pdf.rect(150, 105, 147, 105, 'F')
      
      // Add some circles for gradient effect
      pdf.setFillColor(180, 160, 220) // Darker purple
      pdf.circle(74, 52.5, 30, 'F')
      pdf.setFillColor(160, 200, 240) // Darker blue
      pdf.circle(223, 157.5, 30, 'F')
      pdf.setFillColor(220, 160, 190) // Darker pink
      pdf.circle(148.5, 105, 30, 'F')
      
      // Additional spacing
      

      // Title
      pdf.setFontSize(32)
      pdf.setFont('helvetica', 'bold')
      pdf.text('WikiAI', 20, 30)
      
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'normal')
      
      // Use English for PDF to avoid Cyrillic encoding issues
      pdf.text('Professional Brochure', 20, 45)
      
      // Left Panel - About WikiAI
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('About WikiAI', 20, 70)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const aboutText = 'WikiAI is a cutting-edge knowledge management platform that leverages artificial intelligence to transform how organizations handle information. Our system seamlessly integrates with your existing workflows, providing intelligent search and real-time insights.'
      
      const splitAbout = pdf.splitTextToSize(aboutText, 80)
      pdf.text(splitAbout, 20, 80)
      
      // Center Panel - Mission
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Our Mission', 110, 70)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const missionPoints = [
        '• Boost Productivity - Reduce search time by up to 80%',
        '• Enhance Collaboration - Unified knowledge base for teams',
        '• Intelligent Automation - Automate routine tasks with AI',
        '• Faster Decision Making - Instant access to relevant information',
        '• Scalability - Solution that grows with your business',
        '• Data Security - Enterprise-grade protection for sensitive information'
      ]
      
      missionPoints.forEach((point, index) => {
        const splitPoint = pdf.splitTextToSize(point, 80)
        pdf.text(splitPoint, 110, 80 + (index * 12))
      })
      
      // Right Panel - Contact
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Get Started', 200, 70)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const contactInfo = [
        'Contact: afanasieffivan@gmail.com',
        'Phone: +375 44 508-85-75',
        'School: Gymnasium #1, Brest',
        'Website: wikiai.by'
      ]
      
      contactInfo.forEach((info, index) => {
        pdf.text(info, 200, 80 + (index * 12))
      })
      
      // QR Code placeholder
      pdf.rect(220, 140, 50, 50)
      pdf.setFontSize(8)
      pdf.text('QR Code', 245, 165)
      
      // Page 2 - Back
      pdf.addPage()
      
      // Draw gradient background FIRST
      pdf.setFillColor(220, 200, 240) // Purple
      pdf.rect(0, 0, 297, 210, 'F')
      pdf.setFillColor(200, 220, 250) // Blue
      pdf.rect(100, 50, 197, 160, 'F')
      pdf.setFillColor(240, 200, 220) // Pink
      pdf.rect(150, 105, 147, 105, 'F')
      
      // Add some circles for gradient effect
      pdf.setFillColor(180, 160, 220) // Darker purple
      pdf.circle(74, 52.5, 30, 'F')
      pdf.setFillColor(160, 200, 240) // Darker blue
      pdf.circle(223, 157.5, 30, 'F')
      pdf.setFillColor(220, 160, 190) // Darker pink
      pdf.circle(148.5, 105, 30, 'F')
      
      pdf.rect(0, 0, 297, 210, 'F')
      
      // Diploma sections
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      
      pdf.text('Talents of the XXI Century', 50, 30)
      pdf.text('First Step in Science', 148, 30)
      pdf.text('Review', 230, 30)
      
      // Placeholder boxes
      pdf.rect(20, 50, 80, 120)
      pdf.rect(108, 50, 80, 120)
      pdf.rect(198, 50, 80, 120)
      
      pdf.setFontSize(10)
      pdf.text('Place for diploma', 40, 110)
      pdf.text('Place for diploma', 128, 110)
      pdf.text('Place for review', 218, 110)
      
      pdf.save('wiki-ai-brochure.pdf')
      showStatus('PDF downloaded successfully!')
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      showStatus('PDF generation failed. Please try print dialog instead.', true)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsImage = async (format: 'png' | 'jpg') => {
    if (!leafletRef.current) return
    
    setIsExporting(true)
    showStatus(`Generating ${format.toUpperCase()}...`)
    
    try {
      const html2canvas = (await import('html2canvas')).default
      const pages = leafletRef.current.querySelectorAll('.leaflet-slide')
      const canvases = []
      
      // Capture each page
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#0f172a',
          ignoreElements: (element) => {
            // Ignore all styles and scripts that might cause color parsing issues
            return element.tagName === 'STYLE' || element.tagName === 'LINK' || element.tagName === 'SCRIPT'
          },
          onclone: (clonedDoc) => {
            // Remove all style elements and force simple colors
            const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')
            styles.forEach(style => style.remove())
            
            // Force simple color values on all elements
            const elements = clonedDoc.querySelectorAll('*')
            elements.forEach(el => {
              const htmlEl = el as HTMLElement
              // Reset all color-related styles to avoid lab() issues
              htmlEl.style.color = ''
              htmlEl.style.backgroundColor = ''
              htmlEl.style.borderColor = ''
            })
            
            // Add basic styles to the cloned document head
            const style = clonedDoc.createElement('style')
            style.textContent = `
              * { color: #000000 !important; background-color: #ffffff !important; }
              .bg-card, .bg-muted { background-color: #f8fafc !important; }
              .bg-primary { background-color: #3b82f6 !important; }
              .text-primary {
                color: #3b82f6 !important;
              }
              h1 .text-primary {
                color: #3b82f6 !important;
              }
              .text-muted-foreground { color: #64748b !important; }
              .text-foreground { color: #0f172a !important; }
              .border-border { border-color: #e2e8f0 !important; }
            `
            clonedDoc.head.appendChild(style)
          }
        })
        canvases.push(canvas)
      }
      
      // Create a combined canvas
      const combinedCanvas = document.createElement('canvas')
      const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0)
      combinedCanvas.width = canvases[0].width
      combinedCanvas.height = totalHeight
      
      const ctx = combinedCanvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height)
        
        let currentY = 0
        canvases.forEach(canvas => {
          ctx.drawImage(canvas, 0, currentY)
          currentY += canvas.height
        })
        
        // Download the image
        const link = document.createElement('a')
        link.download = `wiki-ai-brochure.${format}`
        link.href = combinedCanvas.toDataURL(`image/${format}`, 0.95)
        link.click()
        
        showStatus(`${format.toUpperCase()} downloaded successfully!`)
      }
      
    } catch (error) {
      console.error('Image generation failed:', error)
      showStatus('Image generation failed. Please try PDF export instead.', true)
    } finally {
      setIsExporting(false)
    }
  }

  const printPage = () => {
    showStatus('Opening print dialog...')
    window.print()
  }

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary">WikiAI</h1>
            <p className="text-lg text-muted-foreground">Professional Brochure</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 print:p-0">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
          }
          
          .max-w-7xl {
            max-width: none !important;
          }
          
          .space-y-8 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0 !important;
          }
          
          .leaflet-slide {
            page-break-after: always;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            max-width: none !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: linear-gradient(135deg, 
              rgba(147, 51, 234, 0.5) 0%, 
              rgba(59, 130, 246, 0.45) 50%, 
              rgba(236, 72, 153, 0.5) 100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .leaflet-slide:last-child {
            page-break-after: auto;
          }
          
          /* Light theme print styles */
          html:not(.dark) .leaflet-slide,
          :not(.dark) .leaflet-slide {
            background: linear-gradient(135deg, 
              rgba(147, 51, 234, 0.4) 0%, 
              rgba(59, 130, 246, 0.35) 50%, 
              rgba(236, 72, 153, 0.4) 100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          html:not(.dark) .bg-card,
          :not(.dark) .bg-card {
            background-color: #f8fafc !important;
          }
          
          html:not(.dark) .bg-muted,
          :not(.dark) .bg-muted {
            background-color: #f1f5f9 !important;
          }
          
          html:not(.dark) .text-primary,
          .dark .text-primary {
            color: #3b82f6 !important;
          }
          
          .dark h1 .text-primary {
            color: #3b82f6 !important;
          }
          
          html:not(.dark) h1 .text-primary,
          :not(.dark) h1 .text-primary {
            color: #3b82f6 !important;
          }
          
          html:not(.dark) .text-muted-foreground,
          :not(.dark) .text-muted-foreground {
            color: #64748b !important;
          }
          
          html:not(.dark) .border-border,
          :not(.dark) .border-border {
            border-color: #e2e8f0 !important;
          }
          
          /* Dark theme print styles */
          .dark .leaflet-slide {
            background: linear-gradient(135deg, 
              rgba(147, 51, 234, 0.6) 0%, 
              rgba(59, 130, 246, 0.55) 50%, 
              rgba(236, 72, 153, 0.6) 100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .dark .bg-card {
            background-color: #0c0d0f !important;
          }
          
          .dark .bg-muted {
            background-color: #334155 !important;
          }
          
          .dark .text-foreground {
            color: #f8fafc !important;
          }
          
          .dark .text-muted-foreground {
            color: #94a3b8 !important;
          }
          
          .dark .border-border {
            border-color: #334155 !important;
          }
          
          .grid-cols-3 {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          
          .h-full {
            height: 100% !important;
          }
          
          .divide-x > :not([hidden]) ~ :not([hidden]) {
            border-style: solid !important;
            border-width: 0 1px 0 0 !important;
          }
          
          html:not(.dark) .divide-x > :not([hidden]) ~ :not([hidden]) {
            border-color: #e2e8f0 !important;
          }
          
          .dark .divide-x > :not([hidden]) ~ :not([hidden]) {
            border-color: #334155 !important;
          }
          
          .p-8 {
            padding: 2rem !important;
          }
          
          .space-y-6 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 1.5rem !important;
          }
          
          .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 1rem !important;
          }
          
          .space-y-3 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.75rem !important;
          }
          
          .space-y-2 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.5rem !important;
          }
          
          .flex {
            display: flex !important;
          }
          
          .items-center {
            align-items: center !important;
          }
          
          .items-start {
            align-items: flex-start !important;
          }
          
          .gap-2 {
            gap: 0.5rem !important;
          }
          
          .gap-3 {
            gap: 0.75rem !important;
          }
          
          .gap-4 {
            gap: 1rem !important;
          }
          
          .text-4xl {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
          }
          
          .text-2xl {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }
          
          .text-xl {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
          }
          
          .text-lg {
            font-size: 1.125rem !important;
            line-height: 1.75rem !important;
          }
          
          .text-sm {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
          }
          
          .text-xs {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }
          
          .font-bold {
            font-weight: 700 !important;
          }
          
          .font-semibold {
            font-weight: 600 !important;
          }
          
          .leading-relaxed {
            line-height: 1.625 !important;
          }
          
          .text-center {
            text-align: center !important;
          }
          
          .overflow-y-auto {
            overflow-y: auto !important;
          }
          
          .rounded-lg {
            border-radius: 0.5rem !important;
          }
          
          .border {
            border-width: 1px !important;
            border-style: solid !important;
          }
          
          .border-2 {
            border-width: 2px !important;
          }
          
          .border-dashed {
            border-style: dashed !important;
          }
          
          .shadow-xl {
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
          }
          
          .flex-wrap {
            flex-wrap: wrap !important;
          }
          
          .flex-col {
            flex-direction: column !important;
          }
          
          .justify-center {
            justify-content: center !important;
          }
          
          .min-h-\\[300px\\] {
            min-height: 18.75rem !important;
          }
          
          .min-h-\\[350px\\] {
            min-height: 21.875rem !important;
          }
          
          .mx-auto {
            margin-left: auto !important;
            margin-right: auto !important;
          }
          
          .mt-0\\.5 {
            margin-top: 0.125rem !important;
          }
          
          .mt-2 {
            margin-top: 0.5rem !important;
          }
          
          .mt-3 {
            margin-top: 0.75rem !important;
          }
          
          .flex-shrink-0 {
            flex-shrink: 0 !important;
          }
          
          .grid-cols-2 {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          h1, h2, h3, h4, p, div, span {
            color: inherit !important;
          }
          
          /* Print styles for gradient blur circles */
          .leaflet-slide > div[style*="position: absolute"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Ensure backdrop-blur elements have solid backgrounds for print */
          .bg-card\/30 {
            background-color: rgba(248, 250, 252, 0.95) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .dark .bg-card\/30 {
            background-color: rgba(12, 13, 15, 0.95) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>
      {/* Export Controls - Under Brochure */}
      <div className="max-w-7xl mx-auto mt-24 print:hidden">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              {locale === 'ru' ? 'Экспорт брошюры' : 'Export Brochure'}
            </CardTitle>
            <CardDescription>
              {locale === 'ru' 
                ? 'Скачайте брошюру в различных форматах или настройте отображение'
                : 'Download the brochure in various formats or customize the display'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={exportAsPDF}
                disabled={isExporting}
                className="justify-start"
                variant="default"
              >
                📄 {locale === 'ru' ? 'PDF' : 'PDF'}
              </Button>
              <Button
                onClick={() => exportAsImage('png')}
                disabled={isExporting}
                className="justify-start"
                variant="outline"
              >
                🖼️ {locale === 'ru' ? 'PNG' : 'PNG'}
              </Button>
              <Button
                onClick={() => exportAsImage('jpg')}
                disabled={isExporting}
                className="justify-start"
                variant="outline"
              >
                📷 {locale === 'ru' ? 'JPG' : 'JPG'}
              </Button>
              <Button
                onClick={printPage}
                disabled={isExporting}
                className="justify-start"
                variant="outline"
              >
                🖨️ {locale === 'ru' ? 'Печать' : 'Print'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  {locale === 'ru' ? 'Внешний вид' : 'Appearance'}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {locale === 'ru' ? 'Темная тема' : 'Dark Mode'}
                  </span>
                  <Switch 
                    checked={theme === "dark"} 
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
                  />
                </div>
              </div>

              {/* Language Settings */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  {locale === 'ru' ? 'Язык' : 'Language'}
                </h4>
                <Select value={locale} onValueChange={changeLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'ru' ? 'Выберите язык' : 'Select language'} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(availableLanguages).map(([code, language]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{language.name}</span>
                          {locale === code && (
                            <Badge variant="secondary" className="text-xs">
                              {locale === 'ru' ? 'Текущий' : 'Current'}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          {exportStatus && (
            <div className={`px-6 pb-6 ${
              exportStatus.includes('failed') 
                ? 'text-destructive' 
                : 'text-primary'
            }`}>
              <p className="text-sm">{exportStatus}</p>
            </div>
          )}
        </Card>
      </div>

      <div ref={leafletRef} className="max-w-7xl mx-auto space-y-16 print:max-w-none print:space-y-0">
        {/* Empty spacing above title */}
        <div className="h-2 print:hidden"></div>
        
        {/* Header - Hidden when printing */}
        <div className="text-center space-y-2 mb-16 print:hidden">
          <h1 className="text-4xl font-bold text-primary">WikiAI</h1>
          <p className="text-lg text-muted-foreground">
            {locale === 'ru' ? 'Профессиональная брошюра' : 'Professional Brochure'}
          </p>
        </div>

        {/* A4 Horizontal Slide 1 - Front */}
        <div 
          className="leaflet-slide border border-border rounded-lg shadow-xl overflow-hidden print:shadow-none print:rounded-none print:border-0 relative" 
          style={{
            width: '1122px', 
            height: '794px', 
            margin: '0 auto', 
            borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.06) 50%, rgba(236, 72, 153, 0.08) 100%)',
            position: 'relative'
          }}
        >
          {/* Additional blur circles hardcoded */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '25%',
              width: '384px',
              height: '384px',
              background: 'rgba(147, 51, 234, 0.08)',
              borderRadius: '50%',
              filter: 'blur(96px)',
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '0',
              right: '25%',
              width: '384px',
              height: '384px',
              background: 'rgba(59, 130, 246, 0.08)',
              borderRadius: '50%',
              filter: 'blur(96px)',
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '384px',
              height: '384px',
              background: 'rgba(236, 72, 153, 0.2)',
              borderRadius: '50%',
              filter: 'blur(96px)',
              pointerEvents: 'none'
            }}
          />
          <div className="grid grid-cols-3 h-full divide-x divide-border relative z-10" style={{borderColor: theme === 'dark' ? '#334155' : '#e2e8f0'}}>
            {/* Left Panel - Logo */}
            <div className="p-8 space-y-6 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                {/* Logo with two colors */}
                <div className="text-center space-y-4">
                  <h1 className="text-6xl font-bold">
                    <span className="text-foreground">Wiki</span>
                    <span className="text-primary">AI</span>
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-xl text-muted-foreground">
                    {locale === 'ru' 
                      ? 'Интеллектуальное управление знаниями' 
                      : 'Intelligent Knowledge Management'
                    }
                  </p>
                </div>
                
                {/* Simple badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Cloud className="h-3 w-3 mr-1" />
                    {locale === 'ru' ? 'Облачный' : 'Cloud'}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Zap className="h-3 w-3 mr-1" />
                    {locale === 'ru' ? 'Быстрый' : 'Fast'}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Search className="h-3 w-3 mr-1" />
                    {locale === 'ru' ? 'Умный' : 'Smart'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Center Panel - Contact & CTA */}
            <div className="p-8 space-y-6 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">
                    {locale === 'ru' ? 'Свяжитесь с нами' : 'Get Started'}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Контакт' : 'Contact'}
                      </p>
                      <p className="text-sm text-muted-foreground">afanasieffivan@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Телефон' : 'Phone'}
                      </p>
                      <p className="text-sm text-muted-foreground">+375 44 508-85-75</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Школа' : 'School'}
                      </p>
                      <p className="text-sm text-muted-foreground">Гимназия №1, Брест</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Веб-сайт' : 'Website'}
                      </p>
                      <p className="text-sm text-muted-foreground">wikiai.by</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-center">
                  {locale === 'ru' ? 'Сканируйте для начала' : 'Scan to Get Started'}
                </h3>
                <div className="flex flex-col items-center space-y-3">
                  <div className=" rounded-lg border-2 border-dashed border-border">
                    <div className="text-center space-y-2">
                        <img src="qr-code.png" alt="QR Code" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    {locale === 'ru' 
                      ? 'Отсканируйте QR-код чтобы узнать побольше' 
                      : 'Scan QR code for free demo'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Goals & Features */}
            <div className="p-8 space-y-6 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">
                    {locale === 'ru' ? 'Наша миссия' : 'Our Mission'}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Повышение продуктивности' : 'Boost Productivity'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ru' 
                          ? 'Сократить время поиска до 80%' 
                          : 'Reduce search time by up to 80%'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Улучшение сотрудничества' : 'Enhance Collaboration'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ru' 
                          ? 'Единая база знаний для команд' 
                          : 'Unified knowledge base for teams'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Интеллектуальная автоматизация' : 'Intelligent Automation'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ru' 
                          ? 'Автоматизация рутинных задач с помощью ИИ' 
                          : 'Automate routine tasks with AI'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Быстрое принятие решений' : 'Faster Decision Making'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ru' 
                          ? 'Мгновенный доступ к релевантной информации' 
                          : 'Instant access to relevant information'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Масштабируемость' : 'Scalability'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ru' 
                          ? 'Решение, которое растет вместе с вашим бизнесом' 
                          : 'Solution that grows with your business'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {locale === 'ru' ? 'Безопасность данных' : 'Data Security'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'ru' 
                          ? 'Защита конфиденциальной информации на предприятии' 
                          : 'Enterprise-grade protection for sensitive information'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  {locale === 'ru' ? 'Ключевые технологии' : 'Key Technologies'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Database className="h-4 w-4 text-primary flex-shrink-0" />
                    {locale === 'ru' ? 'RAG архитектура' : 'RAG Architecture'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                    {locale === 'ru' ? 'Обработка в реальном времени' : 'Real-time Processing'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                    {locale === 'ru' ? 'Сквозное шифрование' : 'End-to-end Encryption'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4 text-primary flex-shrink-0" />
                    {locale === 'ru' ? 'Масштаб предприятия' : 'Enterprise Scale'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* A4 Horizontal Slide 2 - Back */}
        <div 
          className="leaflet-slide border border-border rounded-lg shadow-xl overflow-hidden print:shadow-none print:rounded-none print:border-0 relative" 
          style={{
            width: '1122px', 
            height: '794px', 
            margin: '0 auto', 
            borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.06) 50%, rgba(236, 72, 153, 0.08) 100%)',
            position: 'relative'
          }}
        >
          {/* Additional blur circles hardcoded */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '25%',
              width: '384px',
              height: '384px',
              background: 'rgba(147, 51, 234, 0.08)',
              borderRadius: '50%',
              filter: 'blur(96px)',
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '0',
              right: '25%',
              width: '384px',
              height: '384px',
              background: 'rgba(59, 130, 246, 0.08)',
              borderRadius: '50%',
              filter: 'blur(96px)',
              pointerEvents: 'none'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '384px',
              height: '384px',
              background: 'rgba(236, 72, 153, 0.2)',
              borderRadius: '50%',
              filter: 'blur(96px)',
              pointerEvents: 'none'
            }}
          />
          <div className="grid grid-cols-3 h-full divide-x divide-border relative z-10" style={{borderColor: theme === 'dark' ? '#334155' : '#e2e8f0'}}>
            {/* Left Panel - Diploma 1 */}
            <div className="p-8 space-y-6 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    {locale === 'ru' ? 'Таланты XXI века' : 'Talent XXI'}
                  </h2>
                </div>
                
                <div className="min-h-[350px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                  <img 
                    src="/talent-diploma.jpg" 
                    alt="Talent Diploma"
                    className="w-full h-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center space-y-2">
                    <Award className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground text-sm">
                      {locale === 'ru' ? 'Диплом 1-й степени международного научно-технического конкурса' : '1st degree diploma of the international scientific and technical competition'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {locale === 'ru' 
                      ? 'Диплом 1-й степени международного научно-технического конкурса'
                      : '1st degree diploma of the international scientific and technical competition'
                    }
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {locale === 'ru' ? 'Международный уровень' : 'International Level'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Center Panel - Diploma 2 */}
            <div className="p-8 space-y-6 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    {locale === 'ru' ? 'Первый шаг в науку' : 'First Step in Science'}
                  </h2>
                </div>
                
                <div className="min-h-[350px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                  <img 
                    src="/first-step-diploma.jpg" 
                    alt="First Step Diploma"
                    className="w-full h-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center space-y-2">
                    <Award className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground text-sm">
                      {locale === 'ru' ? 'Диплом 1-й степени республиканской научной конференции при НАН Беларуси "Первый шаг в науку"' : '1st degree diploma of the scientific conference at the NAS of Belarus "First Step in Science"'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {locale === 'ru' 
                      ? 'Диплом 1-й степени республиканской научной конференции при НАН Беларуси "Первый шаг в науку"'
                      : '1st degree diploma of the scientific conference at the NAS of Belarus "First Step in Science"'
                    }
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {locale === 'ru' ? 'Национальная академия наук' : 'National Academy of Sciences'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Panel - Review */}
            <div className="p-8 space-y-6 overflow-y-auto bg-card/30 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    {locale === 'ru' ? 'Рецензия' : 'Review'}
                  </h2>
                </div>
                
                <div className="min-h-[350px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                  <img 
                    src="/review.png" 
                    alt="Review"
                    className="w-full h-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-center space-y-2">
                    <Image className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground text-sm">
                      {locale === 'ru' ? 'Рецензия заведующего кафедрой интеллектуальных информационных технологий БГУИР' : 'Review from the head of the Department of Intelligent Information Technologies BSUIR'}
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {locale === 'ru' 
                      ? 'Рецензия заведующего кафедрой интеллектуальных информационных технологий БГУИР'
                      : 'Review from the head of the Department of Intelligent Information Technologies BSUIR'
                    }
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {locale === 'ru' ? 'БГУИР' : 'BSUIR'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty spacing below trifold */}
        <div className="h-2 print:hidden"></div>
        
        {/* Footer - Hidden when printing */}
        <div className="text-center text-muted-foreground text-sm print:hidden">
          <p>
            {locale === 'ru' 
              ? '© 2024 WikiAI. Расширение возможностей организаций с помощью интеллектуального управления знаниями.' 
              : '© 2024 WikiAI. Empowering organizations with intelligent knowledge management.'
            }
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              {locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              {locale === 'ru' ? 'Условия использования' : 'Terms of Service'}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              {locale === 'ru' ? 'Документация' : 'Documentation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
