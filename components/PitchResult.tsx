
import React from 'react';
import type { PitchData } from '../types';
import { LightBulbIcon, PresentationChartBarIcon, TagIcon, CurrencyDollarIcon, UserGroupIcon, RocketLaunchIcon } from './Icons';

interface PitchResultProps {
  data: PitchData;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-[#13111C]/60 border border-white/10 rounded-lg p-6 shadow-md backdrop-blur-sm transform transition-all duration-300 hover:bg-[#1E1C29]/80 hover:border-fuchsia-500/30 hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-fuchsia-500/10 p-2 rounded-full text-fuchsia-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);


const PitchResult: React.FC<PitchResultProps> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Your Business Pitch</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
            <InfoCard title="Elevator Pitch" icon={<RocketLaunchIcon className="w-6 h-6" />}>
                <p>{data.elevatorPitch}</p>
            </InfoCard>
        </div>
        
        <InfoCard title="Tagline" icon={<TagIcon className="w-6 h-6" />}>
            <p className="text-lg font-medium text-fuchsia-300 italic">"{data.tagline}"</p>
        </InfoCard>

        <InfoCard title="Value Proposition" icon={<LightBulbIcon className="w-6 h-6" />}>
            <p>{data.valueProposition}</p>
        </InfoCard>

        <div className="md:col-span-2">
            <InfoCard title="Key Slide Points" icon={<PresentationChartBarIcon className="w-6 h-6" />}>
                 <ul className="list-disc list-inside space-y-2 pl-2">
                    {data.slideBullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                    ))}
                </ul>
            </InfoCard>
        </div>

        <InfoCard title="Suggested Competitors" icon={<UserGroupIcon className="w-6 h-6" />}>
            <ul className="list-disc list-inside space-y-2 pl-2">
                {data.competitors.map((competitor, index) => (
                    <li key={index}>{competitor}</li>
                ))}
            </ul>
        </InfoCard>

        <InfoCard title="Possible Revenue Models" icon={<CurrencyDollarIcon className="w-6 h-6" />}>
            <ul className="list-disc list-inside space-y-2 pl-2">
                {data.revenueModels.map((model, index) => (
                    <li key={index}>{model}</li>
                ))}
            </ul>
        </InfoCard>
      </div>
    </div>
  );
};

export default PitchResult;