export function objectToQueryString(
  params: Record<string, string | number | null | undefined>
) {
  const filtersString = Object.keys(params)
    .map((key) => {
      const value = params[key]

      if (
        value === undefined ||
        value === null ||
        value === 0 ||
        (typeof value === 'string' && value.trim().length === 0)
      ) {
        return undefined
      }
      return `${key}=${value}&`
    })
    .join('')

  return filtersString.length ? `?${filtersString.slice(0, -1)}` : ''
}
