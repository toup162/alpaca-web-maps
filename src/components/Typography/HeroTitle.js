import React from 'react'

function HeroTitle({ children }) {
    return (
        <h1 className="my-6 text-4xl lg:text-6xl font-bold text-gray-700 dark:text-gray-200 lg:leading-none">{children}</h1>
    )
}

export default HeroTitle
