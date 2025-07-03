import * as React from 'react';
import { useAdminDashboardNavItems } from '../hooks/useAdminDashboardNavItems';
import Link from 'next/link';
import { HiDotsHorizontal } from 'react-icons/hi';

export default function AdminBottonNavBar() {
    const {sideNav, pathName} = useAdminDashboardNavItems();
    const [showMore, setShowMore] = React.useState(false);
    
    // Main 5 nav items
    const mainNavItems = [
        sideNav.find(item => item.name === "Reports"),
        sideNav.find(item => item.name === "Store"),
        sideNav.find(item => item.name === "Products"),
        sideNav.find(item => item.name === "Inventories"),
        sideNav.find(item => item.name === "Admin")
    ].filter(Boolean);
    
    // Remaining nav items
    const moreNavItems = sideNav.filter(item => 
        !mainNavItems.some(mainItem => mainItem?.name === item.name)
    );
    
    return (
        <>
            {/* More items dropdown */}
            {showMore && (
                <div className="lg:hidden fixed bottom-20 left-0 w-full bg-red-600 z-30 border-t border-red-500">
                    <div className="grid grid-cols-3 gap-1 p-2">
                        {moreNavItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex flex-col items-center justify-center p-3 rounded text-white hover:bg-red-500 min-h-[60px] ${
                                    pathName.includes(item.href) || pathName === item.href ? "bg-red-400" : ""
                                }`}
                                onClick={() => setShowMore(false)}
                            >
                                <div className="text-xl flex items-center justify-center">{item.icon}</div>
                                <div className="text-xs mt-1 text-center">{item.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Main bottom nav */}
            <div className="lg:hidden w-full h-20 bg-red-700 fixed bottom-0 left-0 z-20 flex items-center justify-between">
                {mainNavItems.map((item, index) => (
                    <div
                        key={index}
                        className={`w-1/5 h-full flex flex-col items-center justify-center ${
                            !!pathName.includes(item?.href as string) || pathName === item?.href as string ? "bg-red-500" : ""
                        }`}
                    >
                        <Link href={item?.href as string} className="text-white text-sm font-medium flex flex-col items-center justify-center w-full h-full">
                            <div className="text-2xl flex items-center justify-center">{item?.icon}</div>
                            <div className="text-center mt-1">{item?.name}</div>
                        </Link>
                    </div>
                ))}
                
                {/* More button */}
                <div className="w-1/5 h-full flex flex-col items-center justify-center">
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className="text-white text-sm font-medium flex flex-col items-center justify-center w-full h-full"
                    >
                        <div className="text-3xl">
                            <HiDotsHorizontal className={showMore ? "rotate-90" : ""} />
                        </div>
                        <div>More</div>
                    </button>
                </div>
            </div>
            
            {/* Overlay to close more menu */}
            {showMore && (
                <div 
                    className="lg:hidden fixed inset-0 z-10" 
                    onClick={() => setShowMore(false)}
                />
            )}
        </>
    );
}
