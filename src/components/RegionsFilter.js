import React, { useEffect, useRef } from "react";

const RegionsFilter = ({ classes, regions, selectedRegions, onChange }) => {
  const bigCheckboxRef = useRef(null);

  // woark around Tailwind CSS forms not styling indeterminate checkboxes properly
  useEffect(() => {
    if (bigCheckboxRef.current && regions) {
      const bigCheckbox = bigCheckboxRef.current;
      const numSelected = selectedRegions.size;

      if (numSelected === 0 || numSelected === regions.length) {
        bigCheckbox.checked = numSelected === regions.length;
        bigCheckbox.style.appearance = "none";
        bigCheckbox.indeterminate = false;
      } else {
        bigCheckbox.checked = true;
        bigCheckbox.style.appearance = "checkbox";
        bigCheckbox.indeterminate = true;
      }
    }
  }, [bigCheckboxRef, regions, selectedRegions]);

  if (!regions) return null;

  return (
    <aside className={classes}>
      <label className="inline-flex items-center">
        <input
          ref={bigCheckboxRef}
          type="checkbox"
          className="form-checkbox border-2 border-green-600 text-green-600 hover:border-green-400 hover:text-green-400 mr-1"
          onChange={(e) => {
            const bigCheckbox = bigCheckboxRef.current;
            bigCheckbox.style.appearance = "none";
            bigCheckbox.indeterminate = false;
            onChange(e.target.checked ? new Set(regions) : new Set());
          }}
        />
        <span className="text-xl">Regions</span>
      </label>
      <ul className="text-sm mt-2 ml-2">
        {regions &&
          regions.map((region) => (
            <li key={region} className="-mt-0.5">
              <label className="inline-flex items-center my-0">
                <input
                  type="checkbox"
                  className="form-checkbox border-2 border-green-600 text-green-600 hover:border-green-400 hover:text-green-400 mr-1"
                  checked={selectedRegions.has(region)}
                  onChange={(e) => {
                    const newSelection = new Set(selectedRegions);
                    e.target.checked
                      ? newSelection.add(region)
                      : newSelection.delete(region);
                    onChange(newSelection);
                  }}
                />
                {region}
              </label>
            </li>
          ))}
      </ul>
    </aside>
  );
};

export default RegionsFilter;
