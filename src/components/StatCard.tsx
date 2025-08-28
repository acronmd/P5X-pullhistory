import React from 'react';
import '@/colors.css';

type StatCardProps = {
    label: string;
    sublabel?: React.ReactNode;
    value: number | string;
    bg?: string;
    className?: string;
};

const StatCard: React.FC<StatCardProps> = ({
       label,
       sublabel,
       value,
       bg = 'bg-gray-100',
       className = '',
   }) => (
    <div className={`rounded-xl ${bg} p-4 shadow-sm ${className}`}>
        <div className="flex items-center justify-between h-full">
            {/* Label section */}
            <div className="flex flex-col justify-center text-left">
                <p className="text-lg font-bold text-foreground">{label}</p>
                {sublabel && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        {sublabel}
                    </div>
                )}
            </div>

            {/* Value */}
            <p className="text-3xl font-bold text-foreground text-right">
                {typeof value === 'number' && value >= 0 ? value.toLocaleString() : 'N/A'}
            </p>
        </div>
    </div>
);


export default StatCard;
