import test from "tape";
import sizes from "./paper-sizes.js";
import getDocument from "./index.js";

test("sizes", async (t) => {
  t.deepEqual(sizes.a4, { units: "mm", dimensions: [210, 297] });
  t.deepEqual(sizes.letter, { units: "in", dimensions: [8.5, 11] });
  t.deepEqual(sizes["half-letter"], { units: "in", dimensions: [5.5, 8.5] });
});

test("getSize", async (t) => {
  t.throws(() => getDocument(null));
  t.throws(() => getDocument({ dimensions: [1] }));
  t.throws(() => getDocument({ dimensions: [1, 2, 3] }));
  t.throws(() => getDocument({ dimensions: "aha" }));
  t.deepEqual(getDocument([128, 128]), {
    width: 128,
    height: 128,
    units: "px",
    canvasWidth: 128,
    canvasHeight: 128,
    pixelsPerInch: 72,
    pixelRatio: 1,
  });
  t.deepEqual(getDocument({ dimensions: [128, 128], pixelRatio: 2 }), {
    width: 128,
    height: 128,
    units: "px",
    canvasWidth: 256,
    canvasHeight: 256,
    pixelsPerInch: 72,
    pixelRatio: 2,
  });
  t.equals(getDocument({ dimensions: [120, 10] }).units, "px");
  t.equals(getDocument({ dimensions: "a4" }).units, "px");
  t.equals(getDocument({ dimensions: "A4", units: "cm" }).units, "cm");
  t.deepEqual(getDocument({ dimensions: "A4", units: "cm" }), {
    width: 21,
    height: 29.7,
    units: "cm",
    canvasWidth: 595,
    canvasHeight: 842,
    pixelsPerInch: 72,
    pixelRatio: 1,
  });

  t.deepEqual(
    getDocument({ dimensions: "A4", units: "cm", pixelsPerInch: 300 }),
    {
      width: 21,
      height: 29.7,
      units: "cm",
      canvasWidth: 2480,
      canvasHeight: 3508,
      pixelsPerInch: 300,
      pixelRatio: 1,
    }
  );
  t.deepEqual(
    getDocument({
      dimensions: [200, 100],
      orientation: "portrait",
    }),
    {
      width: 100,
      height: 200,
      units: "px",
      canvasWidth: 100,
      canvasHeight: 200,
      pixelsPerInch: 72,
      pixelRatio: 1,
    }
  );
  t.deepEqual(
    getDocument({
      dimensions: [200, 100],
      orientation: "landscape",
    }),
    {
      width: 200,
      height: 100,
      units: "px",
      canvasWidth: 200,
      canvasHeight: 100,
      pixelsPerInch: 72,
      pixelRatio: 1,
    }
  );

  t.deepEqual(
    getDocument({
      dimensions: "A4",
      units: "cm",
      orientation: "landscape",
      pixelsPerInch: 300,
    }),
    {
      width: 29.7,
      height: 21,
      units: "cm",
      canvasWidth: 3508,
      canvasHeight: 2480,
      pixelsPerInch: 300,
      pixelRatio: 1,
    }
  );
});
