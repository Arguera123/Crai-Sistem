import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function DropdownExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("25 por página");

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
  };

  const options = ["10 por página", "15 por página", "30 por página"];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-40 px-4 py-2 bg-white hover:bg-gray-50"
      >
        <span>{selected}</span>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                selected === option ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
