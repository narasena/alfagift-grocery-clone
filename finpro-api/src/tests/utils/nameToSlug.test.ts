import nameToSlug from "../../utils/nameToSlug";

describe("nameToSlug", () => {
  it("should convert spaces to hyphens and convert to lowercase", () => {
    expect(nameToSlug("Hello World")).toBe("hello-world");
  });

  it("should handle multiple spaces correctly", () => {
    expect(nameToSlug("  Hello   World  ")).toBe("hello---world"); // Note: current implementation keeps multiple hyphens
  });

  it("should trim leading and trailing spaces", () => {
    expect(nameToSlug("  Test String  ")).toBe("test-string");
  });

  it("should return an empty string for an empty input", () => {
    expect(nameToSlug("")).toBe("");
  });

  it("should handle strings with only spaces", () => {
    expect(nameToSlug("   ")).toBe("");
  });

  it("should handle special characters by keeping them as is", () => {
    expect(nameToSlug("Product Name!@#$")).toBe("product-name!@#$");
  });
});
