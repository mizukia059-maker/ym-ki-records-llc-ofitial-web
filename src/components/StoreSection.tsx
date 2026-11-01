import React, { useState } from 'react';
import {
  Store,
  Tag,
  Plus,
  ChevronLeft,
  ChevronRight,
  Coins,
  Sparkles,
  ShoppingBag,
  Layers,
  X,
  Repeat,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, CurrencyType } from '../types';

interface StoreSectionProps {
  initialSearchQuery?: string;
}

export const StoreSection: React.FC<StoreSectionProps> = ({ initialSearchQuery = '' }) => {
  const {
    products,
    inventory,
    userProfile,
    isPrivileged,
    addProductToStore,
    buyProduct,
    listItemInOutlet,
    buyOutletProduct,
    themeGradient,
    showToast
  } = useApp();

  const [storeMode, setStoreMode] = useState<'official' | 'outlet'>('official');
  const [searchFilter, setSearchFilter] = useState(initialSearchQuery);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Add Product Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [tagsList, setTagsList] = useState<string[]>(['álbum', 'photocard']);
  const [tagInput, setTagInput] = useState('');
  const [stockType, setStockType] = useState<'unlimited' | 'fixed'>('fixed');
  const [stockCount, setStockCount] = useState<number>(20);
  const [associatedArtistsInput, setAssociatedArtistsInput] = useState('');
  const [currencyType, setCurrencyType] = useState<CurrencyType>('coins');
  const [priceCoins, setPriceCoins] = useState<number>(250);
  const [priceGems, setPriceGems] = useState<number>(25);

  // Resell modal state
  const [isResellModalOpen, setIsResellModalOpen] = useState(false);
  const [resellItemId, setResellItemId] = useState('');
  const [resalePriceInput, setResalePriceInput] = useState<number>(200);

  // Image browsing for card previews
  const [productSlideIndices, setProductSlideIndices] = useState<Record<string, number>>({});

  const canAddOfficial = isPrivileged();

  // Filter products by mode, search & tag
  const filteredProducts = products.filter((p) => {
    if (storeMode === 'official' && p.isOutlet) return false;
    if (storeMode === 'outlet' && !p.isOutlet) return false;

    if (searchFilter) {
      const match =
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
      if (!match) return false;
    }

    if (selectedTag !== 'all') {
      if (!p.tags.includes(selectedTag)) return false;
    }

    return true;
  });

  // Handle adding image URLs (up to 10)
  const handleAddImageUrl = (url: string) => {
    if (!url.trim()) return;
    if (imageUrls.length >= 10) {
      showToast('Límite de 10 imágenes alcanzado para este producto.');
      return;
    }
    setImageUrls([...imageUrls, url.trim()]);
    setNewImageUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageUrls.length >= 10) {
      showToast('Límite de 10 imágenes alcanzado.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrls([...imageUrls, reader.result]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const copy = [...imageUrls];
    copy.splice(index, 1);
    setImageUrls(copy);
    if (currentImageIndex >= copy.length && copy.length > 0) {
      setCurrentImageIndex(copy.length - 1);
    }
  };

  // Tags press Enter handler
  const handleTagKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tagsList.includes(val)) {
        setTagsList([...tagsList, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (t: string) => {
    setTagsList(tagsList.filter((x) => x !== t));
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      showToast('Añade al menos una imagen (hasta 10 en formato 1:1).');
      return;
    }

    const artists = associatedArtistsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const ok = addProductToStore({
      name: prodName.trim(),
      description: prodDesc.trim(),
      images: imageUrls,
      tags: tagsList,
      stockType,
      stockCount: stockType === 'fixed' ? Number(stockCount) : 9999,
      associatedArtists: artists,
      currencyType,
      priceCoins: currencyType === 'gems' ? 0 : Number(priceCoins),
      priceGems: currencyType === 'coins' ? 0 : Number(priceGems),
      createdBy: userProfile.username,
      isOutlet: false
    });

    if (ok) {
      setIsAddModalOpen(false);
      setImageUrls([]);
      setProdName('');
      setProdDesc('');
      setTagsList(['álbum', 'photocard']);
      setAssociatedArtistsInput('');
    }
  };

  const handleResellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resellItemId) return;
    const ok = listItemInOutlet(resellItemId, resalePriceInput);
    if (ok) {
      setIsResellModalOpen(false);
      setResellItemId('');
      setStoreMode('outlet');
    }
  };

  const allTags = Array.from(new Set(products.flatMap((p) => p.tags)));

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> YM-ki Merch & Market
            </span>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Tu saldo: {userProfile.coins.toLocaleString()} Coins
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tienda Oficial & Modo Outlet
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Consigue merchandising de tus artistas favoritos con tus YM-Coins,
            exhíbelo en tu vitrina o revende tus artículos en el Outlet de segunda mano.
          </p>
        </div>

        {/* Mode Switcher & Add Product Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full sm:w-auto">
          <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-700">
            <button
              onClick={() => setStoreMode('official')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                storeMode === 'official'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Tienda Oficial
            </button>
            <button
              onClick={() => setStoreMode('outlet')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                storeMode === 'outlet'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" /> Modo Outlet
            </button>
          </div>

          {storeMode === 'official' && canAddOfficial && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Añadir a la Tienda
            </button>
          )}

          {storeMode === 'outlet' && inventory.length > 0 && (
            <button
              onClick={() => {
                setResellItemId(inventory[0].id);
                setIsResellModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <Repeat className="w-4 h-4" /> Revender un Item
            </button>
          )}
        </div>
      </div>

      {/* Filter and Tags Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Buscar por nombre, descripción o artista..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center justify-center gap-2">
          <Store className="w-10 h-10 text-slate-600" />
          <p className="text-base font-semibold text-slate-300">
            {storeMode === 'official'
              ? 'No hay productos oficiales disponibles con estos filtros.'
              : 'El Outlet no tiene artículos de segunda mano en este momento.'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            {storeMode === 'outlet'
              ? 'Los usuarios pueden revender aquí los items comprados en la tienda oficial.'
              : 'Vuelve más tarde para nuevos lanzamientos o ajusta tu búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const currentImgIndex = productSlideIndices[prod.id] || 0;
            const currentImg = prod.images[currentImgIndex] || prod.images[0];
            const hasMultipleImages = prod.images.length > 1;

            const nextImg = (e: React.MouseEvent) => {
              e.stopPropagation();
              setProductSlideIndices((prev) => ({
                ...prev,
                [prod.id]: (currentImgIndex + 1) % prod.images.length
              }));
            };

            const prevImg = (e: React.MouseEvent) => {
              e.stopPropagation();
              setProductSlideIndices((prev) => ({
                ...prev,
                [prod.id]: (currentImgIndex - 1 + prod.images.length) % prod.images.length
              }));
            };

            return (
              <div
                key={prod.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container in 1:1 square format with pure WHITE background for aspect ratio containment */}
                  <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={currentImg}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />

                    {/* Navigation arrows for images */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImg}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition shadow"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextImg}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition shadow"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] text-white font-medium">
                          {currentImgIndex + 1} / {prod.images.length}
                        </div>
                      </>
                    )}

                    {/* Badge outlet or official */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      {prod.isOutlet ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wide shadow">
                          Outlet / Reventa
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wide shadow">
                          Oficial
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {prod.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    {prod.associatedArtists.length > 0 && (
                      <p className="text-[11px] text-slate-500">
                        Artistas: <strong className="text-slate-300">{prod.associatedArtists.join(', ')}</strong>
                      </p>
                    )}

                    {prod.resellerUsername && (
                      <p className="text-[11px] text-amber-400/90 font-medium">
                        Vendedor: @{prod.resellerUsername}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer and Purchase */}
                <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Precio:</span>
                    <div className="flex flex-col gap-0.5">
                      {(prod.currencyType === 'coins' || !prod.currencyType || prod.currencyType === 'both') && prod.priceCoins > 0 && (
                        <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          {prod.priceCoins.toLocaleString()} Coins
                        </span>
                      )}
                      {(prod.currencyType === 'gems' || prod.currencyType === 'both') && (prod.priceGems || 0) > 0 && (
                        <span className="text-sm font-extrabold text-cyan-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          {prod.priceGems?.toLocaleString()} Gemas
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {prod.stockType === 'fixed'
                        ? `Stock: ${prod.stockCount} uds.`
                        : 'Stock ilimitado'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    {prod.isOutlet ? (
                      <button
                        onClick={() => buyOutletProduct(prod.id)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg whitespace-nowrap cursor-pointer"
                      >
                        Comprar Reventa
                      </button>
                    ) : prod.currencyType === 'both' ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => buyProduct(prod.id, 'coins')}
                          style={{ background: themeGradient }}
                          className="theme-btn px-2.5 py-1.5 text-white rounded-xl text-[11px] font-bold transition shadow-lg whitespace-nowrap cursor-pointer flex items-center gap-1"
                          title={`Pagar ${prod.priceCoins} Coins`}
                        >
                          <Coins className="w-3 h-3 text-amber-300" /> Comprar Coins
                        </button>
                        <button
                          onClick={() => buyProduct(prod.id, 'gems')}
                          className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-bold transition shadow-lg whitespace-nowrap cursor-pointer flex items-center gap-1"
                          title={`Pagar ${prod.priceGems} Gemas`}
                        >
                          <Sparkles className="w-3 h-3 text-cyan-200" /> Comprar Gemas
                        </button>
                      </div>
                    ) : prod.currencyType === 'gems' ? (
                      <button
                        onClick={() => buyProduct(prod.id, 'gems')}
                        className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg whitespace-nowrap cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-200" /> Comprar con Gemas
                      </button>
                    ) : (
                      <button
                        onClick={() => buyProduct(prod.id, 'coins')}
                        style={{ background: themeGradient }}
                        className="theme-btn px-3.5 py-1.5 text-white rounded-xl text-xs font-bold transition shadow-lg whitespace-nowrap cursor-pointer flex items-center gap-1"
                      >
                        <Coins className="w-3 h-3 text-amber-300" /> Comprar con Coins
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Añadir a la Tienda (Administradores y Artistas) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Publicar Producto en la Tienda Oficial</h3>
                  <p className="text-xs text-slate-400">
                    Sube hasta 10 imágenes (formato 1:1), datos de stock y artistas vinculados.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="flex flex-col gap-4">
              {/* Image upload area with 1:1 square preview and WHITE background */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Imágenes del Producto (hasta 10 fotos en formato 1:1 cuadrado, sobrante en blanco):
                </label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* 1:1 Preview Box */}
                  <div className="relative w-44 h-44 aspect-square bg-white rounded-2xl border-2 border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0 p-2 shadow-inner">
                    {imageUrls.length > 0 ? (
                      <>
                        <img
                          src={imageUrls[currentImageIndex]}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        {imageUrls.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentImageIndex(
                                  (currentImageIndex - 1 + imageUrls.length) % imageUrls.length
                                )
                              }
                              className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 text-white"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentImageIndex(
                                  (currentImageIndex + 1) % imageUrls.length
                                )
                              }
                              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 text-white"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">
                              {currentImageIndex + 1} / {imageUrls.length}
                            </span>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(currentImageIndex)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 hover:bg-red-500 text-white"
                          title="Eliminar esta imagen"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1 text-center p-2">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                        <span className="text-[10px] text-slate-600 font-medium">Formato 1:1</span>
                      </div>
                    )}
                  </div>

                  {/* Add Image Inputs */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        placeholder="Pegar URL de imagen..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImageUrl(newImageUrlInput)}
                        disabled={imageUrls.length >= 10}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                      >
                        Añadir
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">O subir archivo local:</span>
                      <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded-xl font-medium text-slate-200">
                        Examinar foto...
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={imageUrls.length >= 10}
                        />
                      </label>
                      <span className="text-[10px] text-slate-500">
                        ({imageUrls.length}/10 subidas)
                      </span>
                    </div>

                    {/* Thumbnail strip */}
                    {imageUrls.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto pt-1">
                        {imageUrls.map((url, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-10 h-10 aspect-square bg-white rounded-lg p-0.5 border cursor-pointer flex-shrink-0 ${
                              currentImageIndex === idx
                                ? 'border-indigo-500 ring-2 ring-indigo-500'
                                : 'border-slate-700 opacity-60'
                            }`}
                          >
                            <img src={url} alt="" className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Producto:
                </label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Ej: Photocard Especial Holográfica - Tour 2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción del Producto:
                </label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Detalles sobre el material, dimensiones, contenido y autenticidad..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white min-h-[70px]"
                  required
                />
              </div>

              {/* Tags (album, photocard, peluche, nueva etiqueta - separated on Enter) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Etiquetas del Producto (presiona Enter para separar):
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-800 border border-slate-700 rounded-xl items-center">
                  {tagsList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-lg text-xs"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeydown}
                    placeholder="Escribe etiqueta y pulsa Enter (ej: peluche, album)..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-[140px]"
                  />
                </div>
              </div>

              {/* Stock and Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Stock o Cantidad de Copias:
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setStockType('fixed')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        stockType === 'fixed'
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      Cantidad fija
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockType('unlimited')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                        stockType === 'unlimited'
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      Ilimitadas
                    </button>
                  </div>
                  {stockType === 'fixed' && (
                    <input
                      type="number"
                      min="1"
                      value={stockCount}
                      onChange={(e) => setStockCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="Cantidad de copias disponibles..."
                      required
                    />
                  )}
                </div>

                {/* Currency Type Selector (Coins, Gems, Ambas) as requested */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tipo de Moneda Aceptada:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrencyType('coins')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                        currencyType === 'coins'
                          ? 'border-amber-400 bg-amber-400/20 text-amber-300 ring-2 ring-amber-400/40'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> Coins
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyType('gems')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                        currencyType === 'gems'
                          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300 ring-2 ring-cyan-400/40'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Gemas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyType('both')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 ${
                        currencyType === 'both'
                          ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-400/40'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      💎+🪙 Ambas
                    </button>
                  </div>
                </div>

                {/* Price in Coins */}
                {(currencyType === 'coins' || currencyType === 'both') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Precio en YM-Coins:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={priceCoins}
                        onChange={(e) => setPriceCoins(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white pl-8"
                        required
                      />
                      <Coins className="w-4 h-4 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Price in Gems */}
                {(currencyType === 'gems' || currencyType === 'both') && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Precio en Gemas Oficiales:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={priceGems}
                        onChange={(e) => setPriceGems(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white pl-8"
                        required
                      />
                      <Sparkles className="w-4 h-4 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Associated Artists */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Artistas asociados al producto (mencionar usuarios separados por coma):
                </label>
                <input
                  type="text"
                  value={associatedArtistsInput}
                  onChange={(e) => setAssociatedArtistsInput(e.target.value)}
                  placeholder="Ej: CEO Miki, AlexBeats, Sofia Vocal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: themeGradient }}
                  className="theme-btn flex-1 py-2.5 text-white font-bold rounded-xl text-xs transition shadow-lg cursor-pointer"
                >
                  Publicar en Tienda Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Revender en Outlet */}
      {isResellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleResellSubmit}
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold flex items-center gap-2 text-amber-400">
                <Repeat className="w-5 h-5" /> Revender en Modo Outlet
              </h4>
              <button
                type="button"
                onClick={() => setIsResellModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selecciona el item de tu inventario a revender:
              </label>
              <select
                value={resellItemId}
                onChange={(e) => setResellItemId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.productName} (Comprado por {item.pricePaid} Coins)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tu precio de reventa en YM-Coins:
              </label>
              <input
                type="number"
                min="1"
                value={resalePriceInput}
                onChange={(e) => setResalePriceInput(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Al comprarlo otro usuario, recibirás el 100% de las Coins en tu saldo.
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResellModalOpen(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg"
              >
                Publicar en Outlet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
