import React from 'react'
import Editor from 'react-simple-code-editor'
import { Highlight, themes } from 'prism-react-renderer'

interface JsonEditorProps {
    value: string
    onChange: (value: string) => void
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
    const highlight = (code: string) => (
        <Highlight
            theme={themes.vsDark}
            code={code}
            language="json"
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </>
            )}
        </Highlight>
    )

    return (
        <div className="rounded-xl border border-white/10 bg-black/60 overflow-hidden font-mono text-xs min-h-[150px] shadow-inner focus-within:border-accent/50 transition-all">
            <Editor
                value={value}
                onValueChange={onChange}
                highlight={highlight}
                padding={16}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    minHeight: '150px'
                }}
            />
        </div>
    )
}
