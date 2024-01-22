// pipeline.mjs

const animationProgress = (start, duration, time) => {
  const now = typeof time === 'number' ? time : Date.now()
  const elapsed = now - start
  const ratio = (elapsed % duration) / duration
  const inOut = ratio > 0.5 ? 1 - ratio : ratio

  const adjust = 0.95
  const smoothing = -0.05
  const factor = (inOut * adjust + smoothing) / (adjust + smoothing)

  const position = Math.min(1, Math.max(2 * factor, 0))

  return ({ now, elapsed, position })
}

for (let i = 0; i < 200; i += 10) {
  console.log(`Progress for ${i} of 100 from ${0}: ${animationProgress(0, 100, i).position}`)
}

export const transform = (imageData, factor) => {
  const original = imageData.data.slice()
  const { width, height } = imageData

  const randFactor = (a = 0.75, b = 0.25) => clamp(0, 1, (Math.random() * (a - factor) + Math.random() * factor * b))

  const cgf = randFactor()
  const glitchCols = new Set(
    cgf < 0.25
    ? ( Math.random() < factor ? glitchedCols : []) 
    : Array.from({
      length: randFactor() * width
    }, _ => Math.floor(Math.random() * width))
  )
  if (glitchCols.size > 0) glitchedCols = glitchCols

  const rgf = randFactor()
  const glitchRows = new Set(
    rgf < 0.25
    ? ( Math.random() < factor ? glitchedRows : [])
    : Array.from({
      length: randFactor() * height
    }, _ => Math.floor(Math.random() * height))
  )
  if (glitchRows.size > 0) glitchedRows = glitchRows

  const rarer = glitchRows.size > glitchCols.size
  for (let i = 0; i < imageData.data.length; i += 4) {
    const colorPoints = imageData.data.slice(i, i + 4)
    const [ r, g, b, a ] = colorPoints

    const currCol = (i / 4) % width
    const currRow = Math.floor((i / 4) / width)

    const avg = (r + g + b) / 3
    const weighted = avg * factor

    if (r > weighted && g > weighted && b > weighted) {
      // binary
      if (avg >= 128) {
        imageData.data[i] = 255
        imageData.data[i + 1] = 255
        imageData.data[i + 2] = 255
      }
    } else {
      // contrast
      for (let j = 0; j < 3; j++) {
        const colorPoint = colorPoints[j]
        imageData.data[i + j] = colorPoint > avg * factor ? Math.round(colorPoint * weighted) : 0
      }
    }

    // glitch
    if (glitchCols.has(currCol) && !glitchRows.has(currRow)) {
      const copyCol = Math.random() * cgf < 0.75
      const targetCol = Math.floor(cgf * width)

      imageData.data[i] = copyCol
        ? original[i + 4 * targetCol]
        : Math.random() * currCol / width * original[i]
      imageData.data[i + 1] = copyCol
        ? original[i + 4 * targetCol + 1]
        : Math.random() * currCol / width * original[i + 1]
      imageData.data[i + 2] = copyCol
        ? original[i + 4 * targetCol + 2]
        : Math.random() * currCol / width * original[i + 2] / width
    }
    if (glitchRows.has(currRow) && !glitchCols.has(currCol)) {
      const copyRow = Math.random() * rgf < 0.75
      const targetRow = Math.floor(rgf * height)

      imageData.data[i] = copyRow
        ? original[i + 4 * width * targetRow]
        : Math.random() * currRow / height * original[i]
      imageData.data[i + 1] = copyRow
        ? original[i + 4 * width * targetRow + 1]
        : Math.random() * currRow / height * original[i + 1]
      imageData.data[i + 2] = copyRow
        ? original[i + 4 * width * targetRow + 2]
        : Math.random() * currRow / height * original[i + 2]
    }
  }

  return imageData
}

const pipeline = (ctx, start, duration, time) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const tick = animationProgress(start, duration, time)
  const { position: progress } = tick

  return transform(imageData, progress)
}

let glitchedCols = new Set()
let glitchedRows = new Set()

export default pipeline

// Old version
// pipeline.mjs

// const animationProgress = (start, duration, time) => {
//   const now = time || Date.now()
//   const elapsed = now - start
//   const ratio = elapsed / duration
//   // const circular = Math.sin(ratio * Math.PI / 2)
//   const circular = Math.cos((ratio + 1/2) * 2 * Math.PI)
//   const position = (1 + circular) / 2.1

//   return ({ now, elapsed, position })
// }

// export const transform = (imageData, ratio) => {

//   for (let i = 0; i < imageData.data.length; i += 4) {
//     const colorPoints = imageData.data.slice(i, i + 4)
//     const [ r, g, b, a ] = colorPoints

//     const avg = (r + g + b) / 3
//     const weighted = avg * ratio

//     if (r > weighted && g > weighted && b > weighted) {
//       // binary
//       if (avg >= 128) {
//         imageData.data[i] = 255
//         imageData.data[i + 1] = 255
//         imageData.data[i + 2] = 255
//       }
//     } else {
//       // contrast
//       for (let j = 0; j < 3; j++) {
//         const colorPoint = colorPoints[j]
//         imageData.data[i + j] = colorPoint > avg * ratio ? Math.round(colorPoint * ratio) : 0
//       }
//     }
//   }

//   return imageData
// }

// const pipeline = (ctx, start, duration, time) => {
//   const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
//   const tick = animationProgress(start, duration, time)
//   const { position: progress } = tick

//   return transform(imageData, progress)
// }

// export default pipeline

const clamp = (min, max, value) => Math.min(max, Math.max(min, value))
