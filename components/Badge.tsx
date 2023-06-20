import React from "react";

interface BadgeProps {
    children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
    return (
        <div className="mt-2 rounded-lg bg-blue-600 font-semibold text-gray-100
            transition-all hover:scale-110 px-1 py-1 sm:text-sm text-xs">
            {children}
        </div>
    );
};
