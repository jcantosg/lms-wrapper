import { formatMoodleNames } from '#shared/domain/lib/format-moodle-names';

describe('String With NBSP Unit Test', () => {
  it('should return a string without spaces', () => {
    const expected = 'JoseMaria';
    const stringWithSpaces = '   Jose&nbspMaria ';
    expect(formatMoodleNames(stringWithSpaces)).toEqual(expected);
  });

  it('should return the same string', () => {
    const expected = 'JoseMaria';
    expect(formatMoodleNames(expected)).toEqual(expected);
  });
});
