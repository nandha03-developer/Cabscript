"use client";
import { useEffect, useState } from "react";

interface StatItem {
  title: string;
  subtitle: string;
  value: number;
  suffix?: string;
}

const stats: StatItem[] = [
  { title: "Trusted by", subtitle: "Clients", value: 50, suffix: "+" },
  { title: "Startups & Entrepreneurs", subtitle: "Countries", value: 12, suffix: "+" },
  { title: "Secure code", subtitle: "Pay Once, Own Forever", value: 100, suffix: "%" },
  { title: "Customizable", subtitle: "Feature Rich Solution", value: 100, suffix: "%" },
];

export default function StatsSection() {
  const [progress, setProgress] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(stats.map((s) => s.value));
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-white py-20 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center">
            {/* Bold Heading on Top */}
            <h3 className="text-[#0F172A] font-extrabold text-lg mb-4">
              {stat.title}
            </h3>

            {/* Circular Progress Container */}
            <div className="relative w-56 h-56 mb-6 flex items-center justify-center">
              {/* Outer Thin Gray Border */}
              <div className="absolute inset-0 rounded-full border-[2px] border-gray-200"></div>

              {/* SVG Progress Circle */}
              <svg className="w-full h-full rotate-[-90deg]">
                {/* Background Circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="95"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Animated Progress Circle */}
                <circle
                  cx="112"
                  cy="112"
                  r="95"
                  stroke="#FACC15"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 95}
                  strokeDashoffset={
                    2 * Math.PI * 95 * (1 - progress[i] / 100)
                  }
                  strokeLinecap="round"
                  className="transition-all duration-[1500ms] ease-out"
                />
              </svg>

              {/* Center Value */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-yellow-500 font-bold text-3xl">
                  {stat.value}
                  {stat.suffix}
                </span>
              </div>
            </div>

            {/* Subtitle Below */}
            <p className="text-gray-700 font-semibold text-base">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
