import { renderHook, act } from "@testing-library/react";
import { useProductQuantity } from "./useProductQuantity";
import { useStockCheck } from "@/hooks/useStockCheck";

// Mock the useStockCheck hook
jest.mock("@/hooks/useStockCheck");

describe("useProductQuantity", () => {
  // Create a mock function for checkStock
  const mockCheckStock = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    mockCheckStock.mockClear();

    // Setup the mock implementation
    (useStockCheck as jest.Mock).mockReturnValue({
      checkStock: mockCheckStock,
      isChecking: false,
    });
  });

  it("should initialize with a quantity of 1", () => {
    const { result } = renderHook(() => useProductQuantity("prod-123", "store-123"));
    expect(result.current.quantity).toBe(1);
  });

  it("should increment quantity when handleQuantityChange('plus') is called and stock is available", async () => {
    // Mock a successful stock check
    mockCheckStock.mockResolvedValue({ isAvailable: true });

    const { result } = renderHook(() => useProductQuantity("prod-123", "store-123"));

    await act(async () => {
      await result.current.handleQuantityChange("plus");
    });

    expect(result.current.quantity).toBe(2);
    expect(mockCheckStock).toHaveBeenCalledWith("prod-123", "store-123", 2);
  });

  it("should not increment quantity if stock is not available", async () => {
    // Mock a failed stock check
    mockCheckStock.mockResolvedValue({ isAvailable: false });

    const { result } = renderHook(() => useProductQuantity("prod-123", "store-123"));

    await act(async () => {
      await result.current.handleQuantityChange("plus");
    });

    expect(result.current.quantity).toBe(1);
    expect(mockCheckStock).toHaveBeenCalledWith("prod-123", "store-123", 2);
  });

  it("should decrement quantity when handleQuantityChange('minus') is called", () => {
    const { result } = renderHook(() => useProductQuantity("prod-123", "store-123"));

    // First, set a quantity of 2 to be able to decrement
    act(() => {
      result.current.setQuantity(2);
    });

    act(() => {
      result.current.handleQuantityChange("minus");
    });

    expect(result.current.quantity).toBe(1);
  });

  it("should not decrement quantity below 1", () => {
    const { result } = renderHook(() => useProductQuantity("prod-123", "store-123"));

    act(() => {
      result.current.handleQuantityChange("minus");
    });

    expect(result.current.quantity).toBe(1);
  });

  it("should allow setting quantity directly", () => {
    const { result } = renderHook(() => useProductQuantity("prod-123", "store-123"));

    act(() => {
      result.current.setQuantity(10);
    });

    expect(result.current.quantity).toBe(10);
  });
});