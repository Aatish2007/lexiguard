import { API } from '../lib/api';
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  FileText,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { DocumentAnalysisResult, ChatMessage } from '../types/legal';
import { getAnalyzedDocuments } from '../utils/historyStorage';
import { useLanguage } from '../utils/languages';

interface ContractChatProps {
  activeDocument: DocumentAnalysisResult | null;
  onSelectDocument: (doc: DocumentAnalysisResult) => void;
  onNavigateToScan: () => void;
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  'Can the other party terminate this agreement without 30 days written notice?',
  'Is the arbitrary security deposit forfeiture clause legally enforceable?',
  'Does the non-compete covenant violate Section 27 of the Indian Contract Act?',
  'What specific amendments should I negotiate before signing?',
  'सरल हिंदी में बताएं: अगर कोई विवाद हो जाए तो क्या करना चाहिए?',
];

export const ContractChat: React.FC<ContractChatProps> = ({
  activeDocument,
  onSelectDocument,
  onNavigateToScan,
}) => {
  const { t, language, currentLanguageOption } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allDocs, setAllDocs] = useState<DocumentAnalysisResult[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const docs = getAnalyzedDocuments();
    setAllDocs(docs);

    if (activeDocument) {
      setMessages([
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: `Inquiry session initiated for "${activeDocument.document_name || activeDocument.document_type}" (Risk Index: ${activeDocument.risk_score}/100).\n\nYou can query specific clauses, statutory compliance under the Indian Contract Act 1872, tenancy protections, or BNS 2023 implications. Answers and plain summaries will also be provided in ${currentLanguageOption.nativeName} (${currentLanguageOption.englishName}).`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [activeDocument, language, currentLanguageOption]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputText).trim();
    if (!q || !activeDocument || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API}/api/chat-contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContext: {
            title: activeDocument.document_name,
            type: activeDocument.document_type,
            riskScore: activeDocument.risk_score,
            summary: activeDocument.document_summary,
            redFlags: activeDocument.red_flags,
            favorableClauses: activeDocument.favorable_clauses,
            snippet: activeDocument.extracted_text_snippet,
          },
          chatHistory: historyPayload,
          question: q,
          targetLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to consult legal inquiry engine.');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response returned from legal engine.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `Notice: ${err.message || 'Unable to consult legal engine. Please retry.'}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If no document is selected
  if (!activeDocument) {
    return (
      <div className="bg-white rounded border border-[#D8D0C3] p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-[0_1px_3px_rgba(20,33,61,0.03)]">
        <div className="w-12 h-12 rounded bg-[#FAF8F5] border border-[#D8D0C3] text-[#14213D] flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14213D]">
            No Active Deed Selected
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5366] max-w-md mx-auto leading-relaxed">
            Examine or select an agreement first. LexiGuard grounds inquiries directly in your uploaded text and codified Indian statutes.
          </p>
        </div>

        {allDocs.length > 0 && (
          <div className="pt-2 text-left space-y-2.5">
            <h3 className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#767E8E]">
              Previously Examined Deeds:
            </h3>
            <div className="space-y-2">
              {allDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="p-3 rounded border border-[#D8D0C3] hover:border-[#14213D] bg-[#FAF8F5] hover:bg-white cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#14213D]" />
                    <span className="text-xs font-semibold text-[#14213D]">
                      {doc.document_name || doc.document_type}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-[#D8D0C3] text-[#14213D]">
                    Risk {doc.risk_score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onNavigateToScan}
            className="px-5 py-2.5 bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] text-xs font-semibold rounded border border-[#14213D] transition-colors cursor-pointer"
          >
            Examine an Agreement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-[#D8D0C3] shadow-[0_1px_3px_rgba(20,33,61,0.03)] flex flex-col h-[720px] overflow-hidden text-left">
      {/* Top Document Docket Bar */}
      <div className="p-4 sm:px-6 border-b border-[#E2DBD0] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#14213D] text-[#FAF8F5] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-[#E2DBD0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#767E8E]">
                Deed Docket:
              </span>
              <span className="font-serif text-sm font-bold text-[#14213D] truncate max-w-xs sm:max-w-md">
                {activeDocument.document_name || activeDocument.document_type}
              </span>
            </div>
            <p className="text-[11px] text-[#767E8E]">
              Grounded in Indian Contract Act 1872 · Consumer Protection Act 2019 · BNS 2023
            </p>
          </div>
        </div>

        {/* Change Document Dropdown if multiple exist */}
        {allDocs.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#767E8E] hidden sm:inline">Switch Deed:</span>
            <select
              value={activeDocument.id}
              onChange={(e) => {
                const target = allDocs.find((d) => d.id === e.target.value);
                if (target) onSelectDocument(target);
              }}
              className="text-xs font-medium bg-white border border-[#D8D0C3] rounded px-2.5 py-1 text-[#14213D] focus:outline-none focus:border-[#14213D]"
            >
              {allDocs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.document_name || d.document_type} (Risk {d.risk_score})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded bg-[#14213D] text-[#FAF8F5] shrink-0 flex items-center justify-center text-xs mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#E2DBD0]" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#14213D] text-[#FAF8F5] font-medium'
                    : 'bg-[#FAF8F5] text-[#14213D] border border-[#E2DBD0] whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded bg-[#FAF8F5] border border-[#D8D0C3] text-[#14213D] shrink-0 flex items-center justify-center text-xs mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#4A5366]" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center text-[#767E8E] text-xs py-2">
            <div className="w-7 h-7 rounded bg-[#14213D] text-[#FAF8F5] shrink-0 flex items-center justify-center text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E2DBD0]" />
            </div>
            <div className="bg-[#FAF8F5] border border-[#E2DBD0] p-2.5 rounded text-xs text-[#4A5366]">
              Consulting statutory provisions and cross-referencing covenants...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Question Chips */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#FAF8F5] border-t border-[#E2DBD0]">
        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#767E8E] block mb-1.5">
          Suggested Inquiries:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DEFAULT_SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs bg-white hover:bg-[#EAE4D9] text-[#14213D] font-medium px-2.5 py-1 rounded border border-[#D8D0C3] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 sm:p-5 border-t border-[#E2DBD0] bg-white">
        <div className="relative flex items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about notice periods, deposit refunds, penalties, or arbitration in English or Hindi..."
            rows={1}
            disabled={isLoading}
            className="w-full resize-none py-2.5 pl-3.5 pr-12 rounded border border-[#C9C0B3] bg-[#FAF8F5] text-xs sm:text-sm text-[#14213D] focus:outline-none focus:border-[#14213D]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-1.5 rounded bg-[#14213D] hover:bg-[#203154] text-[#FAF8F5] disabled:opacity-40 transition-colors cursor-pointer"
            aria-label="Send inquiry"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#767E8E]">
          <span>Press Enter to send (Shift + Enter for new line)</span>
          <span>Indian Legal Intelligence · Awareness tool under Indian Legal Framework</span>
        </div>
      </div>
    </div>
  );
};
