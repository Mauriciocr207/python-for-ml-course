export default function resampleCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  resizeCanvas: HTMLCanvasElement
): void {
  const widthSource = sourceCanvas.width;
  const heightSource = sourceCanvas.height;
  targetWidth = Math.round(targetWidth);
  targetHeight = Math.round(targetHeight);

  const ratioW = widthSource / targetWidth;
  const ratioH = heightSource / targetHeight;
  const ratioWHalf = Math.ceil(ratioW / 2);
  const ratioHHalf = Math.ceil(ratioH / 2);

  const ctxSource = sourceCanvas.getContext("2d");
  const ctxTarget = resizeCanvas.getContext("2d");
  if (!ctxSource || !ctxTarget) return;

  const img = ctxSource.getImageData(0, 0, widthSource, heightSource);
  const img2 = ctxTarget.createImageData(targetWidth, targetHeight);
  const data = img.data;
  const data2 = img2.data;

  for (let j = 0; j < targetHeight; j++) {
    for (let i = 0; i < targetWidth; i++) {
      const x2 = (i + j * targetWidth) * 4;
      let gxR = 0,
        gxG = 0,
        gxB = 0,
        gxA = 0,
        weights = 0,
        weightsAlpha = 0;

      const centerY = (j + 0.5) * ratioH;
      const yyStart = Math.floor(j * ratioH);
      const yyStop = Math.ceil((j + 1) * ratioH);

      for (let yy = yyStart; yy < yyStop; yy++) {
        const dy = Math.abs(centerY - (yy + 0.5)) / ratioHHalf;
        const w0 = dy * dy;

        const centerX = (i + 0.5) * ratioW;
        const xxStart = Math.floor(i * ratioW);
        const xxStop = Math.ceil((i + 1) * ratioW);

        for (let xx = xxStart; xx < xxStop; xx++) {
          const dx = Math.abs(centerX - (xx + 0.5)) / ratioWHalf;
          let w = Math.sqrt(w0 + dx * dx);
          if (w >= 1) continue;

          // Hermite filter
          w = 2 * w * w * w - 3 * w * w + 1;

          const posX = 4 * (xx + yy * widthSource);

          // alpha
          gxA += w * data[posX + 3];
          weightsAlpha += w;

          // colors
          const weightRGB =
            data[posX + 3] < 255 ? (w * data[posX + 3]) / 250 : w;
          gxR += weightRGB * data[posX];
          gxG += weightRGB * data[posX + 1];
          gxB += weightRGB * data[posX + 2];
          weights += weightRGB;
        }
      }

      data2[x2] = gxR / weights;
      data2[x2 + 1] = gxG / weights;
      data2[x2 + 2] = gxB / weights;
      data2[x2 + 3] = gxA / weightsAlpha;
    }
  }

  // Exagerar blanco y negro
  for (let p = 0; p < data2.length; p += 4) {
    let gray = data2[p]; // Suponiendo ya en escala de grises
    gray = gray < 100 ? 0 : 255;
    data2[p] = data2[p + 1] = data2[p + 2] = gray;
  }

  ctxTarget.putImageData(img2, 0, 0);
}
