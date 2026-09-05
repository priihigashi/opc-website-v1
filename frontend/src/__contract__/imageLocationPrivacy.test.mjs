import test from 'node:test';
import assert from 'node:assert/strict';
import { hasGpsMetadata } from '../../scripts/image-location-privacy.mjs';
const exif = (little, tag) => {
 const b=Buffer.alloc(26);b.write(little?'II':'MM');
 const u16=(n,o)=>little?b.writeUInt16LE(n,o):b.writeUInt16BE(n,o);
 const u32=(n,o)=>little?b.writeUInt32LE(n,o):b.writeUInt32BE(n,o);
 u16(42,2);u32(8,4);u16(1,8);u16(tag,10);u16(4,12);u32(1,14);u32(26,18);return b;
};
test('deployment privacy guard detects GPS in either TIFF byte order and wrapped containers',()=>{
 for(const little of [true,false])assert.equal(hasGpsMetadata(Buffer.concat([Buffer.from('Exif\0\0'),exif(little,0x8825)])),true);
});
test('orientation-only metadata is allowed and malformed/truncated buffers are safe',()=>{
 assert.equal(hasGpsMetadata(exif(true,274)),false);
 for(const bytes of [Buffer.alloc(0),Buffer.from('II*\0'),exif(true,0x8825).subarray(0,15)])assert.equal(hasGpsMetadata(bytes),false);
});

test('XMP GPS and location fields are blocked without an EXIF pointer',()=>{
 for(const field of ['exif:GPSLatitude','exif:GPSLongitude','exif:GPSPosition','Iptc4xmpCore:Location','Iptc4xmpExt:LocationShown','photoshop:City']) {
  assert.equal(hasGpsMetadata(Buffer.from(`<rdf:Description ${field}="private"/>`)),true);
  assert.equal(hasGpsMetadata(Buffer.from(`<${field}>private</${field}>`)),true);
 }
 assert.equal(hasGpsMetadata(Buffer.from('<dc:title>Home construction</dc:title>')),false);
});
