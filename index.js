
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from "@google/genai";

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
const CREATE_TOOL_SCREEN_ID = "create-tool-screen"; // New
const MEMORIES_SCREEN_ID = "memories-screen"; // New


// DOM Elements
let chatMessagesContainer = null;
let chatInput = null;
let sendButton = null;
let suggestedPromptButtons;
let micButton = null;
let micButtonContainer = null;
let voiceModeToggle = null;
let chatListItemsContainer = null;
let chatScreenTitleElement = null;
let novaProcessingIndicatorElement = null;
let novaImageProcessingIndicatorElement = null;
let processLogPanelElement = null;
let processLogListElement = null;
let toggleProcessLogButtonElement = null;
let processLogCloseButtonElement = null;
// let generateImageChatButtonElement = null; // Replaced by popover item
let advancedOptionsButton = null;
let advancedOptionsPopover = null;
let popoverDeepThinkingToggle = null;
let popoverInternetSearchToggle = null;
let popoverScientificModeToggle = null;
let popoverUploadFileButton = null;
let popoverGenerateImageButton = null;
let popoverCodeCanvasButton = null;
let fileInputHidden = null;
let stagedFilePreviewElement = null; // For showing staged file
let stagedFileClearButton = null; // Button within stagedFilePreviewElement
let chatInputActionsArea = null;


// Settings Elements
let aiToneRadios;
let darkModeToggle = null;
let ttsToggle = null;
let internetSearchToggle = null;
let deepThinkingToggle = null;
let creativityLevelSelect = null; // New for creativity/temperature
let advancedScientificModeToggle = null;
let settingLanguageSelect = null;
let generalMemoryInput = null;
let saveGeneralMemoryButton = null;
let generalMemoriesListContainer = null;


// Profile Screen Elements
let profileUserName = null;
let profileUserEmail = null;
let profileInterests = null;
let profilePreferences = null;
let profileFacts = null;
let logoutButton = null;
let viewMemoriesButton = null; // New

// Memories Screen Elements (New)
let memoriesListContainer = null;
let memoriesBackButton = null;


// Webview Elements
let webviewScreenElement = null;
let webviewFrame = null;
let webviewTitle = null;
let webviewLoading = null;
let webviewCloseBtn = null;

// Image Viewer Elements
let imageViewerScreenElement = null;
let imageViewerImg = null;
let imageViewerCloseBtn = null;

// Onboarding Elements
let onboardingDots;
let onboardingNextBtn = null;
let onboardingSkipBtn = null;

// Code Canvas Elements
// let codeCanvasButton = null; // Replaced by popover item
let codeCanvasScreenElement = null;
let codeCanvasTextarea = null;
let codeCanvasCopyToChatButton = null;
let codeCanvasCloseButton = null;
let codeEditorWrapper = null;
let codeCanvasInlinePreviewIframe = null;
let codeCanvasToggleViewButton = null;
let codeCanvasEnterFullscreenButton = null;

let fullScreenPreviewOverlay = null;
let fullScreenPreviewIframe = null;
let fullScreenPreviewCloseButton = null;

let codeCanvasViewMode = 'code';
let debounceTimer;

// Image Studio Elements
let imageStudioPromptInput = null;
let imageStudioEngineSelect = null;
let imageStudioAspectRatioSelect = null;
let imageStudioGenerateButton = null;
let imageStudioLoadingIndicator = null;
let imageStudioErrorMessageElement = null;
let imageStudioGridElement = null;
let imageStudioDownloadAllButton = null;
let currentGeneratedImagesData = [];

// Sign-In Screen Elements
let signinEmailInput = null;
let signinPasswordInput = null;
let signinButton = null;
let signupButton = null;
let authErrorMessageElement = null;

// Create Tool Screen Elements (New)
let createToolScreenElement = null;
let toolNameInput = null;
let toolInstructionsInput = null;
let toolKnowledgeInput = null;
let saveToolButton = null;
let createToolBackButton = null;
let createToolErrorMessageElement = null;
let chatListCreateToolButton = null; // For mobile header

// Desktop Sidebar
let desktopSidebar = null;
let toggleSidebarButton = null;
let appMainContent = null;


// Global State
let currentScreen = SPLASH_SCREEN_ID;
const screens = [SPLASH_SCREEN_ID, ONBOARDING_SCREEN_ID, SIGNIN_SCREEN_ID, CHAT_LIST_SCREEN_ID, CHAT_SCREEN_ID, SETTINGS_SCREEN_ID, PROFILE_SCREEN_ID, WEBVIEW_SCREEN_ID, IMAGE_VIEWER_SCREEN_ID, CODE_CANVAS_SCREEN_ID, IMAGE_STUDIO_SCREEN_ID, CREATE_TOOL_SCREEN_ID, MEMORIES_SCREEN_ID];
let ai;
let geminiChat;
let isLoading = false;
let isImageLoading = false;
let geminiInitialized = false;
let processLogVisible = false;
let simulatedProcessInterval;


let chatSessions = [];
let currentChatSessionId = null;
let userProfile = { interests: [], preferences: {}, facts: [] };
let savedMemories = []; // Chat-specific saved memories
let generalMemories = []; // General memories from settings
let customTools = [];
let stagedFile = null;
let editingUserMessageId = null; // For editing user messages


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
let currentChatIsBasedOnTool = null;
let currentCreativityLevel = 'balanced'; // New for temperature control
let currentLanguage = 'en'; // Default language
let isSidebarCollapsed = false;


// Firebase State
let firebaseApp;
let firebaseAuth;
let firebaseDb; // Firebase Realtime Database reference
let currentUser = null;


// Web Speech API
const WebSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
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
        splashVersion: "Version 2.0.2",
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
        navNewChat: "New Chat",
        navProfile: "Profile",
        navSettings: "Settings",
    },
    ar: {
        // Splash
        splashVersion: "الإصدار 2.0.2",
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
        navNewChat: "دردشة جديدة",
        navProfile: "الملف الشخصي",
        navSettings: "الإعدادات",
    }
};


// --- START OF CORE CHAT AND GEMINI FUNCTIONS ---

function detectMessageLanguage(text) {
    if (!text) return 'unknown';
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(text)) {
        return 'ar';
    }
    return 'en';
}

function getSystemInstruction(tone, profile, isDeepThinking, isInternetSearch, isToolChat = false, isAdvancedScientificMode = false) {
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


function initializeGeminiSDK() {
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
    } else {
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
    } else {
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
  if (stagedFilePreviewElement && stagedFileClearButton) {
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
  appendMessage("Nova", initialGreetingText, 'ai', false, null, true, null, initialGreetingLang, initialMessageId, 'text');
  showScreen(CHAT_SCREEN_ID);
   if (voiceModeActive && !isListening) {
     handleMicInput();
   }
}

function loadChat(sessionId) {
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


  if (stagedFilePreviewElement && stagedFileClearButton) {
    stagedFile = null;
    updateStagedFilePreview();
  }

  if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';

  if (!geminiInitialized && !initializeGeminiSDK()) {
    displaySystemMessage("Error: AI Service not available.", CHAT_SCREEN_ID);
    return;
  }

  const history = session.messages
    .filter(msg => msg.sender !== 'System')
    .map(msg => {
        const parts = [];
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
          session.basedOnToolId = undefined;
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
        msg.sender === 'User' ? 'user' : (msg.sender === 'System' ? 'ai' : 'ai'),
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

async function generateChatTitle(firstUserMsg, firstAiMsg) {
    const defaultTitle = firstUserMsg.substring(0, 25) + (firstUserMsg.length > 25 ? "..." : "");
    if (!ai || !geminiInitialized) {
        return defaultTitle;
    }
    try {
        const prompt = `Based on this initial exchange, suggest a very short, concise title (max 5 words) for this chat conversation:
User: "${firstUserMsg.substring(0, 100)}${firstUserMsg.length > 100 ? "..." : ""}"
AI: "${firstAiMsg.substring(0, 100)}${firstAiMsg.length > 100 ? "..." : ""}"
Title:`;
        const response = await ai.models.generateContent({
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

function disableChatInput(textLoading, imageLoading) {
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

function displaySystemMessage(text, screenIdContext, lang = 'en') {
    if (screenIdContext === CHAT_SCREEN_ID && chatMessagesContainer) {
         const systemMessageId = `sys-msg-${Date.now()}`;
         appendMessage("System", text, 'ai', false, null, true, null, lang, systemMessageId, 'text');
    } else {
        console.warn(`System Message (screen: ${screenIdContext}): ${text}`);
    }
}

function appendMessage(senderName, textOrData, type, isStreaming = false, existingMessageDiv = null, isInitialSystemMessage = false, sources = null, detectedLang, messageId, messageType = 'text', imageData, userUploadedFile) {
  if (!chatMessagesContainer) return null;

  let messageWrapper;
  let messageContentHolder;
  let aiMessageContentDiv = null;
  let contentWrapperDiv;
  let senderNameParaElement;

  const contentLanguage = detectedLang || detectMessageLanguage(typeof textOrData === 'string' ? textOrData : (imageData?.promptForImage || userUploadedFile?.name || ""));
  const domId = messageId || existingMessageDiv?.id || `msg-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  let messageSenderLine;

  if (existingMessageDiv && (messageType === 'text' || (messageType === 'image' && !isStreaming))) {
    messageWrapper = existingMessageDiv;
    contentWrapperDiv = messageWrapper.querySelector('.user-message-content-wrapper, .ai-message-content-wrapper');
    messageSenderLine = contentWrapperDiv?.querySelector('.message-sender-line');
    senderNameParaElement = messageSenderLine?.querySelector('.message-sender-name');
    const existingContentHolder = messageWrapper.querySelector('.message-text, .ai-message-image-container');
    aiMessageContentDiv = messageWrapper.querySelector('.ai-message-content');

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
    // messageSenderLine.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr'; // Set dir here as well for correct flex alignment

    senderNameParaElement = document.createElement('p');
    senderNameParaElement.className = 'text-[#A0E1D9] text-xs lg:text-sm font-medium leading-normal message-sender-name flex-grow'; // Added flex-grow
    senderNameParaElement.textContent = senderName;

    messageContentHolder = document.createElement('div'); // Generic holder

    if (type === 'ai') {
        aiMessageContentDiv = document.createElement('div'); // Bubble for AI
        aiMessageContentDiv.className = 'ai-message-content bg-[#1A3A35] text-white rounded-xl rounded-bl-none shadow-md overflow-hidden lg:rounded-lg';
    } else { // User message bubble
        messageContentHolder.className = 'message-text text-base lg:text-lg font-normal leading-relaxed rounded-xl px-4 py-3 shadow-md break-words rounded-br-none bg-[#19e5c6] text-[#0C1A18]';
    }


    // Assemble the message structure
    if (type === 'user') {
      messageWrapper.classList.add('justify-end');
      contentWrapperDiv.classList.add('items-end');
      avatarDiv.style.backgroundImage = `url("${USER_AVATAR_URL}")`;
      // Append sender name to its line first
      messageSenderLine.appendChild(senderNameParaElement); // This will make name appear on left in LTR
      contentWrapperDiv.appendChild(messageSenderLine);
      contentWrapperDiv.appendChild(messageContentHolder); // User bubble is messageContentHolder itself
      messageWrapper.appendChild(contentWrapperDiv);
      messageWrapper.appendChild(avatarDiv);
    } else { // AI or System message
      messageWrapper.classList.add('justify-start');
      contentWrapperDiv.classList.add('items-start');
      avatarDiv.style.backgroundImage = `url("${AI_AVATAR_URL}")`;

      if (senderName === "System") { // Special styling for system messages
         avatarDiv.style.opacity = "0.6";
         if (aiMessageContentDiv) aiMessageContentDiv.classList.add('opacity-90', 'italic', 'bg-[#222]'); // Darker, italic for system
      }
      messageSenderLine.appendChild(senderNameParaElement);
      contentWrapperDiv.appendChild(messageSenderLine);
      if(aiMessageContentDiv) { // AI messages use the styled bubble
        aiMessageContentDiv.appendChild(messageContentHolder);
        contentWrapperDiv.appendChild(aiMessageContentDiv);
      } else { // Should not be reached for type 'ai' as aiMessageContentDiv is created
        contentWrapperDiv.appendChild(messageContentHolder);
      }
      messageWrapper.appendChild(avatarDiv);
      messageWrapper.appendChild(contentWrapperDiv);
    }
    chatMessagesContainer.appendChild(messageWrapper);
  }

    // Populate content holder (must happen after it's in the DOM or if existing)
    if (messageType === 'text') {
        messageContentHolder.classList.add('message-text', 'text-base', 'lg:text-lg', 'font-normal', 'leading-relaxed', 'break-words');
        if (type === 'ai' && aiMessageContentDiv && !messageContentHolder.classList.contains('px-4')) { // Apply padding inside AI bubble for text
            messageContentHolder.classList.add('px-4', 'py-3', 'lg:px-5', 'lg:py-4');
        }
        let currentText = textOrData;
        if (userUploadedFile) { // Prepend file info if it's a user message with a file
            const filePreamble = `Analyzing ${userUploadedFile.isImage ? "image" : "file"}: <i>${escapeHTML(userUploadedFile.name)}</i>.\n`;
            currentText = `${filePreamble}${textOrData}`; // textOrData is user's query text
        }
        messageContentHolder.innerHTML = renderMarkdownToHTML(currentText);
    } else if (messageType === 'image' && imageData) { // AI generated image
        messageContentHolder.classList.add('ai-message-image-container'); // Basic class for image holder
        if(!messageContentHolder.classList.contains('p-3')) messageContentHolder.classList.add('p-3'); // Ensure padding if not already there

        const promptPara = document.createElement('p');
        promptPara.className = 'ai-image-prompt-text text-xs text-gray-300 mb-2 px-1';
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
        downloadBtn.className = 'download-in-chat-image-btn mt-2 ml-auto flex items-center gap-1 text-xs px-2 py-1 bg-[#244742] hover:bg-[#19e5c6] text-[#A0E1D9] hover:text-[#0C1A18] rounded-md transition-colors';
        downloadBtn.innerHTML = `<span class="material-symbols-outlined text-sm">download</span> Download`;
        downloadBtn.dataset.base64 = imageData.base64;
        downloadBtn.dataset.mime = imageData.mimeType;
        downloadBtn.dataset.prompt = imageData.promptForImage;
        messageContentHolder.appendChild(downloadBtn);
    }

    // Set directionality for content and sender name
    messageContentHolder.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (senderNameParaElement) senderNameParaElement.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr';
    if (messageSenderLine) messageSenderLine.dir = contentLanguage === 'ar' ? 'rtl' : 'ltr'; // RTL for message sender line


  // --- Render Sources (for AI text messages) ---
  if (type === 'ai' && messageType === 'text' && sources && sources.length > 0 && chatMessagesContainer) {
    const sourcesContainerId = domId + '-sources';
    let sourcesContainer = document.getElementById(sourcesContainerId); // Cast as HTMLDivElement | null

    if (!sourcesContainer) { // Create if doesn't exist
        sourcesContainer = document.createElement('div');
        sourcesContainer.id = sourcesContainerId;
        // Adjust margin to align with AI text (considering avatar and gap)
        sourcesContainer.className = 'chat-message-external-sources ml-[calc(3rem+0.75rem)] mr-4 my-1 p-2 bg-[#102824] rounded-md text-xs'; // Tailwind: ml-[calc(2.5rem+0.75rem)] for w-10 avatar, ml-[calc(3rem+0.75rem)] for w-12 avatar
        if (contentLanguage === 'ar') {
             sourcesContainer.dir = 'rtl';
             sourcesContainer.classList.remove('ml-[calc(3rem+0.75rem)]', 'mr-4');
             sourcesContainer.classList.add('mr-[calc(3rem+0.75rem)]', 'ml-4'); // RTL margins
        } else {
            sourcesContainer.dir = 'ltr';
        }

        // Insert after the main message bubble
        if (messageWrapper.nextSibling) {
            chatMessagesContainer.insertBefore(sourcesContainer, messageWrapper.nextSibling);
        } else {
            chatMessagesContainer.appendChild(sourcesContainer);
        }
    }

    sourcesContainer.innerHTML = ''; // Clear previous sources if any (e.g., from streaming updates)

    const sourcesHeading = document.createElement('h4');
    sourcesHeading.textContent = contentLanguage === 'ar' ? "المصادر:" : "Sources:";
    sourcesHeading.className = "text-[#A0E1D9] font-semibold mb-1";
    sourcesContainer.appendChild(sourcesHeading);

    const ol = document.createElement('ol');
    ol.className = "list-decimal list-inside text-gray-300 space-y-0.5";
    sources.forEach(source => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = source.uri;
        a.textContent = source.title || source.uri;
        a.className = 'webview-link text-[#19e5c6] hover:underline';
        a.dataset.url = source.uri;
        a.target = "_blank";
        a.rel = "noopener noreferrer"; // Security for new tab links

        li.appendChild(a);

        // Optionally display domain
        try {
            const domain = new URL(source.uri).hostname.replace(/^www\./, '');
            const domainSpan = document.createElement('span');
            domainSpan.className = 'source-domain text-gray-400 ml-1'; // Style for domain
            if (contentLanguage === 'ar') domainSpan.classList.replace('ml-1', 'mr-1');
            domainSpan.textContent = `(${domain})`;
            li.appendChild(domainSpan);
        } catch (e) { /* ignore invalid URL for domain extraction */ }

        ol.appendChild(li);
    });
    sourcesContainer.appendChild(ol);

    if (processLogVisible) {
        sources.forEach(source => addProcessLogEntry(`Source: ${source.title || source.uri}`, 'source', source.uri));
    }
  } else if (type === 'ai' && (!sources || sources.length === 0) && chatMessagesContainer) { // No sources or sources removed
    const sourcesContainerId = domId + '-sources';
    const existingSourcesContainer = document.getElementById(sourcesContainerId);
    if (existingSourcesContainer) {
        existingSourcesContainer.remove(); // Remove the sources block if it exists but is no longer needed
    }
  }

  // Add action buttons (Copy, Continue, Save Memory, Export)
  // Create or get header actions container (part of messageSenderLine)
  let headerActionsContainer = messageSenderLine?.querySelector('.message-actions-header');
  if (!headerActionsContainer && messageSenderLine) {
      headerActionsContainer = document.createElement('div');
      headerActionsContainer.className = 'message-actions-header flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0';
      messageSenderLine.appendChild(headerActionsContainer);
  }
  if(headerActionsContainer) headerActionsContainer.innerHTML = ''; // Clear existing header actions

  if (!isInitialSystemMessage && senderName !== "System" && headerActionsContainer) {
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (type === 'user') { // Add Edit button for user messages
        const editButton = document.createElement('button');
        editButton.className = 'message-edit-btn p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5'; // Tailwind classes
        editButton.setAttribute('aria-label', currentStrings.editMessage);
        editButton.innerHTML = `<span class="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#19e5c6]">edit</span>`;
        editButton.dataset.messageId = domId;
        editButton.onclick = (e) => { e.stopPropagation(); handleEditUserMessage(domId); };
        headerActionsContainer.appendChild(editButton);
    } else if (type === 'ai') { // Add Regenerate button for AI messages
        const regenerateButton = document.createElement('button');
        regenerateButton.className = 'message-regenerate-btn p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5'; // Tailwind classes
        regenerateButton.setAttribute('aria-label', currentStrings.regenerateResponse);
        regenerateButton.innerHTML = `<span class="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#19e5c6]">refresh</span>`;
        regenerateButton.dataset.messageId = domId;
        regenerateButton.onclick = (e) => { e.stopPropagation(); handleRegenerateAiResponse(domId); };
        headerActionsContainer.appendChild(regenerateButton);
    }
  }


  // Add action buttons for AI messages only on final append (not streaming)
  if (type === 'ai' && !isStreaming && !isInitialSystemMessage && senderName !== "System" && aiMessageContentDiv) {
      let actionsContainer = messageWrapper.querySelector('.message-actions-container');
      if (!actionsContainer) {
          actionsContainer = document.createElement('div');
          actionsContainer.className = 'message-actions-container mt-2'; // Styling in CSS
          if (contentWrapperDiv && aiMessageContentDiv.parentNode === contentWrapperDiv) {
              contentWrapperDiv.appendChild(actionsContainer);
          } else {
               messageWrapper.appendChild(actionsContainer);
          }
      }
      actionsContainer.innerHTML = ''; // Clear existing buttons if re-rendering

      // Copy Button
      const copyButton = document.createElement('button');
      copyButton.className = 'message-action-btn copy-answer-btn';
      copyButton.innerHTML = `<span class="material-symbols-outlined text-sm">content_copy</span> Copy Answer`;
      copyButton.onclick = () => {
          const textToCopy = messageContentHolder.innerText; // Or .innerHTML if HTML is desired
          navigator.clipboard.writeText(textToCopy).then(() => {
              const originalText = copyButton.innerHTML;
              copyButton.innerHTML = `<span class="material-symbols-outlined text-sm">check_circle</span> Copied!`;
              copyButton.disabled = true;
              setTimeout(() => {
                  copyButton.innerHTML = originalText;
                  copyButton.disabled = false;
              }, 2000);
          }).catch(err => console.error('Failed to copy text: ', err));
      };
      actionsContainer.appendChild(copyButton);

      // Continue Button (if applicable for text messages)
      if (messageType === 'text') {
          const continueButton = document.createElement('button');
          continueButton.className = 'message-action-btn continue-generation-btn';
          continueButton.innerHTML = `<span class="material-symbols-outlined text-sm">play_arrow</span> Continue`;
          continueButton.onclick = () => {
              if (chatInput) {
                  chatInput.value = "Please continue generating from where you left off with your previous response.";
                  handleSendMessage();
              }
          };
          actionsContainer.appendChild(continueButton);
      }


      // Save to Memory Button
      const saveMemoryButton = document.createElement('button');
      saveMemoryButton.className = 'message-action-btn save-memory-btn';
      saveMemoryButton.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark_add</span> Save to Memory`;
      saveMemoryButton.dataset.messageId = domId;
      saveMemoryButton.onclick = () => {
          const textToSave = (messageType === 'image' && imageData) ? `[Image: ${imageData.promptForImage}]` : textOrData;
          handleSaveToMemory(domId, textToSave, senderName , currentChatSessionId);
      };
      actionsContainer.appendChild(saveMemoryButton);


      // Export PDF Button (only for text messages)
      if (messageType === 'text') {
          const exportPdfButton = document.createElement('button');
          exportPdfButton.className = 'message-action-btn export-pdf-btn';
          exportPdfButton.innerHTML = `<span class="material-symbols-outlined text-sm">picture_as_pdf</span> Export PDF`;
          exportPdfButton.onclick = () => {
              if (typeof html2pdf !== 'undefined') {
                  const elementToExport = messageContentHolder; // The div containing the rendered markdown
                  const filename = `nova-chat-${senderName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.pdf`;
                  html2pdf().from(elementToExport).set({
                      margin: [10, 10, 10, 10], // top, left, bottom, right
                      filename: filename,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2, useCORS: true, letterRendering: true }, // Ensure images are rendered
                      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  }).save();
              } else {
                  console.error("html2pdf library not found.");
                  alert("PDF export functionality is currently unavailable.");
              }
          };
          actionsContainer.appendChild(exportPdfButton);

          // Export Excel Button (if message contains a table)
          if (messageContentHolder.querySelector('table')) {
              const exportExcelButton = document.createElement('button');
              exportExcelButton.className = 'message-action-btn export-excel-btn';
              exportExcelButton.innerHTML = `<span class="material-symbols-outlined text-sm">backup_table</span> Export Excel`;
              exportExcelButton.onclick = () => {
                  if (typeof XLSX !== 'undefined') {
                      const tableElement = messageContentHolder.querySelector('table');
                      if (tableElement) {
                          const filename = `nova-chat-table-${Date.now()}.xlsx`;
                          const wb = XLSX.utils.table_to_book(tableElement);
                          XLSX.writeFile(wb, filename);
                      }
                  } else {
                      console.error("XLSX (SheetJS) library not found.");
                      alert("Excel export functionality is currently unavailable.");
                  }
              };
              actionsContainer.appendChild(exportExcelButton);
          }
      }

      // Resume Builder Download Button
      const toolForThisChat = customTools.find(t => t.id === currentChatIsBasedOnTool);
      if (toolForThisChat && toolForThisChat.name === "Resume Builder" && textOrData.includes("<!-- START RESUME HTML -->")) {
          const resumeHtmlMatch = textOrData.match(/<!-- START RESUME HTML -->([\s\S]*?)<!-- END RESUME HTML -->/);
          if (resumeHtmlMatch && resumeHtmlMatch[1]) {
              const resumeHtmlContent = resumeHtmlMatch[1].trim();
              const downloadResumeBtn = document.createElement('button');
              downloadResumeBtn.className = 'message-action-btn resume-download-btn bg-[#19e5c6] text-[#0C1A18] hover:bg-opacity-90 py-2 px-4 text-sm';
              downloadResumeBtn.innerHTML = `<span class="material-symbols-outlined text-base mr-1">picture_as_pdf</span> Download Resume as PDF`;
              downloadResumeBtn.onclick = () => {
                  if (typeof html2pdf !== 'undefined') {
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
                      html2pdf().from(element).set({
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


  // --- Save to Chat History (if not streaming and not initial system message) ---
  if (!isStreaming && !isInitialSystemMessage && senderName !== "System") { // Don't save transient system messages to history
    let textForHistory;
    if (messageType === 'image' && imageData) {
        textForHistory = `[AI Image for: ${imageData.promptForImage}]`; // Placeholder for history
    } else if (userUploadedFile) {
        textForHistory = `[File: ${userUploadedFile.name}] ${textOrData}`;
    }
    else {
        textForHistory = textOrData;
    }

    const msgToSave = {
        id: domId,
        sender: senderName, // Cast as senderName can be "System"
        text: textForHistory,
        timestamp: Date.now(),
        sources: (type === 'ai' && messageType === 'text' && sources) ? sources : undefined,
        detectedLanguage: contentLanguage,
        messageType: messageType,
        imageData: messageType === 'image' ? imageData : undefined,
        userUploadedFile: userUploadedFile || undefined
    };

    if (currentChatSessionId) {
      const session = chatSessions.find(s => s.id === currentChatSessionId);
      if (session) {
        const existingMsgIndex = session.messages.findIndex(m => m.id === msgToSave.id);
        if (existingMsgIndex !== -1) { // Should ideally not happen if IDs are unique for new messages
            session.messages[existingMsgIndex] = msgToSave;
        } else {
            session.messages.push(msgToSave);
        }
        session.lastUpdated = Date.now();
      }
    } else if (type === 'user' && currentUser) { // First user message in a new chat
      currentChatSessionId = `session-${Date.now()}`;
      const toolForTitle = currentChatIsBasedOnTool ? customTools.find(t=>t.id === currentChatIsBasedOnTool) : null;
      const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
      const newSession = {
        id: currentChatSessionId,
        title: currentChatIsBasedOnTool ? `Tool: ${toolForTitle?.name || 'Unnamed Tool'}` : currentStrings.navNewChat, // Placeholder title
        messages: [msgToSave], // Add the first user message
        lastUpdated: Date.now(),
        aiToneUsed: currentAiTone, // Store the tone used for this session
        basedOnToolId: currentChatIsBasedOnTool || undefined
      };
      chatSessions.push(newSession);
      if (chatScreenTitleElement) chatScreenTitleElement.textContent = newSession.title;
    }
    saveChatSessionsToFirebase(); // Changed from LocalStorage
    if (currentScreen === CHAT_LIST_SCREEN_ID || currentScreen === CHAT_SCREEN_ID) { // Update list if visible
        renderChatList();
    }
  }

  scrollToBottomChat();
  return messageWrapper;
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function renderMarkdownToHTML(markdownText) {
    let html = markdownText;

    // 1. Temporarily replace code blocks to protect them from markdown parsing
    const codeBlockPlaceholders = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, rawCode) => {
        const languageClass = lang ? `language-${lang.trim()}` : '';
        const trimmedRawCode = rawCode.trim(); // Trim whitespace around the raw code
        const escapedCodeForDisplay = escapeHTML(trimmedRawCode); // Escape for display inside <code>
        const escapedCodeForDataAttr = escapeHTML(trimmedRawCode); // Escape for data attribute

        // Toolbar for code blocks
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


    // 2. Temporarily replace inline code
    const inlineCodes = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        inlineCodes.push(`<code>${escapeHTML(code)}</code>`);
        return `%%INLINECODE_${inlineCodes.length - 1}%%`;
    });

    // 3. Escape HTML characters in the remaining text to prevent XSS if markdown is malformed
    html = escapeHTML(html);

    // 4. Process tables (must be before paragraph wrapping)
    // More robust table regex: accounts for optional spaces and variations in separator lines
    html = html.replace(/^\|(.+)\|\r?\n\|([\s\S]+?)\|\r?\n((?:\|.*\|\r?\n?)*)/gm, (tableMatch) => {
        const rows = tableMatch.trim().split(/\r?\n/);
        if (rows.length < 2) return tableMatch; // Not enough rows for a header and separator

        const headerCells = rows[0].slice(1, -1).split('|').map(s => s.trim());
        const separatorLine = rows[1].slice(1, -1).split('|').map(s => s.trim());

        // Validate separator line
        if (headerCells.length !== separatorLine.length || !separatorLine.every(s => /^\s*:?-+:?\s*$/.test(s))) {
            return tableMatch; // Invalid separator, treat as normal text
        }

        let tableHtml = '<div class="table-wrapper"><table class="markdown-table">';
        // Table Head
        tableHtml += '<thead><tr>';
        headerCells.forEach(header => {
            tableHtml += `<th>${header}</th>`; // Already escaped
        });
        tableHtml += '</tr></thead>';

        // Table Body
        tableHtml += '<tbody>';
        for (let i = 2; i < rows.length; i++) {
            if (!rows[i].trim().startsWith('|') || !rows[i].trim().endsWith('|')) continue; // Skip malformed rows
            tableHtml += '<tr>';
            rows[i].slice(1, -1).split('|').forEach(cell => {
                tableHtml += `<td>${cell.trim()}</td>`; // Already escaped
            });
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table></div>';
        return tableHtml;
    });


    // 5. Process block elements like headings, blockquotes, lists, hr
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Blockquotes (handle multiple lines correctly)
    html = html.replace(/^\s*&gt; (.*$)/gim, '<p>%%BLOCKQUOTE_LINE%%$1</p>'); // Mark lines
    html = html.replace(/(<p>%%BLOCKQUOTE_LINE%%.*?<\/p>)+/g, (match) => { // Group consecutive lines
        return `<blockquote>${match.replace(/<p>%%BLOCKQUOTE_LINE%%(.*?)<\/p>/g, '<p>$1</p>')}</blockquote>`;
    });
    html = html.replace(/<\/blockquote>\s*<blockquote>/gim, '</blockquote><blockquote>'); // Merge adjacent blockquotes

    html = html.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, '<hr>'); // Horizontal Rules

    // Unordered Lists (more robust)
    html = html.replace(/^\s*([*\-+]) +(.*)/gm, (match, bullet, item) => `%%UL_START%%<li>${item.trim()}</li>`);
    html = html.replace(/(%%UL_START%%(<li>.*?<\/li>)+)/g, '<ul>$2</ul>'); // Group list items
    html = html.replace(/<\/ul>\s*<ul>/g, ''); // Merge adjacent ULs

    // Ordered Lists (more robust)
    html = html.replace(/^\s*(\d+)\. +(.*)/gm, (match, number, item) => `%%OL_START%%<li>${item.trim()}</li>`);
    html = html.replace(/(%%OL_START%%(<li>.*?<\/li>)+)/g, '<ol>$2</ol>'); // Group list items
    html = html.replace(/<\/ol>\s*<ol>/g, ''); // Merge adjacent OLs


    // 6. Wrap remaining lines in <p> tags, carefully avoiding double-wrapping block elements
    html = html.split(/\r?\n/).map(paragraph => {
      paragraph = paragraph.trim();
      if (!paragraph) return ''; // Skip empty lines
      // Check if it's already a block element or a placeholder
      if (paragraph.match(/^<\/?(h[1-6]|ul|ol|li|blockquote|hr|table|div class="table-wrapper"|div class="code-block-wrapper")/) ||
          paragraph.startsWith('%%CODEBLOCK_WRAPPER_') ||
          paragraph.startsWith('%%INLINECODE_') ||
          paragraph.startsWith('%%UL_START%%') || paragraph.startsWith('%%OL_START%%')) {
          return paragraph;
      }
      return `<p>${paragraph}</p>`; // Wrap in paragraph
    }).join('');

    // Cleanup for list placeholders if any remained (e.g. single list item)
    html = html.replace(/%%UL_START%%<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');
    html = html.replace(/%%OL_START%%<li>(.*?)<\/li>/g, '<ol><li>$1</li></ol>');


    // 7. Process inline elements like links, bold, italic, strikethrough
    // Links (target _blank and rel noopener for security)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        const decodedText = text; // Text is already HTML escaped from step 3
        const decodedUrl = url.replace(/&amp;/g, '&'); // Decode &amp; back to & for URL
        const classAttr = (decodedUrl.startsWith('http:') || decodedUrl.startsWith('https:')) ? `class="webview-link" data-url="${escapeHTML(decodedUrl)}"` : '';
        return `<a href="${escapeHTML(decodedUrl)}" ${classAttr} target="_blank" rel="noopener noreferrer">${decodedText}</a>`;
    });

    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>'); // Bold **
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');   // Bold __

    // Italic * and _ (careful not to mess with existing HTML tags if any sneaked through)
    // This regex is a bit more careful about word boundaries / surrounding characters
    html = html.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');
    html = html.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, '$1<em>$2</em>$3');


    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>'); // Strikethrough

    // 8. Restore inline code and code blocks
    html = html.replace(/%%INLINECODE_(\d+)%%/g, (match, index) => inlineCodes[parseInt(index)]);
    html = html.replace(/%%CODEBLOCK_WRAPPER_(\d+)%%/g, (match, index) => codeBlockPlaceholders[parseInt(index)]);

    // 9. Final cleanup
    html = html.replace(/<p>\s*<\/p>/g, ''); // Remove empty paragraphs
    html = html.replace(/<p><br\s*\/?>\s*<\/p>/g, ''); // Remove paragraphs with only a <br>
    // Remove excessive newlines between block elements that might have been introduced
    html = html.replace(/(\r?\n)+/g, '\n');
    html = html.replace(/\n(<\/(?:ul|ol|li|h[1-6]|p|blockquote|hr|pre|table|div)>)/g, '$1');
    html = html.replace(/(<(?:ul|ol|li|h[1-6]|p|blockquote|hr|pre|table|div).*?>)\n/g, '$1');


    return html.trim();
}


async function handleSendMessage(isRegeneration = false, regeneratedAiMessageId = null) {
  if (!currentUser) {
      displaySystemMessage("Please sign in to send messages.", CHAT_SCREEN_ID);
      showScreen(SIGNIN_SCREEN_ID);
      return;
  }
  if ((isLoading || isImageLoading) && !isRegeneration) return; // Allow regeneration even if loading (rare case)
  if (!chatInput) return;

  let userMessageText = chatInput.value.trim();
  let currentStagedFile = stagedFile; // Capture staged file at the moment of sending
  const currentStrings = uiStrings[currentLanguage] || uiStrings.en;

  if (!userMessageText && !currentStagedFile && !editingUserMessageId) { // Nothing to send unless editing
    if (chatInput) chatInput.placeholder = currentStrings.chatInputPlaceholder;
    return;
  }
  if (chatInput && !editingUserMessageId) chatInput.placeholder = currentStrings.chatInputPlaceholder; // Reset placeholder if not editing


  if (!geminiInitialized && !initializeGeminiSDK()) {
    displaySystemMessage("AI Service is not ready. Message not sent.", CHAT_SCREEN_ID);
    return;
  }

  const isEditing = !!editingUserMessageId;
  let userMessageId = isEditing ? editingUserMessageId : `msg-user-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;
  let fullMessageForDisplay = userMessageText; // For UI display

  // Construct parts for Gemini API
  const geminiMessageParts = [];

  if (currentStagedFile && !isEditing) { // Only consider staged file if not editing a previous message
    if (currentStagedFile.type === 'image') {
        geminiMessageParts.push({
            inlineData: {
                mimeType: currentStagedFile.mimeType,
                data: currentStagedFile.content // Base64 data
            }
        });
        fullMessageForDisplay = `[Image: ${currentStagedFile.name}] ${userMessageText}`.trim(); // For UI
    } else { // Text file
        geminiMessageParts.push({ text: `Context from file "${currentStagedFile.name}":\n${currentStagedFile.content}` });
         fullMessageForDisplay = `[File: ${currentStagedFile.name}] ${userMessageText}`.trim(); // For UI
    }
    // Add user's text query if it exists, or a default query for the file
    if (userMessageText) {
        geminiMessageParts.push({ text: userMessageText });
    } else if (currentStagedFile.type === 'image') {
        geminiMessageParts.push({ text: "Describe this image."}); // Default query for image
        if (!userMessageText) fullMessageForDisplay = `[Image: ${currentStagedFile.name}] Describe this image.`;
    } else { // Text file with no specific user query
         geminiMessageParts.push({ text: "What can you tell me about the content of this file?" });
         if (!userMessageText) fullMessageForDisplay = `[File: ${currentStagedFile.name}] What about this file?`;
    }
  } else { // No file, or editing (staged files don't apply to edits of old messages)
      geminiMessageParts.push({ text: userMessageText });
  }


  const userMessageLang = detectMessageLanguage(userMessageText || (currentStagedFile?.name || ""));

  if (isEditing) {
    // Update the displayed user message
    const existingMsgDiv = document.getElementById(editingUserMessageId);
    const msgTextElement = existingMsgDiv?.querySelector('.message-text');
    if (msgTextElement) msgTextElement.innerHTML = renderMarkdownToHTML(userMessageText);

    // Update the message in chatSessions and prepare history for Gemini
    const session = chatSessions.find(s => s.id === currentChatSessionId);
    if (session) {
        const msgIndex = session.messages.findIndex(m => m.id === editingUserMessageId);
        if (msgIndex !== -1) {
            session.messages[msgIndex].text = userMessageText; // Update text
            session.messages[msgIndex].detectedLanguage = userMessageLang;
            // Remove all subsequent messages (AI responses that followed the original user message)
            session.messages.splice(msgIndex + 1);

            // Remove subsequent messages from DOM
            let nextSibling = existingMsgDiv?.nextElementSibling;
            while(nextSibling && (nextSibling.classList.contains('chat-message-wrapper') || nextSibling.classList.contains('chat-message-external-sources'))) {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                toRemove.remove();
            }
        }
        // Prepare history for Gemini, up to and including the edited user message
        const historyForEdit = session.messages
            .filter((msg, idx) => msg.sender !== 'System' && idx <= msgIndex) // Include the edited user message
            .map(msg => ({
                role: (msg.sender === "User") ? "user" : "model",
                // Strip file prefixes from history for Gemini, actual file content is not re-sent.
                parts: [{text: msg.text.replace(/\[(Image|File):.*?\]\s*/, '')}]
            }));

        // Re-initialize geminiChat with the history up to *before* the user's edited message
        // The edited message itself will be sent as the new prompt.
        let systemInstructionText;
        if (currentChatIsBasedOnTool) {
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            if (tool) {
                systemInstructionText = tool.instructions;
                if (tool.knowledge) systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
                systemInstructionText += getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false);
            } else { // Fallback if tool not found
                systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
            }
        } else {
            systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
        }
        geminiChat = ai.chats.create({ model: TEXT_MODEL_NAME, history: historyForEdit.slice(0, -1), config: { systemInstruction: systemInstructionText } }); // History up to before last user message
    }
    // Reset editing state
    if (chatInput) chatInput.value = "";
    editingUserMessageId = null;
    if (sendButton) {
        const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
        if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
        sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
    }
     if (chatInput) chatInput.placeholder = currentStrings.chatInputPlaceholder;
  } else if (!isRegeneration) { // Standard new message (not edit, not regeneration)
      // Ensure chat session exists or create new one (only if not editing)
      if (currentChatIsBasedOnTool && !currentChatSessionId) {
            currentChatSessionId = `session-tool-${currentChatIsBasedOnTool}-${Date.now()}`;
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            const newSession = {
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
        if (currentChatIsBasedOnTool) { // This case should ideally be covered by the block above for new tool chats
            const tool = customTools.find(t => t.id === currentChatIsBasedOnTool);
            if (tool) {
                systemInstructionText = tool.instructions;
                if (tool.knowledge) systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
                systemInstructionText += getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false);
            } else { // Fallback if tool not found but currentChatIsBasedOnTool is set
                systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
            }
        } else { // Standard new chat
            systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled);
        }
        geminiChat = ai.chats.create({
            model: TEXT_MODEL_NAME,
            config: { systemInstruction: systemInstructionText }
        });
         if (!currentChatSessionId) { // Truly a new chat session
            currentChatSessionId = `session-${Date.now()}`;
            const newSession = {
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
      appendMessage("User", fullMessageForDisplay, 'user', false, null, false, null, userMessageLang, userMessageId, 'text', undefined, currentStagedFile ? {name: currentStagedFile.name, type: currentStagedFile.type, isImage: currentStagedFile.type === 'image'} : undefined);
      if (chatInput) chatInput.value = ""; // Clear input
      stagedFile = null; // Clear staged file after sending
      updateStagedFilePreview();
  }


  disableChatInput(true, false); // Text is loading, no image loading initially

  let aiMessageDivToUpdate = isRegeneration ? document.getElementById(regeneratedAiMessageId) : null;
  let fullResponseText = "";
  let isFirstAIMessageInNewChat = false;
  let groundingSources = null;
  let aiResponseLang = 'unknown';
  const aiMessageId = isRegeneration ? regeneratedAiMessageId : `msg-ai-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;


  if (currentChatSessionId && !isEditing && !isRegeneration) { // Check for title generation only for brand new AI messages
    const session = chatSessions.find(s => s.id === currentChatSessionId);
    if (session && session.messages.filter(m => m.sender === 'Nova' || m.sender === 'Nova (Tool Mode)').length === 0) {
        isFirstAIMessageInNewChat = true;
    }
  }

  try {
    const sendMessageParams = {
        message: geminiMessageParts
    };

    const perMessageConfig = {};
    let configApplied = false;

    if (internetSearchEnabled) {
        perMessageConfig.tools = [{ googleSearch: {} }];
        configApplied = true;
    }

    if (TEXT_MODEL_NAME === 'gemini-2.5-flash-preview-04-17') {
      // Disable thinking for lower latency if deep thinking or scientific mode are OFF, AND (voice mode is ON OR creativity is 'focused')
      if (!deepThinkingEnabled && !advancedScientificModeEnabled && (voiceModeActive || currentCreativityLevel === 'focused')) {
        perMessageConfig.thinkingConfig = { thinkingBudget: 0 };
        configApplied = true;
      }
      // Otherwise, allow thinking (default behavior or if deep/scientific mode is on)
    }

    // Temperature based on creativity level
    switch(currentCreativityLevel) {
        case 'focused': perMessageConfig.temperature = 0.2; configApplied = true; break;
        case 'balanced': perMessageConfig.temperature = 0.7; configApplied = true; break; // Default-ish
        case 'inventive': perMessageConfig.temperature = 1.0; configApplied = true; break;
    }


    if (configApplied) {
        sendMessageParams.config = perMessageConfig;
    }

    const result = await geminiChat.sendMessageStream(sendMessageParams);
    let tempAiMessageDiv = aiMessageDivToUpdate; // Use this for updates within the loop

    for await (const chunk of result) {
      const chunkText = chunk.text; // Access text directly
      if (chunkText) {
        fullResponseText += chunkText;
        if (aiResponseLang === 'unknown' && fullResponseText.length > 10) { // Detect lang once enough text
            aiResponseLang = detectMessageLanguage(fullResponseText);
        }
        const aiSenderName = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";
        if (!tempAiMessageDiv) { // First chunk, create message div
          tempAiMessageDiv = appendMessage(aiSenderName, fullResponseText, 'ai', true, null, false, null, aiResponseLang, aiMessageId, 'text');
        } else { // Subsequent chunks, update existing div
          appendMessage(aiSenderName, fullResponseText, 'ai', true, tempAiMessageDiv, false, null, aiResponseLang, aiMessageId, 'text');
        }
        scrollToBottomChat();
      }

      if (chunk.candidates && chunk.candidates[0]?.groundingMetadata?.groundingChunks) {
          const newSources = chunk.candidates[0].groundingMetadata.groundingChunks
              .map(gc => ({ uri: gc.web?.uri || gc.retrievedContext?.uri || '', title: gc.web?.title || gc.retrievedContext?.uri || '' }))
              .filter(s => s.uri); // Ensure URI exists

          if (newSources.length > 0) {
              groundingSources = [...(groundingSources || []), ...newSources].reduce((acc, current) => {
                  if (!acc.find(item => item.uri === current.uri)) { acc.push(current); }
                  return acc;
              }, []);

              if (tempAiMessageDiv && groundingSources && groundingSources.length > 0) {
                const aiSenderName = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";
                appendMessage(aiSenderName, fullResponseText, 'ai', true, tempAiMessageDiv, false, groundingSources, aiResponseLang, aiMessageId, 'text');
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
            .replace(/<[^>]+(>|$)/g, "") // Strip all other HTML tags
            .replace(/\n\s*\n/g, "\n") // Collapse multiple newlines
            .trim();
        speak(textForSpeech, true, aiResponseLang); // isAiMessageForVoiceMode = true
    }

    if (fullResponseText && currentChatSessionId) {
        const session = chatSessions.find(s => s.id === currentChatSessionId);
        if (session) {
            const aiSenderName = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";
             if (tempAiMessageDiv) { // If div was created/updated during streaming
                appendMessage(aiSenderName, fullResponseText, 'ai', false, tempAiMessageDiv, false, groundingSources, aiResponseLang, aiMessageId, 'text');
            } else { // If response was empty but sources exist, or some other edge case
                appendMessage(aiSenderName, fullResponseText, 'ai', false, null, false, groundingSources, aiResponseLang, aiMessageId, 'text');
            }

            if (isFirstAIMessageInNewChat && !session.basedOnToolId) { // Only generate title for new, non-tool chats
                const userMsgForTitle = session.messages.find(m => m.sender === 'User')?.text || fullMessageForDisplay;
                const newTitle = await generateChatTitle(userMsgForTitle, fullResponseText);
                session.title = newTitle;
                if(chatScreenTitleElement) chatScreenTitleElement.textContent = newTitle;
                 saveChatSessionsToFirebase(); // Changed from LocalStorage
                 renderChatList(); // Update chat list UI
            }
            // Extract user info (if not a tool-based chat, as tools have specific contexts)
            if (!session.basedOnToolId && !advancedScientificModeEnabled) { // Also don't extract if scientific mode
                 await extractAndStoreUserInfo(session);
            }
        }
    }

  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    let errorMessage = "Sorry, I encountered an error processing your request. Please try again.";
    if (error && error.message) {
        if (error.message.includes("API key not valid")) {
            errorMessage = "There's an issue with the API configuration. Please contact support.";
        } else if (error.message.toLowerCase().includes("safety") || error.message.includes(" हिंसात्मक ")) { // More robust safety check
             errorMessage = "Your request could not be processed due to safety guidelines. Please rephrase your message.";
        }
    }

    const errLang = detectMessageLanguage(errorMessage);
    const errorMsgId = `err-${aiMessageId}`; // Unique ID for error message
    const aiSenderName = currentChatIsBasedOnTool ? "Nova (Tool Mode)" : "Nova";

    appendMessage(aiSenderName, errorMessage, 'ai', false, null, true, null, errLang, errorMsgId, 'text'); // isInitialSystemMessage = true for errors

    if (ttsEnabled) speak(errorMessage, false, errLang); // Don't trigger mic for error messages
  } finally {
    disableChatInput(false, false); // Reset loading state
    if(chatInput && !voiceModeActive) { // If not in voice mode, focus input
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
    // Append user's prompt as a regular text message first
    appendMessage("User", prompt, 'user', false, null, false, null, userMessageLang, userMessageId, 'text');
    chatInput.value = ""; // Clear input
    disableChatInput(false, true); // Set imageLoading to true

    const aiImageId = `msg-ai-img-${Date.now()}`; // Unique ID for the AI image message

    try {
        const response = await ai.models.generateImages({
            model: IMAGE_MODEL_NAME,
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: "1:1" }, // Example config
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const imgData = response.generatedImages[0];
            const imageDataPayload = {
                base64: imgData.image.imageBytes, // This is the base64 string
                mimeType: imgData.image.mimeType || 'image/jpeg', // Default mimeType
                promptForImage: prompt // Store the original prompt with the image data
            };

            // Append the AI message with type 'image' and the imageDataPayload
            appendMessage("Nova", "", 'ai', false, null, false, null, 'en', aiImageId, 'image', imageDataPayload);

            // Save to chat history
            if (currentChatSessionId) {
                const session = chatSessions.find(s => s.id === currentChatSessionId);
                if (session) {
                    const aiImageMessageForHistory = {
                        id: aiImageId,
                        sender: 'Nova',
                        text: `[AI generated image for prompt: ${prompt.substring(0,50)}...]`, // Placeholder text for history
                        timestamp: Date.now(),
                        messageType: 'image',
                        imageData: imageDataPayload, // Store full image data in history object
                        detectedLanguage: 'en' // Language of the prompt, or 'en' if image
                    };
                    session.messages.push(aiImageMessageForHistory);
                    session.lastUpdated = Date.now();
                    saveChatSessionsToFirebase(); // Changed from LocalStorage
                    renderChatList(); // Update chat list if open
                }
            } else { // Create a new chat session if one doesn't exist (e.g., first message is image gen)
                const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
                currentChatSessionId = `session-img-${Date.now()}`;
                const newSession = {
                    id: currentChatSessionId,
                    title: `Image: ${prompt.substring(0,20)}...`, // Title based on prompt
                    messages: [ // Include the user's prompt message and the AI's image message
                        { id: userMessageId, sender: 'User', text: prompt, timestamp: Date.now()-100, detectedLanguage: userMessageLang, messageType: 'text'},
                        { id: aiImageId, sender: 'Nova', text: `[AI image for: ${prompt.substring(0,50)}...]`, timestamp: Date.now(), messageType: 'image', imageData: imageDataPayload, detectedLanguage: 'en' }
                    ],
                    lastUpdated: Date.now(),
                    aiToneUsed: currentAiTone, // Use current global tone
                };
                chatSessions.push(newSession);
                if (chatScreenTitleElement) chatScreenTitleElement.textContent = newSession.title;
                saveChatSessionsToFirebase(); // Changed from LocalStorage
                renderChatList();
            }
        } else {
            displaySystemMessage("Sorry, I couldn't generate an image for that prompt. Please try a different prompt or check the image model.", CHAT_SCREEN_ID, 'en');
        }

    } catch (error) {
        console.error("Error generating image in chat:", error);
        let errMsg = "Failed to generate image. Please try again.";
        if (error instanceof Error) errMsg = `Image Generation Error: ${error.message}`;
        if (error.message && (error.message.toLowerCase().includes("safety") || error.message.includes("प्रोम्प्ट में मौजूद नहीं किया जा सका"))) { // Check for safety related errors
            errMsg = "The image could not be generated due to safety guidelines. Please try a different prompt.";
        }
        displaySystemMessage(errMsg, CHAT_SCREEN_ID, 'en');
    } finally {
        disableChatInput(false, false); // Reset loading state
        if (chatInput && !voiceModeActive) chatInput.focus(); // Refocus input if not in voice mode
    }
}

// --- END OF CORE CHAT AND GEMINI FUNCTIONS ---


// --- START OF PORTED/NEWLY ADDED FUNCTIONS (Utilities, Event Handlers, etc.) ---

function updateStagedFilePreview() {
    if (stagedFilePreviewElement) {
        const fileNameSpan = stagedFilePreviewElement.querySelector('.staged-file-name');
        const fileTypeSpan = stagedFilePreviewElement.querySelector('.staged-file-type');

        if (stagedFile) {
            stagedFilePreviewElement.style.display = 'flex';
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
            stagedFilePreviewElement.style.display = 'none';
            if (stagedFileClearButton) {
                stagedFileClearButton.style.display = 'none';
            }
        }
    }
}

function setCodeCanvasView(mode) {
    codeCanvasViewMode = mode;
    if (!codeCanvasTextarea || !codeCanvasInlinePreviewIframe || !codeCanvasToggleViewButton || !codeCanvasEnterFullscreenButton || !codeEditorWrapper) return;
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (mode === 'preview') {
        codeEditorWrapper.style.display = 'none';
        if(codeCanvasInlinePreviewIframe) codeCanvasInlinePreviewIframe.style.display = 'block';
        if(codeCanvasToggleViewButton) codeCanvasToggleViewButton.textContent = currentStrings.codeCanvasShowCode;
        if(codeCanvasEnterFullscreenButton) codeCanvasEnterFullscreenButton.classList.remove('hidden');
    } else { // 'code'
        codeEditorWrapper.style.display = 'block';
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
            // Set language for speech recognition based on current UI language
            recognition.lang = currentLanguage === 'ar' ? 'ar-SA' : (navigator.language || 'en-US');
            recognition.start();
        }
    } catch (e) {
        console.error("Speech recognition start error:", e);
        if (e instanceof Error && e.name === 'InvalidStateError' && !isListening) {
            // Ignore if already stopped or not started.
        } else {
            alert("Could not start voice recognition. Please check microphone permissions.");
        }
        micButtonContainer?.classList.remove('listening');
        micButton?.querySelector('.mic-listening-indicator')?.classList.remove('animate-ping');
        isListening = false;
         if(!(e instanceof Error && e.name === 'InvalidStateError')) { // Only reset if not an InvalidStateError
           manualTTScancelForMic = false;
         }
    }
}

function addProcessLogEntry(text, type = 'info', url) {
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
    processLogListElement.appendChild(li);
    processLogListElement.scrollTop = processLogListElement.scrollHeight;
}

function clearProcessLog() {
    if (processLogListElement) processLogListElement.innerHTML = '';
}


function startSimulatedProcessLog() {
    if (!processLogVisible || (!deepThinkingEnabled && !internetSearchEnabled && !advancedScientificModeEnabled)) { // Added scientific mode check
        if (simulatedProcessInterval) clearInterval(simulatedProcessInterval);
        simulatedProcessInterval = undefined;
        return;
    }
    clearProcessLog();

    const steps = [];
    if(advancedScientificModeEnabled) steps.push("Initiating advanced scientific research protocol...", "Defining research scope...", "Formulating hypothesis (if applicable)...", "Planning paper structure (Abstract, Intro, Lit Review, Methods, etc.)...", "Gathering preliminary data from knowledge base...");
    if (internetSearchEnabled) steps.push("Formulating search queries...", "Searching the web...", "Reviewing search results...");
    if (deepThinkingEnabled && !advancedScientificModeEnabled) steps.push("Accessing knowledge base...", "Analyzing information...", "Considering multiple perspectives...", "Synthesizing insights..."); // Don't add generic if scientific

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
    }, 1200 + Math.random() * 500); // Randomize interval slightly
}

function stopSimulatedProcessLog() {
    if (simulatedProcessInterval) {
        clearInterval(simulatedProcessInterval);
        simulatedProcessInterval = undefined;
    }
}

function openInAppImageViewer(imageUrl) {
    if (imageViewerScreenElement && imageViewerImg) {
        imageViewerImg.src = imageUrl;
        showScreen(IMAGE_VIEWER_SCREEN_ID);
    } else {
        alert(`Image viewer placeholder: ${imageUrl}`);
    }
}

function downloadImageWithBase64(base64Data, mimeType, filename) {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function speak(text, isAiMessageForVoiceMode, lang = 'en') {
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

    // Attempt to set language for TTS based on detected message language or UI language
    const targetLang = lang === 'ar' ? 'ar-SA' : (lang === 'en' ? 'en-US' : (currentLanguage === 'ar' ? 'ar-SA' : navigator.language || 'en-US'));
    utterance.lang = targetLang;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.lang === targetLang);
    // Fallback for primary language part (e.g., 'en' if 'en-US' not found)
    if (!selectedVoice && targetLang.includes('-')) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(targetLang.split('-')[0]));
    }
     if (!selectedVoice && targetLang === 'ar-SA') { // Specific fallback for Arabic
        selectedVoice = voices.find(voice => voice.lang.startsWith('ar'));
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn(`TTS voice for lang ${targetLang} not found. Using browser default.`);
    }

    utterance.onend = () => {
        if (manualTTScancelForMic) { // If TTS was cancelled because mic was pressed
            manualTTScancelForMic = false; // Reset flag
            return; // Don't auto-start mic again
        }
        // If TTS finished naturally in voice mode, and it was an AI message, start listening
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
        if (event.error === 'interrupted') { // Often happens if speech is cancelled
            return; // Don't proceed further if interrupted (e.g., by new speech or mic)
        }
        if (event.error === 'language-unavailable' || event.error === 'voice-unavailable') {
            displaySystemMessage(`Voice for ${targetLang} is not available on your device. TTS for this message is skipped.`, CHAT_SCREEN_ID, 'en');
        }
        // If in voice mode, try to start listening even if TTS errored (unless it was an interruption)
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
    }, 500); // 500ms debounce
}


function openInAppWebView(url) {
    if (webviewScreenElement && webviewFrame && webviewTitle && webviewLoading) {
        webviewTitle.textContent = "Loading...";
        webviewFrame.src = 'about:blank'; // Clear previous content
        if(webviewLoading) webviewLoading.style.display = 'block';
        if(webviewFrame) webviewFrame.style.display = 'none';
        showScreen(WEBVIEW_SCREEN_ID);

        webviewFrame.onload = () => {
            if (webviewLoading) webviewLoading.style.display = 'none';
            if (webviewFrame) webviewFrame.style.display = 'block';
            try {
                // Try to get title from iframe content, fallback to URL
                if (webviewTitle) webviewTitle.textContent = webviewFrame.contentDocument?.title || url;
            } catch (e) {
                // Catch potential cross-origin errors when accessing contentDocument
                if (webviewTitle) webviewTitle.textContent = url;
            }
        };
        webviewFrame.onerror = () => {
            if (webviewLoading) webviewLoading.style.display = 'none';
            if (webviewFrame) webviewFrame.style.display = 'block'; // Show frame even on error
            if (webviewTitle) webviewTitle.textContent = "Error Loading Page";
        };
        webviewFrame.src = url;
    } else {
        window.open(url, '_blank'); // Fallback for browsers or if elements are missing
    }
}

function toggleProcessLogPanel(forceState) {
    if (typeof forceState === 'boolean') {
        processLogVisible = forceState;
    } else {
        processLogVisible = !processLogVisible;
    }

    if (processLogPanelElement) {
        processLogPanelElement.classList.toggle('open', processLogVisible);
    }
    if (toggleProcessLogButtonElement) {
        toggleProcessLogButtonElement.classList.toggle('active', processLogVisible);
        toggleProcessLogButtonElement.setAttribute('aria-expanded', String(processLogVisible));
    }
    saveSetting('processLogVisible', processLogVisible);

    // Start or stop simulated log based on visibility and relevant feature states
    if (processLogVisible && (deepThinkingEnabled || internetSearchEnabled || advancedScientificModeEnabled || stagedFile)) {
        startSimulatedProcessLog();
    } else {
        stopSimulatedProcessLog();
    }
}

function handleFileUpload(event) {
    if (!currentUser) {
        displaySystemMessage("Please sign in to upload files.", CHAT_SCREEN_ID);
        showScreen(SIGNIN_SCREEN_ID);
        return;
    }
    const target = event.target;
    const file = target.files?.[0];
    if (!file) return;

    const textBasedTypes = [
        'text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json',
        'application/xml', 'application/x-python-code', 'text/markdown', 'text/csv',
    ];
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (file.size > MAX_FILE_SIZE) {
        displaySystemMessage(`File "${file.name}" is too large (max ${MAX_FILE_SIZE / (1024*1024)}MB).`, CHAT_SCREEN_ID);
        if (fileInputHidden) fileInputHidden.value = ''; // Reset file input
        return;
    }


    const isTextFile = textBasedTypes.includes(file.type) ||
                       file.name.match(/\.(txt|html|css|js|json|xml|py|md|csv|log|yaml|yml|rtf|tsv|ini|cfg|conf|sh|bat|ps1|rb|java|c|cpp|h|hpp|cs|go|php|swift|kt|dart|rs|lua|pl|sql)$/i);
    const isImageFile = imageTypes.includes(file.type);

    if (isTextFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target?.result;
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
            const base64Content = (e.target?.result).split(',')[1]; // Get base64 part
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
        reader.readAsDataURL(file); // Read as Data URL to get base64
    } else {
        displaySystemMessage(`File type "${file.type || 'unknown'}" (${file.name}) is not currently supported for direct analysis. Please try a common text or image file.`, CHAT_SCREEN_ID);
        stagedFile = null;
        updateStagedFilePreview();
    }

    // Reset the file input so the same file can be uploaded again if needed
    if (fileInputHidden) {
        fileInputHidden.value = '';
    }
}

function displayGeneratedImages(imagesData) {
    if (!imageStudioGridElement) return;
    imageStudioGridElement.innerHTML = ''; // Clear previous images

    imagesData.forEach((imgData, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'image-studio-item group relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-xl focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#19E5C6]';
        itemDiv.tabIndex = 0; // Make it focusable

        const imgElement = document.createElement('img');
        const imageSrc = `data:${imgData.mimeType};base64,${imgData.base64}`;
        imgElement.src = imageSrc;
        imgElement.alt = `Generated image for: ${imgData.prompt.substring(0, 50)} - ${index + 1}`;
        imgElement.className = 'w-full h-full object-cover transition-transform group-hover:scale-105';
        imgElement.onclick = () => openInAppImageViewer(imageSrc);

        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center';

        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-btn-overlay p-2 bg-[#19E5C6]/80 text-[#0C1A18] rounded-full hover:bg-[#19E5C6] focus:outline-none focus:ring-2 focus:ring-white';
        downloadButton.innerHTML = `<span class="material-symbols-outlined text-2xl leading-none">download</span>`;
        downloadButton.setAttribute('aria-label', `Download image ${index + 1}`);
        downloadButton.onclick = (e) => {
            e.stopPropagation(); // Prevent image click when button is clicked
            downloadImageWithBase64(imgData.base64, imgData.mimeType, `nova-image-${imgData.prompt.substring(0,20).replace(/\s+/g, '_')}-${index + 1}.jpeg`);
        };

        overlayDiv.appendChild(downloadButton);
        itemDiv.appendChild(imgElement);
        itemDiv.appendChild(overlayDiv);
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
        imageStudioErrorMessageElement.textContent = "Please enter a prompt for image generation.";
        imageStudioErrorMessageElement.style.display = 'block';
        return;
    }

    if (!geminiInitialized && !initializeGeminiSDK()) {
        imageStudioErrorMessageElement.textContent = "AI Service not available. Cannot generate images.";
        imageStudioErrorMessageElement.style.display = 'block';
        return;
    }

    imageStudioGenerateButton.disabled = true;
    imageStudioGenerateButton.classList.add('opacity-50', 'cursor-not-allowed');
    if (imageStudioLoadingIndicator) imageStudioLoadingIndicator.style.display = 'flex';
    if (imageStudioGridElement) imageStudioGridElement.innerHTML = ''; // Clear previous grid
    if (imageStudioErrorMessageElement) imageStudioErrorMessageElement.style.display = 'none'; // Clear previous errors
    if (imageStudioDownloadAllButton) imageStudioDownloadAllButton.style.display = 'none';
    currentGeneratedImagesData = []; // Reset

    try {
        const imageGenConfig = {
            numberOfImages: 4, // Default to 4 images
            outputMimeType: 'image/jpeg', // Default
        };

        // Get aspect ratio from select, default if not found
        if (imageStudioAspectRatioSelect && imageStudioAspectRatioSelect.value) {
            imageGenConfig.aspectRatio = imageStudioAspectRatioSelect.value;
        } else {
            imageGenConfig.aspectRatio = "1:1"; // Default square
        }

        // Determine model based on engine selection (currently both use IMAGE_MODEL_NAME)
        const selectedEngineModel = (imageStudioEngineSelect?.value === 'imagefx') ? IMAGE_MODEL_NAME : IMAGE_MODEL_NAME;

        const response = await ai.models.generateImages({
            model: selectedEngineModel,
            prompt: prompt,
            config: imageGenConfig,
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            currentGeneratedImagesData = response.generatedImages.map(imgInfo => ({
                base64: imgInfo.image.imageBytes,
                prompt: prompt, // Store prompt with each image for potential use
                mimeType: imgInfo.image.mimeType || 'image/jpeg' // Fallback mimeType
            }));
            displayGeneratedImages(currentGeneratedImagesData);
            if (imageStudioDownloadAllButton) imageStudioDownloadAllButton.style.display = 'flex'; // Show download all button
        } else {
            if (imageStudioErrorMessageElement) {
                imageStudioErrorMessageElement.textContent = "No images were generated. Try a different prompt or check the model settings.";
                imageStudioErrorMessageElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error generating images in Image Studio:", error);
        let errMsg = "Failed to generate images. Please try again.";
        if (error instanceof Error) {
            errMsg = `Error: ${error.message}`;
        } else if (typeof error === 'string') {
            errMsg = error;
        }
        // Check for safety related errors (example, adjust based on actual API error messages)
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
    // Ensure voices are loaded for TTS
    if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices(); // Populate voices list
        };
    }
    window.speechSynthesis.getVoices(); // Initial attempt to load voices

    // Settings: AI Tone
    aiToneRadios?.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const target = event.target;
            currentAiTone = target.value;
            saveSetting('aiTone', currentAiTone);
        });
    });

    // Settings: Dark Mode
    darkModeToggle?.addEventListener('change', () => {
        if (!darkModeToggle) return;
        darkModeEnabled = darkModeToggle.checked;
        document.body.classList.toggle('light-mode', !darkModeEnabled);
        saveSetting('darkModeEnabled', darkModeEnabled);
    });

    // Settings: TTS
    ttsToggle?.addEventListener('change', () => {
        if (!ttsToggle) return;
        ttsEnabled = ttsToggle.checked;
        saveSetting('ttsEnabled', ttsEnabled);
        if (!ttsEnabled && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel(); // Stop TTS if disabled while speaking
        }
    });

    // Settings: Internet Search
    internetSearchToggle?.addEventListener('change', () => {
        if (!internetSearchToggle) return;
        internetSearchEnabled = internetSearchToggle.checked;
        saveSetting('internetSearchEnabled', internetSearchEnabled);
    });
    popoverInternetSearchToggle?.addEventListener('change', () => {
        if (!popoverInternetSearchToggle || !internetSearchToggle) return;
        internetSearchEnabled = popoverInternetSearchToggle.checked;
        internetSearchToggle.checked = internetSearchEnabled; // Sync with main settings
        saveSetting('internetSearchEnabled', internetSearchEnabled);
    });


    // Settings: Deep Thinking
    deepThinkingToggle?.addEventListener('change', () => {
        if (!deepThinkingToggle) return;
        deepThinkingEnabled = deepThinkingToggle.checked;
        saveSetting('deepThinkingEnabled', deepThinkingEnabled);
    });
    popoverDeepThinkingToggle?.addEventListener('change', () => {
        if (!popoverDeepThinkingToggle || !deepThinkingToggle) return;
        deepThinkingEnabled = popoverDeepThinkingToggle.checked;
        deepThinkingToggle.checked = deepThinkingEnabled; // Sync
        saveSetting('deepThinkingEnabled', deepThinkingEnabled);
    });

    // Settings: Advanced Scientific Mode
    advancedScientificModeToggle?.addEventListener('change', () => {
        if (!advancedScientificModeToggle) return;
        advancedScientificModeEnabled = advancedScientificModeToggle.checked;
        saveSetting('advancedScientificModeEnabled', advancedScientificModeEnabled);
        // If scientific mode is enabled, usually deep thinking is implied or handled differently
        if (advancedScientificModeEnabled && deepThinkingToggle) {
            // deepThinkingToggle.checked = true; // Optionally force enable
            // deepThinkingToggle.disabled = true; // Optionally disable manual override
        } else if (deepThinkingToggle) {
            // deepThinkingToggle.disabled = false;
        }
    });
    popoverScientificModeToggle?.addEventListener('change', () => {
        if (!popoverScientificModeToggle || !advancedScientificModeToggle) return;
        advancedScientificModeEnabled = popoverScientificModeToggle.checked;
        advancedScientificModeToggle.checked = advancedScientificModeEnabled; // Sync
        saveSetting('advancedScientificModeEnabled', advancedScientificModeEnabled);
    });


    // Settings Screen: Creativity Level Select
    creativityLevelSelect?.addEventListener('change', () => {
        if (!creativityLevelSelect) return;
        currentCreativityLevel = creativityLevelSelect.value;
        saveSetting('currentCreativityLevel', currentCreativityLevel);
    });


    // Chat Screen: Voice Mode Toggle
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
            if (window.speechSynthesis.speaking) window.speechSynthesis.cancel(); // Stop any ongoing TTS
            if (!isListening) handleMicInput(); // Start listening
        } else {
            if (isListening && recognition) recognition.stop(); // Stop listening
        }
    });

    // Chat Screen: Process Log Toggle
    toggleProcessLogButtonElement?.addEventListener('click', () => toggleProcessLogPanel());
    processLogCloseButtonElement?.addEventListener('click', () => toggleProcessLogPanel(false)); // Force close

    // Advanced Options Popover Toggle
    advancedOptionsButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        if (advancedOptionsPopover) {
            const isVisible = advancedOptionsPopover.style.display === 'block';
            advancedOptionsPopover.style.display = isVisible ? 'none' : 'block';
            advancedOptionsButton.setAttribute('aria-expanded', String(!isVisible));
            // Sync toggles within popover when it's opened
            if (!isVisible) {
                if (popoverDeepThinkingToggle) popoverDeepThinkingToggle.checked = deepThinkingEnabled;
                if (popoverInternetSearchToggle) popoverInternetSearchToggle.checked = internetSearchEnabled;
                if (popoverScientificModeToggle) popoverScientificModeToggle.checked = advancedScientificModeEnabled;
            }
        }
    });
    // Hide popover when clicking outside
    document.addEventListener('click', (event) => {
        if (advancedOptionsPopover && advancedOptionsButton &&
            !advancedOptionsPopover.contains(event.target) &&
            !advancedOptionsButton.contains(event.target)) {
            advancedOptionsPopover.style.display = 'none';
            advancedOptionsButton.setAttribute('aria-expanded', 'false');
        }
    });
    popoverUploadFileButton?.addEventListener('click', () => {
        fileInputHidden?.click();
        if (advancedOptionsPopover) advancedOptionsPopover.style.display = 'none';
    });
    popoverGenerateImageButton?.addEventListener('click', () => {
        handleGenerateImageInChat();
        if (advancedOptionsPopover) advancedOptionsPopover.style.display = 'none';
    });
    popoverCodeCanvasButton?.addEventListener('click', () => {
        showScreen(CODE_CANVAS_SCREEN_ID);
        setCodeCanvasView('code');
        if (advancedOptionsPopover) advancedOptionsPopover.style.display = 'none';
    });


    // Onboarding Navigation
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

    // Auth Buttons
    signinButton?.addEventListener('click', handleSignIn);
    signupButton?.addEventListener('click', handleSignUp);
    logoutButton?.addEventListener('click', handleSignOut);
    viewMemoriesButton?.addEventListener('click', () => showScreen(MEMORIES_SCREEN_ID));
    memoriesBackButton?.addEventListener('click', () => showScreen(PROFILE_SCREEN_ID));

    // Tool Creation
    chatListCreateToolButton?.addEventListener('click', () => showScreen(CREATE_TOOL_SCREEN_ID));
    createToolBackButton?.addEventListener('click', () => showScreen(CHAT_LIST_SCREEN_ID));
    saveToolButton?.addEventListener('click', handleSaveTool);


    // Chat List: New Chat Button (Header - Mobile)
    document.getElementById('chat-list-new-chat-header-btn')?.addEventListener('click', createNewChatSession);

    // Chat Input Area
    sendButton?.addEventListener('click', () => {
        if (editingUserMessageId) {
            handleSendMessage(); // This will handle the edit submission
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
            if (editingUserMessageId && chatInput.value.trim() === "") { // If editing and input becomes empty
                if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault; // Or "Cancel Edit"
                sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
            } else if (editingUserMessageId) {
                if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonUpdate;
                sendButton.setAttribute('aria-label', currentStrings.sendButtonUpdate);
            } else {
                if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonDefault;
                sendButton.setAttribute('aria-label', currentStrings.sendButtonDefault);
            }
        }
        // Auto-adjust textarea height
        if(chatInputActionsArea && chatInput) {
            chatInput.style.height = 'auto';
            const scrollHeight = chatInput.scrollHeight;
            const maxHeight = 120; // Max height for 5-6 lines approx.
            chatInput.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            chatInputActionsArea.style.alignItems = scrollHeight > 48 ? 'flex-end' : 'center'; // 48px is h-12
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
    // generateImageChatButtonElement?.addEventListener('click', handleGenerateImageInChat); // Removed, handled by popover
    // uploadFileButton?.addEventListener('click', () => fileInputHidden?.click()); // Removed, handled by popover
    fileInputHidden?.addEventListener('change', handleFileUpload);


    // Screen Back Buttons & Header Buttons
    let previousScreenForSettings = CHAT_LIST_SCREEN_ID; // Default back location from settings
    document.getElementById('settings-back-btn')?.addEventListener('click', () => showScreen(previousScreenForSettings || CHAT_LIST_SCREEN_ID));
    document.getElementById('chat-back-btn')?.addEventListener('click', () => showScreen(CHAT_LIST_SCREEN_ID));
    document.getElementById('profile-back-btn')?.addEventListener('click', () => showScreen(previousScreenForSettings || CHAT_LIST_SCREEN_ID)); // Profile also goes back to where settings was opened from

    document.getElementById('chat-settings-btn')?.addEventListener('click', () => {
        previousScreenForSettings = CHAT_SCREEN_ID; // Set context for back button
        showScreen(SETTINGS_SCREEN_ID);
    });

    // General Navigation Handler (for bottom nav and desktop sidebar)
    function handleNavClick(targetScreen, currentActiveScreenBeforeNav) {
        if (!targetScreen) return;

        if (!currentUser &&
            targetScreen !== SIGNIN_SCREEN_ID &&
            targetScreen !== ONBOARDING_SCREEN_ID &&
            targetScreen !== SPLASH_SCREEN_ID) {
            showScreen(SIGNIN_SCREEN_ID); // Redirect to sign-in if not authenticated
            return;
        }

        if (targetScreen === "discover-screen") { // Example of a non-implemented screen
            alert("Discover section is not yet implemented.");
            return;
        }

        if (targetScreen === PROFILE_SCREEN_ID) {
             // Store where user came from if not already from profile/memories
             if (currentActiveScreenBeforeNav !== PROFILE_SCREEN_ID && currentActiveScreenBeforeNav !== MEMORIES_SCREEN_ID) {
                 previousScreenForSettings = currentActiveScreenBeforeNav;
             }
             showScreen(PROFILE_SCREEN_ID);
        }
        else if (targetScreen === CHAT_SCREEN_ID && currentScreen !== CHAT_SCREEN_ID) { // Specifically for "New Chat" buttons
             createNewChatSession();
        } else if (targetScreen === 'chat-list-screen-home') { // "Home" always goes to chat list
             showScreen(CHAT_LIST_SCREEN_ID);
        } else if (targetScreen === SETTINGS_SCREEN_ID) {
             // Store where user came from if not already from settings
             if (currentActiveScreenBeforeNav !== SETTINGS_SCREEN_ID) {
                previousScreenForSettings = currentActiveScreenBeforeNav;
             }
             showScreen(SETTINGS_SCREEN_ID);
        }
        else if (targetScreen === CREATE_TOOL_SCREEN_ID) {
            showScreen(CREATE_TOOL_SCREEN_ID);
        }
        // General case for valid screens that are not overlays
        else if (screens.includes(targetScreen) &&
                 targetScreen !== WEBVIEW_SCREEN_ID &&
                 targetScreen !== IMAGE_VIEWER_SCREEN_ID &&
                 targetScreen !== CODE_CANVAS_SCREEN_ID &&
                 targetScreen !== MEMORIES_SCREEN_ID) { // Exclude overlays and memory screen which has own back button
            showScreen(targetScreen);
        }
    }

    // Bottom Navigation (Mobile)
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      const buttonItem = item;
      buttonItem.addEventListener('click', () => {
        const targetScreen = buttonItem.dataset.target;
        handleNavClick(targetScreen, currentScreen);
      });
    });

    // Desktop Sidebar Navigation
    document.querySelectorAll('#desktop-sidebar .sidebar-nav-item').forEach(item => {
        const buttonItem = item;
        buttonItem.addEventListener('click', () => {
            const targetScreen = buttonItem.dataset.target;
            handleNavClick(targetScreen, currentScreen);
        });
    });
    toggleSidebarButton?.addEventListener('click', () => {
        isSidebarCollapsed = !isSidebarCollapsed;
        desktopSidebar?.classList.toggle('collapsed', isSidebarCollapsed);
        appMainContent?.classList.toggle('lg:ml-18', isSidebarCollapsed); // Adjust main content margin
        appMainContent?.classList.toggle('lg:ml-60', !isSidebarCollapsed && appMainContent?.classList.contains('xl:ml-64'));
        appMainContent?.classList.toggle('xl:ml-18', isSidebarCollapsed); // Adjust main content margin for XL
        appMainContent?.classList.toggle('xl:ml-64', !isSidebarCollapsed);
        saveSetting('isSidebarCollapsed', isSidebarCollapsed);
    });



    // Webview and Image Viewer Close Buttons
    webviewCloseBtn?.addEventListener('click', () => {
        if (webviewScreenElement && webviewFrame) {
            webviewFrame.src = 'about:blank'; // Clear content
            webviewScreenElement.classList.remove('active');
            // Determine underlying screen to show (usually chat screen or where webview was opened from)
            const underlyingScreen = currentScreen === WEBVIEW_SCREEN_ID ? CHAT_SCREEN_ID : currentScreen;
            showScreen(underlyingScreen); // This might need adjustment if webview can be opened from multiple non-chat screens
        }
    });

    imageViewerCloseBtn?.addEventListener('click', () => {
        if (imageViewerScreenElement && imageViewerImg) {
            imageViewerImg.src = ''; // Clear image
            imageViewerScreenElement.classList.remove('active');
            const underlyingScreen = currentScreen === IMAGE_VIEWER_SCREEN_ID ? CHAT_SCREEN_ID : currentScreen;
            showScreen(underlyingScreen);
        }
    });

    // Event delegation for dynamic content (webview links, download buttons in chat)
    document.body.addEventListener('click', (event) => {
      const target = event.target;
      // Handle webview links
      if (target.classList.contains('webview-link') && target.dataset.url) {
          event.preventDefault();
          openInAppWebView(target.dataset.url);
      }
      // Handle in-chat image download buttons
      const downloadButton = target.closest('.download-in-chat-image-btn');
      if (downloadButton instanceof HTMLElement && downloadButton.dataset.base64 && downloadButton.dataset.mime) {
          const base64 = downloadButton.dataset.base64;
          const mimeType = downloadButton.dataset.mime;
          const promptForImage = downloadButton.dataset.prompt || 'generated-image';
          const filename = `nova-chat-image-${promptForImage.substring(0,20).replace(/\s+/g, '_')}.jpeg`;
          downloadImageWithBase64(base64, mimeType, filename);
      }
    });

    // Event delegation for code block buttons within chat messages
    chatMessagesContainer?.addEventListener('click', (event) => {
        const targetElement = event.target;
        const previewButton = targetElement.closest('.preview-code-btn');
        const copyButton = targetElement.closest('.copy-code-btn');

        if (previewButton instanceof HTMLElement && codeCanvasTextarea) {
            const rawCode = previewButton.dataset.code;
            if (rawCode) {
                codeCanvasTextarea.value = rawCode;
                showScreen(CODE_CANVAS_SCREEN_ID);
                setCodeCanvasView('preview'); // Default to preview when opened from chat
                renderCodeToIframe();
            }
        } else if (copyButton instanceof HTMLElement) {
            const rawCode = copyButton.dataset.code;
            if (rawCode && navigator.clipboard) {
                navigator.clipboard.writeText(rawCode).then(() => {
                    const originalContent = copyButton.innerHTML;
                    copyButton.innerHTML = `<span class="material-symbols-outlined" style="font-size:1em; vertical-align: middle; line-height:1;">check_circle</span> <span style="vertical-align: middle;">Copied!</span>`;
                    copyButton.disabled = true;
                    setTimeout(() => {
                        copyButton.innerHTML = originalContent;
                        copyButton.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy code: ', err);
                    alert('Failed to copy code to clipboard.');
                });
            }
        }
    });

    // Code Canvas Screen Buttons
    // codeCanvasButton?.addEventListener('click', () => { // Removed, handled by popover
    //   showScreen(CODE_CANVAS_SCREEN_ID);
    //   setCodeCanvasView('code'); // Default to code view when opened via main button
    // });
    codeCanvasCloseButton?.addEventListener('click', () => {
        if (codeCanvasScreenElement) codeCanvasScreenElement.classList.remove('active');
        setCodeCanvasView('code'); // Reset to code view
        if (codeCanvasInlinePreviewIframe) codeCanvasInlinePreviewIframe.srcdoc = ''; // Clear preview
        const underlyingScreen = currentScreen === CODE_CANVAS_SCREEN_ID ? CHAT_SCREEN_ID : currentScreen;
        showScreen(underlyingScreen);
    });
    codeCanvasCopyToChatButton?.addEventListener('click', () => {
        if (codeCanvasTextarea && chatInput) {
            const codeText = codeCanvasTextarea.value;
            if (codeText.trim()) {
                // Wrap in markdown code block for chat
                chatInput.value = `\`\`\`\n${codeText}\n\`\`\``;
            }
            if (codeCanvasScreenElement) codeCanvasScreenElement.classList.remove('active');
            showScreen(CHAT_SCREEN_ID);
            chatInput.focus();
        }
    });

    // Code Canvas Textarea Input (for live preview)
    codeCanvasTextarea?.addEventListener('input', () => {
        if (codeCanvasViewMode === 'preview') {
            renderCodeToIframeDebounced();
        }
    });

    // Code Canvas Toggle View Button
    codeCanvasToggleViewButton?.addEventListener('click', () => {
        if (codeCanvasViewMode === 'code') {
            setCodeCanvasView('preview');
            renderCodeToIframe(); // Render immediately when switching to preview
        } else {
            setCodeCanvasView('code');
        }
    });

    // Code Canvas Fullscreen Preview
    codeCanvasEnterFullscreenButton?.addEventListener('click', () => {
        if (fullScreenPreviewOverlay && fullScreenPreviewIframe && codeCanvasTextarea) {
            fullScreenPreviewIframe.srcdoc = codeCanvasTextarea.value;
            fullScreenPreviewOverlay.style.display = 'flex';
        }
    });
    fullScreenPreviewCloseButton?.addEventListener('click', () => {
        if (fullScreenPreviewOverlay && fullScreenPreviewIframe) {
            fullScreenPreviewOverlay.style.display = 'none';
            fullScreenPreviewIframe.srcdoc = ''; // Clear iframe content
        }
    });


    // Image Studio Buttons
    imageStudioGenerateButton?.addEventListener('click', handleGenerateImages);
    imageStudioDownloadAllButton?.addEventListener('click', () => {
        currentGeneratedImagesData.forEach((imgData, index) => {
            const promptPart = imgData.prompt.substring(0, 20).replace(/\s+/g, '_'); // Sanitize prompt for filename
            downloadImageWithBase64(imgData.base64, imgData.mimeType, `nova-image-${promptPart}-${index + 1}.jpeg`);
        });
    });
    imageStudioEngineSelect?.addEventListener('change', (event) => {
        const target = event.target;
        currentImageEngine = target.value;
        saveSetting('currentImageEngine', currentImageEngine);
    });

    // Speech Recognition Event Handlers
    if (recognition) {
        recognition.onstart = () => {
            isListening = true;
            micButtonContainer?.classList.add('listening');
            micButton?.querySelector('.mic-listening-indicator')?.classList.add('animate-ping', 'opacity-100');
            micButton?.setAttribute('aria-label', 'Stop listening');
            micButton?.setAttribute('aria-pressed', 'true');
            // Disable other input methods while listening
            if (voiceModeToggle) voiceModeToggle.disabled = true;
            if (advancedOptionsButton) advancedOptionsButton.disabled = true;
        };

        recognition.onend = () => {
            isListening = false;
            micButtonContainer?.classList.remove('listening');
            micButton?.querySelector('.mic-listening-indicator')?.classList.remove('animate-ping', 'opacity-100');
            micButton?.setAttribute('aria-label', 'Use microphone');
            micButton?.setAttribute('aria-pressed', 'false');
            // Re-enable other input methods
            if (voiceModeToggle) voiceModeToggle.disabled = false;
            if (advancedOptionsButton) advancedOptionsButton.disabled = isLoading || isImageLoading;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (chatInput) chatInput.value = transcript;
            if (voiceModeActive) { // If in voice mode, automatically send
                handleSendMessage();
            }
        };
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = "Speech recognition error. ";
            if (event.error === 'no-speech') errorMessage += "No speech detected.";
            else if (event.error === 'audio-capture') errorMessage += "Microphone problem. Please check permissions and hardware.";
            else if (event.error === 'not-allowed') errorMessage += "Permission to use microphone was denied or not granted.";
            else if (event.error === 'language-not-supported') errorMessage += `STT language (${recognition.lang}) not supported.`;
            else errorMessage += `Details: ${event.error}`;


            // Display error unless it's just "no-speech" in voice mode (which is common)
            if (event.error !== 'no-speech' || !voiceModeActive) {
                 displaySystemMessage(errorMessage, CHAT_SCREEN_ID, 'en');
            }

            // If a critical error occurs in voice mode, disable voice mode
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
            // Ensure listening state is correctly reset
            isListening = false;
            micButtonContainer?.classList.remove('listening');
            micButton?.querySelector('.mic-listening-indicator')?.classList.remove('animate-ping', 'opacity-100');
        };
    }

    // Settings: Language Select
    settingLanguageSelect?.addEventListener('change', (event) => {
        const newLang = event.target.value;
        if (uiStrings[newLang]) {
            currentLanguage = newLang;
            saveLanguagePreference(newLang);
            applyLanguageToUI();
            // If speech recognition is active, update its language
            if (recognition) {
                recognition.lang = newLang === 'ar' ? 'ar-SA' : (navigator.language || 'en-US');
            }
        }
    });

    // Settings: General Memories
    saveGeneralMemoryButton?.addEventListener('click', handleSaveGeneralMemory);
    generalMemoriesListContainer?.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-general-memory-btn')) {
            const memoryId = event.target.dataset.id;
            if (memoryId) handleDeleteGeneralMemory(memoryId);
        }
    });

}

// --- Language and Localization ---
function applyLanguageToUI() {
    const langStrings = uiStrings[currentLanguage] || uiStrings.en;
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

    if (chatInputActionsArea) { // Adjust input area direction based on language
        chatInputActionsArea.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    }


    // Update static text content
    const elementsToUpdate = {
        // Splash
        '#splash-version-text': 'splashVersion',
        // Onboarding (Content is JS-driven, but buttons)
        '#onboarding-next-btn span': 'onboardingNext',
        '#onboarding-skip-btn span': 'onboardingSkip',
        // Sign In
        '#signin-welcome-title': 'signInWelcome',
        '#signin-prompt-text': 'signInPrompt',
        '#signin-button': 'signInButton',
        '#signup-button': 'signUpButton',
        '#signin-poweredby-text': 'signInPoweredBy',
        // Chat List
        '#chat-list-title': 'chatListTitle',
        // Chat Screen (placeholders are dynamic, send button text)
        // Settings
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
        // Profile
        '#profile-title': 'profileTitle',
        '#profile-learned-info-label': 'profileLearnedInfo',
        '#profile-interests-label': 'profileInterests',
        '#profile-preferences-label': 'profilePreferences',
        '#profile-facts-label': 'profileFacts',
        '#profile-view-memories-text': 'profileViewMemories',
        '#logout-button': 'profileLogout',
        // Memories
        '#memories-title': 'memoriesTitle',
        // Create Tool
        '#create-tool-title': 'createToolTitle',
        '#tool-name-label': 'toolNameLabel',
        '#tool-instructions-label': 'toolInstructionsLabel',
        '#tool-knowledge-label': 'toolKnowledgeLabel',
        '#save-tool-text': 'toolSaveButton',
        // Image Studio
        '#image-studio-title': 'imageStudioTitle',
        '#image-studio-prompt-label': 'imageStudioPromptLabel',
        '#image-studio-engine-label': 'imageStudioEngineLabel',
        '#image-studio-aspect-label': 'imageStudioAspectLabel',
        '#image-studio-generate-text': 'imageStudioGenerateButton',
        '#image-studio-loading-text': 'imageStudioLoading',
        '#image-studio-download-all-text': 'imageStudioDownloadAll',
        // Code Canvas
        '#code-canvas-title': 'codeCanvasTitle',
        '#code-canvas-copy-to-chat-btn span': 'codeCanvasCopyBtnText', // Target the span inside
        // Advanced Options Popover
        '#adv-opt-popover-title': 'advOptTitle',
        '.adv-opt-deep-thinking-label': 'advOptDeepThinking',
        '.adv-opt-internet-search-label': 'advOptInternetSearch',
        '.adv-opt-scientific-mode-label': 'advOptScientificMode',
        '#popover-upload-file-button span': 'advOptUploadFile', // Target the span
        '#popover-generate-image-button span': 'advOptGenerateImage',
        '#popover-code-canvas-button span': 'advOptCodeCanvas',
        // Nav Items (text part)
        '.nav-text-home': 'navHome',
        '.nav-text-image-studio': 'navImageStudio',
        '.nav-text-new-chat': 'navNewChat',
        '.nav-text-profile': 'navProfile',
        '.nav-text-settings': 'navSettings',
    };

    for (const selector in elementsToUpdate) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (langStrings[elementsToUpdate[selector]]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = langStrings[elementsToUpdate[selector]];
                } else {
                    el.textContent = langStrings[elementsToUpdate[selector]];
                }
            }
        });
    }
    // Update chat input placeholder dynamically based on mode
    if (chatInput) {
        if (editingUserMessageId) {
            chatInput.placeholder = langStrings.chatInputPlaceholderEditing;
        } else if (voiceModeActive) {
            chatInput.placeholder = langStrings.chatInputPlaceholderVoice;
        } else {
            chatInput.placeholder = langStrings.chatInputPlaceholder;
        }
    }
    // Update send button text based on editing state
    if (sendButton) {
        const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
        if (sendButtonTextSpan) {
           sendButtonTextSpan.textContent = editingUserMessageId ? langStrings.sendButtonUpdate : langStrings.sendButtonDefault;
        }
        sendButton.setAttribute('aria-label', editingUserMessageId ? langStrings.sendButtonUpdate : langStrings.sendButtonDefault);
    }

    // Update Code Canvas toggle button text
    if (codeCanvasToggleViewButton) {
        codeCanvasToggleViewButton.textContent = codeCanvasViewMode === 'code' ? langStrings.codeCanvasShowPreview : langStrings.codeCanvasShowCode;
    }
     // Update general memory input placeholder
    if (generalMemoryInput) {
        generalMemoryInput.placeholder = langStrings.settingsGeneralMemoryPlaceholder;
    }
    // Update profile screen default texts if no data
    updateProfileScreenUI();
    // Update search placeholder
    const searchInput = document.getElementById('search-chats-tools-input');
    if (searchInput) searchInput.placeholder = langStrings.searchChatsToolsPlaceholder;

    // Set dir for elements that need it for proper layout with mixed content
    if (processLogPanelElement) processLogPanelElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';

    // Re-render dynamic lists that might contain translatable text or need reordering
    renderChatList();
    if (currentScreen === MEMORIES_SCREEN_ID) renderMemoriesScreen();
    if (currentScreen === SETTINGS_SCREEN_ID) renderGeneralMemoriesList();


}

function loadLanguagePreference() {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && uiStrings[savedLang]) {
        currentLanguage = savedLang;
    } else {
        // Try to detect browser language if no preference saved
        const browserLang = navigator.language.split('-')[0];
        if (uiStrings[browserLang]) {
            currentLanguage = browserLang;
        } else {
            currentLanguage = 'en'; // Default to English
        }
    }
    if (settingLanguageSelect) settingLanguageSelect.value = currentLanguage;
}

function saveLanguagePreference(lang) {
    localStorage.setItem('appLanguage', lang);
}


// --- END OF PORTED/NEWLY ADDED FUNCTIONS ---


// --- Initialization ---
function initializeApp() {
  // Query DOM Elements
  chatMessagesContainer = document.getElementById('chat-messages-container');
  chatInput = document.getElementById('chat-input');
  sendButton = document.getElementById('send-chat-button');
  suggestedPromptButtons = document.querySelectorAll('.suggested-prompt-btn');
  micButton = document.getElementById('mic-button');
  if (micButton) {
    micButtonContainer = micButton.closest('.mic-button-container');
  }
  voiceModeToggle = document.getElementById('voice-mode-toggle');
  chatListItemsContainer = document.getElementById('chat-list-items-container');
  chatScreenTitleElement = document.getElementById('chat-screen-title');
  novaProcessingIndicatorElement = document.getElementById('nova-processing-indicator');
  novaImageProcessingIndicatorElement = document.getElementById('nova-image-processing-indicator');
  chatInputActionsArea = document.getElementById('chat-input-actions-area');

  processLogPanelElement = document.getElementById('process-log-panel');
  processLogListElement = document.getElementById('process-log-list');
  toggleProcessLogButtonElement = document.getElementById('toggle-process-log-btn');
  processLogCloseButtonElement = document.getElementById('process-log-close-btn');
  // generateImageChatButtonElement = document.getElementById('generate-image-chat-button'); // Removed
  // codeCanvasButton = document.getElementById('code-canvas-button'); // Removed
  advancedOptionsButton = document.getElementById('advanced-options-button');
  advancedOptionsPopover = document.getElementById('advanced-options-popover');
  popoverDeepThinkingToggle = document.getElementById('popover-deep-thinking-toggle');
  popoverInternetSearchToggle = document.getElementById('popover-internet-search-toggle');
  popoverScientificModeToggle = document.getElementById('popover-scientific-mode-toggle');
  popoverUploadFileButton = document.getElementById('popover-upload-file-button');
  popoverGenerateImageButton = document.getElementById('popover-generate-image-button');
  popoverCodeCanvasButton = document.getElementById('popover-code-canvas-button');

  fileInputHidden = document.getElementById('file-input-hidden');
  stagedFilePreviewElement = document.getElementById('staged-file-preview');
  stagedFileClearButton = stagedFilePreviewElement?.querySelector('#staged-file-clear-button');


  // Settings Screen Elements
  aiToneRadios = document.querySelectorAll('input[name="ai_tone"]');
  darkModeToggle = document.getElementById('setting-dark-mode-toggle');
  ttsToggle = document.getElementById('setting-tts-toggle');
  internetSearchToggle = document.getElementById('setting-internet-search-toggle');
  deepThinkingToggle = document.getElementById('setting-deep-thinking-toggle');
  creativityLevelSelect = document.getElementById('setting-creativity-level');
  advancedScientificModeToggle = document.getElementById('setting-advanced-scientific-mode-toggle');
  settingLanguageSelect = document.getElementById('setting-language-select');
  generalMemoryInput = document.getElementById('setting-general-memory-input');
  saveGeneralMemoryButton = document.getElementById('setting-save-general-memory-btn');
  generalMemoriesListContainer = document.getElementById('settings-general-memories-list');


  // Profile Screen Elements
  profileUserName = document.getElementById('profile-user-name');
  profileUserEmail = document.getElementById('profile-user-email');
  profileInterests = document.getElementById('profile-interests');
  profilePreferences = document.getElementById('profile-preferences');
  profileFacts = document.getElementById('profile-facts');
  logoutButton = document.getElementById('logout-button');
  viewMemoriesButton = document.getElementById('view-memories-btn');

  // Memories Screen Elements
  memoriesListContainer = document.getElementById('memories-list-container');
  memoriesBackButton = document.getElementById('memories-back-btn');

  // Webview Elements
  webviewScreenElement = document.getElementById(WEBVIEW_SCREEN_ID);
  webviewFrame = document.getElementById('webview-frame');
  webviewTitle = document.getElementById('webview-title');
  webviewLoading = document.getElementById('webview-loading');
  webviewCloseBtn = document.getElementById('webview-close-btn');

  // Image Viewer Elements
  imageViewerScreenElement = document.getElementById(IMAGE_VIEWER_SCREEN_ID);
  imageViewerImg = document.getElementById('image-viewer-img');
  imageViewerCloseBtn = document.getElementById('image-viewer-close-btn');

  // Onboarding Elements
  onboardingDots = document.querySelectorAll('#onboarding-dots .onboarding-dot');
  onboardingNextBtn = document.getElementById('onboarding-next-btn');
  onboardingSkipBtn = document.getElementById('onboarding-skip-btn');

  // Code Canvas Elements
  codeCanvasScreenElement = document.getElementById(CODE_CANVAS_SCREEN_ID);
  codeCanvasTextarea = document.getElementById('code-canvas-textarea');
  codeCanvasCopyToChatButton = document.getElementById('code-canvas-copy-to-chat-btn');
  codeCanvasCloseButton = document.getElementById('code-canvas-close-btn');
  codeEditorWrapper = document.getElementById('code-editor-wrapper');
  codeCanvasInlinePreviewIframe = document.getElementById('code-canvas-inline-preview-iframe');
  codeCanvasToggleViewButton = document.getElementById('code-canvas-toggle-view-btn');
  codeCanvasEnterFullscreenButton = document.getElementById('code-canvas-enter-fullscreen-btn');

  // Full Screen Preview Elements
  fullScreenPreviewOverlay = document.getElementById('full-screen-preview-overlay');
  fullScreenPreviewIframe = document.getElementById('full-screen-preview-iframe');
  fullScreenPreviewCloseButton = document.getElementById('full-screen-preview-close-btn');

  // Image Studio Elements
  imageStudioPromptInput = document.getElementById('image-studio-prompt-input');
  imageStudioEngineSelect = document.getElementById('image-studio-engine-select');
  imageStudioAspectRatioSelect = document.getElementById('image-studio-aspect-ratio-select');
  imageStudioGenerateButton = document.getElementById('image-studio-generate-btn');
  imageStudioLoadingIndicator = document.getElementById('image-studio-loading-indicator');
  imageStudioErrorMessageElement = document.getElementById('image-studio-error-message');
  imageStudioGridElement = document.getElementById('image-studio-grid');
  imageStudioDownloadAllButton = document.getElementById('image-studio-download-all-btn');

  // Sign-In Screen Elements
  signinEmailInput = document.getElementById('signin-email-input');
  signinPasswordInput = document.getElementById('signin-password-input');
  signinButton = document.getElementById('signin-button');
  signupButton = document.getElementById('signup-button');
  authErrorMessageElement = document.getElementById('auth-error-message');

  // Create Tool Screen Elements
  createToolScreenElement = document.getElementById(CREATE_TOOL_SCREEN_ID);
  toolNameInput = document.getElementById('tool-name-input');
  toolInstructionsInput = document.getElementById('tool-instructions-input');
  toolKnowledgeInput = document.getElementById('tool-knowledge-input');
  saveToolButton = document.getElementById('save-tool-button');
  createToolBackButton = document.getElementById('create-tool-back-btn');
  createToolErrorMessageElement = document.getElementById('create-tool-error-message');
  chatListCreateToolButton = document.getElementById('chat-list-create-tool-btn');

  // Desktop Sidebar
  desktopSidebar = document.getElementById('desktop-sidebar');
  toggleSidebarButton = document.getElementById('toggle-sidebar-btn');
  appMainContent = document.getElementById('app-main-content');


  // Ensure process.env exists (for browser environments)
  if (typeof process === 'undefined') {
    window.process = { env: {} };
  }
   if (!GEMINI_API_KEY) { // Use constant GEMINI_API_KEY
      console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
      // Optionally display a more user-facing error here or disable API-dependent features
  }

  loadLanguagePreference(); // Load language first
  initFirebaseAuth(); // This will then load settings, data, and apply UI updates including language

  window.addEventListener('load', () => {
    if(currentScreen === CHAT_SCREEN_ID) scrollToBottomChat();
  });
  updateStagedFilePreview(); // Ensure it's correctly hidden initially
  console.log("Nova AI Mobile Initialized (v2.0.2 - Firebase & Tools).");
}

// --- Firebase Authentication & Database ---
function initFirebaseAuth() {
    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        firebaseDb = firebase.database(); // Initialize Realtime Database

        firebaseAuth.onAuthStateChanged(async (user) => { // Make async to await data loading
            const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
            if (user) {
                currentUser = user;
                // Profile info update from Firebase user object (email, displayName)
                if (profileUserEmail) profileUserEmail.textContent = user.email;
                if (profileUserName && user.displayName) profileUserName.textContent = user.displayName;
                else if (profileUserName && user.email) profileUserName.textContent = user.email.split('@')[0]; // Fallback to email part
                if (logoutButton) logoutButton.style.display = 'block';

                // Load data from Firebase AFTER user is confirmed
                await loadUserProfileFromFirebase(); // This now includes profile.name
                await loadChatSessionsFromFirebase();
                await loadSavedMemoriesFromFirebase();
                await loadCustomToolsFromFirebase();
                await loadGeneralMemoriesFromFirebase();


                if (currentScreen === SIGNIN_SCREEN_ID || currentScreen === SPLASH_SCREEN_ID || currentScreen === ONBOARDING_SCREEN_ID) {
                     showScreen(CHAT_LIST_SCREEN_ID); // Go to chat list after login and data load
                }
                if (!geminiInitialized) initializeGeminiSDK(); // Init Gemini SDK after user is set up

            } else { // User is signed out
                currentUser = null;
                if (profileUserEmail) profileUserEmail.textContent = "user.email@example.com";
                if (profileUserName) profileUserName.textContent = "User Name";
                if (logoutButton) logoutButton.style.display = 'none';

                // Clear local copies of user-specific data
                chatSessions = [];
                savedMemories = [];
                customTools = [];
                generalMemories = [];
                userProfile = { interests: [], preferences: {}, facts: [] }; // Reset profile

                // Handle screen transition for signed-out users
                if (currentScreen !== SPLASH_SCREEN_ID && currentScreen !== ONBOARDING_SCREEN_ID && currentScreen !== SIGNIN_SCREEN_ID) {
                    showScreen(SIGNIN_SCREEN_ID);
                } else if (currentScreen === SPLASH_SCREEN_ID) { // From splash, decide onboarding or sign-in
                     setTimeout(() => {
                        if (onboardingComplete) {
                            showScreen(SIGNIN_SCREEN_ID);
                        } else {
                            showScreen(ONBOARDING_SCREEN_ID);
                        }
                    }, 2500); // Splash screen duration
                }
            }
            // Common setup regardless of auth state (after data might have been loaded or cleared)
            loadSettings(); // Load general app settings (like dark mode, TTS state)
            applySettings(); // Apply general app settings
            renderChatList(); // Render chat list (will be empty if signed out)
            updateProfileScreenUI(); // Update profile screen based on currentUser and userProfile
            applyLanguageToUI(); // This was moved to be called after data loading and settings
            setupEventListeners(); // Setup event listeners once
            if (currentScreen === ONBOARDING_SCREEN_ID) updateOnboardingUI(); // If on onboarding, update its UI
        });
    } catch (error) {
        console.error("Firebase initialization error:", error);
        if (authErrorMessageElement) {
            authErrorMessageElement.textContent = "Failed to initialize authentication. Please refresh.";
            authErrorMessageElement.style.display = "block";
        }
        // Fallback: Load local settings and proceed to sign-in if Firebase fails catastrophically
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
        .then((userCredential) => {
            // currentUser will be set by onAuthStateChanged
            console.log("User signed up successfully:", userCredential.user);
            // Initialize user profile in Firebase immediately after sign up
            const initialProfile = { name: email.split('@')[0], interests: [], preferences: {}, facts: [] };
            firebaseDb.ref(`users/${userCredential.user.uid}/profile`).set(initialProfile)
                .then(() => console.log("Initial user profile saved to Firebase."))
                .catch(error => console.error("Error saving initial profile:", error));
            // Other initial data (empty arrays for tools, memories, etc.) will be handled by load functions if they don't find data
        })
        .catch((error) => {
            console.error("Sign up error:", error.code, error.message);
            let userMessage = "An unexpected error occurred during sign up. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                userMessage = "This email address is already in use. Please try signing in or use a different email.";
            } else if (error.code === 'auth/weak-password') {
                userMessage = "The password is too weak. Please choose a stronger password (at least 6 characters).";
            } else if (error.code === 'auth/invalid-email') {
                userMessage = "The email address is not valid. Please enter a correct email.";
            } else {
                userMessage = error.message; // Show Firebase error message directly for other cases
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
        .then((userCredential) => {
            // currentUser will be set by onAuthStateChanged, which then loads data
            console.log("User signed in successfully:", userCredential.user);
        })
        .catch((error) => {
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
            currentChatSessionId = null; // Clear current session ID
            // chatSessions, savedMemories etc. will be cleared by onAuthStateChanged
            if (chatMessagesContainer) chatMessagesContainer.innerHTML = ''; // Clear chat UI
            // onAuthStateChanged will handle navigating to SIGNIN_SCREEN_ID
        })
        .catch((error) => {
            console.error("Sign out error:", error);
             // Display error message to user
             if (authErrorMessageElement && currentScreen === PROFILE_SCREEN_ID) { // If on profile screen, use its error message element
                authErrorMessageElement.textContent = "Logout failed: " + error.message;
                authErrorMessageElement.style.display = 'block';
            } else {
                alert("Logout failed: " + error.message); // Fallback to alert
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
            } else { // If parsed but invalid, reset to default
                currentAiTone = defaultAiTone;
                saveSetting('aiTone', currentAiTone); // Save the default back
            }
        } catch (e) { // If not JSON parseable, check if it's a valid string directly
            if (typeof storedTone === 'string' && validAiTones.includes(storedTone)) {
                currentAiTone = storedTone;
                saveSetting('aiTone', currentAiTone); // Re-save to ensure JSON format if it wasn't
            } else { // Invalid string or parsing error
                currentAiTone = defaultAiTone;
                localStorage.removeItem('aiTone'); // Clean up invalid entry
                saveSetting('aiTone', currentAiTone);
            }
        }
    } // If not stored, defaultAiTone is already set

    const storedDarkMode = localStorage.getItem('darkModeEnabled');
    darkModeEnabled = storedDarkMode ? JSON.parse(storedDarkMode) : true; // Default to dark mode

    const storedTts = localStorage.getItem('ttsEnabled');
    ttsEnabled = storedTts ? JSON.parse(storedTts) : false;

    const storedVoiceMode = localStorage.getItem('voiceModeActive');
    voiceModeActive = storedVoiceMode ? JSON.parse(storedVoiceMode) : false;

    const storedInternetSearch = localStorage.getItem('internetSearchEnabled');
    internetSearchEnabled = storedInternetSearch ? JSON.parse(storedInternetSearch) : false;

    const storedDeepThinking = localStorage.getItem('deepThinkingEnabled');
    deepThinkingEnabled = storedDeepThinking ? JSON.parse(storedDeepThinking) : false;

    const storedAdvancedScientific = localStorage.getItem('advancedScientificModeEnabled');
    advancedScientificModeEnabled = storedAdvancedScientific ? JSON.parse(storedAdvancedScientific) : false;

    const storedProcessLogVisible = localStorage.getItem('processLogVisible');
    processLogVisible = storedProcessLogVisible ? JSON.parse(storedProcessLogVisible) : false;

    const storedImageEngine = localStorage.getItem('currentImageEngine');
    currentImageEngine = storedImageEngine ? JSON.parse(storedImageEngine) : 'standard';

    const storedCreativityLevel = localStorage.getItem('currentCreativityLevel');
    currentCreativityLevel = storedCreativityLevel ? JSON.parse(storedCreativityLevel) : 'balanced';

    const storedSidebarCollapsed = localStorage.getItem('isSidebarCollapsed');
    isSidebarCollapsed = storedSidebarCollapsed ? JSON.parse(storedSidebarCollapsed) : false;

}

function applySettings() {
    // AI Tone Radio Buttons
    (document.querySelector(`input[name="ai_tone"][value="${currentAiTone}"]`))?.setAttribute('checked', 'true');
    aiToneRadios?.forEach(radio => {
        radio.checked = radio.value === currentAiTone;
    });

    // Dark Mode Toggle & Body Class
    if (darkModeToggle) darkModeToggle.checked = darkModeEnabled;
    document.body.classList.toggle('light-mode', !darkModeEnabled);

    // TTS Toggle
    if (ttsToggle) ttsToggle.checked = ttsEnabled;

    // Internet Search Toggle
    if (internetSearchToggle) internetSearchToggle.checked = internetSearchEnabled;
    if (popoverInternetSearchToggle) popoverInternetSearchToggle.checked = internetSearchEnabled;


    // Deep Thinking Toggle
    if (deepThinkingToggle) deepThinkingToggle.checked = deepThinkingEnabled;
    if (popoverDeepThinkingToggle) popoverDeepThinkingToggle.checked = deepThinkingEnabled;

    // Advanced Scientific Mode
    if (advancedScientificModeToggle) advancedScientificModeToggle.checked = advancedScientificModeEnabled;
    if (popoverScientificModeToggle) popoverScientificModeToggle.checked = advancedScientificModeEnabled;


    // Creativity Level Select
    if (creativityLevelSelect) creativityLevelSelect.value = currentCreativityLevel;

    // Voice Mode Toggle & Chat Input State
    if (voiceModeToggle) {
        voiceModeToggle.classList.toggle('active', voiceModeActive);
        voiceModeToggle.setAttribute('aria-pressed', String(voiceModeActive));
    }
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (chatInput) {
        chatInput.disabled = voiceModeActive;
        chatInput.classList.toggle('opacity-50', voiceModeActive);
        chatInput.placeholder = voiceModeActive ? currentStrings.chatInputPlaceholderVoice : currentStrings.chatInputPlaceholder;
        chatInput.dir = currentLanguage === 'ar' ? 'rtl' : "auto"; // Set direction for input
    }

    // Process Log Panel Visibility
    if (processLogPanelElement) {
        processLogPanelElement.classList.toggle('open', processLogVisible);
    }
    if (toggleProcessLogButtonElement) {
        toggleProcessLogButtonElement.classList.toggle('active', processLogVisible);
    }

    // Image Studio Engine Select
    if (imageStudioEngineSelect) {
        imageStudioEngineSelect.value = currentImageEngine;
    }

    // Sidebar state
    if (desktopSidebar && appMainContent) {
        desktopSidebar.classList.toggle('collapsed', isSidebarCollapsed);
        appMainContent.classList.toggle('lg:ml-18', isSidebarCollapsed); // Adjust main content margin
        appMainContent.classList.toggle('lg:ml-60', !isSidebarCollapsed && appMainContent.classList.contains('xl:ml-64'));
        appMainContent.classList.toggle('xl:ml-18', isSidebarCollapsed); // Adjust main content margin for XL
        appMainContent.classList.toggle('xl:ml-64', !isSidebarCollapsed);
    }
}

function saveSetting(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// --- User Profile (Firebase based) ---
async function loadUserProfileFromFirebase() {
    if (!currentUser || !firebaseDb) {
        userProfile = { interests: [], preferences: {}, facts: [] }; // Reset if no user/db
        updateProfileScreenUI();
        return;
    }
    try {
        const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/profile`).once('value');
        if (snapshot.exists()) {
            userProfile = snapshot.val();
            // Ensure all parts of userProfile are initialized if not present in Firebase
            userProfile.interests = userProfile.interests || [];
            userProfile.preferences = userProfile.preferences || {};
            userProfile.facts = userProfile.facts || [];
            // userProfile.name is loaded from Firebase auth (displayName) or set from email
        } else {
            // If no profile in DB, create a default one (name can be from auth or email)
            userProfile = {
                name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
                interests: [],
                preferences: {},
                facts: []
            };
            await saveUserProfileToFirebase(); // Save this default to Firebase
        }
    } catch (error) {
        console.error("Error loading user profile from Firebase:", error);
        userProfile = { interests: [], preferences: {}, facts: [] }; // Fallback on error
    }
    updateProfileScreenUI();
}

async function saveUserProfileToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
        // Ensure userProfile.name is consistent with Firebase Auth displayName if available
        // However, allow userProfile.name to be set independently if desired
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


async function extractAndStoreUserInfo(chatSession) {
    if (!ai || !geminiInitialized || !currentUser || !firebaseDb) {
        console.warn("Gemini AI not ready or user not logged in for info extraction.");
        return;
    }
    const messagesToConsider = chatSession.messages.slice(-6); // Consider last 6 messages
    if (messagesToConsider.length < 2) return; // Need at least a user and AI message

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

    let geminiResponse;
    try {
        geminiResponse = await ai.models.generateContent({
            model: TEXT_MODEL_NAME,
            contents: extractionPrompt,
            config: { temperature: 0.1, responseMimeType: "application/json" } // Request JSON output
        });

        let jsonStr = geminiResponse.text.trim();
        // Remove markdown fences if present
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[1]) {
            jsonStr = match[1].trim();
        }

        const extractedData = JSON.parse(jsonStr);

        // If empty object or a specific "no new info" flag, do nothing
        if (Object.keys(extractedData).length === 0 || extractedData.noNewInfo) {
            return;
        }

        let profileUpdated = false;
        // Update userProfile.name if a new one is extracted and it's different
        if (extractedData.userName && extractedData.userName !== userProfile.name) {
            userProfile.name = extractedData.userName;
            // Optionally, update Firebase Auth display name if you want to sync it
            // await currentUser.updateProfile({ displayName: extractedData.userName });
            profileUpdated = true;
        }
        if (extractedData.newInterests && Array.isArray(extractedData.newInterests)) {
            const uniqueNewInterests = extractedData.newInterests.filter((interest) => !userProfile.interests.includes(interest));
            if (uniqueNewInterests.length > 0) {
                userProfile.interests.push(...uniqueNewInterests);
                profileUpdated = true;
            }
        }
        if (extractedData.newFacts && Array.isArray(extractedData.newFacts)) {
            const uniqueNewFacts = extractedData.newFacts.filter((fact) => !userProfile.facts.includes(fact));
            if (uniqueNewFacts.length > 0) {
                userProfile.facts.push(...uniqueNewFacts);
                profileUpdated = true;
            }
        }
        if (extractedData.updatedPreferences && typeof extractedData.updatedPreferences === 'object') {
            for (const [key, value] of Object.entries(extractedData.updatedPreferences)) {
                if (userProfile.preferences[key] !== value) {
                    userProfile.preferences[key] = value;
                    profileUpdated = true;
                }
            }
        }

        if (profileUpdated) {
            await saveUserProfileToFirebase(); // Save updated profile to Firebase
            updateProfileScreenUI(); // Refresh UI
        }

    } catch (e) {
        console.error("Error extracting or parsing user info from Gemini:", e, "\nRaw response text:", geminiResponse?.text);
    }
}


function updateProfileScreenUI() {
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (currentUser) {
        // Prioritize profile.name, then auth displayName, then email part
        if (profileUserName) profileUserName.textContent = userProfile.name || currentUser.displayName || currentUser.email?.split('@')[0] || "User Name";
        if (profileUserEmail) profileUserEmail.textContent = currentUser.email || "user.email@example.com";
        if (logoutButton) logoutButton.style.display = 'block';
    } else { // Signed out
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
function showScreen(screenId) {
  // Authentication check for protected screens
  if (!currentUser && screenId !== SPLASH_SCREEN_ID && screenId !== ONBOARDING_SCREEN_ID && screenId !== SIGNIN_SCREEN_ID) {
    console.log("User not authenticated. Redirecting to sign-in.");
    currentScreen = SIGNIN_SCREEN_ID; // Set current screen before loop
    screens.forEach(id => {
        const screenElement = document.getElementById(id);
        if (screenElement) {
            screenElement.style.display = (id === SIGNIN_SCREEN_ID) ? 'flex' : 'none';
        }
    });
    updateNavigationActiveState(SIGNIN_SCREEN_ID);
    return;
  }

  // Handle overlay screens (webview, image viewer, code canvas)
  const isOverlayScreen = screenId === WEBVIEW_SCREEN_ID || screenId === IMAGE_VIEWER_SCREEN_ID || screenId === CODE_CANVAS_SCREEN_ID;

  // Stop TTS/Speech Recognition if navigating away from chat screen to a non-overlay screen
  if (!isOverlayScreen) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    if (isListening && screenId !== CHAT_SCREEN_ID && recognition) { // Only stop if navigating away from chat
        recognition.stop();
    }
  }

  // Show/Hide screens
  screens.forEach(id => {
    const screenElement = document.getElementById(id);
    if (screenElement) {
        if (id === WEBVIEW_SCREEN_ID || id === IMAGE_VIEWER_SCREEN_ID || id === CODE_CANVAS_SCREEN_ID) {
            // These are overlays, manage with 'active' class
            screenElement.classList.toggle('active', screenId === id);
        } else {
            // Regular screens, manage with display style
            screenElement.style.display = (id === screenId) ? 'flex' : 'none';
        }
    }
  });

  // Update currentScreen state only for non-overlay screens
  if (!isOverlayScreen) {
      currentScreen = screenId;
      updateNavigationActiveState(screenId); // Update nav highlighting
  }

  // Screen-specific logic after showing
  if (screenId === CHAT_SCREEN_ID) {
    scrollToBottomChat();
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    if (!voiceModeActive && chatInput) {
        chatInput.focus();
        chatInput.placeholder = editingUserMessageId ? currentStrings.chatInputPlaceholderEditing : currentStrings.chatInputPlaceholder;
    } else if (chatInput) {
         chatInput.placeholder = currentStrings.chatInputPlaceholderVoice;
    }

    if (!geminiInitialized) initializeGeminiSDK(); // Ensure Gemini is ready
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
    applySettings(); // Re-apply settings to ensure UI elements are correct
    renderGeneralMemoriesList();
  } else if (screenId === PROFILE_SCREEN_ID) {
    updateProfileScreenUI();
  } else if (screenId === CODE_CANVAS_SCREEN_ID) {
      if(codeCanvasTextarea && codeCanvasViewMode === 'code') codeCanvasTextarea.focus();
      // If opened via "Preview" button from chat, it should already be in preview mode.
      // Otherwise, default to code view.
      const isOpenedByPreviewButton = document.activeElement?.classList.contains('preview-code-btn');
      if (!isOpenedByPreviewButton) { // If not opened by preview, ensure code view
         setCodeCanvasView('code');
         if (codeCanvasEnterFullscreenButton) { // Hide fullscreen button in code view
            codeCanvasEnterFullscreenButton.classList.add('hidden');
         }
      }
  } else if (screenId === IMAGE_STUDIO_SCREEN_ID) {
    if (!geminiInitialized) initializeGeminiSDK();
    if(imageStudioPromptInput) imageStudioPromptInput.focus();
    if(imageStudioEngineSelect) imageStudioEngineSelect.value = currentImageEngine; // Reflect current setting
  } else if (screenId === MEMORIES_SCREEN_ID) {
    renderMemoriesScreen(); // Populate saved memories
  } else if (screenId === CREATE_TOOL_SCREEN_ID) {
    if (toolNameInput) toolNameInput.value = ''; // Clear form
    if (toolInstructionsInput) toolInstructionsInput.value = '';
    if (toolKnowledgeInput) toolKnowledgeInput.value = '';
    if (createToolErrorMessageElement) createToolErrorMessageElement.style.display = 'none'; // Hide errors
  }
}

function updateNavigationActiveState(activeScreenId) {
    // Mobile Bottom Navigation
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        const button = item;
        let itemTarget = button.dataset.target;
        const effectiveTarget = itemTarget === 'chat-list-screen-home' ? CHAT_LIST_SCREEN_ID : itemTarget;

        const isActive = (effectiveTarget === activeScreenId) ||
                         // Handle "New Chat" button being active when on a new chat screen
                         (item.id === 'chat-list-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         (item.id === 'profile-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         (item.id === 'image-studio-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool);


        button.classList.toggle('active', isActive);
        button.classList.toggle('text-[#19E5C6]', isActive); // Active color
        button.classList.toggle('text-[#7A9A94]', !isActive); // Inactive color

        // Toggle filled icon style
        button.querySelector('.material-symbols-outlined.filled')?.classList.toggle('text-[#19E5C6]', isActive);
        button.querySelector('.material-symbols-outlined.filled')?.classList.toggle('text-[#7A9A94]', !isActive);
        button.querySelector('.material-symbols-outlined:not(.filled)')?.classList.toggle('text-[#19E5C6]', isActive);
        button.querySelector('.material-symbols-outlined:not(.filled)')?.classList.toggle('text-[#7A9A94]', !isActive);


        const span = button.querySelector('span:last-child:not(.material-symbols-outlined)');
        if (span) {
            span.classList.toggle('font-medium', isActive); // Bolder text for active
            span.classList.toggle('text-[#19E5C6]', isActive);
            span.classList.toggle('text-[#7A9A94]', !isActive);
        }
    });

    // Desktop Sidebar Navigation
    document.querySelectorAll('#desktop-sidebar .sidebar-nav-item').forEach(item => {
        const button = item;
        let itemTarget = button.dataset.target;
        const effectiveTarget = itemTarget === 'chat-list-screen-home' ? CHAT_LIST_SCREEN_ID : itemTarget;

        const isActive = (effectiveTarget === activeScreenId) ||
                         // Highlight "New Chat" if on a new chat screen (no session ID)
                         (item.id === 'sidebar-new-chat-nav-btn' && activeScreenId === CHAT_SCREEN_ID && !currentChatSessionId && !currentChatIsBasedOnTool) ||
                         // Highlight "Create Tool" if on that screen
                         (item.id === 'sidebar-create-tool-nav-btn' && activeScreenId === CREATE_TOOL_SCREEN_ID);


        button.classList.toggle('active', isActive); // Applies background color via CSS
        // Ensure icon fill matches active state
        button.querySelector('.material-symbols-outlined')?.classList.toggle('filled', isActive);
    });
}


// --- Splash Screen Logic ---
function initSplash() {
  showScreen(SPLASH_SCREEN_ID); // Start with splash screen
  // Firebase init (which includes auth check) is called after DOM content loaded
}

// --- Onboarding Logic ---
let currentOnboardingStep = 0;
const totalOnboardingSteps = 3; // Assuming 3 steps

const onboardingContent = [
    { title: "AI Assistant", main: "Your Personal AI Companion", sub: "Unlock the power of AI with our advanced chatbot. Get instant answers, creative inspiration, and personalized assistance anytime, anywhere.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDISnZDku6mxFufrdwyE8U_z3gRZvZUH6Sr7mxWY8opjTDKQYYYW4ButLoD-XUfyYe42PyqETKsHsJlrKL83tNQdCJE60dHYZf_WPlpQtZpJ0Zn1HKjhKBHrxuB0mY7ZlveDIl1oKPhbQT5GoxP-abVe_hkaPNsjY4FF-30GfB-wG9C456BvxyI7s1yE0A7J4CFCSN7SQhHazA_I8NTgQryctLNxst4uLDyUV-ZGE9ol4U8MzmCVKUkH5WsMdau8gpXcxZYvPD9Wj0" },
    { title: "Explore Features", main: "Discover a World of Possibilities", sub: "From drafting emails to planning trips, Nova is here to help you with a wide range of tasks efficiently.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9F5Xf9K4Y0B3r6KCRLRlpOIDnSt0o3h3QkOPB0lXx3Q9N2uJqL8F-YgE5n_qL_xG8vXyY5ZkQz_wP9tS-n0jR6cE1K3gL4fYhP5tSjV0oN1rT0jIqU3hB1mY2wZkXvA_r" },
    { title: "Get Started", main: "Ready to Dive In?", sub: "Let's begin your journey with Nova and experience the future of AI assistance.", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6Y_V-VqZgC8kY7R0kR3J8lP1kCqN_wX9zT_sJqO9nF0cM_lU_pP_wBvY_qZ8xR7yK6oO7tL9vX_jE0dD1mY_gS_aA1bE2vJ3pH0sC9nM_gS7rP0vL1nX_hE1fB0a" }
];

function updateOnboardingUI() {
  if (currentScreen !== ONBOARDING_SCREEN_ID) return;
  if(onboardingDots) {
      onboardingDots.forEach((dot, index) => {
        dot.classList.toggle('bg-[#19e5c6]', index === currentOnboardingStep); // Active dot color
        dot.classList.toggle('bg-[#34655e]', index !== currentOnboardingStep); // Inactive dot color
      });
  }
  const content = onboardingContent[currentOnboardingStep];
  const titleEl = document.getElementById('onboarding-title');
  const mainTextEl = document.getElementById('onboarding-main-text');
  const subTextEl = document.getElementById('onboarding-sub-text');
  const imageEl = document.getElementById('onboarding-image');

  if (titleEl) titleEl.textContent = content.title;
  if (mainTextEl) mainTextEl.textContent = content.main;
  if (subTextEl) subTextEl.textContent = content.sub;
  if (imageEl) imageEl.style.backgroundImage = `url("${content.image}")`;

  const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
  if (onboardingNextBtn) {
      const nextButtonTextSpan = onboardingNextBtn.querySelector('span');
      if(nextButtonTextSpan) nextButtonTextSpan.textContent = currentOnboardingStep === totalOnboardingSteps - 1 ? currentStrings.onboardingGetStarted : currentStrings.onboardingNext;
  }
}

// --- Chat History & Session Logic (Firebase based) ---
async function saveChatSessionsToFirebase() {
  if (!currentUser || !firebaseDb) return;
  try {
    await firebaseDb.ref(`users/${currentUser.uid}/chatSessions`).set(chatSessions);
    console.log("Chat sessions saved to Firebase.");
  } catch (error) {
    console.error("Error saving chat sessions to Firebase:", error);
  }
}

async function loadChatSessionsFromFirebase() {
  if (!currentUser || !firebaseDb) {
    chatSessions = []; // Reset if no user or DB
    renderChatList();
    return;
  }
  try {
    const snapshot = await firebaseDb.ref(`users/${currentUser.uid}/chatSessions`).once('value');
    if (snapshot.exists()) {
      chatSessions = snapshot.val();
      // Ensure messages array is initialized if a session has none (though unlikely)
      chatSessions.forEach(session => session.messages = session.messages || []);
    } else {
      chatSessions = []; // No sessions found in DB
    }
  } catch (error) {
    console.error("Error loading chat sessions from Firebase:", error);
    chatSessions = []; // Fallback on error
  }
  renderChatList(); // Update UI after loading
}

async function deleteChatSession(sessionId) {
    const sessionToDelete = chatSessions.find(s => s.id === sessionId);
    if (!sessionToDelete) return;

    const confirmDelete = confirm(`Are you sure you want to delete chat "${sessionToDelete.title}"? This action cannot be undone.`);
    if (confirmDelete) {
        chatSessions = chatSessions.filter(s => s.id !== sessionId);
        await saveChatSessionsToFirebase(); // Update Firebase

        if (currentChatSessionId === sessionId) {
            currentChatSessionId = null;
            if (currentScreen === CHAT_SCREEN_ID) {
                showScreen(CHAT_LIST_SCREEN_ID); // Go to list if current chat deleted
            }
        }
        renderChatList(); // Refresh UI
    }
}

// --- Custom Tools Logic (Firebase based) ---
async function saveCustomToolsToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
        await firebaseDb.ref(`users/${currentUser.uid}/customTools`).set(customTools);
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
    } catch (error) {
        console.error("Error loading custom tools from Firebase:", error);
        customTools = [];
    }
    renderChatList(); // Update UI after loading
}
async function handleSaveTool() {
    if (!toolNameInput || !toolInstructionsInput || !toolKnowledgeInput || !createToolErrorMessageElement) return;
    const name = toolNameInput.value.trim();
    const instructions = toolInstructionsInput.value.trim();
    const knowledge = toolKnowledgeInput.value.trim();

    if (!name || !instructions) {
        createToolErrorMessageElement.textContent = "Tool Name and Instructions are required.";
        createToolErrorMessageElement.style.display = 'block';
        return;
    }
    createToolErrorMessageElement.style.display = 'none';

    const newTool = {
        id: `tool-${Date.now()}`,
        name,
        instructions,
        knowledge: knowledge || undefined,
        icon: 'construction', // Default icon
        lastUsed: Date.now()
    };
    customTools.push(newTool);
    await saveCustomToolsToFirebase();
    renderChatList();
    showScreen(CHAT_LIST_SCREEN_ID);
}

function startChatWithTool(toolId) {
    const tool = customTools.find(t => t.id === toolId);
    if (!tool) {
        console.error("Tool not found:", toolId);
        displaySystemMessage("Error: Could not start chat with this tool.", CHAT_SCREEN_ID);
        return;
    }

    currentChatSessionId = null; // Start a new "session" conceptually for the tool
    currentChatIsBasedOnTool = tool.id;
    editingUserMessageId = null;
    if (chatInput) chatInput.value = '';

    if (chatMessagesContainer) chatMessagesContainer.innerHTML = '';
    if (!geminiInitialized && !initializeGeminiSDK()) {
        displaySystemMessage("Error: AI Service not available.", CHAT_SCREEN_ID);
        return;
    }

    // Primary instruction from the tool itself
    let systemInstructionText = tool.instructions;
    if (tool.knowledge) {
        systemInstructionText += `\n\nConsider the following initial knowledge for this task:\n${tool.knowledge}`;
    }
    // Append supplemental instructions (profile, memory, common guidelines)
    const supplementalInstructions = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, true, false); // isToolChat=true
    systemInstructionText += supplementalInstructions;


    geminiChat = ai.chats.create({
        model: TEXT_MODEL_NAME,
        config: { systemInstruction: systemInstructionText }
    });

    if (chatScreenTitleElement) chatScreenTitleElement.textContent = `Tool: ${tool.name}`;

    const initialGreetingText = `Using tool: ${tool.name}. How can I assist you with this tool?`;
    const initialGreetingLang = detectMessageLanguage(initialGreetingText);
    const initialMessageId = `msg-system-tool-${Date.now()}`;
    appendMessage("Nova (Tool Mode)", initialGreetingText, 'ai', false, null, true, null, initialGreetingLang, initialMessageId, 'text');
    showScreen(CHAT_SCREEN_ID);
    if (voiceModeActive && !isListening) {
        handleMicInput();
    }
}

async function handleDeleteTool(toolId) {
    const toolToDelete = customTools.find(t => t.id === toolId);
    if (!toolToDelete) return;

    const confirmDelete = confirm(`Are you sure you want to delete the tool "${toolToDelete.name}"? This action cannot be undone.`);
    if (confirmDelete) {
        customTools = customTools.filter(t => t.id !== toolId);
        await saveCustomToolsToFirebase(); // Update Firebase
        renderChatList(); // Refresh UI

        // If a chat based on this tool was active, reset to a general new chat
        if (currentChatIsBasedOnTool === toolId && currentScreen === CHAT_SCREEN_ID) {
            createNewChatSession();
        }
    }
}


// --- Manual Memories Logic (Firebase based, Chat-specific) ---
async function saveSavedMemoriesToFirebase() {
    if (!currentUser || !firebaseDb) return;
    try {
        await firebaseDb.ref(`users/${currentUser.uid}/savedMemories`).set(savedMemories);
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
async function handleSaveToMemory(messageId, messageText, sender, chatId) {
    if (!currentUser) return;
    const memory = {
        id: `mem-${Date.now()}`,
        text: messageText,
        sender: sender,
        chatId: chatId || currentChatSessionId,
        originalMessageId: messageId,
        timestamp: Date.now(),
        userId: currentUser.uid // Ensure userId is stored
    };
    savedMemories.push(memory);
    await saveSavedMemoriesToFirebase();

    const saveBtn = document.querySelector(`.message-action-btn.save-memory-btn[data-message-id="${messageId}"]`);
    if (saveBtn) {
        const originalText = saveBtn.querySelector('span:not(.material-symbols-outlined)')?.textContent || "Save to Memory";
        saveBtn.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark_added</span> Saved!`;
        saveBtn.disabled = true;
        setTimeout(() => {
             saveBtn.innerHTML = `<span class="material-symbols-outlined text-sm">bookmark_add</span> ${originalText}`;
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
        await firebaseDb.ref(`users/${currentUser.uid}/generalMemories`).set(generalMemories);
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

    const newMemory = {
        id: `genmem-${Date.now()}`,
        text: text,
        timestamp: Date.now(),
        userId: currentUser.uid
    };
    generalMemories.push(newMemory);
    await saveGeneralMemoriesToFirebase();
    generalMemoryInput.value = ''; // Clear input
    renderGeneralMemoriesList();
}
async function handleDeleteGeneralMemory(memoryId) {
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
            <button data-id="${memory.id}" class="delete-general-memory-btn text-red-400 hover:text-red-600 p-1">
                <span class="material-symbols-outlined text-base">delete</span>
            </button>
        `;
        generalMemoriesListContainer.appendChild(itemDiv);
    });
}


function getRelativeTime(timestamp) {
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

  // Ensure chatSessions and customTools are arrays
  const sessionsArray = Array.isArray(chatSessions) ? chatSessions : [];
  const toolsArray = Array.isArray(customTools) ? customTools : [];


  const combinedItems = [];
  sessionsArray.forEach(session => combinedItems.push(session));
  toolsArray.forEach(tool => combinedItems.push({ ...tool, type: 'tool', lastUpdated: tool.lastUsed || 0 }));

  if (combinedItems.length === 0) {
    chatListItemsContainer.innerHTML = `<p class="text-center text-[#7A9A94] p-8 lg:p-12">No chats or tools yet. Start a new one or create a tool!</p>`;
    return;
  }

  const sortedItems = combinedItems.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
  const searchInput = document.getElementById('search-chats-tools-input');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";


  sortedItems
    .filter(item => {
        if (!searchTerm) return true;
        const name = 'messages' in item ? item.title : item.name;
        const type = 'messages' in item ? 'chat' : 'tool';
        const instructions = type === 'tool' ? item.instructions : '';
        return name.toLowerCase().includes(searchTerm) ||
               (type === 'tool' && instructions.toLowerCase().includes(searchTerm));
    })
    .forEach(item => {
    const itemOuterDiv = document.createElement('div');
    itemOuterDiv.className = 'chat-list-item flex items-center justify-between gap-2 px-4 py-3 hover:bg-[#1B302C]/50 transition-colors cursor-pointer lg:py-4 lg:px-6';

    const itemType = 'messages' in item ? 'chat' : 'tool';

    itemOuterDiv.dataset.id = item.id;
    itemOuterDiv.dataset.type = itemType;

    itemOuterDiv.addEventListener('click', (e) => {
        if (e.target.closest('.delete-chat-btn') || e.target.closest('.delete-tool-btn')) {
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
        const toolItem = item;
        iconDiv.innerHTML = `<span class="material-symbols-outlined text-3xl">${toolItem.icon || 'construction'}</span>`;
        titleH3.textContent = `Tool: ${toolItem.name}`;
        subTextP.textContent = toolItem.instructions.substring(0, 50) + (toolItem.instructions.length > 50 ? "..." : "");
    } else {
        const chatSessionItem = item;
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

    const rightActionsDiv = document.createElement('div');
    rightActionsDiv.className = 'flex items-center gap-2 shrink-0';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'text-xs lg:text-sm text-[#7A9A94] shrink-0';
    timeDiv.textContent = getRelativeTime(item.lastUpdated);

    const deleteButton = document.createElement('button');
    const itemName = itemType === 'tool' ? item.name : item.title;
    deleteButton.className = `${itemType === 'tool' ? 'delete-tool-btn' : 'delete-chat-btn'} p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-red-500/10 transition-colors duration-150`;
    deleteButton.setAttribute('aria-label', `Delete ${itemType}: ${itemName}`);
    deleteButton.innerHTML = `<span class="material-symbols-outlined text-lg">delete</span>`;
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        if (itemType === 'tool') {
            handleDeleteTool(item.id);
        } else {
            deleteChatSession(item.id);
        }
    };

    rightActionsDiv.appendChild(timeDiv);
    rightActionsDiv.appendChild(deleteButton);
    itemOuterDiv.appendChild(leftContentDiv);
    itemOuterDiv.appendChild(rightActionsDiv);
    chatListItemsContainer.appendChild(itemOuterDiv);
  });
}

// --- Edit/Regenerate Message ---
function handleEditUserMessage(messageId) {
    const session = chatSessions.find(s => s.id === currentChatSessionId);
    if (!session) return;
    const message = session.messages.find(m => m.id === messageId);
    if (!message || message.sender !== 'User' || !chatInput) return;

    // Strip file prefix for editing, as file context is not re-editable
    let textToEdit = message.text;
    if (message.userUploadedFile) {
        textToEdit = textToEdit.replace(`[${message.userUploadedFile.isImage ? "Image" : "File"}: ${message.userUploadedFile.name}]`, '').trim();
    }

    chatInput.value = textToEdit;
    editingUserMessageId = messageId;
    chatInput.focus();
    const currentStrings = uiStrings[currentLanguage] || uiStrings.en;
    const sendButtonTextSpan = sendButton.querySelector('#send-button-text');
    if (sendButtonTextSpan) sendButtonTextSpan.textContent = currentStrings.sendButtonUpdate;
    sendButton.setAttribute('aria-label', currentStrings.sendButtonUpdate);
    if (chatInput) chatInput.placeholder = currentStrings.chatInputPlaceholderEditing;
}

async function handleRegenerateAiResponse(aiMessageIdToRegenerate) {
    const session = chatSessions.find(s => s.id === currentChatSessionId);
    if (!session) return;

    const aiMessageIndex = session.messages.findIndex(m => m.id === aiMessageIdToRegenerate);
    if (aiMessageIndex === -1 || session.messages[aiMessageIndex].sender === 'User') return;

    // Find the user message that prompted this AI response
    let userMessageForPrompt;
    for (let i = aiMessageIndex - 1; i >= 0; i--) {
        if (session.messages[i].sender === 'User') {
            userMessageForPrompt = session.messages[i];
            break;
        }
    }
    if (!userMessageForPrompt) {
        console.warn("Could not find preceding user message to regenerate response.");
        return;
    }

    // Clear the AI message to be regenerated and any subsequent messages from the session
    session.messages.splice(aiMessageIndex);
    // Remove from DOM
    const aiMsgElement = document.getElementById(aiMessageIdToRegenerate);
    if (aiMsgElement) {
        let nextSibling = aiMsgElement.nextElementSibling;
        while(nextSibling && (nextSibling.classList.contains('chat-message-wrapper') || nextSibling.classList.contains('chat-message-external-sources'))) {
            const toRemove = nextSibling;
            nextSibling = nextSibling.nextElementSibling;
            toRemove.remove();
        }
        aiMsgElement.remove();
    }


    // Re-initialize chat history up to *before* the user message that prompted the AI response
    const historyForRegen = session.messages
        .filter((msg, idx) => msg.sender !== 'System' && idx < session.messages.findIndex(m => m.id === userMessageForPrompt.id))
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
        } else { systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled); }
    } else { systemInstructionText = getSystemInstruction(currentAiTone, userProfile, deepThinkingEnabled, internetSearchEnabled, false, advancedScientificModeEnabled); }

    geminiChat = ai.chats.create({ model: TEXT_MODEL_NAME, history: historyForRegen, config: { systemInstruction: systemInstructionText } });

    // Set chatInput value to the user's original prompt text for resending
    // Strip file prefix if present, as file context is not resent with regeneration of just text
    let promptTextForResend = userMessageForPrompt.text;
    if (userMessageForPrompt.userUploadedFile) {
        promptTextForResend = promptTextForResend.replace(`[${userMessageForPrompt.userUploadedFile.isImage ? "Image" : "File"}: ${userMessageForPrompt.userUploadedFile.name}]`, '').trim();
    }
    if (chatInput) chatInput.value = promptTextForResend;

    // Call handleSendMessage with a flag indicating it's for regeneration
    // Pass the ID of the AI message that needs to be updated/recreated
    await handleSendMessage(true, aiMessageIdToRegenerate);
}


document.addEventListener('DOMContentLoaded', initializeApp);
