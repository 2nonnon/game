export const Level = {
  easy: [9, 9],
  medieum: [16, 16],
  hard: [32, 16],
}

type BlockType = 'mine' | 'block' | 'number'

export interface IBlock {
  content: string
  type: BlockType
  hidden: boolean
  flag: boolean
}
