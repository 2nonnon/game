export const generateMine = ([row, col]: [number, number], num: number) => {
  if (row <= 0 || col <= 0 || num <= 0)
    return []

  const length = num > row * col ? row * col : num

  const hash = new Set<string>()

  return Array.from({ length }).map(() => {
    let x = -1
    let y = -1
    while ((x + y < 0) || hash.has(`${x}${y}`)) {
      x = Math.floor(Math.random() * col)
      y = Math.floor(Math.random() * row)
    }

    return [y, x]
  })
}
