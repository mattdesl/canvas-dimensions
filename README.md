# canvas-dimensions

A utility that provides user and screen units for a 2D Canvas.

```js
import getDocument from "canvas-dimensions";

const settings = {
  // a standard paper size or [w, h]
  dimensions: "A4",
  // pixel resolution
  pixelsPerInch: 300,
  // a user coordinate space to work in
  units: "cm",
};

const {
  // Size in user space coordinates
  width,
  height,
  // Size in display/screen coordinates
  canvasWidth,
  canvasHeight,
} = getDocument(settings);

// Setup your 2D canvas
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Scale context to user coordinates
context.scale(canvasWidth / width, canvasHeight / height);

// Draw your graphics in user space coordinates
context.fillRect(0, 0, width, height);
```

## Install

Use [npm](https://npmjs.com/) to install.

```sh
npm install canvas-dimensions --save
```

## Usage

#### `output = getDocument(settings = {})`

Gets document size information from the given input options.

Input options:

- `dimensions` can be a string defining a paper size preset like `'A4'` or `'letter'` (case insensitive), or an array of `[ width, height ]`
- `units` a string, the output units you would like to work in, can be `'px'`, `'in'`, `'cm'`, `'mm'` (default `'px'`)
- `pixelsPerInch` used when converting physical sizes to canvas pixel sizes, defaults to `72`
- `orientation` an optional string, can be `"landscape"` or `"portrait"` and will flip the input `dimensions` accordingly, mostly useful if you are specifying a paper size preset. Note, the paper size presets are all portrait by default.
- `pixelRatio` a factor to multiply the final canvas size by, default `1`

The `settings` input can also just be an `[ width, height ]` array, which is the same as passing `{ dimensions: [ width, height ], units: 'px' }`.

Output:

- `units` a string identifying the user coordinate space, such as `'px'` or `'cm'`
- `width` the document width in user coordinates
- `height` the document height in user coordinates
- `pixelsPerInch` the document resolution
- `canvasWidth` the display/pixel width of the resulting canvas
- `canvasHeight` the display/pixel height of the resulting canvas
- `pixelRatio` the pixel ratio that has been applied to canvas size

#### `import paperSizes from 'canvas-dimensions/paper-sizes.js'`

The raw list of possible paper size keywords, see [./paper-sizes](./paper-sizes.js).

## Recipes

Some more examples and recipes:

```js
// 1280 x 1280 pixel image
doc = getDocument([1280, 1280]);

// Size canvas to browser size
doc = getDocument({
  dimensions: [window.innerWidth, window.innerHeight],
  pixelRatio: window.devicePixelRatio,
});

// 18 x 18 " artwork ready for print
doc = getDocument({
  dimensions: [18, 18],
  units: "in",
  pixelsPerInch: 300,
});

// A4 landscape artwork, working in millimeters
doc = getDocument({
  dimensions: "A4",
  units: "mm",
  orientation: "landscape",
  pixelsPerInch: 300,
});
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/canvas-dimensions/blob/master/LICENSE.md) for details.
