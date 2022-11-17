export const NumToLetter = (num: number) => String.fromCharCode(64 + num)
export const LetterToNum = (letter: string) => letter.charCodeAt(0) - 64
