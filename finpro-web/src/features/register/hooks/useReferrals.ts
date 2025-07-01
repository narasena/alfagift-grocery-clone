import apiInstance from "@/utils/api/apiInstance";
import { AxiosError } from "axios";
import * as React from "react";
import { toast } from "react-toastify";

export const useReferrals = () => {
    const [referralCode, setReferralCode] = React.useState("");
    const [referralFound, setReferralFound] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleFindReferral = async (code: string) => {
        if (!code.trim()) {
            setReferralFound(false);
            return;
        }
        
        try {
            const response = await apiInstance.get("/referrals/find/" + code);
            console.log(response.data.referralCode);
            setReferralFound(true);
            toast.success(response.data.message);
        } catch (error) {
            const errorResponse = error as AxiosError<{ message: string }>;
            setReferralFound(false);
            toast.error(errorResponse.response?.data.message);
        }
    };
    
    const handleReferralOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setReferralCode(value);
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
            handleFindReferral(value);
        }, 500);
    };

  return {
    referralCode,
    checkReferral: handleReferralOnChange,
    referralFound
  };
};
