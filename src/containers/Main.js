import React from 'react'

function Main({ children }) {
    return (
        <main className="h-full overflow-hidden">
            <div className="dashboard-container container grid w-100">{children}</div>
        </main>
    )
}

export default Main
