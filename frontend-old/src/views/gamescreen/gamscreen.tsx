import React, { useEffect, useMemo, useRef, useState } from "react"

// Default export so you can drop this into a React app and preview
export default function GameScreen() {
  // Camera in world space (pixels). Positive x to the right, positive y down
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 })
  // A simple "player" to demonstrate following or manual panning
  const [player, setPlayer] = useState({ x: 0, y: 0 })
  const [followPlayer, setFollowPlayer] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const draggingRef = useRef(false)
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null)

  // Helpers to convert between spaces
  const worldToScreen = (wx: number, wy: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    return {
      x: (wx - camera.x) * camera.zoom + cx,
      y: (wy - camera.y) * camera.zoom + cy,
    }
  }

  const screenToWorld = (sx: number, sy: number) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    return {
      x: (sx - cx) / camera.zoom + camera.x,
      y: (sy - cy) / camera.zoom + camera.y,
    }
  }

  // Input: pan with mouse drag (left/right), wheel to zoom, WASD/Arrows to move player
  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return

    const gameScreen = document.getElementById("game-screen")!

    const ctx = canvas.getContext("2d")!
    ctx.canvas.width = gameScreen.clientWidth
    ctx.canvas.height = gameScreen.clientHeight

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      canvas.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || !lastPointerRef.current) return
      const dx = e.clientX - lastPointerRef.current.x
      const dy = e.clientY - lastPointerRef.current.y
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      // Pan camera opposite to pointer move (convert to world space by dividing by zoom)
      setCamera((c) => ({ ...c, x: c.x - dx / c.zoom, y: c.y - dy / c.zoom }))
      setFollowPlayer(false)
    }
    const endDrag = (e: PointerEvent) => {
      draggingRef.current = false
      lastPointerRef.current = null
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {}
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const { clientX, clientY, deltaY } = e
      // Zoom to mouse position
      const before = screenToWorld(clientX, clientY)
      const factor = Math.exp(-deltaY * 0.001) // smooth zoom
      setCamera((c) => {
        const nextZoom = clamp(c.zoom * factor, 0.1, 5)
        const after = {
          x: (before.x - c.x) * (nextZoom / c.zoom) + c.x,
          y: (before.y - c.y) * (nextZoom / c.zoom) + c.y,
        }
        // Adjust camera so the point under the cursor stays fixed
        const rect = canvas.getBoundingClientRect()
        const cx = rect.width / 2,
          cy = rect.height / 2
        const newX = after.x - (clientX - cx) / nextZoom
        const newY = after.y - (clientY - cy) / nextZoom
        return { x: newX, y: newY, zoom: nextZoom }
      })
      setFollowPlayer(false)
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", endDrag)
    canvas.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", endDrag)
      canvas.removeEventListener("wheel", onWheel as any)
    }
  }, [camera.zoom])

  // Keyboard controls for the player
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const speed = 300 // world units per second
      const step = speed / 60 // approximate per-frame step
      if (["ArrowUp", "KeyW"].includes(e.code))
        setPlayer((p) => ({ ...p, y: p.y - step }))
      if (["ArrowDown", "KeyS"].includes(e.code))
        setPlayer((p) => ({ ...p, y: p.y + step }))
      if (["ArrowLeft", "KeyA"].includes(e.code))
        setPlayer((p) => ({ ...p, x: p.x - step }))
      if (["ArrowRight", "KeyD"].includes(e.code))
        setPlayer((p) => ({ ...p, x: p.x + step }))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Follow logic
  useEffect(() => {
    if (!followPlayer) return
    setCamera((c) => ({ ...c, x: player.x, y: player.y }))
  }, [player, followPlayer])

  // Resize & HiDPI handling
  useEffect(() => {
    const canvas = canvasRef.current!
    if (!canvas) return
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      const ctx = canvas.getContext("2d")!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // draw in CSS pixels
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw background
      ctx.fillStyle = "#0b1020"
      ctx.fillRect(0, 0, rect.width, rect.height)

      drawGrid(ctx, rect.width, rect.height, camera)

      // Draw axes
      const origin = worldToScreen(0, 0)
      ctx.strokeStyle = "#66d9ef"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, origin.y)
      ctx.lineTo(rect.width, origin.y)
      ctx.moveTo(origin.x, 0)
      ctx.lineTo(origin.x, rect.height)
      ctx.stroke()

      // Draw player
      const p = worldToScreen(player.x, player.y)
      const size = 20 * camera.zoom // player scales slightly with zoom for visibility
      ctx.fillStyle = "#ffd866"
      ctx.beginPath()
      ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2)
      ctx.fill()

      // HUD
      ctx.fillStyle = "#eaeef6"
      ctx.font =
        '12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      ctx.fillText(
        `Camera: x=${camera.x.toFixed(1)} y=${camera.y.toFixed(
          1
        )} zoom=${camera.zoom.toFixed(2)}`,
        12,
        20
      )
      ctx.fillText(
        `Player: x=${player.x.toFixed(1)} y=${player.y.toFixed(
          1
        )}  (drag to pan, wheel to zoom, WASD/Arrows to move)`,
        12,
        36
      )

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [camera, player])

  return (
    <div id="game-screen" className="absolute top-0 left-0 w-screen h-screen">
      <canvas ref={canvasRef} className="block" />
      {/* <HowItWorks /> */}
    </div>
  )
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  camera: { x: number; y: number; zoom: number }
) {
  // Multi-scale grid: major and minor lines that adapt to zoom
  const baseCell = 64 // world units per tile
  const zoom = camera.zoom

  // Choose a world-space spacing for minor lines so they remain ~8–32px apart on screen
  const desiredPx = 24
  const worldSpacing =
    baseCell * Math.pow(2, Math.round(Math.log2(desiredPx / zoom / baseCell)))
  const minorSpacing = Math.max(4, worldSpacing)
  const majorEvery = 4 // every N minor lines, draw a thicker major line

  const leftTop = screenToWorldStatic(0, 0, camera, width, height)
  const rightBottom = screenToWorldStatic(width, height, camera, width, height)

  const startX = Math.floor(leftTop.x / minorSpacing) * minorSpacing
  const endX = Math.ceil(rightBottom.x / minorSpacing) * minorSpacing
  const startY = Math.floor(leftTop.y / minorSpacing) * minorSpacing
  const endY = Math.ceil(rightBottom.y / minorSpacing) * minorSpacing

  ctx.lineWidth = 1
  ctx.strokeStyle = "#2b314b" // minor lines
  ctx.beginPath()
  for (let x = startX; x <= endX; x += minorSpacing) {
    const sx = (x - camera.x) * zoom + width / 2
    ctx.moveTo(sx, 0)
    ctx.lineTo(sx, height)
  }
  for (let y = startY; y <= endY; y += minorSpacing) {
    const sy = (y - camera.y) * zoom + height / 2
    ctx.moveTo(0, sy)
    ctx.lineTo(width, sy)
  }
  ctx.stroke()

  // Major grid
  ctx.lineWidth = 1.5
  ctx.strokeStyle = "#4b5175"
  ctx.beginPath()
  let i = 0
  for (let x = startX; x <= endX; x += minorSpacing) {
    if (i % majorEvery === 0) {
      const sx = (x - camera.x) * zoom + width / 2
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, height)
    }
    i++
  }
  i = 0
  for (let y = startY; y <= endY; y += minorSpacing) {
    if (i % majorEvery === 0) {
      const sy = (y - camera.y) * zoom + height / 2
      ctx.moveTo(0, sy)
      ctx.lineTo(width, sy)
    }
    i++
  }
  ctx.stroke()

  // Optional: draw coordinates at major intersections
  ctx.fillStyle = "#8fa1c7"
  ctx.font =
    "11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  for (let x = startX; x <= endX; x += minorSpacing * majorEvery) {
    for (let y = startY; y <= endY; y += minorSpacing * majorEvery) {
      const sx = (x - camera.x) * zoom + width / 2 + 3
      const sy = (y - camera.y) * zoom + height / 2 - 3
      ctx.fillText(`${x}, ${y}`, sx, sy)
    }
  }
}

function screenToWorldStatic(
  sx: number,
  sy: number,
  camera: { x: number; y: number; zoom: number },
  width: number,
  height: number
) {
  const cx = width / 2,
    cy = height / 2
  return {
    x: (sx - cx) / camera.zoom + camera.x,
    y: (sy - cy) / camera.zoom + camera.y,
  }
}

// ————————————————————————————————————————————————————————————————
// How it works / architecture notes shown under the canvas
function HowItWorks() {
  return (
    <div className="grid gap-2 text-sm leading-6">
      <h2 className="text-lg font-medium">How this works</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <b>World vs. Screen space:</b> The grid and player live in world
          coordinates. The camera is a transform applied when mapping to screen
          coordinates.
        </li>
        <li>
          <b>Panning:</b> Dragging updates <code>camera.x/y</code> by the
          pointer delta divided by <code>zoom</code>.
        </li>
        <li>
          <b>Zooming:</b> Mouse wheel changes <code>zoom</code> exponentially
          and keeps the cursor-anchored point fixed.
        </li>
        <li>
          <b>Adaptive grid:</b> The grid chooses a world spacing so lines land
          ~every 24px regardless of zoom, with thicker major lines every N
          steps.
        </li>
        <li>
          <b>HiDPI:</b> Canvas is scaled via <code>devicePixelRatio</code> so
          lines are crisp.
        </li>
        <li>
          <b>Follow mode:</b> Toggle between a free camera and following the
          player.
        </li>
      </ul>
      <h3 className="font-medium mt-2">Extending this</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Replace the canvas drawing with sprites/tiles. Compute visible tiles
          from <code>camera</code> and draw only those.
        </li>
        <li>
          Snap entities to the grid by rounding <code>x/y</code> to the nearest
          cell size.
        </li>
        <li>
          Add collision by indexing solid tiles in a map keyed by tile
          coordinates.
        </li>
      </ul>
    </div>
  )
}
