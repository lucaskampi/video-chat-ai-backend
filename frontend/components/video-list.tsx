'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { FileAudio, FileVideo, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getVideos, deleteVideo } from '@/lib/api';
import type { Video } from '@/lib/api';

interface VideoListProps {
  onVideoDeleted: () => void;
}

export function VideoList({ onVideoDeleted }: VideoListProps) {
  const { data: videos, error, isLoading, mutate } = useSWR<Video[]>(
    'videos',
    getVideos
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await deleteVideo(id);
      mutate();
      onVideoDeleted();
    } catch (err) {
      console.error('Failed to delete video:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load videos</p>
        </CardContent>
      </Card>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            No videos uploaded yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 truncate">
              {video.mimeType.startsWith('audio/') ? (
                <FileAudio className="h-5 w-5 flex-shrink-0" />
              ) : (
                <FileVideo className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="truncate">{video.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(video.createdAt).toLocaleDateString()}
            </div>

            {video.transcription && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {video.transcription.substring(0, 100)}...
              </p>
            )}

            <div className="flex gap-2">
              <Link href={`/video/${video.id}`} className="flex-1">
                <Button variant="default" size="sm" className="w-full">
                  {video.transcription ? 'View' : 'Transcribe'}
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(video.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
