export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null
}
export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const colorMatches = (r, g, b, tolerance) => {
  return (
      r >= originalRGB.r - tolerance && r <= originalRGB.r + tolerance &&
      g >= originalRGB.g - tolerance && g <= originalRGB.g + tolerance &&
      b >= originalRGB.b - tolerance && b <= originalRGB.b + tolerance
  )
}

export const getNeighbors = (x, y, w, h) => {
  const neighbors = []
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {

      if (i === 0 && j === 0) continue
      if (x + i < 0 || x + i >= w) continue
      if (y + j < 0 || y + j >= h) continue

      neighbors.push(toIndex(x + i, y + j, w))
    }
  }

  return neighbors
}


export const toIndex = (x, y, width) => (y * width + x) * 4


export const toCoords = (i, width) => {
  const pxStart = i - (i % 4) // round down to nearest multiple of 4, 1px = 4 bytes (RGBA)
  const pxIndex = pxStart / 4 // divide by 4 to get pixel index

  return {
    x: pxIndex % width,
    y: Math.floor(pxIndex / width)
  }
}
