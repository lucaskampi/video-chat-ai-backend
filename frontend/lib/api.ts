const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export interface Video {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  transcription: string | null;
  createdAt: string;
}

export interface Prompt {
  id: string;
  title: string;
  template: string;
}

export async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${API_URL}/videos`);
  if (!res.ok) throw new Error('Failed to fetch videos');
  const data = await res.json();
  return data.data;
}

export async function getVideo(id: string): Promise<Video | null> {
  const res = await fetch(`${API_URL}/videos/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export async function uploadVideo(file: File): Promise<Video> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/videos`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to upload video');
  }

  const data = await res.json();
  return data.data;
}

export async function deleteVideo(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/videos/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete video');
}

export async function createTranscription(
  videoId: string,
  prompt?: string
): Promise<{ transcription: string }> {
  const res = await fetch(`${API_URL}/videos/${videoId}/transcription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error('Failed to create transcription');
  const data = await res.json();
  return data.data;
}

export async function getPrompts(): Promise<Prompt[]> {
  const res = await fetch(`${API_URL}/prompts`);
  if (!res.ok) throw new Error('Failed to fetch prompts');
  const data = await res.json();
  return data.data;
}

export function getStreamingCompletion(
  videoId: string,
  prompt: string,
  temperature: number = 0.5
) {
  return fetch(`${API_URL}/ai/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId, prompt, temperature }),
  });
}
