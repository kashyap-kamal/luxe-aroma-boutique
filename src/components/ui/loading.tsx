import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "md",
  text = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    </div>
  );
};

// Skeleton components for better loading experience
export const ProductCardSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const TestimonialSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-lg p-8">
    <div className="flex items-center justify-center mb-6">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex justify-center mb-4">
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
    <div className="text-center">
      <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
    </div>
  </div>
);

export const WhyChooseUsSkeleton: React.FC = () => (
  <div className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="text-center p-6 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Loading;
