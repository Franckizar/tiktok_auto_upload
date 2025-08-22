import { UploadForm } from '@/components/upload/upload-form';

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Upload Content</h1>
        <p className="text-gray-600 mt-2">
          Upload and schedule your TikTok videos and photos for publishing.
        </p>
      </div>

      <UploadForm />
    </div>
  );
}