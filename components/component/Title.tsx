import React from 'react'

interface TitleProps {
  title: string
}

const Title = ({ title }: TitleProps) => {
  return (
    <h1 className="text-2xl font-bold text-gray-900 ">{title}</h1>
  )
}

export default Title
