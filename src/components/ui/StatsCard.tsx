interface StatsCardProps {
  label: string;
  value: string | number;
  subtext: string;
  trend?: string;
  icon: string;
  variant?: "primary" | "tertiary" | "secondary";
}

export function StatsCard({ label, value, subtext, trend, icon, variant = "primary" }: StatsCardProps) {
  const borderColors = {
    primary: "border-primary",
    tertiary: "border-tertiary",
    secondary: "border-secondary",
  };

  const textColors = {
    primary: "text-primary",
    tertiary: "text-tertiary",
    secondary: "text-on-surface",
  };

  const iconBaseColors = {
    primary: "text-primary/5",
    tertiary: "text-tertiary/5",
    secondary: "text-secondary/5",
  };

  return (
    <div className={`bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 ${borderColors[variant]} relative overflow-hidden group transition-all hover:shadow-md`}>
      <div className={`absolute -right-4 -bottom-4 ${iconBaseColors[variant]} scale-150 transform transition-transform group-hover:scale-[1.7]`}>
        <span className="material-symbols-outlined text-9xl">{icon}</span>
      </div>
      
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 font-manrope">{label}</p>
      
      <div className="flex items-baseline gap-2">
        <h3 className={`text-5xl font-extrabold ${textColors[variant]} font-manrope`}>{value}</h3>
        {trend && (
          <span className={`text-sm font-bold flex items-center ${trend.startsWith('+') || trend.includes('up') ? 'text-tertiary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-xs">arrow_upward</span> {trend}
          </span>
        )}
      </div>
      
      <p className="text-sm text-on-surface-variant mt-4 font-inter leading-relaxed">{subtext}</p>
    </div>
  );
}
