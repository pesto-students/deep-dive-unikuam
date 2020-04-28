import {
  abbreviateString
} from './abbreviateString';

describe('abbreviateString', () => {
  it('abbreviates the following strings', () => {
    expect(abbreviateString('Hacktober Fest')).toEqual('Hacktober F.');
    expect(abbreviateString('Leeroy Fitzgerald Jenkins')).toEqual('Leeroy J.');
    expect(abbreviateString('Some arbitrary string length here.')).toEqual('Some H.');
    expect(abbreviateString('Hello awesome, world!')).toEqual('Hello W.');
  });

  it('throws error on invalid parameters', () => {
    expect(() => abbreviateString(123)).toThrow();
    expect(() => abbreviateString([])).toThrow();
    expect(() => abbreviateString({})).toThrow();
    expect(() => abbreviateString(null)).toThrow();
    expect(() => abbreviateString()).toThrow();
    expect(() => abbreviateString('asc', ',', '..', 'qww')).toThrow();
  });

  it('should abbreviate single word if it is too long', () => {
    expect(abbreviateString('antidisestablishmentarianism')).toEqual('antidisestablis...');
    expect(abbreviateString('pneumonoultramicroscopicsilicovolcanoconiosis')).toEqual('pneumonoultrami...');
  });

  it('should return string as it is if no abbreviation is required', () => {
    expect(abbreviateString('Abc')).toEqual('Abc');
    expect(abbreviateString('Anshul')).toEqual('Anshul');
  });

  it('should abbreviates the following strings if containing multiple spaces or tabs', () => {
    expect(abbreviateString('Hacktober    Fest')).toEqual('Hacktober F.');
    expect(abbreviateString('Leeroy    Fitzgerald Jenkins')).toEqual('Leeroy J.');
    expect(abbreviateString('Some \t\t\tarbitrary \tstring   length here.')).toEqual('Some H.');
  });
});
