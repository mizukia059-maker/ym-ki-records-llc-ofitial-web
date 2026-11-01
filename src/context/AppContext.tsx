import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Forum,
  Post,
  FanClub,
  ChatMessage,
  Product,
  InventoryItem,
  TradeOffer,
  AuditionSubmission,
  CeoUpgradeRequest,
  AccountType,
  CeoInfo,
  IdCardData,
  ChatGroup,
  ChatSubgroupType,
  NotificationItem,
  CurrencyType
} from '../types';
import { INITIAL_CEOS } from '../data/ceos';
import { computeThemeColors, applyThemeToDocument } from '../utils/themeColors';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces';
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&h=300&fit=crop';
const DEFAULT_FORUM_AVATAR = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop';

function load<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error for key:', key, e);
  }
}

export function generateMatricula(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `YM-${year}-${rand}`;
}

export function defaultProfile(username: string): UserProfile {
  const isAdmin = username === 'Administración' || username === 'CEO Miki';
  return {
    username,
    nickname: username,
    avatar: DEFAULT_AVATAR,
    banner: DEFAULT_BANNER,
    description: 'Miembro de la comunidad artística YM-ki Web.',
    ringColor: '#6366f1',
    transparentFrame: null,
    accountType: isAdmin ? 'admin' : 'fan',
    profileBgColor: '#1e293b',
    badgeAdminColor: '#ec4899',
    badgeVerifiedColor: '#38bdf8',
    animal: 'Zorro 🦊',
    allowMessages: true,
    coins: 1250,
    gems: 25,
    dob: '2004-06-15',
    isMerchPrivate: false,
    showcaseItemIds: [],
    completedMissions: [],
    idCard: {
      pseudonym: username,
      age: 20,
      gender: 'Femenino',
      matricula: generateMatricula(),
      faceclaim: DEFAULT_AVATAR,
      cardColor: '#6366f1',
      stripeColor: '#ec4899',
      specialties: ['vocal']
    }
  };
}

interface AppContextType {
  currentUser: string | null;
  userProfile: UserProfile;
  allProfiles: Record<string, UserProfile>;
  themeMode: 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
  primaryButtonColor: string;
  setPrimaryButtonColor: (color: string) => void;
  themeGradient: string;
  themeBannerGradient: string;
  themeDarkColor: string;
  ceosList: CeoInfo[];
  forums: Forum[];
  posts: Post[];
  fanClubs: FanClub[];
  chats: Record<string, ChatMessage[]>;
  chatGroups: ChatGroup[];
  products: Product[];
  inventory: InventoryItem[];
  tradeOffers: TradeOffer[];
  auditions: AuditionSubmission[];
  notifications: NotificationItem[];
  ceoRequests: CeoUpgradeRequest[];
  friendRequestsSent: Record<string, boolean>;
  viewingProfileUser: UserProfile | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  getProfileOf: (username: string) => UserProfile;
  isPrivileged: (username?: string) => boolean;
  canUploadGif: (username?: string) => boolean;
  login: (username: string) => void;
  register: (username: string, nickname: string, dob: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  removeFrame: () => void;
  updateIdCard: (data: Partial<IdCardData>) => void;
  updateCeoProfile: (ceoId: string, patch: Partial<CeoInfo>) => void;
  upgradeToPremiumFan: () => boolean;
  requestCeoUpgrade: (ceoId: string, requestedRole: 'artista' | 'admin', reason: string) => void;
  approveCeoRequest: (requestId: string) => void;
  addCoins: (coins: number, gems?: number) => void;
  transferCoins: (targetUsername: string, amount: number) => boolean;
  claimDailyCoins: () => boolean;
  completeMission: (missionId: string, rewardCoins: number) => void;
  sendFriendRequest: (targetUsername: string) => boolean;
  setViewingProfileUser: (user: UserProfile | null) => void;
  openProfileByUsername: (username: string) => void;
  createForum: (data: Partial<Forum>) => void;
  createFandomForum: (fanClubId: string, name: string, description: string) => boolean;
  editForum: (forumId: string, data: Partial<Forum>) => void;
  deleteForum: (forumId: string) => void;
  joinForum: (forumId: string) => void;
  leaveForum: (forumId: string) => void;
  createPost: (data: Omit<Post, 'id' | 'timestamp' | 'likes' | 'dislikes' | 'comments'>) => void;
  reactPost: (postId: number, type: 'like' | 'dislike') => void;
  votePoll: (postId: number, option: 'option1' | 'option2') => void;
  addComment: (postId: number, text: string) => void;
  createFanClub: (data: Omit<FanClub, 'id' | 'members' | 'privateForums'>) => void;
  joinFanClub: (clubId: string) => void;
  leaveFanClub: (clubId: string) => void;
  emptyFanClubMembers: (clubId: string) => void;
  updateFanClub: (clubId: string, patch: Partial<FanClub>) => void;
  addPrivateForumToClub: (clubId: string, forumName: string) => boolean;
  deletePrivateForumFromClub: (clubId: string, index: number) => void;
  sendChatMessage: (toUsername: string, text: string, isFanMessage?: boolean, gift?: { name: string; icon: string; coinValue: number }) => void;
  // Group chats
  createChatGroup: (name: string, duration: 'temporary' | 'permanent', isAdvanced: boolean, icon?: string) => void;
  addCategoryToGroup: (groupId: string, categoryName: string) => void;
  addSubgroupToCategory: (groupId: string, categoryId: string, name: string, type: ChatSubgroupType, icon?: string) => void;
  sendGroupMessage: (groupId: string, text: string, subgroupId?: string, attachment?: string) => void;
  setSubgroupPinnedWeeklyMessage: (groupId: string, subgroupId: string, message: string) => void;
  submitTraineeTask: (groupId: string, subgroupId: string, taskTitle: string, attachmentUrl: string) => void;
  gradeTraineeTask: (groupId: string, subgroupId: string, messageId: string, grade: number, coinsAwarded: number, feedback: string) => void;
  promoteMemberInGroup: (groupId: string, subgroupId: string, memberUsername: string, newLevel: string) => void;
  // Store
  addProductToStore: (data: Omit<Product, 'id' | 'createdAt'>) => boolean;
  buyProduct: (productId: string, chosenCurrency?: 'coins' | 'gems') => boolean;
  listItemInOutlet: (inventoryItemId: string, resalePrice: number) => boolean;
  buyOutletProduct: (outletProductId: string) => boolean;
  toggleShowcaseItem: (inventoryItemId: string) => boolean;
  setMerchPrivate: (isPrivate: boolean) => void;
  // Auditions & Evaluation
  submitAudition: (data: Omit<AuditionSubmission, 'id' | 'date' | 'status' | 'evaluated' | 'applicantUsername'>) => void;
  evaluateAudition: (auditionId: number, result: 'trainee' | 'artista' | 'rejected' | 'accepted_staff', note?: string) => void;
  markNotificationRead: (notifId: string) => void;
  submitTradeOffer: (targetUser: string, offeredItemId: string, requestedItemId: string, note: string) => boolean;
  respondToTradeOffer: (offerId: string, response: 'accepted' | 'declined') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Theme mode (Dark / Light)
  const [themeMode, setThemeModeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('ym_theme') as 'dark' | 'light') || 'dark';
  });

  const setThemeMode = (mode: 'dark' | 'light') => {
    setThemeModeState(mode);
    localStorage.setItem('ym_theme', mode);
    if (mode === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  useEffect(() => {
    if (themeMode === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [themeMode]);

  // Primary button / Accent color
  const [primaryButtonColor, setPrimaryButtonColorState] = useState<string>(() => {
    return localStorage.getItem('ym_primary_color') || '#6366f1';
  });

  const themeColors = computeThemeColors(primaryButtonColor);
  const themeGradient = themeColors.gradient;
  const themeBannerGradient = themeColors.bannerGradient;
  const themeDarkColor = themeColors.dark;

  const setPrimaryButtonColor = (color: string) => {
    setPrimaryButtonColorState(color);
    localStorage.setItem('ym_primary_color', color);
    applyThemeToDocument(color);
  };

  useEffect(() => {
    applyThemeToDocument(primaryButtonColor);
  }, [primaryButtonColor]);

  // Current session user
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('ym_current_user');
  });

  // Profiles database
  const [allProfiles, setAllProfiles] = useState<Record<string, UserProfile>>(() => {
    const saved = load<Record<string, UserProfile>>('ym_user_profiles', {});
    if (!saved['CEO Miki']) {
      saved['CEO Miki'] = {
        ...defaultProfile('CEO Miki'),
        nickname: 'CEO Miki ✨',
        accountType: 'admin',
        description: 'Fundador y Director Ejecutivo General de YM-ki Entertainment.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
        coins: 999999,
        gems: 5000
      };
    }
    return saved;
  });

  const getProfileOf = (username: string): UserProfile => {
    if (username === currentUser && userProfile) return userProfile;
    if (allProfiles[username]) return allProfiles[username];
    return defaultProfile(username);
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const u = localStorage.getItem('ym_current_user') || 'Aspirante';
    const db = load<Record<string, UserProfile>>('ym_user_profiles', {});
    return db[u] ? db[u] : defaultProfile(u);
  });

  // CEOs list (managed by admins)
  const [ceosList, setCeosList] = useState<CeoInfo[]>(() => {
    return load<CeoInfo[]>('ym_ceos', INITIAL_CEOS);
  });

  // Forums
  const [forums, setForums] = useState<Forum[]>(() => {
    return load<Forum[]>('ym_forums', [
      {
        id: 'general',
        name: 'Comunidad General',
        description: 'Punto de encuentro oficial para todos los talentos y fans de YM-ki Web.',
        banner: DEFAULT_BANNER,
        avatar: DEFAULT_FORUM_AVATAR,
        creator: 'CEO Miki',
        followers: 120,
        isJoined: true,
        bgType: 'solid',
        bgValue: '#0f172a',
        isOfficial: true
      }
    ]);
  });

  // Clean posts feed
  const [posts, setPosts] = useState<Post[]>(() => {
    return load<Post[]>('ym_posts', []);
  });

  // Fan clubs
  const [fanClubs, setFanClubs] = useState<FanClub[]>(() => {
    return load<FanClub[]>('ym_fan_clubs', []);
  });

  // Direct Chats
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(() => {
    return load<Record<string, ChatMessage[]>>('ym_chats_dict', {});
  });

  // Groups and Advanced Servers
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(() => {
    return load<ChatGroup[]>('ym_chat_groups', []);
  });

  // Store products (Default empty as requested, filtering out any old demo products)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = load<Product[]>('ym_products', []);
    return saved.filter((p) => p.id !== 'prod-1' && p.id !== 'prod-2');
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    return load<InventoryItem[]>('ym_inventory', []);
  });

  // Trade offers
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>(() => {
    return load<TradeOffer[]>('ym_trades', []);
  });

  // Auditions
  const [auditions, setAuditions] = useState<AuditionSubmission[]>(() => {
    return load<AuditionSubmission[]>('ym_auditions', []);
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return load<NotificationItem[]>('ym_notifications', []);
  });

  // CEO Upgrade Requests
  const [ceoRequests, setCeoRequests] = useState<CeoUpgradeRequest[]>(() => {
    return load<CeoUpgradeRequest[]>('ym_ceo_requests', []);
  });

  // Friend requests sent
  const [friendRequestsSent, setFriendRequestsSent] = useState<Record<string, boolean>>(() => {
    return load<Record<string, boolean>>('ym_friend_requests', {});
  });

  // Active profile modal
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile | null>(null);

  // Sync to local storage
  useEffect(() => { save('ym_forums', forums); }, [forums]);
  useEffect(() => { save('ym_posts', posts); }, [posts]);
  useEffect(() => { save('ym_fan_clubs', fanClubs); }, [fanClubs]);
  useEffect(() => { save('ym_chats_dict', chats); }, [chats]);
  useEffect(() => { save('ym_chat_groups', chatGroups); }, [chatGroups]);
  useEffect(() => { save('ym_products', products); }, [products]);
  useEffect(() => { save('ym_inventory', inventory); }, [inventory]);
  useEffect(() => { save('ym_trades', tradeOffers); }, [tradeOffers]);
  useEffect(() => { save('ym_auditions', auditions); }, [auditions]);
  useEffect(() => { save('ym_notifications', notifications); }, [notifications]);
  useEffect(() => { save('ym_ceos', ceosList); }, [ceosList]);
  useEffect(() => { save('ym_ceo_requests', ceoRequests); }, [ceoRequests]);
  useEffect(() => { save('ym_friend_requests', friendRequestsSent); }, [friendRequestsSent]);

  useEffect(() => {
    if (currentUser) {
      save('ym_current_user', currentUser);
      const updatedAll = { ...allProfiles, [currentUser]: userProfile };
      setAllProfiles(updatedAll);
      save('ym_user_profiles', updatedAll);
    }
  }, [userProfile, currentUser]);

  // Privileges check
  const isPrivileged = (username?: string) => {
    const target = username || currentUser;
    if (!target) return false;
    const prof = getProfileOf(target);
    return prof.accountType === 'admin' || prof.accountType === 'artista';
  };

  const canUploadGif = (username?: string) => {
    const target = username || currentUser;
    if (!target) return false;
    const prof = getProfileOf(target);
    return prof.accountType === 'admin' || prof.accountType === 'artista';
  };

  const login = (username: string) => {
    const cleanUser = username.trim();
    if (!cleanUser) return;
    setCurrentUser(cleanUser);
    const existing = allProfiles[cleanUser];
    if (existing) {
      setUserProfile(existing);
    } else {
      const fresh = defaultProfile(cleanUser);
      setUserProfile(fresh);
      setAllProfiles((prev) => ({ ...prev, [cleanUser]: fresh }));
    }
    showToast(`¡Bienvenido de nuevo, ${cleanUser}!`);
  };

  const register = (username: string, nickname: string, dob: string) => {
    const cleanUser = username.trim();
    if (!cleanUser) return;
    if (allProfiles[cleanUser]) {
      showToast('Ese nombre de usuario ya está registrado. Inicia sesión.');
      return;
    }
    const fresh: UserProfile = {
      ...defaultProfile(cleanUser),
      nickname: nickname.trim() || cleanUser,
      dob: dob || '2004-06-15'
    };
    setCurrentUser(cleanUser);
    setUserProfile(fresh);
    setAllProfiles((prev) => ({ ...prev, [cleanUser]: fresh }));
    showToast('¡Registro completado con éxito!');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ym_current_user');
    showToast('Sesión cerrada.');
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }));
    showToast('Perfil actualizado correctamente.');
  };

  const removeFrame = () => {
    setUserProfile((prev) => ({ ...prev, transparentFrame: null }));
    showToast('Marco de perfil eliminado.');
  };

  const updateIdCard = (data: Partial<IdCardData>) => {
    setUserProfile((prev) => {
      const currentCard = prev.idCard || {
        pseudonym: prev.nickname || prev.username,
        age: 20,
        matricula: generateMatricula(),
        faceclaim: prev.avatar,
        cardColor: 'morado',
        specialties: ['vocal']
      };
      return {
        ...prev,
        idCard: { ...currentCard, ...data }
      };
    });
    showToast('ID-Card guardada correctamente.');
  };

  const updateCeoProfile = (ceoId: string, patch: Partial<CeoInfo>) => {
    setCeosList((prev) =>
      prev.map((c) => (c.id === ceoId ? { ...c, ...patch } : c))
    );
    showToast('Perfil de CEO Evaluador actualizado.');
  };

  const upgradeToPremiumFan = () => {
    if (userProfile.coins < 10000) {
      showToast(`Coins insuficientes. Cuesta 10,000 Coins (tienes ${userProfile.coins.toLocaleString()}).`);
      return false;
    }
    setUserProfile((prev) => ({
      ...prev,
      coins: prev.coins - 10000,
      accountType: 'premium_fan'
    }));
    showToast('¡Felicidades! Membresía Premium Fan VIP desbloqueada ⭐.');
    return true;
  };

  const requestCeoUpgrade = (ceoId: string, requestedRole: 'artista' | 'admin', reason: string) => {
    const ceo = ceosList.find((c) => c.id === ceoId) || ceosList[0];
    const newReq: CeoUpgradeRequest = {
      id: 'req-' + Date.now(),
      username: userProfile.username,
      requestedRole,
      ceoId: ceo.id,
      ceoName: ceo.name,
      reason,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setCeoRequests((prev) => [newReq, ...prev]);
    showToast(`Solicitud oficial enviada a ${ceo.name}.`);
  };

  const approveCeoRequest = (requestId: string) => {
    const req = ceoRequests.find((r) => r.id === requestId);
    if (!req) return;
    setCeoRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r))
    );
    const targetUser = req.username;
    if (targetUser === currentUser) {
      setUserProfile((prev) => ({ ...prev, accountType: req.requestedRole }));
    }
    setAllProfiles((prev) => {
      const p = prev[targetUser] || defaultProfile(targetUser);
      return { ...prev, [targetUser]: { ...p, accountType: req.requestedRole } };
    });
    showToast(`¡Solicitud de ${targetUser} aprobada por el CEO como ${req.requestedRole}!`);
  };

  const addCoins = (coins: number, gems = 0) => {
    setUserProfile((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      gems: prev.gems + gems
    }));
  };

  const transferCoins = (targetUsername: string, amount: number) => {
    const cleanTarget = targetUsername.trim();
    if (!cleanTarget || cleanTarget === currentUser) {
      showToast('Ingresa un usuario destinatario válido y distinto al tuyo.');
      return false;
    }
    if (amount <= 0 || userProfile.coins < amount) {
      showToast('Saldo insuficiente para transferir.');
      return false;
    }
    setUserProfile((prev) => ({ ...prev, coins: prev.coins - amount }));
    setAllProfiles((prev) => {
      const recipient = prev[cleanTarget] || defaultProfile(cleanTarget);
      return {
        ...prev,
        [cleanTarget]: { ...recipient, coins: recipient.coins + amount }
      };
    });
    showToast(`¡Has transferido ${amount.toLocaleString()} Coins a ${cleanTarget}!`);
    return true;
  };

  const claimDailyCoins = () => {
    const today = new Date().toDateString();
    if (userProfile.lastDailyClaim === today) {
      showToast('Ya has reclamado tu bono diario de hoy. ¡Vuelve mañana!');
      return false;
    }
    setUserProfile((prev) => ({
      ...prev,
      coins: prev.coins + 200,
      gems: prev.gems + 5,
      lastDailyClaim: today
    }));
    showToast('¡Has reclamado tu bono diario! +200 Coins y +5 Gemas 🎁');
    return true;
  };

  const completeMission = (missionId: string, rewardCoins: number) => {
    if (userProfile.completedMissions.includes(missionId)) {
      showToast('Esta misión ya ha sido reclamada.');
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      completedMissions: [...prev.completedMissions, missionId]
    }));
    showToast(`¡Misión completada! +${rewardCoins} Coins.`);
  };

  const sendFriendRequest = (targetUsername: string) => {
    if (friendRequestsSent[targetUsername]) {
      showToast(`Ya has enviado una solicitud de amistad a ${targetUsername}.`);
      return false;
    }
    setFriendRequestsSent((prev) => ({ ...prev, [targetUsername]: true }));
    showToast(`Solicitud de amistad enviada a ${targetUsername} con éxito.`);
    return true;
  };

  const openProfileByUsername = (username: string) => {
    const prof = getProfileOf(username);
    setViewingProfileUser(prof);
  };

  // Forums
  const createForum = (data: Partial<Forum>) => {
    const id = (data.name || 'foro').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newForum: Forum = {
      id,
      name: data.name || 'Nuevo Foro',
      description: data.description || '',
      banner: data.banner || DEFAULT_BANNER,
      avatar: data.avatar || DEFAULT_FORUM_AVATAR,
      creator: currentUser || 'Admin',
      followers: 1,
      isJoined: true,
      bgType: data.bgType || 'solid',
      bgValue: data.bgValue || '#0f172a',
      isOfficial: isPrivileged()
    };
    setForums((prev) => [newForum, ...prev]);
    showToast(`Foro "${newForum.name}" creado.`);
  };

  const createFandomForum = (fanClubId: string, name: string, description: string) => {
    const club = fanClubs.find((c) => c.id === fanClubId);
    if (!club) return false;
    const isAssociatedArtist = club.artists.includes(currentUser || '');
    const isClubAdmin = club.manager === currentUser || isPrivileged();
    if (!isAssociatedArtist && !isClubAdmin) {
      showToast('Solo los artistas o administradores asociados al club pueden crear foros de fandom.');
      return false;
    }

    const id = 'fandom-' + club.id + '-' + Date.now();
    const newForum: Forum = {
      id,
      name,
      description,
      creator: currentUser || 'Manager',
      followers: club.members.length,
      isJoined: club.members.includes(currentUser || ''),
      isFandomForum: true,
      fanClubId: club.id,
      fandomName: club.fandomName,
      banner: undefined,
      avatar: undefined,
      bgType: 'solid',
      bgValue: club.tagColor || '#1e1b4b'
    };
    setForums((prev) => [newForum, ...prev]);
    showToast(`Foro de Fandom "${name}" creado para ${club.name}.`);
    return true;
  };

  const editForum = (forumId: string, data: Partial<Forum>) => {
    setForums((prev) =>
      prev.map((f) => (f.id === forumId ? { ...f, ...data } : f))
    );
    showToast('Foro actualizado con éxito.');
  };

  const deleteForum = (forumId: string) => {
    if (forumId === 'general') {
      showToast('El foro General no puede ser eliminado.');
      return;
    }
    setForums((prev) => prev.filter((f) => f.id !== forumId));
    setPosts((prev) => prev.filter((p) => p.forumId !== forumId));
    showToast('Foro eliminado.');
  };

  const joinForum = (forumId: string) => {
    setForums((prev) =>
      prev.map((f) => (f.id === forumId ? { ...f, isJoined: true, followers: f.followers + 1 } : f))
    );
    showToast('Te has unido al foro.');
  };

  const leaveForum = (forumId: string) => {
    setForums((prev) =>
      prev.map((f) => (f.id === forumId ? { ...f, isJoined: false, followers: Math.max(0, f.followers - 1) } : f))
    );
    showToast('Has salido del foro.');
  };

  // Posts
  const createPost = (data: Omit<Post, 'id' | 'timestamp' | 'likes' | 'dislikes' | 'comments'>) => {
    const newPost: Post = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      comments: []
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('Publicación creada.');
  };

  const reactPost = (postId: number, type: 'like' | 'dislike') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        let likes = p.likes;
        let dislikes = p.dislikes;
        let myReaction = p.myReaction;
        if (myReaction === type) {
          if (type === 'like') likes--;
          else dislikes--;
          myReaction = null;
        } else {
          if (myReaction === 'like') likes--;
          if (myReaction === 'dislike') dislikes--;
          if (type === 'like') likes++;
          else dislikes++;
          myReaction = type;
        }
        return { ...p, likes, dislikes, myReaction };
      })
    );
  };

  const votePoll = (postId: number, option: 'option1' | 'option2') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const voters = p.pollVoters || [];
        if (voters.includes(currentUser || '')) {
          showToast('Ya has votado en esta encuesta.');
          return p;
        }
        const currentVotes = p.pollVotes || { option1: 0, option2: 0 };
        return {
          ...p,
          pollVoters: [...voters, currentUser || ''],
          pollVotes: { ...currentVotes, [option]: currentVotes[option] + 1 }
        };
      })
    );
    showToast('Voto registrado.');
  };

  const addComment = (postId: number, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            { author: currentUser || 'Anónimo', text: text.trim(), timestamp: new Date().toISOString() }
          ]
        };
      })
    );
    showToast('Comentario añadido.');
  };

  // Fan Clubs
  const createFanClub = (data: Omit<FanClub, 'id' | 'members' | 'privateForums'>) => {
    const newClub: FanClub = {
      ...data,
      id: 'club-' + Date.now(),
      members: [currentUser || 'Manager'],
      privateForums: []
    };
    setFanClubs((prev) => [newClub, ...prev]);
    showToast(`Club de Fans "${newClub.name}" creado con éxito.`);
  };

  const joinFanClub = (clubId: string) => {
    const club = fanClubs.find((c) => c.id === clubId);
    if (!club) return;
    if (club.members.includes(currentUser || '')) {
      showToast('Ya eres miembro de este club de fans.');
      return;
    }
    setFanClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, members: [...c.members, currentUser || ''] } : c))
    );
    showToast(`¡Te has unido a ${club.name} y eres parte del fandom ${club.fandomName}!`);
  };

  const leaveFanClub = (clubId: string) => {
    setFanClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, members: c.members.filter((m) => m !== currentUser) } : c))
    );
    showToast('Has salido del club de fans.');
  };

  const emptyFanClubMembers = (clubId: string) => {
    setFanClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, members: [c.manager] } : c))
    );
    showToast('Se han vaciado los miembros del club.');
  };

  const updateFanClub = (clubId: string, patch: Partial<FanClub>) => {
    setFanClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, ...patch } : c))
    );
    showToast('Club de fans actualizado.');
  };

  const addPrivateForumToClub = (clubId: string, forumName: string) => {
    const club = fanClubs.find((c) => c.id === clubId);
    if (!club) return false;
    if (club.privateForums.length >= 2) {
      showToast('Límite de 2 foros privados por club alcanzado.');
      return false;
    }
    setFanClubs((prev) =>
      prev.map((c) =>
        c.id === clubId ? { ...c, privateForums: [...c.privateForums, forumName] } : c
      )
    );
    showToast('Foro privado añadido.');
    return true;
  };

  const deletePrivateForumFromClub = (clubId: string, index: number) => {
    setFanClubs((prev) =>
      prev.map((c) => {
        if (c.id !== clubId) return c;
        const copy = [...c.privateForums];
        copy.splice(index, 1);
        return { ...c, privateForums: copy };
      })
    );
    showToast('Foro privado eliminado.');
  };

  // Direct Chats
  const sendChatMessage = (
    toUsername: string,
    text: string,
    isFanMessage = false,
    gift?: { name: string; icon: string; coinValue: number }
  ) => {
    const cleanTo = toUsername.trim();
    if (!cleanTo || !currentUser) return;
    const recipientProf = getProfileOf(cleanTo);
    if (recipientProf.accountType === 'artista' && !isFanMessage && !isPrivileged()) {
      showToast('Los artistas solo reciben mensajes de fans o de administradores.');
      return;
    }

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      from: currentUser,
      to: cleanTo,
      text,
      timestamp: new Date().toISOString(),
      isFanMessage,
      gift
    };

    const key1 = `${currentUser}_${cleanTo}`;
    const key2 = `${cleanTo}_${currentUser}`;
    const chatKey = chats[key1] ? key1 : chats[key2] ? key2 : key1;

    setChats((prev) => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), newMsg]
    }));
    showToast('Mensaje enviado.');
  };

  // Groups and Advanced Discord-like Servers
  const createChatGroup = (
    name: string,
    duration: 'temporary' | 'permanent',
    isAdvanced: boolean,
    icon?: string
  ) => {
    const newGroup: ChatGroup = {
      id: 'grp-' + Date.now(),
      name,
      icon: icon || '💬',
      creator: currentUser || 'Admin',
      isAdvanced,
      duration,
      members: [currentUser || 'Admin'],
      categories: isAdvanced
        ? [
            {
              id: 'cat-main',
              name: 'GENERAL',
              subgroups: [
                {
                  id: 'sub-announcements',
                  name: 'anuncios-oficiales',
                  type: 'announcement',
                  icon: '📢',
                  messages: []
                },
                {
                  id: 'sub-chat',
                  name: 'charla-general',
                  type: 'general',
                  icon: '💬',
                  messages: []
                }
              ]
            },
            {
              id: 'cat-training',
              name: 'TRAINEE ACADEMY',
              subgroups: [
                {
                  id: 'sub-ascensiones',
                  name: 'ascensiones-de-nivel',
                  type: 'promotions',
                  icon: '⭐',
                  messages: []
                },
                {
                  id: 'sub-tareas',
                  name: 'tareas-semanales',
                  type: 'tasks',
                  icon: '📝',
                  pinnedWeeklyMessage: 'Tarea Semana 1: Enviar cover vocal de 1 minuto sin autotune o grabación de coreografía base.',
                  messages: []
                }
              ]
            }
          ]
        : [],
      messages: []
    };
    setChatGroups((prev) => [newGroup, ...prev]);
    showToast(`Grupo "${name}" creado exitosamente.`);
  };

  const addCategoryToGroup = (groupId: string, categoryName: string) => {
    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const newCat = {
          id: 'cat-' + Date.now(),
          name: categoryName.toUpperCase(),
          subgroups: []
        };
        return { ...g, categories: [...g.categories, newCat] };
      })
    );
    showToast(`Categoría "${categoryName}" añadida al grupo.`);
  };

  const addSubgroupToCategory = (
    groupId: string,
    categoryId: string,
    name: string,
    type: ChatSubgroupType,
    icon?: string
  ) => {
    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.categories.map((c) => {
          if (c.id !== categoryId) return c;
          const newSub = {
            id: 'sub-' + Date.now(),
            name: name.toLowerCase().replace(/\s+/g, '-'),
            type,
            icon: icon || (type === 'announcement' ? '📢' : type === 'promotions' ? '⭐' : type === 'tasks' ? '📝' : '💬'),
            pinnedWeeklyMessage: type === 'tasks' ? 'Tarea Semanal Oficial fijada por Administración.' : undefined,
            messages: []
          };
          return { ...c, subgroups: [...c.subgroups, newSub] };
        });
        return { ...g, categories: updatedCats };
      })
    );
    showToast(`Subgrupo "#${name}" añadido.`);
  };

  const sendGroupMessage = (
    groupId: string,
    text: string,
    subgroupId?: string,
    attachment?: string
  ) => {
    if (!currentUser) return;
    const newMsg = {
      id: 'gmsg-' + Date.now(),
      sender: currentUser,
      text,
      timestamp: new Date().toISOString(),
      attachment
    };

    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        if (!subgroupId) {
          return { ...g, messages: [...g.messages, newMsg] };
        }
        const updatedCats = g.categories.map((c) => ({
          ...c,
          subgroups: c.subgroups.map((sub) => {
            if (sub.id !== subgroupId) return sub;
            return { ...sub, messages: [...sub.messages, newMsg] };
          })
        }));
        return { ...g, categories: updatedCats };
      })
    );
  };

  const setSubgroupPinnedWeeklyMessage = (groupId: string, subgroupId: string, message: string) => {
    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.categories.map((c) => ({
          ...c,
          subgroups: c.subgroups.map((sub) => {
            if (sub.id !== subgroupId) return sub;
            return { ...sub, pinnedWeeklyMessage: message };
          })
        }));
        return { ...g, categories: updatedCats };
      })
    );
    showToast('Mensaje semanal fijado actualizado.');
  };

  const submitTraineeTask = (groupId: string, subgroupId: string, taskTitle: string, attachmentUrl: string) => {
    if (!currentUser) return;
    const newMsg = {
      id: 'task-' + Date.now(),
      sender: currentUser,
      text: `Tarea Entregada: ${taskTitle}`,
      attachment: attachmentUrl,
      timestamp: new Date().toISOString(),
      taskSubmission: {
        status: 'submitted' as const
      }
    };
    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.categories.map((c) => ({
          ...c,
          subgroups: c.subgroups.map((sub) => {
            if (sub.id !== subgroupId) return sub;
            return { ...sub, messages: [...sub.messages, newMsg] };
          })
        }));
        return { ...g, categories: updatedCats };
      })
    );
    showToast('¡Tarea enviada para revisión del staff!');
  };

  const gradeTraineeTask = (
    groupId: string,
    subgroupId: string,
    messageId: string,
    grade: number,
    coinsAwarded: number,
    feedback: string
  ) => {
    let targetStudent = '';
    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.categories.map((c) => ({
          ...c,
          subgroups: c.subgroups.map((sub) => {
            if (sub.id !== subgroupId) return sub;
            const updatedMsgs = sub.messages.map((m) => {
              if (m.id !== messageId) return m;
              targetStudent = m.sender;
              return {
                ...m,
                taskSubmission: {
                  status: 'graded' as const,
                  grade,
                  pointsAwarded: grade === 3 ? 100 : grade === 2 ? 70 : 40,
                  coinsAwarded,
                  feedback
                }
              };
            });
            return { ...sub, messages: updatedMsgs };
          })
        }));
        return { ...g, categories: updatedCats };
      })
    );

    if (targetStudent && coinsAwarded > 0) {
      setAllProfiles((prev) => {
        const student = prev[targetStudent] || defaultProfile(targetStudent);
        return { ...prev, [targetStudent]: { ...student, coins: student.coins + coinsAwarded } };
      });
      if (targetStudent === currentUser) {
        addCoins(coinsAwarded);
      }
    }
    showToast(`Tarea calificada (${grade}/3). Se han otorgado ${coinsAwarded} Coins al trainee.`);
  };

  const promoteMemberInGroup = (groupId: string, subgroupId: string, memberUsername: string, newLevel: string) => {
    const promoMsg = {
      id: 'promo-' + Date.now(),
      sender: currentUser || 'Admin',
      text: `🎉 ¡ASCENSIÓN OFICIAL! @${memberUsername} ha sido ascendido(a) a: ${newLevel}!`,
      timestamp: new Date().toISOString(),
      promotionInfo: {
        promotedMember: memberUsername,
        newLevel
      }
    };

    setChatGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedCats = g.categories.map((c) => ({
          ...c,
          subgroups: c.subgroups.map((sub) => {
            if (sub.id !== subgroupId) return sub;
            return { ...sub, messages: [...sub.messages, promoMsg] };
          })
        }));
        return { ...g, categories: updatedCats };
      })
    );
    showToast(`Ascensión registrada para @${memberUsername}.`);
  };

  // Store methods
  const addProductToStore = (data: Omit<Product, 'id' | 'createdAt'>) => {
    if (!isPrivileged()) {
      showToast('Solo administradores y artistas pueden añadir productos a la tienda oficial.');
      return false;
    }
    const newProduct: Product = {
      ...data,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Producto "${newProduct.name}" publicado en la Tienda Oficial.`);
    return true;
  };

  const buyProduct = (productId: string, chosenCurrency?: 'coins' | 'gems') => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;
    if (product.stockType === 'fixed' && product.stockCount <= 0) {
      showToast('Producto agotado.');
      return false;
    }

    const payWithGems = chosenCurrency === 'gems' || (!chosenCurrency && product.currencyType === 'gems');

    if (payWithGems) {
      const requiredGems = product.priceGems || Math.ceil(product.priceCoins / 10) || 5;
      if (userProfile.gems < requiredGems) {
        showToast(`Gemas insuficientes (${requiredGems} Gemas requeridas).`);
        return false;
      }
      setUserProfile((prev) => ({ ...prev, gems: prev.gems - requiredGems }));
    } else {
      const requiredCoins = product.priceCoins;
      if (userProfile.coins < requiredCoins) {
        showToast(`Coins insuficientes (${requiredCoins} Coins requeridas).`);
        return false;
      }
      setUserProfile((prev) => ({ ...prev, coins: prev.coins - requiredCoins }));
    }

    if (product.stockType === 'fixed') {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stockCount: p.stockCount - 1 } : p))
      );
    }
    const newItem: InventoryItem = {
      id: 'inv-' + Date.now(),
      productId: product.id,
      productName: product.name,
      image: product.images[0] || DEFAULT_FORUM_AVATAR,
      description: product.description,
      pricePaid: payWithGems ? (product.priceGems || 5) : product.priceCoins,
      purchasedAt: new Date().toISOString()
    };
    setInventory((prev) => [newItem, ...prev]);
    showToast(`¡Has comprado "${product.name}" exitosamente!`);
    return true;
  };

  const listItemInOutlet = (inventoryItemId: string, resalePrice: number) => {
    const item = inventory.find((i) => i.id === inventoryItemId);
    if (!item) return false;
    if (resalePrice <= 0) {
      showToast('Precio inválido.');
      return false;
    }
    setInventory((prev) =>
      prev.map((i) => (i.id === inventoryItemId ? { ...i, isListedInOutlet: true, outletPrice: resalePrice } : i))
    );
    const outletProd: Product = {
      id: 'outlet-' + item.id,
      name: item.productName + ' [Segunda Mano / Outlet]',
      description: `Reventa oficial por @${currentUser}. ${item.description}`,
      images: [item.image],
      tags: ['outlet', 'segunda-mano', 'reventa'],
      stockType: 'fixed',
      stockCount: 1,
      associatedArtists: [],
      priceCoins: resalePrice,
      createdBy: currentUser || 'Usuario',
      isOutlet: true,
      resellerUsername: currentUser || 'Usuario',
      originalProductId: item.productId,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [outletProd, ...prev]);
    showToast(`"${item.productName}" puesto a la venta en el Outlet.`);
    return true;
  };

  const buyOutletProduct = (outletProductId: string) => {
    const prod = products.find((p) => p.id === outletProductId);
    if (!prod || !prod.isOutlet || !prod.resellerUsername) return false;
    if (prod.resellerUsername === currentUser) {
      showToast('No puedes comprar tu propio producto.');
      return false;
    }
    if (userProfile.coins < prod.priceCoins) {
      showToast(`Coins insuficientes. Precio: ${prod.priceCoins} Coins.`);
      return false;
    }
    setUserProfile((prev) => ({ ...prev, coins: prev.coins - prod.priceCoins }));
    const seller = prod.resellerUsername;
    setAllProfiles((prev) => {
      const sellerProf = prev[seller] || defaultProfile(seller);
      return { ...prev, [seller]: { ...sellerProf, coins: sellerProf.coins + prod.priceCoins } };
    });
    setProducts((prev) => prev.filter((p) => p.id !== outletProductId));
    const newItem: InventoryItem = {
      id: 'inv-' + Date.now(),
      productId: prod.originalProductId || prod.id,
      productName: prod.name.replace(' [Segunda Mano / Outlet]', ''),
      image: prod.images[0],
      description: prod.description,
      pricePaid: prod.priceCoins,
      purchasedAt: new Date().toISOString()
    };
    setInventory((prev) => [newItem, ...prev]);
    showToast(`¡Has adquirido el producto de @${seller} en el Outlet!`);
    return true;
  };

  const toggleShowcaseItem = (inventoryItemId: string) => {
    const currentList = userProfile.showcaseItemIds || [];
    if (currentList.includes(inventoryItemId)) {
      setUserProfile((prev) => ({
        ...prev,
        showcaseItemIds: currentList.filter((id) => id !== inventoryItemId)
      }));
      showToast('Item retirado de tu vitrina.');
      return true;
    } else {
      if (currentList.length >= 5) {
        showToast('Máximo 5 items en tu vitrina de merch.');
        return false;
      }
      setUserProfile((prev) => ({
        ...prev,
        showcaseItemIds: [...currentList, inventoryItemId]
      }));
      showToast('Item añadido a tu vitrina.');
      return true;
    }
  };

  const setMerchPrivate = (isPrivate: boolean) => {
    setUserProfile((prev) => ({ ...prev, isMerchPrivate: isPrivate }));
    showToast(`Vitrina de merch marcada como ${isPrivate ? 'Privada 🔒' : 'Pública 🌐'}.`);
  };

  // Submit Audition with "Sin calificar" and notification to CEO
  const submitAudition = (data: Omit<AuditionSubmission, 'id' | 'date' | 'status' | 'evaluated' | 'applicantUsername'>) => {
    const auditionId = Date.now();
    const newAudition: AuditionSubmission = {
      ...data,
      id: auditionId,
      applicantUsername: currentUser || 'Aspirante',
      date: new Date().toISOString(),
      status: 'Sin calificar',
      evaluated: false
    };
    setAuditions((prev) => [newAudition, ...prev]);

    // Send notification to the designated CEO user
    const ceo = ceosList.find((c) => c.id === data.ceoId);
    const recipientUser = ceo?.username || data.ceoName;

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      recipient: recipientUser,
      type: 'audition',
      title: 'Nueva Audición para Calificar',
      message: `Has recibido una postulación de @${currentUser} para modalidad: ${data.modalidad}.`,
      auditionId,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`¡Audición enviada al ${data.ceoName}! Ha llegado a su bandeja para evaluación.`);
  };

  // Evaluate Audition (Trainee, Artista, Rechazado, Aceptado Staff)
  const evaluateAudition = (
    auditionId: number,
    result: 'trainee' | 'artista' | 'rejected' | 'accepted_staff',
    note?: string
  ) => {
    let applicantName = '';
    let statusText = '';

    if (result === 'trainee') statusText = 'Aceptado como Trainee';
    else if (result === 'artista') statusText = 'Aceptado como Artista';
    else if (result === 'accepted_staff') statusText = 'Aceptado como Staff';
    else statusText = 'Rechazado';

    setAuditions((prev) =>
      prev.map((aud) => {
        if (aud.id !== auditionId) return aud;
        applicantName = aud.applicantUsername;
        return {
          ...aud,
          evaluated: true,
          status: statusText,
          result,
          evaluatorNote: note
        };
      })
    );

    // Update applicant profile account type
    if (applicantName) {
      if (result === 'trainee') {
        setAllProfiles((prev) => {
          const app = prev[applicantName] || defaultProfile(applicantName);
          return { ...prev, [applicantName]: { ...app, accountType: 'trainee' } };
        });
        if (applicantName === currentUser) {
          setUserProfile((prev) => ({ ...prev, accountType: 'trainee' }));
        }
      } else if (result === 'artista') {
        setAllProfiles((prev) => {
          const app = prev[applicantName] || defaultProfile(applicantName);
          return { ...prev, [applicantName]: { ...app, accountType: 'artista' } };
        });
        if (applicantName === currentUser) {
          setUserProfile((prev) => ({ ...prev, accountType: 'artista' }));
        }
      }

      // Notify the applicant
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        recipient: applicantName,
        type: 'system',
        title: `Resultado de tu Audición: ${statusText}`,
        message: note ? `Resolución del CEO: ${note}` : `Tu postulación ha sido calificada como: ${statusText}.`,
        auditionId,
        date: new Date().toISOString(),
        read: false
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast(`Audición calificada exitosamente: ${statusText}.`);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const submitTradeOffer = (targetUser: string, offeredItemId: string, requestedItemId: string, note: string) => {
    const offered = inventory.find((i) => i.id === offeredItemId);
    if (!offered) return false;
    const newOffer: TradeOffer = {
      id: 'trade-' + Date.now(),
      fromUser: currentUser || 'Usuario',
      toUser: targetUser,
      offeredItemId,
      offeredItemName: offered.productName,
      offeredItemImage: offered.image,
      requestedItemId,
      requestedItemName: 'Item Solicitado',
      note,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTradeOffers((prev) => [newOffer, ...prev]);
    showToast(`¡Solicitud de trade enviada a @${targetUser}!`);
    return true;
  };

  const respondToTradeOffer = (offerId: string, response: 'accepted' | 'declined') => {
    setTradeOffers((prev) =>
      prev.map((t) => (t.id === offerId ? { ...t, status: response } : t))
    );
    showToast(`Trade ${response === 'accepted' ? 'Aceptado' : 'Rechazado'}.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userProfile,
        allProfiles,
        themeMode,
        setThemeMode,
        primaryButtonColor,
        setPrimaryButtonColor,
        themeGradient,
        themeBannerGradient,
        themeDarkColor,
        ceosList,
        forums,
        posts,
        fanClubs,
        chats,
        chatGroups,
        products,
        inventory,
        tradeOffers,
        auditions,
        notifications,
        ceoRequests,
        friendRequestsSent,
        viewingProfileUser,
        toastMessage,
        showToast,
        getProfileOf,
        isPrivileged,
        canUploadGif,
        login,
        register,
        logout,
        updateProfile,
        removeFrame,
        updateIdCard,
        updateCeoProfile,
        upgradeToPremiumFan,
        requestCeoUpgrade,
        approveCeoRequest,
        addCoins,
        transferCoins,
        claimDailyCoins,
        completeMission,
        sendFriendRequest,
        setViewingProfileUser,
        openProfileByUsername,
        createForum,
        createFandomForum,
        editForum,
        deleteForum,
        joinForum,
        leaveForum,
        createPost,
        reactPost,
        votePoll,
        addComment,
        createFanClub,
        joinFanClub,
        leaveFanClub,
        emptyFanClubMembers,
        updateFanClub,
        addPrivateForumToClub,
        deletePrivateForumFromClub,
        sendChatMessage,
        createChatGroup,
        addCategoryToGroup,
        addSubgroupToCategory,
        sendGroupMessage,
        setSubgroupPinnedWeeklyMessage,
        submitTraineeTask,
        gradeTraineeTask,
        promoteMemberInGroup,
        addProductToStore,
        buyProduct,
        listItemInOutlet,
        buyOutletProduct,
        toggleShowcaseItem,
        setMerchPrivate,
        submitAudition,
        evaluateAudition,
        markNotificationRead,
        submitTradeOffer,
        respondToTradeOffer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
