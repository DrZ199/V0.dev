'use client';

import React, { useContext, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { MessageContext } from '@/providers/MessageContext';
import { Download, FileText } from 'lucide-react';

const ExportButton = () => {
  const { id } = useParams();
  const messageContext = useContext(MessageContext);
  const [isExporting, setIsExporting] = useState(false);

  const workspaceData = useQuery(api.workspace.GetUserWorkSpace, {
    workspaceId: id as Id<'workspaces'>,
  });

  const generateProjectStructure = (files: Record<string, { code: string }>) => {
    let structure = '';
    
    const processFiles = (fileObj: Record<string, { code: string }>, path = '') => {
      Object.keys(fileObj).forEach((key) => {
        if (key === 'code') return;
        
        const fullPath = path ? `${path}/${key}` : key;
        const item = fileObj[key];
        
        if (item && typeof item === 'object' && item.code) {
          structure += `${fullPath}\n`;
        } else if (item && typeof item === 'object') {
          structure += `${fullPath}/\n`;
          processFiles(item, fullPath);
        }
      });
    };
    
    processFiles(files);
    return structure;
  };

  const createZipFile = async (files: Record<string, { code: string }>) => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    const processFilesForZip = (fileObj: Record<string, { code: string }>, path = '') => {
      Object.keys(fileObj).forEach((key) => {
        if (key === 'code') return;
        
        const fullPath = path ? `${path}/${key}` : key;
        const item = fileObj[key];
        
        if (item && typeof item === 'object' && item.code) {
          zip.file(fullPath, item.code);
        } else if (item && typeof item === 'object') {
          processFilesForZip(item, fullPath);
        }
      });
    };
    
    processFilesForZip(files);
    return zip.generateAsync({ type: 'blob' });
  };

  const exportAsZip = async () => {
    if (!workspaceData?.fileData) return;
    
    setIsExporting(true);
    try {
      const zipBlob = await createZipFile(workspaceData.fileData);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      
      const workspaceTitle = messageContext?.messages?.[0]?.content || 'project';
      const cleanTitle = workspaceTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      
      a.download = `${cleanTitle}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting project:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = () => {
    if (!workspaceData?.fileData) return;
    
    const structure = generateProjectStructure(workspaceData.fileData);
    const content = `Project Structure:\n\n${structure}\n\nFiles:\n\n`;
    
    const processFilesForText = (fileObj: Record<string, { code: string }>, path = '') => {
      Object.keys(fileObj).forEach((key) => {
        if (key === 'code') return;
        
        const fullPath = path ? `${path}/${key}` : key;
        const item = fileObj[key];
        
        if (item && typeof item === 'object' && item.code) {
          return `${fullPath}:\n\`\`\`\n${item.code}\n\`\`\`\n\n`;
        } else if (item && typeof item === 'object') {
          return processFilesForText(item, fullPath);
        }
      });
    };
    
    const filesContent = processFilesForText(workspaceData.fileData);
    const fullContent = content + filesContent;
    
    const blob = new Blob([fullContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const workspaceTitle = messageContext?.messages?.[0]?.content || 'project';
    const cleanTitle = workspaceTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    
    a.download = `${cleanTitle}_code.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!workspaceData?.fileData || Object.keys(workspaceData.fileData).length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportAsZip}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export as ZIP
          </>
        )}
      </button>
      
      <button
        onClick={exportAsText}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <FileText className="h-4 w-4" />
        Export as Text
      </button>
    </div>
  );
};

export default ExportButton;