import { stringWithoutWhitespaces } from '#shared/domain/lib/string-without-whitespaces';

describe('String Without Spaces Service Unit Test', () => {
  it('should return a string without spaces', () => {
    const expected = 'JoseMaria';
    const stringWithSpaces = '   Jose    Maria ';
    expect(stringWithoutWhitespaces(stringWithSpaces)).toEqual(expected);
  });

  it('should return the same string', () => {
    const expected = 'JoseMaria';
    expect(stringWithoutWhitespaces(expected)).toEqual(expected);
  });
});
