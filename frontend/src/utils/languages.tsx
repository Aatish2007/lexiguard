import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'mr'
  | 'bn'
  | 'ta'
  | 'te'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', englishName: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'mr', label: 'मराठी (Marathi)', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'bn', label: 'বাংলা (Bengali)', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'ta', label: 'தமிழ் (Tamil)', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { code: 'te', label: 'తెలుగు (Telugu)', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', label: 'മലയാളം (Malayalam)', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
];

export interface TranslationDictionary {
  // Navigation
  navHome: string;
  navScan: string;
  navChat: string;
  navDrafter: string;
  navNavigator: string;
  navHistory: string;
  scanDocumentBtn: string;
  subBrandTitle: string;
  activeDocBadge: string;
  voiceAiBadge: string;

  // Hero Section
  heroEyebrow: string;
  heroHeadline1: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  heroDescription: string;
  dropContractPrompt: string;
  dropContractSub: string;
  analyzeNowBtn: string;
  instantTestPrompt: string;
  featuresTitle: string;
  featuresSubtitle: string;

  // Feature cards
  featScannerTitle: string;
  featScannerDesc: string;
  featScannerAction: string;
  featDrafterTitle: string;
  featDrafterDesc: string;
  featDrafterAction: string;
  featNavigatorTitle: string;
  featNavigatorDesc: string;
  featNavigatorAction: string;
  featChatTitle: string;
  featChatDesc: string;
  featChatAction: string;

  // Scanner & Results
  scanHeaderTitle: string;
  scanHeaderDesc: string;
  uploadFileTab: string;
  pasteTextTab: string;
  dragDropMain: string;
  browseFiles: string;
  supportedFormats: string;
  pastePlaceholder: string;
  analyzePastedBtn: string;
  instantContractsTitle: string;
  instantContractsSub: string;
  overallRiskTitle: string;
  executiveSummaryTitle: string;
  regionalSummaryTitle: string;
  missingProtectionsTitle: string;
  tabRedFlags: string;
  tabIpcBns: string;
  tabFavorable: string;
  tabDocContent: string;
  statutoryBasis: string;
  whyProblematic: string;
  plainRegionalExpl: string;
  recommendedAction: string;
  chatWithContractBtn: string;
  printSavePdfBtn: string;
  scanAnotherBtn: string;

  // Expert Escalation
  escalationTitle: string;
  escalationDesc: string;
  talkToExpertBtn: string;
  teleLawHelpline: string;
  nalsaHelpline: string;

  // Drafter
  drafterEyebrow: string;
  drafterHeadline: string;
  drafterDesc: string;
  step1: string;
  step2: string;
  step3: string;
  selectContractType: string;
  startVoiceBtn: string;
  listeningBtn: string;
  insertSampleVoice: string;
  spokenTermsLabel: string;
  extractTermsBtn: string;
  reviewFieldsTitle: string;
  reviewFieldsSub: string;
  generateAgreementBtn: string;
  formalLegalTitle: string;
  plainRegionalSummaryTitle: string;
  copyEnglishBtn: string;
  copyRegionalBtn: string;
  draftAnotherBtn: string;

  // Navigator
  navEyebrow: string;
  navHeadline: string;
  navDescription: string;
  searchGrievancePlaceholder: string;
  getRoadmapBtn: string;
  commonGrievancesTitle: string;
  applicableLawsTitle: string;
  goldenHourTitle: string;
  stepperTitle: string;
  docsNeeded: string;
  freeLegalAidTitle: string;

  // Records
  recordsEyebrow: string;
  recordsHeadline: string;
  recordsDesc: string;
  scannedContractsTab: string;
  voiceDraftsTab: string;
  noScannedFound: string;
  noDraftsFound: string;
  viewReportBtn: string;
  deleteBtn: string;

  // Footer
  footerMission: string;
  emergencyHelplinesTitle: string;
  govPortalsTitle: string;
  disclaimerTitle: string;
  disclaimerText: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    navHome: 'Home',
    navScan: 'Scan',
    navChat: 'Chat',
    navDrafter: 'Draft',
    navNavigator: 'Navigator',
    navHistory: 'Records',
    scanDocumentBtn: 'Scan Contract',
    subBrandTitle: 'Statutory Contract Review · Indian Law',
    activeDocBadge: 'Active',
    voiceAiBadge: 'Voice',

    heroEyebrow: 'Indian Statutory Review · Contract Act 1872 & BNS 2023',
    heroHeadline1: 'Read the fine print',
    heroHeadlineHighlight: 'before it reads you.',
    heroSubheadline: 'Examine agreements for unfair penalty clauses, unconscionable lock-ins, and mandatory statutory protections before signing.',
    heroDescription:
      'Examine rental agreements, employment offer letters, and service contracts against codified Indian statutes including the Indian Contract Act 1872 and Bharatiya Nyaya Sanhita (BNS 2023).',
    dropContractPrompt: 'Deposit contract deed or notice here, or',
    dropContractSub: 'Accepts lease deeds, offer letters, NDAs, or legal notices (PDF, high-resolution scans, Word DOCX)',
    analyzeNowBtn: 'Examine Document',
    instantTestPrompt: 'Examine sample deed:',
    featuresTitle: 'Statutory Review Modules',
    featuresSubtitle: 'Specific legal protection tools for tenants, employees, and independent contractors in India',

    featScannerTitle: 'Contract Risk Analyzer',
    featScannerDesc: 'Clause-by-clause extraction under Indian Contract Act Section 23/27, Consumer Protection Act 2019, and Tenancy standards.',
    featScannerAction: 'Examine Contract',
    featDrafterTitle: 'Voice Contract Drafter',
    featDrafterDesc: 'State terms in plain speech to draft enforceable lease agreements or employment contracts with parallel regional summaries.',
    featDrafterAction: 'Open Drafter',
    featNavigatorTitle: 'Legal Dispute Navigator',
    featNavigatorDesc: 'Step-by-step resolution timelines, necessary evidence checklists, and official government filing links for disputes.',
    featNavigatorAction: 'Open Navigator',
    featChatTitle: 'Contract Clause Inquiry',
    featChatDesc: 'Ask specific questions grounded in your uploaded deed and codified Indian statutes.',
    featChatAction: 'Ask Question',

    scanHeaderTitle: 'Examine Your Agreement Before Signing',
    scanHeaderDesc: 'Upload a lease deed, employment letter, notice, or service contract. LexiGuard detects arbitrary penalties, non-compete covenants, and unconscionable clauses under Indian law.',
    uploadFileTab: 'Upload Document (PDF / Scan / DOCX)',
    pasteTextTab: 'Paste Agreement Text',
    dragDropMain: 'Deposit legal deed or notice here, or',
    browseFiles: 'Select File',
    supportedFormats: 'PDF documents, clean photos/scans (PNG, JPG), Word (.DOCX), and plain text files',
    pastePlaceholder: 'Paste the full text of your agreement, lease deed, employment offer, or legal notice here...',
    analyzePastedBtn: 'Examine Pasted Text',
    instantContractsTitle: 'Verified Sample Deeds with Typical Unfair Clauses',
    instantContractsSub: 'Select a verified sample to inspect typical unfair clauses found in Indian contracts',
    overallRiskTitle: 'Contract Risk Index',
    executiveSummaryTitle: 'Executive Summary',
    regionalSummaryTitle: 'Vernacular Summary',
    missingProtectionsTitle: 'Essential Missing Protections',
    tabRedFlags: 'Red Flag Clauses',
    tabIpcBns: 'IPC to BNS 2023',
    tabFavorable: 'Favorable Terms',
    tabDocContent: 'Document Content',
    statutoryBasis: 'Statutory Basis:',
    whyProblematic: 'Legal vulnerability:',
    plainRegionalExpl: 'Plain vernacular explanation:',
    recommendedAction: 'Recommended amendment:',
    chatWithContractBtn: 'Inquire with Deed',
    printSavePdfBtn: 'Print / Export',
    scanAnotherBtn: 'Examine Another',

    escalationTitle: 'Notice: Unconscionable Clauses Detected',
    escalationDesc: 'This agreement contains severe unconscionable clauses or unlawful penalties under Indian law (e.g. Indian Contract Act Section 23/27). Consult legal aid before executing.',
    talkToExpertBtn: 'Consult Free Legal Counsel',
    teleLawHelpline: 'Tele-Law Toll-Free: 14416',
    nalsaHelpline: 'NALSA Legal Aid: 15100',

    drafterEyebrow: 'Voice Contract Drafter',
    drafterHeadline: 'Draft Indian Legal Contracts by Speaking or Typing',
    drafterDesc: 'State required terms. LexiGuard structures key particulars, generates an enforceable agreement, and creates a parallel vernacular summary.',
    step1: '1. Dictate / Input',
    step2: '2. Review Particulars',
    step3: '3. Executable Deed',
    selectContractType: 'Select Deed Type to Draft:',
    startVoiceBtn: 'Start Voice Input',
    listeningBtn: 'Recording... (Click to Stop)',
    insertSampleVoice: 'Insert Sample Input',
    spokenTermsLabel: 'Recorded Terms (Editable):',
    extractTermsBtn: 'Extract Particulars',
    reviewFieldsTitle: 'Review Particulars',
    reviewFieldsSub: 'Verify extracted particulars before compiling the final agreement.',
    generateAgreementBtn: 'Compile Legal Agreement & Summary',
    formalLegalTitle: 'Draft Agreement (English)',
    plainRegionalSummaryTitle: 'Plain Vernacular Summary',
    copyEnglishBtn: 'Copy Agreement',
    copyRegionalBtn: 'Copy Summary',
    draftAnotherBtn: 'Draft Another Deed',

    navEyebrow: 'Legal Dispute Navigator',
    navHeadline: 'Step-by-Step Resolution Roadmap for Indian Citizens',
    navDescription: 'State your legal grievance. LexiGuard maps out the required statutory procedure, necessary documents, and official government portals.',
    searchGrievancePlaceholder: "e.g. 'UPI fraudulent deduction of ₹45,000' or 'Landlord withholding ₹75,000 security deposit'...",
    getRoadmapBtn: 'Generate Resolution Roadmap',
    commonGrievancesTitle: 'Common Citizen Grievances:',
    applicableLawsTitle: 'Applicable Indian Statutes & Sections:',
    goldenHourTitle: 'Immediate Golden Hour Actions',
    stepperTitle: 'Procedural Docket & Resolution Steps',
    docsNeeded: 'Mandatory Evidence & Documentation:',
    freeLegalAidTitle: 'Official Free Legal Aid (Government of India)',

    recordsEyebrow: 'Document Ledger',
    recordsHeadline: 'Archived Scans & Drafted Deeds',
    recordsDesc: 'Retained locally in your browser storage. Reopen examination reports, review clauses, or retrieve drafted deeds.',
    scannedContractsTab: 'Examined Deeds',
    voiceDraftsTab: 'Drafted Deeds',
    noScannedFound: 'No examined deeds recorded. Upload or examine an agreement to populate.',
    noDraftsFound: 'No drafted deeds recorded. Use the Draft module to generate agreements.',
    viewReportBtn: 'Inspect',
    deleteBtn: 'Delete',

    footerMission: 'Statutory contract risk analyzer and procedural legal navigator helping Indian citizens identify unlawful clauses, arbitrary forfeitures, and unconscionable lock-ins.',
    emergencyHelplinesTitle: 'Statutory Legal Helplines (India)',
    govPortalsTitle: 'Government Portals',
    disclaimerTitle: 'Statutory Disclaimer',
    disclaimerText: 'LexiGuard is an educational contract analysis and legal awareness tool under the Indian legal framework. It does not provide formal legal representation or advocate-client privilege under the Advocates Act, 1961. For formal court proceedings or litigation, consult an advocate registered with the Bar Council of India or contact Tele-Law (14416).',
  },

  hi: {
    navHome: 'होम',
    navScan: 'स्कैन',
    navChat: 'चैट',
    navDrafter: 'ड्राफ्ट',
    navNavigator: 'मार्गदर्शिका',
    navHistory: 'रिकॉर्ड्स',
    scanDocumentBtn: 'अनुबंध जांचें',
    subBrandTitle: 'भारतीय अनुबंध कानून और अधिकार संरक्षण',
    activeDocBadge: 'सक्रिय',
    voiceAiBadge: 'वॉयस',

    heroEyebrow: 'भारतीय अनुबंध अधिनियम 1872 व बीएनएस 2023 के तहत जांच',
    heroHeadline1: 'हस्ताक्षर से पहले',
    heroHeadlineHighlight: 'हर शर्त की पड़ताल.',
    heroSubheadline: 'अनुबंध में छिपी अनुचित पेनल्टी, जबरन बेदखली और अवैध बंधनों को हस्ताक्षर करने से पहले समझें।',
    heroDescription:
      'किराया अनुबंध, ऑफर लेटर और सेवा समझौतों की भारतीय अनुबंध अधिनियम 1872 और भारतीय न्याय संहिता (BNS 2023) के तहत निष्पक्ष जांच।',
    dropContractPrompt: 'अपना कानूनी दस्तावेज़ यहां छोड़ें, या',
    dropContractSub: 'किराया अनुबंध, जॉब ऑफर या नोटिस अपलोड करें (PDF, फोटो, Word DOCX)',
    analyzeNowBtn: 'दस्तावेज़ का अभी विश्लेषण करें',
    instantTestPrompt: 'तुरंत परिदृश्य आज़माएं:',
    featuresTitle: 'संपूर्ण कानूनी सुरक्षा सुइट',
    featuresSubtitle: 'नागरिक अधिकारों की रक्षा और बातचीत के लिए आवश्यक सभी साधन',

    featScannerTitle: 'दस्तावेज़ स्कैनर और जोखिम विश्लेषक',
    featScannerDesc: 'अनुबंध की शर्तों की मल्टीमॉडल जांच। अवैध पेनल्टी, जबरन बेदखली को चिन्हित करता है।',
    featScannerAction: 'अनुबंध स्कैन करें',
    featDrafterTitle: 'आवाज़ से ड्राफ्ट',
    featDrafterDesc: 'बोलकर किरायानामा, रोजगार पत्र या एनडीए ड्राफ्ट करें। साथ में सरल हिंदी सारांश भी पाएं।',
    featDrafterAction: 'वॉयस ड्राफ्ट शुरू करें',
    featNavigatorTitle: 'कानूनी प्रक्रिया मार्गदर्शिका',
    featNavigatorDesc: 'साइबर धोखाधड़ी या किराया विवाद में सरकारी पोर्टल और हेल्पलाइन सहित चरण-दर-चरण समाधान।',
    featNavigatorAction: 'मार्गदर्शिका देखें',
    featChatTitle: 'अनुबंध से चैट करें (RAG)',
    featChatDesc: 'अपने दस्तावेज़ और भारतीय कानूनों पर आधारित सीधे प्रश्न पूछें।',
    featChatAction: 'सवाल पूछें',

    scanHeaderTitle: 'हस्ताक्षर करने से पहले अपने अनुबंध को स्कैन करें',
    scanHeaderDesc: 'किराया अनुबंध, ऑफर लेटर या नोटिस अपलोड करें। लेक्सीगार्ड भारतीय अनुबंध अधिनियम और बीएनएस 2023 के तहत जोखिम जांचता है।',
    uploadFileTab: 'फ़ाइल अपलोड करें (PDF / फोटो / DOCX)',
    pasteTextTab: 'अनुबंध का पाठ पेस्ट करें',
    dragDropMain: 'कानूनी दस्तावेज़ यहां खींचकर लाएं, या',
    browseFiles: 'फ़ाइलें चुनें',
    supportedFormats: 'PDF दस्तावेज़, उच्च-गुणवत्ता वाले फोटो (PNG, JPG), Word (.DOCX) और टेक्स्ट समर्थित हैं',
    pastePlaceholder: 'अपने अनुबंध, लीज या नोटिस का पाठ यहां पेस्ट करें...',
    analyzePastedBtn: 'पेस्ट किए गए पाठ का विश्लेषण करें',
    instantContractsTitle: 'त्वरित परीक्षण: 1-क्लिक वास्तविक भारतीय कानूनी अनुबंध',
    instantContractsSub: 'बिना फ़ाइल अपलोड किए तुरंत जांचने के लिए इनमें से कोई परिदृश्य चुनें',
    overallRiskTitle: 'कुल अनुबंध जोखिम',
    executiveSummaryTitle: 'कार्यकारी सारांश (अंग्रेज़ी)',
    regionalSummaryTitle: 'दस्तावेज़ सारांश (सरल हिंदी)',
    missingProtectionsTitle: 'अनुपस्थित आवश्यक सुरक्षा शर्तें',
    tabRedFlags: 'जोखिम भरी शर्तें (रेड फ्लैग्स)',
    tabIpcBns: 'IPC → BNS 2023 धाराएं',
    tabFavorable: 'हितकारी शर्तें',
    tabDocContent: 'दस्तावेज़ सामग्री',
    statutoryBasis: 'कानूनी आधार:',
    whyProblematic: 'यह शर्त क्यों हानिकारक है:',
    plainRegionalExpl: 'सरल हिंदी में समझें:',
    recommendedAction: 'अनुशंसित संशोधन या कार्रवाई:',
    chatWithContractBtn: 'अनुबंध से चैट करें',
    printSavePdfBtn: 'प्रिंट / PDF सुरक्षित करें',
    scanAnotherBtn: 'दूसरा स्कैन करें',

    escalationTitle: 'यह जटिल लगता है — विशेषज्ञ कानूनी सहायता लें',
    escalationDesc: 'इस अनुबंध में गंभीर गैर-कानूनी शर्तें हैं। बिना संशोधन के हस्ताक्षर करने से आपके कानूनी अधिकार छिन सकते हैं।',
    talkToExpertBtn: 'मुफ्त कानूनी विशेषज्ञ से बात करें',
    teleLawHelpline: 'टेली-लॉ टोल-फ्री: 14416',
    nalsaHelpline: 'नालसा कानूनी सहायता: 15100',

    drafterEyebrow: 'आवाज़ से ड्राफ्ट · AI अनुबंध निर्माण',
    drafterHeadline: 'अपनी आवाज़ से भारतीय कानूनी अनुबंध ड्राफ्ट करें',
    drafterDesc: 'शर्तें बोलें या लिखें। लेक्सीगार्ड विवरण निकालकर फॉर्म भरता है और पूर्ण कानूनी दस्तावेज व सरल हिंदी सारांश तैयार करता है।',
    step1: '1. बोलें / लिखें',
    step2: '2. विवरण जांचें',
    step3: '3. अंतिम अनुबंध',
    selectContractType: 'ड्राफ्ट करने के लिए अनुबंध का प्रकार चुनें:',
    startVoiceBtn: 'आवाज़ रिकॉर्डिंग शुरू करें',
    listeningBtn: 'सुन रहा है... (रोकने के लिए क्लिक करें)',
    insertSampleVoice: 'नमूना आवाज़ प्रॉम्प्ट डालें',
    spokenTermsLabel: 'बोली या लिखी गई शर्तें (संपादन योग्य):',
    extractTermsBtn: 'शर्तें निकालें और फॉर्म देखें',
    reviewFieldsTitle: 'विवरण की समीक्षा और पुष्टि करें',
    reviewFieldsSub: 'आपकी आवाज़ से निकाले गए इन विवरणों को आवश्यकतानुसार संशोधित करें।',
    generateAgreementBtn: 'कानूनी अनुबंध और हिंदी सारांश बनाएं',
    formalLegalTitle: 'लागू करने योग्य कानूनी अनुबंध (अंग्रेज़ी)',
    plainRegionalSummaryTitle: 'सरल हिंदी सारांश',
    copyEnglishBtn: 'अंग्रेज़ी अनुबंध कॉपी करें',
    copyRegionalBtn: 'हिंदी सारांश कॉपी करें',
    draftAnotherBtn: 'नया ड्राफ्ट बनाएं',

    navEyebrow: 'कानूनी प्रक्रिया मार्गदर्शिका',
    navHeadline: 'भारतीय नागरिकों के लिए चरण-दर-चरण कानूनी रोडमैप',
    navDescription: 'अपनी समस्या सरल शब्दों में बताएं। लेक्सीगार्ड सरकारी पोर्टल और टोल-फ्री नंबरों के साथ चरणबद्ध समाधान प्रस्तुत करता है।',
    searchGrievancePlaceholder: "जैसे 'UPI से ₹45,000 की धोखाधड़ी हो गई' या 'मकान मालिक डिपॉजिट नहीं लौटा रहा'...",
    getRoadmapBtn: 'समाधान रोडमैप प्राप्त करें',
    commonGrievancesTitle: 'सामान्य नागरिक समस्याएं (क्लिक करके देखें):',
    applicableLawsTitle: 'लागू भारतीय कानून और धाराएं:',
    goldenHourTitle: 'तत्काल गोल्डन ऑवर कार्रवाई',
    stepperTitle: 'चरण-दर-चरण समाधान प्रक्रिया',
    docsNeeded: 'इस चरण के लिए आवश्यक दस्तावेज़:',
    freeLegalAidTitle: 'भारत सरकार द्वारा मुफ्त कानूनी सहायता',

    recordsEyebrow: 'रिकॉर्ड्स और इतिहास',
    recordsHeadline: 'आपके स्कैन किए गए अनुबंध और तैयार ड्राफ्ट',
    recordsDesc: 'ब्राउज़र में सुरक्षित। रिपोर्ट दोबारा खोलें, चैट करें या ड्राफ्ट देखें।',
    scannedContractsTab: 'स्कैन किए गए अनुबंध',
    voiceDraftsTab: 'वॉयस ड्राफ्ट्स',
    noScannedFound: 'कोई स्कैन किया गया अनुबंध नहीं मिला।',
    noDraftsFound: 'अभी तक कोई ड्राफ्ट नहीं बनाया गया।',
    viewReportBtn: 'रिपोर्ट',
    deleteBtn: 'हटाएं',

    footerMission: 'भारतीय नागरिकों को अनुचित शर्तों और कानूनी धोखाधड़ी से बचाने वाला AI अनुबंध विश्लेषक।',
    emergencyHelplinesTitle: 'आपातकालीन कानूनी हेल्पलाइन (भारत)',
    govPortalsTitle: 'सरकारी पोर्टल',
    disclaimerTitle: 'अस्वीकरण और अनुपालन',
    disclaimerText: 'लेक्सीगार्ड एक शैक्षणिक और कानूनी जागरूकता उपकरण है। यह अधिवक्ता अधिनियम, 1961 के तहत औपचारिक वकालत का विकल्प नहीं है।',
  },

  mr: {
    navHome: 'मुख्यपृष्ठ',
    navScan: 'दस्तऐवज स्कॅन करा',
    navChat: 'कराराशी संवाद',
    navDrafter: 'आवाजातून मसुदा',
    navNavigator: 'कायदेशीर मार्गदर्शक',
    navHistory: 'नोंदी',
    scanDocumentBtn: 'दस्तऐवज स्कॅन करा',
    subBrandTitle: 'न्याय आणि संरक्षण · AI करार विश्लेषण',
    activeDocBadge: 'सक्रिय दस्तऐवज',
    voiceAiBadge: 'व्हॉइस AI',

    heroEyebrow: 'प्रत्येक भारतीय नागरिकासाठी AI कायदेशीर संरक्षण',
    heroHeadline1: 'स्कॅन करा. समजून घ्या.',
    heroHeadlineHighlight: 'स्वतःचे रक्षण करा.',
    heroSubheadline: 'स्वाक्षरी करण्यापूर्वी करारातील प्रत्येक अट समजून घ्या — फसवणूक आणि बेकायदेशीर अटींपासून वाचा.',
    heroDescription:
      'लेक्सीगार्ड हा विश्वासार्ह भारतीय कायदेशीर सहाय्यक आहे. भाडेकरार, नोकरीची ऑफर पत्रे आणि करारांचे विश्लेषण करा आणि BNS 2023 शी ताडून पाहा.',
    dropContractPrompt: 'तुमचा कायदेशीर दस्तऐवज येथे टाका, किंवा',
    dropContractSub: 'भाडेकरार, जॉब ऑफर किंवा नोटीस अपलोड करा (PDF, फोटो, Word DOCX)',
    analyzeNowBtn: 'दस्तऐवजाचे विश्लेषण करा',
    instantTestPrompt: 'त्वरित चाचणी घ्या:',
    featuresTitle: 'सर्वसमावेशक कायदेशीर संरक्षण संच',
    featuresSubtitle: 'नागरिकांच्या हक्कांचे रक्षण करण्यासाठी आवश्यक साधने',

    featScannerTitle: 'दस्तऐवज स्कॅनर आणि जोखीम विश्लेषक',
    featScannerDesc: 'करारातील अटींची तपासणी. बेकायदेशीर दंड आणि जबरदस्तीच्या अटी ओळखा.',
    featScannerAction: 'करार स्कॅन करा',
    featDrafterTitle: 'आवाजातून मसुदा',
    featDrafterDesc: 'बोलून भाडेकरार किंवा नोकरीचे पत्र तयार करा. सोबत सोपा मराठी सारांश मिळवा.',
    featDrafterAction: 'मसुदा सुरू करा',
    featNavigatorTitle: 'कायदेशीर प्रक्रिया मार्गदर्शक',
    featNavigatorDesc: 'सायबर फसवणूक किंवा भाडेतंट्यात सरकारी पोर्टल आणि हेल्पलाइनसह टप्प्याटप्प्याने उपाय.',
    featNavigatorAction: 'मार्गदर्शक पहा',
    featChatTitle: 'कराराशी संवाद (RAG)',
    featChatDesc: 'दस्तऐवज आणि भारतीय कायद्यांवर आधारित प्रश्न विचारा.',
    featChatAction: 'प्रश्न विचारा',

    scanHeaderTitle: 'स्वाक्षरी करण्यापूर्वी करार तपासा',
    scanHeaderDesc: 'भाडेकरार किंवा ऑफर लेटर अपलोड करा. लेक्सीगार्ड भारतीय करार कायदा आणि BNS 2023 नुसार तपासणी करतो.',
    uploadFileTab: 'फाईल अपलोड करा (PDF / फोटो / DOCX)',
    pasteTextTab: 'मजकूर पेस्ट करा',
    dragDropMain: 'दस्तऐवज येथे ड्रॅग करा, किंवा',
    browseFiles: 'फाईल्स निवडा',
    supportedFormats: 'PDF, फोटो (PNG, JPG), Word (.DOCX) आणि मजकूर समर्थित',
    pastePlaceholder: 'येथे कराराचा मजकूर पेस्ट करा...',
    analyzePastedBtn: 'मजकुराचे विश्लेषण करा',
    instantContractsTitle: 'त्वरित चाचणी: १-क्लिक भारतीय कायदेशीर करार',
    instantContractsSub: 'फाईल अपलोड न करता तपासण्यासाठी नमुना करार निवडा',
    overallRiskTitle: 'एकूण करार जोखीम',
    executiveSummaryTitle: 'मुख्य सारांश (इंग्रजी)',
    regionalSummaryTitle: 'दस्तऐवज सारांश (मराठी)',
    missingProtectionsTitle: 'गहाळ कायदेशीर संरक्षण',
    tabRedFlags: 'धोकादायक अटी (रेड फ्लॅग्ज)',
    tabIpcBns: 'IPC → BNS 2023 कलमे',
    tabFavorable: 'फायदेशीर अटी',
    tabDocContent: 'दस्तऐवज मजकूर',
    statutoryBasis: 'कायदेशीर आधार:',
    whyProblematic: 'ही अट का धोकादायक आहे:',
    plainRegionalExpl: 'सोप्या मराठीत समजून घ्या:',
    recommendedAction: 'शिफारस केलेली कृती:',
    chatWithContractBtn: 'कराराशी संवाद साधा',
    printSavePdfBtn: 'प्रिंट / PDF सेव्ह करा',
    scanAnotherBtn: 'दुसरा स्कॅन करा',

    escalationTitle: 'ही गुंतागुंतीची बाब वाटते — तज्ज्ञ कायदेशीर मदत घ्या',
    escalationDesc: 'या करारात अतिशय धोकादायक अटी आहेत. स्वाक्षरी करण्यापूर्वी मोफत सरकारी कायदेशीर सल्ला नक्की घ्या.',
    talkToExpertBtn: 'मोफत कायदेशीर तज्ज्ञांशी बोला',
    teleLawHelpline: 'टेली-लॉ टोल-फ्री: 14416',
    nalsaHelpline: 'नालसा कायदेशीर मदत: 15100',

    drafterEyebrow: 'आवाजातून मसुदा · व्हॉइस AI',
    drafterHeadline: 'तुमच्या आवाजाने कायदेशीर करार तयार करा',
    drafterDesc: 'अटी बोला किंवा लिहा. लेक्सीगार्ड तपशील भरून संपूर्ण कायदेशीर करार आणि मराठी सारांश देईल.',
    step1: '१. बोला / लिहा',
    step2: '२. तपशील तपासा',
    step3: '३. अंतिम करार',
    selectContractType: 'कराराचा प्रकार निवडा:',
    startVoiceBtn: 'आवाज रेकॉर्डिंग सुरू करा',
    listeningBtn: 'ऐकत आहे... (थांबवण्यासाठी क्लिक करा)',
    insertSampleVoice: 'नमुना व्हॉइस प्रॉम्प्ट टाका',
    spokenTermsLabel: 'बोललेल्या अटी (संपादनायोग्य):',
    extractTermsBtn: 'तपशील काढा आणि फॉर्म पहा',
    reviewFieldsTitle: 'तपशीलांचे पुनरावलोकन करा',
    reviewFieldsSub: 'तुमच्या आवाजातून काढलेले तपशील तपासा व आवश्यक बदल करा.',
    generateAgreementBtn: 'करार आणि मराठी सारांश तयार करा',
    formalLegalTitle: 'कायदेशीर करार (इंग्रजी)',
    plainRegionalSummaryTitle: 'सोपा मराठी सारांश',
    copyEnglishBtn: 'इंग्रजी करार कॉपी करा',
    copyRegionalBtn: 'मराठी सारांश कॉपी करा',
    draftAnotherBtn: 'दुसरा मसुदा बनवा',

    navEyebrow: 'कायदेशीर मार्गदर्शक',
    navHeadline: 'भारतीय नागरिकांसाठी टप्प्याटप्प्याने कायदेशीर रोडमॅप',
    navDescription: 'तुमची समस्या सांगा. लेक्सीगार्ड अधिकृत सरकारी पोर्टल्स आणि हेल्पलाइनसह उपाय सांगेल.',
    searchGrievancePlaceholder: "उदा. 'UPI द्वारे सायबर फसवणूक झाली' किंवा 'घरमालक डिपॉझिट परत करत नाही'...",
    getRoadmapBtn: 'रोडमॅप मिळवा',
    commonGrievancesTitle: 'नेहमीच्या कायदेशीर समस्या:',
    applicableLawsTitle: 'लागू भारतीय कायदे आणि कलमे:',
    goldenHourTitle: 'तातडीची कारवाई (गोल्डन अवर)',
    stepperTitle: 'निवारण टप्पे',
    docsNeeded: 'आवश्यक कागदपत्रे:',
    freeLegalAidTitle: 'भारत सरकारची मोफत कायदेशीर मदत',

    recordsEyebrow: 'नोंदी आणि इतिहास',
    recordsHeadline: 'तुमचे स्कॅन केलेले करार आणि तयार केलेले मसुदे',
    recordsDesc: 'तुमच्या ब्राउझरमध्ये सुरक्षित साठवले जातात.',
    scannedContractsTab: 'स्कॅन केलेले करार',
    voiceDraftsTab: 'व्हॉइस मसुदे',
    noScannedFound: 'कोणतेही स्कॅन केलेले करार आढळले नाहीत.',
    noDraftsFound: 'अद्याप कोणतेही मसुदे तयार केलेले नाहीत.',
    viewReportBtn: 'अहवाल',
    deleteBtn: 'हटवा',

    footerMission: 'भारतीय नागरिकांचे अन्यायकारक अटींपासून रक्षण करणारे AI साधन.',
    emergencyHelplinesTitle: 'आपत्कालीन कायदेशीर हेल्पलाइन (भारत)',
    govPortalsTitle: 'सरकारी पोर्टल्स',
    disclaimerTitle: 'अस्वीकरण आणि कायदेशीर माहिती',
    disclaimerText: 'लेक्सीगार्ड हे कायदेशीर जागरूकतेसाठीचे साधन आहे. हे वकिलांच्या औपचारिक प्रतिनिधित्वाचा पर्याय नाही.',
  },

  bn: {
    navHome: 'হোম',
    navScan: 'নথি স্ক্যান করুন',
    navChat: 'চুক্তির সাথে চ্যাট',
    navDrafter: 'আওয়াজ সে ড্রাফ্ট',
    navNavigator: 'আইনি নির্দেশিকা',
    navHistory: 'রেকর্ডস',
    scanDocumentBtn: 'নথি স্ক্যান করুন',
    subBrandTitle: 'ন্যায় এবং সুরক্ষা · AI চুক্তি বিশ্লেষণ',
    activeDocBadge: 'সক্রিয় নথি',
    voiceAiBadge: 'ভয়েস AI',

    heroEyebrow: 'প্রতিটি ভারতীয় নাগরিকের জন্য AI আইনি সুরক্ষা',
    heroHeadline1: 'স্ক্যান করুন. বুঝুন.',
    heroHeadlineHighlight: 'নিজেকে সুরক্ষিত রাখুন.',
    heroSubheadline: 'স্বাক্ষর করার আগে চুক্তির প্রতিটি শর্ত বুঝুন — জালিয়াতি ও বেআইনি শর্ত এড়িয়ে চলুন।',
    heroDescription:
      'লেক্সিগার্ড একটি নির্ভরযোগ্য ভারতীয় আইনি সহকারী। বাড়ি ভাড়ার চুক্তি, চাকরির অফার লেটার বিশ্লেষণ করুন এবং BNS 2023-এর সাথে মিলিয়ে দেখুন।',
    dropContractPrompt: 'আপনার আইনি নথি এখানে দিন, অথবা',
    dropContractSub: 'ভাড়া চুক্তি, অফার লেটার বা নোটিশ আপলোড করুন (PDF, ছবি, Word DOCX)',
    analyzeNowBtn: 'নথি বিশ্লেষণ করুন',
    instantTestPrompt: 'তাত্ক্ষণিক পরীক্ষা:',
    featuresTitle: 'সম্পূর্ণ আইনি সুরক্ষা ব্যবস্থা',
    featuresSubtitle: 'নাগরিকদের অধিকার সুরক্ষার জন্য প্রয়োজনীয় সমস্ত সুযোগ-সুবিধা',

    featScannerTitle: 'নথি স্ক্যানার ও ঝুঁকি বিশ্লেষক',
    featScannerDesc: 'চুক্তির শর্তাবলী পরীক্ষা করে বেআইনি জরিমানা ও অন্যায্য শর্ত চিহ্নিত করে।',
    featScannerAction: 'চুক্তি স্ক্যান করুন',
    featDrafterTitle: 'আওয়াজ সে ড্রাফ্ট',
    featDrafterDesc: 'কথা বলে ভাড়ার চুক্তি বা নিয়োগপত্র তৈরি করুন, সাথে সহজ বাংলা সারসংক্ষেপ পান।',
    featDrafterAction: 'ভয়েস ড্রাফ্ট শুরু করুন',
    featNavigatorTitle: 'আইনি প্রক্রিয়া নির্দেশিকা',
    featNavigatorDesc: 'সাইবার জালিয়াতি বা ভাড়া বিরোধে সরকারি পোর্টাল ও হেল্পলাইন সহ ধাপে ধাপে সমাধান।',
    featNavigatorAction: 'নির্দেশিকা দেখুন',
    featChatTitle: 'চুক্তির সাথে চ্যাট (RAG)',
    featChatDesc: 'আপনার নথি এবং ভারতীয় আইনের ভিত্তিতে সরাসরি প্রশ্ন জিজ্ঞাসা করুন।',
    featChatAction: 'প্রশ্ন করুন',

    scanHeaderTitle: 'স্বাক্ষর করার আগে আপনার চুক্তি স্ক্যান করুন',
    scanHeaderDesc: 'ভাড়া চুক্তি বা অফার লেটার আপলোড করুন। ভারতীয় চুক্তি আইন এবং BNS 2023 অনুযায়ী পরীক্ষা করুন।',
    uploadFileTab: 'ফাইল আপলোড করুন (PDF / ছবি / DOCX)',
    pasteTextTab: 'টেক্সট পেস্ট করুন',
    dragDropMain: 'নথি এখানে টেনে আনুন, অথবা',
    browseFiles: 'ফাইল ব্রাউজ করুন',
    supportedFormats: 'PDF, ছবি (PNG, JPG), Word (.DOCX) এবং টেক্সট ফাইল সমর্থিত',
    pastePlaceholder: 'এখানে আপনার চুক্তির লেখা পেস্ট করুন...',
    analyzePastedBtn: 'পেস্ট করা লেখা বিশ্লেষণ করুন',
    instantContractsTitle: 'তাত্ক্ষণিক পরীক্ষা: ১-ক্লিক ভারতীয় আইনি চুক্তি',
    instantContractsSub: 'ফাইল আপলোড ছাড়াই পরীক্ষা করতে নমুনা চুক্তি বেছে নিন',
    overallRiskTitle: 'সামগ্রিক চুক্তি ঝুঁকি',
    executiveSummaryTitle: 'কার্যকরী সারসংক্ষেপ (ইংরেজি)',
    regionalSummaryTitle: 'নথির সারসংক্ষেপ (বাংলায়)',
    missingProtectionsTitle: 'অনুপস্থিত প্রয়োজনীয় সুরক্ষা',
    tabRedFlags: 'ঝুঁকিপূর্ণ শর্ত (রেড ফ্ল্যাগ)',
    tabIpcBns: 'IPC → BNS 2023 ধারা',
    tabFavorable: 'অনুকূল শর্তাবলী',
    tabDocContent: 'নথির বিষয়বস্তু',
    statutoryBasis: 'আইনি ভিত্তি:',
    whyProblematic: 'এটি কেন ক্ষতিকর:',
    plainRegionalExpl: 'সহজ বাংলায় বুঝুন:',
    recommendedAction: 'প্রস্তাবিত পদক্ষেপ:',
    chatWithContractBtn: 'চুক্তির সাথে চ্যাট করুন',
    printSavePdfBtn: 'প্রিন্ট / PDF সংরক্ষণ',
    scanAnotherBtn: 'অন্য নথি স্ক্যান করুন',

    escalationTitle: 'এটি জটিল মনে হচ্ছে — বিশেষজ্ঞের আইনি পরামর্শ নিন',
    escalationDesc: 'এই চুক্তিতে মারাত্মক ক্ষতিকর শর্ত রয়েছে। স্বাক্ষর করার আগে বিনামূল্যে সরকারি আইনি সহায়তা নিন।',
    talkToExpertBtn: 'বিনামূল্যে আইনি বিশেষজ্ঞের সাথে কথা বলুন',
    teleLawHelpline: 'টেলি-ল টোল-ফ্রি: 14416',
    nalsaHelpline: 'নালসা আইনি সহায়তা: 15100',

    drafterEyebrow: 'ভয়েস দিয়ে ড্রাফ্ট · ভয়েস AI',
    drafterHeadline: 'আপনার কণ্ঠে ভারতীয় আইনি চুক্তি তৈরি করুন',
    drafterDesc: 'শর্তাবলী বলুন বা লিখুন। লেক্সিগার্ড ফরম পূরণ করে সম্পূর্ণ চুক্তি ও বাংলা সারসংক্ষেপ দেবে।',
    step1: '১. বলুন / লিখুন',
    step2: '২. বিবরণ দেখুন',
    step3: '৩. চূড়ান্ত চুক্তি',
    selectContractType: 'চুক্তির ধরন নির্বাচন করুন:',
    startVoiceBtn: 'ভয়েস রেকর্ডিং শুরু করুন',
    listeningBtn: 'শুনছি... (থামাতে ক্লিক করুন)',
    insertSampleVoice: 'নমুনা ভয়েস প্রম্পট দিন',
    spokenTermsLabel: 'কথিত শর্তাবলী (সম্পাদনাযোগ্য):',
    extractTermsBtn: 'শর্তাবলী বের করুন ও ফর্ম দেখুন',
    reviewFieldsTitle: 'বিবরণ পর্যালোচনা ও নিশ্চিত করুন',
    reviewFieldsSub: 'আপনার ভয়েস থেকে প্রাপ্ত তথ্য প্রয়োজন অনুযায়ী পরিবর্তন করুন।',
    generateAgreementBtn: 'চুক্তি এবং বাংলা সারসংক্ষেপ তৈরি করুন',
    formalLegalTitle: 'আইনি চুক্তি (ইংরেজি)',
    plainRegionalSummaryTitle: 'সহজ বাংলা সারসংক্ষেপ',
    copyEnglishBtn: 'ইংরেজি চুক্তি কপি করুন',
    copyRegionalBtn: 'বাংলা সারসংক্ষেপ কপি করুন',
    draftAnotherBtn: 'নতুন ড্রাফ্ট করুন',

    navEyebrow: 'আইনি প্রক্রিয়া নির্দেশিকা',
    navHeadline: 'ভারতীয় নাগরিকদের জন্য ধাপে ধাপে আইনি রোডম্যাপ',
    navDescription: 'আপনার সমস্যা জানান। সরকারি পোর্টাল ও হেল্পলাইনের সাহায্যে সমাধান নির্দেশিকা পান।',
    searchGrievancePlaceholder: "যেমন 'UPI-তে সাইবার জালিয়াতি হয়েছে' বা 'মালিক ডিপোজিট ফেরত দিচ্ছে না'...",
    getRoadmapBtn: 'রোডম্যাপ পান',
    commonGrievancesTitle: 'সাধারণ আইনি সমস্যাসমূহ:',
    applicableLawsTitle: 'প্রযোজ্য ভারতীয় আইন ও ধারা:',
    goldenHourTitle: 'জরুরি পদক্ষেপ (গোল্ডেন আওয়ার)',
    stepperTitle: 'সমাধানের ধাপসমূহ',
    docsNeeded: 'প্রয়োজনীয় কাগজপত্র:',
    freeLegalAidTitle: 'ভারত সরকারের বিনামূল্যে আইনি সহায়তা',

    recordsEyebrow: 'রেকর্ড ও ইতিহাস',
    recordsHeadline: 'আপনার স্ক্যান করা চুক্তি এবং তৈরি করা খসড়া',
    recordsDesc: 'আপনার ব্রাউজারে সুরক্ষিতভাবে সংরক্ষিত।',
    scannedContractsTab: 'স্ক্যান করা চুক্তি',
    voiceDraftsTab: 'ভয়েস ড্রাফ্টসমূহ',
    noScannedFound: 'কোনো স্ক্যান করা চুক্তি পাওয়া যায়নি।',
    noDraftsFound: 'এখনও কোনো ড্রাফ্ট তৈরি হয়নি।',
    viewReportBtn: 'প্রতিবেদন',
    deleteBtn: 'মুছুন',

    footerMission: 'ভারতীয় নাগরিকদের অন্যায় চুক্তি থেকে রক্ষাকারী AI প্ল্যাটফর্ম।',
    emergencyHelplinesTitle: 'জরুরি আইনি হেল্পলাইন (ভারত)',
    govPortalsTitle: 'সরকারি পোর্টাল',
    disclaimerTitle: 'দায়মুক্তি ও আইনি নোটিশ',
    disclaimerText: 'লেক্সিগার্ড একটি আইনি সচেতনতা বৃদ্ধির সহায়ক ব্যবস্থা। এটি আদালতের আইনজীবীর বিকল্প নয়।',
  },

  ta: {
    navHome: 'முகப்பு',
    navScan: 'ஆவணத்தை ஸ்கேன் செய்',
    navChat: 'ஒப்பந்தத்துடன் உரையாடு',
    navDrafter: 'குரல் மூலம் வரைவு',
    navNavigator: 'சட்ட வழிகாட்டி',
    navHistory: 'பதிவுகள்',
    scanDocumentBtn: 'ஆவணத்தை ஸ்கேன் செய்',
    subBrandTitle: 'நீதி மற்றும் பாதுகாப்பு · AI ஒப்பந்த நுண்ணறிவு',
    activeDocBadge: 'செயலில் உள்ள ஆவணம்',
    voiceAiBadge: 'குரல் AI',

    heroEyebrow: 'ஒவ்வொரு இந்திய குடிமகனுக்கும் AI சட்டப் பாதுகாப்பு',
    heroHeadline1: 'ஸ்கேன் செய். புரிந்துகொள்.',
    heroHeadlineHighlight: 'உன்னைப் பாதுகாத்துக்கொள்.',
    heroSubheadline: 'கையொப்பமிடுவதற்கு முன் ஒப்பந்தத்தின் ஒவ்வொரு விதியையும் புரிந்துகொள்ளுங்கள் — மோசடிகளிலிருந்து தப்பவும்.',
    heroDescription:
      'லெக்ஸிகார்டு என்பது இந்திய சட்ட வழிகாட்டி. வாடகை ஒப்பந்தங்கள், வேலைவாய்ப்பு கடிதங்களை ஆராய்ந்து BNS 2023 விதிகளுடன் ஒப்பிடுங்கள்.',
    dropContractPrompt: 'உங்கள் சட்ட ஆவணத்தை இங்கே இழுத்து விடவும், அல்லது',
    dropContractSub: 'வாடகை ஒப்பந்தம் அல்லது அறிவிப்பை பதிவேற்றவும் (PDF, புகைப்படம், Word DOCX)',
    analyzeNowBtn: 'ஆவணத்தை பகுப்பாய்வு செய்',
    instantTestPrompt: 'உடனடி சோதனை:',
    featuresTitle: 'முழுமையான சட்ட பாதுகாப்பு அமைப்பு',
    featuresSubtitle: 'உங்கள் சட்ட உரிமைகளைப் பாதுகாக்க தேவையான அனைத்தும்',

    featScannerTitle: 'ஆவண ஸ்கேனர் & இடர் பகுப்பாய்வி',
    featScannerDesc: 'ஒப்பந்த விதிகளை ஆராய்ந்து நியாயமற்ற அபராதங்களை எளிமையான தமிழில் விளக்குகிறது.',
    featScannerAction: 'ஒப்பந்தத்தை ஸ்கேன் செய்',
    featDrafterTitle: 'குரல் மூலம் வரைவு',
    featDrafterDesc: 'பேசி வாடகை ஒப்பந்தம் அல்லது வேலைவாய்ப்பு கடிதம் உருவாக்குங்கள், எளிய தமிழ் சுருக்கத்துடன்.',
    featDrafterAction: 'வரைவு தொடங்கு',
    featNavigatorTitle: 'சட்ட நடைமுறை வழிகாட்டி',
    featNavigatorDesc: 'சைபர் மோசடி அல்லது வாடகை தகராறுகளுக்கு அரசு போர்ட்டல்கள் மற்றும் உதவி எண்களுடன் வழிகாட்டல்.',
    featNavigatorAction: 'வழிகாட்டியைப் பார்',
    featChatTitle: 'ஒப்பந்தத்துடன் உரையாடல் (RAG)',
    featChatDesc: 'உங்கள் ஆவணம் மற்றும் இந்திய சட்டங்களின் அடிப்படையில் கேள்விகள் கேளுங்கள்.',
    featChatAction: 'கேள்வி கேள்',

    scanHeaderTitle: 'கையொப்பமிடும் முன் ஒப்பந்தத்தை ஸ்கேன் செய்யவும்',
    scanHeaderDesc: 'வாடகை ஒப்பந்தத்தை பதிவேற்றி இந்திய ஒப்பந்தச் சட்டம் மற்றும் BNS 2023 கீழ் இடர்களை கண்டறியவும்.',
    uploadFileTab: 'கோப்பு பதிவேற்று (PDF / படம் / DOCX)',
    pasteTextTab: 'உரையை ஒட்டு',
    dragDropMain: 'ஆவணத்தை இங்கே இழுத்து விடவும், அல்லது',
    browseFiles: 'கோப்புகளைத் தேர்ந்தெடு',
    supportedFormats: 'PDF, புகைப்படங்கள் (PNG, JPG), Word (.DOCX) ஆதரிக்கப்படுகின்றன',
    pastePlaceholder: 'உங்கள் ஒப்பந்த உரையை இங்கே ஒட்டவும்...',
    analyzePastedBtn: 'ஒட்டப்பட்ட உரையை பகுப்பாய்வு செய்',
    instantContractsTitle: 'உடனடி சோதனை: 1-கிளிக் இந்திய சட்ட ஒப்பந்தங்கள்',
    instantContractsSub: 'கோப்பு பதிவேற்றாமல் உடனடியாக சோதிக்க மாதிரியைத் தேர்வு செய்யவும்',
    overallRiskTitle: 'ஒட்டுமொத்த ஒப்பந்த இடர்',
    executiveSummaryTitle: 'நிர்வாக சுருக்கம் (ஆங்கிலம்)',
    regionalSummaryTitle: 'ஆவண சுருக்கம் (தமிழ்)',
    missingProtectionsTitle: 'விடுபட்ட முக்கிய பாதுகாப்புகள்',
    tabRedFlags: 'ஆபத்தான விதிகள் (Red Flags)',
    tabIpcBns: 'IPC → BNS 2023 பிரிவுகள்',
    tabFavorable: 'சாதகமான விதிகள்',
    tabDocContent: 'ஆவண உரை',
    statutoryBasis: 'சட்ட அடிப்படை:',
    whyProblematic: 'இது ஏன் ஆபத்தானது:',
    plainRegionalExpl: 'எளிய தமிழில் விளக்கம்:',
    recommendedAction: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:',
    chatWithContractBtn: 'ஒப்பந்தத்துடன் உரையாடு',
    printSavePdfBtn: 'அச்சிடு / PDF சேமி',
    scanAnotherBtn: 'மற்றொன்றை ஸ்கேன் செய்',

    escalationTitle: 'இது சிக்கலானது — இலவச சட்ட வல்லுநர் உதவி பெறுங்கள்',
    escalationDesc: 'இந்த ஒப்பந்தத்தில் கடுமையான சட்டவிரோத விதிகள் உள்ளன. கையொப்பமிடும் முன் டெலி-லா உதவி பெறுங்கள்.',
    talkToExpertBtn: 'இலவச சட்ட வல்லுநரிடம் பேசுங்கள்',
    teleLawHelpline: 'டெலி-லா இலவச எண்: 14416',
    nalsaHelpline: 'நல்சா உதவி எண்: 15100',

    drafterEyebrow: 'குரல் வரைவு · வாய்ஸ் AI',
    drafterHeadline: 'உங்கள் குரலால் சட்ட ஒப்பந்தங்களை உருவாக்குங்கள்',
    drafterDesc: 'விபரங்களை பேசுங்கள் அல்லது எழுதுங்கள். லெக்ஸிகார்டு முழு ஒப்பந்தத்தையும் தமிழ் சுருக்கத்தையும் வழங்கும்.',
    step1: '1. பேசு / எழுது',
    step2: '2. விபரம் சரிபார்',
    step3: '3. இறுதி ஒப்பந்தம்',
    selectContractType: 'ஒப்பந்த வகையைத் தேர்ந்தெடுக்கவும்:',
    startVoiceBtn: 'குரல் பதிவைத் தொடங்கு',
    listeningBtn: 'கேட்கிறது... (நிறுத்த கிளிக் செய்)',
    insertSampleVoice: 'மாதிரி குரல் விபரத்தை இடு',
    spokenTermsLabel: 'பேசப்பட்ட விதிகள் (திருத்தக்கூடியவை):',
    extractTermsBtn: 'விபரங்களை எடுத்து படிவத்தை பார்',
    reviewFieldsTitle: 'விபரங்களை சரிபார்த்து உறுதிப்படுத்துங்கள்',
    reviewFieldsSub: 'உங்கள் குரலில் இருந்து எடுக்கப்பட்ட தகவல்களை சரிபார்க்கவும்.',
    generateAgreementBtn: 'ஒப்பந்தம் மற்றும் தமிழ் சுருக்கம் உருவாக்கு',
    formalLegalTitle: 'சட்ட ஒப்பந்தம் (ஆங்கிலம்)',
    plainRegionalSummaryTitle: 'எளிய தமிழ் சுருக்கம்',
    copyEnglishBtn: 'ஆங்கில ஒப்பந்தத்தை நகலெடு',
    copyRegionalBtn: 'தமிழ் சுருக்கத்தை நகலெடு',
    draftAnotherBtn: 'மற்றொன்றை வரைவு செய்',

    navEyebrow: 'சட்ட நடைமுறை வழிகாட்டி',
    navHeadline: 'இந்திய குடிமக்களுக்கான சட்ட வழிகாட்டு வரைபடம்',
    navDescription: 'உங்கள் பிரச்சனையை விளக்குங்கள். அரசு போர்ட்டல்கள் மற்றும் உதவி எண்களுடன் தீர்வைப் பெறுங்கள்.',
    searchGrievancePlaceholder: "எ.கா. 'UPI மூலம் சைபர் மோசடி நடந்தது' அல்லது 'வாடகை முன்பணம் திருப்பித் தரவில்லை'...",
    getRoadmapBtn: 'தீர்வு வரைபடம் பெறு',
    commonGrievancesTitle: 'பொதுவான குடிமக்கள் புகார்கள்:',
    applicableLawsTitle: 'பொருந்தக்கூடிய இந்திய சட்டங்கள்:',
    goldenHourTitle: 'உடனடி நடவடிக்கை (கோல்டன் ஹவர்)',
    stepperTitle: 'தீர்வுக்கான படிகள்',
    docsNeeded: 'தேவையான ஆவணங்கள்:',
    freeLegalAidTitle: 'இந்திய அரசின் இலவச சட்ட உதவி',

    recordsEyebrow: 'பதிவுகள் மற்றும் வரலாறு',
    recordsHeadline: 'உங்கள் ஸ்கேன் செய்த மற்றும் உருவாக்கிய ஆவணங்கள்',
    recordsDesc: 'உங்கள் உலாவியில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.',
    scannedContractsTab: 'ஸ்கேன் செய்த ஒப்பந்தங்கள்',
    voiceDraftsTab: 'குரல் வரைவுகள்',
    noScannedFound: 'ஸ்கேன் செய்த ஒப்பந்தங்கள் எதுவும் இல்லை.',
    noDraftsFound: 'வரைவுகள் எதுவும் இன்னும் உருவாக்கப்படவில்லை.',
    viewReportBtn: 'அறிக்கை',
    deleteBtn: 'நீக்கு',

    footerMission: 'இந்திய குடிமக்களை நியாயமற்ற ஒப்பந்தங்களிலிருந்து பாதுகாக்கும் AI தளம்.',
    emergencyHelplinesTitle: 'அவசர சட்ட உதவி எண்கள் (இந்தியா)',
    govPortalsTitle: 'அரசு போர்ட்டல்கள்',
    disclaimerTitle: 'பொறுப்பு துறப்பு',
    disclaimerText: 'லெக்ஸிகார்டு என்பது சட்ட விழிப்புணர்வுக்கான ஒரு கருவியாகும். இது வழக்கறிஞரின் பிரதிநிதித்துவத்திற்கு மாற்றாகாது.',
  },

  te: {
    navHome: 'హోమ్',
    navScan: 'పత్రం స్కాన్ చేయండి',
    navChat: 'ఒప్పందంతో చాట్',
    navDrafter: 'వాయిస్ డ్రాఫ్ట్',
    navNavigator: 'చట్టపరమైన మార్గదర్శి',
    navHistory: 'రికార్డులు',
    scanDocumentBtn: 'పత్రం స్కాన్ చేయండి',
    subBrandTitle: 'న్యాయం మరియు రక్షణ · AI కాంట్రాక్ట్ ఇంటెలిజెన్స్',
    activeDocBadge: 'యాక్టివ్ పత్రం',
    voiceAiBadge: 'వాయిస్ AI',

    heroEyebrow: 'ప్రతి భారతీయ పౌరుడికి AI చట్టపరమైన రక్షణ',
    heroHeadline1: 'స్కాన్ చేయండి. అర్థం చేసుకోండి.',
    heroHeadlineHighlight: 'మిమ్మల్ని మీరు రక్షించుకోండి.',
    heroSubheadline: 'సంతకం చేయడానికి ముందు ప్రతి నిబంధనను అర్థం చేసుకోండి — మోసాలు మరియు చట్టవిరుద్ధ షరతులను నివారించండి.',
    heroDescription:
      'లెక్సిగార్డ్ అనేది ప్రామాణిక భారతీయ లీగల్ అసిస్టెంట్. అద్దె ఒప్పందాలు, ఉద్యోగ ఆఫర్ లెటర్లను విశ్లేషించి BNS 2023 తో సరిపోల్చండి.',
    dropContractPrompt: 'మీ చట్టపరమైన పత్రాన్ని ఇక్కడ వేయండి, లేదా',
    dropContractSub: 'అద్దె ఒప్పందం లేదా నోటీసును అప్‌లోడ్ చేయండి (PDF, ఫోటో, Word DOCX)',
    analyzeNowBtn: 'పత్రాన్ని విశ్లేషించండి',
    instantTestPrompt: 'తక్షణ పరీక్ష:',
    featuresTitle: 'పూర్తి చట్టపరమైన రక్షణ సూట్',
    featuresSubtitle: 'పౌరుల హక్కులను కాపాడటానికి అవసరమైన అన్ని సాధనాలు',

    featScannerTitle: 'డాక్యుమెంట్ స్కానర్ & రిస్క్ ఎనలైజర్',
    featScannerDesc: 'ఒప్పంద నిబంధనలను పరిశీలించి చట్టవిరుద్ధమైన షరతులను సులభమైన తెలుగులో వివరిస్తుంది.',
    featScannerAction: 'కాంట్రాక్ట్ స్కాన్ చేయండి',
    featDrafterTitle: 'ఆవాజ్ సే డ్రాఫ్ట్',
    featDrafterDesc: 'మాట్లాడి అద్దె ఒప్పందం లేదా ఉద్యోగ పత్రం తయారు చేసుకోండి, తెలుగు సారాంశంతో.',
    featDrafterAction: 'డ్రాఫ్ట్ ప్రారంభించండి',
    featNavigatorTitle: 'చట్టపరమైన ప్రక్రియ మార్గదర్శి',
    featNavigatorDesc: 'సైబర్ మోసం లేదా అద్దె వివాదాలకు ప్రభుత్వ పోర్టల్స్ మరియు హెల్ప్‌లైన్లతో పరిష్కారం.',
    featNavigatorAction: 'మార్గదర్శిని చూడండి',
    featChatTitle: 'ఒప్పందంతో చాట్ (RAG)',
    featChatDesc: 'మీ పత్రం మరియు భారతీయ చట్టాల ఆధారంగా ప్రశ్నలు అడగండి.',
    featChatAction: 'ప్రశ్నలు అడగండి',

    scanHeaderTitle: 'సంతకం చేసే ముందు మీ ఒప్పందాన్ని స్కాన్ చేయండి',
    scanHeaderDesc: 'అద్దె ఒప్పందాన్ని అప్‌లోడ్ చేసి భారత ఒప్పంద చట్టం మరియు BNS 2023 కింద రిస్క్‌లను కనుగొనండి.',
    uploadFileTab: 'ఫైల్ అప్‌లోడ్ చేయండి (PDF / ఫోటో / DOCX)',
    pasteTextTab: 'టెక్స్ట్ పేస్ట్ చేయండి',
    dragDropMain: 'పత్రాన్ని ఇక్కడ లాగండి, లేదా',
    browseFiles: 'ఫైల్స్ ఎంచుకోండి',
    supportedFormats: 'PDF, ఫోటోలు (PNG, JPG), Word (.DOCX) సపోర్ట్ చేయబడతాయి',
    pastePlaceholder: 'మీ ఒప్పంద పాఠ్యాన్ని ఇక్కడ పేస్ట్ చేయండి...',
    analyzePastedBtn: 'విశ్లేషించండి',
    instantContractsTitle: 'తక్షణ పరీక్ష: 1-క్లిక్ భారతీయ లీగల్ కాంట్రాక్టులు',
    instantContractsSub: 'ఫైల్ అప్‌లోడ్ లేకుండా తనిఖీ చేయడానికి నమూనాను ఎంచుకోండి',
    overallRiskTitle: 'మొత్తం ఒప్పంద రిస్క్',
    executiveSummaryTitle: 'ఎగ్జిక్యూటివ్ సారాంశం (ఇంగ్లీష్)',
    regionalSummaryTitle: 'పత్ర సారాంశం (తెలుగులో)',
    missingProtectionsTitle: 'లోపించిన ముఖ్యమైన రక్షణలు',
    tabRedFlags: 'ప్రమాదకర నిబంధనలు (రెడ్ ఫ్లాగ్స్)',
    tabIpcBns: 'IPC → BNS 2023 సెక్షన్లు',
    tabFavorable: 'అనుకూల నిబంధనలు',
    tabDocContent: 'పత్రం కంటెంట్',
    statutoryBasis: 'చట్టపరమైన ఆధారం:',
    whyProblematic: 'ఇది ఎందుకు హానికరం:',
    plainRegionalExpl: 'సులభమైన తెలుగులో అర్థం:',
    recommendedAction: 'సిఫార్సు చేయబడిన చర్య:',
    chatWithContractBtn: 'ఒప్పందంతో చాట్ చేయండి',
    printSavePdfBtn: 'ప్రింట్ / PDF సేవ్',
    scanAnotherBtn: 'మరొకటి స్కాన్ చేయండి',

    escalationTitle: 'ఇది సంక్లిష్టంగా ఉంది — ఉచిత న్యాయ నిపుణుల సహాయం తీసుకోండి',
    escalationDesc: 'ఈ ఒప్పందంలో తీవ్రమైన చట్టవిరుద్ధ నిబంధనలు ఉన్నాయి. సంతకం చేయడానికి ముందు టెలి-లా సహాయం పొందండి.',
    talkToExpertBtn: 'ఉచిత న్యాయ నిపుణుడితో మాట్లాడండి',
    teleLawHelpline: 'టెలి-లా టోల్-ఫ్రీ: 14416',
    nalsaHelpline: 'నల్సా లీగల్ ఎయిడ్: 15100',

    drafterEyebrow: 'వాయిస్ డ్రాఫ్ట్ · వాయిస్ AI',
    drafterHeadline: 'మీ వాయిస్‌తో భారతీయ చట్టపరమైన ఒప్పందాలను తయారు చేయండి',
    drafterDesc: 'నిబంధనలను మాట్లాడండి లేదా రాయండి. లెక్సిగార్డ్ పూర్తి ఒప్పందాన్ని మరియు తెలుగు సారాంశాన్ని అందిస్తుంది.',
    step1: '1. మాట్లాడండి / రాయండి',
    step2: '2. వివరాలు సరిచూడండి',
    step3: '3. తుది ఒప్పందం',
    selectContractType: 'ఒప్పందం రకాన్ని ఎంచుకోండి:',
    startVoiceBtn: 'వాయిస్ రికార్డింగ్ ప్రారంభించండి',
    listeningBtn: 'వింటోంది... (ఆపడానికి క్లిక్ చేయండి)',
    insertSampleVoice: 'నమూనా వాయిస్ ప్రాంప్ట్ ఇవ్వండి',
    spokenTermsLabel: 'మాట్లాడిన నిబంధనలు (సవరించదగినవి):',
    extractTermsBtn: 'వివరాలు పరిశీలించి ఫారం చూడండి',
    reviewFieldsTitle: 'వివరాలను సమీక్షించి నిర్ధారించండి',
    reviewFieldsSub: 'మీ వాయిస్ నుండి తీసిన వివరాలను సరిచూసుకోండి.',
    generateAgreementBtn: 'ఒప్పందం మరియు తెలుగు సారాంశం రూపొందించండి',
    formalLegalTitle: 'చట్టపరమైన ఒప్పందం (ఇంగ్లీష్)',
    plainRegionalSummaryTitle: 'సులభమైన తెలుగు సారాంశం',
    copyEnglishBtn: 'ఇంగ్లీష్ కాంట్రాక్ట్ కాపీ చేయండి',
    copyRegionalBtn: 'తెలుగు సారాంశం కాపీ చేయండి',
    draftAnotherBtn: 'మరొకటి డ్రాఫ్ట్ చేయండి',

    navEyebrow: 'చట్టపరమైన ప్రక్రియ మార్గదర్శి',
    navHeadline: 'భారతీయ పౌరుల కోసం దశలవారీ చట్టపరమైన రోడ్‌మ్యాప్',
    navDescription: 'మీ సమస్యను చెప్పండి. ప్రభుత్వ పోర్టల్స్ మరియు హెల్ప్‌లైన్లతో పరిష్కారాన్ని పొందండి.',
    searchGrievancePlaceholder: "ఉదా. 'UPI ద్వారా సైబర్ మోసం జరిగింది' లేదా 'యజమాని డిపాజిట్ తిరిగి ఇవ్వడం లేదు'...",
    getRoadmapBtn: 'రోడ్‌మ్యాప్ పొందండి',
    commonGrievancesTitle: 'సాధారణ పౌర సమస్యలు:',
    applicableLawsTitle: 'వర్తించే భారతీయ చట్టాలు:',
    goldenHourTitle: 'తక్షణ గోల్డెన్ అవర్ చర్య',
    stepperTitle: 'పరిష్కార దశలు',
    docsNeeded: 'అవసరమైన పత్రాలు:',
    freeLegalAidTitle: 'భారత ప్రభుత్వం ద్వారా ఉచిత న్యాయ సహాయం',

    recordsEyebrow: 'రికార్డులు మరియు చరిత్ర',
    recordsHeadline: 'మీరు స్కాన్ చేసిన మరియు తయారు చేసిన పత్రాలు',
    recordsDesc: 'మీ బ్రౌజర్‌లో సురక్షితంగా నిల్వ చేయబడతాయి.',
    scannedContractsTab: 'స్కాన్ చేసిన ఒప్పందాలు',
    voiceDraftsTab: 'వాయిస్ డ్రాఫ్ట్‌లు',
    noScannedFound: 'స్కాన్ చేసిన ఒప్పందాలు ఏవీ లేవు.',
    noDraftsFound: 'ఇంకా డ్రాఫ్ట్‌లు ఏవీ తయారు చేయలేదు.',
    viewReportBtn: 'నివేదిక',
    deleteBtn: 'తొలగించండి',

    footerMission: 'భారతీయ పౌరులను అన్యాయమైన నిబంధనల నుండి రక్షించే AI వ్యవస్థ.',
    emergencyHelplinesTitle: 'అత్యవసర లీగల్ హెల్ప్‌లైన్లు (భారతదేశం)',
    govPortalsTitle: 'ప్రభుత్వ పోర్టల్స్',
    disclaimerTitle: 'బాధ్యత నిరాకరణ',
    disclaimerText: 'లెక్సిగార్డ్ అనేది చట్టపరమైన అవగాహన కోసం రూపొందించబడిన సాధనం. ఇది న్యాయవాది ప్రాతినిధ్యానికి ప్రత్యామ్నాయం కాదు.',
  },

  gu: {
    navHome: 'હોમ',
    navScan: 'દસ્તાવેજ સ્કેન કરો',
    navChat: 'કરાર સાથે ચેટ',
    navDrafter: 'અવાજથી ડ્રાફ્ટ',
    navNavigator: 'કાનૂની માર્ગદર્શિકા',
    navHistory: 'રેકોર્ડ્સ',
    scanDocumentBtn: 'દસ્તાવેજ સ્કેન કરો',
    subBrandTitle: 'ન્યાય અને સુરક્ષા · AI કરાર વિશ્લેષણ',
    activeDocBadge: 'સક્રિય દસ્તાવેજ',
    voiceAiBadge: 'વોઇસ AI',

    heroEyebrow: 'દરેક ભારતીય નાગરિક માટે AI કાનૂની સુરક્ષા',
    heroHeadline1: 'સ્કેન કરો. સમજો.',
    heroHeadlineHighlight: 'તમારી જાતને સુરક્ષિત કરો.',
    heroSubheadline: 'સહી કરતા પહેલા કરારની દરેક શરત સમજો — છેતરપિંડી અને ગેરકાયદેસર શરતોથી બચો.',
    heroDescription:
      'લેક્સિગાર્ડ એ વિશ્વસનીય ભારતીય કાનૂની સહાયક છે. ભાડા કરાર, જોબ ઓફર લેટર તપાસો અને BNS 2023 સાથે સરખાવો.',
    dropContractPrompt: 'તમારો કાનૂની દસ્તાવેજ અહીં મૂકો, અથવા',
    dropContractSub: 'ભાડા કરાર અથવા નોટિસ અપલોડ કરો (PDF, ફોટો, Word DOCX)',
    analyzeNowBtn: 'દસ્તાવેજનું વિશ્લેષણ કરો',
    instantTestPrompt: 'ત્વરિત પરીક્ષણ:',
    featuresTitle: 'સંપૂર્ણ કાનૂની સુરક્ષા સ્યુટ',
    featuresSubtitle: 'નાગરિકોના હકોના રક્ષણ માટે જરૂરી તમામ સાધનો',

    featScannerTitle: 'દસ્તાવેજ સ્કેનર અને જોખમ વિશ્લેષક',
    featScannerDesc: 'કરારની શરતોની તપાસ અને ગેરકાયદેસર દંડની ઓળખ.',
    featScannerAction: 'કરાર સ્કેન કરો',
    featDrafterTitle: 'અવાજથી ડ્રાફ્ટ',
    featDrafterDesc: 'બોલીને ભાડા કરાર અથવા રોજગાર પત્ર બનાવો, સરળ ગુજરાતી સારાંશ સાથે.',
    featDrafterAction: 'ડ્રાફ્ટ શરૂ કરો',
    featNavigatorTitle: 'કાનૂની પ્રક્રિયા માર્ગદર્શિકા',
    featNavigatorDesc: 'સાયબર છેતરપિંડી અથવા ભાડા વિવાદમાં સરકારી પોર્ટલ અને હેલ્પલાઇન સાથે પગલાંવાર ઉકેલ.',
    featNavigatorAction: 'માર્ગદર્શિકા જુઓ',
    featChatTitle: 'કરાર સાથે ચેટ (RAG)',
    featChatDesc: 'તમારા દસ્તાવેજ અને ભારતીય કાયદાઓ પર આધારિત પ્રશ્નો પૂછો.',
    featChatAction: 'પ્રશ્નો પૂછો',

    scanHeaderTitle: 'સહી કરતા પહેલા તમારો કરાર સ્કેન કરો',
    scanHeaderDesc: 'ભાડા કરાર અપલોડ કરી ભારતીય કરાર અધિનિયમ અને BNS 2023 હેઠળ જોખમ તપાસો.',
    uploadFileTab: 'ફાઇલ અપલોડ કરો (PDF / ફોટો / DOCX)',
    pasteTextTab: 'ટેક્સ્ટ પેસ્ટ કરો',
    dragDropMain: 'દસ્તાવેજ અહીં ખેંચો, અથવા',
    browseFiles: 'ફાઇલો પસંદ કરો',
    supportedFormats: 'PDF, ફોટા (PNG, JPG), Word (.DOCX) સપોર્ટેડ છે',
    pastePlaceholder: 'અહીં કરારનું લખાણ પેસ્ટ કરો...',
    analyzePastedBtn: 'વિશ્લેષણ કરો',
    instantContractsTitle: 'ત્વરિત પરીક્ષણ: ૧-ક્લિક ભારતીય કાનૂની કરાર',
    instantContractsSub: 'ફાઇલ અપલોડ કર્યા વગર તપાસવા નમૂનો પસંદ કરો',
    overallRiskTitle: 'કુલ કરાર જોખમ',
    executiveSummaryTitle: 'મુખ્ય સારાંશ (અંગ્રેજી)',
    regionalSummaryTitle: 'દસ્તાવેજ સારાંશ (ગુજરાતી)',
    missingProtectionsTitle: 'ગેરહાજર કાનૂની સુરક્ષા',
    tabRedFlags: 'જોખમી શરતો (રેડ ફ્લેગ્સ)',
    tabIpcBns: 'IPC → BNS 2023 કલમો',
    tabFavorable: 'લાભદાયી શરતો',
    tabDocContent: 'દસ્તાવેજ લખાણ',
    statutoryBasis: 'કાનૂની આધાર:',
    whyProblematic: 'આ શરત શા માટે નુકસાનકારક છે:',
    plainRegionalExpl: 'સરળ ગુજરાતીમાં સમજો:',
    recommendedAction: 'ભલામણ કરેલ પગલાં:',
    chatWithContractBtn: 'કરાર સાથે ચેટ કરો',
    printSavePdfBtn: 'પ્રિન્ટ / PDF સાચવો',
    scanAnotherBtn: 'બીજું સ્કેન કરો',

    escalationTitle: 'આ જટિલ લાગે છે — મફત કાનૂની સલાહ મેળવો',
    escalationDesc: 'આ કરારમાં જોખમી શરતો છે. સહી કરતા પહેલા ટેલિ-લો પોર્ટલ પર મફત સલાહ લો.',
    talkToExpertBtn: 'મફત કાનૂની નિષ્ણાત સાથે વાત કરો',
    teleLawHelpline: 'ટેલિ-લો ટોલ-ફ્રી: 14416',
    nalsaHelpline: 'નાલસા કાનૂની સહાય: 15100',

    drafterEyebrow: 'અવાજથી ડ્રાફ્ટ · વોઇસ AI',
    drafterHeadline: 'તમારા અવાજથી ભારતીય કાનૂની કરાર બનાવો',
    drafterDesc: 'શરતો બોલો અથવા લખો. લેક્સિગાર્ડ સંપૂર્ણ કરાર અને ગુજરાતી સારાંશ તૈયાર કરશે.',
    step1: '૧. બોલો / લખો',
    step2: '૨. વિગત ચકાસો',
    step3: '૩. અંતિમ કરાર',
    selectContractType: 'કરારનો પ્રકાર પસંદ કરો:',
    startVoiceBtn: 'વોઇસ રેકોર્ડિંગ શરૂ કરો',
    listeningBtn: 'સાંભળી રહ્યું છે... (અટકાવવા ક્લિક કરો)',
    insertSampleVoice: 'નમૂનાનો અવાજ પ્રોમ્પ્ટ મૂકો',
    spokenTermsLabel: 'બોલેલી શરતો (સંપાદન યોગ્ય):',
    extractTermsBtn: 'શરતો કાઢો અને ફોર્મ જુઓ',
    reviewFieldsTitle: 'વિગતોની સમીક્ષા કરો',
    reviewFieldsSub: 'તમારા અવાજમાંથી મેળવેલી વિગતો તપાસી સુધારો કરો.',
    generateAgreementBtn: 'કરાર અને ગુજરાતી સારાંશ બનાવો',
    formalLegalTitle: 'કાનૂની કરાર (અંગ્રેજી)',
    plainRegionalSummaryTitle: 'સરળ ગુજરાતી સારાંશ',
    copyEnglishBtn: 'અંગ્રેજી કરાર કોપી કરો',
    copyRegionalBtn: 'ગુજરાતી સારાંશ કોપી કરો',
    draftAnotherBtn: 'બીજો ડ્રાફ્ટ બનાવો',

    navEyebrow: 'કાનૂની પ્રક્રિયા માર્ગદર્શિકા',
    navHeadline: 'ભારતીય નાગરિકો માટે પગલાંવાર કાનૂની રોડમેપ',
    navDescription: 'તમારી સમસ્યા જણાવો. સરકારી પોર્ટલ અને હેલ્પલાઇનની મદદથી ઉકેલ મેળવો.',
    searchGrievancePlaceholder: "જેમ કે 'UPI થી સાયબર છેતરપિંડી થઈ' અથવા 'મકાનમાલિક ડિપોઝિટ પરત નથી આપતો'...",
    getRoadmapBtn: 'રોડમેપ મેળવો',
    commonGrievancesTitle: 'સામાન્ય નાગરિક ફરિયાદો:',
    applicableLawsTitle: 'લાગુ પડતા કાયદા અને કલમો:',
    goldenHourTitle: 'તાત્કાલિક ગોલ્ડન અવર પગલું',
    stepperTitle: 'નિવારણના પગલાં',
    docsNeeded: 'જરૂરી દસ્તાવેજો:',
    freeLegalAidTitle: 'ભારત સરકાર દ્વારા મફત કાનૂની સહાય',

    recordsEyebrow: 'રેકોર્ડ્સ અને ઇતિહાસ',
    recordsHeadline: 'તમારા સ્કેન કરેલા કરારો અને બનાવેલા ડ્રાફ્ટ',
    recordsDesc: 'તમારા બ્રાઉઝરમાં સુરક્ષિત રીતે સંગ્રહિત.',
    scannedContractsTab: 'સ્કેન કરેલા કરાર',
    voiceDraftsTab: 'વોઇસ ડ્રાફ્ટ્સ',
    noScannedFound: 'કોઈ સ્કેન કરેલ કરાર મળ્યો નથી.',
    noDraftsFound: 'હજી સુધી કોઈ ડ્રાફ્ટ બનાવ્યો નથી.',
    viewReportBtn: 'રિપોર્ટ',
    deleteBtn: 'કાઢી નાખો',

    footerMission: 'ભારતીય નાગરિકોને અયોગ્ય કરારોથી બચાવતું AI પ્લેટફોર્મ.',
    emergencyHelplinesTitle: 'ઇમરજન્સી કાનૂની હેલ્પલાઇન (ભારત)',
    govPortalsTitle: 'સરકારી પોર્ટલ',
    disclaimerTitle: 'અસ્વીકરણ અને કાનૂની નોટિસ',
    disclaimerText: 'લેક્સિગાર્ડ એ કાનૂની જાગૃતિ માટેનું સાધન છે. તે વકીલના સત્તાવાર પ્રતિનિધિત્વનો વિકલ્પ નથી.',
  },

  kn: {
    navHome: 'ಮುಖಪುಟ',
    navScan: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    navChat: 'ಒಪ್ಪಂದದೊಂದಿಗೆ ಚಾಟ್',
    navDrafter: 'ಧ್ವನಿಯ ಮೂಲಕ ಕರಡು',
    navNavigator: 'ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿ',
    navHistory: 'ದಾಖಲೆಗಳು',
    scanDocumentBtn: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    subBrandTitle: 'ನ್ಯಾಯ ಮತ್ತು ರಕ್ಷಣೆ · AI ಕರಾರು ವಿಶ್ಲೇಷಣೆ',
    activeDocBadge: 'ಸಕ್ರಿಯ ದಾಖಲೆ',
    voiceAiBadge: 'ಧ್ವನಿ AI',

    heroEyebrow: 'ಪ್ರತಿಯೊಬ್ಬ ಭಾರತೀಯ ನಾಗರಿಕನಿಗೆ AI ಕಾನೂನು ರಕ್ಷಣೆ',
    heroHeadline1: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ. ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
    heroHeadlineHighlight: 'ನಿಮ್ಮನ್ನು ನೀವು ರಕ್ಷಿಸಿಕೊಳ್ಳಿ.',
    heroSubheadline: 'ಸಹಿ ಮಾಡುವ ಮೊದಲು ಒಪ್ಪಂದದ ಪ್ರತಿಯೊಂದು ಷರತ್ತನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ — ವಂಚನೆಯಿಂದ ಪಾರಾಗಿ.',
    heroDescription:
      'ಲೆಕ್ಸಿಗಾರ್ಡ್ ಒಂದು ಅಧಿಕೃತ ಭಾರತೀಯ ಕಾನೂನು ಸಹಾಯಕ. ಬಾಡಿಗೆ ಒಪ್ಪಂದಗಳು ಮತ್ತು ಉದ್ಯೋಗ ಪತ್ರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ BNS 2023 ನೊಂದಿಗೆ ಹೋಲಿಸಿ.',
    dropContractPrompt: 'ನಿಮ್ಮ ಕಾನೂನು ದಾಖಲೆಯನ್ನು ಇಲ್ಲಿ ಇರಿಸಿ, ಅಥವಾ',
    dropContractSub: 'ಬಾಡಿಗೆ ಒಪ್ಪಂದ ಅಥವಾ ನೋಟಿಸ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (PDF, ಫೋಟೋ, Word DOCX)',
    analyzeNowBtn: 'ದಾಖಲೆ ವಿಶ್ಲೇಷಿಸಿ',
    instantTestPrompt: 'ತ್ವರಿತ ಪರೀಕ್ಷೆ:',
    featuresTitle: 'ಸಂಪೂರ್ಣ ಕಾನೂನು ರಕ್ಷಣಾ ಸೂಟ್',
    featuresSubtitle: 'ನಾಗರಿಕರ ಹಕ್ಕುಗಳನ್ನು ರಕ್ಷಿಸಲು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಸಾಧನಗಳು',

    featScannerTitle: 'ದಾಖಲೆ ಸ್ಕ್ಯಾನರ್ & ರಿಸ್ಕ್ ವಿಶ್ಲೇಷಕ',
    featScannerDesc: 'ಒಪ್ಪಂದದ ಷರತ್ತುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅನಗತ್ಯ ದಂಡಗಳನ್ನು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ.',
    featScannerAction: 'ಒಪ್ಪಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    featDrafterTitle: 'ಆವಾಜ್ ಸೆ ಡ್ರಾಫ್ಟ್',
    featDrafterDesc: 'ಮಾತನಾಡಿ ಬಾಡಿಗೆ ಒಪ್ಪಂದ ಅಥವಾ ಉದ್ಯೋಗ ಪತ್ರ ರಚಿಸಿ, ಸರಳ ಕನ್ನಡ ಸಾರಾಂಶದೊಂದಿಗೆ.',
    featDrafterAction: 'ಕರಡು ರಚಿಸಿ',
    featNavigatorTitle: 'ಕಾನೂನು ಪ್ರಕ್ರಿಯೆ ಮಾರ್ಗದರ್ಶಿ',
    featNavigatorDesc: 'ಸೈಬರ್ ವಂಚನೆ ಅಥವಾ ಬಾಡಿಗೆ ವಿವಾದಗಳಿಗೆ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಮತ್ತು ಸಹಾಯವಾಣಿಗಳೊಂದಿಗೆ ಪರಿಹಾರ.',
    featNavigatorAction: 'ಮಾರ್ಗದರ್ಶಿ ನೋಡಿ',
    featChatTitle: 'ಒಪ್ಪಂದದೊಂದಿಗೆ ಚಾಟ್ (RAG)',
    featChatDesc: 'ನಿಮ್ಮ ದಾಖಲೆ ಮತ್ತು ಭಾರತೀಯ ಕಾನೂನುಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.',
    featChatAction: 'ಪ್ರಶ್ನೆ ಕೇಳಿ',

    scanHeaderTitle: 'ಸಹಿ ಮಾಡುವ ಮೊದಲು ಒಪ್ಪಂದವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    scanHeaderDesc: 'ಬಾಡಿಗೆ ಒಪ್ಪಂದವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಭಾರತೀಯ ಒಪ್ಪಂದ ಕಾಯ್ದೆ ಮತ್ತು BNS 2023 ಅಡಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
    uploadFileTab: 'ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (PDF / ಫೋಟೋ / DOCX)',
    pasteTextTab: 'ಪಠ್ಯ ಅಂಟಿಸಿ',
    dragDropMain: 'ದಾಖಲೆಯನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ, ಅಥವಾ',
    browseFiles: 'ಫೈಲ್‌ಗಳನ್ನು ಆರಿಸಿ',
    supportedFormats: 'PDF, ಫೋಟೋಗಳು (PNG, JPG), Word (.DOCX) ಬೆಂಬಲಿತವಾಗಿದೆ',
    pastePlaceholder: 'ನಿಮ್ಮ ಒಪ್ಪಂದದ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...',
    analyzePastedBtn: 'ವಿಶ್ಲೇಷಿಸಿ',
    instantContractsTitle: 'ತ್ವರಿತ ಪರೀಕ್ಷೆ: 1-ಕ್ಲಿಕ್ ಭಾರತೀಯ ಕಾನೂನು ಒಪ್ಪಂದಗಳು',
    instantContractsSub: 'ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡದೆ ಪರೀಕ್ಷಿಸಲು ಮಾದರಿಯನ್ನು ಆರಿಸಿ',
    overallRiskTitle: 'ಒಟ್ಟು ಒಪ್ಪಂದದ ರಿಸ್ಕ್',
    executiveSummaryTitle: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ (ಇಂಗ್ಲಿಷ್)',
    regionalSummaryTitle: 'ದಾಖಲೆಯ ಸಾರಾಂಶ (ಕನ್ನಡ)',
    missingProtectionsTitle: 'ಕಾಣೆಯಾದ ಪ್ರಮುಖ ರಕ್ಷಣೆಗಳು',
    tabRedFlags: 'ಅಪಾಯಕಾರಿ ಷರತ್ತುಗಳು (ರೆಡ್ ಫ್ಲ್ಯಾಗ್ಸ್)',
    tabIpcBns: 'IPC → BNS 2023 ವಿಭಾಗಗಳು',
    tabFavorable: 'ಅನುಕೂಲಕರ ಷರತ್ತುಗಳು',
    tabDocContent: 'ದಾಖಲೆಯ ವಿಷಯ',
    statutoryBasis: 'ಕಾನೂನು ಆಧಾರ:',
    whyProblematic: 'ಇದು ಏಕೆ ಹಾನಿಕಾರಕ:',
    plainRegionalExpl: 'ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಅರ್ಥ:',
    recommendedAction: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ:',
    chatWithContractBtn: 'ಒಪ್ಪಂದದೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ',
    printSavePdfBtn: 'ಪ್ರಿಂಟ್ / PDF ಉಳಿಸಿ',
    scanAnotherBtn: 'ಇನ್ನೊಂದನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',

    escalationTitle: 'ಇದು ಸಂಕೀರ್ಣವಾಗಿದೆ — ಉಚಿತ ಕಾನೂನು ತಜ್ಞರ ನೆರವು ಪಡೆಯಿರಿ',
    escalationDesc: 'ಈ ಒಪ್ಪಂದದಲ್ಲಿ ಕಠಿಣ ಕಾನೂನುಬಾಹಿರ ಷರತ್ತುಗಳಿವೆ. ಸಹಿ ಮಾಡುವ ಮೊದಲು ಟೆಲಿ-ಲಾ ಸಹಾಯ ಪಡೆಯಿರಿ.',
    talkToExpertBtn: 'ಉಚಿತ ಕಾನೂನು ತಜ್ಞರೊಂದಿಗೆ ಮಾತನಾಡಿ',
    teleLawHelpline: 'ಟೆಲಿ-ಲಾ ಟೋಲ್-ಫ್ರೀ: 14416',
    nalsaHelpline: 'ನಾಲ್ಸಾ ಕಾನೂನು ನೆರವು: 15100',

    drafterEyebrow: 'ಧ್ವನಿ ಕರಡು · ಧ್ವನಿ AI',
    drafterHeadline: 'ನಿಮ್ಮ ಧ್ವನಿಯಿಂದ ಕಾನೂನು ಒಪ್ಪಂದಗಳನ್ನು ರಚಿಸಿ',
    drafterDesc: 'ಷರತ್ತುಗಳನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ. ಲೆಕ್ಸಿಗಾರ್ಡ್ ಸಂಪೂರ್ಣ ಒಪ್ಪಂದ ಮತ್ತು ಕನ್ನಡ ಸಾರಾಂಶವನ್ನು ನೀಡುತ್ತದೆ.',
    step1: '1. ಮಾತನಾಡಿ / ಬರೆಯಿರಿ',
    step2: '2. ವಿವರ ಪರಿಶೀಲಿಸಿ',
    step3: '3. ಅಂತಿಮ ಒಪ್ಪಂದ',
    selectContractType: 'ಒಪ್ಪಂದದ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    startVoiceBtn: 'ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    listeningBtn: 'ಆಲಿಸುತ್ತಿದೆ... (ನಿಲ್ಲಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ)',
    insertSampleVoice: 'ಮಾದರಿ ಧ್ವನಿ ಪ್ರಾಂಪ್ಟ್ ನೀಡಿ',
    spokenTermsLabel: 'ಮಾತನಾಡಿದ ಷರತ್ತುಗಳು (ತಿದ್ದಬಹುದಾದ):',
    extractTermsBtn: 'ವಿವರಗಳನ್ನು ಹೊರತೆಗೆಯಿರಿ ಮತ್ತು ಫಾರ್ಮ್ ನೋಡಿ',
    reviewFieldsTitle: 'ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ',
    reviewFieldsSub: 'ನಿಮ್ಮ ಧ್ವನಿಯಿಂದ ಪಡೆದ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
    generateAgreementBtn: 'ಒಪ್ಪಂದ ಮತ್ತು ಕನ್ನಡ ಸಾರಾಂಶ ರಚಿಸಿ',
    formalLegalTitle: 'ಕಾನೂನು ಒಪ್ಪಂದ (ಇಂಗ್ಲಿಷ್)',
    plainRegionalSummaryTitle: 'ಸರಳ ಕನ್ನಡ ಸಾರಾಂಶ',
    copyEnglishBtn: 'ಇಂಗ್ಲಿಷ್ ಒಪ್ಪಂದ ನಕಲಿಸಿ',
    copyRegionalBtn: 'ಕನ್ನಡ ಸಾರಾಂಶ ನಕಲಿಸಿ',
    draftAnotherBtn: 'ಇನ್ನೊಂದು ಕರಡು ರಚಿಸಿ',

    navEyebrow: 'ಕಾನೂನು ಪ್ರಕ್ರಿಯೆ ಮಾರ್ಗದರ್ಶಿ',
    navHeadline: 'ಭಾರತೀಯ ನಾಗರಿಕರಿಗೆ ಹಂತ-ಹಂತದ ಕಾನೂನು ಮಾರ್ಗಸೂಚಿ',
    navDescription: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ. ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಮತ್ತು ಸಹಾಯವಾಣಿಗಳಿಂದ ಪರಿಹಾರ ಪಡೆಯಿರಿ.',
    searchGrievancePlaceholder: "ಉದಾ. 'UPI ಮೂಲಕ ಸೈಬರ್ ವಂಚನೆ ನಡೆದಿದೆ' ಅಥವಾ 'ಮನೆ ಮಾಲೀಕರು ಠೇವಣಿ ಮರಳಿಸುತ್ತಿಲ್ಲ'...",
    getRoadmapBtn: 'ಮಾರ್ಗಸೂಚಿ ಪಡೆಯಿರಿ',
    commonGrievancesTitle: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕ ದೂರುಗಳು:',
    applicableLawsTitle: 'ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಕಾನೂನುಗಳು:',
    goldenHourTitle: 'ತಕ್ಷಣದ ಗೋಲ್ಡನ್ ಅವರ್ ಕ್ರಮ',
    stepperTitle: 'ಪರಿಹಾರದ ಹಂತಗಳು',
    docsNeeded: 'ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:',
    freeLegalAidTitle: 'ಭಾರತ ಸರ್ಕಾರದಿಂದ ಉಚಿತ ಕಾನೂನು ನೆರವು',

    recordsEyebrow: 'ದಾಖಲೆಗಳು ಮತ್ತು ಇತಿಹಾಸ',
    recordsHeadline: 'ನಿಮ್ಮ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಒಪ್ಪಂದಗಳು ಮತ್ತು ರಚಿಸಿದ ಕರಡುಗಳು',
    recordsDesc: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.',
    scannedContractsTab: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಒಪ್ಪಂದಗಳು',
    voiceDraftsTab: 'ಧ್ವನಿ ಕರಡುಗಳು',
    noScannedFound: 'ಯಾವುದೇ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಒಪ್ಪಂದಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    noDraftsFound: 'ಇನ್ನೂ ಯಾವುದೇ ಕರಡುಗಳನ್ನು ರಚಿಸಲಾಗಿಲ್ಲ.',
    viewReportBtn: 'ವರದಿ',
    deleteBtn: 'ಅಳಿಸಿ',

    footerMission: 'ಭಾರತೀಯ ನಾಗರಿಕರನ್ನು ಅನ್ಯಾಯದ ಒಪ್ಪಂದಗಳಿಂದ ರಕ್ಷಿಸುವ AI ತಂತ್ರಜ್ಞಾನ.',
    emergencyHelplinesTitle: 'ತುರ್ತು ಕಾನೂನು ಸಹಾಯವಾಣಿಗಳು (ಭಾರತ)',
    govPortalsTitle: 'ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು',
    disclaimerTitle: 'ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ಕಾನೂನು ಮಾಹಿತಿ',
    disclaimerText: 'ಲೆಕ್ಸಿಗಾರ್ಡ್ ಕಾನೂನು ಜಾಗೃತಿಗಾಗಿ ಒಂದು ಸಾಧನವಾಗಿದೆ. ಇದು ವಕೀಲರ ಪ್ರಾತಿನಿಧ್ಯಕ್ಕೆ ಪರ್ಯಾಯವಲ್ಲ.',
  },

  ml: {
    navHome: 'ഹോം',
    navScan: 'രേഖ സ്കാൻ ചെയ്യുക',
    navChat: 'കരാറുമായി ചാറ്റ്',
    navDrafter: 'ശബ്ദത്തിലൂടെ കരട്',
    navNavigator: 'നിയമ വഴികാട്ടി',
    navHistory: 'രേഖകൾ',
    scanDocumentBtn: 'രേഖ സ്കാൻ ചെയ്യുക',
    subBrandTitle: 'നീതിയും സുരക്ഷയും · AI കരാർ വിശകലനം',
    activeDocBadge: 'സജീവ രേഖ',
    voiceAiBadge: 'വോയ്സ് AI',

    heroEyebrow: 'ഓരോ ഇന്ത്യൻ പൗരനും AI നിയമ സംരക്ഷണം',
    heroHeadline1: 'സ്കാൻ ചെയ്യുക. മനസ്സിലാക്കുക.',
    heroHeadlineHighlight: 'സ്വയം സംരക്ഷിക്കുക.',
    heroSubheadline: 'ഒപ്പിടുന്നതിന് മുൻപ് കരാറിലെ ഓരോ വ്യവസ്ഥയും മനസ്സിലാക്കുക — വഞ്ചനകളിൽ നിന്ന് രക്ഷപ്പെടുക.',
    heroDescription:
      'ലെക്സിഗാർഡ് ഒരു ആധികാരിക ഇന്ത്യൻ നിയമ സഹായിയാണ്. വാടക കരാറുകൾ, തൊഴിൽ ഓഫർ ലെറ്ററുകൾ എന്നിവ പരിശോധിച്ച് BNS 2023 നയങ്ങളുമായി ഒത്തുനോക്കുക.',
    dropContractPrompt: 'നിങ്ങളുടെ നിയമ രേഖ ഇവിടെ ഇടുക, അല്ലെങ്കിൽ',
    dropContractSub: 'വാടക കരാർ അല്ലെങ്കിൽ അറിയിപ്പ് അപ്‌ലോഡ് ചെയ്യുക (PDF, ഫോട്ടോ, Word DOCX)',
    analyzeNowBtn: 'രേഖ വിശകലനം ചെയ്യുക',
    instantTestPrompt: 'ഉടൻ പരിശോധിക്കുക:',
    featuresTitle: 'സമ്പൂർണ്ണ നിയമ സംരക്ഷണ സ്യൂട്ട്',
    featuresSubtitle: 'പൗരാവകാശങ്ങൾ സംരക്ഷിക്കാൻ ആവശ്യമായ എല്ലാ സൗകര്യങ്ങളും',

    featScannerTitle: 'ഡോക്യുമെന്റ് സ്കാനറും റിസ്ക് അനലൈസറും',
    featScannerDesc: 'കരാർ വ്യവസ്ഥകൾ പരിശോധിച്ച് അന്യായമായ പിഴകൾ ലളിതമായ മലയാളത്തിൽ വിശദീകരിക്കുന്നു.',
    featScannerAction: 'കരാർ സ്കാൻ ചെയ്യുക',
    featDrafterTitle: 'ആവാസ് സെ ഡ്രാഫ്റ്റ്',
    featDrafterDesc: 'സംസാരിച്ച് വാടകക്കരാറോ ഓഫർ ലെറ്ററോ തയ്യാറാക്കൂ, ലളിതമായ മലയാള സംഗ്രഹത്തോടൊപ്പം.',
    featDrafterAction: 'കരട് ആരംഭിക്കുക',
    featNavigatorTitle: 'നിയമ നടപടിക്രമ വഴികാട്ടി',
    featNavigatorDesc: 'സൈബർ തട്ടിപ്പിലോ വാടക തർക്കങ്ങളിലോ സർക്കാർ പോർട്ടലുകളുടെയും ഹെൽപ്പ് ലൈനുകളുടെയും സഹായത്തോടെ പരിഹാരം.',
    featNavigatorAction: 'വഴികാട്ടി കാണുക',
    featChatTitle: 'കരാറുമായി ചാറ്റ് ചെയ്യുക (RAG)',
    featChatDesc: 'നിങ്ങളുടെ രേഖയെയും ഇന്ത്യൻ നിയമങ്ങളെയും അടിസ്ഥാനമാക്കി ചോദ്യങ്ങൾ ചോദിക്കുക.',
    featChatAction: 'ചോദ്യം ചോദിക്കുക',

    scanHeaderTitle: 'ഒപ്പിടുന്നതിന് മുൻപ് കരാർ സ്കാൻ ചെയ്യുക',
    scanHeaderDesc: 'വാടകക്കരാർ അപ്‌ലോഡ് ചെയ്ത് ഇന്ത്യൻ കരാർ നിയമപ്രകാരവും BNS 2023 പ്രകാരവും പരിശോധിക്കുക.',
    uploadFileTab: 'ഫയൽ അപ്‌ലോഡ് ചെയ്യുക (PDF / ഫോട്ടോ / DOCX)',
    pasteTextTab: 'ടെക്സ്റ്റ് പേസ്റ്റ് ചെയ്യുക',
    dragDropMain: 'രേഖ ഇവിടെ വലിച്ചിടുക, അല്ലെങ്കിൽ',
    browseFiles: 'ഫയലുകൾ തിരഞ്ഞെടുക്കുക',
    supportedFormats: 'PDF, ഫോട്ടോകൾ (PNG, JPG), Word (.DOCX) എന്നിവ പിന്തുണയ്ക്കുന്നു',
    pastePlaceholder: 'നിങ്ങളുടെ കരാർ ഇവിടെ പേസ്റ്റ് ചെയ്യുക...',
    analyzePastedBtn: 'വിശകലനം ചെയ്യുക',
    instantContractsTitle: 'ഉടൻ പരിശോധന: 1-ക്ലിക്ക് ഇന്ത്യൻ നിയമ കരാറുകൾ',
    instantContractsSub: 'ഫയൽ അപ്‌ലോഡ് ചെയ്യാതെ പരിശോധിക്കാൻ മാതൃക തിരഞ്ഞെടുക്കുക',
    overallRiskTitle: 'മൊത്തത്തിലുള്ള കരാർ റിസ്ക്',
    executiveSummaryTitle: 'എക്സിക്യൂട്ടീവ് സംഗ്രഹം (ഇംഗ്ലീഷ്)',
    regionalSummaryTitle: 'രേഖാ സംഗ്രഹം (മലയാളത്തിൽ)',
    missingProtectionsTitle: 'നഷ്ടപ്പെട്ട സുരക്ഷാ വ്യവസ്ഥകൾ',
    tabRedFlags: 'അപകടകരമായ വ്യവസ്ഥകൾ (റെഡ് ഫ്ലാഗുകൾ)',
    tabIpcBns: 'IPC → BNS 2023 വകുപ്പുകൾ',
    tabFavorable: 'അനുകൂല വ്യവസ്ഥകൾ',
    tabDocContent: 'രേഖയുടെ ഉള്ളടക്കം',
    statutoryBasis: 'നിയമപരമായ അടിസ്ഥാനം:',
    whyProblematic: 'ഇത് എന്തുകൊണ്ട് അപകടകരമാണ്:',
    plainRegionalExpl: 'ലളിതമായ മലയാളത്തിൽ മനസ്സിലാക്കുക:',
    recommendedAction: 'ശുപാർശ ചെയ്യുന്ന നടപടി:',
    chatWithContractBtn: 'കരാറുമായി ചാറ്റ് ചെയ്യുക',
    printSavePdfBtn: 'പ്രിന്റ് / PDF സൂക്ഷിക്കുക',
    scanAnotherBtn: 'മറ്റൊന്ന് സ്കാൻ ചെയ്യുക',

    escalationTitle: 'ഇത് സങ്കീർണ്ണമാണ് — സൗജന്യ നിയമ വിദഗ്ദ്ധോപദേശം നേടുക',
    escalationDesc: 'ഈ കരാറിൽ കടുത്ത നിയമവിരുദ്ധ വ്യവസ്ഥകളുണ്ട്. ഒപ്പിടുന്നതിന് മുൻപ് ടെലി-ലോ സഹായം തേടുക.',
    talkToExpertBtn: 'സൗജന്യ നിയമ വിദഗ്ദ്ധനുമായി സംസാരിക്കുക',
    teleLawHelpline: 'ടെലി-ലോ ടോൾ-ഫ്രീ: 14416',
    nalsaHelpline: 'നാൽസ ലീഗൽ എയ്ഡ്: 15100',

    drafterEyebrow: 'വോയ്സ് ഡ്രാഫ്റ്റ് · വോയ്സ് AI',
    drafterHeadline: 'നിങ്ങളുടെ ശബ്ദത്തിലൂടെ നിയമ കരാറുകൾ തയ്യാറാക്കുക',
    drafterDesc: 'വ്യവസ്ഥകൾ പറയുക അല്ലെങ്കിൽ എഴുതുക. ലെക്സിഗാർഡ് പൂർണ്ണ കരാറും മലയാള സംഗ്രഹവും നൽകും.',
    step1: '1. പറയുക / എഴുതുക',
    step2: '2. വിവരങ്ങൾ പരിശോധിക്കുക',
    step3: '3. അന്തിമ കരാർ',
    selectContractType: 'കരാർ തരം തിരഞ്ഞെടുക്കുക:',
    startVoiceBtn: 'വോയ്സ് റെക്കോർഡിംഗ് ആരംഭിക്കുക',
    listeningBtn: 'ശ്രദ്ധിക്കുന്നു... (നിർത്താൻ ക്ലിക്ക് ചെയ്യുക)',
    insertSampleVoice: 'മാതൃകാ വോയ്സ് നൽകുക',
    spokenTermsLabel: 'സംസാരിച്ച വ്യവസ്ഥകൾ (മാറ്റം വരുത്താവുന്നത്):',
    extractTermsBtn: 'വിവരങ്ങൾ എടുത്ത് ഫോം കാണുക',
    reviewFieldsTitle: 'വിവരങ്ങൾ പരിശോധിച്ച് സ്ഥിരീകരിക്കുക',
    reviewFieldsSub: 'ശബ്ദത്തിൽ നിന്ന് ലഭിച്ച വിവരങ്ങൾ ആവശ്യമെങ്കിൽ മാറ്റുക.',
    generateAgreementBtn: 'കരാറും മലയാള സംഗ്രഹവും ഉണ്ടാക്കുക',
    formalLegalTitle: 'നിയമപരമായ കരാർ (ഇംഗ്ലീഷ്)',
    plainRegionalSummaryTitle: 'ലളിതമായ മലയാള സംഗ്രഹം',
    copyEnglishBtn: 'ഇംഗ്ലീഷ് കരാർ പകർപ്പുക',
    copyRegionalBtn: 'മലയാള സംഗ്രഹം പകർപ്പുക',
    draftAnotherBtn: 'മറ്റൊന്ന് തയ്യാറാക്കുക',

    navEyebrow: 'നിയമ നടപടിക്രമ വഴികാട്ടി',
    navHeadline: 'ഇന്ത്യൻ പൗരന്മാർക്കുള്ള ഘട്ടം ഘട്ടമായുള്ള നിയമ റോഡ്മാപ്പ്',
    navDescription: 'നിങ്ങളുടെ പ്രശ്നം വ്യക്തമാക്കുക. സർക്കാർ പോർട്ടലുകളുടെയും ഹെൽപ്പ് ലൈനുകളുടെയും സഹായത്തോടെ പരിഹാരം നേടുക.',
    searchGrievancePlaceholder: "ഉദാ. 'UPI വഴി സൈബർ തട്ടിപ്പ് നടന്നു' അല്ലെങ്കിൽ 'ഉടമ ഡെപ്പോസിറ്റ് തിരികെ നൽകുന്നില്ല'...",
    getRoadmapBtn: 'റോഡ്മാപ്പ് നേടുക',
    commonGrievancesTitle: 'സാധാരണ പൗര പരാതികൾ:',
    applicableLawsTitle: 'ബാധകമായ ഇന്ത്യൻ നിയമങ്ങൾ:',
    goldenHourTitle: 'ഉടനടി ചെയ്യേണ്ട ഗോൾഡൻ അവർ നടപടി',
    stepperTitle: 'പരിഹാര ഘട്ടങ്ങൾ',
    docsNeeded: 'ആവശ്യമായ രേഖകൾ:',
    freeLegalAidTitle: 'ഭാരത സർക്കാരിന്റെ സൗജന്യ നിയമ സഹായം',

    recordsEyebrow: 'രേഖകളും ചരിത്രവും',
    recordsHeadline: 'നിങ്ങൾ സ്കാൻ ചെയ്ത കരാറുകളും തയ്യാറാക്കിയ കരടുകളും',
    recordsDesc: 'നിങ്ങളുടെ ബ്രൗസറിൽ സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു.',
    scannedContractsTab: 'സ്കാൻ ചെയ്ത കരാറുകൾ',
    voiceDraftsTab: 'വോയ്സ് ഡ്രാഫ്റ്റുകൾ',
    noScannedFound: 'സ്കാൻ ചെയ്ത കരാറുകളൊന്നും കണ്ടെത്തിയില്ല.',
    noDraftsFound: 'ഇതുവരെ കരടുകളൊന്നും ഉണ്ടാക്കിയിട്ടില്ല.',
    viewReportBtn: 'റിപ്പോർട്ട്',
    deleteBtn: 'ഒഴിവാക്കുക',

    footerMission: 'ഇന്ത്യൻ പൗരന്മാരെ അന്യായമായ കരാറുകളിൽ നിന്ന് സംരക്ഷിക്കുന്ന AI പ്ലാറ്റ്ഫോം.',
    emergencyHelplinesTitle: 'അടിയന്തര നിയമ സഹായ നമ്പറുകൾ (ഇന്ത്യ)',
    govPortalsTitle: 'സർക്കാർ പോർട്ടലുകൾ',
    disclaimerTitle: 'നിയമ അറിയിപ്പ്',
    disclaimerText: 'ലെക്സിഗാർഡ് നിയമപരമായ അവബോധത്തിനായുള്ള ഒരു ഉപകരണമാണ്. ഇത് ഒരു അഭിഭാഷകന്റെ പ്രാതിനിധ്യത്തിന് പകരമാവില്ല.',
  },

  pa: {
    navHome: 'ਹੋਮ',
    navScan: 'ਦਸਤਾਵੇਜ਼ ਸਕੈਨ ਕਰੋ',
    navChat: 'ਇਕਰਾਰਨਾਮੇ ਨਾਲ ਗੱਲਬਾਤ',
    navDrafter: 'ਆਵਾਜ਼ ਨਾਲ ਡਰਾਫਟ',
    navNavigator: 'ਕਾਨੂੰਨੀ ਮਾਰਗਦਰਸ਼ਕ',
    navHistory: 'ਰਿਕਾਰਡ',
    scanDocumentBtn: 'ਦਸਤਾਵੇਜ਼ ਸਕੈਨ ਕਰੋ',
    subBrandTitle: 'ਨਿਆਂ ਅਤੇ ਸੁਰੱਖਿਆ · AI ਇਕਰਾਰਨਾਮਾ ਵਿਸ਼ਲੇਸ਼ਣ',
    activeDocBadge: 'ਸਰਗਰਮ ਦਸਤਾਵੇਜ਼',
    voiceAiBadge: 'ਵੌਇਸ AI',

    heroEyebrow: 'ਹਰ ਭਾਰਤੀ ਨਾਗਰਿਕ ਲਈ AI ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ',
    heroHeadline1: 'ਸਕੈਨ ਕਰੋ. ਸਮਝੋ.',
    heroHeadlineHighlight: 'ਆਪਣੀ ਰੱਖਿਆ ਕਰੋ.',
    heroSubheadline: 'ਦਸਤਖਤ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇਕਰਾਰਨਾਮੇ ਦੀ ਹਰ ਸ਼ਰਤ ਨੂੰ ਸਮਝੋ — ਧੋਖਾਧੜੀ ਅਤੇ ਗੈਰ-ਕਾਨੂੰਨੀ ਸ਼ਰਤਾਂ ਤੋਂ ਬਚੋ।',
    heroDescription:
      'ਲੈਕਸੀਗਾਰਡ ਇੱਕ ਭਰੋਸੇਮੰਦ ਭਾਰਤੀ ਕਾਨੂੰਨੀ ਸਹਾਇਕ ਹੈ। ਕਿਰਾਇਆਨਾਮੇ, ਨੌਕਰੀ ਦੇ ਆਫਰ ਲੈਟਰ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ BNS 2023 ਨਾਲ ਮਿਲਾਓ।',
    dropContractPrompt: 'ਆਪਣਾ ਕਾਨੂੰਨੀ ਦਸਤਾਵੇਜ਼ ਇੱਥੇ ਰੱਖੋ, ਜਾਂ',
    dropContractSub: 'ਕਿਰਾਇਆਨਾਮਾ ਜਾਂ ਨੋਟਿਸ ਅਪਲੋਡ ਕਰੋ (PDF, ਫੋਟੋ, Word DOCX)',
    analyzeNowBtn: 'ਦਸਤਾਵੇਜ਼ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    instantTestPrompt: 'ਤੁਰੰਤ ਜਾਂਚ ਕਰੋ:',
    featuresTitle: 'ਸੰਪੂਰਨ ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ ਸੂਟ',
    featuresSubtitle: 'ਨਾਗਰਿਕਾਂ ਦੇ ਅਧਿਕਾਰਾਂ ਦੀ ਰਾਖੀ ਲਈ ਲੋੜੀਂਦੇ ਸਾਰੇ ਸਾਧਨ',

    featScannerTitle: 'ਦਸਤਾਵੇਜ਼ ਸਕੈਨਰ ਅਤੇ ਜੋਖਮ ਵਿਸ਼ਲੇਸ਼ਕ',
    featScannerDesc: 'ਇਕਰਾਰਨਾਮੇ ਦੀਆਂ ਸ਼ਰਤਾਂ ਦੀ ਜਾਂਚ ਅਤੇ ਗੈਰ-ਕਾਨੂੰਨੀ ਜੁਰਮਾਨਿਆਂ ਦੀ ਪਛਾਣ।',
    featScannerAction: 'ਇਕਰਾਰਨਾਮਾ ਸਕੈਨ ਕਰੋ',
    featDrafterTitle: 'ਆਵਾਜ਼ ਨਾਲ ਡਰਾਫਟ',
    featDrafterDesc: 'ਬੋਲ ਕੇ ਕਿਰਾਇਆਨਾਮਾ ਜਾਂ ਨੌਕਰੀ ਪੱਤਰ ਤਿਆਰ ਕਰੋ, ਸਰਲ ਪੰਜਾਬੀ ਸਾਰਾਂਸ਼ ਦੇ ਨਾਲ।',
    featDrafterAction: 'ਡਰਾਫਟ ਸ਼ੁਰੂ ਕਰੋ',
    featNavigatorTitle: 'ਕਾਨੂੰਨੀ ਪ੍ਰਕਿਰਿਆ ਮਾਰਗਦਰਸ਼ਕ',
    featNavigatorDesc: 'ਸਾਈਬਰ ਧੋਖਾਧੜੀ ਜਾਂ ਕਿਰਾਏ ਦੇ ਝਗੜੇ ਵਿੱਚ ਸਰਕਾਰੀ ਪੋਰਟਲ ਅਤੇ ਹੈਲਪਲਾਈਨਾਂ ਨਾਲ ਹੱਲ।',
    featNavigatorAction: 'ਮਾਰਗਦਰਸ਼ਕ ਦੇਖੋ',
    featChatTitle: 'ਇਕਰਾਰਨਾਮੇ ਨਾਲ ਗੱਲਬਾਤ (RAG)',
    featChatDesc: 'ਆਪਣੇ ਦਸਤਾਵੇਜ਼ ਅਤੇ ਭਾਰਤੀ ਕਾਨੂੰਨਾਂ ਦੇ ਆਧਾਰ ਤੇ ਸਵਾਲ ਪੁੱਛੋ।',
    featChatAction: 'ਸਵਾਲ ਪੁੱਛੋ',

    scanHeaderTitle: 'ਦਸਤਖਤ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣਾ ਇਕਰਾਰਨਾਮਾ ਸਕੈਨ ਕਰੋ',
    scanHeaderDesc: 'ਕਿਰਾਇਆਨਾਮਾ ਅਪਲੋਡ ਕਰਕੇ ਭਾਰਤੀ ਇਕਰਾਰਨਾਮਾ ਐਕਟ ਅਤੇ BNS 2023 ਤਹਿਤ ਜੋਖਮ ਦੀ ਜਾਂਚ ਕਰੋ।',
    uploadFileTab: 'ਫਾਈਲ ਅਪਲੋਡ ਕਰੋ (PDF / ਫੋਟੋ / DOCX)',
    pasteTextTab: 'ਟੈਕਸਟ ਪੇਸਟ ਕਰੋ',
    dragDropMain: 'ਦਸਤਾਵੇਜ਼ ਇੱਥੇ ਖਿੱਚੋ, ਜਾਂ',
    browseFiles: 'ਫਾਈਲਾਂ ਚੁਣੋ',
    supportedFormats: 'PDF, ਫੋਟੋਆਂ (PNG, JPG), Word (.DOCX) ਸਹਾਇਕ ਹਨ',
    pastePlaceholder: 'ਇੱਥੇ ਇਕਰਾਰਨਾਮੇ ਦੀ ਲਿਖਤ ਪੇਸਟ ਕਰੋ...',
    analyzePastedBtn: 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
    instantContractsTitle: 'ਤੁਰੰਤ ਜਾਂਚ: 1-ਕਲਿੱਕ ਭਾਰਤੀ ਕਾਨੂੰਨੀ ਇਕਰਾਰਨਾਮੇ',
    instantContractsSub: 'ਬਿਨਾਂ ਫਾਈਲ ਅਪਲੋਡ ਕੀਤੇ ਜਾਂਚਣ ਲਈ ਨਮੂਨਾ ਚੁਣੋ',
    overallRiskTitle: 'ਕੁੱਲ ਇਕਰਾਰਨਾਮਾ ਜੋਖਮ',
    executiveSummaryTitle: 'ਮੁੱਖ ਸਾਰਾਂਸ਼ (ਅੰਗਰੇਜ਼ੀ)',
    regionalSummaryTitle: 'ਦਸਤਾਵੇਜ਼ ਸਾਰਾਂਸ਼ (ਪੰਜਾਬੀ)',
    missingProtectionsTitle: 'ਗੈਰਹਾਜ਼ਰ ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ',
    tabRedFlags: 'ਖ਼ਤਰਨਾਕ ਸ਼ਰਤਾਂ (ਰੈੱਡ ਫਲੈਗ)',
    tabIpcBns: 'IPC → BNS 2023 ਧਾਰਾਵਾਂ',
    tabFavorable: 'ਲਾਭਕਾਰੀ ਸ਼ਰਤਾਂ',
    tabDocContent: 'ਦਸਤਾਵੇਜ਼ ਸਮੱਗਰੀ',
    statutoryBasis: 'ਕਾਨੂੰਨੀ ਆਧਾਰ:',
    whyProblematic: 'ਇਹ ਕਿਉਂ ਨੁਕਸਾਨਦੇਹ ਹੈ:',
    plainRegionalExpl: 'ਸਰਲ ਪੰਜਾਬੀ ਵਿੱਚ ਸਮਝੋ:',
    recommendedAction: 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਕਾਰਵਾਈ:',
    chatWithContractBtn: 'ਇਕਰਾਰਨਾਮੇ ਨਾਲ ਗੱਲਬਾਤ ਕਰੋ',
    printSavePdfBtn: 'ਪ੍ਰਿੰਟ / PDF ਸੰਭਾਲੋ',
    scanAnotherBtn: 'ਹੋਰ ਸਕੈਨ ਕਰੋ',

    escalationTitle: 'ਇਹ ਗੁੰਝਲਦਾਰ ਲੱਗਦਾ ਹੈ — ਮੁਫਤ ਕਾਨੂੰਨੀ ਮਦਦ ਲਵੋ',
    escalationDesc: 'ਇਸ ਇਕਰਾਰਨਾਮੇ ਵਿੱਚ ਖ਼ਤਰਨਾਕ ਗੈਰ-ਕਾਨੂੰਨੀ ਸ਼ਰਤਾਂ ਹਨ। ਦਸਤਖਤ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਟੈਲੀ-ਲਾਅ ਦੀ ਮਦਦ ਲਵੋ।',
    talkToExpertBtn: 'ਮੁਫਤ ਕਾਨੂੰਨੀ ਮਾਹਰ ਨਾਲ ਗੱਲ ਕਰੋ',
    teleLawHelpline: 'ਟੈਲੀ-ਲਾਅ ਟੋਲ-ਫ੍ਰੀ: 14416',
    nalsaHelpline: 'ਨਾਲਸਾ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ: 15100',

    drafterEyebrow: 'ਆਵਾਜ਼ ਨਾਲ ਡਰਾਫਟ · ਵੌਇਸ AI',
    drafterHeadline: 'ਆਪਣੀ ਆਵਾਜ਼ ਨਾਲ ਕਾਨੂੰਨੀ ਇਕਰਾਰਨਾਮੇ ਤਿਆਰ ਕਰੋ',
    drafterDesc: 'ਸ਼ਰਤਾਂ ਬੋਲੋ ਜਾਂ ਲਿਖੋ। ਲੈਕਸੀਗਾਰਡ ਪੂਰਾ ਇਕਰਾਰਨਾਮਾ ਅਤੇ ਪੰਜਾਬੀ ਸਾਰਾਂਸ਼ ਤਿਆਰ ਕਰੇਗਾ।',
    step1: '1. ਬੋਲੋ / ਲਿਖੋ',
    step2: '2. ਵੇਰਵੇ ਦੇਖੋ',
    step3: '3. ਅੰਤਿਮ ਇਕਰਾਰਨਾਮਾ',
    selectContractType: 'ਇਕਰਾਰਨਾਮੇ ਦੀ ਕਿਸਮ ਚੁਣੋ:',
    startVoiceBtn: 'ਆਵਾਜ਼ ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
    listeningBtn: 'ਸੁਣ ਰਿਹਾ ਹੈ... (ਰੋਕਣ ਲਈ ਕਲਿੱਕ ਕਰੋ)',
    insertSampleVoice: 'ਨਮੂਨਾ ਆਵਾਜ਼ ਪ੍ਰੋਂਪਟ ਪਾਓ',
    spokenTermsLabel: 'ਬੋਲੀਆਂ ਸ਼ਰਤਾਂ (ਸੋਧਣਯੋਗ):',
    extractTermsBtn: 'ਵੇਰਵੇ ਕੱਢੋ ਅਤੇ ਫਾਰਮ ਦੇਖੋ',
    reviewFieldsTitle: 'ਵੇਰਵਿਆਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ',
    reviewFieldsSub: 'ਆਪਣੀ ਆਵਾਜ਼ ਤੋਂ ਪ੍ਰਾਪਤ ਜਾਣਕਾਰੀ ਨੂੰ ਲੋੜ ਅਨੁਸਾਰ ਬਦਲੋ।',
    generateAgreementBtn: 'ਇਕਰਾਰਨਾਮਾ ਅਤੇ ਪੰਜਾਬੀ ਸਾਰਾਂਸ਼ ਬਣਾਓ',
    formalLegalTitle: 'ਕਾਨੂੰਨੀ ਇਕਰਾਰਨਾਮਾ (ਅੰਗਰੇਜ਼ੀ)',
    plainRegionalSummaryTitle: 'ਸਰਲ ਪੰਜਾਬੀ ਸਾਰਾਂਸ਼',
    copyEnglishBtn: 'ਅੰਗਰੇਜ਼ੀ ਇਕਰਾਰਨਾਮਾ ਕਾਪੀ ਕਰੋ',
    copyRegionalBtn: 'ਪੰਜਾਬੀ ਸਾਰਾਂਸ਼ ਕਾਪੀ ਕਰੋ',
    draftAnotherBtn: 'ਨਵਾਂ ਡਰਾਫਟ ਬਣਾਓ',

    navEyebrow: 'ਕਾਨੂੰਨੀ ਪ੍ਰਕਿਰਿਆ ਮਾਰਗਦਰਸ਼ਕ',
    navHeadline: 'ਭਾਰਤੀ ਨਾਗਰਿਕਾਂ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਕਾਨੂੰਨੀ ਰੋਡਮੈਪ',
    navDescription: 'ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ। ਸਰਕਾਰੀ ਪੋਰਟਲ ਅਤੇ ਹੈਲਪਲਾਈਨਾਂ ਦੀ ਮਦਦ ਨਾਲ ਹੱਲ ਪ੍ਰਾਪਤ ਕਰੋ।',
    searchGrievancePlaceholder: "ਜਿਵੇਂ 'UPI ਰਾਹੀਂ ਸਾਈਬਰ ਧੋਖਾਧੜੀ ਹੋਈ' ਜਾਂ 'ਮਕਾਨ ਮਾਲਕ ਸਕਿਓਰਿਟੀ ਵਾਪਸ ਨਹੀਂ ਕਰ ਰਿਹਾ'...",
    getRoadmapBtn: 'ਰੋਡਮੈਪ ਪ੍ਰਾਪਤ ਕਰੋ',
    commonGrievancesTitle: 'ਆਮ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤਾਂ:',
    applicableLawsTitle: 'ਲਾਗੂ ਭਾਰਤੀ ਕਾਨੂੰਨ:',
    goldenHourTitle: 'ਤੁਰੰਤ ਗੋਲਡਨ ਆਵਰ ਕਾਰਵਾਈ',
    stepperTitle: 'ਹੱਲ ਦੇ ਕਦਮ',
    docsNeeded: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼:',
    freeLegalAidTitle: 'ਭਾਰਤ ਸਰਕਾਰ ਵੱਲੋਂ ਮੁਫਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ',

    recordsEyebrow: 'ਰਿਕਾਰਡ ਅਤੇ ਇਤਿਹਾਸ',
    recordsHeadline: 'ਤੁਹਾਡੇ ਸਕੈਨ ਕੀਤੇ ਇਕਰਾਰਨਾਮੇ ਅਤੇ ਤਿਆਰ ਡਰਾਫਟ',
    recordsDesc: 'ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਸਟੋਰ ਕੀਤੇ ਗਏ।',
    scannedContractsTab: 'ਸਕੈਨ ਕੀਤੇ ਇਕਰਾਰਨਾਮੇ',
    voiceDraftsTab: 'ਵੌਇਸ ਡਰਾਫਟ',
    noScannedFound: 'ਕੋਈ ਸਕੈਨ ਕੀਤਾ ਇਕਰਾਰਨਾਮਾ ਨਹੀਂ ਮਿਲਿਆ।',
    noDraftsFound: 'ਅਜੇ ਕੋਈ ਡਰਾਫਟ ਤਿਆਰ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।',
    viewReportBtn: 'ਰਿਪੋਰਟ',
    deleteBtn: 'ਮਿਟਾਓ',

    footerMission: 'ਭਾਰਤੀ ਨਾਗਰਿਕਾਂ ਨੂੰ ਅਣਉਚਿਤ ਇਕਰਾਰਨਾਮਿਆਂ ਤੋਂ ਬਚਾਉਣ ਵਾਲਾ AI ਪਲੇਟਫਾਰਮ।',
    emergencyHelplinesTitle: 'ਐਮਰਜੈਂਸੀ ਕਾਨੂੰਨੀ ਹੈਲਪਲਾਈਨਾਂ (ਭਾਰਤ)',
    govPortalsTitle: 'ਸਰਕਾਰੀ ਪੋਰਟਲ',
    disclaimerTitle: 'ਬੇਦਾਅਵਾ ਅਤੇ ਕਾਨੂੰਨੀ ਨੋਟਿਸ',
    disclaimerText: 'ਲੈਕਸੀਗਾਰਡ ਕਾਨੂੰਨੀ ਜਾਗਰੂਕਤਾ ਲਈ ਇੱਕ ਸਾਧਨ ਹੈ। ਇਹ ਵਕੀਲ ਦੀ ਨੁਮਾਇੰਦਗੀ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ।',
  },
};

const LANGUAGE_STORAGE_KEY = 'lexiguard_language_code_v2';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageOption: LanguageOption;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
      if (stored && TRANSLATIONS[stored]) {
        return stored;
      }
    } catch (e) {}
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {}
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageOption,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
