'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { FileUpload } from '@/components/file-upload';
import { VideoList } from '@/components/video-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleVideoDeleted = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <main className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>
        <FileUpload onUploadComplete={handleUploadComplete} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
        <VideoList key={refreshKey} onVideoDeleted={handleVideoDeleted} />
      </section>
    </main>
  );
}
