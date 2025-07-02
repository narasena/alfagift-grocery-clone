import { useProductCategories } from "@/features/(user)/p/hooks/useProductCategories";
import Link from "next/link";
import * as React from "react";
import { BiCategory } from "react-icons/bi";


export default function SelectCategory() {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { productCategories, productSubCategories } = useProductCategories();

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 300);
  };

  const handleSelectCategoryClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div
      {...(isDesktop && {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      })}
      onBlur={() => setIsDropdownOpen(false)}
    >
      <div
        id="multiLevelDropdownButton"
        data-dropdown-toggle="multi-dropdown"
        className="md:text-white text-gray-800 md:bg-primary-700 md:hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center flex items-center gap-2"
        onClick={handleSelectCategoryClick}
        onBlur={() => setIsDropdownOpen(false)}
      >
        <BiCategory className="text-xl" />
        <span className="flex items-center">Kategori</span>
      </div>
      <div
        id="multi-dropdown"
        className={`z-50 ${
          isDropdownOpen ? "block" : "hidden"
        } bg-white divide-y divide-gray-100 rounded-lg md:w-44 sm:absolute md:top-16 shadow-md md:hover:block`}
        {...(isDesktop && {
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave
        })}
      >
        <ul className="py-2 text-sm text-gray-700 shadow-md" aria-labelledby="multiLevelDropdownButton">
          {productCategories.map((category, catIndex) => (
            <li key={catIndex} className={`relative ${isDesktop ? 'group' : ''}`}>
              <Link href={`/c/${category.slug}`} className="block px-4 py-2 hover:bg-gray-100 ">
                {category.name}
              </Link>

              <ul className={`absolute left-[-180px] mr-2 top-0 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-md py-2 text-sm text-gray-700 hidden ${isDesktop ? 'group-hover:block' : ''}`}>
                {productSubCategories
                  .filter((subCategory) => subCategory.productCategoryId === category.id)
                  .map((subCategory, subIndex) => (
                    <li key={subIndex}>
                      <Link href={`/c/${subCategory.slug}`} className="block px-4 py-2 hover:bg-gray-100 ">
                        {subCategory.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
