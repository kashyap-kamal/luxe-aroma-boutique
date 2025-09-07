import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption, getSortingOptions } from "@/lib/mock-data";

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  priceRange: [number, number];
  maxPrice: number;
  sortBy: SortOption;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const ProductFilter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  priceRange,
  maxPrice,
  sortBy,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onReset,
}) => {
  const sortingOptions = getSortingOptions();
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

      <div>
        <h3 className="text-lg font-medium mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select sorting option" />
          </SelectTrigger>
          <SelectContent>
            {sortingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
