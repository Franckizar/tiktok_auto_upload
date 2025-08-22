'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Music, Hash } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FileUpload } from './file-upload';

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(2200, 'Description must be under 2200 characters'),
  hashtags: z.string(),
  privacy: z.enum(['public', 'private', 'friends']),
  scheduledDate: z.date(),
  scheduledTime: z.string(),
  autoAddMusic: z.boolean(),
  musicId: z.string().optional(),
});

type UploadForm = z.infer<typeof uploadSchema>;

const musicOptions = [
  { id: '1', name: 'Trending Beat #1', artist: 'TikTok Audio' },
  { id: '2', name: 'Viral Sound #2', artist: 'Popular Music' },
  { id: '3', name: 'Dance Track #3', artist: 'Beat Maker' },
];

export function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      privacy: 'public',
      autoAddMusic: false,
      scheduledDate: new Date(),
      scheduledTime: '12:00',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: UploadForm) => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual upload logic
      console.log('Uploading:', { file: selectedFile, ...data });
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Post scheduled successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* File Upload */}
        <div>
          <Label className="text-lg font-semibold">Upload Content</Label>
          <div className="mt-2">
            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              onRemoveFile={() => setSelectedFile(null)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your post a catchy title..."
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Write a compelling description..."
                rows={4}
                {...register('description')}
                className={errors.description ? 'border-destructive' : ''}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                ) : (
                  <div />
                )}
                <span className="text-sm text-gray-500">
                  {watchedValues.description?.length || 0}/2200
                </span>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <Label htmlFor="hashtags" className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>Hashtags</span>
              </Label>
              <Input
                id="hashtags"
                placeholder="#viral #fyp #trending"
                {...register('hashtags')}
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate hashtags with spaces
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Privacy */}
            <div>
              <Label>Privacy</Label>
              <Select
                value={watchedValues.privacy}
                onValueChange={(value) => setValue('privacy', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">🌍 Public</SelectItem>
                  <SelectItem value="friends">👥 Friends</SelectItem>
                  <SelectItem value="private">🔒 Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Date */}
            <div>
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !watchedValues.scheduledDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedValues.scheduledDate ? (
                      format(watchedValues.scheduledDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedValues.scheduledDate}
                    onSelect={(date) => setValue('scheduledDate', date!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Schedule Time */}
            <div>
              <Label htmlFor="scheduledTime">Schedule Time</Label>
              <Input
                id="scheduledTime"
                type="time"
                {...register('scheduledTime')}
              />
            </div>

            {/* Auto Add Music */}
            <div className="flex items-center space-x-2">
              <Switch
                id="autoAddMusic"
                checked={watchedValues.autoAddMusic}
                onCheckedChange={(checked) => setValue('autoAddMusic', checked)}
              />
              <Label htmlFor="autoAddMusic" className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span>Auto-add music</span>
              </Label>
            </div>

            {/* Music Selection */}
            {watchedValues.autoAddMusic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Label>Select Music</Label>
                <Select
                  value={watchedValues.musicId}
                  onValueChange={(value) => setValue('musicId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose from TikTok's music library" />
                  </SelectTrigger>
                  <SelectContent>
                    {musicOptions.map((music) => (
                      <SelectItem key={music.id} value={music.id}>
                        <div>
                          <div className="font-medium">{music.name}</div>
                          <div className="text-sm text-gray-500">{music.artist}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={!selectedFile || isSubmitting}
            className="tiktok-gradient text-white min-w-[120px]"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Schedule Post'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}