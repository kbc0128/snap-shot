import { 
  Bot, 
  Globe, 
  Database,
  Clock,
  ExternalLink,
  FileText
} from 'lucide-react';
import type { Source } from '../types';

interface SourcesProps {
  sources: Source[];
}

export function Sources({ sources }: SourcesProps) {
  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'ai':
        return Bot;
      case 'web':
        return Globe;
      case 'pitchbook':
        return Database;
      default:
        return FileText;
    }
  };

  const getSourceColor = (type: Source['type']) => {
    switch (type) {
      case 'ai':
        return { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' };
      case 'web':
        return { bg: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' };
      case 'pitchbook':
        return { bg: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30', text: 'text-violet-400' };
      default:
        return { bg: 'from-white/10 to-white/5', border: 'border-white/20', text: 'text-white/60' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Sources & Attribution</h2>
        <p className="text-white/40">All data sources used in this analysis</p>
      </div>

      {/* Source Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-white/60">AI Sources</span>
          </div>
          <p className="text-2xl font-bold text-cyan-400">
            {sources.filter(s => s.type === 'ai').length}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-white/60">Web Sources</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {sources.filter(s => s.type === 'web').length}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-violet-400" />
            <span className="text-sm text-white/60">Pitchbook</span>
          </div>
          <p className="text-2xl font-bold text-violet-400">
            {sources.filter(s => s.type === 'pitchbook').length}
          </p>
        </div>
      </div>

      {/* Sources List */}
      {sources.length > 0 ? (
        <div className="space-y-4">
          {sources.map((source) => {
            const Icon = getSourceIcon(source.type);
            const colors = getSourceColor(source.type);
            
            return (
              <div
                key={source.id}
                className={`
                  p-5 rounded-xl border bg-gradient-to-br ${colors.bg} ${colors.border}
                  hover:border-opacity-50 transition-colors
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center ${colors.text}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{source.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          {source.model && (
                            <span className={`text-sm ${colors.text}`}>{source.model}</span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(source.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-white/40" />
                        </a>
                      )}
                    </div>
                    
                    {/* Data Points */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {source.dataPoints.map((point, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-black/20 rounded text-xs text-white/60"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 bg-white/5 border border-white/10 rounded-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-medium text-white/60 mb-2">No sources yet</h3>
          <p className="text-white/40 text-sm">
            Sources will appear here as data is gathered from AI models, web searches, and Pitchbook.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      {sources.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-sm text-amber-400/80">
            <strong>Note:</strong> AI-generated content should be verified. Web and Pitchbook data reflects information available at the time of query. Always cross-reference critical business decisions with primary sources.
          </p>
        </div>
      )}
    </div>
  );
}
