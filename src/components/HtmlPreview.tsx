import { useEffect, useRef, useState } from 'react';
import { Play, RefreshCw, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HtmlPreviewProps {
  html: string;
  css?: string;
  autoRefresh?: boolean;
}

export const HtmlPreview = ({ html, css = '', autoRefresh = true }: HtmlPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);

  const getFullHtml = () => {
    // Check if the HTML already has a complete structure
    const hasDoctype = html.toLowerCase().includes('<!doctype');
    const hasHtmlTag = html.toLowerCase().includes('<html');
    
    if (hasDoctype || hasHtmlTag) {
      // Inject CSS into existing HTML if provided
      if (css) {
        const styleTag = `<style>${css}</style>`;
        if (html.includes('</head>')) {
          return html.replace('</head>', `${styleTag}</head>`);
        } else if (html.includes('<body')) {
          return html.replace('<body', `${styleTag}<body`);
        }
        return html + styleTag;
      }
      return html;
    }
    
    // Wrap partial HTML in a complete document
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  };

  const updatePreview = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(getFullHtml());
        doc.close();
      }
    }
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    const blob = new Blob([getFullHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  useEffect(() => {
    if (autoRefresh) {
      updatePreview();
    }
  }, [html, css, autoRefresh]);

  useEffect(() => {
    updatePreview();
  }, [key]);

  return (
    <div className={`flex flex-col h-full bg-background border-l border-border ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleRefresh}
            title="Refresh preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleOpenExternal}
            title="Open in new tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
      
      {/* Preview Frame */}
      <div className="flex-1 bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          key={key}
          className="w-full h-full border-0"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      </div>
    </div>
  );
};
