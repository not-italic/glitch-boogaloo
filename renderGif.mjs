// renderGif.mjs

import './lib/gif.js'

const gifGen = (duration, frames, loop = true) => new Promise((resolve, reject) => {
  const gif = new GIF({
    workers: 2,
    quality: 16,
    workerScript: './lib/gif.worker.js',
  })

  frames.forEach(frame => {
    gif.addFrame(frame, { delay: duration / frames.length })
  })

  if (typeof loop === 'number') {
    gif.setOption('repeat', loop); // Number of times to loop; 0 for repeat, -1 for no-repeat
  } else {
    gif.setOption('repeat', loop ? 0 : -1)
  }

  gif.on('finished', resolve)

  gif.on('error', reject)

  gif.render();
})

export default gifGen
