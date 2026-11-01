export type AccountType = 'fan' | 'premium_fan' | 'trainee' | 'artista' | 'admin';

export interface UserProfile {
  username: string;
  nickname: string;
  avatar: string;
  banner: string;
  description: string;
  ringColor: string; // Theme button / accent color
  transparentFrame: string | null;
  accountType: AccountType;
  profileBgColor: string;
  badgeAdminColor: string;
  badgeVerifiedColor: string;
  animal?: string;
  allowMessages: boolean;
  coins: number;
  gems: number;
  dob: string;
  isMerchPrivate: boolean;
  showcaseItemIds: string[]; // up to 5 item IDs
  lastDailyClaim?: string;
  completedMissions: string[];
  idCard?: IdCardData;
}

export interface IdCardData {
  pseudonym: string;
  age: number;
  gender?: string; // Femenino, Masculino, No binario, etc.
  matricula: string; // YM-2026-XXXX
  faceclaim: string; // Image URL
  cardColor: string; // Color hexadecimal o estilo degradado
  stripeColor?: string; // Para trainees: color de la franja decorativa (tarjeta blanca)
  specialties: ('vocal' | 'rap' | 'baile' | 'all_rounder')[];
}

export interface CeoInfo {
  id: string;
  name: string;
  username: string; // Linked admin username
  title: string;
  specialty: string;
  bio: string;
  avatar: string;
  motto: string;
  criteria: string[];
}

export interface Forum {
  id: string;
  name: string;
  description: string;
  banner?: string;
  avatar?: string;
  creator: string;
  followers: number;
  isJoined: boolean;
  bgType?: 'solid' | 'gradient' | 'image';
  bgValue?: string;
  isOfficial?: boolean;
  isFandomForum?: boolean;
  fanClubId?: string;
  fandomName?: string;
}

export interface Post {
  id: number;
  author: string;
  forumId: string;
  forumName: string;
  tag: string;
  title: string;
  content: string;
  type: 'normal' | 'poll' | 'announcement';
  timestamp: string;
  likes: number;
  dislikes: number;
  myReaction?: 'like' | 'dislike' | null;
  comments: Comment[];
  pollVotes?: { option1: number; option2: number };
  pollVoters?: string[];
  isFandomOnly?: boolean;
  fandomName?: string;
}

export interface Comment {
  author: string;
  text: string;
  timestamp: string;
}

export interface FanClub {
  id: string;
  name: string;
  fandomName: string;
  artists: string[];
  manager: string;
  messagePrice: number;
  tagIcon: string;
  tagIconImg?: string;
  tagColor?: string;
  description: string;
  banner: string;
  avatar: string;
  privateForums: string[];
  members: string[];
}

export interface ChatMessage {
  id: string;
  from: string; // username
  to: string; // username
  text: string;
  timestamp: string;
  isFanMessage?: boolean;
  gift?: { name: string; icon: string; coinValue: number };
}

export interface TaskSubmission {
  status: 'submitted' | 'graded';
  grade?: number; // 1, 2, or 3 (3 = 10 de calificación / excelente)
  pointsAwarded?: number; // 100 points
  coinsAwarded?: number;
  feedback?: string;
}

export interface ChatGroupMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  attachment?: string;
  taskSubmission?: TaskSubmission;
  promotionInfo?: {
    promotedMember: string;
    newLevel: string;
  };
}

export type ChatSubgroupType = 'announcement' | 'promotions' | 'tasks' | 'general';

export interface ChatSubgroup {
  id: string;
  name: string;
  icon?: string;
  type: ChatSubgroupType;
  pinnedWeeklyMessage?: string;
  messages: ChatGroupMessage[];
}

export interface ChatGroupCategory {
  id: string;
  name: string;
  subgroups: ChatSubgroup[];
}

export interface ChatGroup {
  id: string;
  name: string;
  icon?: string;
  creator: string;
  isAdvanced: boolean; // Servidor avanzado con categorías y subgrupos
  duration: 'temporary' | 'permanent';
  members: string[];
  categories: ChatGroupCategory[];
  messages: ChatGroupMessage[]; // For standard simple groups
}

export type CurrencyType = 'coins' | 'gems' | 'both';

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  tags: string[];
  stockType: 'unlimited' | 'fixed';
  stockCount: number;
  associatedArtists: string[];
  currencyType?: CurrencyType;
  priceCoins: number;
  priceGems?: number;
  createdBy: string;
  isOutlet: boolean;
  resellerUsername?: string;
  originalProductId?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  description: string;
  pricePaid: number;
  purchasedAt: string;
  isListedInOutlet?: boolean;
  outletPrice?: number;
}

export interface TradeOffer {
  id: string;
  fromUser: string;
  toUser: string;
  offeredItemId: string;
  offeredItemName: string;
  offeredItemImage: string;
  requestedItemId: string;
  requestedItemName: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface AuditionSubmission {
  id: number;
  applicantUsername: string;
  modalidad: string;
  pseudonym?: string;
  ceoId: string;
  ceoName: string;
  files: string[];
  date: string;
  status: string; // 'Sin calificar' | 'Calificado' | 'Aceptado como Trainee' | 'Aceptado como Artista' | 'Aceptado como Staff' | 'Rechazado'
  evaluated: boolean; // calificado vs sin calificar
  result?: 'trainee' | 'artista' | 'rejected' | 'accepted_staff';
  evaluatorNote?: string;
}

export interface NotificationItem {
  id: string;
  recipient: string;
  type: 'audition' | 'system' | 'message';
  title: string;
  message: string;
  auditionId?: number;
  date: string;
  read: boolean;
}

export interface CeoUpgradeRequest {
  id: string;
  username: string;
  requestedRole: 'artista' | 'admin';
  ceoId: string;
  ceoName: string;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
