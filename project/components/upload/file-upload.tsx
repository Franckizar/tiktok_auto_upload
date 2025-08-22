'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Play, Pause, FileVideo, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onRemoveFile }: FileUploadProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    maxFiles: 1,
  });

  const isVideo = selectedFile?.type.startsWith('video/');
  const isImage = selectedFile?.type.startsWith('image/');

  if (selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="relative bg-black rounded-lg overflow-hidden">
          <Button
            onClick={onRemoveFile}
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>

          {isVideo ? (
            <div className="relative">
              <video
                src={URL.createObjectURL(selectedFile)}
                className="w-full h-64 object-cover"
                controls={false}
                loop
                muted
                ref={(video) => {
                  if (video) {
                    isPlaying ? video.play() : video.pause();
                  }
                }}
              />
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 bg-black/30 hover:bg-black/50 text-white"
                variant="ghost"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
            </div>
          ) : isImage ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          ) : null}

          <div className="p-4 bg-white">
            <div className="flex items-center space-x-2">
              {isVideo ? (
                <FileVideo className="h-5 w-5 text-tiktok-pink" />
              ) : (
                <Image className="h-5 w-5 text-tiktok-cyan" />
              )}
              <div>
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Separate the dropzone props from motion props
  const dropzoneProps = getRootProps();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
        ${isDragActive 
          ? 'border-tiktok-pink bg-pink-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
      // Apply dropzone props except for potentially conflicting ones
      onClick={dropzoneProps.onClick}
      onKeyDown={dropzoneProps.onKeyDown}
      onDrop={dropzoneProps.onDrop}
      onDragEnter={dropzoneProps.onDragEnter}
      onDragLeave={dropzoneProps.onDragLeave}
      onDragOver={dropzoneProps.onDragOver}
      tabIndex={dropzoneProps.tabIndex}
      role={dropzoneProps.role}
      ref={dropzoneProps.ref}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Upload className={`mx-auto h-12 w-12 ${
          isDragActive ? 'text-tiktok-pink' : 'text-gray-400'
        }`} />
      </motion.div>
      <p className="mt-4 text-lg font-medium">
        {isDragActive 
          ? 'Drop your file here' 
          : 'Drag & drop your video or photo here'
        }
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Supports MP4, MOV, AVI, MKV, JPG, PNG, GIF (Max 100MB)
      </p>
      <Button className="mt-4 tiktok-gradient text-white">
        Choose File
      </Button>
    </motion.div>
  );
}