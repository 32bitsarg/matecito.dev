"use client"

import dynamic from "next/dynamic"

const AsciiDatabase = dynamic(
    () => import("./AsciiDatabase").then(m => m.AsciiDatabase),
    { ssr: false, loading: () => <div style={{ width: 540, height: 460 }} /> }
)

export function AsciiDatabaseLoader() {
    return <AsciiDatabase />
}
