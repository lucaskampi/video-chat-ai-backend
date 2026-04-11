'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getVideo, getPrompts, createTranscription } from '@/lib/api';
import type { Video, Prompt } from '@/lib/api';

interface VideoDetailProps {
  params: { id: string };
}

export default function VideoDetailPage({ params }: VideoDetailProps) {
  const router = useRouter();
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(0.5);
  const [transcribing, setTranscribing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [completion, setCompletion] = useState<string>('');
  const completionRef = useRef<string>('');

  const { data: video, error: videoError } = useSWR<Video | null>(
    `video-${params.id}`,
    () => getVideo(params.id)
  );

  const { data: prompts } = useSWR<Prompt[]>('prompts', getPrompts);

  const selectedPrompt = prompts?.find((p) => p.id === selectedPromptId);

  const handleTranscribe = async () => {
    if (!video) return;

    setTranscribing(true);
    try {
      await createTranscription(video.id);
      router.refresh();
    } catch (err) {
      console.error('Transcription failed:', err);
    } finally {
      setTranscribing(false);
    }
  };

  const handleGenerateCompletion = async () => {
    if (!selectedPrompt?.template || !video) return;

    setGenerating(true);
    setCompletion('');
    completionRef.current = '';

    try {
      const response = await fetch('/api/completion-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: params.id,
          prompt: selectedPrompt.template,
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate completion');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          completionRef.current += chunk;
          setCompletion(completionRef.current);
        }
      }
    } catch (err) {
      console.error('Completion failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!video?.transcription) return;
    await navigator.clipboard.writeText(video.transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (videoError || !video) {
    return (
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Video not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{video.name}</CardTitle>
            <CardDescription>
              Uploaded on {new Date(video.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Type:</span>
              <span className="text-muted-foreground">{video.mimeType}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Transcription</h3>
                {video.transcription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                )}
              </div>

              {video.transcription ? (
                <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {video.transcription}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No transcription available. Generate one to enable AI completions.
                  </p>
                  <Button
                    onClick={handleTranscribe}
                    disabled={transcribing}
                  >
                    {transcribing && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Generate Transcription
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Completion</CardTitle>
            <CardDescription>
              Generate content based on the transcription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!video.transcription ? (
              <p className="text-sm text-muted-foreground">
                Generate a transcription first to enable AI completions.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Prompt Template</Label>
                  <Select
                    value={selectedPromptId}
                    onValueChange={setSelectedPromptId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      {prompts?.map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Temperature: {temperature.toFixed(1)}</Label>
                  <Slider
                    value={[temperature]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={([v]) => setTemperature(v)}
                  />
                </div>

                {completion && (
                  <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {completion}
                  </div>
                )}

                <Button
                  onClick={handleGenerateCompletion}
                  disabled={!selectedPromptId || generating}
                  className="w-full"
                >
                  {generating && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {generating ? 'Generating...' : 'Generate Completion'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
