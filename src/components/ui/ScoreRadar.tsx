"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ScoreRadarProps {
  categoryScores?: {
    skills?: number;
    experience?: number;
    industry?: number;
    job_title?: number;
    academic_fit?: number;
  };
  overallScore: number;
}

export function ScoreRadar({ categoryScores, overallScore }: ScoreRadarProps) {
  // Fallback data for older candidates that don't have category_scores
  // Distribute the overall score with slight variations
  const fallbackScore = overallScore || 50;
  
  const data = [
    { subject: 'Skills', A: categoryScores?.skills || Math.min(100, fallbackScore + 5), fullMark: 100 },
    { subject: 'Erfahrung', A: categoryScores?.experience || Math.max(0, fallbackScore - 10), fullMark: 100 },
    { subject: 'Branche', A: categoryScores?.industry || fallbackScore, fullMark: 100 },
    { subject: 'Titel', A: categoryScores?.job_title || fallbackScore, fullMark: 100 },
    { subject: 'Akademisch', A: categoryScores?.academic_fit || Math.max(0, fallbackScore - 5), fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded shadow-md border border-border text-sm font-bold text-text-main">
          {payload[0].payload.subject}: <span className="text-primary">{payload[0].value}%</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 'bold' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={3}
            fill="#0ea5e9"
            fillOpacity={0.3}
            dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0284c7' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
