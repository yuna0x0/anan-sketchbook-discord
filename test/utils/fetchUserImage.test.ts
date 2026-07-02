/**
 * fetchUserImage Tests
 * DoS-protection tests: byte-size cap (before and after download), pixel
 * dimension cap, format validation, and the happy path.
 */

import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";

import {
  fetchUserImage,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_PIXELS,
  type FetchableAttachment,
} from "../../src/utils/imageUtils.js";

function attachment(
  overrides: Partial<FetchableAttachment> = {},
): FetchableAttachment {
  return {
    contentType: "image/png",
    size: 1024,
    url: "https://cdn.example.com/image.png",
    width: 100,
    height: 100,
    ...overrides,
  };
}

/** Mock global fetch to return the given body bytes */
function mockFetch(body: Buffer, ok = true) {
  mock.method(globalThis, "fetch", async () => ({
    ok,
    arrayBuffer: async () =>
      body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
  }));
}

afterEach(() => {
  mock.restoreAll();
});

describe("fetchUserImage", () => {
  it("should reject non-image content types before downloading", async () => {
    const fetchSpy = mock.method(globalThis, "fetch");
    const result = await fetchUserImage(attachment({ contentType: "text/plain" }));
    assert.equal(result.error, "notImage");
    assert.equal(fetchSpy.mock.callCount(), 0, "must not download");
  });

  it("should reject oversized files by declared size before downloading", async () => {
    const fetchSpy = mock.method(globalThis, "fetch");
    const result = await fetchUserImage(
      attachment({ size: MAX_IMAGE_BYTES + 1 }),
    );
    assert.equal(result.error, "tooLarge");
    assert.equal(fetchSpy.mock.callCount(), 0, "must not download");
  });

  it("should reject oversized dimensions before downloading", async () => {
    const fetchSpy = mock.method(globalThis, "fetch");
    const result = await fetchUserImage(
      attachment({ width: MAX_IMAGE_PIXELS, height: 2 }),
    );
    assert.equal(result.error, "tooManyPixels");
    assert.equal(fetchSpy.mock.callCount(), 0, "must not download");
  });

  it("should reject when the downloaded body exceeds the byte cap", async () => {
    // Declared size is small, but the actual body is oversized
    mockFetch(Buffer.alloc(MAX_IMAGE_BYTES + 10, 1));
    const result = await fetchUserImage(attachment({ size: 1024 }));
    assert.equal(result.error, "tooLarge");
  });

  it("should reject unsupported bytes even with an image content type", async () => {
    mockFetch(Buffer.from("not really an image"));
    const result = await fetchUserImage(attachment());
    assert.equal(result.error, "unsupported");
  });

  it("should accept a valid, reasonably sized image", async () => {
    const png = await sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 10, g: 20, b: 30, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
    mockFetch(png);

    const result = await fetchUserImage(attachment({ width: 64, height: 64 }));
    assert.ok(result.buffer, "should return a buffer");
    assert.equal(result.error, undefined);
  });

  it("should reject a decompression bomb caught only at the header", async () => {
    // Attachment lies about dimensions (null), but the header reveals a
    // pixel count over the cap
    const side = Math.ceil(Math.sqrt(MAX_IMAGE_PIXELS)) + 100;
    const bomb = await sharp({
      create: {
        width: side,
        height: side,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();
    mockFetch(bomb);

    const result = await fetchUserImage(
      attachment({ width: null, height: null, size: bomb.length }),
    );
    assert.equal(result.error, "tooManyPixels");
  });
});
