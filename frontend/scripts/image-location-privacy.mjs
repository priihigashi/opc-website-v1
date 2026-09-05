// EXIF GPS pointer detection independent of the surrounding JPEG/WebP/PNG/AVIF
// container. Orientation-only EXIF is allowed so photographs remain unchanged.
export function hasGpsMetadata(bytes) {
  // Common XMP location properties can exist without any TIFF GPS pointer.
  if (/(?:exif:GPS(?:Latitude|Longitude|Position)|Iptc4xmpCore:Location|Iptc4xmpExt:Location(?:Shown|Created)|photoshop:(?:City|State|Country))\s*(?:=|>)/i.test(bytes.toString("latin1"))) return true;
  for (const [signature, little] of [[Buffer.from([0x49,0x49,0x2a,0]),true],[Buffer.from([0x4d,0x4d,0,0x2a]),false]]) {
    let base = bytes.indexOf(signature);
    while (base !== -1) {
      const u16 = offset => little ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
      const u32 = offset => little ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
      if (base + 8 <= bytes.length) {
        const directory = base + u32(base + 4);
        if (directory >= base + 8 && directory + 2 <= bytes.length) {
          const count = u16(directory);
          if (count <= 512 && directory + 2 + count * 12 <= bytes.length) {
            for (let index = 0; index < count; index += 1) {
              const entry = directory + 2 + index * 12;
              if (u16(entry) === 0x8825) return true;
            }
          }
        }
      }
      base = bytes.indexOf(signature, base + 4);
    }
  }
  return false;
}
