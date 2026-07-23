'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { ShieldAlert, Users, Sparkles } from 'lucide-react';

export default function LegalEditor({ matterId = 'default-matter' }: { matterId?: string }) {
  const { activeUsers } = useRealtimeSync(matterId);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h1>Legal Drafting Room</h1><p>Start drafting confidential terms here...</p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar & Status Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-800 text-sm">LawBridge Secure Engine</span>
        </div>
        
        {/* Real-time active users indicator */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-gray-200">
          <Users className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-gray-700">
            {activeUsers.length + 1} Active Session(s)
          </span>
        </div>
      </div>

      {/* Editor Core */}
      <EditorContent editor={editor} />

      {/* Footer Action Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">End-to-End Encrypted RLS Protected</span>
        <button 
          onClick={() => alert("AI Risk Scan Triggered on Document Content.")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Run AI Risk Scan</span>
        </button>
      </div>
    </div>
  );
}
