'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image, Video, Box, Sparkles, Trash2, Plus, Wallet, Check, AlertTriangle, Loader2, Settings, Tag, Layers, Hash, Crown, Flame, Shield, Star } from 'lucide-react';
// Wallet connection handled by global provider

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | '3d';
}

interface NFTProperty {
  id: string;
  trait_type: string;
  value: string;
}

const MINT_FEE = 10;

const RARITY_CONFIG = [
  { id: 'common', name: '普通', color: 'gray', icon: '⬜' },
  { id: 'uncommon', name: '稀有', icon: '🟢', color: 'green' },
  { id: 'rare', name: '罕见', icon: '🔵', color: 'blue' },
  { id: 'epic', name: '史诗', icon: '🟣', color: 'purple' },
  { id: 'legendary', name: '传说', icon: '🟡', color: 'yellow' },
  { id: 'mythic', name: '神话', icon: '🔴', color: 'red' },
];

const PROPERTY_TEMPLATES = [
  { trait_type: '背景', values: ['星空', '沙漠', '海洋', '森林', '城市', '太空'] },
  { trait_type: '风格', values: ['卡通', '写实', '抽象', '赛博朋克', '水墨', '像素'] },
  { trait_type: '元素', values: ['火焰', '冰霜', '雷电', '风暴', '光明', '黑暗'] },
  { trait_type: '角色', values: ['战士', '法师', '刺客', '弓手', '坦克', '辅助'] },
];

export default function CreatePage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [is3DMode, setIs3DMode] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintStep, setMintStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const model3DInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    collection: '',
    collectionId: '',
    royalty: 5,
    supply: 1,
    rarity: 'common',
    category: '',
    tags: [] as string[],
    externalUrl: '',
    isSoulbound: false,
    isTransferable: true,
  });

  const [properties, setProperties] = useState<NFTProperty[]>([]);
  const [newProperty, setNewProperty] = useState({ trait_type: '', value: '' });
  const [tagInput, setTagInput] = useState('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: MediaFile[] = Array.from(files).map(file => ({
        id: generateId(),
        file,
        preview: URL.createObjectURL(file),
        type: 'image' as const,
      }));
      setMediaFiles([...mediaFiles, ...newFiles]);
    }
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      setMediaFiles([...mediaFiles, { id: generateId(), file, preview: URL.createObjectURL(file), type: 'video' }]);
    }
    e.target.value = '';
  };

  const handle3DUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      setMediaFiles([...mediaFiles, { id: generateId(), file, preview: URL.createObjectURL(file), type: '3d' }]);
    }
    e.target.value = '';
  };

  const removeFile = (id: string) => setMediaFiles(mediaFiles.filter(f => f.id !== id));

  const handleMintAs3D = () => {
    if (mediaFiles.length === 0) return;
    setIsMinting(true);
    setMintStep(0);
    const interval = setInterval(() => {
      setMintStep(prev => {
        if (prev >= 100) { clearInterval(interval); setIsMinting(false); setIs3DMode(true); return 100; }
        return prev + 10;
      });
    }, 300);
  };

  const addProperty = () => {
    if (newProperty.trait_type && newProperty.value) {
      setProperties([...properties, { id: generateId(), ...newProperty }]);
      setNewProperty({ trait_type: '', value: '' });
    }
  };

  const removeProperty = (id: string) => setProperties(properties.filter(p => p.id !== id));
  const addTemplateProperty = (trait_type: string, value: string) => setProperties([...properties, { id: generateId(), trait_type, value }]);

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput) && form.tags.length < 5) {
      setForm({ ...form, tags: [...form.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  const handleSubmit = async () => {
    if (!form.name || mediaFiles.length === 0) { setError('请填写名称并上传素材'); return; }
    if (!walletConnected) { setError('请先连接钱包'); return; }
    setError(null);
    setIsMinting(true);
    setMintStep(1);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMintStep(2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMintStep(3);
      setSuccess(true);
      setIsMinting(false);
    } catch (e) { setError(e instanceof Error ? e.message : '铸造失败'); setIsMinting(false); }
  };

  const getMetadataJSON = () => JSON.stringify({ name: form.name, description: form.description, properties, rarity: form.rarity }, null, 2);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">✨ NFT铸造</h1>
          {/* Wallet in Header */}
        </div>

        {/* Fee Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 md:p-4 mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-amber-400 text-sm md:text-base">铸造费用: {MINT_FEE} SUI</div>
              <div className="text-xs md:text-sm text-gray-400 hidden sm:block">支付后将立即铸造NFT到你的钱包</div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {isMinting && (
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 md:p-6 mb-4">
            <div className="text-center">
              <Loader2 className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-violet-400 animate-spin" />
              <div className="font-bold text-sm md:text-base mb-2">
                {mintStep === 1 && '⏳ 等待支付确认...'}
                {mintStep === 2 && '✅ 支付成功！正在铸造NFT...'}
                {mintStep === 3 && '🎉 铸造完成！'}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${mintStep}%` }} />
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              <div>
                <div className="font-bold text-green-400">铸造成功！</div>
                <div className="text-sm text-gray-400">你的NFT已发送到钱包</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 md:p-4 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />
              <div className="text-red-400 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - Upload */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="font-bold text-base md:text-lg mb-2 md:mb-4">📤 上传素材</h2>
            
            <div className="border-2 border-dashed border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                {[
                  { icon: Image, color: 'violet', label: '图片', ref: imageInputRef, action: handleImageUpload },
                  { icon: Video, color: 'pink', label: '视频', ref: videoInputRef, action: handleVideoUpload },
                  { icon: Box, color: 'cyan', label: '3D', ref: model3DInputRef, action: handle3DUpload },
                ].map((item, i) => (
                  <div key={i} onClick={() => item.ref.current?.click()} className="aspect-square bg-white/5 rounded-lg md:rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition border border-white/10">
                    <item.icon className={`w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 text-${item.color}-400`} />
                    <span className="text-[10px] md:text-xs text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>

              <input ref={imageInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              <input ref={model3DInputRef} type="file" accept=".glb,.gltf" onChange={handle3DUpload} className="hidden" />

              {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {mediaFiles.map(file => (
                    <div key={file.id} className="relative aspect-square bg-white/5 rounded-lg overflow-hidden group">
                      {file.type === 'image' && <img src={file.preview} alt="" className="w-full h-full object-cover" />}
                      {file.type === 'video' && <video src={file.preview} className="w-full h-full object-cover" />}
                      {file.type === '3d' && <div className="w-full h-full flex items-center justify-center bg-cyan-900/30"><Box className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" /></div>}
                      <button onClick={() => removeFile(file.id)} className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {mediaFiles.length < 9 && (
                    <div onClick={() => imageInputRef.current?.click()} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 border border-dashed border-white/20">
                      <Plus className="w-4 h-4 md:w-6 md:h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3 md:py-4">
                  <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-xs md:text-sm text-gray-400">支持批量上传多个图片</p>
                </div>
              )}
            </div>

            {mediaFiles.length > 0 && !is3DMode && (
              <button onClick={handleMintAs3D} disabled={isMinting} className="w-full py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                ✨ 铸造成3D
              </button>
            )}

            {is3DMode && (
              <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-3 md:p-4 flex items-center gap-3">
                <Box className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="font-bold text-cyan-400 text-sm md:text-base">3D铸造完成！</div>
                  <div className="text-xs text-gray-400">已转换为3D立体格式</div>
                </div>
              </div>
            )}

            {/* Properties */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <h3 className="font-bold mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <Layers className="w-4 h-4" />
                属性 (Traits)
              </h3>
              
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">快速添加</p>
                <div className="flex flex-wrap gap-1">
                  {PROPERTY_TEMPLATES.map(t => (
                    <div key={t.trait_type} className="relative group">
                      <button className="text-[10px] md:text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-gray-400">
                        {t.trait_type}
                      </button>
                      <div className="absolute top-full left-0 mt-1 bg-black border border-white/20 rounded-lg p-1.5 hidden group-hover:block z-10 min-w-[100px]">
                        {t.values.map(v => (
                          <button key={v} onClick={() => addTemplateProperty(t.trait_type, v)} className="block w-full text-left text-[10px] md:text-xs px-2 py-1 hover:bg-white/10 rounded">
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-1.5 md:gap-2 mb-3">
                <input value={newProperty.trait_type} onChange={(e) => setNewProperty({ ...newProperty, trait_type: e.target.value })} placeholder="属性名" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm outline-none focus:border-violet-500" />
                <input value={newProperty.value} onChange={(e) => setNewProperty({ ...newProperty, value: e.target.value })} placeholder="属性值" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm outline-none focus:border-violet-500" />
                <button onClick={addProperty} className="px-3 md:px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-500">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {properties.length > 0 && (
                <div className="space-y-1.5 md:space-y-2">
                  {properties.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-lg px-2 md:px-3 py-2">
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-[10px] md:text-xs text-gray-400">{p.trait_type}:</span>
                        <span className="text-xs md:text-sm">{p.value}</span>
                      </div>
                      <button onClick={() => removeProperty(p.id)} className="text-gray-500 hover:text-red-400 p-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Form */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="font-bold text-base md:text-lg mb-2 md:mb-4">📝 详细信息</h2>
            
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">名称 *</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="输入NFT名称" className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:border-violet-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">描述</label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="描述你的NFT..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:border-violet-500 outline-none resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  系列
                </label>
                <select value={form.collectionId} onChange={(e) => setForm({...form, collectionId: e.target.value, collection: e.target.options[e.target.selectedIndex]?.text || ''})} className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:border-violet-500 outline-none">
                  <option value="">选择NFT系列</option>
                  <option value="1">星辰大海系列</option>
                  <option value="2">烈焰麒麟系列</option>
                  <option value="3">冰晶之心系列</option>
                </select>
              </div>
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  分类
                </label>
                <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:border-violet-500 outline-none">
                  <option value="">选择分类</option>
                  <option value="art">艺术</option>
                  <option value="collectible">收藏品</option>
                  <option value="game">游戏道具</option>
                  <option value="music">音乐</option>
                </select>
              </div>
            </div>

            {/* Rarity */}
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                稀有度
              </label>
              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                {RARITY_CONFIG.slice(0, 6).map(r => (
                  <button key={r.id} onClick={() => setForm({ ...form, rarity: r.id })} className={`p-2 md:p-3 rounded-lg md:rounded-xl border text-center transition text-xs md:text-sm ${form.rarity === r.id ? 'border-violet-500 bg-violet-500/20' : 'border-white/10 hover:border-white/30'}`}>
                    <div className="text-base md:text-lg mb-0.5 md:mb-1">{r.icon}</div>
                    <div>{r.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2 flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  版税 (%)
                </label>
                <input type="number" value={form.royalty} onChange={(e) => setForm({...form, royalty: Number(e.target.value)})} min={0} max={10} className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:border-violet-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  供应量
                </label>
                <input type="number" value={form.supply} onChange={(e) => setForm({...form, supply: Number(e.target.value)})} min={1} max={10000} className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base focus:border-violet-500 outline-none" />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                标签 (最多5个)
              </label>
              <div className="flex gap-1.5 md:gap-2 mb-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="输入标签" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm outline-none focus:border-violet-500" />
                <button onClick={addTag} className="px-3 md:px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/20 rounded-full text-xs">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* NFT Settings */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <h3 className="font-bold mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                <Settings className="w-4 h-4" />
                NFT设置
              </h3>
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center justify-between cursor-pointer py-2 min-h-[44px]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">灵魂绑定</span>
                  </div>
                  <input type="checkbox" checked={form.isSoulbound} onChange={(e) => setForm({ ...form, isSoulbound: e.target.checked, isTransferable: !e.target.checked })} className="w-5 h-5 accent-violet-500" />
                </label>
                <label className="flex items-center justify-between cursor-pointer py-2 min-h-[44px]">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">可交易</span>
                  </div>
                  <input type="checkbox" checked={form.isTransferable} onChange={(e) => setForm({ ...form, isTransferable: e.target.checked })} disabled={form.isSoulbound} className="w-5 h-5 accent-violet-500 disabled:opacity-50" />
                </label>
              </div>
              {form.isSoulbound && <p className="text-xs text-amber-400 mt-2">⚠️ 灵魂绑定NFT铸造后无法转移</p>}
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-3 md:space-y-4">
            <h2 className="font-bold text-base md:text-lg mb-2 md:mb-4">👀 预览</h2>
            
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <div className="aspect-square bg-black/30 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden relative min-h-[200px]">
                {mediaFiles.length > 0 ? (
                  mediaFiles[0].type === 'image' ? (
                    <img src={mediaFiles[0].preview} alt="preview" className="max-w-full max-h-full object-contain" />
                  ) : mediaFiles[0].type === 'video' ? (
                    <video src={mediaFiles[0].preview} className="max-w-full max-h-full object-contain" controls />
                  ) : (
                    <div className="text-center"><Box className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 text-cyan-400" /><p className="text-xs md:text-sm text-gray-400">3D模型</p></div>
                  )
                ) : (
                  <p className="text-gray-500 text-sm">上传素材后预览</p>
                )}
                
                {mediaFiles.length > 0 && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-full text-xs flex items-center gap-1">
                    {RARITY_CONFIG.find(r => r.id === form.rarity)?.icon}
                    <span>{RARITY_CONFIG.find(r => r.id === form.rarity)?.name}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 text-center">
                <div className="font-bold text-base md:text-lg">{form.name || 'NFT名称'}</div>
                <div className="text-xs md:text-sm text-gray-400">{form.collection || '未选择系列'} · {form.supply} 个</div>
              </div>

              {form.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-400">#{tag}</span>
                  ))}
                </div>
              )}

              {properties.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {properties.slice(0, 4).map(p => (
                    <span key={p.id} className="px-2 py-0.5 bg-violet-500/20 rounded text-xs">{p.value}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <Star className="w-4 h-4" />
                元数据
              </h3>
              <pre className="text-[10px] md:text-xs text-gray-400 overflow-auto max-h-24 md:max-h-40 bg-black/30 rounded-lg p-2">
                {getMetadataJSON()}
              </pre>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={!form.name || mediaFiles.length === 0 || isMinting} className="w-full py-3 md:py-4 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
              🚀 铸造 NFT ({MINT_FEE} SUI)
            </button>

            <div className="text-center text-[10px] md:text-xs text-gray-500">
              铸造将扣除 {MINT_FEE} SUI，NFT直接发送到你的钱包
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
