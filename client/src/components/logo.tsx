'use client'

import * as React from 'react'

export function Logo({ width = 100, height = 100 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 115 110"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all"
    >
      {/* Pot */}
      <path
        d="M 10 60 A 50 50 0 0 0 110 60"
        strokeWidth="2"
        className={'fill-black dark:fill-white'}
      />
      {/* Ladle */}
      <line
        x1="10"
        y1="30"
        x2="50"
        y2="70"
        strokeWidth="5"
        strokeLinecap="round"
        className={'stroke-black dark:stroke-white'}
      />
      {/* Steam */}
      <path
        d="M 50 50 Q 45 30, 50 20 Q 55 10, 50 0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        className={'stroke-gray-600 dark:stroke-white'}
      />
      <path
        d="M 70 50 Q 65 30, 70 20 Q 75 10, 70 0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        className={'stroke-gray-600 dark:stroke-white'}
      />
      <path
        d="M 90 50 Q 85 30, 90 20 Q 95 10, 90 0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        className={'stroke-gray-600 dark:stroke-white'}
      />
    </svg>
  )
}
