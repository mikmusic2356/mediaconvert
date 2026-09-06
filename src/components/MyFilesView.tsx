import React, { useState } from 'react';
import { 
  SavedFileItem, 
  UserProfile, 
  FileCategory 
} from '../types';
import { 
  formatBytes 
} from '../services/conversionEngine';
import { 
  FolderLock, 
  Download, 
  Share2, 
  Trash2, 
  Search, 
  HardDrive, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive, 
  Calendar, 
  ArrowDownToLine, 
  Check, 
  ShieldCheck,
  Plus
} from 'lucide-react';

interface MyFilesViewProps {
  files: SavedFileItem[];
  user: UserProfile;
  onDeleteFile: (id: string) => void;
  onOpenShareModal: (files: SavedFileItem[]) => void;
  onNavigateHome: () => void;
}

export const MyFilesView: React.FC<MyFilesViewProps> = ({
  files,
  user,
  onDeleteFile,
  onOpenShareModal,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredFiles = files.filter((file) => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.format.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const storagePercentage = Math.min(100, Math.round((user.storageUsedBytes / user.storageLimitBytes) * 100));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id));
    }
  };

  const handleDownloadSaved = (item: SavedFileItem) => {
    if (item.blob) {
      const url = URL.createObjectURL(item.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      // Create text placeholder download for persisted metadata
      const blob = new Blob([`Archivo MediaConvert guardado: ${item.name}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case 'audio':
        return <Music className="w-4 h-4 text-amber-600" />;
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-cyan-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Storage Quota Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FolderLock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Mis Archivos Guardados
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
            Tu espacio privado para consultar, compartir y re-descargar los archivos que has convertido o comprimido.
          </p>
        </div>

        {/* Storage Meter */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              Almacenamiento disponible
            </span>
            <span className="text-blue-700 font-bold">
              {formatBytes(user.storageUsedBytes)} / {formatBytes(user.storageLimitBytes)}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${Math.max(2, storagePercentage)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Cifrado en reposo y eliminación programable
          </p>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="my-files-search-input"
            type="text"
            placeholder="Buscar en mis archivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-medium text-slate-900 outline-none"
          />
        </div>

        {/* Selected Batch Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              {selectedIds.length} seleccionados
            </span>
            <button
              onClick={() => {
                const selectedItems = files.filter((f) => selectedIds.includes(f.id));
                onOpenShareModal(selectedItems);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir lote</span>
            </button>
            <button
              onClick={() => {
                selectedIds.forEach((id) => onDeleteFile(id));
                setSelectedIds([]);
              }}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Eliminar seleccionados"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Files List Table */}
      {filteredFiles.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3 sm:p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 sm:p-4">Nombre del archivo</th>
                  <th className="p-3 sm:p-4 hidden sm:table-cell">Formato</th>
                  <th className="p-3 sm:p-4">Tamaño</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Fecha</th>
                  <th className="p-3 sm:p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredFiles.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const formattedDate = new Date(item.savedAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isChecked ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="p-3 sm:p-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 sm:p-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            {getCategoryIcon(item.category)}
                          </div>
                          <span className="truncate max-w-xs sm:max-w-md block" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 hidden sm:table-cell">
                        <span className="px-2 py-0.5 bg-slate-100 font-mono font-bold text-slate-700 rounded text-[10px]">
                          {item.format}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 font-medium">{formatBytes(item.resultSize)}</td>
                      <td className="p-3 sm:p-4 hidden md:table-cell text-slate-500">{formattedDate}</td>
                      <td className="p-3 sm:p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenShareModal([item])}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Compartir archivo"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadSaved(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Descargar archivo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteFile(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar de Mis Archivos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FolderLock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery ? 'Sin coincidencias' : 'No tienes archivos guardados todavía'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cuando conviertas o comprimas archivos en la plataforma, pulsa en el botón "Guardar" para conservarlos aquí de forma organizada.
          </p>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Procesar un archivo ahora</span>
          </button>
        </div>
      )}
    </div>
  );
};
