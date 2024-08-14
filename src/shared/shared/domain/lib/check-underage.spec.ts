import { checkUnderage } from '#shared/domain/lib/check-underage';

describe('Check Underage Unit Test', () => {
  it('should return true (underage)', () => {
    const underage = new Date(2010, 5, 12);
    expect(checkUnderage(underage)).toBeTruthy();
  });
  it('should return false (non-underage)', () => {
    const nonUnderage = new Date(1999, 4, 4);
    expect(checkUnderage(nonUnderage)).toBeFalsy();
  });
});
