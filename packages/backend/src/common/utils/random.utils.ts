import { randomBytes } from 'crypto'

export const generateRandomString = (length: number, encoding: BufferEncoding = 'hex'): string => {
    const buffer = randomBytes(length)
    return buffer.toString(encoding)
}
