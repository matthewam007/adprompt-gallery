import { brandInspirations, formats, industries } from "@/data/creatives";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import type { BrandInspiration, Format, Industry } from "@/types/creative";

export type Filters = {
  industry: "All" | Industry;
  format: "All" | Format;
  brand: "All" | BrandInspiration;
};

type FilterBarProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const selectIndustry = (industry: Filters["industry"]) => {
    trackEvent(analyticsEvents.clickedFilter, {
      filterType: "industry",
      filterValue: industry,
    });
    onChange({ ...filters, industry });
  };

  return (
    <div className="filters" id="gallery">
      <div className="category-rail" aria-label="Industry filters">
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            className={filters.industry === industry ? "active" : ""}
            onClick={() => selectIndustry(industry)}
          >
            {industry}
          </button>
        ))}
      </div>
      <div className="select-row">
        <Select
          label="Format"
          value={filters.format}
          options={formats}
          onChange={(format) => {
            trackEvent(analyticsEvents.clickedFilter, {
              filterType: "format",
              filterValue: format,
            });
            onChange({ ...filters, format: format as Filters["format"] });
          }}
        />
        <Select
          label="Brand"
          value={filters.brand}
          options={["All", ...brandInspirations]}
          onChange={(brand) => {
            trackEvent(analyticsEvents.clickedFilter, {
              filterType: "brand",
              filterValue: brand,
            });
            onChange({ ...filters, brand: brand as Filters["brand"] });
          }}
        />
      </div>
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
