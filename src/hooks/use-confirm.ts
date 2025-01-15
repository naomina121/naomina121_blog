import { useContext } from 'react'
import confirmContext from '@/context/confirm-context'

const useConfirm = () => {
  const { fc, cmp } = useContext(confirmContext)
  return { fc: fc, cmp: cmp }
}
export default useConfirm
