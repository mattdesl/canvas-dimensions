import paperSizes from "./paper-sizes.js";
import convert from "convert-length";

/**
 * @typedef {Object} Document
 * @type {Object}
 * @property {string} units - The units used for the user coordinate space ('px', 'cm', etc.).
 * @property {number} width - The width of the document in user coordinates.
 * @property {number} height - The height of the document in user coordinates.
 * @property {number} pixelsPerInch - The resolution of the document in pixels per inch.
 * @property {number} canvasWidth - The display/pixel width of the resulting canvas.
 * @property {number} canvasHeight - The display/pixel height of the resulting canvas.
 * @property {number} pixelRatio - The pixel ratio that has been applied to the canvas size.
 */

/**
 * Gets document size information based on the given opts.
 *
 * @param {Object} [opts={}] - The input opts for calculating document size.
 * @param {(string|Array)} [opts.dimensions='A4'] - Can be a string defining a paper size preset ('A4', 'letter') or an array [width, height].
 * @param {string} [opts.units='px'] - The output units ('px', 'in', 'cm', 'mm'). Defaults to 'px'.
 * @param {number} [opts.pixelsPerInch=72] - Used when converting physical sizes to canvas pixel sizes.
 * @param {string} [opts.orientation] - Can be 'landscape' or 'portrait'. Flips the input dimensions if using a paper size preset.
 * @param {number} [opts.pixelRatio=1] - A factor to multiply the final canvas size by.
 * @returns {Document} The document size information, including width, height, canvas size, and pixel ratio in the specified units.
 */
export default function getDocument(opts = {}) {
  if (Array.isArray(opts)) {
    opts = {
      dimensions: opts,
    };
  }

  let dimensions = opts.dimensions;
  if (!dimensions) throw new Error("Must specify { dimensions }");

  const units = opts.units || "px";
  if (typeof dimensions === "string") {
    // paper size key
    const key = dimensions.toLowerCase();
    if (!(key in paperSizes))
      throw new Error(`No paper size by the key "${dimensions}"`);
    const inputSize = paperSizes[key];
    dimensions = inputSize.dimensions.map((d) =>
      inputSize.units === units ? d : convert(d, inputSize.units, units)
    );
  }

  if (!Array.isArray(dimensions))
    throw new Error("expected array or string for { dimensions }");
  dimensions = dimensions.slice();
  if (dimensions.length !== 2)
    throw new Error("Expected two dimensional { dimensions }");

  const initialOrientation =
    dimensions[0] > dimensions[1] ? "landscape" : "portrait";
  if (opts.orientation) {
    const ori = opts.orientation.toLowerCase();
    if (!["landscape", "portrait"].includes(ori))
      throw new Error('Expected orientation to be "landscape" or "portrait"');
    if (ori !== initialOrientation) {
      dimensions.reverse();
    }
  }

  const pixelsPerInch = opts.pixelsPerInch || 72;

  let [canvasWidth, canvasHeight] = dimensions.map((d) =>
    units === "px"
      ? d
      : convert(d, units, "px", { roundPixel: true, pixelsPerInch })
  );

  const [width, height] = dimensions;

  const pixelRatio = opts.pixelRatio ?? 1;
  canvasWidth *= pixelRatio;
  canvasHeight *= pixelRatio;

  return {
    width,
    height,
    units,
    canvasWidth,
    canvasHeight,
    pixelsPerInch,
    pixelRatio,
  };
}
