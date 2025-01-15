import { createContext } from 'react'
import { DialogOptions } from '@/types'

export default createContext(
  {} as {
    fc: { confirm: (options: DialogOptions) => Promise<any> }
    cmp: {
      reject: (reason?: any) => void
      resolve: (value: boolean | PromiseLike<boolean>) => void
    }
  },
)
