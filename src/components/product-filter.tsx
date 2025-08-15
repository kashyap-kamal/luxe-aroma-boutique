import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
}

const ProductFilter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  priceRange,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onReset,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            className="mr-2 mb-2"
            onClick={() => onCategoryChange("")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="mr-2 mb-2"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <Slider
          defaultValue={[0, maxPrice]}
          value={priceRange}
          min={0}
          max={maxPrice}
          step={100}
          onValueChange={(value) => onPriceChange(value as [number, number])}
          className="my-6"
        />
        <div className="flex justify-between">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
