import React, { FC } from 'react'
import { DialogOptions } from '@/types'
import 'remixicon/fonts/remixicon.css'

const Confirm: FC<DialogOptions> = (options) => {
  return (
    <>
      {options.alert && (
        <div className='min-h-screen z-50 w-full bg-black fixed bg-opacity-50'>
          <div
            className='rounded-md max-h-screen bg-white absolute right-5 top-5 sm:right-0 sm:top-0 z-50 shadow-sm p-4
          max-w-lg w-full'
          >
            <div className='mb-4 bg-lime-200 round-full w-7 h-7 block mx-auto text-center'>
              <i className='ri-check-line text-lime-700'></i>
            </div>
            <p className='text-lg pb-1 text-center font-bold text-gray-950'>{options.title}</p>
            {options.html && <p className='pb-4 text-sm text-gray-700'>{options.description}</p>}
            <div className='flex justify-between'>
              <button
                className='border-[1px] border-solid border-gray-500 w-full max-w-[200px] font-normal text-gray-950 rounded-md sm:text-sm'
                onClick={options.onCancel}
              >
                {options.cancellationText}
              </button>
              <button
                className='border-[1px] border-solid max-w-[200px] w-full border-green-800 bg-green-800 sm:text-sm text-white font-normal rounded-md'
                onClick={options.onSubmit}
              >
                {options.confirmationText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Confirm
