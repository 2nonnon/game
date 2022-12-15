import { generateMine } from './helper'

describe('generateMine', () => {
  test('should generate one mine when num is 1', () => {
    expect(generateMine([2, 2], 1)).toHaveLength(1)
  })
})
