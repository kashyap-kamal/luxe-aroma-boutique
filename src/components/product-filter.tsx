import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption, getSortingOptions } from "@/lib/mock-data";
import { categoryNameMap } from "@/lib/utils";
import { X } from "lucide-react";

const SCENT_FAMILIES = [
  { label: "Fresh & Citrus", tag: "fresh" },
  { label: "Aquatic", tag: "aquatic" },
  { label: "Woody", tag: "woody" },
  { label: "Floral", tag: "floral" },
  { label: "Sweet", tag: "sweet" },
  { label: "Oriental", tag: "oriental" },
  { label: "Oud", tag: "oud" },
  { label: "Spicy", tag: "spicy" },
];

const OCCASIONS = [
  { label: "Office Wear", tag: "office-wear" },
  { label: "Date Night", tag: "date-night" },
  { label: "Everyday", tag: "everyday-fresh" },
  { label: "Evening Out", tag: "evening" },
];

interface FilterProps {
  categories: string[];
  selectedCategory: string;
  selectedTag: string;
  priceRange: [number, number];
  maxPrice: number;
  sortBy: SortOption;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const Chip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-sans text-xs font-medium transition-all duration-150 border"
    style={
      active
        ? { background: "#2d3435", color: "#f9f9f9", borderColor: "#2d3435" }
        : { background: "transparent", color: "#5c5b5b", borderColor: "#d4d0cb" }
    }
  >
    {label}
    {active && <X className="h-3 w-3 ml-0.5" strokeWidth={2.5} />}
  </button>
);

const ProductFilter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  selectedTag,
  priceRange,
  maxPrice,
  sortBy,
  onCategoryChange,
  onTagChange,
  onPriceChange,
  onSortChange,
  onReset,
}) => {
  const sortingOptions = getSortingOptions();

  const handleTagClick = (tag: string) => {
    onTagChange(selectedTag === tag ? "" : tag);
  };

  const hasActiveFilters =
    selectedCategory || selectedTag || sortBy !== "default" ||
    priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            label="All"
            active={selectedCategory === ""}
            onClick={() => onCategoryChange("")}
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={categoryNameMap(cat)}
              active={selectedCategory === cat}
              onClick={() => onCategoryChange(selectedCategory === cat ? "" : cat)}
            />
          ))}
        </div>
      </div>

      {/* Scent Family */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
          Scent Family
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENT_FAMILIES.map(({ label, tag }) => (
            <Chip
              key={tag}
              label={label}
              active={selectedTag === tag}
              onClick={() => handleTagClick(tag)}
            />
          ))}
        </div>
      </div>

      {/* Occasion / Mood */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
          Occasion
        </p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map(({ label, tag }) => (
            <Chip
              key={tag}
              label={label}
              active={selectedTag === tag}
              onClick={() => handleTagClick(tag)}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
          Price Range
        </p>
        <Slider
          value={priceRange}
          min={0}
          max={maxPrice || 1000}
          step={100}
          onValueChange={(v) => onPriceChange(v as [number, number])}
          className="my-4"
        />
        <div className="flex justify-between font-sans text-xs" style={{ color: "#5c5b5b" }}>
          <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: "#7f7663" }}>
          Sort By
        </p>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="font-sans text-sm">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            {sortingOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="font-sans text-sm">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full py-2.5 font-sans text-xs font-medium uppercase tracking-widest transition-colors border rounded"
          style={{ color: "#5c5b5b", borderColor: "#d4d0cb" }}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default ProductFilter;
