"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"

export function AsciiDatabase() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const W = el.clientWidth  || 540
        const H = el.clientHeight || 460

        // ── Scene ─────────────────────────────────────────────
        const scene  = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)

        // ── Camera ────────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(60, W / H, 1, 1000)
        camera.position.set(0, 80, 340)

        // ── Lights ────────────────────────────────────────────
        // Key light — top-right, strong
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
        keyLight.position.set(200, 300, 200)
        scene.add(keyLight)

        // Fill light — left side, softer
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.9)
        fillLight.position.set(-200, 50, 100)
        scene.add(fillLight)

        // Rim light — bottom-back for silhouette separation
        const rimLight = new THREE.PointLight(0xffffff, 1.2, 0, 0)
        rimLight.position.set(-100, -200, -150)
        scene.add(rimLight)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25)
        scene.add(ambientLight)

        // ── Database geometry ─────────────────────────────────
        const mat = new THREE.MeshPhongMaterial({ flatShading: true, shininess: 60 })

        const group = new THREE.Group()

        // 3 tiers with clear gaps so ASCII can distinguish them
        const tiers = [
            { y: -90, h: 48, r: 85 },
            { y:  -8, h: 48, r: 85 },
            { y:  74, h: 48, r: 85 },
        ]

        for (const { y, h, r } of tiers) {
            // body — more segments = rounder, better ASCII curve
            const bodyGeo = new THREE.CylinderGeometry(r, r, h, 64, 1, false)
            const body    = new THREE.Mesh(bodyGeo, mat)
            body.position.y = y
            group.add(body)

            // caps — visibly thicker, slightly wider
            const capGeo = new THREE.CylinderGeometry(r + 4, r + 4, 8, 64)
            const capTop = new THREE.Mesh(capGeo, mat)
            capTop.position.y = y + h / 2 + 4
            group.add(capTop)

            const capBot = new THREE.Mesh(capGeo, mat)
            capBot.position.y = y - h / 2 - 4
            group.add(capBot)
        }

        // tilt to show top + side clearly
        group.rotation.x = 0.38
        scene.add(group)

        // ── Renderer ──────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(W, H)

        // ── ASCII Effect ───────────────────────────────────────
        // Charset with smooth gradation — dark (space) → bright (@)
        const effect = new AsciiEffect(renderer, ' .,:;i1tfLC08@', {
            invert: true,
            resolution: 0.205,
        })
        effect.setSize(W, H)
        effect.domElement.style.color        = '#8b1a2e'
        effect.domElement.style.background   = '#000'
        effect.domElement.style.fontFamily   = '"Courier New", Courier, monospace'
        effect.domElement.style.fontSize     = '11px'
        effect.domElement.style.lineHeight   = '1.15'
        effect.domElement.style.letterSpacing = '0.05em'
        effect.domElement.style.textShadow   = '0 0 6px rgba(139,26,46,0.9), 0 0 20px rgba(109,0,26,0.5)'
        effect.domElement.style.userSelect   = 'none'
        el.appendChild(effect.domElement)

        // ── Animation loop ─────────────────────────────────────
        let frameId: number
        const clock = new THREE.Clock()

        function animate() {
            frameId = requestAnimationFrame(animate)
            const t = clock.getElapsedTime()
            group.rotation.y = t * 0.42
            // very subtle float — too much makes ASCII jitter
            group.position.y = Math.sin(t * 0.7) * 4
            effect.render(scene, camera)
        }
        animate()

        // ── Cleanup ───────────────────────────────────────────
        return () => {
            cancelAnimationFrame(frameId)
            renderer.dispose()
            if (el.contains(effect.domElement)) el.removeChild(effect.domElement)
        }
    }, [])

    return (
        <div aria-hidden="true" className="select-none">
            <div
                ref={containerRef}
                style={{ width: 540, height: 460 }}
            />
            <div className="text-center mt-1 font-mono text-[10px] tracking-[0.35em] uppercase"
                style={{ color: 'rgba(109,0,26,0.55)' }}>
                matecitodb
            </div>
        </div>
    )
}
