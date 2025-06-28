import * as React from 'react';
import { HiUserGroup } from 'react-icons/hi';
import { RiAdminFill } from 'react-icons/ri';

export const useAdminsAdmin = () => {
    const tabHeaders = [
        {
            label: "Admins",
            key: "admins",
            icon: <RiAdminFill />
        },
        {
            label: "Users",
            key: "users",
            icon: <HiUserGroup />
        }
    ]
    const [activeTab, setActiveTab] = React.useState<(typeof tabHeaders)[number]["key"]>("admins");


    return {
        activeTab,
        setActiveTab,
        tabHeaders,
    }
}