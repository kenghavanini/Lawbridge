'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SubmitMatterPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let fileUrl = null;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('matter-attachments')
        .upload(fileName, file);

      if (uploadError) {
        alert(`Error uploading file: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('matter-attachments')
        .getPublicUrl(fileName);
      
      fileUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('matters').insert([
      { title, description, attachment_url: fileUrl, status: 'Pending Review' }
    ]);

    setLoading(false);
    if (error) {
      alert(`Error submitting matter: ${error.message}`);
    } else {
      setSuccessMsg('Matter successfully submitted with attachments!');
      setTitle('');
      setDescription('');
      setFile(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-xl text-white border border-gray-800">
      <h2 className="text-2xl font-bold mb-4">Submit New Matter</h2>
      {successMsg && <div className="p-3 mb-4 bg-green-900 text-green-200 rounded">{successMsg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Matter Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="e.g., Contract Review"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Describe your legal matter..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Attach Picture / Document</label>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-600 file:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded font-semibold transition"
        >
          {loading ? 'Submitting...' : 'Submit Live Matter'}
        </button>
      </form>
    </div>
  );
}
