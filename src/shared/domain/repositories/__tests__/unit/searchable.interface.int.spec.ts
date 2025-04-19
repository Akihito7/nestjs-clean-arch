import { SearchParams, SearchResult } from "../../searchable.interface"

describe('Searchable Unit Tests', () => {
  describe('SearchParams', () => {

    describe('page', () => {
      it('deve ter valor padrão igual a 1', () => {
        const sut = new SearchParams();
        expect(sut.page).toBe(1);
      });

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '' as any, expected: 1 },
        { page: 'test' as any, expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      it.each(params)('deve normalizar page: $page para $expected', ({ page, expected }) => {
        expect(new SearchParams({ page }).page).toBe(expected);
      });
    });

    describe('perPage', () => {
      it('deve ter valor padrão igual a 15', () => {
        const sut = new SearchParams();
        expect(sut.perPage).toBe(15);
      });

      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '' as any, expected: 15 },
        { perPage: 'test' as any, expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 15, expected: 15 },
        { perPage: 20, expected: 20 },
        { perPage: 25, expected: 25 },
      ];

      it.each(params)('deve normalizar perPage: $perPage para $expected', ({ perPage, expected }) => {
        expect(new SearchParams({ perPage }).perPage).toBe(expected);
      });
    });

    describe('sort', () => {
      it('deve ter valor padrão igual a null', () => {
        const sut = new SearchParams();
        expect(sut.sort).toBeNull();
      });

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '' as any, expected: null },
        { sort: 'test' as any, expected: 'test' },
        { sort: 0, expected: null },
        { sort: -1, expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: null },
        { sort: {}, expected: '[object Object]' },
        { sort: 15, expected: '15' },
        { sort: 20, expected: '20' },
        { sort: 25, expected: '25' },
      ];

      it.each(params)('deve normalizar sort: $sort para $expected', ({ sort, expected }) => {
        expect(new SearchParams({ sort }).sort).toBe(expected);
      });
    });

    describe('sortDir', () => {
      it('deve ser null quando sort for falsy', () => {
        expect(new SearchParams().sortDir).toBeNull();
        expect(new SearchParams({ sort: null }).sortDir).toBeNull();
        expect(new SearchParams({ sort: undefined }).sortDir).toBeNull();
        expect(new SearchParams({ sort: '' }).sortDir).toBeNull();
      });

      const params = [
        { sortDir: null as any, expected: 'DESC' },
        { sortDir: undefined as any, expected: 'DESC' },
        { sortDir: '' as any, expected: 'DESC' },
        { sortDir: 'test' as any, expected: 'DESC' },
        { sortDir: 0, expected: 'DESC' },
        { sortDir: -1, expected: 'DESC' },
        { sortDir: 5.5, expected: 'DESC' },
        { sortDir: true, expected: 'DESC' },
        { sortDir: false, expected: 'DESC' },
        { sortDir: 'ASC', expected: 'ASC' },
        { sortDir: 'DESC', expected: 'DESC' },
      ];

      it.each(params)('deve normalizar sortDir: $sortDir para $expected quando sort é definido', ({ sortDir, expected }) => {
        expect(new SearchParams({ sort: 'any', sortDir }).sortDir).toBe(expected);
      });
    });

    describe('filter', () => {
      it('deve retornar null por padrão', () => {
        const sut = new SearchParams();
        expect(sut.filter).toBeNull();
      });

      it('deve retornar valor passado se for válido', () => {
        const sut = new SearchParams({ filter: 'name' });
        expect(sut.filter).toBe('name');
      });

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '' as any, expected: null },
        { filter: 'test' as any, expected: 'test' },
        { filter: 0, expected: null },
        { filter: -1, expected: '-1' },
        { filter: 5.5, expected: '5.5' },
        { filter: true, expected: 'true' },
        { filter: false, expected: null },
        { filter: 'ASC', expected: 'ASC' },
        { filter: 'DESC', expected: 'DESC' },
      ];

      it.each(params)('deve normalizar filter: $filter para $expected', ({ filter, expected }) => {
        expect(new SearchParams({ filter }).filter).toBe(expected);
      });
    });

  });

  describe('SearchResult', () => {

    it('should initialize SearchResult and compute lastPage correctly', () => {
      let sut = new SearchResult({
        currentPage: 1,
        filter: null,
        items: ['test', 'test2', 'test3', 'test4'] as any,
        perPage: 2,
        sort: null,
        sortDir: null,
        total: 4
      });

      expect(sut.toJSON(true)).toStrictEqual({
        currentPage: 1,
        filter: null,
        items: ['test', 'test2', 'test3', 'test4'],
        perPage: 2,
        sort: null,
        sortDir: null,
        lastPage: 2,
        total: 4
      });

      sut = new SearchResult({
        currentPage: 1,
        filter: null,
        items: ['test', 'test2', 'test3', 'test4'] as any,
        perPage: 2,
        sort: 'name',
        sortDir: 'ASC',
        total: 4
      });

      expect(sut.toJSON(true)).toStrictEqual({
        currentPage: 1,
        filter: null,
        items: ['test', 'test2', 'test3', 'test4'],
        perPage: 2,
        sort: 'name',
        sortDir: 'ASC',
        total: 4,
        lastPage: 2,
      });
    });

    it('should ensure lastPage is not a decimal number', () => {
      let sut = new SearchResult({
        currentPage: 1,
        filter: null,
        items: ['test', 'test2', 'test3', 'test4'] as any,
        perPage: 6,
        sort: null,
        sortDir: null,
        total: 4
      });

      expect(sut.lastPage).toBe(1);

      sut = new SearchResult({
        currentPage: 1,
        filter: null,
        items: ['test', 'test2', 'test3', 'test4'] as any,
        perPage: 10,
        sort: null,
        sortDir: null,
        total: 54
      });

      expect(sut.lastPage).toBe(6);
    });
  });
});
