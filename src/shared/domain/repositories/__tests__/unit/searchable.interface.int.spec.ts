import { SearchParams } from "../../searchable.interface"

describe('Searchable Unit Tests', () => {
  describe('SearchParams tests', () => {
    it('Page prop', () => {
      const sut = new SearchParams();
      expect(sut.page).toBe(1)

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

      params.forEach(p => { expect(new SearchParams({ page: p.page }).page).toBe(p.expected) })
    })

    it('PerPage', () => {
      const sut = new SearchParams();
      expect(sut.perPage).toBe(15);

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
      ]


      params.forEach(p => { expect(new SearchParams({ perPage: p.perPage }).perPage).toBe(p.expected) })

    })
  })
})