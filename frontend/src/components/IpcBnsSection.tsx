import React from 'react';
import { IpcBnsMapping } from '../types/legal';
import { Scale } from 'lucide-react';

interface IpcBnsSectionProps {
  mappings: IpcBnsMapping[];
}

export const IpcBnsSection: React.FC<IpcBnsSectionProps> = ({ mappings }) => {
  if (!mappings || mappings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 shadow-none space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[#5F259F]/10 text-[#5F259F] flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-sans">
              Indian Penal Code (IPC) → Bharatiya Nyaya Sanhita (BNS 2023)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Statutory cross-reference for penal offenses relevant to contract fraud or disputes
            </p>
          </div>
        </div>
        <div className="inline-flex items-center pl-2 border-l-2 border-slate-300">
          <span className="text-xs font-medium text-slate-600 tabular-nums">
            {mappings.length} Provisions Mapped
          </span>
        </div>
      </div>

      {/* Small Bordered Table instead of chips */}
      <div className="overflow-x-auto border border-slate-200 rounded-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-medium">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">Old IPC</th>
              <th className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">New BNS</th>
              <th className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">Bailable</th>
              <th className="py-2.5 px-3 font-medium text-slate-700">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {mappings.map((item, idx) => {
              const isNonBailable = item.bailable?.toLowerCase().includes('non-bailable');
              const bailableColor = isNonBailable ? '#B42318' : '#2F6B4F';

              return (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-700 whitespace-nowrap align-top">
                    <span className="line-through opacity-70">{item.old_ipc_section}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap align-top">
                    {item.new_bns_section}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap align-top">
                    <div
                      className="inline-flex items-center pl-2 border-l-2"
                      style={{ borderColor: bailableColor }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{ color: bailableColor }}
                      >
                        {item.bailable}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 align-top space-y-1">
                    <div className="font-semibold text-slate-900">
                      {item.title}
                    </div>
                    {item.applicability_context && (
                      <div className="text-slate-600 leading-relaxed font-sans">
                        {item.applicability_context}
                      </div>
                    )}
                    {item.punishment && (
                      <div className="text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">Punishment: </span>
                        {item.punishment}
                      </div>
                    )}
                    {item.hindi_explanation && (
                      <div className="text-xs text-amber-950 bg-amber-50/70 border border-amber-200/80 rounded-md p-2 font-hindi mt-1.5 leading-relaxed">
                        <span className="font-medium text-amber-900 block mb-0.5">हिंदी में अर्थ:</span>
                        {item.hindi_explanation}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
