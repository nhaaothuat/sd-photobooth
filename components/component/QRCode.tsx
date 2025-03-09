import Image from 'next/image'
import React from 'react'
import qr from "@/assets/scan_me_qr_code.jpg"
const QRCode = () => {
  return (
    <Image src={qr} alt='qr code' />
  )
}

export default QRCode
