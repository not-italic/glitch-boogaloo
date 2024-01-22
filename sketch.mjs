// sketch.mjs
import applyEffects from './pipeline.mjs'

let src = './landscape.jpg'
let duration = window.duration || 1000
const start = window.start || Date.now()

let img = document.querySelector('#source') || new Image()
img.id ||= 'source'
img.src ||= src

const loadImage = src => {
  return new Promise((resolve, reject) => {
    img.src = src

    img.addEventListener('load', _ => resolve(img))
    img.onerror = reject
  })
}

const getRenderer = _ => {
  let canvas = document.getElementById('sketch');
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.id = 'sketch'
    document.body.appendChild(canvas)
  }

  return canvas
}

const resizeTo = (img, canvas) => {
  const { innerWidth: maxWidth, innerHeight: maxHeight } = window
  const aspectRatio = img.width / img.height

  if (maxWidth / maxHeight > aspectRatio) {
    canvas.height = Math.min(maxHeight, img.height)
    canvas.width = canvas.height * aspectRatio
  } else {
    canvas.width = Math.min(maxWidth, img.width)
    canvas.height = canvas.width / aspectRatio
  }
}

const renderTo = (canvas, img) => {
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img,
    0, 0, img.width, img.height,
    0, 0, canvas.width, canvas.height)
}

const render = _ => {
  const canvas = getRenderer()
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  resizeTo(img, canvas)
  renderTo(canvas, img)

  const imageData = applyEffects(ctx, start, duration)
  ctx.putImageData(imageData, 0, 0)
}

const refresh = _ => {
  render()
  requestAnimationFrame(refresh)
}

window.addEventListener('load', async _ => {
  await loadImage(src)

  resizeTo(img, getRenderer())
  refresh()
})

window.addEventListener('resize', _ => resizeTo(img, getRenderer()))
