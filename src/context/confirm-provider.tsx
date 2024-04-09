import React, { useState, useCallback, useRef } from 'react'
import ConfirmContext from './confirm-context'
import Confirm from '@/components/Confirm'
import { DialogOptions } from '@/types/'

// 確認ダイアログのオプション、タイトル、メッセージ、ボタンのラベルなどを指定
const DEFAULT_OPTIONS: DialogOptions = {
  html: false,
  alert: false,
  title: 'ページが更新されました。',
  description:
    'ページが古い状態ですと、期限付きの画像が表示されなくなったり、誤った記事の情報のままになっている可能性があります。',
  confirmationText: '今すぐリロードする',
  cancellationText: '後でリロードする',
}

const buildOptions = (options: DialogOptions): DialogOptions => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  }
}

export const ConfirmProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  type State = {
    options: DialogOptions
  }

  type PromiseObj = {
    reject: (reason?: any) => void
    resolve: (value: boolean | PromiseLike<boolean>) => void
  }

  const initialState: State = {
    options: { ...DEFAULT_OPTIONS },
  }

  const initalPromiseObj: PromiseObj = {
    reject: () => {},
    resolve: () => {},
  }

  const [state, setState] = useState<State>(initialState)

  const [promiseObj, setPromiseObj] = useState<PromiseObj>(initalPromiseObj)

  const confirm = useCallback((options: DialogOptions): Promise<boolean> => {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      const newState: State = {
        options: buildOptions(options),
      }
      const newPromise: PromiseObj = {
        reject: reject,
        resolve: resolve,
      }
      setState(newState)
      setPromiseObj(newPromise)
      promiseObj.resolve(true)
    })
    return promise
  }, [])

  const handleCancel = useCallback(() => {
    setState(initialState)
    promiseObj.reject()
  }, [promiseObj])

  const handleConfirm = useCallback(() => {
    setState(initialState)
    promiseObj.resolve(true)
  }, [promiseObj])

  const fc = { confirm: confirm }
  const cmp = {
    reject: promiseObj.reject,
    resolve: promiseObj.resolve,
  }

  return (
    <>
      <Confirm {...state.options} onSubmit={handleConfirm} onCancel={handleCancel} />
      <ConfirmContext.Provider value={{ fc, cmp }}>{children}</ConfirmContext.Provider>
    </>
  )
}
