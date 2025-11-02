"use client";
import { useState, useRef, DragEvent } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string[]; // URLs das imagens
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ value = [], onChange, maxImages = 10 }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (value.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    setUploading(true);

    try {
      const newUrls: string[] = [];
      
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadingIndex(i);
        const file = imageFiles[i];
        const url = await uploadToSupabase(file);
        if (url) {
          newUrls.push(url);
        }
      }

      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload das imagens");
    } finally {
      setUploading(false);
      setUploadingIndex(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload falhou");
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error("URL não retornada");
      }
      return data.url;
    } catch (error: any) {
      console.error("Erro no upload:", error);
      alert(error.message || "Erro ao fazer upload da imagem");
      return null;
    }
  };

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50"}
          ${uploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragging ? "text-primary" : "text-gray-400"}`} />
        <p className="text-gray-600 font-medium mb-1">
          {uploading ? "Enviando imagens..." : dragging ? "Solte as imagens aqui" : "Arraste imagens aqui ou clique para selecionar"}
        </p>
        <p className="text-sm text-gray-500">
          {uploading && uploadingIndex !== null 
            ? `Enviando imagem ${uploadingIndex + 1}...`
            : `${value.length} de ${maxImages} imagens`}
        </p>
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
