import apiInstance from "@/utils/api/apiInstance";

// load cart items from the database

export const handleGetCartItems = async (token:string) => {
  // console.log(token);

  const cartItems = await apiInstance.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return cartItems;
};
