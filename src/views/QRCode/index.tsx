import qrcode from 'qrcode-generator'
import type { FunctionComponent } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ErrorCorrectionLevel = {
  L: 'L(7%)',
  M: 'M(15%)',
  Q: 'Q(25%)',
  H: 'H(30%)',
}

const Mode = {
  Byte: 'Byte',
  Numeric: 'Numeric',
  Alphanumeric: 'Alphanumeric',
  Kanji: 'Kanji',
}

const Multibyte = {
  'default': 'none',
  'UTF-8': 'UTF-8',
}

type MultibyteType = keyof typeof Multibyte

interface Fields {
  typeNumber: TypeNumber
  errorCorrectionLevel: ErrorCorrectionLevel
  mode: Mode
  content: string
  cellSize: number | undefined
  multibyte: MultibyteType
}

function Confirm({ setModal }: { setModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className='p-5 bg-white shadow-md rounded-xl'>
      <div>Please confirm you want to delete this record.</div>
      <div className='flex justify-evenly items-center mt-3'>
        <button onClick={(event) => {
          event.preventDefault()
          setModal(false)
        }}>Cancel</button>
      </div>
    </div>
  )
}

const Modal: FunctionComponent<{ children: any }> = ({ children }) => {
  const modalRoot = document.body
  const elRef = useRef<HTMLDivElement | null>(null)
  if (!elRef.current)
    elRef.current = document.createElement('div')

  useEffect(() => {
    modalRoot!.appendChild(elRef.current!)
    return () => { modalRoot!.removeChild(elRef.current!) }
  }, [])

  return createPortal(<div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>{children}</div>, elRef.current)
}

const Panel = ({ formData, setFormData, generateQRCode, setModal }: { formData: Fields; setFormData: React.Dispatch<React.SetStateAction<Fields>>; generateQRCode: () => void;setModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const updateFormData = (data: Partial<Fields>) => {
    setFormData(Object.assign({}, formData, data))
  }

  let max = 780

  useEffect(() => {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs[formData.multibyte]
    const qr = qrcode(formData.typeNumber, formData.errorCorrectionLevel)
    qr.addData(formData.content)
    qr.make()
    const moduleCount = qr.getModuleCount()
    max = Math.floor(16384 / moduleCount)
    console.log(max)
  })

  return (
    <form>
      <fieldset>
        <legend>Choose your favorite monster</legend>
        <label>
        TypeNumber:
          <select name="TypeNumber" value={formData.typeNumber} onChange={(event) => {
            updateFormData({ typeNumber: +event.target.value as TypeNumber })
          }}>
            <option value={0}>Auto Detect</option>
            {Array.from({ length: 40 }).map((_, i) => <option value={i + 1} key={i + 1}>{i + 1}</option>)}
          </select>
        </label>
        <label>
        ErrorCorrectionLevel:
          <select name="ErrorCorrectionLevel" value={formData.errorCorrectionLevel} onChange={(event) => {
            updateFormData({ errorCorrectionLevel: event.target.value as ErrorCorrectionLevel })
          }}>
            {Object.entries(ErrorCorrectionLevel).map(item => <option value={item[0]} key={item[0]}>{item[1]}</option>)}
          </select>
        </label>
        <label>
        Mode:
          <select name="Mode" value={formData.mode} onChange={(event) => {
            updateFormData({ mode: event.target.value as Mode })
          }}>
            {Object.entries(Mode).map(item => <option value={item[0]} key={item[0]}>{item[1]}</option>)}
          </select>
        </label>
        <label>
        Multibyte:
          <select name="Multibyte" value={formData.multibyte} onChange={(event) => {
            updateFormData({ multibyte: event.target.value as MultibyteType })
          }}>
            {Object.entries(Multibyte).map(item => <option value={item[0]} key={item[0]}>{item[1]}</option>)}
          </select>
        </label>
        <label>
        CellSize:
          <input type={'number'}name="CellSize" value={formData.cellSize} onChange={(event) => {
            console.log(max)
            if (+event.target.value > max) {
              setModal(true)
              return
            }
            updateFormData({ cellSize: event.target.value as unknown as number })
          }}>
          </input>
        </label>
        <label>
        Content:
          <textarea value={formData.content} onChange={(event) => {
            updateFormData({ content: event.target.value })
          }}></textarea>
        </label>
        <button onClick={(event) => {
          event.preventDefault()
          generateQRCode()
        }}>Update</button>
      </fieldset>
    </form>
  )
}

const QrcodeGenerator = () => {
  const target = useRef<HTMLCanvasElement>(null)
  const [formData, setFormData] = useState<Fields>({
    typeNumber: 0,
    errorCorrectionLevel: 'L',
    mode: 'Byte',
    content: 'Hi!',
    cellSize: 10,
    multibyte: 'UTF-8',
  })

  const generateQRCode = () => {
    if (target.current) {
      qrcode.stringToBytes = qrcode.stringToBytesFuncs[formData.multibyte]
      const qr = qrcode(formData.typeNumber, formData.errorCorrectionLevel)
      qr.addData(formData.content)
      qr.make()
      const moduleCount = qr.getModuleCount()
      const width = moduleCount * (formData.cellSize || 2)
      const ctx = target.current.getContext('2d')!
      ctx.clearRect(0, 0, target.current.width, target.current.height)
      target.current.height = width < 16384 ? width : 16384
      target.current.width = width < 16384 ? width : 16384
      qr.renderTo2dContext(ctx, formData.cellSize)
    }
  }

  useEffect(() => {
    generateQRCode()
  }, [])

  const [modal, setModal] = useState(false)

  return (
    <>
      {modal ? <Modal><Confirm setModal={setModal} /></Modal> : null}
      <div className='flex flex-col'>
        <Panel formData={formData} setFormData={setFormData} generateQRCode={generateQRCode} setModal={setModal}></Panel>
        <canvas ref={target} className="h-[200px] w-[200px]" width={200} height={200}></canvas>
      </div>
    </>
  )
}

export default QrcodeGenerator
