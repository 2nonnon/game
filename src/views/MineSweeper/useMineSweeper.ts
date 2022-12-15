import { useState } from 'react'
import type { IBlock } from './type'

const block: IBlock = {
  content: '',
  type: 'block',
  hidden: false,
  flag: false,
}

const useMineSweeper = ([row, col]: [number, number]) => {
  const init = Array.from({ length: row }).map(_ => Array.from({ length: col }).map(_ => ({ ...block })))
  const [mineSweeper, setMineSweeper] = useState(init)

  return [mineSweeper, setMineSweeper]
}

export default useMineSweeper
