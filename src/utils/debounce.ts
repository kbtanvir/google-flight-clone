import debounce from 'lodash.debounce'

export const debouncedSearch = debounce((func, value) => func(value), 700)
