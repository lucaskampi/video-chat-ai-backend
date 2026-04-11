'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, FileVideo, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadVideo } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUploadComplete: () => void;
}

const ACCEPTED_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/mp4': ['.m4a'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm', '.weba'],
};

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);
      setError(null);

      try {
        await uploadVideo(file);
        onUploadComplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxFiles: 1,
      maxSize: 50 * 1024 * 1024,
      disabled: uploading,
    });

  const file = acceptedFiles[0];

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50',
        uploading && 'opacity-50 cursor-wait'
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : file ? (
        <div className="flex flex-col items-center gap-2">
          {file.type.startsWith('audio/') ? (
            <FileAudio className="h-8 w-8 text-primary" />
          ) : (
            <FileVideo className="h-8 w-8 text-primary" />
          )}
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop an audio/video file, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            MP3, MP4, WAV, M4A, WEBM supported (max 50MB)
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
