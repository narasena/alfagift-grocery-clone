import * as React from 'react';

export const useProductQuantity = () => {
    const [quantity, setQuantity] = React.useState<number>(1);

    const handleQuantityChange = (action: "plus" | "minus") => {
      switch (action) {
        case "plus":
          setQuantity(quantity + 1);
          break;
        case "minus":
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
          break;
      }
    };

    return {
        quantity,
        setQuantity,
        handleQuantityChange
    }
}