import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Loader2,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { StartupData } from '../types';

interface TeamProps {
  data: StartupData;
  onDeepDive: () => void;
  isLoading?: boolean;
}

export function Team({ data, onDeepDive, isLoading }: TeamProps) {
  const hasDeepDiveData = data.teamDetails && data.teamDetails.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Executive Team</h2>
          <p className="text-white/40">
            {hasDeepDiveData ? 'Detailed backgrounds and career history' : 'Key leadership information'}
          </p>
        </div>

        {!hasDeepDiveData && (
          <button
            onClick={onDeepDive}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm flex items-center gap-2 hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Deep Dive
              </>
            )}
          </button>
        )}
      </div>

      {/* Team Members */}
      {hasDeepDiveData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.teamDetails!.map((member) => (
            <div
              key={member.name}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.07] transition-colors"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-2xl font-bold text-cyan-400">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-white/40" />
                        </a>
                      )}
                    </div>
                    <p className="text-cyan-400 font-medium">{member.role}</p>
                  </div>
                </div>
              </div>

              {/* Career History */}
              <div className="p-6 space-y-4">
                {/* Previous Roles */}
                {member.previousRoles.length > 0 && (
                  <div>
                    <h4 className="text-sm text-white/40 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Career History
                    </h4>
                    <div className="space-y-2">
                      {member.previousRoles.map((role, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold">
                            {role.company.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{role.role}</p>
                            <p className="text-sm text-white/50">{role.company}</p>
                          </div>
                          <span className="text-xs text-white/30">{role.years}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {member.education.length > 0 && (
                  <div>
                    <h4 className="text-sm text-white/40 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Education
                    </h4>
                    <div className="space-y-2">
                      {member.education.map((edu, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="font-medium">{edu.degree}</p>
                            <p className="text-sm text-white/50">{edu.institution}</p>
                          </div>
                          <span className="text-xs text-white/30">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Highlights */}
                {member.highlights.length > 0 && (
                  <div>
                    <h4 className="text-sm text-white/40 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Notable Highlights
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Deep Dive Data */
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Discover the Leadership Team</h3>
          <p className="text-white/40 mb-4 max-w-md mx-auto">
            Click "Deep Dive" to unlock detailed executive profiles including career history, education, board seats, and notable achievements.
          </p>
          <button
            onClick={onDeepDive}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Unlock Team Details
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Team Stats */}
      {hasDeepDiveData && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-cyan-400">{data.teamDetails!.length}</p>
            <p className="text-sm text-white/40">Executives Profiled</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-violet-400">
              {data.teamDetails!.reduce((acc, m) => acc + m.previousRoles.length, 0)}
            </p>
            <p className="text-sm text-white/40">Previous Roles</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-amber-400">
              {data.teamDetails!.reduce((acc, m) => acc + m.highlights.length, 0)}
            </p>
            <p className="text-sm text-white/40">Notable Achievements</p>
          </div>
        </div>
      )}
    </div>
  );
}
