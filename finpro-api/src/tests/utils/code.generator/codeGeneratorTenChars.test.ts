import generateCodeTenChars from "../../../utils/code.generator/codeGeneratorTenChars";

describe('generateCodeTenChars', () => {
  it('should generate a 10-character string', () => {
    const code = generateCodeTenChars();
    expect(code).toHaveLength(10);
  });

  it('should generate a string containing only alphanumeric characters (0-9, A-Z)', () => {
    const code = generateCodeTenChars();
    expect(code).toMatch(/^[0-9A-Z]{10}$/);
  });

  it('should generate different codes on multiple calls (high probability)', () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateCodeTenChars());
    }
    expect(codes.size).toBe(1000);
  });
});
