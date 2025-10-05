import { describe, it, expect } from 'vitest';

describe('Blog Utilities', () => {
  it('should have test environment working', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle Chinese text correctly', () => {
    const text = '欢迎访问GoooIce的MiantuNet';
    expect(text).toContain('欢迎');
    expect(text).toContain('MiantuNet');
  });
});
