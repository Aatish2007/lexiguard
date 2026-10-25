import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { DocumentScanner } from './components/DocumentScanner';
import { ContractChat } from './components/ContractChat';
import { VoiceContractDrafter } from './components/VoiceContractDrafter';
import { LegalNavigator } from './components/LegalNavigator';
import { RecordsHistory } from './components/RecordsHistory';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentAnalysisResult } from './types/legal';
import { SampleContract } from './data/sampleContracts';
import { getAnalyzedDocuments } from './utils/historyStorage';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [pendingSample, setPendingSample] = useState<SampleContract | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<DocumentAnalysisResult | null>(() => {
    const existing = getAnalyzedDocuments();
    return existing.length > 0 ? existing[0] : null;
  });

  // Handle direct sample selection from Home
  const handleSelectSampleFromHome = (sample: SampleContract) => {
    setPendingSample(sample);
    setActiveTab('scanner');
  };

  const handleOpenChat = (doc: DocumentAnalysisResult) => {
    setCurrentAnalysis(doc);
    setActiveTab('chat');
  };

  // 1. Initial auth loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3EC] text-[#14213D] p-4">
        <div className="flex flex-col items-center space-y-3">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#14213D]">
            LexiGuard
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-[#C8372D]">
            Verifying Authentication Session...
          </p>
          <div className="w-8 h-8 border-2 border-[#14213D] border-t-transparent rounded-full animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // 2. Route protection: If no active session, show Login / Sign up page
  if (!user) {
    return <AuthPage />;
  }

  // 3. Authenticated main application view
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] text-[#14213D]">
      {/* Top Website Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveDocument={!!currentAnalysis}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'home' && (
          <HomeHero
            onScanClick={() => setActiveTab('scanner')}
            onSelectSample={handleSelectSampleFromHome}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'scanner' && (
          <DocumentScanner
            currentAnalysis={currentAnalysis}
            setCurrentAnalysis={setCurrentAnalysis}
            onOpenChat={handleOpenChat}
            initialSample={pendingSample}
            onClearInitialSample={() => setPendingSample(null)}
          />
        )}

        {activeTab === 'chat' && (
          <ContractChat
            activeDocument={currentAnalysis}
            onSelectDocument={(doc) => setCurrentAnalysis(doc)}
            onNavigateToScan={() => setActiveTab('scanner')}
          />
        )}

        {activeTab === 'drafter' && <VoiceContractDrafter />}

        {activeTab === 'navigator' && <LegalNavigator />}

        {activeTab === 'history' && (
          <RecordsHistory
            onViewDocument={(doc) => {
              setCurrentAnalysis(doc);
              setActiveTab('scanner');
            }}
            onChatDocument={(doc) => {
              setCurrentAnalysis(doc);
              setActiveTab('chat');
            }}
          />
        )}
      </main>

      {/* Standard Website Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
