import React, { useRef } from 'react';
import { Paperclip, X } from 'lucide-react';

export default function FileUploader({ files, setFiles }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div className="mt-2">
      <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
        <Paperclip size={16} className="mr-1" /> Attach Files
      </button>
      {files.length > 0 && (
        <ul className="mt-2 text-sm text-gray-600">
          {files.map((f, i) => (<li key={i} className="flex items-center"><X size={14} className="mr-1 cursor-pointer text-red-500" onClick={() => setFiles(files.filter((_, index) => index !== i))} /> {f.name}</li>))}
        </ul>
      )}
    </div>
  );
}