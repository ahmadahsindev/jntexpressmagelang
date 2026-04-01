"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Heading2, List, ListOrdered, ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md w-full max-w-full my-4 shadow-sm border border-border inline-block',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'min-h-[250px] p-4 bg-surface-container-lowest border border-border rounded-b-md focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-colors prose max-w-none text-sm font-sans text-on-surface',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const toastId = toast.loading('Mengunggah gambar...');
      try {
        const url = await uploadToCloudinary(file);
        // Explicitly format as an HTML img tag, Tiptap automatically parses it.
        editor.chain().focus().setImage({ src: url }).run();
        toast.success('Gambar berhasil diunggah!', { id: toastId });
      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      }
    };
    input.click();
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-surface-container border border-b-0 border-border p-1 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-sm transition-colors ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-sm transition-colors ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-sm transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
        >
          <Heading2 size={16} />
        </button>
        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-sm transition-colors ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-sm transition-colors ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
        >
          <ListOrdered size={16} />
        </button>
        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-sm transition-colors hover:bg-surface-container-high hover:text-primary text-on-surface-variant flex items-center gap-1"
        >
          <ImageIcon size={16} />
        </button>
      </div>
      
      {/* Editor Main Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
