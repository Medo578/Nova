
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Chat, Content, GenerateContentResponse, GenerateContentParameters, SendMessageParameters, Part } from "@google/genai";

// Declare global types for libraries loaded via script tags
declare global {
  interface Window {
    firebase: any;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    html2pdf: any;
    XLSX: any;
    JSZip: any; // For Web Dev Studio ZIP download
  }
}

const AI_AVATAR_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuA9T1sgk5SJhetyMEYiJgZdqlBOKqsudEBYvvWDHx_cmK13uMV6wG8UMYxaXz6zB4MIfvyUKAmXdlXdtSqTW2Zx5Ct5GSGZ0lu5lEW59f4XbHihQGFg9PTsx1q33s7wtOgXzNMrb_-y0LK-Va5C9pkNNqKrI_Pu0COg_auvu3ypzqjTj-L_3zS0-x3ay_-HF9ZnFuzQYmczRC_lFYedWXYOSOSSUomvBDOOwl3LmWDMqryiwwdyNjXUBqctqdV0vAPAAk45nKobo40";
const USER_AVATAR_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuB9SvUR84BUcmPrDbCzHYG6jBiJWyhIKekj08DbWfbqENpqVglzrst16xZhZMaSBaloXsQI4SPwo1ytdpTnDHU6mAasDhQvejiVjBg89FUtADZWqIfLBn585m7bFnSqVKy-anc0UzGOMbBzYRGaj23-bdkAWtTagqGsb8bmEfppSbQ3EuSqv3KVLaHzMg_e3tYMsMT5P3HWUfk9c1UeN4U4svNDy_qMQdx4E3NKUsOCNBhShoh7bCtnabXgeLUrg2QMv-NSo3ARDHg";
const TEXT_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
const IMAGE_MODEL_NAME = "imagen-3.0-generate-002";
const GEMINI_API_KEY = process.env.API_KEY;

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBpYxSx0MYQ6c_RRSOLvqEEWkKOMq5Zg0", // This is a placeholder API key, ensure it's replaced or handled securely
  authDomain: "sign-b2acd.firebaseapp.com",
  databaseURL: "https://sign-b2acd-default-rtdb.firebaseio.com",
  projectId: "sign-b2acd",
  storageBucket: "sign-b2acd.appspot.com",
  messagingSenderId: "1039449385751",
  appId: "1:1039449385751:web:e63d9b04d5698595922552",
  measurementId: "G-6D6JECNJ2Q"
};


// Screen IDs
const SPLASH_SCREEN_ID = "splash-screen";
const ONBOARDING_SCREEN_ID = "onboarding-screen";
const SIGNIN_SCREEN_ID = "signin-screen";
const CHAT_LIST_SCREEN_ID = "chat-list-screen";
const CHAT_SCREEN_ID = "chat-screen";
const SETTINGS_SCREEN_ID = "settings-screen";
const PROFILE_SCREEN_ID = "profile-screen";
const WEBVIEW_SCREEN_ID = "webview-screen";
const IMAGE_VIEWER_SCREEN_ID = "image-viewer-screen";
const CODE_CANVAS_SCREEN_ID = "code-canvas-screen";
const IMAGE_STUDIO_SCREEN_ID = "image-studio-screen";
const CREATE_TOOL_SCREEN_ID = "create-tool-screen";
const MEMORIES_SCREEN_ID = "memories-screen";
const WEB_DEV_STUDIO_SCREEN_ID = "web-dev-studio-screen";


// DOM Elements
let chatMessagesContainer: HTMLDivElement | null = null;
let chatInput: HTMLTextAreaElement | null = null;
let sendButton: HTMLButtonElement | null = null;
let suggestedPromptButtons: NodeListOf<Element>;
let micButton: HTMLButtonElement | null = null;
let micButtonContainer: HTMLDivElement | null = null;
let voiceModeToggle: HTMLButtonElement | null = null;
let chatListItemsContainer: HTMLDivElement | null = null;
let chatScreenTitleElement: HTMLElement | null = null;
let novaProcessingIndicatorElement: HTMLDivElement | null = null;
let novaImageProcessingIndicatorElement: HTMLDivElement | null = null;
let processLogPanelElement: HTMLDivElement | null = null;
let processLogListElement: HTMLUListElement | null = null;
let toggleProcessLogButtonElement: HTMLButtonElement | null = null;
let processLogCloseButtonElement: HTMLButtonElement | null = null;
let advancedOptionsButton: HTMLButtonElement | null = null;
let advancedOptionsPopover: HTMLDivElement | null = null;
let popoverDeepThinkingToggle: HTMLInputElement | null = null;
let popoverInternetSearchToggle: HTMLInputElement | null = null;
let popoverScientificModeToggle: HTMLInputElement | null = null;
let popoverUploadFileButton: HTMLButtonElement | null = null;
let popoverGenerateImageButton: HTMLButtonElement | null = null;
let popoverCodeCanvasButton: HTMLButtonElement | null = null;
let fileInputHidden: HTMLInputElement | null = null;
let stagedFilePreviewContainer: HTMLDivElement | null = null; // Renamed from stagedFilePreviewElement
let stagedFilePreviewElement: HTMLDivElement | null = null;
let stagedFileClearButton: HTMLButtonElement | null = null;
let chatInputActionsArea: HTMLDivElement | null = null;


// Settings Elements
let aiToneRadios: NodeListOf<HTMLInputElement>;
let darkModeToggle: HTMLInputElement | null = null;
let ttsToggle: HTMLInputElement | null = null;
let internetSearchToggle: HTMLInputElement | null = null;
let deepThinkingToggle: HTMLInputElement | null = null;
let creativityLevelSelect: HTMLSelectElement | null = null;
let advancedScientificModeToggle: HTMLInputElement | null = null;
let settingLanguageSelect: HTMLSelectElement | null = null;
let generalMemoryInput: HTMLTextAreaElement | null = null;
let saveGeneralMemoryButton: HTMLButtonElement | null = null;
let generalMemoriesListContainer: HTMLDivElement | null = null;


// Profile Screen Elements
let profileUserName: HTMLElement | null = null;
let profileUserEmail: HTMLElement | null = null;
let profileInterests: HTMLElement | null = null;
let profilePreferences: HTMLElement | null = null;
let profileFacts: HTMLElement | null = null;
let logoutButton: HTMLButtonElement | null = null;
let viewMemoriesButton: HTMLButtonElement | null = null;

// Memories Screen Elements
let memoriesListContainer: HTMLDivElement | null = null;
let memoriesBackButton: HTMLButtonElement | null = null;


// Webview Elements
let webviewScreenElement: HTMLElement | null = null;
let webviewFrame: HTMLIFrameElement | null = null;
let webviewTitle: HTMLElement | null = null;
let webviewLoading: HTMLElement | null = null;
let webviewCloseBtn: HTMLElement | null = null;

// Image Viewer Elements
let imageViewerScreenElement: HTMLElement | null = null;
let imageViewerImg: HTMLImageElement | null = null;
let imageViewerCloseBtn: HTMLElement | null = null;

// Onboarding Elements
let onboardingDots: NodeListOf<Element>;
let onboardingNextBtn: HTMLElement | null = null;
let onboardingSkipBtn: HTMLElement | null = null;

// Code Canvas Elements
let codeCanvasScreenElement: HTMLElement | null = null;
let codeCanvasTextarea: HTMLTextAreaElement | null = null;
let codeCanvasCopyToChatButton: HTMLButtonElement | null = null;
let codeCanvasCloseButton: HTMLButtonElement | null = null;
let codeEditorWrapper: HTMLDivElement | null = null;
let codeCanvasInlinePreviewIframe: HTMLIFrameElement | null = null;
let codeCanvasToggleViewButton: HTMLButtonElement | null = null;
let codeCanvasEnterFullscreenButton: HTMLButtonElement | null = null;

let fullScreenPreviewOverlay: HTMLDivElement | null = null;
let fullScreenPreviewIframe: HTMLIFrameElement | null = null;
let fullScreenPreviewCloseButton: HTMLButtonElement | null = null;

let codeCanvasViewMode: 'code' | 'preview' = 'code';
let debounceTimer: number | undefined;

// Image Studio Elements
let imageStudioPromptInput: HTMLTextAreaElement | null = null;
let imageStudioEngineSelect: HTMLSelectElement | null = null;
let imageStudioAspectRatioSelect: HTMLSelectElement | null = null;
let imageStudioGenerateButton: HTMLButtonElement | null = null;
let imageStudioLoadingIndicator: HTMLDivElement | null = null;
let imageStudioErrorMessageElement: HTMLDivElement | null = null;
let imageStudioGridElement: HTMLDivElement | null = null;
let imageStudioDownloadAllButton: HTMLButtonElement | null = null;
let currentGeneratedImagesData: { base64: string, prompt: string, mimeType: string }[] = [];

// Sign-In Screen Elements
let signinEmailInput: HTMLInputElement | null = null;
let signinPasswordInput: HTMLInputElement | null = null;
let signinButton: HTMLButtonElement | null = null;
let signupButton: HTMLButtonElement | null = null;
let authErrorMessageElement: HTMLElement | null = null;

// Create Tool Screen Elements
let createToolScreenElement: HTMLElement | null = null;
let toolNameInput: HTMLInputElement | null = null;
let toolInstructionsInput: HTMLTextAreaElement | null = null;
let toolKnowledgeInput: HTMLTextAreaElement | null = null;
let saveToolButton: HTMLButtonElement | null = null;
let createToolBackButton: HTMLButtonElement | null = null;
let createToolErrorMessageElement: HTMLElement | null = null;
let chatListCreateToolButton: HTMLButtonElement | null = null;

// Desktop Sidebar
let desktopSidebar: HTMLElement | null = null;
let toggleSidebarButton: HTMLButtonElement | null = null;
let appMainContent: HTMLElement | null = null;

// Web Dev Studio Elements
let webDevStudioScreenElement: HTMLElement | null = null;
let webDevPromptInput: HTMLTextAreaElement | null = null;
let webDevGenerateBtn: HTMLButtonElement | null = null;
let webDevLoadingIndicator: HTMLDivElement | null = null;
let webDevErrorMessageElement: HTMLDivElement | null = null;
let webDevArtifactListElement: HTMLDivElement | null = null;
let webDevArtifactFilesTitleElement: HTMLElement | null = null;
let webDevNoArtifactsMessageElement: HTMLElement | null = null;
let webDevDownloadZipBtn: HTMLButtonElement | null = null;
let webDevViewerTitleElement: HTMLElement | null = null;
let webDevRunProjectBtn: HTMLButtonElement | null = null;
let webDevCodeViewerElement: HTMLElement | null = null;
let webDevCodeViewerCodeElement: HTMLElement | null = null;
let webDevCopyCodeBtn: HTMLButtonElement | null = null;
let webDevPreviewIframeElement: HTMLIFrameElement | null = null;
let activeWebDevFile: WebArtifactFile | null = null;


// Chat History Interfaces
interface ChatMessage {
  id: string;
  sender: 'User' | 'Nova' | 'System' | 'Nova (Tool Mode)';
  text: string;
  timestamp: number;
  sources?: { uri: string, title: string }[] | null;
  detectedLanguage?: 'en' | 'ar' | 'unknown';
  messageType?: 'text' | 'image';
  imageData?: {
      base64: string;
      mimeType: string;
      promptForImage: string;
  } | null;
  userUploadedFile?: {
      name: string;
      type: 'image' | 'text' | 'other';
      isImage: boolean;
  } | null;
}


interface ChatSession {
  id:string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
  aiToneUsed?: string;
  basedOnToolId?: string | null;
}

// User Profile Interface for Memory
interface UserProfile {
    name?: string | null;
    interests: string[];
    preferences: { [key: string]: string };
    facts: string[];
}

// Manual Memory Interface - For chat-specific memories
interface SavedMemory {
    id: string;
    text: string;
    sender: string;
    chatId: string | null;
    originalMessageId: string;
    timestamp: number;
    userId: string;
}
// General Memory Interface - For settings-based general memories
interface GeneralMemory {
    id: string;
    text: string;
    timestamp: number;
    userId: string;
}


// Custom Tool Interface
interface CustomTool {
    id: string;
    name: string;
    instructions: string;
    knowledge?: string | null;
    icon?: string;
    lastUsed?: number;
}

// Staged File Interface
interface StagedFile {
    name: string;
    type: 'text' | 'image';
    content: string; // For text, this is string content. For image, this is base64 data.
    mimeType: string;
}

// Web Dev Artifact Interfaces
interface WebArtifactFile {
    filename: string;
    language: 'html' | 'css' | 'javascript';
    code: string;
}
interface WebDevArtifact {
    id: string;
    prompt: string;
    description?: string | null;
    files: WebArtifactFile[];
    timestamp: number;
    userId: string;
}


// Global State
let currentScreen = SPLASH_SCREEN_ID;
const screens = [SPLASH_SCREEN_ID, ONBOARDING_SCREEN_ID, SIGNIN_SCREEN_ID, CHAT_LIST_SCREEN_ID, CHAT_SCREEN_ID, SETTINGS_SCREEN_ID, PROFILE_SCREEN_ID, WEBVIEW_SCREEN_ID, IMAGE_VIEWER_SCREEN_ID, CODE_CANVAS_SCREEN_ID, IMAGE_STUDIO_SCREEN_ID, CREATE_TOOL_SCREEN_ID, MEMORIES_SCREEN_ID, WEB_DEV_STUDIO_SCREEN_ID];
let ai: GoogleGenAI;
let geminiChat: Chat;
let isLoading = false;
let isImageLoading = false;
let isWebDevLoading = false;
let geminiInitialized = false;
let processLogVisible = false;
let simulatedProcessInterval: number | undefined;


let chatSessions: ChatSession[] = [];
let currentChatSessionId: string | null = null;
let userProfile: UserProfile = { interests: [], preferences: {}, facts: [] };
let savedMemories: SavedMemory[] = [];
let generalMemories: GeneralMemory[] = [];
let customTools: CustomTool[] = [];
let stagedFile: StagedFile | null = null;
let editingUserMessageId: string | null = null;
let webDevArtifacts: WebDevArtifact[] = [];
let currentWebDevStudioArtifactSet: WebDevArtifact | null = null;


// Feature States
let isListening = false;
let ttsEnabled = false;
let currentAiTone = 'friendly';
let darkModeEnabled = true;
let voiceModeActive = false;
let manualTTScancelForMic = false;
let internetSearchEnabled = false;
let deepThinkingEnabled = false;
let advancedScientificModeEnabled = false;
let currentImageEngine = 'standard';
let currentChatIsBasedOnTool: string | null = null;
let currentCreativityLevel: 'focused' | 'balanced' | 'inventive' = 'balanced';
let currentLanguage: 'en' | 'ar' = 'en';
let isSidebarCollapsed = false;


// Firebase State
let firebaseApp: any;
let firebaseAuth: any;
let firebaseDb: any;
let currentUser: any = null;


const WebSpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any;
if (WebSpeechRecognition) {
    recognition = new WebSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = navigator.language || 'en-US';
}

// --- UI String Translations ---
const uiStrings = {
    en: {
        // Splash
        splashVersion: "Version 2.0.3",
        // Onboarding
        onboardingNext: "Next",
        onboardingGetStarted: "Get Started",
        onboardingSkip: "Skip",
        // Sign In
        signInWelcome: "Welcome",
        signInPrompt: "Sign in or create an account to continue.",
        signInEmailPlaceholder: "Email",
        signInPasswordPlaceholder: "Password",
        signInButton: "Sign In",
        signUpButton: "Sign Up",
        signInPoweredBy: "Powered by Firebase Authentication",
        // Chat List
        chatListTitle: "Chats & Tools",
        searchChatsToolsPlaceholder: "Search chats & tools...",
        // Chat Screen
        chatInputPlaceholder: "Ask Nova anything...",
        chatInputPlaceholderVoice: "Voice mode active...",
        chatInputPlaceholderEditing: "Edit your message...",
        // Settings
        settingsTitle: "Settings",
        settingsAiTone: "AI Tone",
        settingsFriendly: "Friendly",
        settingsFormal: "Formal",
        settingsCreative: "Creative",
        settingsCreativity: "Creativity Level",
        settingsCreativityDesc: "Adjust how factual or inventive Nova's responses are.",
        settingsCreativityFocused: "Focused (More Factual)",
        settingsCreativityBalanced: "Balanced (Default)",
        settingsCreativityInventive: "Inventive (More Creative)",
        settingsFeatures: "Features",
        settingsTTS: "Voice Output (TTS)",
        settingsInternetSearch: "Enable Internet Search",
        settingsDeepThinking: "Enable Deep Thinking Mode",
        settingsScientificMode: "Advanced Scientific Research Mode",
        settingsAppearance: "Appearance",
        settingsDarkMode: "Dark Mode",
        settingsOther: "Other",
        settingsLanguage: "Language (App UI)",
        settingsDevInfoTitle: "Developer Information",
        settingsDevName: "Mohamed Ibrahim Abdullah",
        settingsDevContact: "Contact (WhatsApp & Calls):",
        settingsGeneralMemories: "General Memories",
        settingsGeneralMemoryPlaceholder: "Type a general note or memory...",
        settingsSaveGeneralMemory: "Save General Memory",
        // Profile
        profileTitle: "Profile",
        profileLearnedInfo: "Learned Information:",
        profileInterests: "Interests:",
        profilePreferences: "Preferences:",
        profileFacts: "Facts:",
        profileViewMemories: "View Saved Memories",
        profileLogout: "Logout",
        // Memories
        memoriesTitle: "Saved Memories",
        memoriesNone: "No memories saved yet.",
        // Create Tool
        createToolTitle: "Create New Tool",
        toolNameLabel: "Tool Name",
        toolInstructionsLabel: "Tool Instructions & Persona (System Prompt)",
        toolKnowledgeLabel: "Initial Knowledge (Optional)",
        toolSaveButton: "Save Tool",
        // Image Studio
        imageStudioTitle: "Image Studio",
        imageStudioPromptLabel: "Image Prompt",
        imageStudioEngineLabel: "Image Generation Engine",
        imageStudioAspectLabel: "Aspect Ratio",
        imageStudioGenerateButton: "Generate Images",
        imageStudioLoading: "Generating your masterpieces...",
        imageStudioDownloadAll: "Download All Images",
        // Code Canvas
        codeCanvasTitle: "Code Canvas",
        codeCanvasShowPreview: "Show Preview",
        codeCanvasShowCode: "Show Code",
        codeCanvasCopyToChat: "Copy to Chat",
        // Web Dev Studio
        webDevStudioTitle: "Web Dev Studio",
        webDevPromptLabel: "Describe your web component/page:",
        webDevGenerateButton: "Generate Artifacts",
        webDevLoading: "Generating web artifacts...",
        webDevViewerTitleDefault: "Code Viewer",
        webDevFileHTML: "HTML File",
        webDevFileCSS: "CSS File",
        webDevFileJS: "JavaScript File",
        webDevNoArtifactsMessage: "No web artifacts generated yet. Enter a prompt and click 'Generate Artifacts'.",
        webDevDownloadFile: "Download File",
        webDevDownloadAllZip: "Download All as ZIP",
        webDevRunProject: "Run Project",
        webDevCopyCode: "Copy Code",
        webDevArtifactFilesTitle: "Generated Files:",
        // Advanced Options Popover
        advOptTitle: "Advanced Options",
        advOptDeepThinking: "Deep Thinking",
        advOptInternetSearch: "Internet Search",
        advOptScientificMode: "Scientific Mode",
        advOptUploadFile: "Upload File",
        advOptGenerateImage: "Generate Image",
        advOptCodeCanvas: "Code Canvas",
        // Misc
        sendButtonDefault: "Send",
        sendButtonUpdate: "Update Message",
        codeCanvasCopyBtnText: "Copy to Chat",
        editMessage: "Edit message",
        regenerateResponse: "Regenerate response",
        // Nav
        navHome: "Home",
        navImageStudio: "Image Studio",
        navWebDevStudio: "Web Dev",
        navNewChat: "New Chat",
        navProfile: "Profile",
        navSettings: "Settings",
    },
    ar: {
        // Splash
        splashVersion: "الإصدار 2.0.3",
        // Onboarding
        onboardingNext: "التالي",
        onboardingGetStarted: "ابدأ الآن",
        onboardingSkip: "تخطي",
        // Sign In
        signInWelcome: "مرحباً بك",
        signInPrompt: "سجل الدخول أو أنشئ حسابًا للمتابعة.",
        signInEmailPlaceholder: "البريد الإلكتروني",
        signInPasswordPlaceholder: "كلمة المرور",
        signInButton: "تسجيل الدخول",
        signUpButton: "إنشاء حساب",
        signInPoweredBy: "مدعوم بواسطة مصادقة Firebase",
        // Chat List
        chatListTitle: "الدردشات والأدوات",
        searchChatsToolsPlaceholder: "ابحث في الدردشات والأدوات...",
        // Chat Screen
        chatInputPlaceholder: "اسأل نوفا أي شيء...",
        chatInputPlaceholderVoice: "وضع الصوت نشط...",
        chatInputPlaceholderEditing: "عدّل رسالتك...",
        // Settings
        settingsTitle: "الإعدادات",
        settingsAiTone: "نبرة الذكاء الاصطناعي",
        settingsFriendly: "ودود",
        settingsFormal: "رسمي",
        settingsCreative: "إبداعي",
        settingsCreativity: "مستوى الإبداع",
        settingsCreativityDesc: "اضبط مدى واقعية أو ابتكار ردود نوفا.",
        settingsCreativityFocused: "مركّز (أكثر واقعية)",
        settingsCreativityBalanced: "متوازن (افتراضي)",
        settingsCreativityInventive: "مبتكر (أكثر إبداعًا)",
        settingsFeatures: "الميزات",
        settingsTTS: "الإخراج الصوتي (TTS)",
        settingsInternetSearch: "تفعيل البحث عبر الإنترنت",
        settingsDeepThinking: "تفعيل وضع التفكير العميق",
        settingsScientificMode: "وضع البحث العلمي المتقدم",
        settingsAppearance: "المظهر",
        settingsDarkMode: "الوضع الداكن",
        settingsOther: "أخرى",
        settingsLanguage: "لغة الواجهة",
        settingsDevInfoTitle: "معلومات المطور",
        settingsDevName: "محمد ابراهيم عبدالله",
        settingsDevContact: "للتواصل (واتساب واتصال):",
        settingsGeneralMemories: "الذكريات العامة",
        settingsGeneralMemoryPlaceholder: "اكتب ملاحظة أو ذكرى عامة...",
        settingsSaveGeneralMemory: "حفظ الذاكرة العامة",
        // Profile
        profileTitle: "الملف الشخصي",
        profileLearnedInfo: "المعلومات المكتسبة:",
        profileInterests: "الاهتمامات:",
        profilePreferences: "التفضيلات:",
        profileFacts: "الحقائق:",
        profileViewMemories: "عرض الذكريات المحفوظة",
        profileLogout: "تسجيل الخروج",
        // Memories
        memoriesTitle: "الذكريات المحفوظة",
        memoriesNone: "لا توجد ذكريات محفوظة بعد.",
        // Create Tool
        createToolTitle: "إنشاء أداة جديدة",
        toolNameLabel: "اسم الأداة",
        toolInstructionsLabel: "تعليمات الأداة والشخصية (موجه النظام)",
        toolKnowledgeLabel: "المعرفة الأولية (اختياري)",
        toolSaveButton: "حفظ الأداة",
        // Image Studio
        imageStudioTitle: "استوديو الصور",
        imageStudioPromptLabel: "موجه الصورة",
        imageStudioEngineLabel: "محرك توليد الصور",
        imageStudioAspectLabel: "نسبة العرض إلى الارتفاع",
        imageStudioGenerateButton: "توليد الصور",
        imageStudioLoading: "جاري إنشاء روائعك الفنية...",
        imageStudioDownloadAll: "تنزيل جميع الصور",
        // Code Canvas
        codeCanvasTitle: "لوحة الأكواد",
        codeCanvasShowPreview: "عرض المعاينة",
        codeCanvasShowCode: "عرض الكود",
        codeCanvasCopyToChat: "نسخ إلى الدردشة",
        // Web Dev Studio
        webDevStudioTitle: "استوديو تطوير الويب",
        webDevPromptLabel: "صف مكون الويب أو الصفحة الخاصة بك:",
        webDevGenerateButton: "إنشاء المكونات",
        webDevLoading: "جاري إنشاء مكونات الويب...",
        webDevViewerTitleDefault: "عارض الأكواد",
        webDevFileHTML: "ملف HTML",
        webDevFileCSS: "ملف CSS",
        webDevFileJS: "ملف JavaScript",
        webDevNoArtifactsMessage: "لم يتم إنشاء أي مكونات ويب بعد. أدخل وصفًا وانقر على 'إنشاء المكونات'.",
        webDevDownloadFile: "تنزيل الملف",
        webDevDownloadAllZip: "تنزيل الكل كملف ZIP",
        webDevRunProject: "تشغيل المشروع",
        webDevCopyCode: "نسخ الكود",
        webDevArtifactFilesTitle: "الملفات المُنشأة:",
         // Advanced Options Popover
        advOptTitle: "خيارات متقدمة",
        advOptDeepThinking: "تفكير عميق",
        advOptInternetSearch: "بحث بالإنترنت",
        advOptScientificMode: "وضع علمي",
        advOptUploadFile: "رفع ملف",
        advOptGenerateImage: "توليد صورة",
        advOptCodeCanvas: "لوحة الأكواد",
        // Misc
        sendButtonDefault: "إرسال",
        sendButtonUpdate: "تحديث الرسالة",
        codeCanvasCopyBtnText: "نسخ إلى الدردشة",
        editMessage: "تعديل الرسالة",
        regenerateResponse: "إعادة إنشاء الرد",
        // Nav
        navHome: "الرئيسية",
        navImageStudio: "استوديو الصور",
        navWebDevStudio: "تطوير الويب",
        navNewChat: "دردشة جديدة",
        navProfile: "الملف الشخصي",
        navSettings: "الإعدادات",
    }
};


// --- START OF CORE CHAT AND GEMINI FUNCTIONS ---

function detectMessageLanguage(text: string | null | undefined): 'en' | 'ar' | 'unknown' {
    if (!text) return 'unknown';
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(text)) {
        return 'ar';
    }
    return 'en';
}

function getSystemInstruction(tone: string, profile: UserProfile, isDeepThinking: boolean, isInternetSearch: boolean, isToolChat = false, isAdvancedScientificMode = false): string {
    let baseInstruction = "";
    let supplementalInstructions = ""; // For tools, these are appended

    if (!isToolChat) { // General chat
        if (isAdvancedScientificMode) {
            baseInstruction = `You are Nova, an AI specialized in advanced scientific research and academic writing. The user has enabled "Advanced Scientific Research Mode".
Your process MUST be:
1.  **Deep Analysis & Planning**: Meticulously analyze the user's request. Before writing, create a detailed internal plan and outline for a comprehensive scientific paper, including standard sections (Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion, References if applicable).
2.  **Structured Content Generation**: Generate content for each section, ensuring depth, coherence, and logical flow. Aim for substantial length, comparable to real academic papers.
3.  **Academic Rigor**: Use formal, objective, and precise language. Employ appropriate scientific terminology.
4.  **Evidence-Based Reasoning**: Support claims with sound logic. If internet search is used and provides citable sources, integrate them.
5.  **Iterative Refinement & Self-Correction**: Internally review and refine the content for accuracy, clarity, and completeness as you generate it.
Do not explicitly state these planning steps in your response, but adhere to them strictly. Format using Markdown suitable for a research paper. If asked to continue, seamlessly resume from the previous point, maintaining the established structure and depth.`;
        } else {
            switch (tone) {
                case 'formal':
                    baseInstruction = `You are Nova, a professional and formal AI assistant. Maintain a respectful and serious tone.`;
                    break;
                case 'creative':
                    baseInstruction = `You are Nova, a highly creative and imaginative AI assistant. Feel free to use vivid language and think outside the box.`;
                    break;
                case 'friendly':
                default:
                    baseInstruction = `You are Nova, a friendly and helpful AI assistant. Be conversational and approachable.`;
                    break;
            }
        }
    }
    // For tool chats, the primary persona and instructions come from tool.instructions and tool.knowledge

    // Deep Thinking & Internet Search prompts - added to baseInstruction for general, supplemental for tools
    let thinkingSearchPrompts = "";
    if (isDeepThinking && !isAdvancedScientificMode) { // Don't add generic deep thinking if scientific mode is already very specific
        thinkingSearchPrompts += `\n\nIMPORTANT: The user has enabled "Deep Thinking Mode". Your process should be:
1. Thorough Analysis: Carefully examine the user's query, breaking it down into its core components. Identify any nuances, implicit questions, or underlying needs.
2. Knowledge Retrieval & Synthesis: Access and synthesize relevant information from your knowledge base. If the query is complex or requires diverse information, pull from multiple areas.
3. Multi-perspective Consideration: Explore different angles, viewpoints, or interpretations related to the query. If applicable, consider potential pros and cons, alternative solutions, or broader implications.
4. Structured Reasoning: Formulate your response with clear, logical steps. If you're providing an explanation or argument, ensure your reasoning is easy to follow.
5. Comprehensive & Insightful Output: Aim to provide a response that is not just accurate but also insightful, offering depth and context beyond a superficial answer. Anticipate potential follow-up questions if appropriate.
When generating long reports, maintain coherence across segments and critically review your output for accuracy and completeness before finalizing each part. If continuing a previous thought, ensure seamless integration.
Do not explicitly state these steps in your response, but use them to guide your thought process.`;
    }
    if (isInternetSearch && !isAdvancedScientificMode) { // Don't add generic search if scientific mode has its own data gathering
         thinkingSearchPrompts += `\n\nIMPORTANT: The user has enabled "Internet Search". Use Google Search to find up-to-date information when the query seems to require it (e.g., recent events, specific facts not in your base knowledge). When you use search results, you MUST cite your sources. After providing your answer, list the URLs of the websites you used under a "Sources:" heading.`;
    }

    if (isToolChat) {
        supplementalInstructions += thinkingSearchPrompts;
    } else {
        baseInstruction += thinkingSearchPrompts;
    }

    // Voice mode conciseness (only for general, non-deep, non-scientific chats)
    if (voiceModeActive && !isDeepThinking && !isAdvancedScientificMode && !isToolChat) {
        baseInstruction += `\n\nThis is a voice conversation, so try to keep responses relatively concise and conversational for a better spoken experience.`;
    }

    // Profile and Memory Info (common to both, added to base for general, supplemental for tools)
    let profileAndMemoryInfo = "";
    let hasProfileData = false;
    if (currentUser?.displayName || profile.name) {
        profileAndMemoryInfo += `\n- User's name: ${currentUser?.displayName || profile.name}. Address them by their name occasionally if it feels natural.`;
        hasProfileData = true;
    } else if (currentUser?.email && !profile.name) {
         profileAndMemoryInfo += `\n- User's identifier (from email): ${currentUser.email.split('@')[0]}.`;
         hasProfileData = true;
    }

    if (profile.interests && profile.interests.length > 0) { profileAndMemoryInfo += `\n- User's interests: ${profile.interests.join(', ')}.`; hasProfileData = true; }
    if (profile.preferences && Object.keys(profile.preferences).length > 0) {
        profileAndMemoryInfo += `\n- User's preferences: ${Object.entries(profile.preferences).map(([k,v]) => `${k}: ${v}`).join('; ')}.`;
        hasProfileData = true;
    }
    if (profile.facts && profile.facts.length > 0) { profileAndMemoryInfo += `\n- Other facts about user: ${profile.facts.join('; ')}.`; hasProfileData = true; }

    const userChatMemories = savedMemories.filter(m => m.userId === currentUser?.uid);
    if (userChatMemories.length > 0) {
        profileAndMemoryInfo += "\n\nSpecific things the user asked to remember (from chats):";
        userChatMemories.sort((a,b) => b.timestamp - a.timestamp).slice(0, 5).forEach(mem => {
            profileAndMemoryInfo += `\n- Regarding a point by ${mem.sender}: "${mem.text.substring(0,150)}${mem.text.length > 150 ? '...' : ''}" (Saved on: ${new Date(mem.timestamp).toLocaleDateString()})`;
        });
        hasProfileData = true;
    }

    const userGeneralMems = generalMemories.filter(m => m.userId === currentUser?.uid);
    if (userGeneralMems.length > 0) {
        profileAndMemoryInfo += "\n\nGeneral notes the user saved:";
        userGeneralMems.sort((a,b) => b.timestamp - a.timestamp).slice(0, 5).forEach(mem => {
            profileAndMemoryInfo += `\n- General Note: "${mem.text.substring(0,150)}${mem.text.length > 150 ? '...' : ''}" (Saved: ${new Date(mem.timestamp).toLocaleDateString()})`;
        });
        hasProfileData = true;
    }

    if (hasProfileData) {
        const personalizationHeader = "\n\nUse the following information about the user subtly and naturally to personalize responses, without explicitly stating 'I remember...':";
        if (isToolChat) {
            supplementalInstructions += personalizationHeader + profileAndMemoryInfo;
        } else {
            baseInstruction += personalizationHeader + profileAndMemoryInfo;
        }
    } else if (!isToolChat && !isAdvancedScientificMode) { // Prompt to learn if no data for general chats
        baseInstruction += "\n\nYou don't have specific profile information for this user yet. Try to learn about them if they share details.";
    }

    // Markdown formatting and Language (common to both, added to base for general, supplemental for tools)
    const commonBehavioralGuidelines = "\nFormat your responses using Markdown. This includes tables, lists, code blocks (e.g., ```html ... ```), bold, italic, etc., where appropriate for clarity and structure. Ensure code blocks are properly formatted and language-tagged if known." +
                                     `\n\nRespond in the primary language used by the user in their last message. If unclear, default to ${currentLanguage === 'ar' ? 'Arabic' : 'English'}.`;


    if (isToolChat) {
        supplementalInstructions += commonBehavioralGuidelines;
        return supplementalInstructions; // For tools, this is what gets appended
    } else {
        baseInstruction += commonBehavioralGuidelines;
    }

    // Storyboard instruction (ONLY FOR GENERAL CHAT, NOT TOOLS, NOT SCIENTIFIC MODE)
    if (!isAdvancedScientificMode && !isToolChat) {
        baseInstruction += "\n\nIf the user asks you to 'generate a storyboard' or 'create a storyboard from a script', first provide a textual breakdown of the script into scenes and describe the visual elements for each panel/shot in text. Do not attempt to generate images directly for the storyboard in this initial text response. The user can then use dedicated image generation tools (like the in-chat image button or image studio) to visualize each described panel using your textual descriptions as prompts."
    }
    return baseInstruction; // Full instruction for general chats
}


function initializeGeminiSDK(): boolean {
  if (!GEMINI_API_KEY) {
    const commonErrorMessage = "Error: API Key not configured. Please contact support or check documentation.";
    if (currentScreen === CHAT_SCREEN_ID) {
        displaySystemMessage(commonErrorMessage, CHAT_SCREEN_ID, 'en');
        disableChatInput(true, false);
    } else if (currentScreen === IMAGE_STUDIO_SCREEN_ID) {
        if(imageStudioErrorMessageElement) {
            imageStudioErrorMessageElement.textContent = commonErrorMessage;
            imageStudioErrorMessageElement.style.display = 'block';
        }
        if(imageStudioGenerateButton) imageStudioGenerateButton.disabled = true;
    } else if (currentScreen === WEB_DEV_STUDIO_SCREEN_ID) {
        if(webDevErrorMessageElement) {
            webDevErrorMessageElement.textContent = commonErrorMessage;
            webDevErrorMessageElement.style.display = 'block';
        }
        if(webDevGenerateBtn) webDevGenerateBtn.disabled = true;
    }
    else {
        console.warn(commonErrorMessage);
    }
    geminiInitialized = false;
    return false;
  }
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    geminiInitialized = true;
    console.log("Gemini SDK Initialized Successfully.");
    if (currentScreen === CHAT_SCREEN_ID) {
        disableChatInput(false, false);
    } else if (currentScreen === IMAGE_STUDIO_SCREEN_ID && imageStudioGenerateButton) {
        imageStudioGenerateButton.disabled = false;
        if(imageStudioErrorMessageElement && imageStudioErrorMessageElement.textContent && imageStudioErrorMessageElement.textContent.includes("API Key not configured")) {
            imageStudioErrorMessageElement.style.display = 'none';
        }
    } else if (currentScreen === WEB_DEV_STUDIO_SCREEN_ID && webDevGenerateBtn) {
        webDevGenerateBtn.disabled = false;
         if(webDevErrorMessageElement && webDevErrorMessageElement.textContent && webDevErrorMessageElement.textContent.includes("API Key not configured")) {
            webDevErrorMessageElement.style.display = 'none';
        }
    }
    return true;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
     const commonErrorMessage = "Error: Could not initialize AI. Please check your API key and network connection.";
    if (currentScreen === CHAT_SCREEN_ID) {
        displaySystemMessage(commonErrorMessage, CHAT_SCREEN_ID, 'en');
        disableChatInput(true, false);
    } else if (currentScreen === IMAGE_STUDIO_SCREEN_ID) {
        if(imageStudioErrorMessageElement) {
            imageStudioErrorMessageElement.textContent = commonErrorMessage;
            imageStudioErrorMessageElement.style.display = 'block';
        }
        if(imageStudioGenerateButton) imageStudioGenerateButton.disabled = true;
    } else if (currentScreen === WEB_DEV_STUDIO_SCREEN_ID) {
        if(webDevErrorMessageElement) {
            webDevErrorMessageElement.textContent = commonErrorMessage;
            webDevErrorMessageElement.style.display = 'block';
        }
        if(webDevGenerateBtn) webDevGenerateBtn.disabled = true;
    }
    else {
         console.error(commonErrorMessage);
    }
    geminiInitialized = false;
    return false;
  }
}

function createNewChatSession() {
  if (!currentUser) {
      displaySystemMessage("Please sign in to start a new chat.", CHAT_SCREEN_ID);
      showScreen(SIGNIN_SCREEN_ID);
      return;
  }
  currentChatSessionId = null;
  currentChatIsBasedOnTool = null;
  editingUserMessageId = null;
  if (chatInput) chatInput.value = '';
  const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
  if (sendButton) {
    const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
    if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
    sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
  }


  if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';
  if (stagedFilePreviewContainer && stagedFileClearButton) { // Changed ID check
    stagedFile = null;
    updateStagedFilePreview();
  }

  if (!geminiInitialized && !initializeGeminiSDK()) {
    displaySystemMessage("Error: AI Service not available.", CHAT_SCREEN_ID);
    return;
  }
  const systemInstruction = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
  geminiChat = ai.chats.create({
    model: TEXT_MODEL_NAME,
    config: { systemInstruction }
  });

  if (chatScreenTitleElement) chatScreenTitleElement.textContent = currentStrings.navNewChat;

  const initialGreetingText = "Hello, I'm Nova, your personal AI assistant. How can I help you today?";
  const initialGreetingLang = detectMessageLanguage(initialGreetingText);
  const initialMessageId = `msg-system-${Date.now()}`;
  appendMessage("Nova", initialGreetingText, 'ai', false, null, true, null, initialGreetingLang, initialMessageId, 'text', null, null);
  showScreen(CHAT_SCREEN_ID);
   if (voiceModeActive && !isListening) {
     handleMicInput();
   }
}

function loadChat(sessionId: string) {
  if (!currentUser) {
      displaySystemMessage("Please sign in to load chats.", CHAT_SCREEN_ID);
      showScreen(SIGNIN_SCREEN_ID);
      return;
  }
  const session = chatSessions.find(s => s.id === sessionId);
  if (!session) {
    createNewChatSession();
    return;
  }
  currentChatSessionId = sessionId;
  currentChatIsBasedOnTool = session.basedOnToolId || null;
  editingUserMessageId = null;
  if (chatInput) chatInput.value = '';
  const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
   if (sendButton) {
    const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
    if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
    sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
  }


  if (stagedFilePreviewContainer && stagedFileClearButton) { // Changed ID check
    stagedFile = null;
    updateStagedFilePreview();
  }

  if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';

  if (!geminiInitialized && !initializeGeminiSDK()) {
    displaySystemMessage("Error: AI Service not available.", CHAT_SCREEN_ID);
    return;
  }

  const history: Content[] = session.messages
    .filter(msg => msg.sender !== 'System')
    .map(msg => {
        const parts: Part[] = [];
        if (msg.messageType === 'image' && msg.imageData) {
            parts.push({ text: msg.imageData.promptForImage || "[AI generated an image based on previous prompt]" });
        } else if (msg.userUploadedFile) {
            parts.push({ text: `[User uploaded file: ${msg.userUploadedFile.name}] ${msg.text || ""}`.trim() });
        } else {
            parts.push({ text: msg.text || "[empty message]" });
        }
        return {
            role: (msg.sender === "User") ? "user" : "model",
            parts
        };
    });

  let systemInstructionText;
  if (currentChatIsBasedOnTool) {
      const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
      if (tool) {
          systemInstructionText = tool.instructions;
          if (tool.knowledge) {
              systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
          }
          const supplementalInstructions = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false);
          systemInstructionText += supplementalInstructions;
      } else {
          console.warn(`Tool with ID ${currentChatIsBasedOnTool} not found for loaded chat. Reverting to default instructions.`);
          currentChatIsBasedOnTool = null;
          session.basedOnToolId = undefined; // Ensure it's undefined, not null for Firebase
          systemInstructionText = getSystemInstruction(session.aiToneUsed || currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
      }
  } else {
      systemInstructionText = getSystemInstruction(session.aiToneUsed || currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
  }

  geminiChat = ai.chats.create({
    model: TEXT_MODEL_NAME,
    history,
    config: { systemInstruction: systemInstructionText }
  });

  if (chatScreenTitleElement) {
      let titleKey = session.title || "Nova";
      if (currentChatIsBasedOnTool) {
          const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
          titleKey = tool ? `Tool: ${tool.name}` : titleKey;
      }
      chatScreenTitleElement.textContent = titleKey;
  }


  session.messages.forEach(msg => {
      const lang = msg.detectedLanguage || detectMessageLanguage(msg.text);
      appendMessage(
        msg.sender,
        msg.text,
        msg.sender === 'User' ? 'user' : (msg.sender === 'System' ? 'ai' : 'ai'), // Map 'System' to 'ai' for avatar/styling
        false, null, msg.sender === 'System',
        msg.sources,
        lang,
        msg.id,
        msg.messageType || 'text',
        msg.imageData,
        msg.userUploadedFile
      );
    });
  showScreen(CHAT_SCREEN_ID);
   if (voiceModeActive && !isListening) {
     handleMicInput();
   }
}

async function generateChatTitle(firstUserMsg: string, firstAiMsg: string): Promise<string> {
    const defaultTitle = firstUserMsg.substring(0, 25) + (firstUserMsg.length > 25 ? "..." : "");
    if (!ai || !geminiInitialized) {
        return defaultTitle;
    }
    try {
        const prompt = `Based on this initial exchange, suggest a very short, concise title (max 5 words) for this chat conversation:
User: "${firstUserMsg.substring(0, 100)}${firstUserMsg.length > 100 ? "..." : ""}"
AI: "${firstAiMsg.substring(0, 100)}${firstAiMsg.length > 100 ? "..." : ""}"
Title:`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: TEXT_MODEL_NAME,
            contents: prompt,
            config: { temperature: 0.3 }
        });
        let title = response.text.trim().replace(/^["']|["']$/g, "");
        if (!title || title.toLowerCase().startsWith("title:") || title.length < 3 || title.length > 50) {
            title = defaultTitle;
        }
        return title.length > 35 ? title.substring(0,32) + "..." : title;
    } catch (error) {
        console.error("Error generating chat title:", error);
        return defaultTitle;
    }
}

function scrollToBottomChat() {
  if (chatMessagesContainer) chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function disableChatInput(textLoading: boolean, imageLoading: boolean) {
    isLoading = textLoading;
    isImageLoading = imageLoading;
    const anyLoading = isLoading || isImageLoading;
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;

    if (isLoading) {
        if (novaProcessingIndicatorElement) {
            let loadingText = currentStrings.chatInputPlaceholder; // Default processing
            if (advancedScientificModeEnabled) {
                loadingText = "Nova is conducting advanced research and drafting...";
            } else if (deepThinkingEnabled && internetSearchEnabled) {
                loadingText = "Nova is researching and thinking deeply...";
            } else if (deepThinkingEnabled) {
                loadingText = "Nova is thinking deeply...";
            } else if (internetSearchEnabled) {
                loadingText = "Nova is researching...";
            } else {
                loadingText = "Nova is processing...";
            }

            novaProcessingIndicatorElement.textContent = loadingText;
            novaProcessingIndicatorElement.style.display = 'flex';
            novaProcessingIndicatorElement.classList.add('visible');
        }
        if (novaImageProcessingIndicatorElement) {
             novaImageProcessingIndicatorElement.style.display = 'none';
             novaImageProcessingIndicatorElement.classList.remove('visible');
        }
        if (processLogVisible) startSimulatedProcessLog();
    } else if (isImageLoading) {
        if (novaImageProcessingIndicatorElement) {
            novaImageProcessingIndicatorElement.textContent = "Nova is creating an image...";
            novaImageProcessingIndicatorElement.style.display = 'flex';
            novaImageProcessingIndicatorElement.classList.add('visible');
        }
         if (novaProcessingIndicatorElement) {
            novaProcessingIndicatorElement.style.display = 'none';
            novaProcessingIndicatorElement.classList.remove('visible');
        }
        stopSimulatedProcessLog();
    } else {
        if (novaProcessingIndicatorElement) {
            novaProcessingIndicatorElement.style.display = 'none';
            novaProcessingIndicatorElement.classList.remove('visible');
        }
        if (novaImageProcessingIndicatorElement) {
            novaImageProcessingIndicatorElement.style.display = 'none';
            novaImageProcessingIndicatorElement.classList.remove('visible');
        }
        stopSimulatedProcessLog();
    }

  if (chatInput && !voiceModeActive) chatInput.disabled = anyLoading;
  else if (chatInput && voiceModeActive) chatInput.disabled = true;

  if (sendButton) sendButton.disabled = anyLoading;
  if (micButton) micButton.disabled = anyLoading;
  if (advancedOptionsButton) advancedOptionsButton.disabled = anyLoading;


  sendButton?.classList.toggle('opacity-50', anyLoading);
  sendButton?.classList.toggle('cursor-not-allowed', anyLoading);
  micButton?.classList.toggle('opacity-50', anyLoading && !isListening);
  micButton?.classList.toggle('cursor-not-allowed', anyLoading && !isListening);
  advancedOptionsButton?.classList.toggle('opacity-50', anyLoading);
  advancedOptionsButton?.classList.toggle('cursor-not-allowed', anyLoading);
}

function displaySystemMessage(text: string, screenIdContext: string, lang: 'en' | 'ar' | 'unknown' = 'en') {
    if (screenIdContext === CHAT_SCREEN_ID && chatMessagesContainer) {
         const systemMessageId = `sys-msg-${Date.now()}`;
         appendMessage("System", text, 'ai', false, null, true, null, lang, systemMessageId, 'text', null, null);
    } else {
        console.warn(`System Message (screen: ${screenIdContext}): ${text}`);
    }
}

function appendMessage(
    senderName: ChatMessage['sender'],
    textOrData: string,
    type: 'user' | 'ai',
    isStreaming: boolean = false,
    existingMessageDiv: HTMLDivElement | null = null,
    isInitialSystemMessage: boolean = false,
    sources: ChatMessage['sources'] | null = null,
    detectedLang: ChatMessage['detectedLanguage'],
    messageId: string,
    messageType: ChatMessage['messageType'] = 'text',
    imageData: ChatMessage['imageData'] | null = null,
    userUploadedFile: ChatMessage['userUploadedFile'] | null = null
): HTMLDivElement | null {
  if (!chatMessagesContainer) return null;

  let messageWrapper: HTMLDivElement;
  let messageContentHolder: HTMLDivElement;
  let aiMessageContentDiv: HTMLDivElement | null = null;
  let contentWrapperDiv: HTMLDivElement;
  let senderNameParaElement: HTMLParagraphElement | null = null;

  const contentLanguage = detectedLang || detectMessageLanguage(typeof textOrData === 'string' ? textOrData : (imageData?.promptForImage || userUploadedFile?.name || ""));
  const domId = messageId || existingMessageDiv?.id || `msg-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  let messageSenderLine: HTMLDivElement | null = null;

  if (existingMessageDiv && (messageType === 'text' || (messageType === 'image' && !isStreaming))) {
    messageWrapper = existingMessageDiv;
    contentWrapperDiv = messageWrapper.querySelector('.user-message-content-wrapper, .ai-message-content-wrapper') as HTMLDivElement;
    messageSenderLine = contentWrapperDiv?.querySelector('.message-sender-line');
    if (messageSenderLine) senderNameParaElement = messageSenderLine.querySelector('.message-sender-name');

    const existingContentHolder = messageWrapper.querySelector('.message-text, .ai-message-image-container') as HTMLDivElement;
    aiMessageContentDiv = messageWrapper.querySelector('.ai-message-content') as HTMLDivElement;

    if (existingContentHolder) {
        messageContentHolder = existingContentHolder;
        if(!isStreaming || messageType === 'image') messageContentHolder.innerHTML = ''; // Clear for non-streaming or image
    } else {
        console.error("Could not find content holder in existing message div:", domId);
        return messageWrapper; // Or handle error appropriately
    }
     if (messageType === 'text' && isStreaming) { // Only update innerHTML if it's a streaming text update
        messageContentHolder.innerHTML = renderMarkdownToHTML(textOrData);
    }
  } else { // New message
    messageWrapper = document.createElement('div');
    messageWrapper.id = domId;
    messageWrapper.className = 'flex items-end gap-3 p-4 chat-message-wrapper lg:p-5 relative group';
    messageWrapper.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 lg:w-12 lg:h-12 shrink-0 border-2 border-[#19e5c6]/50';

    contentWrapperDiv = document.createElement('div');
    contentWrapperDiv.className = `flex flex-1 flex-col gap-1 max-w-[85%] lg:max-w-[75%] ${type === 'user' ? 'user-message-content-wrapper' : 'ai-message-content-wrapper'}`;
    contentWrapperDiv.style.position = 'relative'; // For absolute positioning of actions

    // Container for sender name and header actions (edit/regenerate)
    messageSenderLine = document.createElement('div');
    messageSenderLine.className = 'message-sender-line flex justify-between items-center w-full mb-1'; // Added w-full and mb-1

    senderNameParaElement = document.createElement('p');
    senderNameParaElement.className = 'text-[#A0E1D9] text-xs lg:text-sm font-medium leading-normal message-sender-name flex-grow'; // Added flex-grow
    senderNameParaElement.textContent = senderName;

    messageContentHolder = document.createElement('div'); // Generic holder

    if (type === 'ai') {
        aiMessageContentDiv = document.createElement('div'); // Bubble for AI
        aiMessageContentDiv.className = 'ai-message-content bg-[#1A3A35] text-white rounded-xl rounded-bl-none shadow-md overflow-hidden lg:rounded-lg';
         if (senderName === "System") {
            aiMessageContentDiv.classList.add('opacity-90', 'italic', 'bg-slate-700'); // Darker, italic for system
        }
    } else { // User message bubble
        messageContentHolder.className = 'message-text text-base lg:text-lg font-normal leading-relaxed rounded-xl px-4 py-3 shadow-md break-words rounded-br-none bg-[#19e5c6] text-[#0C1A18]';
    }


    // Assemble the message structure
    if (type === 'user') {
      messageWrapper.classList.add('justify-end');
      contentWrapperDiv.classList.add('items-end');
      avatarDiv.style.backgroundImage = `url("${USER_AVATAR_URL}")`;
      if (messageSenderLine && senderNameParaElement) messageSenderLine.appendChild(senderNameParaElement);
      if (messageSenderLine) contentWrapperDiv.appendChild(messageSenderLine);
      contentWrapperDiv.appendChild(messageContentHolder); // User bubble is messageContentHolder itself
      messageWrapper.appendChild(contentWrapperDiv);
      messageWrapper.appendChild(avatarDiv);
    } else { // AI or System message
      messageWrapper.classList.add('justify-start');
      contentWrapperDiv.classList.add('items-start');
      avatarDiv.style.backgroundImage = `url("${AI_AVATAR_URL}")`;

      if (senderName === "System") avatarDiv.style.opacity = "0.6";

      if (messageSenderLine && senderNameParaElement) messageSenderLine.appendChild(senderNameParaElement);
      if (messageSenderLine) contentWrapperDiv.appendChild(messageSenderLine);

      if(aiMessageContentDiv) { // AI messages use the styled bubble
        aiMessageContentDiv.appendChild(messageContentHolder);
        contentWrapperDiv.appendChild(aiMessageContentDiv);
      } else { // Should not be reached for type 'ai' as aiMessageContentDiv is created
        contentWrapperDiv.appendChild(messageContentHolder);
      }
      messageWrapper.appendChild(avatarDiv);
      messageWrapper.appendChild(contentWrapperDiv);
    }
    if (chatMessagesContainer) chatMessagesContainer.appendChild(messageWrapper);
  }

    // Populate content holder (must happen after it's in the DOM or if existing)
    if (messageType === 'text') {
        messageContentHolder.classList.add('message-text', 'text-base', 'lg:text-lg', 'font-normal', 'leading-relaxed', 'break-words');
        if (type === 'ai' && aiMessageContentDiv && !messageContentHolder.classList.contains('px-4')) { // Apply padding inside AI bubble for text
            messageContentHolder.classList.add('px-4', 'py-3', 'lg:px-5', 'lg:py-4');
        }
        let currentText = textOrData;
        if (userUploadedFile && type === 'user') { // Prepend file info if it's a user message with a file
            const filePreamble = `<span class="user-uploaded-file-info">Analyzing ${userUploadedFile.isImage ? "image" : "file"}: <i>${escapeHTML(userUploadedFile.name)}</i>.</span>`;
            currentText = `${filePreamble}${textOrData}`; // textOrData is user's query text
        }
        messageContentHolder.innerHTML = renderMarkdownToHTML(currentText);
    } else if (messageType === 'image' && imageData) { // AI generated image
        messageContentHolder.classList.add('ai-message-image-container'); // Basic class for image holder
        if(!messageContentHolder.classList.contains('p-3')) messageContentHolder.classList.add('p-3'); // Ensure padding if not already there

        const promptPara = document.createElement('p');
        promptPara.className = 'ai-image-prompt-text';
        promptPara.textContent = `Image for: "${imageData.promptForImage}"`;
        messageContentHolder.appendChild(promptPara);

        const imgElement = document.createElement('img');
        imgElement.src = `data:${imageData.mimeType};base64,${imageData.base64}`;
        imgElement.alt = imageData.promptForImage;
        imgElement.className = 'rounded-md object-contain max-w-full h-auto cursor-pointer shadow-sm';
        imgElement.onclick = () => openInAppImageViewer(imgElement.src);
        messageContentHolder.appendChild(imgElement);

        // Download button for the image
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-in-chat-image-btn';
        downloadBtn.innerHTML = `<span class="material-symbols-outlined">download</span> Download`;
        downloadBtn.dataset.base64 = imageData.base64;
        downloadBtn.dataset.mime = imageData.mimeType;
        downloadBtn.dataset.prompt = imageData.promptForImage;
        messageContentHolder.appendChild(downloadBtn);
    }

    // Set directionality for content and sender name
    messageContentHolder.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (senderNameParaElement) senderNameParaElement.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (messageSenderLine) messageSenderLine.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr';


  // --- Render Sources (for AI text messages) ---
  if (type === 'ai' && messageType === 'text' && sources && sources.length > 0 && chatMessagesContainer) {
    const sourcesContainerId = domId + '-sources';
    let sourcesContainer = document.getElementById(sourcesContainerId) as HTMLDivElement | null;

    if (!sourcesContainer) { // Create if doesn't exist
        sourcesContainer = document.createElement('div');
        sourcesContainer.id = sourcesContainerId;
        sourcesContainer.className = 'chat-message-external-sources'; // CSS class handles margins and styling
        if (contentLanguage === 'ar') {
             sourcesContainer.dir = 'rtl';
        } else {
            sourcesContainer.dir = 'ltr';
        }

        if (messageWrapper.nextSibling) {
            chatMessagesContainer.insertBefore(sourcesContainer, messageWrapper.nextSibling);
        } else {
            chatMessagesContainer.appendChild(sourcesContainer);
        }
    }

    sourcesContainer.innerHTML = ''; // Clear previous sources

    const sourcesHeading = document.createElement('h4');
    sourcesHeading.textContent = contentLanguage === 'ar' ? "المصادر:" : "Sources:";
    sourcesContainer.appendChild(sourcesHeading);

    const ol = document.createElement('ol');
    sources.forEach(source => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = source.uri;
        a.textContent = source.title || source.uri;
        a.className = 'webview-link';
        a.dataset.url = source.uri;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.appendChild(a);
        try {
            const domain = new URL(source.uri).hostname.replace(/^www\./, '');
            const domainSpan = document.createElement('span');
            domainSpan.className = 'source-domain';
            domainSpan.textContent = `(${domain})`;
            li.appendChild(domainSpan);
        } catch (e) { /* ignore */ }
        ol.appendChild(li);
    });
    sourcesContainer.appendChild(ol);

    if (processLogVisible) {
        sources.forEach(source => addProcessLogEntry(`Source: ${source.title || source.uri}`, 'source', source.uri));
    }
  } else if (type === 'ai' && (!sources || sources.length === 0) && chatMessagesContainer) {
    const sourcesContainerId = domId + '-sources';
    const existingSourcesContainer = document.getElementById(sourcesContainerId);
    if (existingSourcesContainer) {
        existingSourcesContainer.remove();
    }
  }

  let headerActionsContainer = messageSenderLine?.querySelector('.message-actions-header');
  if (!headerActionsContainer && messageSenderLine) {
      headerActionsContainer = document.createElement('div');
      headerActionsContainer.className = 'message-actions-header flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0';
      // Ensure proper alignment based on language
      if (contentLanguage === 'ar') {
           messageSenderLine.insertBefore(headerActionsContainer, messageSenderLine.firstChild);
      } else {
           messageSenderLine.appendChild(headerActionsContainer);
      }
  }
  if(headerActionsContainer) headerActionsContainer.innerHTML = '';

  if (!isInitialSystemMessage && senderName !== "System" && headerActionsContainer) {
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (type === 'user') {
        const editButton = document.createElement('button');
        editButton.className = 'message-edit-btn';
        editButton.setAttribute('aria-label', currentStrings.editMessage);
        editButton.innerHTML = `<span class="material-symbols-outlined">edit</span>`;
        editButton.dataset.messageId = domId;
        editButton.onclick = (e) => { e.stopPropagation(); handleEditUserMessage(domId); };
        headerActionsContainer.appendChild(editButton);
    } else if (type === 'ai') {
        const regenerateButton = document.createElement('button');
        regenerateButton.className = 'message-regenerate-btn';
        regenerateButton.setAttribute('aria-label', currentStrings.regenerateResponse);
        regenerateButton.innerHTML = `<span class="material-symbols-outlined">refresh</span>`;
        regenerateButton.dataset.messageId = domId;
        regenerateButton.onclick = (e) => { e.stopPropagation(); handleRegenerateAiResponse(domId); };
        headerActionsContainer.appendChild(regenerateButton);
    }
  }


  if (type === 'ai' && !isStreaming && !isInitialSystemMessage && senderName !== "System" && aiMessageContentDiv) {
      let actionsContainer = messageWrapper.querySelector('.message-actions-container') as HTMLDivElement | null;
      if (!actionsContainer) {
          actionsContainer = document.createElement('div');
          actionsContainer.className = 'message-actions-container';
          if (contentWrapperDiv && aiMessageContentDiv.parentNode === contentWrapperDiv) {
              contentWrapperDiv.appendChild(actionsContainer);
          } else {
               messageWrapper.appendChild(actionsContainer);
          }
      }
      actionsContainer.innerHTML = '';

      const copyButton = document.createElement('button');
      copyButton.className = 'message-action-btn copy-answer-btn';
      copyButton.innerHTML = `<span class="material-symbols-outlined">content_copy</span> Copy Answer`;
      copyButton.onclick = () => {
          const textToCopy = messageContentHolder.innerText;
          navigator.clipboard.writeText(textToCopy).then(() => {
              const originalText = copyButton.innerHTML;
              copyButton.innerHTML = `<span class="material-symbols-outlined">check_circle</span> Copied!`;
              copyButton.disabled = true;
              setTimeout(() => {
                  copyButton.innerHTML = originalText;
                  copyButton.disabled = false;
              }, 2000);
          }).catch(err => console.error('Failed to copy text: ', err));
      };
      actionsContainer.appendChild(copyButton);

      if (messageType === 'text') {
          const continueButton = document.createElement('button');
          continueButton.className = 'message-action-btn continue-generation-btn';
          continueButton.innerHTML = `<span class="material-symbols-outlined">play_arrow</span> Continue`;
          continueButton.onclick = () => {
              if (chatInput) {
                  chatInput.value = "Please continue generating from where you left off with your previous response.";
                  handleSendMessage();
              }
          };
          actionsContainer.appendChild(continueButton);
      }


      const saveMemoryButton = document.createElement('button');
      saveMemoryButton.className = 'message-action-btn save-memory-btn';
      saveMemoryButton.innerHTML = `<span class="material-symbols-outlined">bookmark_add</span> Save to Memory`;
      saveMemoryButton.dataset.messageId = domId;
      saveMemoryButton.onclick = () => {
          const textToSave = (messageType === 'image' && imageData) ? `[Image: ${imageData.promptForImage}]` : textOrData;
          handleSaveToMemory(domId, textToSave, senderName , currentChatSessionId);
      };
      actionsContainer.appendChild(saveMemoryButton);


      if (messageType === 'text') {
          const exportPdfButton = document.createElement('button');
          exportPdfButton.className = 'message-action-btn export-pdf-btn';
          exportPdfButton.innerHTML = `<span class="material-symbols-outlined">picture_as_pdf</span> Export PDF`;
          exportPdfButton.onclick = () => {
              if (typeof window.html2pdf !== 'undefined') {
                  const elementToExport = messageContentHolder;
                  const filename = `nova-chat-${senderName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.pdf`;
                  window.html2pdf().from(elementToExport).set({
                      margin: [10, 10, 10, 10],
                      filename: filename,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  }).save();
              } else {
                  console.error("html2pdf library not found.");
                  alert("PDF export functionality is currently unavailable.");
              }
          };
          actionsContainer.appendChild(exportPdfButton);

          if (messageContentHolder.querySelector('table')) {
              const exportExcelButton = document.createElement('button');
              exportExcelButton.className = 'message-action-btn export-excel-btn';
              exportExcelButton.innerHTML = `<span class="material-symbols-outlined">backup_table</span> Export Excel`;
              exportExcelButton.onclick = () => {
                  if (typeof window.XLSX !== 'undefined') {
                      const tableElement = messageContentHolder.querySelector('table');
                      if (tableElement) {
                          const filename = `nova-chat-table-${Date.now()}.xlsx`;
                          const wb = window.XLSX.utils.table_to_book(tableElement);
                          window.XLSX.writeFile(wb, filename);
                      }
                  } else {
                      console.error("XLSX (SheetJS) library not found.");
                      alert("Excel export functionality is currently unavailable.");
                  }
              };
              actionsContainer.appendChild(exportExcelButton);
          }
      }

      const toolForThisChat = customTools.find(t => t.id === currentChatIsBasedOnTool);
      if (toolForThisChat && toolForThisChat.name === "Resume Builder" && textOrData.includes("<!-- START RESUME HTML -->")) {
          const resumeHtmlMatch = textOrData.match(/<!-- START RESUME HTML -->([\s\S]*?)<!-- END RESUME HTML -->/);
          if (resumeHtmlMatch && resumeHtmlMatch[1]) {
              const resumeHtmlContent = resumeHtmlMatch[1].trim();
              const downloadResumeBtn = document.createElement('button');
              downloadResumeBtn.className = 'message-action-btn resume-download-btn';
              downloadResumeBtn.innerHTML = `<span class="material-symbols-outlined">picture_as_pdf</span> Download Resume as PDF`;
              downloadResumeBtn.onclick = () => {
                  if (typeof window.html2pdf !== 'undefined') {
                      const filename = `Nova-Resume-${currentUser?.displayName || 'User'}-${Date.now()}.pdf`;
                      const element = document.createElement('div');
                      element.innerHTML = resumeHtmlContent;
                      const style = document.createElement('style');
                      style.innerHTML = `
                          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                          h1, h2, h3 { color: #19e5c6; margin-bottom: 0.5em; }
                          h1 { font-size: 24px; border-bottom: 2px solid #19e5c6; padding-bottom: 0.3em; }
                          h2 { font-size: 18px; margin-top: 1em; }
                          h3 { font-size: 16px; font-style: italic; }
                          ul { list-style-type: disc; margin-left: 20px; }
                          p { margin-bottom: 0.5em; }
                          .section { margin-bottom: 1.5em; }
                          .contact-info { margin-bottom: 1em; text-align: center; }
                      `;
                      element.prepend(style);
                      window.html2pdf().from(element).set({
                          margin: 15,
                          filename: filename,
                          image: { type: 'jpeg', quality: 0.98 },
                          html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
                          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                      }).save();
                  } else {
                      console.error("html2pdf library not found.");
                      alert("PDF export functionality is currently unavailable.");
                  }
              };
              actionsContainer.appendChild(downloadResumeBtn);
          }
      }
  }


  if (!isStreaming && !isInitialSystemMessage && senderName !== "System") {
    let textForHistory = textOrData;
    if (messageType === 'image' && imageData) {
        textForHistory = `[AI Image for: ${imageData.promptForImage}]`;
    } else if (userUploadedFile) {
        textForHistory = `[File: ${userUploadedFile.name}] ${textOrData}`;
    }

    const msgToSave: ChatMessage = {
        id: domId,
        sender: senderName,
        text: textForHistory,
        timestamp: Date.now(),
        sources: (type === 'ai' && messageType === 'text' && sources) ? sources : null,
        detectedLanguage: contentLanguage,
        messageType: messageType,
        imageData: (messageType === 'image' && imageData) ? imageData : null,
        userUploadedFile: userUploadedFile ? userUploadedFile : null
    };


    if (currentChatSessionId) {
      const session = chatSessions.find(s => s.id === currentChatSessionId);
      if (session) {
        const existingMsgIndex = session.messages.findIndex(m => m.id === msgToSave.id);
        if (existingMsgIndex !== -1) {
            session.messages[existingMsgIndex] = msgToSave;
        } else {
            session.messages.push(msgToSave);
        }
        session.lastUpdated = Date.now();
      }
    } else if (type === 'user' && currentUser) {
      currentChatSessionId = `session-${Date.now()}`;
      const toolForTitle = currentChatIsBasedOnTool ? customTools.find(t=>t.id === currentChatIsBasedOnTool) : null;
      const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
      const newSession: ChatSession = {
        id: currentChatSessionId,
        title: currentChatIsBasedOnTool ? `Tool: ${toolForTitle?.name || 'Unnamed Tool'}` : currentStrings.navNewChat,
        messages: [msgToSave],
        lastUpdated: Date.now(),
        aiToneUsed: currentAiTone,
        basedOnToolId: currentChatIsBasedOnTool || undefined
      };
      chatSessions.push(newSession);
      if (chatScreenTitleElement) chatScreenTitleElement.textContent = newSession.title;
    }
    saveChatSessionsToFirebase();
    if (currentScreen === CHAT_LIST_SCREEN_ID || currentScreen === CHAT_SCREEN_ID) {
        renderChatList();
    }
  }

  scrollToBottomChat();
  return messageWrapper;
}

function escapeHTML(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function renderMarkdownToHTML(markdownText: string): string {
    let html = markdownText;

    const codeBlockPlaceholders: string[] = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, rawCode) => {
        const languageClass = lang ? `language-${lang.trim()}` : '';
        const trimmedRawCode = rawCode.trim();
        const escapedCodeForDisplay = escapeHTML(trimmedRawCode);
        const escapedCodeForDataAttr = escapeHTML(trimmedRawCode);

        const toolbarHtml = `
            <div class="code-block-toolbar">
                ${lang ? `<span class="code-block-lang">${escapeHTML(lang.trim())}</span>` : ''}
                <button class="copy-code-btn" data-code="${escapedCodeForDataAttr}" aria-label="Copy code snippet">
                    <span class="material-symbols-outlined">content_copy</span>
                    <span>Copy</span>
                </button>
                <button class="preview-code-btn" data-code="${escapedCodeForDataAttr}" aria-label="Preview code snippet in canvas">
                    <span class="material-symbols-outlined">play_circle</span>
                    <span>Preview</span>
                </button>
            </div>`;

        const codeBlockHtml = `
            <div class="code-block-wrapper">
                ${toolbarHtml}
                <pre class="${languageClass}"><code class="${languageClass}">${escapedCodeForDisplay}</code></pre>
            </div>`;
        codeBlockPlaceholders.push(codeBlockHtml);
        return `%%CODEBLOCK_WRAPPER_${codeBlockPlaceholders.length - 1}%%`;
    });


    const inlineCodes: string[] = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        inlineCodes.push(`<code>${escapeHTML(code)}</code>`);
        return `%%INLINECODE_${inlineCodes.length - 1}%%`;
    });

    html = escapeHTML(html);

    html = html.replace(/^\|(.+)\|\r?\n\|([\s\S]+?)\|\r?\n((?:\|.*\|\r?\n?)*)/gm, (tableMatch) => {
        const rows = tableMatch.trim().split(/\r?\n/);
        if (rows.length < 2) return tableMatch;

        const headerCells = rows[0].slice(1, -1).split('|').map(s => s.trim());
        const separatorLine = rows[1].slice(1, -1).split('|').map(s => s.trim());

        if (headerCells.length !== separatorLine.length || !separatorLine.every(s => /^\s*:?-+:?\s*$/.test(s))) {
            return tableMatch;
        }

        let tableHtml = '<div class="table-wrapper"><table class="markdown-table">';
        tableHtml += '<thead><tr>';
        headerCells.forEach(header => {
            tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead>';

        tableHtml += '<tbody>';
        for (let i = 2; i < rows.length; i++) {
            if (!rows[i].trim().startsWith('|') || !rows[i].trim().endsWith('|')) continue;
            tableHtml += '<tr>';
            rows[i].slice(1, -1).split('|').forEach(cell => {
                tableHtml += `<td>${cell.trim()}</td>`;
            });
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table></div>';
        return tableHtml;
    });


    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/^\s*&gt; (.*$)/gim, '<p>%%BLOCKQUOTE_LINE%%$1</p>');
    html = html.replace(/(<p>%%BLOCKQUOTE_LINE%%.*?<\/p>)+/g, (match) => {
        return `<blockquote>${match.replace(/<p>%%BLOCKQUOTE_LINE%%(.*?)<\/p>/g, '<p>$1</p>')}</blockquote>`;
    });
    html = html.replace(/<\/blockquote>\s*<blockquote>/gim, '</blockquote><blockquote>');

    html = html.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, '<hr>');

    html = html.replace(/^\s*([*\-+]) +(.*)/gm, (match, bullet, item) => `%%UL_START%%<li>${item.trim()}</li>`);
    html = html.replace(/(%%UL_START%%(<li>.*?<\/li>)+)/g, '<ul>$2</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    html = html.replace(/^\s*(\d+)\. +(.*)/gm, (match, number, item) => `%%OL_START%%<li>${item.trim()}</li>`);
    html = html.replace(/(%%OL_START%%(<li>.*?<\/li>)+)/g, '<ol>$2</ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, '');


    html = html.split(/\r?\n/).map(paragraph => {
      paragraph = paragraph.trim();
      if (!paragraph) return '';
      if (paragraph.match(/^<\/?(h[1-6]|ul|ol|li|blockquote|hr|table|div class="table-wrapper"|div class="code-block-wrapper")/) ||
          paragraph.startsWith('%%CODEBLOCK_WRAPPER_') ||
          paragraph.startsWith('%%INLINECODE_') ||
          paragraph.startsWith('%%UL_START%%') || paragraph.startsWith('%%OL_START%%')) {
          return paragraph;
      }
      return `<p>${paragraph}</p>`;
    }).join('');

    html = html.replace(/%%UL_START%%<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');
    html = html.replace(/%%OL_START%%<li>(.*?)<\/li>/g, '<ol><li>$1</li></ol>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        const decodedText = text;
        const decodedUrl = url.replace(/&amp;/g, '&');
        const classAttr = (decodedUrl.startsWith('http:') || decodedUrl.startsWith('https:')) ? `class="webview-link" data-url="${escapeHTML(decodedUrl)}"` : '';
        return `<a href="${escapeHTML(decodedUrl)}" ${classAttr} target="_blank" rel="noopener noreferrer">${decodedText}</a>`;
    });

    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');
    html = html.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, '$1<em>$2</em>$3');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    html = html.replace(/%%INLINECODE_(\d+)%%/g, (match, index) => inlineCodes[parseInt(index)]);
    html = html.replace(/%%CODEBLOCK_WRAPPER_(\d+)%%/g, (match, index) => codeBlockPlaceholders[parseInt(index)]);

    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><br\s*\/?>\s*<\/p>/g, '');
    html = html.replace(/(\r?\n)+/g, '\n');
    html = html.replace(/\n(<\/(?:ul|ol|li|h[1-6]|p|blockquote|hr|pre|table|div)>)/g, '$1');
    html = html.replace(/(<(?:ul|ol|li|h[1-6]|p|blockquote|hr|pre|table|div).*?>)\n/g, '$1');

    return html.trim();
}


async function handleSendMessage(isRegeneration = false, regeneratedAiMessageId: string | null = null) {
  if (!currentUser) {
      displaySystemMessage("Please sign in to send messages.", CHAT_SCREEN_ID);
      showScreen(SIGNIN_SCREEN_ID);
      return;
  }
  if ((isLoading || isImageLoading) && !isRegeneration) return;
  if (!chatInput) return;

  let userMessageText = chatInput.value.trim();
  let currentStagedFile = stagedFile;
  const currentStrings = uiStrings[currentLanguage] || uiStrings.en;

  if (!userMessageText && !currentStagedFile && !editingUserMessageId) {
    if (chatInput) chatInput.placeholder = currentStrings.chatInputPlaceholder;
    return;
  }
  if (chatInput && !editingUserMessageId) chatInput.placeholder = currentStrings.chatInputPlaceholder;


  if (!geminiInitialized && !initializeGeminiSDK()) {
    displaySystemMessage("AI Service is not ready. Message not sent.", CHAT_SCREEN_ID);
    return;
  }

  const isEditing = !!editingUserMessageId;
  let userMessageId = isEditing && editingUserMessageId ? editingUserMessageId : `msg-user-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;
  let fullMessageForDisplay = userMessageText;

  const geminiMessageParts: Part[] = [];

  if (currentStagedFile && !isEditing) {
    if (currentStagedFile.type === 'image') {
        geminiMessageParts.push({
            inlineData: {
                mimeType: currentStagedFile.mimeType,
                data: currentStagedFile.content
            }
        });
        fullMessageForDisplay = `[Image: ${currentStagedFile.name}] ${userMessageText}`.trim();
    } else {
        geminiMessageParts.push({ text: `Context from file "${currentStagedFile.name}":\n${currentStagedFile.content}` });
         fullMessageForDisplay = `[File: ${currentStagedFile.name}] ${userMessageText}`.trim();
    }
    if (userMessageText) {
        geminiMessageParts.push({ text: userMessageText });
    } else if (currentStagedFile.type === 'image') {
        geminiMessageParts.push({ text: "Describe this image."});
        if (!userMessageText) fullMessageForDisplay = `[Image: ${currentStagedFile.name}] Describe this image.`;
    } else {
         geminiMessageParts.push({ text: "What can you tell me about the content of this file?" });
         if (!userMessageText) fullMessageForDisplay = `[File: ${currentStagedFile.name}] What about this file?`;
    }
  } else {
      geminiMessageParts.push({ text: userMessageText });
  }


  const userMessageLang = detectMessageLanguage(userMessageText || (currentStagedFile?.name || ""));

  if (isEditing && editingUserMessageId) {
    const existingMsgDiv = document.getElementById(editingUserMessageId);
    const msgTextElement = existingMsgDiv?.querySelector('.message-text');
    if (msgTextElement) msgTextElement.innerHTML = renderMarkdownToHTML(userMessageText);

    const session = chatSessions.find(s => s.id === currentChatSessionId);
    if (session) {
        const msgIndex = session.messages.findIndex(m => m.id === editingUserMessageId);
        if (msgIndex !== -1) {
            session.messages[msgIndex].text = userMessageText;
            session.messages[msgIndex].detectedLanguage = userMessageLang;
            session.messages.splice(msgIndex + 1);

            let nextSibling = existingMsgDiv?.nextElementSibling;
            while(nextSibling && (nextSibling.classList.contains('chat-message-wrapper') || nextSibling.classList.contains('chat-message-external-sources'))) {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                toRemove.remove();
            }
        }
        const historyForEdit: Content[] = session.messages
            .filter((msg, idx) => msg.sender !== 'System' && idx <= msgIndex)
            .map(msg => ({
                role: (msg.sender === "User") ? "user" : "model",
                parts: [{text: msg.text.replace(/\[(Image|File):.*?\]\s*/, '')}]
            }));

        let systemInstructionText;
        if (currentChatIsBasedOnTool) {
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            if (tool) {
                systemInstructionText = tool.instructions;
                if (tool.knowledge) systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
                systemInstructionText += getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false);
            } else {
                systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
            }
        } else {
            systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
        }
        geminiChat = ai.chats.create({ model: TEXT_MODEL_NAME, history: historyForEdit.slice(0, -1), config: { systemInstruction: systemInstructionText } });
    }
    if (chatInput) chatInput.value = "";
    editingUserMessageId = null;
    if (sendButton) {
        const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
        if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
        sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
    }
     if (chatInput) chatInput.placeholder = currentStrings.chatInputPlaceholder;
  } else if (!isRegeneration) {
      if (currentChatIsBasedOnTool && !currentChatSessionId) {
            currentChatSessionId = `session-tool-${currentChatIsBasedOnTool}-${Date.now()}`;
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            const newSession: ChatSession = {
                id: currentChatSessionId,
                title: tool ? `Tool: ${tool.name}` : "Tool Chat",
                messages: [],
                lastUpdated: Date.now(),
                aiToneUsed: currentAiTone,
                basedOnToolId: currentChatIsBasedOnTool
            };
            chatSessions.push(newSession);
            if (chatScreenTitleElement) chatScreenTitleElement.textContent = newSession.title;
      } else if (!geminiChat || !currentChatSessionId) {
        let systemInstructionText;
        if (currentChatIsBasedOnTool) {
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            if (tool) {
                systemInstructionText = tool.instructions;
                if (tool.knowledge) systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
                systemInstructionText += getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false);
            } else {
                systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
            }
        } else {
            systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
        }
        geminiChat = ai.chats.create({
            model: TEXT_MODEL_NAME,
            config: { systemInstruction: systemInstructionText }
        });
         if (!currentChatSessionId) {
            currentChatSessionId = `session-${Date.now()}`;
            const newSession: ChatSession = {
                id: currentChatSessionId,
                title: currentStrings.navNewChat,
                messages: [],
                lastUpdated: Date.now(),
                aiToneUsed: currentAiTone,
            };
            chatSessions.push(newSession);
            if (chatScreenTitleElement) chatScreenTitleElement.textContent = newSession.title;
         }
      }
      appendMessage("User", fullMessageForDisplay, 'user', false, null, false, null, userMessageLang, userMessageId, 'text', undefined, currentStagedFile ? {name: currentStagedFile.name, type: currentStagedFile.type, isImage: currentStagedFile.type === 'image'} : null);
      if (chatInput) chatInput.value = "";
      stagedFile = null;
      updateStagedFilePreview();
  }


  disableChatInput(true, false);

  let aiMessageDivToUpdate: HTMLDivElement | null = isRegeneration && regeneratedAiMessageId ? document.getElementById(regeneratedAiMessageId) as HTMLDivElement : null;
  let fullResponseText = "";
  let isFirstAIMessageInNewChat = false;
  let groundingSources: ChatMessage['sources'] = null;
  let aiResponseLang: ChatMessage['detectedLanguage'] = 'unknown';
  const aiMessageId = isRegeneration && regeneratedAiMessageId ? regeneratedAiMessageId : `msg-ai-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;


  if (currentChatSessionId && !isEditing && !isRegeneration) {
    const session = chatSessions.find(s => s.id === currentChatSessionId);
    if (session && session.messages.filter(m => m.sender === 'Nova' || m.sender === 'Nova (Tool Mode)').length === 0) {
        isFirstAIMessageInNewChat = true;
    }
  }

  try {
    const perMessageConfig: GenerateContentParameters['config'] = {};
    let configApplied = false;

    if (internetSearchEnabled) {
        perMessageConfig.tools = [{googleSearch: {}},];
        configApplied = true;
    }

    if (TEXT_MODEL_NAME === 'gemini-2.5-flash-preview-04-17') {
      if (!deepThinkingEnabled && !advancedScientificModeEnabled && (voiceModeActive || currentCreativityLevel === 'focused')) {
        perMessageConfig.thinkingConfig = { thinkingBudget: 0 };
        configApplied = true;
      }
    }

    switch(currentCreativityLevel) {
        case 'focused': perMessageConfig.temperature = 0.2; configApplied = true; break;
        case 'balanced': perMessageConfig.temperature = 0.7; configApplied = true; break;
        case 'inventive': perMessageConfig.temperature = 1.0; configApplied = true; break;
    }

    const streamRequestPayload: GenerateContentParameters = {
        model: TEXT_MODEL_NAME, // Added model as per error 1863
        contents: { role: "user", parts: geminiMessageParts },
    };

    if (configApplied) {
        streamRequestPayload.config = perMessageConfig;
    }

    // Use { message: streamRequestPayload } structure based on guideline interpretation
    const result = await geminiChat.sendMessageStream({ message: streamRequestPayload } as any); // Using 'as any' to bypass strict SendMessageParameters if it's a union type.
                                                                                                // The actual type of parameter for sendMessageStream can be nuanced.
                                                                                                // If SendMessageParameters is an interface like { message: GenerateContentParameters }, 'as any' is not needed.
                                                                                                // This depends on the exact definition from @google/genai.
                                                                                                // For now, assuming the guideline {message: ...} is what the runtime expects.


    let tempAiMessageDiv: HTMLDivElement | null = aiMessageDivToUpdate;

    for await (const chunk of result) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullResponseText += chunkText;
        if (aiResponseLang === 'unknown' && fullResponseText.length > 10) {
            aiResponseLang = detectMessageLanguage(fullResponseText);
        }
        const aiSenderName: ChatMessage['sender'] = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";
        if (!tempAiMessageDiv) {
          tempAiMessageDiv = appendMessage(aiSenderName, fullResponseText, 'ai', true, null, false, null, aiResponseLang, aiMessageId, 'text', null, null);
        } else {
          appendMessage(aiSenderName, fullResponseText, 'ai', true, tempAiMessageDiv, false, null, aiResponseLang, aiMessageId, 'text', null, null);
        }
        scrollToBottomChat();
      }

      if (chunk.candidates && chunk.candidates[0]?.groundingMetadata?.groundingChunks) {
          const newSources = chunk.candidates[0].groundingMetadata.groundingChunks
              .map(gc => ({ uri: gc.web?.uri || gc.retrievedContext?.uri || '', title: gc.web?.title || gc.retrievedContext?.uri || '' }))
              .filter(s => s.uri);

          if (newSources.length > 0) {
              groundingSources = [...(groundingSources || []), ...newSources].reduce((acc, current) => {
                  if (!acc.find(item => item.uri === current.uri)) { acc.push(current); }
                  return acc;
              }, [] as {uri:string, title:string}[]);

              if (tempAiMessageDiv && groundingSources && groundingSources.length > 0) {
                const aiSenderName: ChatMessage['sender'] = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";
                appendMessage(aiSenderName, fullResponseText, 'ai', true, tempAiMessageDiv, false, groundingSources, aiResponseLang, aiMessageId, 'text', null, null);
              }
              if (processLogVisible && groundingSources && groundingSources.length > 0) {
                    newSources.forEach(source => addProcessLogEntry(`Found source: ${source.title || source.uri}`, 'source', source.uri));
              }
          }
      }
    }

    if (ttsEnabled && fullResponseText) {
        const textForSpeech = fullResponseText
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<p.*?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<[^>]+(>|$)/g, "")
            .replace(/\n\s*\n/g, "\n")
            .trim();
        speak(textForSpeech, true, aiResponseLang);
    }

    if (fullResponseText && currentChatSessionId) {
        const session = chatSessions.find(s => s.id === currentChatSessionId);
        if (session) {
            const aiSenderName: ChatMessage['sender'] = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";
             if (tempAiMessageDiv) {
                appendMessage(aiSenderName, fullResponseText, 'ai', false, tempAiMessageDiv, false, groundingSources, aiResponseLang, aiMessageId, 'text', null, null);
            } else {
                appendMessage(aiSenderName, fullResponseText, 'ai', false, null, false, groundingSources, aiResponseLang, aiMessageId, 'text', null, null);
            }

            if (isFirstAIMessageInNewChat && !session.basedOnToolId) {
                const userMsgForTitle = session.messages.find(m => m.sender === 'User')?.text || fullMessageForDisplay;
                const newTitle = await generateChatTitle(userMsgForTitle, fullResponseText);
                session.title = newTitle;
                if(chatScreenTitleElement) chatScreenTitleElement.textContent = newTitle;
                 saveChatSessionsToFirebase();
                 renderChatList();
            }
            if (!session.basedOnToolId && !advancedScientificModeEnabled) {
                 await extractAndStoreUserInfo(session);
            }
        }
    }

  } catch (error: any) {
    console.error("Error sending message to Gemini:", error);
    let errorMessage = "Sorry, I encountered an error processing your request. Please try again.";
    if (error && error.message) {
        if (error.message.includes("API key not valid")) {
            errorMessage = "There's an issue with the API configuration. Please contact support.";
        } else if (error.message.toLowerCase().includes("safety") || error.message.includes(" हिंसात्मक ")) {
             errorMessage = "Your request could not be processed due to safety guidelines. Please rephrase your message.";
        }
    }

    const errLang = detectMessageLanguage(errorMessage);
    const errorMsgId = `err-${aiMessageId}`;
    const aiSenderName: ChatMessage['sender'] = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";

    appendMessage(aiSenderName, errorMessage, 'ai', false, null, true, null, errLang, errorMsgId, 'text', null, null);

    if (ttsEnabled) speak(errorMessage, false, errLang);
  } finally {
    disableChatInput(false, false);
    if(chatInput && !voiceModeActive) {
        chatInput.focus();
    }
    else if (voiceModeActive && !window.speechSynthesis.speaking && !isListening && currentScreen === CHAT_SCREEN_ID) {
         handleMicInput();
    }
  }
}


async function handleGenerateImageInChat() {
    if (!currentUser) {
      displaySystemMessage("Please sign in to generate images.", CHAT_SCREEN_ID);
      showScreen(SIGNIN_SCREEN_ID);
      return;
    }
    if (isLoading || isImageLoading || !chatInput) return;
    const prompt = chatInput.value.trim();
    if (!prompt) {
        displaySystemMessage("Please enter a prompt for the image.", CHAT_SCREEN_ID, 'en');
        return;
    }

    if (!geminiInitialized && !initializeGeminiSDK()) {
      displaySystemMessage("AI Service not ready for image generation.", CHAT_SCREEN_ID, 'en');
      return;
    }

    const userMessageLang = detectMessageLanguage(prompt);
    const userMessageId = `msg-user-imgprompt-${Date.now()}`;
    appendMessage("User", prompt, 'user', false, null, false, null, userMessageLang, userMessageId, 'text', null, null);
    chatInput.value = "";
    disableChatInput(false, true);

    const aiImageId = `msg-ai-img-${Date.now()}`;

    try {
        const response = await ai.models.generateImages({
            model: IMAGE_MODEL_NAME,
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: "1:1" },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const imgData = response.generatedImages[0];
            const imageDataPayload: ChatMessage['imageData'] = {
                base64: imgData.image.imageBytes,
                mimeType: imgData.image.mimeType || 'image/jpeg',
                promptForImage: prompt
            };

            appendMessage("Nova", "", 'ai', false, null, false, null, 'en', aiImageId, 'image', imageDataPayload, null);

            if (currentChatSessionId) {
                const session = chatSessions.find(s => s.id === currentChatSessionId);
                if (session) {
                    const aiImageMessageForHistory: ChatMessage = {
                        id: aiImageId,
                        sender: 'Nova',
                        text: `[AI generated image for prompt: ${prompt.substring(0,50)}...]`,
                        timestamp: Date.now(),
                        messageType: 'image',
                        imageData: imageDataPayload,
                        detectedLanguage: 'en'
                    };
                    session.messages.push(aiImageMessageForHistory);
                    session.lastUpdated = Date.now();
                    saveChatSessionsToFirebase();
                    renderChatList();
                }
            } else {
                const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
                currentChatSessionId = `session-img-${Date.now()}`;
                const newSession: ChatSession = {
                    id: currentChatSessionId,
                    title: `Image: ${prompt.substring(0,20)}...`,
                    messages: [
                        { id: userMessageId, sender: 'User', text: prompt, timestamp: Date.now()-100, detectedLanguage: userMessageLang, messageType: 'text', sources: null, imageData: null, userUploadedFile: null},
                        { id: aiImageId, sender: 'Nova', text: `[AI image for: ${prompt.substring(0,50)}...]`, timestamp: Date.now(), messageType: 'image', imageData: imageDataPayload, detectedLanguage: 'en', sources: null, userUploadedFile: null }
                    ],
                    lastUpdated: Date.now(),
                    aiToneUsed: currentAiTone,
                };
                chatSessions.push(newSession);
                if (chatScreenTitleElement) chatScreenTitleElement.textContent = newSession.title;
                saveChatSessionsToFirebase();
                renderChatList();
            }
        } else {
            displaySystemMessage("Sorry, I couldn't generate an image for that prompt. Please try a different prompt or check the image model.", CHAT_SCREEN_ID, 'en');
        }

    } catch (error: any) {
        console.error("Error generating image in chat:", error);
        let errMsg = "Failed to generate image. Please try again.";
        if (error instanceof Error) errMsg = `Image Generation Error: ${error.message}`;
        if (error.message && (error.message.toLowerCase().includes("safety") || error.message.includes("प्रोम्प्ट में मौजूद नहीं किया जा सका"))) {
            errMsg = "The image could not be generated due to safety guidelines. Please try a different prompt.";
        }
        displaySystemMessage(errMsg, CHAT_SCREEN_ID, 'en');
    } finally {
        disableChatInput(false, false);
        if (chatInput && !voiceModeActive) chatInput.focus();
    }
}

// --- END OF CORE CHAT AND GEMINI FUNCTIONS ---


// --- START OF PORTED/NEWLY ADDED FUNCTIONS (Utilities, Event Handlers, etc.) ---

function updateStagedFilePreview() {
    const previewContainer = document.getElementById('staged-file-preview-container');
    if (stagedFilePreviewElement && previewContainer) {
        const fileNameSpan = stagedFilePreviewElement.querySelector('.staged-file-name');
        const fileTypeSpan = stagedFilePreviewElement.querySelector('.staged-file-type');

        if (stagedFile) {
            previewContainer.style.display = 'block'; // Show container
            stagedFilePreviewElement.style.display = 'flex'; // Show inner preview
            if (fileNameSpan) fileNameSpan.textContent = stagedFile.name;
            if (fileTypeSpan) fileTypeSpan.textContent = `Type: ${stagedFile.type}`;

            if (stagedFileClearButton) {
                stagedFileClearButton.style.display = 'inline-block';
                stagedFileClearButton.onclick = () => {
                    stagedFile = null;
                    updateStagedFilePreview();
                    if (chatInput) chatInput.focus();
                };
            }
        } else {
            previewContainer.style.display = 'none'; // Hide container
            stagedFilePreviewElement.style.display = 'none'; // Hide inner preview
            if (stagedFileClearButton) {
                stagedFileClearButton.style.display = 'none';
            }
        }
    }
}

function setCodeCanvasView(mode: 'code' | 'preview') {
    codeCanvasViewMode = mode;
    if (!codeCanvasTextarea || !codeCanvasInlinePreviewIframe || !codeCanvasToggleViewButton || !codeCanvasEnterFullscreenButton || !codeEditorWrapper) return;
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (mode === 'preview') {
        codeEditorWrapper.style.display = 'none';
        if(codeCanvasInlinePreviewIframe) codeCanvasInlinePreviewIframe.style.display = 'block';
        if(codeCanvasToggleViewButton) codeCanvasToggleViewButton.textContent = currentStrings.codeCanvasShowCode;
        if(codeCanvasEnterFullscreenButton) codeCanvasEnterFullscreenButton.classList.remove('hidden');
    } else { // 'code'
        codeEditorWrapper.style.display = 'flex'; // Changed to flex to match HTML structure
        if(codeCanvasInlinePreviewIframe) codeCanvasInlinePreviewIframe.style.display = 'none';
        if(codeCanvasToggleViewButton) codeCanvasToggleViewButton.textContent = currentStrings.codeCanvasShowPreview;
        if(codeCanvasEnterFullscreenButton) codeCanvasEnterFullscreenButton.classList.add('hidden');
        if(codeCanvasTextarea) codeCanvasTextarea.focus();
    }
}

function handleMicInput() {
    if (!WebSpeechRecognition) {
        alert("Speech recognition is not supported by your browser.");
        return;
    }
    if (isListening) {
        if (recognition) recognition.stop();
        return;
    }
    try {
        if (window.speechSynthesis.speaking) {
            manualTTScancelForMic = true;
            window.speechSynthesis.cancel();
        }
        if (recognition) {
            recognition.lang = currentLanguage === 'ar' ? 'ar-SA' : (navigator.language || 'en-US');
            recognition.start();
        }
    } catch (e: any) {
        console.error("Speech recognition start error:", e);
        if (e instanceof Error && e.name === 'InvalidStateError' && !isListening) {
        } else {
            alert("Could not start voice recognition. Please check microphone permissions.");
        }
        micButtonContainer?.classList.remove('listening');
        micButton?.querySelector('.mic-listening-indicator')?.classList.remove('animate-ping', 'opacity-100'); // Updated classes
        isListening = false;
         if(!(e instanceof Error && e.name === 'InvalidStateError')) {
           manualTTScancelForMic = false;
         }
    }
}

function addProcessLogEntry(text: string, type: 'info' | 'source' | 'error' = 'info', url?: string) {
    if (!processLogListElement) return;
    const li = document.createElement('li');
    if (type === 'source' && url) {
        li.classList.add('source-entry');
        const a = document.createElement('a');
        a.href = url;
        a.textContent = text;
        a.className = 'webview-link';
        a.dataset.url = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        li.appendChild(a);
    } else {
        li.textContent = text;
    }
    if (type === 'error') li.style.color = 'red';
    processLogListElement.appendChild(li);
    processLogListElement.scrollTop = processLogListElement.scrollHeight;
}

function clearProcessLog() {
    if (processLogListElement) processLogListElement.innerHTML = '';
}


function startSimulatedProcessLog() {
    if (!processLogVisible || (!deepThinkingEnabled && !internetSearchEnabled && !advancedScientificModeEnabled)) {
        if (simulatedProcessInterval) clearInterval(simulatedProcessInterval);
        simulatedProcessInterval = undefined;
        return;
    }
    clearProcessLog();

    const steps: string[] = [];
    if(advancedScientificModeEnabled) steps.push("Initiating advanced scientific research protocol...", "Defining research scope...", "Formulating hypothesis (if applicable)...", "Planning paper structure (Abstract, Intro, Lit Review, Methods, etc.)...", "Gathering preliminary data from knowledge base...");
    if (internetSearchEnabled) steps.push("Formulating search queries...", "Searching the web...", "Reviewing search results...");
    if (deepThinkingEnabled && !advancedScientificModeEnabled) steps.push("Accessing knowledge base...", "Analyzing information...", "Considering multiple perspectives...", "Synthesizing insights...");

    if (stagedFile) {
        steps.unshift(`Analyzing ${stagedFile.type}: ${stagedFile.name}...`, "Extracting content...");
    }

    if (steps.length === 0) steps.push("Processing your request...");
    steps.push("Generating response...");

    let currentStep = 0;
    if (steps.length > 0) {
      addProcessLogEntry(steps[currentStep++]);
    }

    simulatedProcessInterval = window.setInterval(() => {
        if (currentStep < steps.length) {
            addProcessLogEntry(steps[currentStep++]);
        } else {
            stopSimulatedProcessLog();
        }
    }, 1200 + Math.random() * 500);
}

function stopSimulatedProcessLog() {
    if (simulatedProcessInterval) {
        clearInterval(simulatedProcessInterval);
        simulatedProcessInterval = undefined;
    }
}

function openInAppImageViewer(imageUrl: string) {
    if (imageViewerScreenElement && imageViewerImg) {
        imageViewerImg.src = imageUrl;
        showScreen(IMAGE_VIEWER_SCREEN_ID);
    } else {
        alert(`Image viewer placeholder: ${imageUrl}`);
    }
}

function downloadImageWithBase64(base64Data: string, mimeType: string, filename: string) {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function speak(text: string, isAiMessageForVoiceMode: boolean, lang: 'en' | 'ar' | 'unknown' = 'en') {
    if (!ttsEnabled || !window.speechSynthesis) {
        if (voiceModeActive && isAiMessageForVoiceMode && !isListening && currentScreen === CHAT_SCREEN_ID) {
            handleMicInput();
        }
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang === 'ar' ? 'ar-SA' : (lang === 'en' ? 'en-US' : (currentLanguage === 'ar' ? 'ar-SA' : navigator.language || 'en-US'));
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.lang === targetLang);
    if (!selectedVoice && targetLang.includes('-')) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(targetLang.split('-')[0]));
    }
     if (!selectedVoice && targetLang === 'ar-SA') {
        selectedVoice = voices.find(voice => voice.lang.startsWith('ar'));
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn(`TTS voice for lang ${targetLang} not found. Using browser default.`);
    }

    utterance.onend = () => {
        if (manualTTScancelForMic) {
            manualTTScancelForMic = false;
            return;
        }
        if (ttsEnabled && voiceModeActive && isAiMessageForVoiceMode && !isListening && currentScreen === CHAT_SCREEN_ID) {
            handleMicInput();
        }
    };

    utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error, "for language:", utterance.lang);
        if (manualTTScancelForMic) {
            manualTTScancelForMic = false;
            return;
        }
        if (event.error === 'interrupted') {
            return;
        }
        if (event.error === 'language-unavailable' || event.error === 'voice-unavailable') {
            displaySystemMessage(`Voice for ${targetLang} is not available on your device. TTS for this message is skipped.`, CHAT_SCREEN_ID, 'en');
        }
        if (ttsEnabled && voiceModeActive && isAiMessageForVoiceMode && !isListening && currentScreen === CHAT_SCREEN_ID) {
            handleMicInput();
        }
    };

    window.speechSynthesis.speak(utterance);
}


function renderCodeToIframe() {
    if (codeCanvasTextarea && codeCanvasInlinePreviewIframe) {
        const codeToRun = codeCanvasTextarea.value;
        codeCanvasInlinePreviewIframe.srcdoc = codeToRun;
    }
}

function renderCodeToIframeDebounced() {
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
        renderCodeToIframe();
    }, 500);
}


function openInAppWebView(url: string) {
    if (webviewScreenElement && webviewFrame && webviewTitle && webviewLoading) {
        webviewTitle.textContent = "Loading...";
        webviewFrame.src = 'about:blank';
        if(webviewLoading) webviewLoading.style.display = 'flex'; // Changed to flex for centering
        if(webviewFrame) webviewFrame.style.display = 'none';
        showScreen(WEBVIEW_SCREEN_ID);

        webviewFrame.onload = () => {
            if (webviewLoading) webviewLoading.style.display = 'none';
            if (webviewFrame) webviewFrame.style.display = 'block';
            try {
                if (webviewTitle && webviewFrame.contentDocument) webviewTitle.textContent = webviewFrame.contentDocument.title || url;
                else if (webviewTitle) webviewTitle.textContent = url;
            } catch (e) {
                if (webviewTitle) webviewTitle.textContent = url;
            }
        };
        webviewFrame.onerror = () => {
            if (webviewLoading) webviewLoading.style.display = 'none';
            if (webviewFrame) webviewFrame.style.display = 'block';
            if (webviewTitle) webviewTitle.textContent = "Error Loading Page";
        };
        webviewFrame.src = url;
    } else {
        window.open(url, '_blank');
    }
}

function toggleProcessLogPanel(forceState?: boolean) {
    if (typeof forceState === 'boolean') {
        processLogVisible = forceState;
    } else {
        processLogVisible = !processLogVisible;
    }

    if (processLogPanelElement) {
        processLogPanelElement.classList.toggle('open', processLogVisible);
    }
    if (toggleProcessLogButtonElement) {
        toggleProcessLogButtonElement.classList.toggle('active', processLogVisible); // For styling if needed
        toggleProcessLogButtonElement.setAttribute('aria-expanded', String(processLogVisible));
    }
    saveSetting('processLogVisible', processLogVisible);

    if (processLogVisible && (deepThinkingEnabled || internetSearchEnabled || advancedScientificModeEnabled || stagedFile)) {
        startSimulatedProcessLog();
    } else {
        stopSimulatedProcessLog();
    }
}

function handleFileUpload(event: Event) {
    if (!currentUser) {
        displaySystemMessage("Please sign in to upload files.", CHAT_SCREEN_ID);
        showScreen(SIGNIN_SCREEN_ID);
        return;
    }
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const textBasedTypes = [
        'text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json',
        'application/xml', 'application/x-python-code', 'text/markdown', 'text/csv',
    ];
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
        displaySystemMessage(`File "${file.name}" is too large (max ${MAX_FILE_SIZE / (1024*1024)}MB).`, CHAT_SCREEN_ID);
        if (fileInputHidden) fileInputHidden.value = '';
        return;
    }


    const isTextFile = textBasedTypes.includes(file.type) ||
                       file.name.match(/\.(txt|html|css|js|json|xml|py|md|csv|log|yaml|yml|rtf|tsv|ini|cfg|conf|sh|bat|ps1|rb|java|c|cpp|h|hpp|cs|go|php|swift|kt|dart|rs|lua|pl|sql)$/i);
    const isImageFile = imageTypes.includes(file.type);

    if (isTextFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            stagedFile = {
                name: file.name,
                type: 'text',
                content: fileContent,
                mimeType: file.type || 'text/plain'
            };
            updateStagedFilePreview();
            displaySystemMessage(`Text file "${file.name}" is staged for analysis. Type your query and send.`, CHAT_SCREEN_ID);
        };
        reader.onerror = () => {
            displaySystemMessage(`Error reading file "${file.name}".`, CHAT_SCREEN_ID);
            stagedFile = null;
            updateStagedFilePreview();
        };
        reader.readAsText(file);
    } else if (isImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Content = (e.target?.result as string).split(',')[1];
            stagedFile = {
                name: file.name,
                type: 'image',
                content: base64Content,
                mimeType: file.type
            };
            updateStagedFilePreview();
            displaySystemMessage(`Image "${file.name}" is staged for analysis. Type your query and send.`, CHAT_SCREEN_ID);
        };
        reader.onerror = () => {
            displaySystemMessage(`Error reading image "${file.name}".`, CHAT_SCREEN_ID);
            stagedFile = null;
            updateStagedFilePreview();
        };
        reader.readAsDataURL(file);
    } else {
        displaySystemMessage(`File type "${file.type || 'unknown'}" (${file.name}) is not currently supported for direct analysis. Please try a common text or image file.`, CHAT_SCREEN_ID);
        stagedFile = null;
        updateStagedFilePreview();
    }

    if (fileInputHidden) {
        fileInputHidden.value = '';
    }
}

function displayGeneratedImages(imagesData: {base64: string, prompt: string, mimeType: string}[]) {
    if (!imageStudioGridElement) return;
    imageStudioGridElement.innerHTML = '';

    imagesData.forEach((imgData, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'image-studio-item';
        itemDiv.tabIndex = 0;

        const imgElement = document.createElement('img');
        const imageSrc = `data:${imgData.mimeType};base64,${imgData.base64}`;
        imgElement.src = imageSrc;
        imgElement.alt = `Generated image for: ${imgData.prompt.substring(0, 50)} - ${index + 1}`;
        imgElement.onclick = () => openInAppImageViewer(imageSrc);

        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-btn-overlay';
        downloadButton.innerHTML = `<span class="material-symbols-outlined">download</span>`;
        downloadButton.setAttribute('aria-label', `Download image ${index + 1}`);
        downloadButton.onclick = (e) => {
            e.stopPropagation();
            downloadImageWithBase64(imgData.base64, imgData.mimeType, `nova-image-${imgData.prompt.substring(0,20).replace(/\s+/g, '_')}-${index + 1}.jpeg`);
        };

        itemDiv.appendChild(imgElement);
        itemDiv.appendChild(downloadButton);
        imageStudioGridElement.appendChild(itemDiv);
    });
}

async function handleGenerateImages() {
    if (!imageStudioPromptInput || !imageStudioGenerateButton || !imageStudioLoadingIndicator || !imageStudioGridElement || !imageStudioErrorMessageElement || !imageStudioDownloadAllButton) return;

    if (!currentUser) {
      if (imageStudioErrorMessageElement) {
        imageStudioErrorMessageElement.textContent = "Please sign in to generate images.";
        imageStudioErrorMessageElement.style.display = 'block';
      }
      return;
    }

    const prompt = imageStudioPromptInput.value.trim();
    if (!prompt) {
        if (imageStudioErrorMessageElement) {
          imageStudioErrorMessageElement.textContent = "Please enter a prompt for image generation.";
          imageStudioErrorMessageElement.style.display = 'block';
        }
        return;
    }

    if (!geminiInitialized && !initializeGeminiSDK()) {
        if (imageStudioErrorMessageElement) {
            imageStudioErrorMessageElement.textContent = "AI Service not available. Cannot generate images.";
            imageStudioErrorMessageElement.style.display = 'block';
        }
        return;
    }

    imageStudioGenerateButton.disabled = true;
    imageStudioGenerateButton.classList.add('opacity-50', 'cursor-not-allowed');
    if (imageStudioLoadingIndicator) imageStudioLoadingIndicator.style.display = 'flex';
    if (imageStudioGridElement) imageStudioGridElement.innerHTML = '';
    if (imageStudioErrorMessageElement) imageStudioErrorMessageElement.style.display = 'none';
    if (imageStudioDownloadAllButton) imageStudioDownloadAllButton.style.display = 'none';
    currentGeneratedImagesData = [];

    try {
        const imageGenConfig: any = { // Type any for flexibility, SDK might have specific type
            numberOfImages: 4,
            outputMimeType: 'image/jpeg',
        };

        if (imageStudioAspectRatioSelect && imageStudioAspectRatioSelect.value) {
            imageGenConfig.aspectRatio = imageStudioAspectRatioSelect.value;
        } else {
            imageGenConfig.aspectRatio = "1:1";
        }

        const selectedEngineModel = (imageStudioEngineSelect?.value === 'imagefx') ? IMAGE_MODEL_NAME : IMAGE_MODEL_NAME;

        const response = await ai.models.generateImages({
            model: selectedEngineModel,
            prompt: prompt,
            config: imageGenConfig,
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            currentGeneratedImagesData = response.generatedImages.map(imgInfo => ({
                base64: imgInfo.image.imageBytes,
                prompt: prompt,
                mimeType: imgInfo.image.mimeType || 'image/jpeg'
            }));
            displayGeneratedImages(currentGeneratedImagesData);
            if (imageStudioDownloadAllButton) imageStudioDownloadAllButton.style.display = 'flex';
        } else {
            if (imageStudioErrorMessageElement) {
                imageStudioErrorMessageElement.textContent = "No images were generated. Try a different prompt or check the model settings.";
                imageStudioErrorMessageElement.style.display = 'block';
            }
        }
    } catch (error: any) {
        console.error("Error generating images in Image Studio:", error);
        let errMsg = "Failed to generate images. Please try again.";
        if (error instanceof Error) {
            errMsg = `Error: ${error.message}`;
        } else if (typeof error === 'string') {
            errMsg = error;
        }
        if (error.message && (error.message.toLowerCase().includes("safety") || error.message.includes("प्रोम्प्ट में मौजूद नहीं किया जा सका"))) {
            errMsg = "The image could not be generated due to safety guidelines. Please try a different prompt.";
        }
        if (imageStudioErrorMessageElement) {
            imageStudioErrorMessageElement.textContent = errMsg;
            imageStudioErrorMessageElement.style.display = 'block';
        }
    } finally {
        if (imageStudioLoadingIndicator) imageStudioLoadingIndicator.style.display = 'none';
        if (imageStudioGenerateButton) {
            imageStudioGenerateButton.disabled = false;
            imageStudioGenerateButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
}

function setupEventListeners() {
    if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
    window.speechSynthesis.getVoices();

    aiToneRadios?.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            currentAiTone = target.value;
            saveSetting('aiTone', currentAiTone);
        });
    });

    darkModeToggle?.addEventListener('change', () => {
        if (!darkModeToggle) return;
        darkModeEnabled = darkModeToggle.checked;
        document.body.classList.toggle('light-mode', !darkModeEnabled);
        saveSetting('darkModeEnabled', darkModeEnabled);
    });

    ttsToggle?.addEventListener('change', () => {
        if (!ttsToggle) return;
        ttsEnabled = ttsToggle.checked;
        saveSetting('ttsEnabled', ttsEnabled);
        if (!ttsEnabled && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    });

    internetSearchToggle?.addEventListener('change', () => {
        if (!internetSearchToggle) return;
        internetSearchEnabled = internetSearchToggle.checked;
        if (popoverInternetSearchToggle) popoverInternetSearchToggle.checked = internetSearchEnabled;
        saveSetting('internetSearchEnabled', internetSearchEnabled);
    });
    popoverInternetSearchToggle?.addEventListener('change', () => {
        if (!popoverInternetSearchToggle || !internetSearchToggle) return;
        internetSearchEnabled = popoverInternetSearchToggle.checked;
        internetSearchToggle.checked = internetSearchEnabled;
        saveSetting('internetSearchEnabled', internetSearchEnabled);
    });


    deepThinkingToggle?.addEventListener('change', () => {
        if (!deepThinkingToggle) return;
        deepThinkingEnabled = deepThinkingToggle.checked;
        if(popoverDeepThinkingToggle) popoverDeepThinkingToggle.checked = deepThinkingEnabled;
        saveSetting('deepThinkingEnabled', deepThinkingEnabled);
    });
    popoverDeepThinkingToggle?.addEventListener('change', () => {
        if (!popoverDeepThinkingToggle || !deepThinkingToggle) return;
        deepThinkingEnabled = popoverDeepThinkingToggle.checked;
        deepThinkingToggle.checked = deepThinkingEnabled;
        saveSetting('deepThinkingEnabled', deepThinkingEnabled);
    });

    advancedScientificModeToggle?.addEventListener('change', () => {
        if (!advancedScientificModeToggle) return;
        advancedScientificModeEnabled = advancedScientificModeToggle.checked;
        if(popoverScientificModeToggle) popoverScientificModeToggle.checked = advancedScientificModeEnabled;
        saveSetting('advancedScientificModeEnabled', advancedScientificModeEnabled);
    });
    popoverScientificModeToggle?.addEventListener('change', () => {
        if (!popoverScientificModeToggle || !advancedScientificModeToggle) return;
        advancedScientificModeEnabled = popoverScientificModeToggle.checked;
        advancedScientificModeToggle.checked = advancedScientificModeEnabled;
        saveSetting('advancedScientificModeEnabled', advancedScientificModeEnabled);
    });


    creativityLevelSelect?.addEventListener('change', () => {
        if (!creativityLevelSelect) return;
        currentCreativityLevel = creativityLevelSelect.value as 'focused' | 'balanced' | 'inventive';
        saveSetting('currentCreativityLevel', currentCreativityLevel);
    });


    voiceModeToggle?.addEventListener('click', () => {
        if (!voiceModeToggle) return;
        voiceModeActive = !voiceModeActive;
        voiceModeToggle.classList.toggle('active', voiceModeActive);
        voiceModeToggle.setAttribute('aria-pressed', String(voiceModeActive));
        saveSetting('voiceModeActive', voiceModeActive);

        const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
        if (chatInput) {
            chatInput.disabled = voiceModeActive;
            chatInput.classList.toggle('opacity-50', voiceModeActive);
            chatInput.placeholder = voiceModeActive ? currentStrings.chatInputPlaceholderVoice : currentStrings.chatInputPlaceholder;
        }

        if (voiceModeActive) {
            if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
            if (!isListening) handleMicInput();
        } else {
            if (isListening && recognition) recognition.stop();
        }
    });

    toggleProcessLogButtonElement?.addEventListener('click', () => toggleProcessLogPanel());
    processLogCloseButtonElement?.addEventListener('click', () => toggleProcessLogPanel(false));

    advancedOptionsButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (advancedOptionsPopover) {
            const isVisible = advancedOptionsPopover.style.display === 'block';
            advancedOptionsPopover.style.display = isVisible ? 'none' : 'block';
            advancedOptionsButton.setAttribute('aria-expanded', String(!isVisible));
            if (!isVisible) {
                if (popoverDeepThinkingToggle) popoverDeepThinkingToggle.checked = deepThinkingEnabled;
                if (popoverInternetSearchToggle) popoverInternetSearchToggle.checked = internetSearchEnabled;
                if (popoverScientificModeToggle) popoverScientificModeToggle.checked = advancedScientificModeEnabled;
            }
        }
    });
    document.addEventListener('click', (event) => {
        if (advancedOptionsPopover && advancedOptionsButton &&
            !advancedOptionsPopover.contains(event.target as Node) &&
            !advancedOptionsButton.contains(event.target as Node)) {
            advancedOptionsPopover.style.display = 'none';
            advancedOptionsButton.setAttribute('aria-expanded', 'false');
        }
    });
    popoverUploadFileButton?.addEventListener('click', () => {
        fileInputHidden?.click();
        if (advancedOptionsPopover) advancedOptionsPopover.style.display = 'none';
         advancedOptionsButton?.setAttribute('aria-expanded', 'false');
    });
    popoverGenerateImageButton?.addEventListener('click', () => {
        handleGenerateImageInChat();
        if (advancedOptionsPopover) advancedOptionsPopover.style.display = 'none';
        advancedOptionsButton?.setAttribute('aria-expanded', 'false');
    });
    popoverCodeCanvasButton?.addEventListener('click', () => {
        showScreen(CODE_CANVAS_SCREEN_ID);
        setCodeCanvasView('code');
        if (advancedOptionsPopover) advancedOptionsPopover.style.display = 'none';
        advancedOptionsButton?.setAttribute('aria-expanded', 'false');
    });


    onboardingNextBtn?.addEventListener('click', () => {
      if (currentOnboardingStep < totalOnboardingSteps - 1) {
        currentOnboardingStep++;
        updateOnboardingUI();
      } else {
        localStorage.setItem('onboardingComplete', 'true');
        showScreen(SIGNIN_SCREEN_ID);
      }
    });
    onboardingSkipBtn?.addEventListener('click', () => {
      localStorage.setItem('onboardingComplete', 'true');
      showScreen(SIGNIN_SCREEN_ID);
    });

    signinButton?.addEventListener('click', handleSignIn);
    signupButton?.addEventListener('click', handleSignUp);
    logoutButton?.addEventListener('click', handleSignOut);
    viewMemoriesButton?.addEventListener('click', () => showScreen(MEMORIES_SCREEN_ID));
    memoriesBackButton?.addEventListener('click', () => showScreen(PROFILE_SCREEN_ID));

    chatListCreateToolButton?.addEventListener('click', () => showScreen(CREATE_TOOL_SCREEN_ID));
    createToolBackButton?.addEventListener('click', () => showScreen(CHAT_LIST_SCREEN_ID));
    saveToolButton?.addEventListener('click', handleSaveTool);


    document.getElementById('chat-list-new-chat-header-btn')?.addEventListener('click', createNewChatSession);

    sendButton?.addEventListener('click', () => {
        if (editingUserMessageId) {
            handleSendMessage();
        } else {
            handleSendMessage();
        }
    });
    chatInput?.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (editingUserMessageId) {
            handleSendMessage();
        } else {
            handleSendMessage();
        }
      }
    });
    chatInput?.addEventListener('input', () => {
        const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
        if (chatInput && sendButton) {
            const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
            if (editingUserMessageId && chatInput.value.trim() === "") {
                if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
                sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
            } else if (editingUserMessageId) {
                if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonUpdate;
                sendButton.setAttribute('aria-label', currentStrings.sendButtonUpdate);
            } else {
                if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
                sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
            }
        }
        if(chatInputActionsArea && chatInput) {
            chatInput.style.height = 'auto';
            const scrollHeight = chatInput.scrollHeight;
            const maxHeight = 128; // 8rem
            chatInput.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            chatInputActionsArea.style.alignItems = scrollHeight > 48 ? 'flex-end' : 'center';
        }
    });


    suggestedPromptButtons?.forEach(button => {
      button.addEventListener('click', () => {
        const promptText = button.textContent?.trim();
        if (promptText && chatInput) {
          chatInput.value = promptText;
          handleSendMessage();
        }
      });
    });
    micButton?.addEventListener('click', handleMicInput);
    fileInputHidden?.addEventListener('change', handleFileUpload);


    let previousScreenForSettings = CHAT_LIST_SCREEN_ID;
    document.getElementById('settings-back-btn')?.addEventListener('click', () => showScreen(previousScreenForSettings || CHAT_LIST_SCREEN_ID));
    document.getElementById('chat-back-btn')?.addEventListener('click', () => showScreen(CHAT_LIST_SCREEN_ID));
    document.getElementById('profile-back-btn')?.addEventListener('click', () => showScreen(previousScreenForSettings || CHAT_LIST_SCREEN_ID));

    document.getElementById('chat-settings-btn')?.addEventListener('click', () => {
        previousScreenForSettings = CHAT_SCREEN_ID;
        showScreen(SETTINGS_SCREEN_ID);
    });

    function handleNavClick(targetScreenId: string | null | undefined, currentActiveScreenBeforeNav: string) {
        if (!targetScreenId) return;

        if (!currentUser &&
            targetScreenId !== SIGNIN_SCREEN_ID &&
            targetScreenId !== ONBOARDING_SCREEN_ID &&
            targetScreenId !== SPLASH_SCREEN_ID) {
            showScreen(SIGNIN_SCREEN_ID);
            return;
        }

        if (targetScreenId === PROFILE_SCREEN_ID) {
             if (currentActiveScreenBeforeNav !== PROFILE_SCREEN_ID && currentActiveScreenBeforeNav !== MEMORIES_SCREEN_ID) {
                 previousScreenForSettings = currentActiveScreenBeforeNav;
             }
             showScreen(PROFILE_SCREEN_ID);
        }
        else if (targetScreenId === CHAT_SCREEN_ID && currentScreen !== CHAT_SCREEN_ID) {
             createNewChatSession();
        } else if (targetScreenId === 'chat-list-screen-home') {
             showScreen(CHAT_LIST_SCREEN_ID);
        } else if (targetScreenId === SETTINGS_SCREEN_ID) {
             if (currentActiveScreenBeforeNav !== SETTINGS_SCREEN_ID) {
                previousScreenForSettings = currentActiveScreenBeforeNav;
             }
             showScreen(SETTINGS_SCREEN_ID);
        }
        else if (targetScreenId === CREATE_TOOL_SCREEN_ID) {
            showScreen(CREATE_TOOL_SCREEN_ID);
        }
        else if (screens.includes(targetScreenId) &&
                 targetScreenId !== WEBVIEW_SCREEN_ID &&
                 targetScreenId !== IMAGE_VIEWER_SCREEN_ID &&
                 targetScreenId !== CODE_CANVAS_SCREEN_ID &&
                 targetScreenId !== MEMORIES_SCREEN_ID) {
            showScreen(targetScreenId);
        } else if (targetScreenId === WEB_DEV_STUDIO_SCREEN_ID) {
            showScreen(WEB_DEV_STUDIO_SCREEN_ID);
        }
    }

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      const buttonItem = item as HTMLButtonElement;
      buttonItem.addEventListener('click', () => {
        const targetScreen = buttonItem.dataset.target;
        handleNavClick(targetScreen, currentScreen);
      });
    });

    document.querySelectorAll('#desktop-sidebar .sidebar-nav-item').forEach(item => {
        const buttonItem = item as HTMLButtonElement;
        buttonItem.addEventListener('click', () => {
            const targetScreen = buttonItem.dataset.target;
            handleNavClick(targetScreen, currentScreen);
        });
    });
    toggleSidebarButton?.addEventListener('click', () => {
        isSidebarCollapsed = !isSidebarCollapsed;
        desktopSidebar?.classList.toggle('collapsed', isSidebarCollapsed);
        appMainContent?.classList.toggle('lg:ml-[4.5rem]', isSidebarCollapsed);
        appMainContent?.classList.toggle('lg:ml-60', !isSidebarCollapsed && appMainContent?.classList.contains('xl:ml-64'));
        appMainContent?.classList.toggle('xl:ml-[4.5rem]', isSidebarCollapsed);
        appMainContent?.classList.toggle('xl:ml-64', !isSidebarCollapsed);
        saveSetting('isSidebarCollapsed', isSidebarCollapsed);
    });



    webviewCloseBtn?.addEventListener('click', () => {
        if (webviewScreenElement && webviewFrame) {
            webviewFrame.src = 'about:blank';
            webviewScreenElement.classList.remove('active');
            const underlyingScreen = currentScreen === WEBVIEW_SCREEN_ID ? CHAT_SCREEN_ID : currentScreen;
            showScreen(underlyingScreen);
        }
    });

    imageViewerCloseBtn?.addEventListener('click', () => {
        if (imageViewerScreenElement && imageViewerImg) {
            imageViewerImg.src = '';
            imageViewerScreenElement.classList.remove('active');
            const underlyingScreen = currentScreen === IMAGE_VIEWER_SCREEN_ID ? CHAT_SCREEN_ID : currentScreen;
            showScreen(underlyingScreen);
        }
    });

    document.body.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('webview-link') && target.dataset.url) {
          event.preventDefault();
          openInAppWebView(target.dataset.url);
      }
      const downloadButton = target.closest('.download-in-chat-image-btn');
      if (downloadButton instanceof HTMLElement && downloadButton.dataset.base64 && downloadButton.dataset.mime) {
          const base64 = downloadButton.dataset.base64;
          const mimeType = downloadButton.dataset.mime;
          const promptForImage = downloadButton.dataset.prompt || 'generated-image';
          const filename = `nova-chat-image-${promptForImage.substring(0,20).replace(/\s+/g, '_')}.jpeg`;
          downloadImageWithBase64(base64, mimeType, filename);
      }
    });

    chatMessagesContainer?.addEventListener('click', (event) => {
        const targetElement = event.target as HTMLElement;
        const previewButton = targetElement.closest('.preview-code-btn');
        const copyButton = targetElement.closest('.copy-code-btn');

        if (previewButton instanceof HTMLElement && codeCanvasTextarea) {
            const rawCode = previewButton.dataset.code;
            if (rawCode) {
                codeCanvasTextarea.value = rawCode;
                showScreen(CODE_CANVAS_SCREEN_ID);
                setCodeCanvasView('preview');
                renderCodeToIframe();
            }
        } else if (copyButton instanceof HTMLElement) {
            const rawCode = copyButton.dataset.code;
            if (rawCode && navigator.clipboard) {
                navigator.clipboard.writeText(rawCode).then(() => {
                    const originalContent = copyButton.innerHTML;
                    copyButton.innerHTML = `<span class="material-symbols-outlined" style="font-size:inherit; vertical-align: middle;">check_circle</span> <span style="vertical-align: middle;">Copied!</span>`;
                    (copyButton as HTMLButtonElement).disabled = true;
                    setTimeout(() => {
                        copyButton.innerHTML = originalContent;
                        (copyButton as HTMLButtonElement).disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy code: ', err);
                    alert('Failed to copy code to clipboard.');
                });
            }
        }
    });

    codeCanvasCloseButton?.addEventListener('click', () => {
        if (codeCanvasScreenElement) codeCanvasScreenElement.classList.remove('active');
        setCodeCanvasView('code');
        if (codeCanvasInlinePreviewIframe) codeCanvasInlinePreviewIframe.srcdoc = '';
        const underlyingScreen = currentScreen === CODE_CANVAS_SCREEN_ID ? CHAT_SCREEN_ID : currentScreen;
        showScreen(underlyingScreen);
    });
    codeCanvasCopyToChatButton?.addEventListener('click', () => {
        if (codeCanvasTextarea && chatInput) {
            const codeText = codeCanvasTextarea.value;
            if (codeText.trim()) {
                chatInput.value = `\`\`\`\n${codeText}\n\`\`\``;
            }
            if (codeCanvasScreenElement) codeCanvasScreenElement.classList.remove('active');
            showScreen(CHAT_SCREEN_ID);
            chatInput.focus();
        }
    });

    codeCanvasTextarea?.addEventListener('input', () => {
        if (codeCanvasViewMode === 'preview') {
            renderCodeToIframeDebounced();
        }
    });

    codeCanvasToggleViewButton?.addEventListener('click', () => {
        if (codeCanvasViewMode === 'code') {
            setCodeCanvasView('preview');
            renderCodeToIframe();
        } else {
            setCodeCanvasView('code');
        }
    });

    codeCanvasEnterFullscreenButton?.addEventListener('click', () => {
        if (fullScreenPreviewOverlay && fullScreenPreviewIframe && codeCanvasTextarea) {
            fullScreenPreviewIframe.srcdoc = codeCanvasTextarea.value;
            fullScreenPreviewOverlay.style.display = 'flex';
        }
    });
    fullScreenPreviewCloseButton?.addEventListener('click', () => {
        if (fullScreenPreviewOverlay && fullScreenPreviewIframe) {
            fullScreenPreviewOverlay.style.display = 'none';
            fullScreenPreviewIframe.srcdoc = '';
        }
    });


    imageStudioGenerateButton?.addEventListener('click', handleGenerateImages);
    imageStudioDownloadAllButton?.addEventListener('click', () => {
        currentGeneratedImagesData.forEach((imgData, index) => {
            const promptPart = imgData.prompt.substring(0, 20).replace(/\s+/g, '_');
            downloadImageWithBase64(imgData.base64, imgData.mimeType, `nova-image-${promptPart}-${index + 1}.jpeg`);
        });
    });
    imageStudioEngineSelect?.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        currentImageEngine = target.value;
        saveSetting('currentImageEngine', currentImageEngine);
    });

    if (recognition) {
        recognition.onstart = () => {
            isListening = true;
            micButtonContainer?.classList.add('listening');
            micButton?.setAttribute('aria-label', 'Stop listening');
            micButton?.setAttribute('aria-pressed', 'true');
            if (voiceModeToggle) voiceModeToggle.disabled = true;
            if (advancedOptionsButton) advancedOptionsButton.disabled = true;
        };

        recognition.onend = () => {
            isListening = false;
            micButtonContainer?.classList.remove('listening');
            micButton?.setAttribute('aria-label', 'Use microphone');
            micButton?.setAttribute('aria-pressed', 'false');
            if (voiceModeToggle) voiceModeToggle.disabled = false;
            if (advancedOptionsButton) advancedOptionsButton.disabled = isLoading || isImageLoading;
        };

        recognition.onresult = (event: any) => { // 'any' for SpeechRecognitionEvent
            const transcript = event.results[0][0].transcript;
            if (chatInput) chatInput.value = transcript;
            if (voiceModeActive) {
                handleSendMessage();
            }
        };
        recognition.onerror = (event: any) => { // 'any' for SpeechRecognitionError
            console.error('Speech recognition error:', event.error);
            let errorMessage = "Speech recognition error. ";
            if (event.error === 'no-speech') errorMessage += "No speech detected.";
            else if (event.error === 'audio-capture') errorMessage += "Microphone problem. Please check permissions and hardware.";
            else if (event.error === 'not-allowed') errorMessage += "Permission to use microphone was denied or not granted.";
            else if (event.error === 'language-not-supported') errorMessage += `STT language (${recognition.lang}) not supported.`;
            else errorMessage += `Details: ${event.error}`;

            if (event.error !== 'no-speech' || !voiceModeActive) {
                 displaySystemMessage(errorMessage, CHAT_SCREEN_ID, 'en');
            }

            if (voiceModeActive && (event.error === 'not-allowed' || event.error === 'audio-capture' || event.error === 'language-not-supported')) {
                voiceModeActive = false;
                if(voiceModeToggle) {
                    voiceModeToggle.classList.remove('active');
                    voiceModeToggle.setAttribute('aria-pressed', 'false');
                }
                saveSetting('voiceModeActive', voiceModeActive);
                const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
                if (chatInput) {
                    chatInput.disabled = false;
                    chatInput.classList.remove('opacity-50');
                    chatInput.placeholder = currentStrings.chatInputPlaceholder;
                }
            }
            isListening = false;
            micButtonContainer?.classList.remove('listening');
        };
    }

    settingLanguageSelect?.addEventListener('change', (event) => {
        const newLang = (event.target as HTMLSelectElement).value as 'en' | 'ar';
        if (uiStrings[newLang]) {
            currentLanguage = newLang;
            saveLanguagePreference(newLang);
            applyLanguageToUI();
            if (recognition) {
                recognition.lang = newLang === 'ar' ? 'ar-SA' : (navigator.language || 'en-US');
            }
        }
    });

    saveGeneralMemoryButton?.addEventListener('click', handleSaveGeneralMemory);
    generalMemoriesListContainer?.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('delete-general-memory-btn') || target.closest('.delete-general-memory-btn')) {
            const button = target.closest('.delete-general-memory-btn') as HTMLButtonElement;
            const memoryId = button.dataset.id;
            if (memoryId) handleDeleteGeneralMemory(memoryId);
        }
    });

    // Web Dev Studio Event Listeners
    webDevGenerateBtn?.addEventListener('click', handleGenerateWebDevArtifacts);
    webDevArtifactListElement?.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const fileItem = target.closest('.web-dev-file-item');
        if (fileItem instanceof HTMLElement && fileItem.dataset.filename && currentWebDevStudioArtifactSet) {
            const fileName = fileItem.dataset.filename;
            const fileData = currentWebDevStudioArtifactSet.files.find(f => f.filename === fileName);
            if (fileData) displayWebDevFileContent(fileData);
        }
    });
    webDevDownloadZipBtn?.addEventListener('click', handleDownloadWebDevArtifactsAsZip);
    webDevRunProjectBtn?.addEventListener('click', handleRunWebDevProject);
    webDevCopyCodeBtn?.addEventListener('click', handleCopyWebDevCode);

}

// --- Language and Localization ---
function applyLanguageToUI() {
    const langStrings = uiStrings[currentLanguage] || uiStrings.en;
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

    if (chatInputActionsArea) {
        chatInputActionsArea.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    }


    const elementsToUpdate: { [selector: string]: keyof typeof langStrings | string } = { // Allow string for new keys
        '#splash-version-text': 'splashVersion',
        '#onboarding-next-btn span': 'onboardingNext',
        '#onboarding-skip-btn span': 'onboardingSkip',
        '#signin-welcome-title': 'signInWelcome',
        '#signin-prompt-text': 'signInPrompt',
        '#signin-button': 'signInButton',
        '#signup-button': 'signUpButton',
        '#signin-poweredby-text': 'signInPoweredBy',
        '#chat-list-title': 'chatListTitle',
        '#settings-title': 'settingsTitle',
        '#settings-ai-tone-label': 'settingsAiTone',
        '.settings-tone-friendly-text': 'settingsFriendly',
        '.settings-tone-formal-text': 'settingsFormal',
        '.settings-tone-creative-text': 'settingsCreative',
        '#settings-creativity-label': 'settingsCreativity',
        '#settings-creativity-desc': 'settingsCreativityDesc',
        '#settings-creativity-focused': 'settingsCreativityFocused',
        '#settings-creativity-balanced': 'settingsCreativityBalanced',
        '#settings-creativity-inventive': 'settingsCreativityInventive',
        '#settings-features-label': 'settingsFeatures',
        '#settings-tts-label': 'settingsTTS',
        '#settings-internet-search-label': 'settingsInternetSearch',
        '#settings-deep-thinking-label': 'settingsDeepThinking',
        '#settings-scientific-mode-label': 'settingsScientificMode',
        '#settings-appearance-label': 'settingsAppearance',
        '#settings-dark-mode-label': 'settingsDarkMode',
        '#settings-other-label': 'settingsOther',
        '#settings-language-label': 'settingsLanguage',
        '#settings-dev-info-title': 'settingsDevInfoTitle',
        '#settings-dev-name': 'settingsDevName',
        '#settings-dev-contact-label': 'settingsDevContact',
        '#settings-general-memories-label': 'settingsGeneralMemories',
        '#setting-save-general-memory-btn': 'settingsSaveGeneralMemory',
        '#profile-title': 'profileTitle',
        '#profile-learned-info-label': 'profileLearnedInfo',
        '#profile-interests-label': 'profileInterests',
        '#profile-preferences-label': 'profilePreferences',
        '#profile-facts-label': 'profileFacts',
        '#profile-view-memories-text': 'profileViewMemories',
        '#logout-button': 'profileLogout',
        '#memories-title': 'memoriesTitle',
        '#create-tool-title': 'createToolTitle',
        '#tool-name-label': 'toolNameLabel',
        '#tool-instructions-label': 'toolInstructionsLabel',
        '#tool-knowledge-label': 'toolKnowledgeLabel',
        '#tool-save-text': 'toolSaveButton',
        '#image-studio-title': 'imageStudioTitle',
        '#image-studio-prompt-label': 'imageStudioPromptLabel',
        '#image-studio-engine-label': 'imageStudioEngineLabel',
        '#image-studio-aspect-label': 'imageStudioAspectLabel',
        '#image-studio-generate-text': 'imageStudioGenerateButton',
        '#image-studio-loading-text': 'imageStudioLoading',
        '#image-studio-download-all-text': 'imageStudioDownloadAll',
        '#code-canvas-title': 'codeCanvasTitle',
        '#code-canvas-copy-to-chat-btn span': 'codeCanvasCopyBtnText',
        '#web-dev-studio-title': 'webDevStudioTitle',
        '#web-dev-prompt-label': 'webDevPromptLabel',
        '#web-dev-generate-text': 'webDevGenerateButton',
        '#web-dev-loading-text': 'webDevLoading',
        '.web-dev-viewer-title-default': 'webDevViewerTitleDefault',
        '.web-dev-no-artifacts-text': 'webDevNoArtifactsMessage',
        '#web-dev-download-zip-text': 'webDevDownloadAllZip',
        '#web-dev-run-project-text': 'webDevRunProject',
        '#web-dev-artifact-files-title': 'webDevArtifactFilesTitle',
        '#adv-opt-popover-title': 'advOptTitle',
        '.adv-opt-deep-thinking-label': 'advOptDeepThinking',
        '.adv-opt-internet-search-label': 'advOptInternetSearch',
        '.adv-opt-scientific-mode-label': 'advOptScientificMode',
        '#popover-upload-file-button span': 'advOptUploadFile',
        '#popover-generate-image-button span': 'advOptGenerateImage',
        '#popover-code-canvas-button span': 'advOptCodeCanvas',
        '.nav-text-home': 'navHome',
        '.nav-text-image-studio': 'navImageStudio',
        '.nav-text-web-dev-studio': 'navWebDevStudio',
        '.nav-text-new-chat': 'navNewChat',
        '.nav-text-profile': 'navProfile',
        '.nav-text-settings': 'navSettings',
    };

    for (const selector in elementsToUpdate) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const key = elementsToUpdate[selector] as keyof typeof langStrings;
            if (langStrings[key]) {
                if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                    el.placeholder = langStrings[key];
                } else {
                    el.textContent = langStrings[key];
                }
            }
        });
    }
    if (chatInput) {
        if (editingUserMessageId) {
            chatInput.placeholder = langStrings.chatInputPlaceholderEditing;
        } else if (voiceModeActive) {
            chatInput.placeholder = langStrings.chatInputPlaceholderVoice;
        } else {
            chatInput.placeholder = langStrings.chatInputPlaceholder;
        }
    }
    if (sendButton) {
        const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
        if (sendButtonTextSpan) {
           sendButtonTextSpan.textContent = editingUserMessageId ? langStrings.sendButtonUpdate : langStrings.sendButtonDefault;
        }
        sendButton.setAttribute('aria-label', editingUserMessageId ? langStrings.sendButtonUpdate : langStrings.sendButtonDefault);
    }

    if (codeCanvasToggleViewButton) {
        codeCanvasToggleViewButton.textContent = codeCanvasViewMode === 'code' ? langStrings.codeCanvasShowPreview : langStrings.codeCanvasShowCode;
    }
    if (generalMemoryInput) {
        generalMemoryInput.placeholder = langStrings.settingsGeneralMemoryPlaceholder;
    }
    updateProfileScreenUI();
    const searchInput = document.getElementById('search-chats-tools-input') as HTMLInputElement | null;
    if (searchInput) searchInput.placeholder = langStrings.searchChatsToolsPlaceholder;

    if (processLogPanelElement) processLogPanelElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

    renderChatList();
    if (currentScreen === MEMORIES_SCREEN_ID) renderMemoriesScreen();
    if (currentScreen === SETTINGS_SCREEN_ID) renderGeneralMemoriesList();
    if (currentScreen === WEB_DEV_STUDIO_SCREEN_ID) renderWebDevArtifactList();


}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && uiStrings[savedLang as 'en' | 'ar']) {
        currentLanguage = savedLang as 'en' | 'ar';
    } else {
        const browserLang = navigator.language.split('-')[0] as 'en' | 'ar';
        if (uiStrings[browserLang]) {
            currentLanguage = browserLang;
        } else {
            currentLanguage = 'en';
        }
    }
    if (settingLanguageSelect) settingLanguageSelect.value = currentLanguage;
}

function saveLanguagePreference(lang: 'en' | 'ar') {
    localStorage.setItem('appLanguage', lang);
}


// --- END OF PORTED/NEWLY ADDED FUNCTIONS ---


// --- Initialization ---
function initializeApp() {
  chatMessagesContainer = document.getElementById('chat-messages-container') as HTMLDivElement | null;
  chatInput = document.getElementById('chat-input') as HTMLTextAreaElement | null;
  sendButton = document.getElementById('send-chat-button') as HTMLButtonElement | null;
  suggestedPromptButtons = document.querySelectorAll('.suggested-prompt-btn');
  micButton = document.getElementById('mic-button') as HTMLButtonElement | null;
  if (micButton) {
    micButtonContainer = micButton.closest('.mic-button-container') as HTMLDivElement | null;
  }
  voiceModeToggle = document.getElementById('voice-mode-toggle') as HTMLButtonElement | null;
  chatListItemsContainer = document.getElementById('chat-list-items-container') as HTMLDivElement | null;
  chatScreenTitleElement = document.getElementById('chat-screen-title');
  novaProcessingIndicatorElement = document.getElementById('nova-processing-indicator') as HTMLDivElement | null;
  novaImageProcessingIndicatorElement = document.getElementById('nova-image-processing-indicator') as HTMLDivElement | null;
  chatInputActionsArea = document.getElementById('chat-input-actions-area') as HTMLDivElement | null;

  processLogPanelElement = document.getElementById('process-log-panel') as HTMLDivElement | null;
  processLogListElement = document.getElementById('process-log-list') as HTMLUListElement | null;
  toggleProcessLogButtonElement = document.getElementById('toggle-process-log-btn') as HTMLButtonElement | null;
  processLogCloseButtonElement = document.getElementById('process-log-close-btn') as HTMLButtonElement | null;
  advancedOptionsButton = document.getElementById('advanced-options-button') as HTMLButtonElement | null;
  advancedOptionsPopover = document.getElementById('advanced-options-popover') as HTMLDivElement | null;
  popoverDeepThinkingToggle = document.getElementById('popover-deep-thinking-toggle') as HTMLInputElement | null;
  popoverInternetSearchToggle = document.getElementById('popover-internet-search-toggle') as HTMLInputElement | null;
  popoverScientificModeToggle = document.getElementById('popover-scientific-mode-toggle') as HTMLInputElement | null;
  popoverUploadFileButton = document.getElementById('popover-upload-file-button') as HTMLButtonElement | null;
  popoverGenerateImageButton = document.getElementById('popover-generate-image-button') as HTMLButtonElement | null;
  popoverCodeCanvasButton = document.getElementById('popover-code-canvas-button') as HTMLButtonElement | null;

  fileInputHidden = document.getElementById('file-input-hidden') as HTMLInputElement | null;
  stagedFilePreviewContainer = document.getElementById('staged-file-preview-container') as HTMLDivElement | null;
  stagedFilePreviewElement = document.getElementById('staged-file-preview') as HTMLDivElement | null;
  stagedFileClearButton = stagedFilePreviewElement?.querySelector('#staged-file-clear-button') as HTMLButtonElement | null;


  aiToneRadios = document.querySelectorAll('input[name="ai_tone"]');
  darkModeToggle = document.getElementById('setting-dark-mode-toggle') as HTMLInputElement | null;
  ttsToggle = document.getElementById('setting-tts-toggle') as HTMLInputElement | null;
  internetSearchToggle = document.getElementById('setting-internet-search-toggle') as HTMLInputElement | null;
  deepThinkingToggle = document.getElementById('setting-deep-thinking-toggle') as HTMLInputElement | null;
  creativityLevelSelect = document.getElementById('setting-creativity-level') as HTMLSelectElement | null;
  advancedScientificModeToggle = document.getElementById('setting-advanced-scientific-mode-toggle') as HTMLInputElement | null;
  settingLanguageSelect = document.getElementById('setting-language-select') as HTMLSelectElement | null;
  generalMemoryInput = document.getElementById('setting-general-memory-input') as HTMLTextAreaElement | null;
  saveGeneralMemoryButton = document.getElementById('setting-save-general-memory-btn') as HTMLButtonElement | null;
  generalMemoriesListContainer = document.getElementById('settings-general-memories-list') as HTMLDivElement | null;


  profileUserName = document.getElementById('profile-user-name');
  profileUserEmail = document.getElementById('profile-user-email');
  profileInterests = document.getElementById('profile-interests');
  profilePreferences = document.getElementById('profile-preferences');
  profileFacts = document.getElementById('profile-facts');
  logoutButton = document.getElementById('logout-button') as HTMLButtonElement | null;
  viewMemoriesButton = document.getElementById('view-memories-btn') as HTMLButtonElement | null;

  memoriesListContainer = document.getElementById('memories-list-container') as HTMLDivElement | null;
  memoriesBackButton = document.getElementById('memories-back-btn') as HTMLButtonElement | null;

  webviewScreenElement = document.getElementById(WEBVIEW_SCREEN_ID);
  webviewFrame = document.getElementById('webview-frame') as HTMLIFrameElement | null;
  webviewTitle = document.getElementById('webview-title');
  webviewLoading = document.getElementById('webview-loading');
  webviewCloseBtn = document.getElementById('webview-close-btn');

  imageViewerScreenElement = document.getElementById(IMAGE_VIEWER_SCREEN_ID);
  imageViewerImg = document.getElementById('image-viewer-img') as HTMLImageElement | null;
  imageViewerCloseBtn = document.getElementById('image-viewer-close-btn');

  onboardingDots = document.querySelectorAll('#onboarding-dots .onboarding-dot');
  onboardingNextBtn = document.getElementById('onboarding-next-btn');
  onboardingSkipBtn = document.getElementById('onboarding-skip-btn');

  codeCanvasScreenElement = document.getElementById(CODE_CANVAS_SCREEN_ID);
  codeCanvasTextarea = document.getElementById('code-canvas-textarea') as HTMLTextAreaElement | null;
  codeCanvasCopyToChatButton = document.getElementById('code-canvas-copy-to-chat-btn') as HTMLButtonElement | null;
  codeCanvasCloseButton = document.getElementById('code-canvas-close-btn') as HTMLButtonElement | null;
  codeEditorWrapper = document.getElementById('code-editor-wrapper') as HTMLDivElement | null;
  codeCanvasInlinePreviewIframe = document.getElementById('code-canvas-inline-preview-iframe') as HTMLIFrameElement | null;
  codeCanvasToggleViewButton = document.getElementById('code-canvas-toggle-view-btn') as HTMLButtonElement | null;
  codeCanvasEnterFullscreenButton = document.getElementById('code-canvas-enter-fullscreen-btn') as HTMLButtonElement | null;

  fullScreenPreviewOverlay = document.getElementById('full-screen-preview-overlay') as HTMLDivElement | null;
  fullScreenPreviewIframe = document.getElementById('full-screen-preview-iframe') as HTMLIFrameElement | null;
  fullScreenPreviewCloseButton = document.getElementById('full-screen-preview-close-btn') as HTMLButtonElement | null;

  imageStudioPromptInput = document.getElementById('image-studio-prompt-input') as HTMLTextAreaElement | null;
  imageStudioEngineSelect = document.getElementById('image-studio-engine-select') as HTMLSelectElement | null;
  imageStudioAspectRatioSelect = document.getElementById('image-studio-aspect-ratio-select') as HTMLSelectElement | null;
  imageStudioGenerateButton = document.getElementById('image-studio-generate-btn') as HTMLButtonElement | null;
  imageStudioLoadingIndicator = document.getElementById('image-studio-loading-indicator') as HTMLDivElement | null;
  imageStudioErrorMessageElement = document.getElementById('image-studio-error-message') as HTMLDivElement | null;
  imageStudioGridElement = document.getElementById('image-studio-grid') as HTMLDivElement | null;
  imageStudioDownloadAllButton = document.getElementById('image-studio-download-all-btn') as HTMLButtonElement | null;

  signinEmailInput = document.getElementById('signin-email-input') as HTMLInputElement | null;
  signinPasswordInput = document.getElementById('signin-password-input') as HTMLInputElement | null;
  signinButton = document.getElementById('signin-button') as HTMLButtonElement | null;
  signupButton = document.getElementById('signup-button') as HTMLButtonElement | null;
  authErrorMessageElement = document.getElementById('auth-error-message');

  createToolScreenElement = document.getElementById(CREATE_TOOL_SCREEN_ID);
  toolNameInput = document.getElementById('tool-name-input') as HTMLInputElement | null;
  toolInstructionsInput = document.getElementById('tool-instructions-input') as HTMLTextAreaElement | null;
  toolKnowledgeInput = document.getElementById('tool-knowledge-input') as HTMLTextAreaElement | null;
  saveToolButton = document.getElementById('save-tool-button') as HTMLButtonElement | null;
  createToolBackButton = document.getElementById('create-tool-back-btn') as HTMLButtonElement | null;
  createToolErrorMessageElement = document.getElementById('create-tool-error-message');
  chatListCreateToolButton = document.getElementById('chat-list-create-tool-btn') as HTMLButtonElement | null;

  desktopSidebar = document.getElementById('desktop-sidebar');
  toggleSidebarButton = document.getElementById('toggle-sidebar-btn') as HTMLButtonElement | null;
  appMainContent = document.getElementById('app-main-content');

  // Web Dev Studio Elements
  webDevStudioScreenElement = document.getElementById(WEB_DEV_STUDIO_SCREEN_ID);
  webDevPromptInput = document.getElementById('web-dev-prompt-input') as HTMLTextAreaElement | null;
  webDevGenerateBtn = document.getElementById('web-dev-generate-btn') as HTMLButtonElement | null;
  webDevLoadingIndicator = document.getElementById('web-dev-loading-indicator') as HTMLDivElement | null;
  webDevErrorMessageElement = document.getElementById('web-dev-error-message') as HTMLDivElement | null;
  webDevArtifactListElement = document.getElementById('web-dev-artifact-list') as HTMLDivElement | null;
  webDevArtifactFilesTitleElement = document.getElementById('web-dev-artifact-files-title');
  webDevNoArtifactsMessageElement = document.getElementById('web-dev-no-artifacts-message');
  webDevDownloadZipBtn = document.getElementById('web-dev-download-zip-btn') as HTMLButtonElement | null;
  webDevViewerTitleElement = document.getElementById('web-dev-viewer-title');
  webDevRunProjectBtn = document.getElementById('web-dev-run-project-btn') as HTMLButtonElement | null;
  webDevCodeViewerElement = document.getElementById('web-dev-code-viewer-container'); // Container for pre and p
  webDevCodeViewerCodeElement = document.getElementById('web-dev-code-viewer-code');
  webDevCopyCodeBtn = document.getElementById('web-dev-copy-code-btn') as HTMLButtonElement | null;
  webDevPreviewIframeElement = document.getElementById('web-dev-preview-iframe') as HTMLIFrameElement | null;


  if (!GEMINI_API_KEY) {
      console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
  }

  loadLanguagePreference();
  initFirebaseAuth();

  window.addEventListener('load', () => {
    if(currentScreen === CHAT_SCREEN_ID) scrollToBottomChat();
  });
  updateStagedFilePreview();
  console.log("Nova AI Mobile Initialized (v2.0.3 - Web Dev Studio & Firebase).");
}

// --- Firebase Authentication & Database ---
function initFirebaseAuth() {
    try {
        if (!window.firebase) {
            console.error("Firebase SDK not loaded. App cannot initialize.");
            // Display a user-friendly error on the splash screen or a dedicated error screen.
            const splashProgressBar = document.getElementById('splash-progress-bar');
            const splashProgressText = document.querySelector('#splash-screen p.text-xs.text-\\[\\#19e5c6\\]');
            if(splashProgressBar) (splashProgressBar.parentElement as HTMLElement).style.display = 'none';
            if(splashProgressText) splashProgressText.textContent = "Error: Core services failed to load. Please refresh.";
            return;
        }
        firebaseApp = window.firebase.initializeApp(firebaseConfig);
        firebaseAuth = window.firebase.auth();
        firebaseDb = window.firebase.database();

        firebaseAuth.onAuthStateChanged(async (user: any) => {
            const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
            if (user) {
                currentUser = user;
                if (profileUserEmail) profileUserEmail.textContent = user.email;
                if (profileUserName && user.displayName) profileUserName.textContent = user.displayName;
                else if (profileUserName && user.email) profileUserName.textContent = user.email.split('@')[0];
                if (logoutButton) logoutButton.style.display = 'block';

                await loadUserProfileFromFirebase();
                await loadChatSessionsFromFirebase();
                await loadSavedMemoriesFromFirebase();
                await loadCustomToolsFromFirebase();
                await loadGeneralMemoriesFromFirebase();
                await loadWebDevArtifactsFromFirebase();


                if (currentScreen === SIGNIN_SCREEN_ID || currentScreen === SPLASH_SCREEN_ID || currentScreen === ONBOARDING_SCREEN_ID) {
                     showScreen(CHAT_LIST_SCREEN_ID);
                }
                if (!geminiInitialized) initializeGeminiSDK();

            } else {
                currentUser = null;
                if (profileUserEmail) profileUserEmail.textContent = "user.email@example.com";
                if (profileUserName) profileUserName.textContent = "User Name";
                if (logoutButton) logoutButton.style.display = 'none';

                chatSessions = [];
                savedMemories = [];
                customTools = [];
                generalMemories = [];
                webDevArtifacts = [];
                userProfile = { interests: [], preferences: {}, facts: [] };

                if (currentScreen !== SPLASH_SCREEN_ID && currentScreen !== ONBOARDING_SCREEN_ID && currentScreen !== SIGNIN_SCREEN_ID) {
                    showScreen(SIGNIN_SCREEN_ID);
                } else if (currentScreen === SPLASH_SCREEN_ID) {
                     setTimeout(() => {
                        if (onboardingComplete) {
                            showScreen(SIGNIN_SCREEN_ID);
                        } else {
                            showScreen(ONBOARDING_SCREEN_ID);
                        }
                    }, 2500);
                }
            }
            loadSettings();
            applySettings();
            renderChatList();
            updateProfileScreenUI();
            applyLanguageToUI();
            setupEventListeners();
            if (currentScreen === ONBOARDING_SCREEN_ID) updateOnboardingUI();
        });
    } catch (error) {
        console.error("Firebase initialization error:", error);
        if (authErrorMessageElement) {
            authErrorMessageElement.textContent = "Failed to initialize authentication. Please refresh.";
            authErrorMessageElement.style.display = "block";
        }
        loadSettings();
        applySettings();
        applyLanguageToUI();
        setupEventListeners();
        showScreen(SIGNIN_SCREEN_ID);
    }
}

function handleSignUp() {
    if (!signinEmailInput || !signinPasswordInput || !authErrorMessageElement || !firebaseAuth) return;
    const email = signinEmailInput.value;
    const password = signinPasswordInput.value;
    authErrorMessageElement.style.display = 'none';
    authErrorMessageElement.textContent = '';


    firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential: any) => {
            console.log("User signed up successfully:", userCredential.user);
            const initialProfile: UserProfile = { name: email.split('@')[0], interests: [], preferences: {}, facts: [] };
            firebaseDb.ref(`users/${userCredential.user.uid}/profile`).set(initialProfile)
                .then(() => console.log("Initial user profile saved to Firebase."))
                .catch((error: any) => console.error("Error saving initial profile:", error));
        })
        .catch((error: any) => {
            console.error("Sign up error:", error.code, error.message);
            let userMessage = "An unexpected error occurred during sign up. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                userMessage = "This email address is already in use. Please try signing in or use a different email.";
            } else if (error.code === 'auth/weak-password') {
                userMessage = "The password is too weak. Please choose a stronger password (at least 6 characters).";
            } else if (error.code === 'auth/invalid-email') {
                userMessage = "The email address is not valid. Please enter a correct email.";
            } else {
                userMessage = error.message;
            }
            if (authErrorMessageElement) {
                authErrorMessageElement.textContent = userMessage;
                authErrorMessageElement.style.display = 'block';
            }
        });
}

function handleSignIn() {
    if (!signinEmailInput || !signinPasswordInput || !authErrorMessageElement || !firebaseAuth) return;
    const email = signinEmailInput.value;
    const password = signinPasswordInput.value;
    authErrorMessageElement.style.display = 'none';
    authErrorMessageElement.textContent = '';

    firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential: any) => {
            console.log("User signed in successfully:", userCredential.user);
        })
        .catch((error: any) => {
            console.error("Sign in error:", error.code, error.message);
            let userMessage = "An unexpected error occurred during sign in. Please try again.";
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                userMessage = "Incorrect email or password. Please check your credentials and try again.";
            } else if (error.code === 'auth/invalid-email') {
                userMessage = "The email address is not valid. Please enter a correct email.";
            } else {
                 userMessage = error.message;
            }
            if (authErrorMessageElement) {
                authErrorMessageElement.textContent = userMessage;
                authErrorMessageElement.style.display = 'block';
            }
        });
}

function handleSignOut() {
    if (!firebaseAuth) return;
    firebaseAuth.signOut()
        .then(() => {
            console.log("User signed out successfully");
            currentChatSessionId = null;
            if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';
        })
        .catch((error: any) => {
            console.error("Sign out error:", error);
             if (authErrorMessageElement && currentScreen === PROFILE_SCREEN_ID) {
                authErrorMessageElement.textContent = "Logout failed: " + error.message;
                authErrorMessageElement.style.display = 'block';
            } else {
                alert("Logout failed: " + error.message);
            }
        });
}

// --- Settings Logic (Local Storage based) ---
function loadSettings() {
    const validAiTones = ['friendly', 'formal', 'creative'];
    const defaultAiTone = 'friendly';

    const storedTone = localStorage.getItem('aiTone');
    if (storedTone) {
        try {
            const parsedTone = JSON.parse(storedTone);
            if (typeof parsedTone === 'string' && validAiTones.includes(parsedTone)) {
                currentAiTone = parsedTone;
            } else {
                currentAiTone = defaultAiTone;
                saveSetting('aiTone', currentAiTone);
            }
        } catch (e) {
            if (typeof storedTone === 'string' && validAiTones.includes(storedTone)) {
                currentAiTone = storedTone;
                saveSetting('aiTone', currentAiTone);
            } else {
                currentAiTone = defaultAiTone;
                localStorage.removeItem('aiTone');
                saveSetting('aiTone', currentAiTone);
            }
        }
    }

    darkModeEnabled = JSON.parse(localStorage.getItem('darkModeEnabled') || 'true');
    ttsEnabled = JSON.parse(localStorage.getItem('ttsEnabled') || 'false');
    voiceModeActive = JSON.parse(localStorage.getItem('voiceModeActive') || 'false');
    internetSearchEnabled = JSON.parse(localStorage.getItem('internetSearchEnabled') || 'false');
    deepThinkingEnabled = JSON.parse(localStorage.getItem('deepThinkingEnabled') || 'false');
    advancedScientificModeEnabled = JSON.parse(localStorage.getItem('advancedScientificModeEnabled') || 'false');
    processLogVisible = JSON.parse(localStorage.getItem('processLogVisible') || 'false');
    currentImageEngine = JSON.parse(localStorage.getItem('currentImageEngine') || '"standard"');
    currentCreativityLevel = JSON.parse(localStorage.getItem('currentCreativityLevel') || '"balanced"') as 'focused' | 'balanced' | 'inventive';
    isSidebarCollapsed = JSON.parse(localStorage.getItem('isSidebarCollapsed') || 'false');

}

function applySettings() {
    (document.querySelector(`input[name="ai_tone"][value="${currentAiTone}"]`) as HTMLInputElement | null)?.setAttribute('checked', 'true');
    aiToneRadios?.forEach(radio => {
        (radio as HTMLInputElement).checked = (radio as HTMLInputElement).value === currentAiTone;
    });

    if (darkModeToggle) darkModeToggle.checked = darkModeEnabled;
    document.body.classList.toggle('light-mode', !darkModeEnabled);

    if (ttsToggle) ttsToggle.checked = ttsEnabled;
    if (internetSearchToggle) internetSearchToggle.checked = internetSearchEnabled;
    if (popoverInternetSearchToggle) popoverInternetSearchToggle.checked = internetSearchEnabled;
    if (deepThinkingToggle) deepThinkingToggle.checked = deepThinkingEnabled;
    if (popoverDeepThinkingToggle) popoverDeepThinkingToggle.checked = deepThinkingEnabled;
    if (advancedScientificModeToggle) advancedScientificModeToggle.checked = advancedScientificModeEnabled;
    if (popoverScientificModeToggle) popoverScientificModeToggle.checked = advancedScientificModeEnabled;
    if (creativityLevelSelect) creativityLevelSelect.value = currentCreativityLevel;

    if (voiceModeToggle) {
        voiceModeToggle.classList.toggle('active', voiceModeActive);
        voiceModeToggle.setAttribute('aria-pressed', String(voiceModeActive));
    }
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (chatInput) {
        chatInput.disabled = voiceModeActive;
        chatInput.classList.toggle('opacity-50', voiceModeActive);
        chatInput.placeholder = voiceModeActive ? currentStrings.chatInputPlaceholderVoice : currentStrings.chatInputPlaceholder;
        chatInput.dir = currentLanguage === 'ar' ? 'rtl' : "auto";
    }

    if (processLogPanelElement) {
        processLogPanelElement.classList.toggle('open', processLogVisible);
    }
    if (toggleProcessLogButtonElement) {
        toggleProcessLogButtonElement.classList.toggle('active', processLogVisible);
         toggleProcessLogButtonElement.setAttribute('aria-expanded', String(processLogVisible));
    }

    if (imageStudioEngineSelect) {
        imageStudioEngineSelect.value = currentImageEngine;
    }

    if (desktopSidebar && appMainContent) {
        desktopSidebar.classList.toggle('collapsed', isSidebarCollapsed);
        appMainContent.classList.toggle('lg:ml-[4.5rem]', isSidebarCollapsed);
        appMainContent.classList.toggle('lg:ml-60', !isSidebarCollapsed && appMainContent.classList.contains('xl:ml-64'));
        appMainContent.classList.toggle('xl:ml-[4.5rem]', isSidebarCollapsed);
        appMainContent.classList.toggle('xl:ml-64', !isSidebarCollapsed);
    }
}

function saveSetting(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

// --- User Profile (Firebase based) ---
async function loadUserProfileFromFirebase() {
    if (!currentUser || !firebaseDb) {
        userProfile = { name: "User", interests: [], preferences: {}, facts: [] };
        updateProfileScreenUI();
        return;
    }
    try {
        const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/profile`).once('value');
        if (snapshot.exists()) {
            userProfile = snapshot.val();
            userProfile.name = userProfile.name || currentUser.displayName || currentUser.email?.split('@')[0] || "User";
            userProfile.interests = userProfile.interests || [];
            userProfile.preferences = userProfile.preferences || {};
            userProfile.facts = userProfile.facts || [];
        } else {
            userProfile = {
                name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
                interests: [],
                preferences: {},
                facts: []
            };
            await saveUserProfileToFirebase();
        }
    } catch (error) {
        console.error("Error loading user profile from Firebase:", error);
        userProfile = { name: "User", interests: [], preferences: {}, facts: [] };
    }
    updateProfileScreenUI();
}

async function saveUserProfileToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
        const profileToSave = { ...userProfile };
        if (currentUser.displayName && !profileToSave.name) {
            profileToSave.name = currentUser.displayName;
        }
        await firebaseDb.ref(`users/${currentUser.uid}/profile`).set(profileToSave);
        console.log("User profile saved to Firebase.");
    } catch (error) {
        console.error("Error saving user profile to Firebase:", error);
    }
}


async function extractAndStoreUserInfo(chatSession: ChatSession) {
    if (!ai || !geminiInitialized || !currentUser || !firebaseDb) {
        console.warn("Gemini AI not ready or user not logged in for info extraction.");
        return;
    }
    const messagesToConsider = chatSession.messages.slice(-6);
    if (messagesToConsider.length < 2) return;

    const conversationSnippet = messagesToConsider
        .map(m => `${m.sender === 'System' ? 'Context' : m.sender}: ${m.text}`)
        .join('\n');

    const extractionPrompt = `Based on the following conversation snippet, identify and extract any new or updated personal information about the 'User'. This includes their name (if mentioned and not already known), specific interests, explicit preferences (e.g., 'likes X', 'prefers Y over Z'), or distinct personal facts shared by the user.

Output the extracted information STRICTLY as a JSON object.
The JSON object should have one or more of the following keys if new information is found:
- "userName": string (user's name, if newly identified or changed from previous)
- "newInterests": array of strings (newly mentioned interests)
- "updatedPreferences": object (key-value pairs of preferences, e.g., {"favoriteColor": "blue"})
- "newFacts": array of strings (newly shared personal facts)

If no new or updated personal information is found for the User in this snippet, return an empty JSON object like {}.

Conversation Snippet:
${conversationSnippet}

JSON Output:`;

    let geminiResponse: GenerateContentResponse | undefined;
    try {
        geminiResponse = await ai.models.generateContent({
            model: TEXT_MODEL_NAME,
            contents: extractionPrompt,
            config: { temperature: 0.1, responseMimeType: "application/json" }
        });

        let jsonStr = geminiResponse.text.trim();
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[1]) {
            jsonStr = match[1].trim();
        }

        const extractedData = JSON.parse(jsonStr);

        if (Object.keys(extractedData).length === 0 || extractedData.noNewInfo) {
            return;
        }

        let profileUpdated = false;
        if (extractedData.userName && extractedData.userName !== userProfile.name) {
            userProfile.name = extractedData.userName;
            profileUpdated = true;
        }
        if (extractedData.newInterests && Array.isArray(extractedData.newInterests)) {
            const uniqueNewInterests = extractedData.newInterests.filter((interest: string) => !userProfile.interests.includes(interest));
            if (uniqueNewInterests.length > 0) {
                userProfile.interests.push(...uniqueNewInterests);
                profileUpdated = true;
            }
        }
        if (extractedData.newFacts && Array.isArray(extractedData.newFacts)) {
            const uniqueNewFacts = extractedData.newFacts.filter((fact: string) => !userProfile.facts.includes(fact));
            if (uniqueNewFacts.length > 0) {
                userProfile.facts.push(...uniqueNewFacts);
                profileUpdated = true;
            }
        }
        if (extractedData.updatedPreferences && typeof extractedData.updatedPreferences === 'object') {
            for (const [key, value] of Object.entries(extractedData.updatedPreferences)) {
                if (userProfile.preferences[key] !== value) {
                    userProfile.preferences[key] = value as string;
                    profileUpdated = true;
                }
            }
        }

        if (profileUpdated) {
            await saveUserProfileToFirebase();
            updateProfileScreenUI();
        }

    } catch (e) {
        console.error("Error extracting or parsing user info from Gemini:", e, "\nRaw response text:", geminiResponse?.text);
    }
}


function updateProfileScreenUI() {
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (currentUser) {
        if (profileUserName) profileUserName.textContent = userProfile.name || currentUser.displayName || currentUser.email?.split('@')[0] || "User Name";
        if (profileUserEmail) profileUserEmail.textContent = currentUser.email || "user.email@example.com";
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        if (profileUserName) profileUserName.textContent = "User Name";
        if (profileUserEmail) profileUserEmail.textContent = "user.email@example.com";
        if (logoutButton) logoutButton.style.display = 'none';
    }

    const noDataText = currentLanguage === 'ar' ? "لم يتم التسجيل بعد." : "Not yet recorded.";
    if (profileInterests) profileInterests.textContent = userProfile.interests.length > 0 ? userProfile.interests.join(', ') : noDataText;
    if (profilePreferences) {
        const prefsText = Object.entries(userProfile.preferences).map(([k, v]) => `${k}: ${v}`).join('; ');
        profilePreferences.textContent = prefsText || noDataText;
    }
    if (profileFacts) profileFacts.textContent = userProfile.facts.length > 0 ? userProfile.facts.join('; ') : noDataText;
}


// --- Screen Management ---
function showScreen(screenId: string) {
  if (!currentUser && screenId !== SPLASH_SCREEN_ID && screenId !== ONBOARDING_SCREEN_ID && screenId !== SIGNIN_SCREEN_ID) {
    console.log("User not authenticated. Redirecting to sign-in.");
    currentScreen = SIGNIN_SCREEN_ID;
    screens.forEach(id => {
        const screenElement = document.getElementById(id);
        if (screenElement) {
            screenElement.style.display = (id === SIGNIN_SCREEN_ID) ? 'flex' : 'none';
        }
    });
    updateNavigationActiveState(SIGNIN_SCREEN_ID);
    return;
  }

  const isOverlayScreen = screenId === WEBVIEW_SCREEN_ID || screenId === IMAGE_VIEWER_SCREEN_ID || screenId === CODE_CANVAS_SCREEN_ID || screenId === FULL_SCREEN_PREVIEW_ID;

  if (!isOverlayScreen) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    if (isListening && screenId !== CHAT_SCREEN_ID && recognition) {
        recognition.stop();
    }
  }

  screens.forEach(id => {
    const screenElement = document.getElementById(id);
    if (screenElement) {
        if (id === WEBVIEW_SCREEN_ID || id === IMAGE_VIEWER_SCREEN_ID || id === CODE_CANVAS_SCREEN_ID || id === FULL_SCREEN_PREVIEW_ID) {
            screenElement.classList.toggle('active', screenId === id);
        } else {
            screenElement.style.display = (id === screenId) ? 'flex' : 'none';
        }
    }
  });

  if (!isOverlayScreen) {
      currentScreen = screenId;
      updateNavigationActiveState(screenId);
  }

  if (screenId === CHAT_SCREEN_ID) {
    scrollToBottomChat();
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (!voiceModeActive && chatInput) {
        chatInput.focus();
        chatInput.placeholder = editingUserMessageId ? currentStrings.chatInputPlaceholderEditing : currentStrings.chatInputPlaceholder;
    } else if (chatInput) {
         chatInput.placeholder = currentStrings.chatInputPlaceholderVoice;
    }

    if (!geminiInitialized) initializeGeminiSDK();
    const currentSession = chatSessions.find(s => s.id === currentChatSessionId);
    if (chatScreenTitleElement) {
        let title = currentSession?.title || currentStrings.navNewChat;
        if (currentChatIsBasedOnTool) {
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            title = tool ? `Tool: ${tool.name}` : title;
        }
        chatScreenTitleElement.textContent = title;
    }

  } else if (screenId === CHAT_LIST_SCREEN_ID) {
    renderChatList();
  } else if (screenId === SETTINGS_SCREEN_ID) {
    applySettings();
    renderGeneralMemoriesList();
  } else if (screenId === PROFILE_SCREEN_ID) {
    updateProfileScreenUI();
  } else if (screenId === CODE_CANVAS_SCREEN_ID) {
      if(codeCanvasTextarea && codeCanvasViewMode === 'code') codeCanvasTextarea.focus();
      const isOpenedByPreviewButton = document.activeElement?.classList.contains('preview-code-btn');
      if (!isOpenedByPreviewButton) {
         setCodeCanvasView('code');
         if (codeCanvasEnterFullscreenButton) {
            codeCanvasEnterFullscreenButton.classList.add('hidden');
         }
      }
  } else if (screenId === IMAGE_STUDIO_SCREEN_ID) {
    if (!geminiInitialized) initializeGeminiSDK();
    if(imageStudioPromptInput) imageStudioPromptInput.focus();
    if(imageStudioEngineSelect) imageStudioEngineSelect.value = currentImageEngine;
  } else if (screenId === MEMORIES_SCREEN_ID) {
    renderMemoriesScreen();
  } else if (screenId === CREATE_TOOL_SCREEN_ID) {
    if (toolNameInput) toolNameInput.value = '';
    if (toolInstructionsInput) toolInstructionsInput.value = '';
    if (toolKnowledgeInput) toolKnowledgeInput.value = '';
    if (createToolErrorMessageElement) createToolErrorMessageElement.style.display = 'none';
  } else if (screenId === WEB_DEV_STUDIO_SCREEN_ID) {
    if (!geminiInitialized) initializeGeminiSDK();
    if (webDevPromptInput) webDevPromptInput.focus();
    renderWebDevArtifactList(); // Display current/last artifact set or empty state
    // If there's an active file, re-display its content
    if (activeWebDevFile) {
        displayWebDevFileContent(activeWebDevFile);
    } else if (currentWebDevStudioArtifactSet && currentWebDevStudioArtifactSet.files.length > 0) {
        // If no specific file active, show the first one (e.g., index.html)
        const firstHtmlFile = currentWebDevStudioArtifactSet.files.find(f => f.filename.toLowerCase().includes('index.html') || f.language === 'html');
        if (firstHtmlFile) displayWebDevFileContent(firstHtmlFile);
        else displayWebDevFileContent(currentWebDevStudioArtifactSet.files[0]); // Or just the first file
    } else {
        // Show default empty/instruction state for viewer
        if(webDevViewerTitleElement) webDevViewerTitleElement.textContent = (uiStrings[currentLanguage] as any).webDevViewerTitleDefault;
        if(webDevCodeViewerCodeElement) webDevCodeViewerCodeElement.textContent = '';
        if(webDevNoArtifactsMessageElement && webDevCodeViewerElement) {
            webDevNoArtifactsMessageElement.style.display = 'flex';
            if(webDevCodeViewerCodeElement) (webDevCodeViewerCodeElement.parentElement as HTMLElement).style.display = 'none'; // Hide pre
        }
        if(webDevRunProjectBtn) webDevRunProjectBtn.style.display = 'none';
        if(webDevCopyCodeBtn) webDevCopyCodeBtn.style.display = 'none';
    }
  }
}

function updateNavigationActiveState(activeScreenId: string) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        const button = item as HTMLButtonElement;
        let itemTarget = button.dataset.target;
        const effectiveTarget = itemTarget === 'chat-list-screen-home' ? CHAT_LIST_SCREEN_ID : itemTarget;

        const isActive = (effectiveTarget === activeScreenId) ||
                         (item.id === 'chat-list-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         (item.id === 'profile-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         (item.id === 'image-studio-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         (item.id === 'web-dev-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool);


        button.classList.toggle('active', isActive);
        const icon = button.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.classList.toggle('filled', isActive);
        }
    });

    document.querySelectorAll('#desktop-sidebar .sidebar-nav-item').forEach(item => {
        const button = item as HTMLButtonElement;
        let itemTarget = button.dataset.target;
        const effectiveTarget = itemTarget === 'chat-list-screen-home' ? CHAT_LIST_SCREEN_ID : itemTarget;

        const isActive = (effectiveTarget === activeScreenId) ||
                         (item.id === 'sidebar-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         (item.id === 'sidebar-create-tool-nav-btn' && activeScreenId === CREATE_TOOL_SCREEN_ID);


        button.classList.toggle('active', isActive);
        button.querySelector('.material-symbols-outlined')?.classList.toggle('filled', isActive);
    });
}


// --- Splash Screen Logic ---
const SPLASH_PROGRESS_BAR_ID = "splash-progress-bar";
const FULL_SCREEN_PREVIEW_ID = "full-screen-preview-overlay"; // For overlays list

function initSplash() {
  showScreen(SPLASH_SCREEN_ID);
  const progressBar = document.getElementById(SPLASH_PROGRESS_BAR_ID) as HTMLDivElement | null;
  if(progressBar) progressBar.style.width = '0%'; // Ensure it starts at 0
  setTimeout(() => {
    if(progressBar) progressBar.style.width = '100%';
  }, 100); // Small delay to ensure transition catches
}

// --- Onboarding Logic ---
let currentOnboardingStep = 0;
const totalOnboardingSteps = 3;

const onboardingContent = [
    { titleKey: "onboardingTitleAI", mainKey: "onboardingMainAI", subKey: "onboardingSubAI", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDISnZDku6mxFufrdwyE8U_z3gRZvZUH6Sr7mxWY8opjTDKQYYYW4ButLoD-XUfyYe42PyqETKsHsJlrKL83tNQdCJE60dHYZf_WPlpQtZpJ0Zn1HKjhKBHrxuB0mY7ZlveDIl1oKPhbQT5GoxP-abVe_hkaPNsjY4FF-30GfB-wG9C456BvxyI7s1yE0A7J4CFCSN7SQhHazA_I8NTgQryctLNxst4uLDyUV-ZGE9ol4U8MzmCVKUkH5WsMdau8gpXcxZYvPD9Wj0" },
    { titleKey: "onboardingTitleFeatures", mainKey: "onboardingMainFeatures", subKey: "onboardingSubFeatures", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ3_Qx8E2595F0vuD5DRTrUgbj-T8z-A1qQ2g6yE6y4F5R3N7vC8sW2nZ9vD9kY7lX1uJ6oE9rI5vA0qU3jM2kP0tW1xS_yL2hR4oB_qF6aI3nJ2vR1gXwZ_zH_qK3" },
    { titleKey: "onboardingTitleGetStarted", mainKey: "onboardingMainGetStarted", subKey: "onboardingSubGetStarted", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpR6M9H8nQ_iL4tK7rP2oV_wX7zT_sJqO9nF0cM_lU_pP_wBvY_qZ8xR7yK6oO7tL9vX_jE0dD1mY_gS_aA1bE2vJ3pH0sC9nM_gS7rP0vL1nX_hE1fB0a" }
];
// Add these keys to uiStrings
// en: onboardingTitleAI: "AI Assistant", onboardingMainAI: "Your Personal AI Companion", onboardingSubAI: "Unlock the power of AI...", onboardingTitleFeatures: "Explore Features", etc.
// ar: ... corresponding translations ...


function updateOnboardingUI() {
  if (currentScreen !== ONBOARDING_SCREEN_ID) return;
  const langStrings = uiStrings[currentLanguage] || uiStrings.en;

  if(onboardingDots) {
      onboardingDots.forEach((dot, index) => {
        dot.classList.toggle('bg-[#19e5c6]', index === currentOnboardingStep);
        dot.classList.toggle('bg-[#34655e]', index !== currentOnboardingStep);
      });
  }
  const contentData = onboardingContent[currentOnboardingStep];
  const titleEl = document.getElementById('onboarding-title');
  const mainTextEl = document.getElementById('onboarding-main-text');
  const subTextEl = document.getElementById('onboarding-sub-text');
  const imageEl = document.getElementById('onboarding-image') as HTMLDivElement | null;

  if (titleEl && langStrings[contentData.titleKey as keyof typeof langStrings]) titleEl.textContent = langStrings[contentData.titleKey as keyof typeof langStrings];
  if (mainTextEl && langStrings[contentData.mainKey as keyof typeof langStrings]) mainTextEl.textContent = langStrings[contentData.mainKey as keyof typeof langStrings];
  if (subTextEl && langStrings[contentData.subKey as keyof typeof langStrings]) subTextEl.textContent = langStrings[contentData.subKey as keyof typeof langStrings];
  if (imageEl) imageEl.style.backgroundImage = `url("${contentData.image}")`;

  if (onboardingNextBtn) {
      const nextButtonTextSpan = onboardingNextBtn.querySelector('span');
      if(nextButtonTextSpan) nextButtonTextSpan.textContent = currentOnboardingStep === totalOnboardingSteps - 1 ? langStrings.onboardingGetStarted : langStrings.onboardingNext;
  }
}

// --- Chat History & Session Logic (Firebase based) ---
async function saveChatSessionsToFirebase() {
  if (!currentUser || !firebaseDb) return;
  try {
    // Firebase does not allow undefined values. Sanitize sessions.
    const sanitizedSessions = JSON.parse(JSON.stringify(chatSessions, (key, value) => {
        return (value === undefined) ? null : value;
    }));
    await firebaseDb.ref(`users/${currentUser.uid}/chatSessions`).set(sanitizedSessions);
    console.log("Chat sessions saved to Firebase.");
  } catch (error) {
    console.error("Error saving chat sessions to Firebase:", error);
  }
}

async function loadChatSessionsFromFirebase() {
  if (!currentUser || !firebaseDb) {
    chatSessions = [];
    renderChatList();
    return;
  }
  try {
    const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/chatSessions`).once('value');
    if (snapshot.exists()) {
      chatSessions = snapshot.val();
      chatSessions.forEach(session => {
          session.messages = session.messages || [];
          // Ensure basedOnToolId is correctly handled (should be string or undefined, not null if it was saved as null meaning "not present")
          if (session.basedOnToolId === null) session.basedOnToolId = undefined;
      });
    } else {
      chatSessions = [];
    }
  } catch (error) {
    console.error("Error loading chat sessions from Firebase:", error);
    chatSessions = [];
  }
  renderChatList();
}

async function deleteChatSession(sessionId: string) {
    const sessionToDelete = chatSessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    const confirmDelete = confirm(`Are you sure you want to delete chat "${sessionToDelete.title}"? This action cannot be undone.`);
    if (confirmDelete) {
        chatSessions = chatSessions.filter(s => s.id !== sessionId);
        await saveChatSessionsToFirebase();

        if (currentChatSessionId === sessionId) {
            currentChatSessionId = null;
            if (currentScreen === CHAT_SCREEN_ID) {
                showScreen(CHAT_LIST_SCREEN_ID);
            }
        }
        renderChatList();
    }
}

// --- Custom Tools Logic (Firebase based) ---
async function saveCustomToolsToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
        const sanitizedTools = JSON.parse(JSON.stringify(customTools, (key, value) => {
            return (value === undefined) ? null : value;
        }));
        await firebaseDb.ref(`users/${currentUser.uid}/customTools`).set(sanitizedTools);
        console.log("Custom tools saved to Firebase.");
    } catch (error) {
        console.error("Error saving custom tools to Firebase:", error);
    }
}
async function loadCustomToolsFromFirebase() {
    if (!currentUser || !firebaseDb) {
        customTools = [];
        renderChatList();
        return;
    }
    try {
        const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/customTools`).once('value');
        customTools = snapshot.exists() ? snapshot.val() : [];
        // Ensure knowledge is string or undefined, not null from Firebase
        customTools.forEach(tool => {
            if (tool.knowledge === null) tool.knowledge = undefined;
        });
    } catch (error) {
        console.error("Error loading custom tools from Firebase:", error);
        customTools = [];
    }
    renderChatList();
}
async function handleSaveTool() {
    if (!toolNameInput || !toolInstructionsInput || !toolKnowledgeInput || !createToolErrorMessageElement) return;
    const name = toolNameInput.value.trim();
    const instructions = toolInstructionsInput.value.trim();
    const knowledge = toolKnowledgeInput.value.trim();

    if (!name || !instructions) {
        if (createToolErrorMessageElement) {
            createToolErrorMessageElement.textContent = "Tool Name and Instructions are required.";
            createToolErrorMessageElement.style.display = 'block';
        }
        return;
    }
    if (createToolErrorMessageElement) createToolErrorMessageElement.style.display = 'none';

    const newTool: CustomTool = {
        id: `tool-${Date.now()}`,
        name,
        instructions,
        knowledge: knowledge || undefined,
        icon: 'construction',
        lastUsed: Date.now()
    };
    customTools.push(newTool);
    await saveCustomToolsToFirebase();
    renderChatList();
    showScreen(CHAT_LIST_SCREEN_ID);
}

function startChatWithTool(toolId: string) {
    const tool = customTools.find(t => t.id === toolId);
    if (!tool) {
        console.error("Tool not found:", toolId);
        displaySystemMessage("Error: Could not start chat with this tool.", CHAT_SCREEN_ID);
        return;
    }

    currentChatSessionId = null;
    currentChatIsBasedOnTool = tool.id;
    editingUserMessageId = null;
    if (chatInput) chatInput.value = '';

    if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';
    if (!geminiInitialized && !initializeGeminiSDK()) {
        displaySystemMessage("Error: AI Service not available.", CHAT_SCREEN_ID);
        return;
    }

    let systemInstructionText = tool.instructions;
    if (tool.knowledge) {
        systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
    }
    const supplementalInstructions = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false);
    systemInstructionText += supplementalInstructions;


    geminiChat = ai.chats.create({
        model: TEXT_MODEL_NAME,
        config: { systemInstruction: systemInstructionText }
    });

    if (chatScreenTitleElement) chatScreenTitleElement.textContent = `Tool: ${tool.name}`;

    const initialGreetingText = `Using tool: ${tool.name}. How can I assist you with this tool?`;
    const initialGreetingLang = detectMessageLanguage(initialGreetingText);
    const initialMessageId = `msg-system-tool-${Date.now()}`;
    appendMessage("Nova (Tool Mode)", initialGreetingText, 'ai', false, null, true, null, initialGreetingLang, initialMessageId, 'text', null, null);
    showScreen(CHAT_SCREEN_ID);
    if (voiceModeActive && !isListening) {
        handleMicInput();
    }
}

async function handleDeleteTool(toolId: string) {
    const toolToDelete = customTools.find(t => t.id === toolId);
    if (!toolToDelete) return;

    const confirmDelete = confirm(`Are you sure you want to delete the tool "${toolToDelete.name}"? This action cannot be undone.`);
    if (confirmDelete) {
        customTools = customTools.filter(t => t.id !== toolId);
        await saveCustomToolsToFirebase();
        renderChatList();

        if (currentChatIsBasedOnTool === toolId && currentScreen === CHAT_SCREEN_ID) {
            createNewChatSession();
        }
    }
}


// --- Manual Memories Logic (Firebase based, Chat-specific) ---
async function saveSavedMemoriesToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
         const sanitizedMemories = JSON.parse(JSON.stringify(savedMemories, (key, value) => {
            return (value === undefined) ? null : value;
        }));
        await firebaseDb.ref(`users/${currentUser.uid}/savedMemories`).set(sanitizedMemories);
        console.log("Chat-specific memories saved to Firebase.");
    } catch (error) {
        console.error("Error saving chat-specific memories to Firebase:", error);
    }
}
async function loadSavedMemoriesFromFirebase() {
    if (!currentUser || !firebaseDb) {
        savedMemories = [];
        renderMemoriesScreen();
        return;
    }
    try {
        const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/savedMemories`).once('value');
        savedMemories = snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
        console.error("Error loading chat-specific memories from Firebase:", error);
        savedMemories = [];
    }
    renderMemoriesScreen();
}
async function handleSaveToMemory(messageId: string, messageText: string, sender: ChatMessage['sender'], chatId: string | null) {
    if (!currentUser) return;
    const memory: SavedMemory = {
        id: `mem-${Date.now()}`,
        text: messageText,
        sender: sender,
        chatId: chatId || currentChatSessionId,
        originalMessageId: messageId,
        timestamp: Date.now(),
        userId: currentUser.uid
    };
    savedMemories.push(memory);
    await saveSavedMemoriesToFirebase();

    const saveBtn = document.querySelector(`.message-action-btn.save-memory-btn[data-message-id="${messageId}"]`) as HTMLButtonElement | null;
    if (saveBtn) {
        const originalTextEl = saveBtn.querySelector('span:not(.material-symbols-outlined)');
        const originalText = originalTextEl ? originalTextEl.textContent : "Save to Memory";
        saveBtn.innerHTML = `<span class="material-symbols-outlined">bookmark_added</span> Saved!`;
        saveBtn.disabled = true;
        setTimeout(() => {
             saveBtn.innerHTML = `<span class="material-symbols-outlined">bookmark_add</span> ${originalText}`;
             saveBtn.disabled = false;
        }, 2000);
    }
    addProcessLogEntry(`Message saved to memory: "${messageText.substring(0, 30)}..."`);
}

function renderMemoriesScreen() {
    if (!memoriesListContainer) return;
    memoriesListContainer.innerHTML = '';
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;

    const userMemories = savedMemories.filter(m => m.userId === currentUser?.uid);
    if (userMemories.length === 0) {
        memoriesListContainer.innerHTML = `<p class="text-center text-[#7A9A94] p-8">${currentStrings.memoriesNone}</p>`;
        return;
    }

    userMemories.sort((a, b) => b.timestamp - a.timestamp).forEach(memory => {
        const memoryCard = document.createElement('div');
        memoryCard.className = 'bg-[#1A3A35] p-4 rounded-lg shadow text-white';
        const textP = document.createElement('p');
        textP.className = 'text-sm mb-1 break-words';
        textP.textContent = memory.text;
        const dateP = document.createElement('p');
        dateP.className = 'text-xs text-[#A0E1D9]';
        dateP.textContent = `Saved: ${new Date(memory.timestamp).toLocaleString()} (from ${memory.sender})`;

        memoryCard.appendChild(textP);
        memoryCard.appendChild(dateP);
        memoriesListContainer.appendChild(memoryCard);
    });
}

// --- General Memories Logic (Firebase based, from Settings) ---
async function saveGeneralMemoriesToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
        const sanitizedMemories = JSON.parse(JSON.stringify(generalMemories, (key, value) => {
            return (value === undefined) ? null : value;
        }));
        await firebaseDb.ref(`users/${currentUser.uid}/generalMemories`).set(sanitizedMemories);
        console.log("General memories saved to Firebase.");
    } catch (error) {
        console.error("Error saving general memories to Firebase:", error);
    }
}
async function loadGeneralMemoriesFromFirebase() {
    if (!currentUser || !firebaseDb) {
        generalMemories = [];
        renderGeneralMemoriesList();
        return;
    }
    try {
        const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/generalMemories`).once('value');
        generalMemories = snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
        console.error("Error loading general memories from Firebase:", error);
        generalMemories = [];
    }
    renderGeneralMemoriesList();
}
async function handleSaveGeneralMemory() {
    if (!generalMemoryInput || !currentUser) return;
    const text = generalMemoryInput.value.trim();
    if (!text) return;

    const newMemory: GeneralMemory = {
        id: `genmem-${Date.now()}`,
        text: text,
        timestamp: Date.now(),
        userId: currentUser.uid
    };
    generalMemories.push(newMemory);
    await saveGeneralMemoriesToFirebase();
    generalMemoryInput.value = '';
    renderGeneralMemoriesList();
}
async function handleDeleteGeneralMemory(memoryId: string) {
    generalMemories = generalMemories.filter(mem => mem.id !== memoryId);
    await saveGeneralMemoriesToFirebase();
    renderGeneralMemoriesList();
}
function renderGeneralMemoriesList() {
    if (!generalMemoriesListContainer) return;
    generalMemoriesListContainer.innerHTML = '';
    const userGeneralMems = generalMemories.filter(m => m.userId === currentUser?.uid);
    userGeneralMems.sort((a,b) => b.timestamp - a.timestamp).forEach(memory => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'general-memory-item flex justify-between items-center text-sm';
        itemDiv.innerHTML = `
            <p class="flex-grow break-words mr-2">${escapeHTML(memory.text)}</p>
            <button data-id="${memory.id}" class="delete-general-memory-btn text-red-400 hover:text-red-600 p-1" aria-label="Delete general memory">
                <span class="material-symbols-outlined text-base">delete</span>
            </button>
        `;
        generalMemoriesListContainer.appendChild(itemDiv);
    });
}


function getRelativeTime(timestamp: number): string {
    const now = new Date().getTime();
    const seconds = Math.round((now - timestamp) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}


function renderChatList() {
  if (!chatListItemsContainer) return;
  chatListItemsContainer.innerHTML = '';

  if (!currentUser) {
      chatListItemsContainer.innerHTML = `<p class="text-center text-[#7A9A94] p-8 lg:p-12">Please sign in to see your chats & tools.</p>`;
      return;
  }

  const sessionsArray = Array.isArray(chatSessions) ? chatSessions : [];
  const toolsArray = Array.isArray(customTools) ? customTools : [];


  const combinedItems: (ChatSession | (CustomTool & { type: 'tool', lastUpdated: number }))[] = [];
  sessionsArray.forEach(session => combinedItems.push(session));
  toolsArray.forEach(tool => combinedItems.push({ ...tool, type: 'tool', lastUpdated: tool.lastUsed || 0 }));

  if (combinedItems.length === 0) {
    chatListItemsContainer.innerHTML = `<p class="text-center text-[#7A9A94] p-8 lg:p-12">No chats or tools yet. Start a new one or create a tool!</p>`;
    return;
  }

  const sortedItems = combinedItems.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
  const searchInput = document.getElementById('search-chats-tools-input') as HTMLInputElement | null;
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";


  sortedItems
    .filter(item => {
        if (!searchTerm) return true;
        const name = 'messages' in item ? (item as ChatSession).title : (item as CustomTool).name;
        const type = 'messages' in item ? 'chat' : 'tool';
        const instructions = type === 'tool' ? (item as CustomTool).instructions : '';
        return name.toLowerCase().includes(searchTerm) ||
               (type === 'tool' && instructions && instructions.toLowerCase().includes(searchTerm));
    })
    .forEach(item => {
    const itemOuterDiv = document.createElement('div');
    itemOuterDiv.className = 'chat-list-item flex items-center justify-between gap-2 px-4 py-3 hover:bg-[#1B302C]/50 transition-colors cursor-pointer lg:py-4 lg:px-6';

    const itemType = 'messages' in item ? 'chat' : 'tool';

    itemOuterDiv.dataset.id = item.id;
    itemOuterDiv.dataset.type = itemType;

    itemOuterDiv.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.delete-chat-btn') || target.closest('.delete-tool-btn')) {
            return;
        }
        if (itemType === 'tool') {
            startChatWithTool(item.id);
        } else {
            loadChat(item.id);
        }
    });

    const leftContentDiv = document.createElement('div');
    leftContentDiv.className = 'flex items-center gap-4 flex-grow overflow-hidden';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'text-[#19E5C6] flex items-center justify-center rounded-xl bg-[#1B302C] shrink-0 size-12 lg:size-14';

    const textContentDiv = document.createElement('div');
    textContentDiv.className = 'flex-grow overflow-hidden';
    const titleH3 = document.createElement('h3');
    titleH3.className = 'text-white text-base lg:text-lg font-medium leading-tight truncate';

    const subTextP = document.createElement('p');
    subTextP.className = 'text-[#7A9A94] text-sm lg:text-base font-normal leading-snug line-clamp-1';

    if (itemType === 'tool') {
        const toolItem = item as (CustomTool & { type: 'tool', lastUpdated: number });
        iconDiv.innerHTML = `<span class="material-symbols-outlined text-3xl">${toolItem.icon || 'construction'}</span>`;
        titleH3.textContent = `Tool: ${toolItem.name}`;
        subTextP.textContent = toolItem.instructions.substring(0, 50) + (toolItem.instructions.length > 50 ? "..." : "");
    } else {
        const chatSessionItem = item as ChatSession;
        iconDiv.innerHTML = `<svg fill="currentColor" height="28px" viewBox="0 0 256 256" width="28px" xmlns="http://www.w3.org/2000/svg"><path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"></path></svg>`;
        titleH3.textContent = chatSessionItem.title;

        let lastMeaningfulMessage = 'No messages yet';
        if (chatSessionItem.messages && chatSessionItem.messages.length > 0) {
            const lastMsg = chatSessionItem.messages[chatSessionItem.messages.length - 1];
            if (lastMsg.messageType === 'image' && lastMsg.imageData?.promptForImage) {
                lastMeaningfulMessage = `[Image: ${lastMsg.imageData.promptForImage.substring(0,30)}...]`;
            } else if (lastMsg.userUploadedFile?.name) {
                lastMeaningfulMessage = `[${lastMsg.userUploadedFile.isImage ? "Image" : "File"}: ${lastMsg.userUploadedFile.name}] ${lastMsg.text.substring(0,30)}...`;
            }
            else {
                lastMeaningfulMessage = lastMsg.text;
            }
        }
        subTextP.textContent = lastMeaningfulMessage;
        const lastMessageLang = chatSessionItem.messages && chatSessionItem.messages.length > 0 ? detectMessageLanguage(chatSessionItem.messages[chatSessionItem.messages.length - 1].text) : 'unknown';
        if (lastMessageLang === 'ar') {
            titleH3.dir = "rtl";
            subTextP.dir = "rtl";
            subTextP.style.textAlign = "right";
        } else {
            titleH3.dir = "auto";
            subTextP.dir = "auto";
            subTextP.style.textAlign = "left";
        }
    }

    textContentDiv.appendChild(titleH3);
    textContentDiv.appendChild(subTextP);
    leftContentDiv.appendChild(iconDiv);
    leftContentDiv.appendChild(textContentDiv);

    const rightActions