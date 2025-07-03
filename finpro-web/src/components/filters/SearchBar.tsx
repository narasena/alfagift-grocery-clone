import * as React from "react";
import { LuSearch } from "react-icons/lu";

export interface ISearchBarProps {
    value: string;
  onChange: (value: string) => void;
}

export default function SearchBar(props: ISearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is handled by the parent component's debounced search
  };

  return (
    <form className="max-w-md w-[300px]" onSubmit={handleSubmit}>
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <LuSearch />
        </div>
        <input
          type="search"
          id="default-search"
          value={props.value}
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Product Name"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="md:hidden text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
