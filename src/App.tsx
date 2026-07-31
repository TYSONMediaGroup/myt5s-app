import React, { useState, useRef, useEffect } from 'react';
import './index.css';

type PublisherType = 'TMG' | 'AVIATION' | 'ATLANTIS';

interface Article {
  id: number;
  type: PublisherType;
  title: string;
  author: string;
  status: string;
  date: string;
  category: string;
  views: number;
  selected?: boolean;
}

const getTabIcon = (tab: string) => {
  switch (tab) {
    case 'Content Editor': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
    case 'Media Library': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
    case 'Editorial Queue': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
    case 'Content Calendar': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
    case 'Comments': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
    case 'Analytics': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
    case 'Settings': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
    default: return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>;
  }
};

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [status, setStatus] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [publisherType, setPublisherType] = useState<PublisherType>('TMG');
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Content Editor');
  const [searchQuery, _setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false); 
  const [greeting, setGreeting] = useState('');

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [queueView, setQueueView] = useState<'table' | 'kanban'>('table');

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const [activityLogs] = useState([
    { id: 1, action: "System login successful", user: "editor@tysonmediagroup.org", time: "Just now" },
    { id: 2, action: "Published item", user: "tyler@tysonmediagroup.org", time: "2 hours ago" },
    { id: 3, action: "Updated security policy", user: "admin", time: "Yesterday" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Draft needs review" },
    { id: 2, text: "New comment on recent post" },
    { id: 3, text: "System update scheduled for 2AM" }
  ]);

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:3001/api/articles')
        .then(res => res.json())
        .then(data => setArticles(data))
        .catch(err => console.error("Error fetching articles:", err));
    }
  }, [isLoggedIn]);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('News');
  const [tags, setTags] = useState<string[]>(['Technology', 'Media']);
  const [tagInput, setTagInput] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); 
  const [formErrors, setFormErrors] = useState<{title?: string, content?: string}>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [queueFilter, setQueueFilter] = useState('All');
  const [showPreview, setShowPreview] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  const [showMediaModal, setShowMediaModal] = useState(false);
  const mediaLibraryImages = ['/T5S logo official.png', '/TYSONAtlantisBanner.png', '/TYSONAviationBanner.png', '/TYSONMediaGroupBanner.png'];

  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  
  // Gallery and Music state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [audioTracks, setAudioTracks] = useState<{name: string, file: File}[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState('');
  const passwordStrength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 33 : newPassword.length < 10 ? 66 : 100;

  const isMusic = publisherType === 'ATLANTIS';

  useEffect(() => {
    if (title || content) {
      setHasUnsavedChanges(true);
      const timer = setTimeout(() => {
        setLastSaved(new Date().toLocaleTimeString());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === 'Content Editor') handlePublish(e as any, 'Draft');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const parseMarkdown = (text: string) => {
    let parsed = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code style="background:var(--bg-color);padding:2px 4px;border-radius:4px">$1</code>')
      .replace(/~~(.*?)~~/gim, '<del>$1</del>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>")
      .replace(/\n/gim, '<br/>');
    return parsed;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setStatus('Authenticating securely...');
    
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setPublisherType(data.publisherType as PublisherType);
        setIsAppLoading(true);
        setTimeout(() => {
          setIsAppLoading(false);
          setIsLoggedIn(true);
          setShowOnboarding(true);
        }, 1500);
      } else {
        setStatus(data.message || 'Invalid email or password.');
      }
    })
    .catch(() => setStatus('Error connecting to authentication server.'))
    .finally(() => setIsLoggingIn(false));
  };

  const handlePublish = (e: React.FormEvent, statusOverride: string = 'Published') => {
    e.preventDefault();
    const errors: any = {};
    if (!title) errors.title = `${isMusic ? 'Release Title' : 'Headline'} is required.`;
    setFormErrors(errors);

    if(Object.keys(errors).length === 0) {
      if (editingId) {
        const updated = { title, status: statusOverride, category, author };
        fetch(`http://localhost:3001/api/articles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        })
        .then(res => res.json())
        .then(data => setArticles(articles.map(a => a.id === editingId ? { ...a, ...data } : a)));
      } else {
        const newArticle = {
          type: publisherType,
          title: title, 
          author: author || 'Editorial Staff',
          status: publishDate ? 'Scheduled' : statusOverride, 
          date: publishDate || new Date().toISOString().split('T')[0],
          category: category,
          views: 0
        };
        fetch('http://localhost:3001/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newArticle)
        })
        .then(res => res.json())
        .then(data => setArticles([data, ...articles]));
      }
      
      setTitle(''); setAuthor(''); setCoverImage(''); setContent(''); setExcerpt('');
      setCategory('News'); setTags([]); setSeoTitle(''); setSeoDesc(''); setFocusKeyword('');
      setPublishDate(''); setLastSaved(null); setEditingId(null);
      setHasUnsavedChanges(false);
      setAudioTracks([]);
      setGalleryImages([]);
      
      setToastMessage(`${isMusic ? 'Release' : 'Article'} successfully ${statusOverride.toLowerCase()}.`);
      setShowPreview(false);
      setIsFocusMode(false);
    } else {
      setToastMessage("Please fix the validation errors.");
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newTracks = files.filter(f => f.type.includes('audio/')).map(f => ({name: f.name, file: f}));
      if (newTracks.length > 0) {
        setAudioTracks([...audioTracks, ...newTracks]);
        setToastMessage(`Added ${newTracks.length} audio track(s).`);
      } else {
        setToastMessage("Error: Only valid audio files (.mp3, .wav) are permitted.");
      }
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Mocking local upload by using object URLs
      const files = Array.from(e.target.files);
      const newImages = files.filter(f => f.type.includes('image/')).map(f => URL.createObjectURL(f));
      if (newImages.length > 0) {
        setGalleryImages([...galleryImages, ...newImages]);
        setToastMessage(`Added ${newImages.length} image(s) to gallery.`);
      }
    }
  };

  const handleDuplicateDraft = (article: Article) => {
    setArticles([{ ...article, id: Date.now(), title: `${article.title} (Copy)`, status: 'Draft' }, ...articles]);
    setToastMessage(`Draft duplicated successfully.`);
  };

  const attemptTabSwitch = (tab: string) => {
    if (activeTab === 'Content Editor' && hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Navigate away anyway?")) {
        setActiveTab(tab);
        setSidebarMobileOpen(false);
      }
    } else {
      setActiveTab(tab);
      setSidebarMobileOpen(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if(!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const copyAssetLink = (img: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + img);
    setToastMessage("Asset URL copied to clipboard!");
  };

  const insertTextAtCursor = (prefix: string, suffix: string) => setContent(prev => prev + prefix + suffix);

  const handleEditArticle = (article: Article) => {
    attemptTabSwitch('Content Editor');
    setEditingId(article.id);
    setTitle(article.title);
    setAuthor(article.author);
    setCategory(article.category);
    setContent("Loading content from database...");
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  const toggleArticleSelection = (id: number) => {
    setArticles(articles.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };
  const handleBulkDelete = () => {
    setArticles(articles.filter(a => !a.selected));
    setToastMessage("Selected items deleted.");
  };

  if (isAppLoading) {
    return (
      <div className="skeleton-loading-screen">
        <div className="skeleton-spinner"></div>
        <h2>Initializing TYSON Network...</h2>
        <div className="skeleton-bar"></div>
        <div className="skeleton-bar short"></div>
      </div>
    );
  }

  if (isLoggedIn) {
    let bannerImage = '/TYSONMediaGroupBanner.png';
    let publisherName = 'TYSON Media Group';
    
    if (publisherType === 'AVIATION') { bannerImage = '/TYSONAviationBanner.png'; publisherName = 'TYSON Aviation'; }
    else if (publisherType === 'ATLANTIS') { bannerImage = '/TYSONAtlantisBanner.png'; publisherName = 'Atlantis Music'; }

    const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) && (queueFilter === 'All' || a.category === queueFilter));

    return (
      <div className={`dashboard-container ${isFocusMode ? 'focus-mode-active' : ''}`}>
        
        {showCommandPalette && (
          <div className="command-palette-overlay" onClick={() => setShowCommandPalette(false)}>
            <div className="command-palette" onClick={e => e.stopPropagation()}>
               <div className="palette-header">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                 <input autoFocus type="text" placeholder="Search myTYSON or type a command..." value={paletteQuery} onChange={e => setPaletteQuery(e.target.value)} />
                 <span className="esc-hint">ESC</span>
               </div>
               <div className="palette-results">
                 {paletteQuery.toLowerCase().includes('ask ai') ? (
                    <div style={{padding: '2rem', textAlign: 'center', color: '#8ab4f8'}}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{marginBottom:'1rem'}}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      <h3>AI Assistant Ready</h3>
                      <p style={{color: 'rgba(255,255,255,0.5)'}}>What would you like me to draft for you today?</p>
                    </div>
                 ) : (
                   <>
                     <div className="palette-section">Quick Actions</div>
                     <button onClick={() => { setActiveTab('Content Editor'); setShowCommandPalette(false); }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                       Start a New Draft
                     </button>
                     <button onClick={() => { setPaletteQuery('Ask AI: '); }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8ab4f8" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                       <span style={{color: '#8ab4f8'}}>Ask AI to Draft Something...</span>
                     </button>
                     <button onClick={() => { setDarkMode(!darkMode); setShowCommandPalette(false); }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                       Toggle Dark/Light Mode
                     </button>

                     <div className="palette-section">Search Articles</div>
                     {filteredArticles.length > 0 ? filteredArticles.slice(0,5).map(a => (
                        <button key={a.id} onClick={() => { handleEditArticle(a); setShowCommandPalette(false); }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          {a.title}
                          <span className="badge">{a.status}</span>
                        </button>
                     )) : (
                        <div style={{padding: '1rem', color: 'rgba(255,255,255,0.3)'}}>No articles match your search.</div>
                     )}
                   </>
                 )}
               </div>
            </div>
          </div>
        )}

        {showOnboarding && (
          <div className="modal-overlay">
            <div className="onboarding-modal">
              <h2>Welcome to myTYSON Publisher</h2>
              <p>You have successfully connected to the <strong>{publisherName}</strong> network.</p>
              <ul className="onboarding-list">
                <li>🚀 <strong>Cmd+K</strong> opens the new Global Command Palette.</li>
                <li>🎵 <strong>Atlantis Mode</strong> is optimized for album and track releases.</li>
                <li>📸 <strong>Media Gallery</strong> supports multi-image uploads.</li>
              </ul>
              <button className="action-btn" onClick={() => setShowOnboarding(false)}>Get Started</button>
            </div>
          </div>
        )}

        {cropImage && (
          <div className="modal-overlay" onClick={() => setCropImage(null)}>
            <div className="crop-modal" onClick={e => e.stopPropagation()}>
              <h3>Image Editor</h3>
              <div className="crop-workspace">
                <img src={cropImage} alt="Crop" loading="lazy" />
              </div>
              <div className="crop-actions">
                <button className="secondary-btn" onClick={() => setCropImage(null)}>Cancel</button>
                <button className="action-btn" onClick={() => { setToastMessage("Image updated successfully"); setCropImage(null); }}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && <div className="toast-notification">✓ {toastMessage}</div>}

        {showMediaModal && (
          <div className="modal-overlay" onClick={() => setShowMediaModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <h3>Select Media Asset</h3>
                <button onClick={() => setShowMediaModal(false)} className="close-btn" style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer', color: 'var(--text-main)'}}>&times;</button>
              </div>
              <div className="media-grid" style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem'}}>
                {mediaLibraryImages.map((img, idx) => (
                  <div key={idx} className="media-thumbnail" onClick={() => { setCoverImage(img); setShowMediaModal(false); }} style={{cursor:'pointer', border:'1px solid var(--border)', borderRadius: '8px', overflow: 'hidden'}}>
                    <img src={img} alt={`Asset ${idx}`} loading="lazy" style={{width:'100%', height:'150px', objectFit:'cover'}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="fab-container">
          <button className="fab-main">+</button>
          <div className="fab-menu">
            <button onClick={() => attemptTabSwitch('Content Editor')}>{isMusic ? 'New Release' : 'New Draft'}</button>
            <button onClick={() => attemptTabSwitch('Media Library')}>Upload Asset</button>
          </div>
        </div>

        <div className={`sidebar-mobile-overlay ${sidebarMobileOpen ? 'open' : ''}`} onClick={() => setSidebarMobileOpen(false)}></div>
        
        <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarMobileOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-logo">
            <img src="/T5S logo official.png" alt="T5S Logo" loading="lazy" />
          </div>
          <nav>
            {['Content Editor', 'Media Library', 'Editorial Queue', 'Content Calendar', 'Comments', 'Analytics', 'Settings'].map(tab => (
               <a key={tab} href="#" className={activeTab === tab ? 'active' : ''} onClick={(e) => { e.preventDefault(); attemptTabSwitch(tab); }} title={sidebarCollapsed ? tab : ''} style={{position: 'relative'}}>
                 <span className="icon">{getTabIcon(tab)}</span> 
                 <span className="nav-text">{tab}</span>
                 {tab === 'Comments' && <span style={{position: 'absolute', right: '1rem', background: 'var(--accent)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px'}}>3</span>}
               </a>
            ))}
          </nav>
          <div className="brand-badges">
            <img src={bannerImage} alt={publisherName} loading="lazy" />
          </div>
        </div>
        
        <div className="main-content">
          <header className="top-nav">
            <div className="header-left">
              <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarMobileOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <button className="icon-btn desktop-menu-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title="Toggle Sidebar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </button>
            </div>
            <div className="header-right">
               <div className="search-bar" onClick={() => setShowCommandPalette(true)} style={{cursor: 'pointer'}}>
                 <input type="text" placeholder="Press Cmd+K to search..." readOnly style={{cursor: 'pointer'}} />
               </div>
               <div className="top-actions" style={{display: 'flex', gap: '0.5rem'}}>
                  <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
                    {darkMode ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    )}
                  </button>
                  <div className="notifications-wrapper" style={{position: 'relative'}}>
                    <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                      {notifications.length > 0 && <span className="badge" style={{position:'absolute', top:0, right:0, background:'var(--danger)', color:'white', fontSize:'0.6rem', padding:'2px 5px', borderRadius:'10px'}}>{notifications.length}</span>}
                    </button>
                    {showNotifications && (
                      <div className="notifications-dropdown" style={{position:'absolute', top:'100%', right:0, width:'250px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', boxShadow:'0 10px 15px rgba(0,0,0,0.1)', zIndex:50}}>
                        {notifications.length === 0 ? <div style={{padding:'1rem', color:'var(--text-muted)'}}>No new notifications</div> : null}
                        {notifications.map(n => (
                           <div key={n.id} style={{padding:'1rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
                             {n.text}
                             <button onClick={() => dismissNotification(n.id)} style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)'}}>×</button>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
               <div className="user-profile">
                 <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                   <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>{greeting}, {username.split('@')[0] || 'Tyler'} <span style={{background: 'var(--accent)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px'}}>Editor</span></span>
                   <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Ready to publish today?</span>
                 </div>
                 <div className="avatar">{(username.charAt(0) || 'T').toUpperCase()}</div>
               </div>
            </div>
          </header>
          
          <div className="workspace">
            {activeTab === 'Content Editor' && (
              <div className={`editor-layout ${showPreview ? 'preview-mode' : ''}`}>
                <div className="editor-main panel">
                  <div className="panel-header">
                    <h2>{editingId ? `Edit ${isMusic ? 'Release' : 'Publication'}` : `New ${isMusic ? 'Release' : 'Publication'}`}</h2>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <button className="secondary-btn small-btn" onClick={() => setIsFocusMode(!isFocusMode)} title="Distraction-Free Mode">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                      </button>
                      {editingId && <span className="collab-warning" style={{fontSize: '0.8rem', color: '#f59e0b'}}>
                        Locked by you
                      </span>}
                      {lastSaved && <span className="auto-save-text" style={{fontSize: '0.8rem', color: 'var(--success)', animation: 'pulse 2s infinite'}}>✓ Saved {lastSaved}</span>}
                      <button className="secondary-btn small-btn" onClick={() => setToastMessage("Exported to PDF successfully!")}>Export PDF</button>
                      <button className="secondary-btn small-btn" onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Close Preview' : 'Live Preview'}</button>
                    </div>
                  </div>
                  
                  {showPreview && (
                    <div className="live-preview-panel">
                      <div className="preview-content typographic-preview">
                        {coverImage && <img src={coverImage} alt="Cover" style={{width: '100%', borderRadius: '12px', marginBottom: '1.5rem'}} loading="lazy" />}
                        <h1>{title || `Untitled ${isMusic ? 'Release' : 'Publication'}`}</h1>
                        <p className="meta">By {author || 'Editorial Staff'} • {category}</p>
                        <div className="body-text" dangerouslySetInnerHTML={{ __html: content ? parseMarkdown(content) : 'Begin writing to see preview...' }}></div>
                        {galleryImages.length > 0 && (
                          <div className="preview-gallery" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '2rem'}}>
                             {galleryImages.map((img, i) => <img key={i} src={img} alt={`Gallery ${i}`} style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px'}} />)}
                          </div>
                        )}
                        {audioTracks.length > 0 && (
                          <div className="preview-audio" style={{marginTop: '2rem'}}>
                            <h3 style={{fontFamily: 'Inter', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)'}}>Tracklist</h3>
                            {audioTracks.map((track, i) => (
                               <div key={i} style={{padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '6px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                 <span style={{fontSize: '0.9rem'}}>{i + 1}. {track.name}</span>
                               </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{display: showPreview ? 'none' : 'block'}}>
                    <div className={`input-group ${formErrors.title ? 'has-error' : ''}`}>
                      <label>{isMusic ? 'Release / Album Title' : 'Article Headline'}</label>
                      <input type="text" placeholder={isMusic ? "Enter album or track name..." : "Enter highly engaging title..."} value={title} onChange={e => {setTitle(e.target.value); setFormErrors({...formErrors, title: ''})}} className="title-input" />
                      {formErrors.title && <span className="error-text" style={{color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem'}}>{formErrors.title}</span>}
                    </div>

                    <div className="input-group">
                      <label>{isMusic ? 'Release Notes / Lyrics / Credits' : 'Article Body'}</label>
                      <div className="rich-text-toolbar sticky-toolbar">
                        <button type="button" onClick={() => insertTextAtCursor('**', '**')}><b>B</b></button>
                        <button type="button" onClick={() => insertTextAtCursor('*', '*')}><i>I</i></button>
                        <button type="button" onClick={() => insertTextAtCursor('`', '`')}>Code</button>
                        <div className="divider"></div>
                        <button type="button" onClick={() => insertTextAtCursor('[text](', ')')}>🔗 Link</button>
                        <button type="button" onClick={() => insertTextAtCursor('> ', '')}>❝ Quote</button>
                        <button type="button" onClick={() => insertTextAtCursor('## ', '')}>H2</button>
                        <button type="button" onClick={() => insertTextAtCursor('### ', '')}>H3</button>
                        <div className="divider"></div>
                        <button type="button" onClick={() => { setContent(prev => prev + '\n\n[AI Generated Content Placeholder...]'); setToastMessage("AI drafted content successfully."); }} style={{color: 'var(--accent)'}}>✨ AI Assist</button>
                      </div>
                      <textarea placeholder="Write your content here..." value={content} onChange={e => setContent(e.target.value)} className="rich-textarea typographic-editor"></textarea>
                      <div className="char-counter" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <span>{wordCount} words • ~{readingTime} min read</span>
                        <div style={{width: '100px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden'}}>
                          <div style={{height: '100%', width: `${Math.min((wordCount / 500) * 100, 100)}%`, background: wordCount > 500 ? 'var(--success)' : 'var(--accent)'}}></div>
                        </div>
                      </div>
                    </div>

                    {!isMusic && (
                      <div className="input-group">
                        <label>Article Excerpt (Summary)</label>
                        <textarea placeholder="Brief summary for article cards and RSS feeds..." rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)}></textarea>
                        <div className="char-counter">{excerpt.length} / 200 chars</div>
                      </div>
                    )}

                    {publisherType === 'AVIATION' && (
                      <div className="side-panel" style={{marginBottom: '2rem'}}>
                        <h3>Aviation Specifications</h3>
                        <div style={{display:'flex', gap:'1rem'}}>
                          <div className="input-group" style={{flex:1, marginBottom: 0}}><label>Vehicle Make (e.g., Porsche)</label><input type="text" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} /></div>
                          <div className="input-group" style={{flex:1, marginBottom: 0}}><label>Vehicle Model (e.g., 911 GT3)</label><input type="text" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} /></div>
                        </div>
                      </div>
                    )}

                    {isMusic && (
                      <div className="side-panel" style={{marginBottom: '2rem', border: '1px solid var(--accent)'}}>
                        <h3 style={{color: 'var(--accent)'}}>Audio File Upload (.mp3, .wav)</h3>
                        <div className="drag-drop-zone" style={{border:'2px dashed var(--border)', padding:'2.5rem', textAlign:'center', borderRadius:'8px', background: 'var(--bg-color)', cursor: 'pointer'}} onClick={() => fileInputRef.current?.click()}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{marginBottom: '1rem'}}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                          <p style={{color: 'var(--text-main)', fontWeight: 500, marginBottom: '0.5rem'}}>Drop audio tracks here or click to browse</p>
                          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Upload high-quality WAV or MP3 files</p>
                          <input type="file" accept="audio/*" multiple onChange={handleAudioUpload} ref={fileInputRef} style={{display: 'none'}} />
                        </div>
                        {audioTracks.length > 0 && (
                          <div style={{marginTop: '1.5rem'}}>
                            <h4 style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>Queued Tracks:</h4>
                            {audioTracks.map((t, idx) => (
                              <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '0.25rem', fontSize: '0.85rem'}}>
                                <span>{idx + 1}. {t.name}</span>
                                <button type="button" onClick={() => setAudioTracks(audioTracks.filter((_, i) => i !== idx))} style={{color: 'var(--danger)', background: 'none', padding: 0, height: 'auto'}}>Remove</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="side-panel" style={{marginBottom: '2rem'}}>
                       <h3>Photo Gallery Upload</h3>
                       <div className="drag-drop-zone" style={{border:'2px dashed var(--border)', padding:'2rem', textAlign:'center', borderRadius:'8px', cursor: 'pointer'}} onClick={() => galleryInputRef.current?.click()}>
                          <p style={{color: 'var(--text-muted)'}}>Click to select multiple images for the gallery</p>
                          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} ref={galleryInputRef} style={{display: 'none'}} />
                       </div>
                       {galleryImages.length > 0 && (
                          <div style={{display: 'flex', gap: '0.5rem', overflowX: 'auto', marginTop: '1rem', paddingBottom: '0.5rem'}}>
                             {galleryImages.map((img, i) => (
                               <div key={i} style={{position: 'relative', width: '80px', height: '80px', flexShrink: 0}}>
                                 <img src={img} alt="Gallery thumb" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} />
                                 <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))} style={{position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', padding: 0, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>×</button>
                               </div>
                             ))}
                          </div>
                       )}
                    </div>

                    {!isMusic && (
                      <div className="seo-panel">
                        <h4>Search Engine Optimization</h4>
                        <div className="seo-columns">
                          <div className="seo-inputs">
                            <div className="input-group"><label>SEO Title</label><input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Title tag..."/></div>
                            <div className="input-group">
                              <label>Meta Description</label>
                              <textarea rows={2} value={seoDesc} onChange={e => setSeoDesc(e.target.value)} placeholder="160 character preview..."></textarea>
                              <div className="char-counter">{seoDesc.length} / 160 chars</div>
                            </div>
                            <div className="input-group"><label>Focus Keyword</label><input type="text" value={focusKeyword} onChange={e => setFocusKeyword(e.target.value)} /></div>
                          </div>
                          <div className="seo-preview-card">
                             <div className="seo-url">tysonmediagroup.org › {category.toLowerCase()}</div>
                             <div className="seo-preview-title">{seoTitle || title || 'Your SEO Title Here'}</div>
                             <div className="seo-preview-desc">{seoDesc || excerpt || 'This is how your description will appear in search engine results. Keep it engaging and concise.'}</div>
                          </div>
                          <div style={{marginTop: '1rem', fontSize: '0.85rem'}}>
                             <strong>SEO Score:</strong> <span style={{color: seoTitle.length > 10 && seoDesc.length > 50 ? 'var(--success)' : (seoTitle.length > 0 ? 'orange' : 'var(--danger)')}}>{seoTitle.length > 10 && seoDesc.length > 50 ? 'Good' : (seoTitle.length > 0 ? 'Needs Improvement' : 'Poor')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="editor-sidebar" style={{display: showPreview ? 'none' : 'flex'}}>
                  <div className="side-panel">
                    <h3>Version History</h3>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                      <div style={{marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between'}}><span>Current Version</span> <span>Now</span></div>
                      <div style={{marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', opacity: 0.7}}><span>Autosave</span> <span>2 mins ago</span></div>
                      <div style={{cursor: 'pointer', display: 'flex', justifyContent: 'space-between', opacity: 0.7}}><span>Initial Draft</span> <span>1 hr ago</span></div>
                    </div>
                  </div>

                  <div className="side-panel">
                    <h3>Publishing</h3>
                    <div className="input-group">
                      <label>Visibility</label>
                      <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                        <option>Public</option>
                        <option>Private</option>
                        <option>Password Protected</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Schedule Publication</label>
                      <input type="datetime-local" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
                    </div>
                    <div className="publish-actions" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                      <div className="flex-buttons">
                         <button type="button" className="secondary-btn" onClick={(e) => handlePublish(e, 'Draft')}>Save Draft</button>
                         <button type="button" className="action-btn" onClick={(e) => handlePublish(e, 'Published')}>{publishDate ? 'Schedule' : (editingId ? 'Update' : 'Publish')}</button>
                      </div>
                    </div>
                  </div>

                  <div className="side-panel">
                    <h3>Organization</h3>
                    <div className="input-group">
                      <label>{isMusic ? 'Artist / Label' : 'Primary Author'}</label>
                      <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder={isMusic ? "Atlantis Records" : "Editorial Team"} />
                    </div>
                    <div className="input-group">
                      <label>{isMusic ? 'Genre / Type' : 'Category'}</label>
                      <select value={category} onChange={e => setCategory(e.target.value)}>
                        {isMusic ? (
                          <>
                           <option>Album Release</option>
                           <option>Single</option>
                           <option>EP</option>
                           <option>Podcast</option>
                          </>
                        ) : (
                          <>
                           <option>News</option>
                           <option>Technology</option>
                           <option>Reviews</option>
                           <option>Opinion</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    <div className="input-group" style={{marginBottom: 0}}>
                      <label>Tags</label>
                      <div className="tags-container">
                         {tags.map(tag => (
                           <span key={tag} className="tag-pill">{tag} <button type="button" onClick={() => removeTag(tag)}>×</button></span>
                         ))}
                         <input type="text" placeholder="Add tag..." value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={addTag} className="tag-input-field" />
                      </div>
                    </div>
                  </div>

                  <div className="side-panel">
                    <h3>{isMusic ? 'Album / Track Cover' : 'Featured Cover Image'}</h3>
                    <div className="input-group" style={{marginBottom: 0}}>
                      {coverImage ? (
                        <div style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)'}}>
                          <img src={coverImage} alt="Cover" style={{width: '100%', height: 'auto', display: 'block'}} loading="lazy" />
                          <button type="button" onClick={() => setCoverImage('')} style={{position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.75rem'}}>Remove</button>
                        </div>
                      ) : (
                        <button type="button" className="secondary-btn full-width" onClick={() => setShowMediaModal(true)}>Browse Library</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'Editorial Queue' && (
              <div className="panel full-width-panel queue-panel">
                <div className="panel-header">
                  <h2>{isMusic ? 'Release Queue' : 'Editorial Queue'}</h2>
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <div className="view-toggle">
                       <button className={queueView === 'table' ? 'active' : ''} onClick={() => setQueueView('table')}>Table View</button>
                       <button className={queueView === 'kanban' ? 'active' : ''} onClick={() => setQueueView('kanban')}>Kanban Board</button>
                    </div>
                  </div>
                </div>
                
                {queueView === 'table' ? (
                  <div style={{overflowX: 'auto'}}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th><input type="checkbox" /></th>
                          <th>{isMusic ? 'Release Title' : 'Title'}</th>
                          <th>{isMusic ? 'Artist' : 'Author'}</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.map(a => (
                          <tr key={a.id}>
                            <td><input type="checkbox" checked={a.selected || false} onChange={() => toggleArticleSelection(a.id)} /></td>
                            <td className="bold">{a.title}</td>
                            <td>{a.author}</td>
                            <td><span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span></td>
                            <td>
                              <div className="context-menu">
                                <button className="icon-btn" style={{padding: '0.2rem'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                                <div className="context-dropdown">
                                  <button onClick={() => handleEditArticle(a)}>Edit</button>
                                  <button onClick={() => handleDuplicateDraft(a)}>Duplicate</button>
                                  <button style={{color: 'var(--danger)'}}>Delete</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="kanban-board">
                     {['Draft', 'Review', 'Scheduled', 'Published'].map(col => (
                        <div key={col} className="kanban-column">
                           <div className="kanban-column-header">
                             {col} <span>{filteredArticles.filter(a => a.status === col).length}</span>
                           </div>
                           <div className="kanban-cards">
                              {filteredArticles.filter(a => a.status === col).map(a => (
                                 <div key={a.id} className="kanban-card" onClick={() => handleEditArticle(a)} style={{position: 'relative'}}>
                                    <div style={{position: 'absolute', top: '10px', right: '10px', cursor: 'grab', color: 'var(--text-muted)'}}>⋮⋮</div>
                                    <h4>{a.title}</h4>
                                    <p className="meta">{a.author} • {a.category}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Content Calendar' && (
              <div className="panel full-width-panel">
                 <h2>Content Calendar</h2>
                 <p style={{color: 'var(--text-muted)'}}>Visual schedule for August 2026.</p>
                 <div className="calendar-grid">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => <div key={day} className="cal-header">{day}</div>)}
                    {Array.from({length: 31}).map((_, i) => {
                       const date = i + 1;
                       const hasRelease = date === 15 || date === 28;
                       return (
                         <div key={date} className={`cal-day ${hasRelease ? 'has-event' : ''}`}>
                            <span className="date-num">{date}</span>
                            {hasRelease && <div className="cal-event">Release Scheduled</div>}
                         </div>
                       )
                    })}
                 </div>
              </div>
            )}

            {activeTab === 'Media Library' && (
              <div className="panel full-width-panel">
                <div className="panel-header">
                  <h2>Central Media Asset Manager</h2>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button className="secondary-btn">New Folder</button>
                    <button className="action-btn">Upload Asset</button>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                  {['All Assets', 'Images', 'Audio (WAV/MP3)', 'Documents', 'Brand Assets'].map(cat => (
                     <button key={cat} className="secondary-btn small-btn" style={{borderRadius: '20px'}}>{cat}</button>
                  ))}
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem'}}>
                  {mediaLibraryImages.map((img, idx) => (
                    <div key={idx} style={{background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.02)'}} onClick={() => setCropImage(img)}>
                      <div style={{height: '160px', width: '100%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
                        <img src={img} alt={`Asset ${idx}`} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} loading="lazy" />
                      </div>
                      <div style={{padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                         <div>
                           <div style={{fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{img.replace('/', '')}</div>
                           <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>1.2 MB • Aug 2026</div>
                         </div>
                         <div style={{display: 'flex', gap: '0.25rem'}}>
                           <button className="icon-btn" onClick={(e) => copyAssetLink(img, e)} title="Copy URL"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                           <button className="icon-btn" style={{color: 'var(--danger)'}} onClick={(e) => {e.stopPropagation(); setToastMessage("Asset deleted");}} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Comments' && (
              <div className="panel full-width-panel">
                <h2>Engagement & Comments</h2>
                <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                   <button className="secondary-btn small-btn">All (24)</button>
                   <button className="action-btn small-btn">Pending (3)</button>
                   <button className="secondary-btn small-btn">Approved</button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem'}}>
                  <div style={{border:'1px solid var(--border)', padding:'1.5rem', borderRadius:'12px', background:'var(--surface)'}}>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}><strong>John Doe</strong> • 2 hours ago</div>
                    <div style={{margin:'1rem 0', fontSize: '0.95rem'}}>Fantastic insight! I really enjoyed this deep dive. Keep it up!</div>
                    <div style={{display:'flex', gap:'0.75rem'}}>
                      <button className="action-btn small-btn">Approve</button>
                      <button className="danger-btn small-btn">Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Analytics' && (
              <div className="analytics-layout panel full-width-panel">
                  <h2>Traffic & Revenue Overview</h2>
                  <div className="stats-row">
                    <div className="stat-card">
                      <div className="stat-label">Total Page Views</div>
                      <div className="stat-value">1,240,512</div>
                      <div className="stat-trend positive">+14.2% this month</div>
                    </div>
                    <div className="stat-card revenue-card">
                      <div className="stat-label">Ad Revenue (MTD)</div>
                      <div className="stat-value" style={{color: '#10b981'}}>$42,150.80</div>
                      <div className="stat-trend positive" style={{color:'var(--success)'}}>+12.4% vs last month</div>
                    </div>
                    <div className="stat-card revenue-card">
                      <div className="stat-label">Average CPM</div>
                      <div className="stat-value">$34.05</div>
                      <div className="stat-trend positive" style={{color:'var(--success)'}}>+1.2%</div>
                    </div>
                  </div>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="panel full-width-panel">
                <h2>Account & Platform Settings</h2>
                <div className="settings-forms" style={{display: 'flex', gap: '3rem', marginTop: '2rem', flexWrap: 'wrap'}}>
                  <div style={{flex: 1, minWidth: '300px'}}>
                    <h3>Profile Information</h3>
                    <div className="input-group"><label>Display Name</label><input type="text" value={username.split('@')[0] || ''} readOnly/></div>
                    <div className="input-group"><label>Email Address</label><input type="email" value={username} readOnly/></div>
                    <button className="secondary-btn">Update Profile</button>
                  </div>
                  <div style={{flex: 1, minWidth: '300px'}}>
                    <h3>Security</h3>
                    <div className="input-group"><label>Current Password</label><input type="password" /></div>
                    <div className="input-group">
                      <label>New Password</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                      <div style={{height: '4px', background: 'var(--border)', marginTop: '0.5rem', borderRadius: '2px', overflow: 'hidden'}}>
                        <div style={{height: '100%', width: `${passwordStrength}%`, background: passwordStrength < 50 ? 'red' : passwordStrength < 90 ? 'orange' : 'green', transition: 'width 0.3s'}}></div>
                      </div>
                    </div>
                    <button className="secondary-btn">Change Password</button>
                  </div>
                  <div style={{flex: 1, minWidth: '300px'}}>
                    <h3>Preferences</h3>
                    <div className="input-group">
                      <label>Theme</label>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button className={`secondary-btn ${!darkMode ? 'active' : ''}`} onClick={() => setDarkMode(false)}>Light</button>
                        <button className={`secondary-btn ${darkMode ? 'active' : ''}`} onClick={() => setDarkMode(true)}>Dark</button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Email Notifications</label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                         <input type="checkbox" defaultChecked id="email-notif" /><label htmlFor="email-notif" style={{marginBottom: 0}}>Receive daily digests</label>
                      </div>
                    </div>
                  </div>
                </div>
                <hr style={{margin: '3rem 0', borderColor: 'var(--border)'}}/>
                <button className="danger-btn" onClick={() => setIsLoggedIn(false)}>Log Out of Portal</button>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (isBooting) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', flexDirection: 'column' }}>
         <style>{`
           @keyframes pulse-glow {
             0% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); transform: scale(0.98); opacity: 0.8; }
             50% { filter: drop-shadow(0 0 30px rgba(255,255,255,0.4)); transform: scale(1); opacity: 1; }
             100% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); transform: scale(0.98); opacity: 0.8; }
           }
         `}</style>
         <img src="/T5S logo official.png" alt="Boot Logo" style={{ width: '120px', animation: 'pulse-glow 2s infinite ease-in-out' }} />
         <div style={{ marginTop: '3rem', fontSize: '0.75rem', color: '#888', letterSpacing: '6px', textTransform: 'uppercase' }}>System Initializing...</div>
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="brand-header">
          <img src="/T5S logo official.png" alt="T5S Logo" className="login-logo" />
          <div className="brand-title">myTYSON</div>
          <div className="brand-subtitle">Publishing Platform</div>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@tysonmediagroup.org" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn full-width" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#cbd5e1'}}>{status}</div>
      </div>
    </div>
  );
}

export default App;
