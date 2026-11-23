import { n as __exportAll, r as __toESM, t as __commonJSMin } from "./rolldown-runtime-SbdDWaPq.js";
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/api.js
/**
* Codes used by the replica for rejecting a message.
* See {@link https://sdk.dfinity.org/docs/interface-spec/#reject-codes | the interface spec}.
*/
var ReplicaRejectCode;
(function(ReplicaRejectCode) {
	ReplicaRejectCode[ReplicaRejectCode["SysFatal"] = 1] = "SysFatal";
	ReplicaRejectCode[ReplicaRejectCode["SysTransient"] = 2] = "SysTransient";
	ReplicaRejectCode[ReplicaRejectCode["DestinationInvalid"] = 3] = "DestinationInvalid";
	ReplicaRejectCode[ReplicaRejectCode["CanisterReject"] = 4] = "CanisterReject";
	ReplicaRejectCode[ReplicaRejectCode["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));
var QueryResponseStatus;
(function(QueryResponseStatus) {
	QueryResponseStatus["Replied"] = "replied";
	QueryResponseStatus["Rejected"] = "rejected";
})(QueryResponseStatus || (QueryResponseStatus = {}));
/**
* Utility function to check if a body is a v2ResponseBody for type safety.
* @param body The body to check
* @returns boolean indicating if the body is a v2ResponseBody
*/
function isV2ResponseBody(body) {
	return body !== null && body !== void 0 && "reject_code" in body;
}
/**
* Utility function to check if a body is a v4ResponseBody for type safety.
* @param body The body to check
* @returns boolean indicating if the body is a v4ResponseBody
*/
function isV4ResponseBody(body) {
	return body !== null && body !== void 0 && "certificate" in body;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/principal/utils/base32.js
var alphabet = "abcdefghijklmnopqrstuvwxyz234567";
var lookupTable = Object.create(null);
for (let i = 0; i < 32; i++) lookupTable[alphabet[i]] = i;
lookupTable["0"] = lookupTable.o;
lookupTable["1"] = lookupTable.i;
/**
* @param input The Uint8Array to encode.
* @returns A Base32 string encoding the input.
*/
function base32Encode(input) {
	let skip = 0;
	let bits = 0;
	let output = "";
	function encodeByte(byte) {
		if (skip < 0) bits |= byte >> -skip;
		else bits = byte << skip & 248;
		if (skip > 3) {
			skip -= 8;
			return 1;
		}
		if (skip < 4) {
			output += alphabet[bits >> 3];
			skip += 5;
		}
		return 0;
	}
	for (let i = 0; i < input.length;) i += encodeByte(input[i]);
	return output + (skip < 0 ? alphabet[bits >> 3] : "");
}
/**
* @param input The base32 encoded string to decode.
*/
function base32Decode(input) {
	let skip = 0;
	let byte = 0;
	const output = new Uint8Array(input.length * 4 / 3 | 0);
	let o = 0;
	function decodeChar(char) {
		let val = lookupTable[char.toLowerCase()];
		if (val === void 0) throw new Error(`Invalid character: ${JSON.stringify(char)}`);
		val <<= 3;
		byte |= val >>> skip;
		skip += 5;
		if (skip >= 8) {
			output[o++] = byte;
			skip -= 8;
			if (skip > 0) byte = val << 5 - skip & 255;
			else byte = 0;
		}
	}
	for (const c of input) decodeChar(c);
	return output.slice(0, o);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/principal/utils/getCrc.js
var lookUpTable = new Uint32Array([
	0,
	1996959894,
	3993919788,
	2567524794,
	124634137,
	1886057615,
	3915621685,
	2657392035,
	249268274,
	2044508324,
	3772115230,
	2547177864,
	162941995,
	2125561021,
	3887607047,
	2428444049,
	498536548,
	1789927666,
	4089016648,
	2227061214,
	450548861,
	1843258603,
	4107580753,
	2211677639,
	325883990,
	1684777152,
	4251122042,
	2321926636,
	335633487,
	1661365465,
	4195302755,
	2366115317,
	997073096,
	1281953886,
	3579855332,
	2724688242,
	1006888145,
	1258607687,
	3524101629,
	2768942443,
	901097722,
	1119000684,
	3686517206,
	2898065728,
	853044451,
	1172266101,
	3705015759,
	2882616665,
	651767980,
	1373503546,
	3369554304,
	3218104598,
	565507253,
	1454621731,
	3485111705,
	3099436303,
	671266974,
	1594198024,
	3322730930,
	2970347812,
	795835527,
	1483230225,
	3244367275,
	3060149565,
	1994146192,
	31158534,
	2563907772,
	4023717930,
	1907459465,
	112637215,
	2680153253,
	3904427059,
	2013776290,
	251722036,
	2517215374,
	3775830040,
	2137656763,
	141376813,
	2439277719,
	3865271297,
	1802195444,
	476864866,
	2238001368,
	4066508878,
	1812370925,
	453092731,
	2181625025,
	4111451223,
	1706088902,
	314042704,
	2344532202,
	4240017532,
	1658658271,
	366619977,
	2362670323,
	4224994405,
	1303535960,
	984961486,
	2747007092,
	3569037538,
	1256170817,
	1037604311,
	2765210733,
	3554079995,
	1131014506,
	879679996,
	2909243462,
	3663771856,
	1141124467,
	855842277,
	2852801631,
	3708648649,
	1342533948,
	654459306,
	3188396048,
	3373015174,
	1466479909,
	544179635,
	3110523913,
	3462522015,
	1591671054,
	702138776,
	2966460450,
	3352799412,
	1504918807,
	783551873,
	3082640443,
	3233442989,
	3988292384,
	2596254646,
	62317068,
	1957810842,
	3939845945,
	2647816111,
	81470997,
	1943803523,
	3814918930,
	2489596804,
	225274430,
	2053790376,
	3826175755,
	2466906013,
	167816743,
	2097651377,
	4027552580,
	2265490386,
	503444072,
	1762050814,
	4150417245,
	2154129355,
	426522225,
	1852507879,
	4275313526,
	2312317920,
	282753626,
	1742555852,
	4189708143,
	2394877945,
	397917763,
	1622183637,
	3604390888,
	2714866558,
	953729732,
	1340076626,
	3518719985,
	2797360999,
	1068828381,
	1219638859,
	3624741850,
	2936675148,
	906185462,
	1090812512,
	3747672003,
	2825379669,
	829329135,
	1181335161,
	3412177804,
	3160834842,
	628085408,
	1382605366,
	3423369109,
	3138078467,
	570562233,
	1426400815,
	3317316542,
	2998733608,
	733239954,
	1555261956,
	3268935591,
	3050360625,
	752459403,
	1541320221,
	2607071920,
	3965973030,
	1969922972,
	40735498,
	2617837225,
	3943577151,
	1913087877,
	83908371,
	2512341634,
	3803740692,
	2075208622,
	213261112,
	2463272603,
	3855990285,
	2094854071,
	198958881,
	2262029012,
	4057260610,
	1759359992,
	534414190,
	2176718541,
	4139329115,
	1873836001,
	414664567,
	2282248934,
	4279200368,
	1711684554,
	285281116,
	2405801727,
	4167216745,
	1634467795,
	376229701,
	2685067896,
	3608007406,
	1308918612,
	956543938,
	2808555105,
	3495958263,
	1231636301,
	1047427035,
	2932959818,
	3654703836,
	1088359270,
	936918e3,
	2847714899,
	3736837829,
	1202900863,
	817233897,
	3183342108,
	3401237130,
	1404277552,
	615818150,
	3134207493,
	3453421203,
	1423857449,
	601450431,
	3009837614,
	3294710456,
	1567103746,
	711928724,
	3020668471,
	3272380065,
	1510334235,
	755167117
]);
/**
* Calculate the CRC32 of a Uint8Array.
* @param buf The Uint8Array to calculate the CRC32 of.
*/
function getCrc32(buf) {
	let crc = -1;
	for (let i = 0; i < buf.length; i++) crc = lookUpTable[(buf[i] ^ crc) & 255] ^ crc >>> 8;
	return (crc ^ -1) >>> 0;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/crypto.js
var crypto$1 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes(out);
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes) {
	abytes(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
var asciis = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function asciiToBase16(ch) {
	if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
	if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
	if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
*/
function hexToBytes(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	if (hasHexBuiltin) return Uint8Array.fromHex(hex);
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Normalizes (non-hex) string or Uint8Array to Uint8Array.
* Warning: when Uint8Array is passed, it would NOT get copied.
* Keep in mind for future mutable operations.
*/
function toBytes(data) {
	if (typeof data === "string") data = utf8ToBytes(data);
	abytes(data);
	return data;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/** For runtime check if class implements interface */
var Hash = class {};
/** Wraps hash function, creating an interface on top of it */
function createHasher$1(hashCons) {
	const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
	const tmp = hashCons();
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = () => hashCons();
	return hashC;
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
	if (crypto$1 && typeof crypto$1.getRandomValues === "function") return crypto$1.getRandomValues(new Uint8Array(bytesLength));
	if (crypto$1 && typeof crypto$1.randomBytes === "function") return Uint8Array.from(crypto$1.randomBytes(bytesLength));
	throw new Error("crypto.getRandomValues must be defined");
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64(view, byteOffset, value, isLE) {
	if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
	const _32n = BigInt(32);
	const _u32_max = BigInt(4294967295);
	const wh = Number(value >> _32n & _u32_max);
	const wl = Number(value & _u32_max);
	const h = isLE ? 4 : 0;
	const l = isLE ? 0 : 4;
	view.setUint32(byteOffset + h, wh, isLE);
	view.setUint32(byteOffset + l, wl, isLE);
}
/** Choice: a ? b : c */
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class extends Hash {
	constructor(blockLen, outputLen, padOffset, isLE) {
		super();
		this.finished = false;
		this.length = 0;
		this.pos = 0;
		this.destroyed = false;
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		data = toBytes(data);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to || (to = new this.constructor());
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
/** Initial SHA224 state. Bits 32..64 of frac part of sqrt of primes 23..53 */
var SHA224_IV = /* @__PURE__ */ Uint32Array.from([
	3238371032,
	914150663,
	812702999,
	4144912697,
	4290775857,
	1750603025,
	1694076839,
	3204075428
]);
/** Initial SHA512 state. Bits 0..64 of frac part of sqrt of primes 2..19 */
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	4089235720,
	3144134277,
	2227873595,
	1013904242,
	4271175723,
	2773480762,
	1595750129,
	1359893119,
	2917565137,
	2600822924,
	725511199,
	528734635,
	4215389547,
	1541459225,
	327033209
]);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_u64.js
/**
* Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
* @todo re-check https://issues.chromium.org/issues/42212588
* @module
*/
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
* [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
*/
/**
* Round constants:
* First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
	constructor(outputLen = 32) {
		super(64, outputLen, 8, false);
		this.A = SHA256_IV[0] | 0;
		this.B = SHA256_IV[1] | 0;
		this.C = SHA256_IV[2] | 0;
		this.D = SHA256_IV[3] | 0;
		this.E = SHA256_IV[4] | 0;
		this.F = SHA256_IV[5] | 0;
		this.G = SHA256_IV[6] | 0;
		this.H = SHA256_IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
var SHA224 = class extends SHA256 {
	constructor() {
		super(28);
		this.A = SHA224_IV[0] | 0;
		this.B = SHA224_IV[1] | 0;
		this.C = SHA224_IV[2] | 0;
		this.D = SHA224_IV[3] | 0;
		this.E = SHA224_IV[4] | 0;
		this.F = SHA224_IV[5] | 0;
		this.G = SHA224_IV[6] | 0;
		this.H = SHA224_IV[7] | 0;
	}
};
var K512 = /* @__PURE__ */ (() => split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends HashMD {
	constructor(outputLen = 64) {
		super(128, outputLen, 16, false);
		this.Ah = SHA512_IV[0] | 0;
		this.Al = SHA512_IV[1] | 0;
		this.Bh = SHA512_IV[2] | 0;
		this.Bl = SHA512_IV[3] | 0;
		this.Ch = SHA512_IV[4] | 0;
		this.Cl = SHA512_IV[5] | 0;
		this.Dh = SHA512_IV[6] | 0;
		this.Dl = SHA512_IV[7] | 0;
		this.Eh = SHA512_IV[8] | 0;
		this.El = SHA512_IV[9] | 0;
		this.Fh = SHA512_IV[10] | 0;
		this.Fl = SHA512_IV[11] | 0;
		this.Gh = SHA512_IV[12] | 0;
		this.Gl = SHA512_IV[13] | 0;
		this.Hh = SHA512_IV[14] | 0;
		this.Hl = SHA512_IV[15] | 0;
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
	set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
		this.Ah = Ah | 0;
		this.Al = Al | 0;
		this.Bh = Bh | 0;
		this.Bl = Bl | 0;
		this.Ch = Ch | 0;
		this.Cl = Cl | 0;
		this.Dh = Dh | 0;
		this.Dl = Dl | 0;
		this.Eh = Eh | 0;
		this.El = El | 0;
		this.Fh = Fh | 0;
		this.Fl = Fl | 0;
		this.Gh = Gh | 0;
		this.Gl = Gl | 0;
		this.Hh = Hh | 0;
		this.Hl = Hl | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) {
			SHA512_W_H[i] = view.getUint32(offset);
			SHA512_W_L[i] = view.getUint32(offset += 4);
		}
		for (let i = 16; i < 80; i++) {
			const W15h = SHA512_W_H[i - 15] | 0;
			const W15l = SHA512_W_L[i - 15] | 0;
			const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
			const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
			const W2h = SHA512_W_H[i - 2] | 0;
			const W2l = SHA512_W_L[i - 2] | 0;
			const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
			const SUMl = add4L(s0l, rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6), SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
			SHA512_W_H[i] = SUMh | 0;
			SHA512_W_L[i] = SUMl | 0;
		}
		let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		for (let i = 0; i < 80; i++) {
			const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
			const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
			const CHIh = Eh & Fh ^ ~Eh & Gh;
			const CHIl = El & Fl ^ ~El & Gl;
			const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
			const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
			const T1l = T1ll | 0;
			const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
			const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
			const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
			const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
			Hh = Gh | 0;
			Hl = Gl | 0;
			Gh = Fh | 0;
			Gl = Fl | 0;
			Fh = Eh | 0;
			Fl = El | 0;
			({h: Eh, l: El} = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
			Dh = Ch | 0;
			Dl = Cl | 0;
			Ch = Bh | 0;
			Cl = Bl | 0;
			Bh = Ah | 0;
			Bl = Al | 0;
			const All = add3L(T1l, sigma0l, MAJl);
			Ah = add3H(All, T1h, sigma0h, MAJh);
			Al = All | 0;
		}
		({h: Ah, l: Al} = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		clean(SHA512_W_H, SHA512_W_L);
	}
	destroy() {
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/**
* SHA2-256 hash function from RFC 4634.
*
* It is the fastest JS hash, even faster than Blake3.
* To break sha256 using birthday attack, attackers need to try 2^128 hashes.
* BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
*/
var sha256 = /* @__PURE__ */ createHasher$1(() => new SHA256());
/** SHA2-224 hash function from RFC 4634 */
var sha224 = /* @__PURE__ */ createHasher$1(() => new SHA224());
/** SHA2-512 hash function from RFC 4634. */
var sha512 = /* @__PURE__ */ createHasher$1(() => new SHA512());
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/principal/principal.js
var JSON_KEY_PRINCIPAL = "__principal__";
var SELF_AUTHENTICATING_SUFFIX = 2;
var ANONYMOUS_SUFFIX = 4;
var MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR = "aaaaa-aa";
var Principal$1 = class Principal$1 {
	static anonymous() {
		return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
	}
	/**
	* Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
	* @returns {Principal} principal of the management canister
	*/
	static managementCanister() {
		return this.fromText(MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR);
	}
	static selfAuthenticating(publicKey) {
		const sha = sha224(publicKey);
		return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
	}
	static from(other) {
		if (typeof other === "string") return Principal$1.fromText(other);
		if (Object.getPrototypeOf(other) === Uint8Array.prototype) return new Principal$1(other);
		if (Principal$1.isPrincipal(other)) return new Principal$1(other._arr);
		throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
	}
	static fromHex(hex) {
		return new this(hexToBytes(hex));
	}
	static fromText(text) {
		let maybePrincipal = text;
		if (text.includes("__principal__")) {
			const obj = JSON.parse(text);
			if ("__principal__" in obj) maybePrincipal = obj[JSON_KEY_PRINCIPAL];
		}
		let arr = base32Decode(maybePrincipal.toLowerCase().replace(/-/g, ""));
		arr = arr.slice(4, arr.length);
		const principal = new this(arr);
		if (principal.toText() !== maybePrincipal) throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
		return principal;
	}
	static fromUint8Array(arr) {
		return new this(arr);
	}
	static isPrincipal(other) {
		return other instanceof Principal$1 || typeof other === "object" && other !== null && "_isPrincipal" in other && other["_isPrincipal"] === true && "_arr" in other && other["_arr"] instanceof Uint8Array;
	}
	constructor(_arr) {
		this._arr = _arr;
		this._isPrincipal = true;
	}
	isAnonymous() {
		return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
	}
	toUint8Array() {
		return this._arr;
	}
	toHex() {
		return bytesToHex(this._arr).toUpperCase();
	}
	toText() {
		const checksumArrayBuf = /* @__PURE__ */ new ArrayBuffer(4);
		new DataView(checksumArrayBuf).setUint32(0, getCrc32(this._arr));
		const checksum = new Uint8Array(checksumArrayBuf);
		const matches = base32Encode(new Uint8Array([...checksum, ...this._arr])).match(/.{1,5}/g);
		if (!matches) throw new Error();
		return matches.join("-");
	}
	toString() {
		return this.toText();
	}
	/**
	* Serializes to JSON
	* @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
	*/
	toJSON() {
		return { [JSON_KEY_PRINCIPAL]: this.toText() };
	}
	/**
	* Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
	* @param {Principal} other - a {@link Principal} to compare
	* @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
	*/
	compareTo(other) {
		for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) {
			if (this._arr[i] < other._arr[i]) return "lt";
			if (this._arr[i] > other._arr[i]) return "gt";
		}
		if (this._arr.length < other._arr.length) return "lt";
		if (this._arr.length > other._arr.length) return "gt";
		return "eq";
	}
	/**
	* Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
	* @param other a {@link Principal} to compare
	* @returns {boolean} boolean
	*/
	ltEq(other) {
		const cmp = this.compareTo(other);
		return cmp == "lt" || cmp == "eq";
	}
	/**
	* Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
	* @param other a {@link Principal} to compare
	* @returns {boolean} boolean
	*/
	gtEq(other) {
		const cmp = this.compareTo(other);
		return cmp == "gt" || cmp == "eq";
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/errors.js
var ErrorKindEnum;
(function(ErrorKindEnum) {
	ErrorKindEnum["Trust"] = "Trust";
	ErrorKindEnum["Protocol"] = "Protocol";
	ErrorKindEnum["Reject"] = "Reject";
	ErrorKindEnum["Transport"] = "Transport";
	ErrorKindEnum["External"] = "External";
	ErrorKindEnum["Limit"] = "Limit";
	ErrorKindEnum["Input"] = "Input";
	ErrorKindEnum["Unknown"] = "Unknown";
})(ErrorKindEnum || (ErrorKindEnum = {}));
/**
* Controls the level of detail included in error messages.
* - `Normal` (default): includes error message, call context, and HTTP details, but omits large binary fields (arg, certificate, nonce).
* - `Verbose`: same as Normal, but includes hex-encoded binary fields.
*
* To enable verbose mode: `ErrorCode.verbosity = ErrorVerbosity.Verbose`
*/
var ErrorVerbosity;
(function(ErrorVerbosity) {
	ErrorVerbosity["Normal"] = "normal";
	ErrorVerbosity["Verbose"] = "verbose";
})(ErrorVerbosity || (ErrorVerbosity = {}));
var VERBOSE_ONLY_KEYS = /* @__PURE__ */ new Set([
	"arg",
	"certificate",
	"nonce"
]);
function bytesReplacer(verbosity) {
	return (key, value) => {
		if (value instanceof Uint8Array) {
			if (verbosity === ErrorVerbosity.Normal && VERBOSE_ONLY_KEYS.has(key)) return `<${value.length} bytes, set ErrorCode.verbosity = ErrorVerbosity.Verbose to display>`;
			return `hex(${value.length}):${bytesToHex(value)}`;
		}
		return value;
	};
}
var ErrorCode = class ErrorCode {
	static {
		this.verbosity = ErrorVerbosity.Normal;
	}
	constructor(isCertified = false) {
		this.isCertified = isCertified;
	}
	toString() {
		let errorMessage = this.toErrorMessage();
		if (this.requestContext) errorMessage += `\nRequest context:\n  Request ID (hex): ${this.requestContext.requestId ? bytesToHex(this.requestContext.requestId) : "undefined"}\n  Sender pubkey (hex): ${bytesToHex(this.requestContext.senderPubKey)}\n  Sender signature (hex): ${bytesToHex(this.requestContext.senderSignature)}\n  Ingress expiry: ${this.requestContext.ingressExpiry.toString()}`;
		if (this.callContext) {
			errorMessage += `\nCall context:\n  Canister ID: ${this.callContext.canisterId.toText()}\n  Method name: ${this.callContext.methodName}`;
			if ("httpDetails" in this.callContext) errorMessage += `\n  HTTP details: ${JSON.stringify(this.callContext.httpDetails, bytesReplacer(ErrorCode.verbosity), 2)}`;
		}
		return errorMessage;
	}
};
/**
* An error that happens in the Agent. This is the root of all errors and should be used
* everywhere in the Agent code (this package).
*
* To know if the error is certified, use the `isCertified` getter.
*/
var AgentError = class AgentError extends Error {
	get code() {
		return this.cause.code;
	}
	set code(code) {
		this.cause.code = code;
	}
	get kind() {
		return this.cause.kind;
	}
	set kind(kind) {
		this.cause.kind = kind;
	}
	/**
	* Reads the `isCertified` property of the underlying error code.
	* @returns `true` if the error is certified, `false` otherwise.
	*/
	get isCertified() {
		return this.code.isCertified;
	}
	constructor(code, kind) {
		super(code.toString());
		this.name = "AgentError";
		this.cause = {
			code,
			kind
		};
		Object.setPrototypeOf(this, AgentError.prototype);
	}
	hasCode(code) {
		return this.code instanceof code;
	}
	toString() {
		return `${this.name} (${this.kind}): ${this.message}`;
	}
};
var ErrorKind = class extends AgentError {
	static fromCode(code) {
		return new this(code);
	}
};
var TrustError = class TrustError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Trust);
		this.name = "TrustError";
		Object.setPrototypeOf(this, TrustError.prototype);
	}
};
var ProtocolError = class ProtocolError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Protocol);
		this.name = "ProtocolError";
		Object.setPrototypeOf(this, ProtocolError.prototype);
	}
};
var RejectError = class RejectError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Reject);
		this.name = "RejectError";
		Object.setPrototypeOf(this, RejectError.prototype);
	}
};
var TransportError = class TransportError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Transport);
		this.name = "TransportError";
		Object.setPrototypeOf(this, TransportError.prototype);
	}
};
var ExternalError = class ExternalError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.External);
		this.name = "ExternalError";
		Object.setPrototypeOf(this, ExternalError.prototype);
	}
};
var InputError = class InputError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Input);
		this.name = "InputError";
		Object.setPrototypeOf(this, InputError.prototype);
	}
};
var UnknownError = class UnknownError extends ErrorKind {
	constructor(code) {
		super(code, ErrorKindEnum.Unknown);
		this.name = "UnknownError";
		Object.setPrototypeOf(this, UnknownError.prototype);
	}
};
var CertificateVerificationErrorCode = class CertificateVerificationErrorCode extends ErrorCode {
	constructor(reason, error) {
		super();
		this.reason = reason;
		this.error = error;
		this.name = "CertificateVerificationErrorCode";
		Object.setPrototypeOf(this, CertificateVerificationErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = this.reason;
		if (this.error) errorMessage += `: ${formatUnknownError(this.error)}`;
		return `Certificate verification error: "${errorMessage}"`;
	}
};
var CertificateTimeErrorCode = class CertificateTimeErrorCode extends ErrorCode {
	constructor(maxAgeInMinutes, certificateTime, currentTime, timeDiffMsecs, ageType) {
		super();
		this.maxAgeInMinutes = maxAgeInMinutes;
		this.certificateTime = certificateTime;
		this.currentTime = currentTime;
		this.timeDiffMsecs = timeDiffMsecs;
		this.ageType = ageType;
		this.name = "CertificateTimeErrorCode";
		Object.setPrototypeOf(this, CertificateTimeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Certificate is signed more than ${this.maxAgeInMinutes} minutes in the ${this.ageType}. Certificate time: ${this.certificateTime.toISOString()} Current time: ${this.currentTime.toISOString()} Clock drift: ${this.timeDiffMsecs}ms`;
	}
};
var CertificateHasTooManyDelegationsErrorCode = class CertificateHasTooManyDelegationsErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "CertificateHasTooManyDelegationsErrorCode";
		Object.setPrototypeOf(this, CertificateHasTooManyDelegationsErrorCode.prototype);
	}
	toErrorMessage() {
		return "Certificate has too many delegations";
	}
};
var CertificateNotAuthorizedErrorCode = class CertificateNotAuthorizedErrorCode extends ErrorCode {
	constructor(canisterId, subnetId) {
		super();
		this.canisterId = canisterId;
		this.subnetId = subnetId;
		this.name = "CertificateNotAuthorizedErrorCode";
		Object.setPrototypeOf(this, CertificateNotAuthorizedErrorCode.prototype);
	}
	toErrorMessage() {
		return `The certificate contains a delegation that does not include the canister ${this.canisterId.toText()} in the canister_ranges field. Subnet ID: ${this.subnetId.toText()}`;
	}
};
var CertificateNotAuthorizedForSubnetErrorCode = class CertificateNotAuthorizedForSubnetErrorCode extends ErrorCode {
	constructor(subnetId) {
		super();
		this.subnetId = subnetId;
		this.name = "CertificateNotAuthorizedForSubnetErrorCode";
		Object.setPrototypeOf(this, CertificateNotAuthorizedForSubnetErrorCode.prototype);
	}
	toErrorMessage() {
		return `The certificate is not authorized for subnet ${this.subnetId.toText()}`;
	}
};
var LookupErrorCode = class LookupErrorCode extends ErrorCode {
	constructor(message, lookupStatus) {
		super();
		this.message = message;
		this.lookupStatus = lookupStatus;
		this.name = "LookupErrorCode";
		Object.setPrototypeOf(this, LookupErrorCode.prototype);
	}
	toErrorMessage() {
		return `${this.message}. Lookup status: ${this.lookupStatus}`;
	}
};
var MalformedLookupFoundValueErrorCode = class MalformedLookupFoundValueErrorCode extends ErrorCode {
	constructor(message) {
		super();
		this.message = message;
		this.name = "MalformedLookupFoundValueErrorCode";
		Object.setPrototypeOf(this, MalformedLookupFoundValueErrorCode.prototype);
	}
	toErrorMessage() {
		return this.message;
	}
};
var MissingLookupValueErrorCode = class MissingLookupValueErrorCode extends ErrorCode {
	constructor(message) {
		super();
		this.message = message;
		this.name = "MissingLookupValueErrorCode";
		Object.setPrototypeOf(this, MissingLookupValueErrorCode.prototype);
	}
	toErrorMessage() {
		return this.message;
	}
};
var DerKeyLengthMismatchErrorCode = class DerKeyLengthMismatchErrorCode extends ErrorCode {
	constructor(expectedLength, actualLength) {
		super();
		this.expectedLength = expectedLength;
		this.actualLength = actualLength;
		this.name = "DerKeyLengthMismatchErrorCode";
		Object.setPrototypeOf(this, DerKeyLengthMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `BLS DER-encoded public key must be ${this.expectedLength} bytes long, but is ${this.actualLength} bytes long`;
	}
};
var DerPrefixMismatchErrorCode = class DerPrefixMismatchErrorCode extends ErrorCode {
	constructor(expectedPrefix, actualPrefix) {
		super();
		this.expectedPrefix = expectedPrefix;
		this.actualPrefix = actualPrefix;
		this.name = "DerPrefixMismatchErrorCode";
		Object.setPrototypeOf(this, DerPrefixMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `BLS DER-encoded public key is invalid. Expected the following prefix: ${bytesToHex(this.expectedPrefix)}, but got ${bytesToHex(this.actualPrefix)}`;
	}
};
var DerDecodeLengthMismatchErrorCode = class DerDecodeLengthMismatchErrorCode extends ErrorCode {
	constructor(expectedLength, actualLength) {
		super();
		this.expectedLength = expectedLength;
		this.actualLength = actualLength;
		this.name = "DerDecodeLengthMismatchErrorCode";
		Object.setPrototypeOf(this, DerDecodeLengthMismatchErrorCode.prototype);
	}
	toErrorMessage() {
		return `DER payload mismatch: Expected length ${this.expectedLength}, actual length: ${this.actualLength}`;
	}
};
var DerDecodeErrorCode = class DerDecodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "DerDecodeErrorCode";
		Object.setPrototypeOf(this, DerDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode DER: ${this.error}`;
	}
};
var DerEncodeErrorCode = class DerEncodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "DerEncodeErrorCode";
		Object.setPrototypeOf(this, DerEncodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to encode DER: ${this.error}`;
	}
};
var CborDecodeErrorCode = class CborDecodeErrorCode extends ErrorCode {
	constructor(error, input) {
		super();
		this.error = error;
		this.input = input;
		this.name = "CborDecodeErrorCode";
		Object.setPrototypeOf(this, CborDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode CBOR: ${formatUnknownError(this.error)}, input: ${bytesToHex(this.input)}`;
	}
};
var CborEncodeErrorCode = class CborEncodeErrorCode extends ErrorCode {
	constructor(error, value) {
		super();
		this.error = error;
		this.value = value;
		this.name = "CborEncodeErrorCode";
		Object.setPrototypeOf(this, CborEncodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to encode CBOR: ${formatUnknownError(this.error)}, input: ${this.value}`;
	}
};
var TimeoutWaitingForResponseErrorCode = class TimeoutWaitingForResponseErrorCode extends ErrorCode {
	constructor(message, requestId, status) {
		super();
		this.message = message;
		this.requestId = requestId;
		this.status = status;
		this.name = "TimeoutWaitingForResponseErrorCode";
		Object.setPrototypeOf(this, TimeoutWaitingForResponseErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = `${this.message}\n`;
		if (this.requestId) errorMessage += `  Request ID: ${bytesToHex(this.requestId)}\n`;
		if (this.status) errorMessage += `  Request status: ${this.status}\n`;
		return errorMessage;
	}
};
var CertificateOutdatedErrorCode = class CertificateOutdatedErrorCode extends ErrorCode {
	constructor(maxIngressExpiryInMinutes, requestId, retryTimes) {
		super();
		this.maxIngressExpiryInMinutes = maxIngressExpiryInMinutes;
		this.requestId = requestId;
		this.retryTimes = retryTimes;
		this.name = "CertificateOutdatedErrorCode";
		Object.setPrototypeOf(this, CertificateOutdatedErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = `Certificate is stale (over ${this.maxIngressExpiryInMinutes} minutes). Is the computer's clock synchronized?\n  Request ID: ${bytesToHex(this.requestId)}\n`;
		if (this.retryTimes !== void 0) errorMessage += `  Retried ${this.retryTimes} times.`;
		return errorMessage;
	}
};
var CertifiedRejectErrorCode = class CertifiedRejectErrorCode extends ErrorCode {
	constructor(requestId, rejectCode, rejectMessage, rejectErrorCode) {
		super(true);
		this.requestId = requestId;
		this.rejectCode = rejectCode;
		this.rejectMessage = rejectMessage;
		this.rejectErrorCode = rejectErrorCode;
		this.name = "CertifiedRejectErrorCode";
		Object.setPrototypeOf(this, CertifiedRejectErrorCode.prototype);
	}
	toErrorMessage() {
		return `The replica returned a rejection error:\n  Request ID: ${bytesToHex(this.requestId)}\n  Reject code: ${this.rejectCode}\n  Reject text: ${this.rejectMessage}\n  Error code: ${this.rejectErrorCode}\n`;
	}
};
var UncertifiedRejectErrorCode = class UncertifiedRejectErrorCode extends ErrorCode {
	constructor(requestId, rejectCode, rejectMessage, rejectErrorCode, signatures) {
		super();
		this.requestId = requestId;
		this.rejectCode = rejectCode;
		this.rejectMessage = rejectMessage;
		this.rejectErrorCode = rejectErrorCode;
		this.signatures = signatures;
		this.name = "UncertifiedRejectErrorCode";
		Object.setPrototypeOf(this, UncertifiedRejectErrorCode.prototype);
	}
	toErrorMessage() {
		return `The replica returned a rejection error:\n  Request ID: ${bytesToHex(this.requestId)}\n  Reject code: ${this.rejectCode}\n  Reject text: ${this.rejectMessage}\n  Error code: ${this.rejectErrorCode}\n`;
	}
};
var UncertifiedRejectUpdateErrorCode = class UncertifiedRejectUpdateErrorCode extends ErrorCode {
	constructor(requestId, rejectCode, rejectMessage, rejectErrorCode) {
		super();
		this.requestId = requestId;
		this.rejectCode = rejectCode;
		this.rejectMessage = rejectMessage;
		this.rejectErrorCode = rejectErrorCode;
		this.name = "UncertifiedRejectUpdateErrorCode";
		Object.setPrototypeOf(this, UncertifiedRejectUpdateErrorCode.prototype);
	}
	toErrorMessage() {
		return `The replica returned a rejection error:\n  Request ID: ${bytesToHex(this.requestId)}\n  Reject code: ${this.rejectCode}\n  Reject text: ${this.rejectMessage}\n  Error code: ${this.rejectErrorCode}\n`;
	}
};
var RequestStatusDoneNoReplyErrorCode = class RequestStatusDoneNoReplyErrorCode extends ErrorCode {
	constructor(requestId) {
		super();
		this.requestId = requestId;
		this.name = "RequestStatusDoneNoReplyErrorCode";
		Object.setPrototypeOf(this, RequestStatusDoneNoReplyErrorCode.prototype);
	}
	toErrorMessage() {
		return `Call was marked as done but we never saw the reply:\n  Request ID: ${bytesToHex(this.requestId)}\n`;
	}
};
var MissingRootKeyErrorCode = class MissingRootKeyErrorCode extends ErrorCode {
	constructor(shouldFetchRootKey) {
		super();
		this.shouldFetchRootKey = shouldFetchRootKey;
		this.name = "MissingRootKeyErrorCode";
		Object.setPrototypeOf(this, MissingRootKeyErrorCode.prototype);
	}
	toErrorMessage() {
		if (this.shouldFetchRootKey === void 0) return "Agent is missing root key";
		return `Agent is missing root key and the shouldFetchRootKey value is set to ${this.shouldFetchRootKey}. The root key should only be unknown if you are in local development. Otherwise you should avoid fetching and use the default IC Root Key or the known root key of your environment.`;
	}
};
var HashValueErrorCode = class HashValueErrorCode extends ErrorCode {
	constructor(value) {
		super();
		this.value = value;
		this.name = "HashValueErrorCode";
		Object.setPrototypeOf(this, HashValueErrorCode.prototype);
	}
	toErrorMessage() {
		return `Attempt to hash a value of unsupported type: ${this.value}`;
	}
};
var IdentityInvalidErrorCode = class IdentityInvalidErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "IdentityInvalidErrorCode";
		Object.setPrototypeOf(this, IdentityInvalidErrorCode.prototype);
	}
	toErrorMessage() {
		return "This identity has expired due this application's security policy. Please refresh your authentication.";
	}
};
var IngressExpiryInvalidErrorCode = class IngressExpiryInvalidErrorCode extends ErrorCode {
	constructor(message, providedIngressExpiryInMinutes) {
		super();
		this.message = message;
		this.providedIngressExpiryInMinutes = providedIngressExpiryInMinutes;
		this.name = "IngressExpiryInvalidErrorCode";
		Object.setPrototypeOf(this, IngressExpiryInvalidErrorCode.prototype);
	}
	toErrorMessage() {
		return `${this.message}. Provided ingress expiry time is ${this.providedIngressExpiryInMinutes} minutes.`;
	}
};
var MissingFetchErrorCode = class MissingFetchErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "MissingFetchErrorCode";
		Object.setPrototypeOf(this, MissingFetchErrorCode.prototype);
	}
	toErrorMessage() {
		return "No fetch implementation available. Provide a `fetch` function in HttpAgentOptions or ensure `globalThis.fetch` is defined.";
	}
};
var CreateHttpAgentErrorCode = class CreateHttpAgentErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "CreateHttpAgentErrorCode";
		Object.setPrototypeOf(this, CreateHttpAgentErrorCode.prototype);
	}
	toErrorMessage() {
		return "Failed to create agent from provided agent";
	}
};
var ExcessiveSignaturesErrorCode = class ExcessiveSignaturesErrorCode extends ErrorCode {
	constructor(signatureCount, maxExpected) {
		super();
		this.signatureCount = signatureCount;
		this.maxExpected = maxExpected;
		this.name = "ExcessiveSignaturesErrorCode";
		Object.setPrototypeOf(this, ExcessiveSignaturesErrorCode.prototype);
	}
	toErrorMessage() {
		return `Query response contains ${this.signatureCount} signatures, which exceeds the subnet size of ${this.maxExpected}. This suggests a malformed or malicious response.`;
	}
};
var MalformedSignatureErrorCode = class MalformedSignatureErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "MalformedSignatureErrorCode";
		Object.setPrototypeOf(this, MalformedSignatureErrorCode.prototype);
	}
	toErrorMessage() {
		return `Query response contained a malformed signature: ${this.error}`;
	}
};
var MalformedPublicKeyErrorCode = class MalformedPublicKeyErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "MalformedPublicKeyErrorCode";
		Object.setPrototypeOf(this, MalformedPublicKeyErrorCode.prototype);
	}
	toErrorMessage() {
		return "Read state response contained a malformed public key";
	}
};
var QuerySignatureVerificationFailedErrorCode = class QuerySignatureVerificationFailedErrorCode extends ErrorCode {
	constructor(nodeId) {
		super();
		this.nodeId = nodeId;
		this.name = "QuerySignatureVerificationFailedErrorCode";
		Object.setPrototypeOf(this, QuerySignatureVerificationFailedErrorCode.prototype);
	}
	toErrorMessage() {
		return `Query signature verification failed. Node ID: ${this.nodeId}`;
	}
};
var UnexpectedErrorCode = class UnexpectedErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "UnexpectedErrorCode";
		Object.setPrototypeOf(this, UnexpectedErrorCode.prototype);
	}
	toErrorMessage() {
		return `Unexpected error: ${formatUnknownError(this.error)}`;
	}
};
var UnexpectedV4StatusErrorCode = class UnexpectedV4StatusErrorCode extends ErrorCode {
	constructor(status, requestId, response, rawCertificate) {
		super();
		this.status = status;
		this.requestId = requestId;
		this.response = response;
		this.rawCertificate = rawCertificate;
		this.name = "UnexpectedV4StatusErrorCode";
		Object.setPrototypeOf(this, UnexpectedV4StatusErrorCode.prototype);
	}
	toErrorMessage() {
		const replacer = (_k, v) => v instanceof Uint8Array ? `hex(${v.length}):${bytesToHex(v)}` : v;
		return `Unexpected request status in v4 sync response: "${this.status}"\n  Request ID (hex): ${bytesToHex(this.requestId)}\n  Response: ${JSON.stringify(this.response, replacer, 2)}`;
	}
};
var HashTreeDecodeErrorCode = class HashTreeDecodeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "HashTreeDecodeErrorCode";
		Object.setPrototypeOf(this, HashTreeDecodeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to decode certificate: ${this.error}`;
	}
};
var HttpErrorCode = class HttpErrorCode extends ErrorCode {
	constructor(status, statusText, headers, bodyText) {
		super();
		this.status = status;
		this.statusText = statusText;
		this.headers = headers;
		this.bodyText = bodyText;
		this.name = "HttpErrorCode";
		Object.setPrototypeOf(this, HttpErrorCode.prototype);
	}
	toErrorMessage() {
		let errorMessage = `HTTP request failed:
  Status: ${this.status} (${this.statusText})\n  Headers: ${JSON.stringify(this.headers, bytesReplacer(ErrorCode.verbosity))}\n`;
		if (this.bodyText) errorMessage += `  Body: ${this.bodyText}\n`;
		return errorMessage;
	}
};
var HttpV4ApiNotSupportedErrorCode = class HttpV4ApiNotSupportedErrorCode extends ErrorCode {
	constructor() {
		super();
		this.name = "HttpV4ApiNotSupportedErrorCode";
		Object.setPrototypeOf(this, HttpV4ApiNotSupportedErrorCode.prototype);
	}
	toErrorMessage() {
		return "HTTP request failed: v4 API is not supported";
	}
};
var HttpFetchErrorCode = class HttpFetchErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "HttpFetchErrorCode";
		Object.setPrototypeOf(this, HttpFetchErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to fetch HTTP request: ${formatUnknownError(this.error)}`;
	}
};
var MissingCanisterIdErrorCode = class MissingCanisterIdErrorCode extends ErrorCode {
	constructor(receivedCanisterId) {
		super();
		this.receivedCanisterId = receivedCanisterId;
		this.name = "MissingCanisterIdErrorCode";
		Object.setPrototypeOf(this, MissingCanisterIdErrorCode.prototype);
	}
	toErrorMessage() {
		return `Canister ID is required, but received ${typeof this.receivedCanisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`;
	}
};
var InvalidReadStateRequestErrorCode = class InvalidReadStateRequestErrorCode extends ErrorCode {
	constructor(request) {
		super();
		this.request = request;
		this.name = "InvalidReadStateRequestErrorCode";
		Object.setPrototypeOf(this, InvalidReadStateRequestErrorCode.prototype);
	}
	toErrorMessage() {
		return `Invalid read state request: ${this.request}`;
	}
};
var ExpiryJsonDeserializeErrorCode = class ExpiryJsonDeserializeErrorCode extends ErrorCode {
	constructor(error) {
		super();
		this.error = error;
		this.name = "ExpiryJsonDeserializeErrorCode";
		Object.setPrototypeOf(this, ExpiryJsonDeserializeErrorCode.prototype);
	}
	toErrorMessage() {
		return `Failed to deserialize expiry: ${this.error}`;
	}
};
function formatUnknownError(error) {
	if (error instanceof Error) return error.stack ?? error.message;
	try {
		return JSON.stringify(error, bytesReplacer(ErrorCode.verbosity));
	} catch {
		return String(error);
	}
}
/**
* Special error used to indicate that a code path is unreachable.
*
* For internal use only.
*/
var UNREACHABLE_ERROR = /* @__PURE__ */ new Error("unreachable");
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/buffer.js
/**
* Concatenate multiple Uint8Arrays.
* @param uint8Arrays The Uint8Arrays to concatenate.
*/
function concat(...uint8Arrays) {
	const result = new Uint8Array(uint8Arrays.reduce((acc, curr) => acc + curr.byteLength, 0));
	let index = 0;
	for (const b of uint8Arrays) {
		result.set(b, index);
		index += b.byteLength;
	}
	return result;
}
/**
* A class that abstracts a pipe-like Uint8Array.
*/
var PipeArrayBuffer = class {
	/**
	* Save a checkpoint of the reading view (for backtracking)
	*/
	save() {
		return this._view;
	}
	/**
	* Restore a checkpoint of the reading view (for backtracking)
	* @param checkPoint a previously saved checkpoint
	*/
	restore(checkPoint) {
		if (!(checkPoint instanceof Uint8Array)) throw new Error("Checkpoint must be a Uint8Array");
		this._view = checkPoint;
	}
	/**
	* Creates a new instance of a pipe
	* @param buffer an optional buffer to start with
	* @param length an optional amount of bytes to use for the length.
	*/
	constructor(buffer, length = buffer?.byteLength || 0) {
		if (buffer && !(buffer instanceof Uint8Array)) try {
			buffer = uint8FromBufLike$1(buffer);
		} catch {
			throw new Error("Buffer must be a Uint8Array");
		}
		if (length < 0 || !Number.isInteger(length)) throw new Error("Length must be a non-negative integer");
		if (buffer && length > buffer.byteLength) throw new Error("Length cannot exceed buffer length");
		this._buffer = buffer || /* @__PURE__ */ new Uint8Array(0);
		this._view = new Uint8Array(this._buffer.buffer, 0, length);
	}
	get buffer() {
		return this._view.slice();
	}
	get byteLength() {
		return this._view.byteLength;
	}
	/**
	* Read `num` number of bytes from the front of the pipe.
	* @param num The number of bytes to read.
	*/
	read(num) {
		const result = this._view.subarray(0, num);
		this._view = this._view.subarray(num);
		return result.slice();
	}
	readUint8() {
		if (this._view.byteLength === 0) return;
		const result = this._view[0];
		this._view = this._view.subarray(1);
		return result;
	}
	/**
	* Write a buffer to the end of the pipe.
	* @param buf The bytes to write.
	*/
	write(buf) {
		if (!(buf instanceof Uint8Array)) throw new Error("Buffer must be a Uint8Array");
		const offset = this._view.byteLength;
		if (this._view.byteOffset + this._view.byteLength + buf.byteLength >= this._buffer.byteLength) this.alloc(buf.byteLength);
		else this._view = new Uint8Array(this._buffer.buffer, this._view.byteOffset, this._view.byteLength + buf.byteLength);
		this._view.set(buf, offset);
	}
	/**
	* Whether or not there is more data to read from the buffer
	*/
	get end() {
		return this._view.byteLength === 0;
	}
	/**
	* Allocate a fixed amount of memory in the buffer. This does not affect the view.
	* @param amount A number of bytes to add to the buffer.
	*/
	alloc(amount) {
		if (amount <= 0 || !Number.isInteger(amount)) throw new Error("Amount must be a positive integer");
		const b = new Uint8Array((this._buffer.byteLength + amount) * 1.2 | 0);
		const v = new Uint8Array(b.buffer, 0, this._view.byteLength + amount);
		v.set(this._view);
		this._buffer = b;
		this._view = v;
	}
};
/**
* Returns a true Uint8Array from an ArrayBufferLike object.
* @param bufLike a buffer-like object
* @returns Uint8Array
*/
function uint8FromBufLike$1(bufLike) {
	if (!bufLike) throw new Error("Input cannot be null or undefined");
	if (bufLike instanceof Uint8Array) return bufLike;
	if (bufLike instanceof ArrayBuffer) return new Uint8Array(bufLike);
	if (Array.isArray(bufLike)) return new Uint8Array(bufLike);
	if ("buffer" in bufLike) return uint8FromBufLike$1(bufLike.buffer);
	return new Uint8Array(bufLike);
}
/**
*
* @param u1 uint8Array 1
* @param u2 uint8Array 2
* @returns number - negative if u1 < u2, positive if u1 > u2, 0 if u1 === u2
*/
function compare(u1, u2) {
	if (u1.byteLength !== u2.byteLength) return u1.byteLength - u2.byteLength;
	for (let i = 0; i < u1.length; i++) if (u1[i] !== u2[i]) return u1[i] - u2[i];
	return 0;
}
/**
* Checks two uint8Arrays for equality.
* @param u1 uint8Array 1
* @param u2 uint8Array 2
* @returns boolean
*/
function uint8Equals$1(u1, u2) {
	return compare(u1, u2) === 0;
}
/**
* Helpers to convert a Uint8Array to a DataView.
* @param uint8 Uint8Array
* @returns DataView
*/
function uint8ToDataView(uint8) {
	if (!(uint8 instanceof Uint8Array)) throw new Error("Input must be a Uint8Array");
	return new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/hash.js
/**
* Hashes a string to a number. Algorithm can be found here:
* https://caml.inria.fr/pub/papers/garrigue-polymorphic_variants-ml98.pdf
* @param s - string to hash
* @returns number representing hashed string
*/
function idlHash(s) {
	const array = new TextEncoder().encode(s);
	let h = 0;
	for (const c of array) h = (h * 223 + c) % 2 ** 32;
	return h;
}
/**
*
* @param label string
* @returns number representing hashed label
*/
function idlLabelToId(label) {
	if (/^_\d+_$/.test(label) || /^_0x[0-9a-fA-F]+_$/.test(label)) {
		const num = +label.slice(1, -1);
		if (Number.isSafeInteger(num) && num >= 0 && num < 2 ** 32) return num;
	}
	return idlHash(label);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/bigint-math.js
/**
* Equivalent to `Math.log2(n)` with support for `BigInt` values
* @param n bigint or integer
* @returns integer
*/
function ilog2(n) {
	const nBig = BigInt(n);
	if (n <= 0) throw new RangeError("Input must be positive");
	return nBig.toString(2).length - 1;
}
/**
* Equivalent to `2 ** n` with support for `BigInt` values
* (necessary for browser preprocessors which replace the `**` operator with `Math.pow`)
* @param n bigint or integer
* @returns bigint
*/
function iexp2(n) {
	const nBig = BigInt(n);
	if (n < 0) throw new RangeError("Input must be non-negative");
	return BigInt(1) << nBig;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/utils/leb128.js
function eob() {
	throw new Error("unexpected end of buffer");
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param num number
* @returns Uint8Array
*/
function safeRead(pipe, num) {
	if (pipe.byteLength < num) eob();
	return pipe.read(num);
}
/**
* @param pipe - PipeArrayBuffer simulating buffer-pipe api
*/
function safeReadUint8(pipe) {
	const byte = pipe.readUint8();
	if (byte === void 0) eob();
	return byte;
}
/**
* Encode a positive number (or bigint) into a Buffer. The number will be floored to the
* nearest integer.
* @param value The number to encode.
*/
function lebEncode(value) {
	if (typeof value === "number") value = BigInt(value);
	if (value < BigInt(0)) throw new Error("Cannot leb encode negative values.");
	const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
	const pipe = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
	while (true) {
		const i = Number(value & BigInt(127));
		value /= BigInt(128);
		if (value === BigInt(0)) {
			pipe.write(new Uint8Array([i]));
			break;
		} else pipe.write(new Uint8Array([i | 128]));
	}
	return pipe.buffer;
}
/**
* Decode a leb encoded buffer into a bigint. The number will always be positive (does not
* support signed leb encoding).
* @param pipe A Buffer containing the leb encoded bits.
*/
function lebDecode(pipe) {
	let weight = BigInt(1);
	let value = BigInt(0);
	let byte;
	do {
		byte = safeReadUint8(pipe);
		value += BigInt(byte & 127).valueOf() * weight;
		weight *= BigInt(128);
	} while (byte >= 128);
	return value;
}
/**
* Encode a number (or bigint) into a Buffer, with support for negative numbers. The number
* will be floored to the nearest integer.
* @param value The number to encode.
*/
function slebEncode(value) {
	if (typeof value === "number") value = BigInt(value);
	const isNeg = value < BigInt(0);
	if (isNeg) value = -value - BigInt(1);
	const byteLength = (value === BigInt(0) ? 0 : ilog2(value)) + 1;
	const pipe = new PipeArrayBuffer(new Uint8Array(byteLength), 0);
	while (true) {
		const i = getLowerBytes(value);
		value /= BigInt(128);
		if (isNeg && value === BigInt(0) && (i & 64) !== 0 || !isNeg && value === BigInt(0) && (i & 64) === 0) {
			pipe.write(new Uint8Array([i]));
			break;
		} else pipe.write(new Uint8Array([i | 128]));
	}
	function getLowerBytes(num) {
		const bytes = num % BigInt(128);
		if (isNeg) return Number(BigInt(128) - bytes - BigInt(1));
		return Number(bytes);
	}
	return pipe.buffer;
}
/**
* Decode a leb encoded buffer into a bigint. The number is decoded with support for negative
* signed-leb encoding.
* @param pipe A Buffer containing the signed leb encoded bits.
*/
function slebDecode(pipe) {
	const pipeView = new Uint8Array(pipe.buffer);
	let len = 0;
	for (; len < pipeView.byteLength; len++) if (pipeView[len] < 128) {
		if ((pipeView[len] & 64) === 0) return lebDecode(pipe);
		break;
	}
	const bytes = new Uint8Array(safeRead(pipe, len + 1));
	let value = BigInt(0);
	for (let i = bytes.byteLength - 1; i >= 0; i--) value = value * BigInt(128) + BigInt(128 - (bytes[i] & 127) - 1);
	return -value - BigInt(1);
}
/**
*
* @param value bigint or number
* @param byteLength number
* @returns Uint8Array
*/
function writeUIntLE(value, byteLength) {
	if (BigInt(value) < BigInt(0)) throw new Error("Cannot write negative values.");
	return writeIntLE(value, byteLength);
}
/**
*
* @param value - bigint or number
* @param byteLength - number
* @returns Uint8Array
*/
function writeIntLE(value, byteLength) {
	value = BigInt(value);
	const pipe = new PipeArrayBuffer(new Uint8Array(Math.min(1, byteLength)), 0);
	let i = 0;
	let mul = BigInt(256);
	let sub = BigInt(0);
	let byte = Number(value % mul);
	pipe.write(new Uint8Array([byte]));
	while (++i < byteLength) {
		if (value < 0 && sub === BigInt(0) && byte !== 0) sub = BigInt(1);
		byte = Number((value / mul - sub) % BigInt(256));
		pipe.write(new Uint8Array([byte]));
		mul *= BigInt(256);
	}
	return pipe.buffer;
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param byteLength number
* @returns bigint
*/
function readUIntLE(pipe, byteLength) {
	if (byteLength <= 0 || !Number.isInteger(byteLength)) throw new Error("Byte length must be a positive integer");
	let val = BigInt(safeReadUint8(pipe));
	let mul = BigInt(1);
	let i = 0;
	while (++i < byteLength) {
		mul *= BigInt(256);
		const byte = BigInt(safeReadUint8(pipe));
		val = val + mul * byte;
	}
	return val;
}
/**
*
* @param pipe Pipe from buffer-pipe
* @param byteLength number
* @returns bigint
*/
function readIntLE(pipe, byteLength) {
	if (byteLength <= 0 || !Number.isInteger(byteLength)) throw new Error("Byte length must be a positive integer");
	let val = readUIntLE(pipe, byteLength);
	const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength - 1) + BigInt(7));
	if (val >= mul) val -= mul * BigInt(2);
	return val;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/idl.js
var idl_exports = /* @__PURE__ */ __exportAll({
	Bool: () => Bool,
	BoolClass: () => BoolClass,
	CandidDecodeError: () => CandidDecodeError,
	ConstructType: () => ConstructType,
	Empty: () => Empty,
	EmptyClass: () => EmptyClass,
	FixedIntClass: () => FixedIntClass,
	FixedNatClass: () => FixedNatClass,
	Float32: () => Float32,
	Float64: () => Float64,
	FloatClass: () => FloatClass,
	Func: () => Func,
	FuncClass: () => FuncClass,
	Int: () => Int,
	Int16: () => Int16,
	Int32: () => Int32,
	Int64: () => Int64,
	Int8: () => Int8,
	IntClass: () => IntClass,
	Nat: () => Nat,
	Nat16: () => Nat16,
	Nat32: () => Nat32,
	Nat64: () => Nat64,
	Nat8: () => Nat8,
	NatClass: () => NatClass,
	Null: () => Null,
	NullClass: () => NullClass,
	Opt: () => Opt,
	OptClass: () => OptClass,
	PrimitiveType: () => PrimitiveType,
	Principal: () => Principal,
	PrincipalClass: () => PrincipalClass,
	Rec: () => Rec,
	RecClass: () => RecClass,
	Record: () => Record,
	RecordClass: () => RecordClass,
	Reserved: () => Reserved,
	ReservedClass: () => ReservedClass,
	Service: () => Service,
	ServiceClass: () => ServiceClass,
	Text: () => Text,
	TextClass: () => TextClass,
	Tuple: () => Tuple,
	TupleClass: () => TupleClass,
	Type: () => Type,
	Unknown: () => Unknown,
	UnknownClass: () => UnknownClass,
	Variant: () => Variant,
	VariantClass: () => VariantClass,
	Vec: () => Vec,
	VecClass: () => VecClass,
	Visitor: () => Visitor,
	decode: () => decode$1,
	encode: () => encode$1,
	resetSubtypeCache: () => resetSubtypeCache,
	subtype: () => subtype
});
/**
* This module provides a combinator library to create serializers/deserializers
* between JavaScript values and IDL used by canisters on the Internet Computer,
* as documented at https://github.com/dfinity/candid/blob/119703ba342d2fef6ab4972d2541b9fe36ae8e36/spec/Candid.md
*/
/**
* Error thrown when candid decoding fails due to a type mismatch
* between the expected and received types.
*/
var CandidDecodeError = class CandidDecodeError extends Error {
	constructor(message) {
		super(message);
		this.name = "CandidDecodeError";
		Object.setPrototypeOf(this, CandidDecodeError.prototype);
	}
};
var IDLTypeIds;
(function(IDLTypeIds) {
	IDLTypeIds[IDLTypeIds["Null"] = -1] = "Null";
	IDLTypeIds[IDLTypeIds["Bool"] = -2] = "Bool";
	IDLTypeIds[IDLTypeIds["Nat"] = -3] = "Nat";
	IDLTypeIds[IDLTypeIds["Int"] = -4] = "Int";
	IDLTypeIds[IDLTypeIds["Float32"] = -13] = "Float32";
	IDLTypeIds[IDLTypeIds["Float64"] = -14] = "Float64";
	IDLTypeIds[IDLTypeIds["Text"] = -15] = "Text";
	IDLTypeIds[IDLTypeIds["Reserved"] = -16] = "Reserved";
	IDLTypeIds[IDLTypeIds["Empty"] = -17] = "Empty";
	IDLTypeIds[IDLTypeIds["Opt"] = -18] = "Opt";
	IDLTypeIds[IDLTypeIds["Vector"] = -19] = "Vector";
	IDLTypeIds[IDLTypeIds["Record"] = -20] = "Record";
	IDLTypeIds[IDLTypeIds["Variant"] = -21] = "Variant";
	IDLTypeIds[IDLTypeIds["Func"] = -22] = "Func";
	IDLTypeIds[IDLTypeIds["Service"] = -23] = "Service";
	IDLTypeIds[IDLTypeIds["Principal"] = -24] = "Principal";
})(IDLTypeIds || (IDLTypeIds = {}));
var magicNumber = "DIDL";
var magicNumberBytes = new TextEncoder().encode(magicNumber);
var toReadableString_max = 400;
function zipWith(xs, ys, f) {
	return xs.map((x, i) => f(x, ys[i]));
}
/**
* An IDL Type Table, which precedes the data in the stream.
*/
var TypeTable = class {
	constructor() {
		this._typs = [];
		this._idx = /* @__PURE__ */ new Map();
		this._idxRefCount = /* @__PURE__ */ new Map();
	}
	has(obj) {
		return this._idx.has(obj.name);
	}
	add(type, buf) {
		const idx = this._typs.length;
		this._idx.set(type.name, idx);
		this._idxRefCount.set(idx, 1);
		this._typs.push(buf);
	}
	merge(obj, knot) {
		const idx = this._idx.get(obj.name);
		const knotIdx = this._idx.get(knot);
		if (idx === void 0) throw new Error(`Missing type index for ${obj}`);
		if (knotIdx === void 0) throw new Error(`Missing type index for ${knot}`);
		this._typs[idx] = this._typs[knotIdx];
		const idxRefCount = this._getIdxRefCount(idx);
		const knotRefCount = this._getIdxRefCount(knotIdx);
		this._idxRefCount.set(idx, idxRefCount + knotRefCount);
		this._idx.set(knot, idx);
		this._idxRefCount.set(knotIdx, 0);
		this._compactFromEnd();
	}
	_getIdxRefCount(idx) {
		return this._idxRefCount.get(idx) || 0;
	}
	_compactFromEnd() {
		while (this._typs.length > 0) {
			const lastIndex = this._typs.length - 1;
			if (this._getIdxRefCount(lastIndex) > 0) break;
			this._typs.pop();
			this._idxRefCount.delete(lastIndex);
		}
	}
	encode() {
		return concat(lebEncode(this._typs.length), concat(...this._typs));
	}
	indexOf(typeName) {
		if (!this._idx.has(typeName)) throw new Error(`Missing type index for ${typeName}`);
		return slebEncode(this._idx.get(typeName) || 0);
	}
};
var Visitor = class {
	visitType(_t, _data) {
		throw new Error("Not implemented");
	}
	visitPrimitive(t, data) {
		return this.visitType(t, data);
	}
	visitEmpty(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitBool(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitNull(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitReserved(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitText(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitNumber(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitInt(t, data) {
		return this.visitNumber(t, data);
	}
	visitNat(t, data) {
		return this.visitNumber(t, data);
	}
	visitFloat(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitFixedInt(t, data) {
		return this.visitNumber(t, data);
	}
	visitFixedNat(t, data) {
		return this.visitNumber(t, data);
	}
	visitPrincipal(t, data) {
		return this.visitPrimitive(t, data);
	}
	visitConstruct(t, data) {
		return this.visitType(t, data);
	}
	visitVec(t, _ty, data) {
		return this.visitConstruct(t, data);
	}
	visitOpt(t, _ty, data) {
		return this.visitConstruct(t, data);
	}
	visitRecord(t, _fields, data) {
		return this.visitConstruct(t, data);
	}
	visitTuple(t, components, data) {
		const fields = components.map((ty, i) => [`_${i}_`, ty]);
		return this.visitRecord(t, fields, data);
	}
	visitVariant(t, _fields, data) {
		return this.visitConstruct(t, data);
	}
	visitRec(_t, ty, data) {
		return this.visitConstruct(ty, data);
	}
	visitFunc(t, data) {
		return this.visitConstruct(t, data);
	}
	visitService(t, data) {
		return this.visitConstruct(t, data);
	}
};
var IdlTypeName;
(function(IdlTypeName) {
	IdlTypeName["EmptyClass"] = "__IDL_EmptyClass__";
	IdlTypeName["UnknownClass"] = "__IDL_UnknownClass__";
	IdlTypeName["BoolClass"] = "__IDL_BoolClass__";
	IdlTypeName["NullClass"] = "__IDL_NullClass__";
	IdlTypeName["ReservedClass"] = "__IDL_ReservedClass__";
	IdlTypeName["TextClass"] = "__IDL_TextClass__";
	IdlTypeName["IntClass"] = "__IDL_IntClass__";
	IdlTypeName["NatClass"] = "__IDL_NatClass__";
	IdlTypeName["FloatClass"] = "__IDL_FloatClass__";
	IdlTypeName["FixedIntClass"] = "__IDL_FixedIntClass__";
	IdlTypeName["FixedNatClass"] = "__IDL_FixedNatClass__";
	IdlTypeName["VecClass"] = "__IDL_VecClass__";
	IdlTypeName["OptClass"] = "__IDL_OptClass__";
	IdlTypeName["RecordClass"] = "__IDL_RecordClass__";
	IdlTypeName["TupleClass"] = "__IDL_TupleClass__";
	IdlTypeName["VariantClass"] = "__IDL_VariantClass__";
	IdlTypeName["RecClass"] = "__IDL_RecClass__";
	IdlTypeName["PrincipalClass"] = "__IDL_PrincipalClass__";
	IdlTypeName["FuncClass"] = "__IDL_FuncClass__";
	IdlTypeName["ServiceClass"] = "__IDL_ServiceClass__";
})(IdlTypeName || (IdlTypeName = {}));
/**
* Represents an IDL type.
*/
var Type = class {
	display() {
		return this.name;
	}
	valueToString(x) {
		return toReadableString(x);
	}
	buildTypeTable(typeTable) {
		if (!typeTable.has(this)) this._buildTypeTableImpl(typeTable);
	}
};
var PrimitiveType = class extends Type {
	checkType(t) {
		if (this.name !== t.name) throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
		return t;
	}
	_buildTypeTableImpl(_typeTable) {}
};
var ConstructType = class extends Type {
	checkType(t) {
		if (t instanceof RecClass) {
			const ty = t.getType();
			if (typeof ty === "undefined") throw new CandidDecodeError("Type mismatch: cannot decode from uninitialized recursive type");
			return ty;
		}
		throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
	}
	encodeType(typeTable) {
		return typeTable.indexOf(this.name);
	}
};
/**
* Represents an IDL Empty, a type which has no inhabitants.
* Since no values exist for this type, it cannot be serialised or deserialised.
* Result types like `Result<Text, Empty>` should always succeed.
*/
var EmptyClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.EmptyClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.EmptyClass;
	}
	accept(v, d) {
		return v.visitEmpty(this, d);
	}
	covariant(x) {
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		throw new Error("Empty cannot appear as a function argument");
	}
	valueToString() {
		throw new Error("Empty cannot appear as a value");
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Empty);
	}
	decodeValue() {
		throw new Error("Empty cannot appear as an output");
	}
	get name() {
		return "empty";
	}
};
/**
* Represents an IDL Unknown, a placeholder type for deserialization only.
* When decoding a value as Unknown, all fields will be retained but the names are only available in
* hashed form.
* A deserialized unknown will offer it's actual type by calling the `type()` function.
* Unknown cannot be serialized and attempting to do so will throw an error.
*/
var UnknownClass = class extends Type {
	get typeName() {
		return IdlTypeName.UnknownClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.UnknownClass;
	}
	checkType(_t) {
		throw new Error("Method not implemented for unknown.");
	}
	accept(v, d) {
		throw v.visitType(this, d);
	}
	covariant(x) {
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		throw new Error("Unknown cannot appear as a function argument");
	}
	valueToString() {
		throw new Error("Unknown cannot appear as a value");
	}
	encodeType() {
		throw new Error("Unknown cannot be serialized");
	}
	decodeValue(b, t) {
		let decodedValue = t.decodeValue(b, t);
		if (Object(decodedValue) !== decodedValue) decodedValue = Object(decodedValue);
		let typeFunc;
		if (t instanceof RecClass) typeFunc = () => t.getType();
		else typeFunc = () => t;
		Object.defineProperty(decodedValue, "type", {
			value: typeFunc,
			writable: true,
			enumerable: false,
			configurable: true
		});
		return decodedValue;
	}
	_buildTypeTableImpl() {
		throw new Error("Unknown cannot be serialized");
	}
	get name() {
		return "Unknown";
	}
};
/**
* Represents an IDL Bool
*/
var BoolClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.BoolClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.BoolClass;
	}
	accept(v, d) {
		return v.visitBool(this, d);
	}
	covariant(x) {
		if (typeof x === "boolean") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return new Uint8Array([x ? 1 : 0]);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Bool);
	}
	decodeValue(b, t) {
		this.checkType(t);
		switch (safeReadUint8(b)) {
			case 0: return false;
			case 1: return true;
			default: throw new Error("Boolean value out of range");
		}
	}
	get name() {
		return "bool";
	}
};
/**
* Represents an IDL Null
*/
var NullClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.NullClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.NullClass;
	}
	accept(v, d) {
		return v.visitNull(this, d);
	}
	covariant(x) {
		if (x === null) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue() {
		return /* @__PURE__ */ new Uint8Array(0);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Null);
	}
	decodeValue(_b, t) {
		this.checkType(t);
		return null;
	}
	get name() {
		return "null";
	}
};
/**
* Represents an IDL Reserved
*/
var ReservedClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.ReservedClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.ReservedClass;
	}
	accept(v, d) {
		return v.visitReserved(this, d);
	}
	covariant(_x) {
		return true;
	}
	encodeValue() {
		return /* @__PURE__ */ new Uint8Array(0);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Reserved);
	}
	decodeValue(b, t) {
		if (t.name !== this.name) t.decodeValue(b, t);
		return null;
	}
	get name() {
		return "reserved";
	}
};
/**
* Represents an IDL Text
*/
var TextClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.TextClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.TextClass;
	}
	accept(v, d) {
		return v.visitText(this, d);
	}
	covariant(x) {
		if (typeof x === "string") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = new TextEncoder().encode(x);
		return concat(lebEncode(buf.byteLength), buf);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Text);
	}
	decodeValue(b, t) {
		this.checkType(t);
		const len = lebDecode(b);
		const buf = safeRead(b, Number(len));
		return new TextDecoder("utf8", { fatal: true }).decode(buf);
	}
	get name() {
		return "text";
	}
	valueToString(x) {
		return `"${x}"`;
	}
};
/**
* Represents an IDL Int
*/
var IntClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.IntClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.IntClass;
	}
	accept(v, d) {
		return v.visitInt(this, d);
	}
	covariant(x) {
		if (typeof x === "bigint" || Number.isInteger(x)) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return slebEncode(x);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Int);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return slebDecode(b);
	}
	get name() {
		return "int";
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Nat
*/
var NatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.NatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.NatClass;
	}
	accept(v, d) {
		return v.visitNat(this, d);
	}
	covariant(x) {
		if (typeof x === "bigint" && x >= BigInt(0) || Number.isInteger(x) && x >= 0) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return lebEncode(x);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Nat);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return lebDecode(b);
	}
	get name() {
		return "nat";
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Float
*/
var FloatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FloatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FloatClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
		if (_bits !== 32 && _bits !== 64) throw new Error("not a valid float type");
	}
	accept(v, d) {
		return v.visitFloat(this, d);
	}
	covariant(x) {
		if (typeof x === "number" || x instanceof Number) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = /* @__PURE__ */ new ArrayBuffer(this._bits / 8);
		const view = new DataView(buf);
		if (this._bits === 32) view.setFloat32(0, x, true);
		else view.setFloat64(0, x, true);
		return new Uint8Array(buf);
	}
	encodeType() {
		return slebEncode(this._bits === 32 ? IDLTypeIds.Float32 : IDLTypeIds.Float64);
	}
	decodeValue(b, t) {
		this.checkType(t);
		const view = uint8ToDataView(safeRead(b, this._bits / 8));
		if (this._bits === 32) return view.getFloat32(0, true);
		return view.getFloat64(0, true);
	}
	get name() {
		return `float${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL fixed-width Int(n)
*/
var FixedIntClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FixedIntClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FixedIntClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
	}
	accept(v, d) {
		return v.visitFixedInt(this, d);
	}
	covariant(x) {
		const min = iexp2(this._bits - 1) * BigInt(-1);
		const max = iexp2(this._bits - 1) - BigInt(1);
		if (typeof x === "bigint") {
			if (x >= min && x <= max) return true;
		} else if (Number.isInteger(x)) {
			const v = BigInt(x);
			if (v >= min && v <= max) return true;
		}
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return writeIntLE(x, this._bits / 8);
	}
	encodeType() {
		return slebEncode(-9 - (Math.log2(this._bits) - 3));
	}
	decodeValue(b, t) {
		this.checkType(t);
		const num = readIntLE(b, this._bits / 8);
		if (this._bits <= 32) return Number(num);
		return num;
	}
	get name() {
		return `int${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL fixed-width Nat(n)
*/
var FixedNatClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.FixedNatClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FixedNatClass;
	}
	constructor(_bits) {
		super();
		this._bits = _bits;
	}
	accept(v, d) {
		return v.visitFixedNat(this, d);
	}
	covariant(x) {
		const max = iexp2(this._bits);
		if (typeof x === "bigint" && x >= BigInt(0)) {
			if (x < max) return true;
		} else if (Number.isInteger(x) && x >= 0) {
			if (BigInt(x) < max) return true;
		}
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return writeUIntLE(x, this._bits / 8);
	}
	encodeType() {
		return slebEncode(-5 - (Math.log2(this._bits) - 3));
	}
	decodeValue(b, t) {
		this.checkType(t);
		const num = readUIntLE(b, this._bits / 8);
		if (this._bits <= 32) return Number(num);
		return num;
	}
	get name() {
		return `nat${this._bits}`;
	}
	valueToString(x) {
		return x.toString();
	}
};
/**
* Represents an IDL Array
*
* Arrays of fixed-sized nat/int type (e.g. nat8), are encoded from and decoded to TypedArrays (e.g. Uint8Array).
* Arrays of float or other non-primitive types are encoded/decoded as untyped array in Javascript.
* @param {Type} t
*/
var VecClass = class VecClass extends ConstructType {
	get typeName() {
		return IdlTypeName.VecClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.VecClass;
	}
	constructor(_type) {
		super();
		this._type = _type;
		this._blobOptimization = false;
		if (_type instanceof FixedNatClass && _type._bits === 8) this._blobOptimization = true;
	}
	accept(v, d) {
		return v.visitVec(this, this._type, d);
	}
	covariant(x) {
		const bits = this._type instanceof FixedNatClass ? this._type._bits : this._type instanceof FixedIntClass ? this._type._bits : 0;
		if (ArrayBuffer.isView(x) && bits == x.BYTES_PER_ELEMENT * 8 || Array.isArray(x) && x.every((v, idx) => {
			try {
				return this._type.covariant(v);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nindex ${idx} -> ${e.message}`, { cause: e });
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const len = lebEncode(x.length);
		if (this._blobOptimization) return concat(len, new Uint8Array(x));
		if (ArrayBuffer.isView(x)) {
			if (x instanceof Int16Array || x instanceof Uint16Array) {
				const buffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(x.length * 2));
				for (let i = 0; i < x.length; i++) if (x instanceof Int16Array) buffer.setInt16(i * 2, x[i], true);
				else buffer.setUint16(i * 2, x[i], true);
				return concat(len, new Uint8Array(buffer.buffer));
			}
			if (x instanceof Int32Array || x instanceof Uint32Array) {
				const buffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(x.length * 4));
				for (let i = 0; i < x.length; i++) if (x instanceof Int32Array) buffer.setInt32(i * 4, x[i], true);
				else buffer.setUint32(i * 4, x[i], true);
				return concat(len, new Uint8Array(buffer.buffer));
			}
			if (x instanceof BigInt64Array || x instanceof BigUint64Array) {
				const buffer = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(x.length * 8));
				for (let i = 0; i < x.length; i++) if (x instanceof BigInt64Array) buffer.setBigInt64(i * 8, x[i], true);
				else buffer.setBigUint64(i * 8, x[i], true);
				return concat(len, new Uint8Array(buffer.buffer));
			}
			return concat(len, new Uint8Array(x.buffer, x.byteOffset, x.byteLength));
		}
		const buf = new PipeArrayBuffer(new Uint8Array(len.byteLength + x.length), 0);
		buf.write(len);
		for (const d of x) {
			const encoded = this._type.encodeValue(d);
			buf.write(new Uint8Array(encoded));
		}
		return buf.buffer;
	}
	_buildTypeTableImpl(typeTable) {
		this._type.buildTypeTable(typeTable);
		const opCode = slebEncode(IDLTypeIds.Vector);
		const buffer = this._type.encodeType(typeTable);
		typeTable.add(this, concat(opCode, buffer));
	}
	decodeValue(b, t) {
		const vec = this.checkType(t);
		if (!(vec instanceof VecClass)) throw new CandidDecodeError(`Expected type '${this.display()}', but received non-vector type '${vec.display()}'`);
		const len = Number(lebDecode(b));
		if (this._type instanceof FixedNatClass) {
			if (this._type._bits == 8) return new Uint8Array(b.read(len));
			if (this._type._bits == 16) {
				const bytes = b.read(len * 2);
				return new Uint16Array(bytes.buffer, bytes.byteOffset, len);
			}
			if (this._type._bits == 32) {
				const bytes = b.read(len * 4);
				return new Uint32Array(bytes.buffer, bytes.byteOffset, len);
			}
			if (this._type._bits == 64) return new BigUint64Array(b.read(len * 8).buffer);
		}
		if (this._type instanceof FixedIntClass) {
			if (this._type._bits == 8) return new Int8Array(b.read(len));
			if (this._type._bits == 16) {
				const bytes = b.read(len * 2);
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				const result = new Int16Array(len);
				for (let i = 0; i < len; i++) result[i] = view.getInt16(i * 2, true);
				return result;
			}
			if (this._type._bits == 32) {
				const bytes = b.read(len * 4);
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				const result = new Int32Array(len);
				for (let i = 0; i < len; i++) result[i] = view.getInt32(i * 4, true);
				return result;
			}
			if (this._type._bits == 64) {
				const bytes = b.read(len * 8);
				const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
				const result = new BigInt64Array(len);
				for (let i = 0; i < len; i++) result[i] = view.getBigInt64(i * 8, true);
				return result;
			}
		}
		const rets = [];
		for (let i = 0; i < len; i++) rets.push(this._type.decodeValue(b, vec._type));
		return rets;
	}
	get name() {
		return `vec ${this._type.name}`;
	}
	display() {
		return `vec ${this._type.display()}`;
	}
	valueToString(x) {
		return `vec {${x.map((e) => this._type.valueToString(e)).join("; ")}}`;
	}
};
/**
* Represents an IDL Option
* @param {Type} t
*/
var OptClass = class OptClass extends ConstructType {
	get typeName() {
		return IdlTypeName.OptClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.OptClass;
	}
	constructor(_type) {
		super();
		this._type = _type;
	}
	accept(v, d) {
		return v.visitOpt(this, this._type, d);
	}
	covariant(x) {
		try {
			if (Array.isArray(x) && (x.length === 0 || x.length === 1 && this._type.covariant(x[0]))) return true;
		} catch (e) {
			throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)} \n\n-> ${e.message}`, { cause: e });
		}
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		if (x.length === 0) return new Uint8Array([0]);
		return concat(new Uint8Array([1]), this._type.encodeValue(x[0]));
	}
	_buildTypeTableImpl(typeTable) {
		this._type.buildTypeTable(typeTable);
		const opCode = slebEncode(IDLTypeIds.Opt);
		const buffer = this._type.encodeType(typeTable);
		typeTable.add(this, concat(opCode, buffer));
	}
	decodeValue(b, t) {
		if (t instanceof NullClass) return [];
		if (t instanceof ReservedClass) return [];
		let wireType = t;
		if (t instanceof RecClass) {
			const ty = t.getType();
			if (typeof ty === "undefined") throw new CandidDecodeError("Type mismatch: cannot decode from uninitialized recursive type");
			else wireType = ty;
		}
		if (wireType instanceof OptClass) switch (safeReadUint8(b)) {
			case 0: return [];
			case 1: {
				const checkpoint = b.save();
				try {
					return [this._type.decodeValue(b, wireType._type)];
				} catch (e) {
					b.restore(checkpoint);
					wireType._type.decodeValue(b, wireType._type);
					return [];
				}
			}
			default: throw new CandidDecodeError(`Invalid option value: expected 0 (None) or 1 (Some) for type '${this.display()}'`);
		}
		else if (this._type instanceof NullClass || this._type instanceof OptClass || this._type instanceof ReservedClass) {
			wireType.decodeValue(b, wireType);
			return [];
		} else {
			const checkpoint = b.save();
			try {
				return [this._type.decodeValue(b, t)];
			} catch (e) {
				b.restore(checkpoint);
				wireType.decodeValue(b, t);
				return [];
			}
		}
	}
	get name() {
		return `opt ${this._type.name}`;
	}
	display() {
		return `opt ${this._type.display()}`;
	}
	valueToString(x) {
		if (x.length === 0) return "null";
		return `opt ${this._type.valueToString(x[0])}`;
	}
};
/**
* Represents an IDL Record
* @param {object} [fields] - mapping of function name to Type
*/
var RecordClass = class RecordClass extends ConstructType {
	get typeName() {
		return IdlTypeName.RecordClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.RecordClass || instance.typeName === IdlTypeName.TupleClass;
	}
	constructor(fields = {}) {
		super();
		this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
	}
	accept(v, d) {
		return v.visitRecord(this, this._fields, d);
	}
	tryAsTuple() {
		const res = [];
		for (let i = 0; i < this._fields.length; i++) {
			const [key, type] = this._fields[i];
			if (key !== `_${i}_`) return null;
			res.push(type);
		}
		return res;
	}
	covariant(x) {
		if (typeof x === "object" && this._fields.every(([k, t]) => {
			if (!x.hasOwnProperty(k)) throw new Error(`Record is missing key "${k}".`);
			try {
				return t.covariant(x[k]);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nfield ${k} -> ${e.message}`, { cause: e });
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const values = this._fields.map(([key]) => x[key]);
		return concat(...zipWith(this._fields, values, ([, c], d) => c.encodeValue(d)));
	}
	_buildTypeTableImpl(T) {
		this._fields.forEach(([_, value]) => value.buildTypeTable(T));
		const opCode = slebEncode(IDLTypeIds.Record);
		const len = lebEncode(this._fields.length);
		const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(T)));
		T.add(this, concat(opCode, len, concat(...fields)));
	}
	decodeValue(b, t) {
		const record = this.checkType(t);
		if (!(record instanceof RecordClass)) throw new CandidDecodeError(`Expected type '${this.display()}', but received non-record type '${record.display()}'`);
		const x = {};
		let expectedRecordIdx = 0;
		let actualRecordIdx = 0;
		while (actualRecordIdx < record._fields.length) {
			const [hash, type] = record._fields[actualRecordIdx];
			if (expectedRecordIdx >= this._fields.length) {
				type.decodeValue(b, type);
				actualRecordIdx++;
				continue;
			}
			const [expectKey, expectType] = this._fields[expectedRecordIdx];
			const expectedId = idlLabelToId(this._fields[expectedRecordIdx][0]);
			const actualId = idlLabelToId(hash);
			if (expectedId === actualId) {
				x[expectKey] = expectType.decodeValue(b, type);
				expectedRecordIdx++;
				actualRecordIdx++;
			} else if (actualId > expectedId) {
				if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
					x[expectKey] = [];
					expectedRecordIdx++;
				} else throw new CandidDecodeError(`Cannot find required field '${expectKey}' in record, expected fields: [${this._fields.map(([name]) => name).join(", ")}], received fields: [${record._fields.map(([name]) => name).join(", ")}]`);
			} else {
				type.decodeValue(b, type);
				actualRecordIdx++;
			}
		}
		for (const [expectKey, expectType] of this._fields.slice(expectedRecordIdx)) if (expectType instanceof OptClass || expectType instanceof ReservedClass) x[expectKey] = [];
		else throw new CandidDecodeError(`Cannot find required field '${expectKey}' in record, expected fields: [${this._fields.map(([name]) => name).join(", ")}], received fields: [${record._fields.map(([name]) => name).join(", ")}]`);
		return x;
	}
	get fieldsAsObject() {
		const fields = {};
		for (const [name, ty] of this._fields) fields[idlLabelToId(name)] = ty;
		return fields;
	}
	get name() {
		return `record {${this._fields.map(([key, value]) => `${key}:${value.name}`).join("; ")}}`;
	}
	display() {
		return `record {${this._fields.map(([key, value]) => `${key}:${value.display()}`).join("; ")}}`;
	}
	valueToString(x) {
		const values = this._fields.map(([key]) => x[key]);
		return `record {${zipWith(this._fields, values, ([k, c], d) => `${k}=${c.valueToString(d)}`).join("; ")}}`;
	}
};
/**
* Represents Tuple, a syntactic sugar for Record.
* @param {Type} components
*/
var TupleClass = class TupleClass extends RecordClass {
	get typeName() {
		return IdlTypeName.TupleClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.TupleClass;
	}
	constructor(_components) {
		const x = {};
		_components.forEach((e, i) => x[`_${i}_`] = e);
		super(x);
		this._components = _components;
	}
	accept(v, d) {
		return v.visitTuple(this, this._components, d);
	}
	covariant(x) {
		if (Array.isArray(x) && x.length >= this._fields.length && this._components.every((t, i) => {
			try {
				return t.covariant(x[i]);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nindex ${i} -> ${e.message}`, { cause: e });
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		return concat(...zipWith(this._components, x, (c, d) => c.encodeValue(d)));
	}
	decodeValue(b, t) {
		const tuple = this.checkType(t);
		if (!(tuple instanceof TupleClass)) throw new CandidDecodeError(`Expected type '${this.display()}', but received non-tuple type '${tuple.display()}'`);
		if (tuple._components.length < this._components.length) throw new CandidDecodeError(`Tuple mismatch: expected ${this._components.length} components, but received ${tuple._components.length}`);
		const res = [];
		for (const [i, wireType] of tuple._components.entries()) if (i >= this._components.length) wireType.decodeValue(b, wireType);
		else res.push(this._components[i].decodeValue(b, wireType));
		return res;
	}
	display() {
		return `record {${this._components.map((value) => value.display()).join("; ")}}`;
	}
	valueToString(values) {
		return `record {${zipWith(this._components, values, (c, d) => c.valueToString(d)).join("; ")}}`;
	}
};
/**
* Represents an IDL Variant
* @param {object} [fields] - mapping of function name to Type
*/
var VariantClass = class VariantClass extends ConstructType {
	get typeName() {
		return IdlTypeName.VariantClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.VariantClass;
	}
	constructor(fields = {}) {
		super();
		this._fields = Object.entries(fields).sort((a, b) => idlLabelToId(a[0]) - idlLabelToId(b[0]));
	}
	accept(v, d) {
		return v.visitVariant(this, this._fields, d);
	}
	covariant(x) {
		if (typeof x === "object" && Object.entries(x).length === 1 && this._fields.every(([k, v]) => {
			try {
				return !x.hasOwnProperty(k) || v.covariant(x[k]);
			} catch (e) {
				throw new Error(`Invalid ${this.display()} argument: \n\nvariant ${k} -> ${e.message}`, { cause: e });
			}
		})) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		for (let i = 0; i < this._fields.length; i++) {
			const [name, type] = this._fields[i];
			if (x.hasOwnProperty(name)) return concat(lebEncode(i), type.encodeValue(x[name]));
		}
		throw Error(`Variant has no data: ${x}`);
	}
	_buildTypeTableImpl(typeTable) {
		this._fields.forEach(([, type]) => {
			type.buildTypeTable(typeTable);
		});
		const opCode = slebEncode(IDLTypeIds.Variant);
		const len = lebEncode(this._fields.length);
		const fields = this._fields.map(([key, value]) => concat(lebEncode(idlLabelToId(key)), value.encodeType(typeTable)));
		typeTable.add(this, concat(opCode, len, ...fields));
	}
	decodeValue(b, t) {
		const variant = this.checkType(t);
		if (!(variant instanceof VariantClass)) throw new CandidDecodeError(`Expected type '${this.display()}', but received non-variant type '${variant.display()}'`);
		const idx = Number(lebDecode(b));
		if (idx >= variant._fields.length) throw Error(`Invalid variant index: ${idx}`);
		const [wireHash, wireType] = variant._fields[idx];
		for (const [key, expectType] of this._fields) if (idlLabelToId(wireHash) === idlLabelToId(key)) {
			const value = expectType.decodeValue(b, wireType);
			return { [key]: value };
		}
		throw new CandidDecodeError(`Cannot find field hash ${wireHash} in variant, expected fields: [${this._fields.map(([name]) => name).join(", ")}]`);
	}
	get name() {
		return `variant {${this._fields.map(([key, type]) => `${key}:${type.name}`).join("; ")}}`;
	}
	display() {
		return `variant {${this._fields.map(([key, type]) => key + (type.name === "null" ? "" : `:${type.display()}`)).join("; ")}}`;
	}
	valueToString(x) {
		for (const [name, type] of this._fields) if (x.hasOwnProperty(name)) {
			const value = type.valueToString(x[name]);
			if (value === "null") return `variant {${name}}`;
			return `variant {${name}=${value}}`;
		}
		throw new Error(`Variant has no data: ${x}`);
	}
	get alternativesAsObject() {
		const alternatives = {};
		for (const [name, ty] of this._fields) alternatives[idlLabelToId(name)] = ty;
		return alternatives;
	}
};
/**
* Represents a reference to an IDL type, used for defining recursive data
* types.
*/
var RecClass = class RecClass extends ConstructType {
	constructor() {
		super(...arguments);
		this._id = RecClass._counter++;
	}
	get typeName() {
		return IdlTypeName.RecClass;
	}
	static {
		this._counter = 0;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.RecClass;
	}
	accept(v, d) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return v.visitRec(this, this._type, d);
	}
	fill(t) {
		this._type = t;
	}
	getType() {
		return this._type;
	}
	covariant(x) {
		if (this._type ? this._type.covariant(x) : false) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.encodeValue(x);
	}
	_buildTypeTableImpl(typeTable) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		typeTable.add(this, new Uint8Array([]));
		this._type.buildTypeTable(typeTable);
		typeTable.merge(this, this._type.name);
	}
	decodeValue(b, t) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.decodeValue(b, t);
	}
	get name() {
		return `rec_${this._id}`;
	}
	display() {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return `μ${this.name}.${this._type.name}`;
	}
	valueToString(x) {
		if (!this._type) throw Error("Recursive type uninitialized.");
		return this._type.valueToString(x);
	}
};
function decodePrincipalId(b) {
	if (safeReadUint8(b) !== 1) throw new Error("Cannot decode principal");
	const len = Number(lebDecode(b));
	return Principal$1.fromUint8Array(new Uint8Array(safeRead(b, len)));
}
/**
* Represents an IDL principal reference
*/
var PrincipalClass = class extends PrimitiveType {
	get typeName() {
		return IdlTypeName.PrincipalClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.PrincipalClass;
	}
	accept(v, d) {
		return v.visitPrincipal(this, d);
	}
	covariant(x) {
		if (x && x._isPrincipal) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = x.toUint8Array();
		const len = lebEncode(buf.byteLength);
		return concat(new Uint8Array([1]), len, buf);
	}
	encodeType() {
		return slebEncode(IDLTypeIds.Principal);
	}
	decodeValue(b, t) {
		this.checkType(t);
		return decodePrincipalId(b);
	}
	get name() {
		return "principal";
	}
	valueToString(x) {
		return `${this.name} "${x.toText()}"`;
	}
};
/**
* Represents an IDL function reference.
* @param argTypes Argument types.
* @param retTypes Return types.
* @param annotations Function annotations.
*/
var FuncClass = class extends ConstructType {
	get typeName() {
		return IdlTypeName.FuncClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.FuncClass;
	}
	static argsToString(types, v) {
		if (types.length !== v.length) throw new Error("arity mismatch");
		return `(${types.map((t, i) => t.valueToString(v[i])).join(", ")})`;
	}
	constructor(argTypes, retTypes, annotations = []) {
		super();
		this.argTypes = argTypes;
		this.retTypes = retTypes;
		this.annotations = annotations;
	}
	accept(v, d) {
		return v.visitFunc(this, d);
	}
	covariant(x) {
		if (Array.isArray(x) && x.length === 2 && x[0] && x[0]._isPrincipal && typeof x[1] === "string") return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue([principal, methodName]) {
		const buf = principal.toUint8Array();
		const len = lebEncode(buf.byteLength);
		const canister = concat(new Uint8Array([1]), len, buf);
		const method = new TextEncoder().encode(methodName);
		const methodLen = lebEncode(method.byteLength);
		return concat(new Uint8Array([1]), canister, methodLen, method);
	}
	_buildTypeTableImpl(T) {
		this.argTypes.forEach((arg) => arg.buildTypeTable(T));
		this.retTypes.forEach((arg) => arg.buildTypeTable(T));
		const opCode = slebEncode(IDLTypeIds.Func);
		const argLen = lebEncode(this.argTypes.length);
		const args = concat(...this.argTypes.map((arg) => arg.encodeType(T)));
		const retLen = lebEncode(this.retTypes.length);
		const rets = concat(...this.retTypes.map((arg) => arg.encodeType(T)));
		const annLen = lebEncode(this.annotations.length);
		const anns = concat(...this.annotations.map((a) => this.encodeAnnotation(a)));
		T.add(this, concat(opCode, argLen, args, retLen, rets, annLen, anns));
	}
	decodeValue(b, t) {
		const tt = t instanceof RecClass ? t.getType() ?? t : t;
		if (!subtype(tt, this)) throw new Error(`Cannot decode function reference at type ${this.display()} from wire type ${tt.display()}`);
		if (safeReadUint8(b) !== 1) throw new Error("Cannot decode function reference");
		const canister = decodePrincipalId(b);
		const buf = safeRead(b, Number(lebDecode(b)));
		return [canister, new TextDecoder("utf8", { fatal: true }).decode(buf)];
	}
	get name() {
		return `(${this.argTypes.map((arg) => arg.name).join(", ")}) -> (${this.retTypes.map((arg) => arg.name).join(", ")})${` ${this.annotations.join(" ")}`}`;
	}
	valueToString([principal, str]) {
		return `func "${principal.toText()}".${str}`;
	}
	display() {
		return `(${this.argTypes.map((arg) => arg.display()).join(", ")}) → (${this.retTypes.map((arg) => arg.display()).join(", ")})${` ${this.annotations.join(" ")}`}`;
	}
	encodeAnnotation(ann) {
		if (ann === "query") return new Uint8Array([1]);
		if (ann === "oneway") return new Uint8Array([2]);
		if (ann === "composite_query") return new Uint8Array([3]);
		throw new Error("Illegal function annotation");
	}
};
var ServiceClass = class extends ConstructType {
	get typeName() {
		return IdlTypeName.ServiceClass;
	}
	static [Symbol.hasInstance](instance) {
		return instance.typeName === IdlTypeName.ServiceClass;
	}
	constructor(fields) {
		super();
		this._fields = Object.entries(fields).sort((a, b) => {
			if (a[0] < b[0]) return -1;
			if (a[0] > b[0]) return 1;
			return 0;
		});
	}
	accept(v, d) {
		return v.visitService(this, d);
	}
	covariant(x) {
		if (x && x._isPrincipal) return true;
		throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
	}
	encodeValue(x) {
		const buf = x.toUint8Array();
		const len = lebEncode(buf.length);
		return concat(new Uint8Array([1]), len, buf);
	}
	_buildTypeTableImpl(T) {
		this._fields.forEach(([_, func]) => func.buildTypeTable(T));
		const opCode = slebEncode(IDLTypeIds.Service);
		const len = lebEncode(this._fields.length);
		const meths = this._fields.map(([label, func]) => {
			const labelBuf = new TextEncoder().encode(label);
			return concat(lebEncode(labelBuf.length), labelBuf, func.encodeType(T));
		});
		T.add(this, concat(opCode, len, ...meths));
	}
	decodeValue(b, t) {
		const tt = t instanceof RecClass ? t.getType() ?? t : t;
		if (!subtype(tt, this)) throw new Error(`Cannot decode service reference at type ${this.display()} from wire type ${tt.display()}`);
		return decodePrincipalId(b);
	}
	get name() {
		return `service {${this._fields.map(([key, value]) => `${key}:${value.name}`).join("; ")}}`;
	}
	valueToString(x) {
		return `service "${x.toText()}"`;
	}
	fieldsAsObject() {
		const fields = {};
		for (const [name, ty] of this._fields) fields[name] = ty;
		return fields;
	}
};
/**
* Takes an unknown value and returns a string representation of it.
* @param x - unknown value
* @returns {string} string representation of the value
*/
function toReadableString(x) {
	const str = JSON.stringify(x, (_key, value) => typeof value === "bigint" ? `BigInt(${value})` : value);
	return str && str.length > toReadableString_max ? `${str.substring(0, 397)}...` : str;
}
/**
* Encode a array of values
* @param argTypes - array of Types
* @param args - array of values
* @returns {Uint8Array} serialised value
*/
function encode$1(argTypes, args) {
	if (args.length < argTypes.length) throw Error("Wrong number of message arguments");
	const typeTable = new TypeTable();
	argTypes.forEach((t) => t.buildTypeTable(typeTable));
	return concat(magicNumberBytes, typeTable.encode(), lebEncode(args.length), concat(...argTypes.map((t) => t.encodeType(typeTable))), concat(...zipWith(argTypes, args, (t, x) => {
		try {
			t.covariant(x);
		} catch (e) {
			throw /* @__PURE__ */ new Error(`${e.message}\n\n`);
		}
		return t.encodeValue(x);
	})));
}
/**
* Decode a binary value
* @param retTypes - Types expected in the buffer.
* @param bytes - hex-encoded string, or buffer.
* @returns Value deserialised to JS type
*/
function decode$1(retTypes, bytes) {
	const b = new PipeArrayBuffer(bytes);
	if (bytes.byteLength < 4) throw new Error("Message length smaller than magic number");
	const magicBuffer = safeRead(b, 4);
	const magic = new TextDecoder().decode(magicBuffer);
	if (magic !== magicNumber) throw new Error(`Wrong magic number: ${JSON.stringify(magic)}`);
	function readTypeTable(pipe) {
		const typeTable = [];
		const len = Number(lebDecode(pipe));
		for (let i = 0; i < len; i++) {
			const ty = Number(slebDecode(pipe));
			switch (ty) {
				case IDLTypeIds.Opt:
				case IDLTypeIds.Vector: {
					const t = Number(slebDecode(pipe));
					typeTable.push([ty, t]);
					break;
				}
				case IDLTypeIds.Record:
				case IDLTypeIds.Variant: {
					const fields = [];
					let objectLength = Number(lebDecode(pipe));
					let prevHash;
					while (objectLength--) {
						const hash = Number(lebDecode(pipe));
						if (hash >= Math.pow(2, 32)) throw new Error("field id out of 32-bit range");
						if (typeof prevHash === "number" && prevHash >= hash) throw new Error("field id collision or not sorted");
						prevHash = hash;
						const t = Number(slebDecode(pipe));
						fields.push([hash, t]);
					}
					typeTable.push([ty, fields]);
					break;
				}
				case IDLTypeIds.Func: {
					const args = [];
					let argLength = Number(lebDecode(pipe));
					while (argLength--) args.push(Number(slebDecode(pipe)));
					const returnValues = [];
					let returnValuesLength = Number(lebDecode(pipe));
					while (returnValuesLength--) returnValues.push(Number(slebDecode(pipe)));
					const annotations = [];
					let annotationLength = Number(lebDecode(pipe));
					while (annotationLength--) switch (Number(lebDecode(pipe))) {
						case 1:
							annotations.push("query");
							break;
						case 2:
							annotations.push("oneway");
							break;
						case 3:
							annotations.push("composite_query");
							break;
						default: throw new Error("unknown annotation");
					}
					typeTable.push([ty, [
						args,
						returnValues,
						annotations
					]]);
					break;
				}
				case IDLTypeIds.Service: {
					let servLength = Number(lebDecode(pipe));
					const methods = [];
					while (servLength--) {
						const nameLength = Number(lebDecode(pipe));
						const funcName = new TextDecoder().decode(safeRead(pipe, nameLength));
						const funcType = slebDecode(pipe);
						methods.push([funcName, funcType]);
					}
					typeTable.push([ty, methods]);
					break;
				}
				default: throw new Error(`Illegal op_code: ${ty}`);
			}
		}
		const rawList = [];
		const length = Number(lebDecode(pipe));
		for (let i = 0; i < length; i++) rawList.push(Number(slebDecode(pipe)));
		return [typeTable, rawList];
	}
	const [rawTable, rawTypes] = readTypeTable(b);
	if (rawTypes.length < retTypes.length) throw new Error("Wrong number of return values");
	const table = rawTable.map((_) => Rec());
	function getType(t) {
		if (t < -24) throw new Error("future value not supported");
		if (t < 0) switch (t) {
			case -1: return Null;
			case -2: return Bool;
			case -3: return Nat;
			case -4: return Int;
			case -5: return Nat8;
			case -6: return Nat16;
			case -7: return Nat32;
			case -8: return Nat64;
			case -9: return Int8;
			case -10: return Int16;
			case -11: return Int32;
			case -12: return Int64;
			case -13: return Float32;
			case -14: return Float64;
			case -15: return Text;
			case -16: return Reserved;
			case -17: return Empty;
			case -24: return Principal;
			default: throw new Error(`Illegal op_code: ${t}`);
		}
		if (t >= rawTable.length) throw new Error("type index out of range");
		return table[t];
	}
	function buildType(entry) {
		switch (entry[0]) {
			case IDLTypeIds.Vector: return Vec(getType(entry[1]));
			case IDLTypeIds.Opt: return Opt(getType(entry[1]));
			case IDLTypeIds.Record: {
				const fields = {};
				for (const [hash, ty] of entry[1]) {
					const name = `_${hash}_`;
					fields[name] = getType(ty);
				}
				const record = Record(fields);
				const tuple = record.tryAsTuple();
				if (Array.isArray(tuple)) return Tuple(...tuple);
				return record;
			}
			case IDLTypeIds.Variant: {
				const fields = {};
				for (const [hash, ty] of entry[1]) {
					const name = `_${hash}_`;
					fields[name] = getType(ty);
				}
				return Variant(fields);
			}
			case IDLTypeIds.Func: {
				const [args, returnValues, annotations] = entry[1];
				return Func(args.map((t) => getType(t)), returnValues.map((t) => getType(t)), annotations);
			}
			case IDLTypeIds.Service: {
				const rec = {};
				const methods = entry[1];
				for (const [name, typeRef] of methods) {
					let type = getType(typeRef);
					if (type instanceof RecClass) type = type.getType();
					if (!(type instanceof FuncClass)) throw new Error("Illegal service definition: services can only contain functions");
					rec[name] = type;
				}
				return Service(rec);
			}
			default: throw new Error(`Illegal op_code: ${entry[0]}`);
		}
	}
	rawTable.forEach((entry, i) => {
		if (entry[0] === IDLTypeIds.Func) {
			const t = buildType(entry);
			table[i].fill(t);
		}
	});
	rawTable.forEach((entry, i) => {
		if (entry[0] !== IDLTypeIds.Func) {
			const t = buildType(entry);
			table[i].fill(t);
		}
	});
	resetSubtypeCache();
	const types = rawTypes.map((t) => getType(t));
	try {
		const output = retTypes.map((t, i) => {
			return t.decodeValue(b, types[i]);
		});
		for (let ind = retTypes.length; ind < types.length; ind++) types[ind].decodeValue(b, types[ind]);
		if (b.byteLength > 0) throw new Error("decode: Left-over bytes");
		return output;
	} finally {
		resetSubtypeCache();
	}
}
var Empty = new EmptyClass();
var Reserved = new ReservedClass();
/**
* Client-only type for deserializing unknown data. Not supported by Candid, and its use is discouraged.
*/
var Unknown = new UnknownClass();
var Bool = new BoolClass();
var Null = new NullClass();
var Text = new TextClass();
var Int = new IntClass();
var Nat = new NatClass();
var Float32 = new FloatClass(32);
var Float64 = new FloatClass(64);
var Int8 = new FixedIntClass(8);
var Int16 = new FixedIntClass(16);
var Int32 = new FixedIntClass(32);
var Int64 = new FixedIntClass(64);
var Nat8 = new FixedNatClass(8);
var Nat16 = new FixedNatClass(16);
var Nat32 = new FixedNatClass(32);
var Nat64 = new FixedNatClass(64);
var Principal = new PrincipalClass();
/**
*
* @param types array of any types
* @returns TupleClass from those types
*/
function Tuple(...types) {
	return new TupleClass(types);
}
/**
*
* @param t IDL Type
* @returns VecClass from that type
*/
function Vec(t) {
	return new VecClass(t);
}
/**
*
* @param t IDL Type
* @returns OptClass of Type
*/
function Opt(t) {
	return new OptClass(t);
}
/**
*
* @param t Record of string and IDL Type
* @returns RecordClass of string and Type
*/
function Record(t) {
	return new RecordClass(t);
}
/**
*
* @param fields Record of string and IDL Type
* @returns VariantClass
*/
function Variant(fields) {
	return new VariantClass(fields);
}
/**
*
* @returns new RecClass
*/
function Rec() {
	return new RecClass();
}
/**
*
* @param args array of IDL Types
* @param ret array of IDL Types
* @param annotations array of strings, [] by default
* @returns new FuncClass
*/
function Func(args, ret, annotations = []) {
	return new FuncClass(args, ret, annotations);
}
/**
*
* @param t Record of string and FuncClass
* @returns ServiceClass
*/
function Service(t) {
	return new ServiceClass(t);
}
/**
* The list of relations between types we assume to hold. Uses the types .name property as key
*/
var Relations = class Relations {
	constructor(relations = /* @__PURE__ */ new Map()) {
		this.rels = relations;
	}
	copy() {
		const copy = /* @__PURE__ */ new Map();
		for (const [key, value] of this.rels.entries()) {
			const valCopy = new Map(value);
			copy.set(key, valCopy);
		}
		return new Relations(copy);
	}
	known(t1, t2) {
		return this.rels.get(t1.name)?.get(t2.name);
	}
	addNegative(t1, t2) {
		this.addNames(t1.name, t2.name, false);
	}
	add(t1, t2) {
		this.addNames(t1.name, t2.name, true);
	}
	display() {
		let result = "";
		for (const [t1, v] of this.rels) for (const [t2, known] of v) result += `${t1} ${known ? ":<" : "!<:"} ${t2}\n`;
		return result;
	}
	addNames(t1, t2, isSubtype) {
		const t1Map = this.rels.get(t1);
		if (t1Map == void 0) {
			const newMap = /* @__PURE__ */ new Map();
			newMap.set(t2, isSubtype);
			this.rels.set(t1, newMap);
		} else t1Map.set(t2, isSubtype);
	}
};
var subtypeCache = new Relations();
/** Resets the global subtyping cache */
function resetSubtypeCache() {
	subtypeCache = new Relations();
}
function eqFunctionAnnotations(t1, t2) {
	const t1Annotations = new Set(t1.annotations);
	const t2Annotations = new Set(t2.annotations);
	if (t1Annotations.size !== t2Annotations.size) return false;
	for (const a of t1Annotations) if (!t2Annotations.has(a)) return false;
	return true;
}
function canBeOmmitted(t) {
	return t instanceof OptClass || t instanceof NullClass || t instanceof ReservedClass;
}
/**
* Subtyping on Candid types t1 <: t2 (Exported for testing)
* @param t1 The potential subtype
* @param t2 The potential supertype
*/
function subtype(t1, t2) {
	const isSubtype = subtype_(subtypeCache.copy(), t1, t2);
	if (isSubtype) subtypeCache.add(t1, t2);
	else subtypeCache.addNegative(t1, t2);
	return isSubtype;
}
function subtype_(relations, t1, t2) {
	if (t1.name === t2.name) return true;
	const known = relations.known(t1, t2);
	if (known !== void 0) return known;
	relations.add(t1, t2);
	if (t2 instanceof ReservedClass) return true;
	if (t1 instanceof EmptyClass) return true;
	if (t1 instanceof NatClass && t2 instanceof IntClass) return true;
	if (t1 instanceof VecClass && t2 instanceof VecClass) return subtype_(relations, t1._type, t2._type);
	if (t2 instanceof OptClass) return true;
	if (t1 instanceof RecordClass && t2 instanceof RecordClass) {
		const t1Object = t1.fieldsAsObject;
		for (const [label, ty2] of t2._fields) {
			const ty1 = t1Object[idlLabelToId(label)];
			if (!ty1) {
				if (!canBeOmmitted(ty2)) return false;
			} else if (!subtype_(relations, ty1, ty2)) return false;
		}
		return true;
	}
	if (t1 instanceof FuncClass && t2 instanceof FuncClass) {
		if (!eqFunctionAnnotations(t1, t2)) return false;
		for (let i = 0; i < t1.argTypes.length; i++) {
			const argTy1 = t1.argTypes[i];
			if (i < t2.argTypes.length) {
				if (!subtype_(relations, t2.argTypes[i], argTy1)) return false;
			} else if (!canBeOmmitted(argTy1)) return false;
		}
		for (let i = 0; i < t2.retTypes.length; i++) {
			const retTy2 = t2.retTypes[i];
			if (i < t1.retTypes.length) {
				if (!subtype_(relations, t1.retTypes[i], retTy2)) return false;
			} else if (!canBeOmmitted(retTy2)) return false;
		}
		return true;
	}
	if (t1 instanceof VariantClass && t2 instanceof VariantClass) {
		const t2Object = t2.alternativesAsObject;
		for (const [label, ty1] of t1._fields) {
			const ty2 = t2Object[idlLabelToId(label)];
			if (!ty2) return false;
			if (!subtype_(relations, ty1, ty2)) return false;
		}
		return true;
	}
	if (t1 instanceof ServiceClass && t2 instanceof ServiceClass) {
		const t1Object = t1.fieldsAsObject();
		for (const [name, ty2] of t2._fields) {
			const ty1 = t1Object[name];
			if (!ty1) return false;
			if (!subtype_(relations, ty1, ty2)) return false;
		}
		return true;
	}
	if (t1 instanceof RecClass) return subtype_(relations, t1.getType(), t2);
	if (t2 instanceof RecClass) return subtype_(relations, t1, t2.getType());
	return false;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/candid-core.js
var InputBox = class {
	constructor(idl, ui) {
		this.idl = idl;
		this.ui = ui;
		this.label = null;
		this.value = void 0;
		const status = document.createElement("span");
		status.className = "status";
		this.status = status;
		if (ui.input) {
			ui.input.addEventListener("blur", () => {
				if (ui.input.value === "") return;
				this.parse();
			});
			ui.input.addEventListener("input", () => {
				status.style.display = "none";
				ui.input.classList.remove("reject");
			});
		}
	}
	isRejected() {
		return this.value === void 0;
	}
	parse(config = {}) {
		if (this.ui.form) {
			const value = this.ui.form.parse(config);
			this.value = value;
			return value;
		}
		if (this.ui.input) {
			const input = this.ui.input;
			try {
				const value = this.ui.parse(this.idl, config, input.value);
				if (!this.idl.covariant(value)) throw new Error(`${input.value} is not of type ${this.idl.display()}`);
				this.status.style.display = "none";
				this.value = value;
				return value;
			} catch (err) {
				input.classList.add("reject");
				this.status.style.display = "block";
				this.status.innerHTML = `InputError: ${err.message}`;
				this.value = void 0;
				return;
			}
		}
		return null;
	}
	render(dom) {
		const container = document.createElement("span");
		if (this.label) {
			const label = document.createElement("label");
			label.innerText = this.label;
			container.appendChild(label);
		}
		if (this.ui.input) {
			container.appendChild(this.ui.input);
			container.appendChild(this.status);
		}
		if (this.ui.form) this.ui.form.render(container);
		dom.appendChild(container);
	}
};
var InputForm = class {
	constructor(ui) {
		this.ui = ui;
		this.form = [];
	}
	renderForm(dom) {
		if (this.ui.container) {
			this.form.forEach((e) => e.render(this.ui.container));
			dom.appendChild(this.ui.container);
		} else this.form.forEach((e) => e.render(dom));
	}
	render(dom) {
		if (this.ui.open && this.ui.event) {
			dom.appendChild(this.ui.open);
			const form = this;
			form.ui.open.addEventListener(form.ui.event, () => {
				if (form.ui.container) form.ui.container.innerHTML = "";
				else {
					const oldContainer = form.ui.open.nextElementSibling;
					if (oldContainer) oldContainer.parentNode.removeChild(oldContainer);
				}
				form.generateForm();
				form.renderForm(dom);
			});
		} else {
			this.generateForm();
			this.renderForm(dom);
		}
	}
};
var RecordForm = class extends InputForm {
	constructor(fields, ui) {
		super(ui);
		this.fields = fields;
		this.ui = ui;
	}
	generateForm() {
		this.form = this.fields.map(([key, type]) => {
			const input = this.ui.render(type);
			if (this.ui.labelMap && this.ui.labelMap.hasOwnProperty(key)) input.label = `${this.ui.labelMap[key]} `;
			else input.label = `${key} `;
			return input;
		});
	}
	parse(config) {
		const v = {};
		this.fields.forEach(([key, _], i) => {
			const value = this.form[i].parse(config);
			v[key] = value;
		});
		if (this.form.some((input) => input.isRejected())) return;
		return v;
	}
};
var TupleForm = class extends InputForm {
	constructor(components, ui) {
		super(ui);
		this.components = components;
		this.ui = ui;
	}
	generateForm() {
		this.form = this.components.map((type) => {
			return this.ui.render(type);
		});
	}
	parse(config) {
		const v = [];
		this.components.forEach((_, i) => {
			const value = this.form[i].parse(config);
			v.push(value);
		});
		if (this.form.some((input) => input.isRejected())) return;
		return v;
	}
};
var VariantForm = class extends InputForm {
	constructor(fields, ui) {
		super(ui);
		this.fields = fields;
		this.ui = ui;
	}
	generateForm() {
		const index = this.ui.open.selectedIndex;
		const [_, type] = this.fields[index];
		const variant = this.ui.render(type);
		this.form = [variant];
	}
	parse(config) {
		const select = this.ui.open;
		const selected = select.options[select.selectedIndex].value;
		const value = this.form[0].parse(config);
		if (value === void 0) return;
		const v = {};
		v[selected] = value;
		return v;
	}
};
var OptionForm = class extends InputForm {
	constructor(ty, ui) {
		super(ui);
		this.ty = ty;
		this.ui = ui;
	}
	generateForm() {
		if (this.ui.open.checked) {
			const opt = this.ui.render(this.ty);
			this.form = [opt];
		} else this.form = [];
	}
	parse(config) {
		if (this.form.length === 0) return [];
		const value = this.form[0].parse(config);
		if (value === void 0) return;
		return [value];
	}
};
var VecForm = class extends InputForm {
	constructor(ty, ui) {
		super(ui);
		this.ty = ty;
		this.ui = ui;
	}
	generateForm() {
		const len = +this.ui.open.value;
		this.form = [];
		for (let i = 0; i < len; i++) {
			const t = this.ui.render(this.ty);
			this.form.push(t);
		}
	}
	parse(config) {
		const value = this.form.map((input) => {
			return input.parse(config);
		});
		if (this.form.some((input) => input.isRejected())) return;
		return value;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/candid/candid-ui.js
var InputConfig = { parse: parsePrimitive };
var FormConfig = { render: renderInput };
var inputBox = (t, config) => {
	return new InputBox(t, {
		...InputConfig,
		...config
	});
};
var recordForm = (fields, config) => {
	return new RecordForm(fields, {
		...FormConfig,
		...config
	});
};
var tupleForm = (components, config) => {
	return new TupleForm(components, {
		...FormConfig,
		...config
	});
};
var variantForm = (fields, config) => {
	return new VariantForm(fields, {
		...FormConfig,
		...config
	});
};
var optForm = (ty, config) => {
	return new OptionForm(ty, {
		...FormConfig,
		...config
	});
};
var vecForm = (ty, config) => {
	return new VecForm(ty, {
		...FormConfig,
		...config
	});
};
var Render = class extends Visitor {
	visitType(t, _d) {
		const input = document.createElement("input");
		input.classList.add("argument");
		input.placeholder = t.display();
		return inputBox(t, { input });
	}
	visitNull(t, _d) {
		return inputBox(t, {});
	}
	visitRecord(t, fields, _d) {
		let config = {};
		if (fields.length > 1) {
			const container = document.createElement("div");
			container.classList.add("popup-form");
			config = { container };
		}
		return inputBox(t, { form: recordForm(fields, config) });
	}
	visitTuple(t, components, _d) {
		let config = {};
		if (components.length > 1) {
			const container = document.createElement("div");
			container.classList.add("popup-form");
			config = { container };
		}
		return inputBox(t, { form: tupleForm(components, config) });
	}
	visitVariant(t, fields, _d) {
		const select = document.createElement("select");
		for (const [key, _type] of fields) {
			const option = new Option(key);
			select.add(option);
		}
		select.selectedIndex = -1;
		select.classList.add("open");
		return inputBox(t, { form: variantForm(fields, {
			open: select,
			event: "change"
		}) });
	}
	visitOpt(t, ty, _d) {
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.classList.add("open");
		return inputBox(t, { form: optForm(ty, {
			open: checkbox,
			event: "change"
		}) });
	}
	visitVec(t, ty, _d) {
		const len = document.createElement("input");
		len.type = "number";
		len.min = "0";
		len.max = "100";
		len.style.width = "8rem";
		len.placeholder = "len";
		len.classList.add("open");
		const container = document.createElement("div");
		container.classList.add("popup-form");
		return inputBox(t, { form: vecForm(ty, {
			open: len,
			event: "change",
			container
		}) });
	}
	visitRec(_t, ty, _d) {
		return renderInput(ty);
	}
};
var Parse = class extends Visitor {
	visitNull(_t, _v) {
		return null;
	}
	visitBool(_t, v) {
		if (v === "true") return true;
		if (v === "false") return false;
		throw new Error(`Cannot parse ${v} as boolean`);
	}
	visitText(_t, v) {
		return v;
	}
	visitFloat(_t, v) {
		return parseFloat(v);
	}
	visitFixedInt(t, v) {
		if (t._bits <= 32) return parseInt(v, 10);
		return BigInt(v);
	}
	visitFixedNat(t, v) {
		if (t._bits <= 32) return parseInt(v, 10);
		return BigInt(v);
	}
	visitNumber(_t, v) {
		return BigInt(v);
	}
	visitPrincipal(_t, v) {
		return Principal$1.fromText(v);
	}
	visitService(_t, v) {
		return Principal$1.fromText(v);
	}
	visitFunc(_t, v) {
		const x = v.split(".", 2);
		return [Principal$1.fromText(x[0]), x[1]];
	}
};
var Random = class extends Visitor {
	visitNull(_t, _v) {
		return null;
	}
	visitBool(_t, _v) {
		return Math.random() < .5;
	}
	visitText(_t, _v) {
		return Math.random().toString(36).substring(6);
	}
	visitFloat(_t, _v) {
		return Math.random();
	}
	visitInt(_t, _v) {
		return BigInt(this.generateNumber(true));
	}
	visitNat(_t, _v) {
		return BigInt(this.generateNumber(false));
	}
	visitFixedInt(t, v) {
		const x = this.generateNumber(true);
		if (t._bits <= 32) return x;
		return BigInt(v);
	}
	visitFixedNat(t, v) {
		const x = this.generateNumber(false);
		if (t._bits <= 32) return x;
		return BigInt(v);
	}
	generateNumber(signed) {
		const num = Math.floor(Math.random() * 100);
		if (signed && Math.random() < .5) return -num;
		return num;
	}
};
function parsePrimitive(t, config, d) {
	if (config.random && d === "") return t.accept(new Random(), d);
	return t.accept(new Parse(), d);
}
/**
*
* @param t an IDL type
* @returns an input for that type
*/
function renderInput(t) {
	return t.accept(new Render(), null);
}
/**
*
* @param t an IDL Type
* @param input an InputBox
* @param value any
* @returns rendering that value to the provided input
*/
function renderValue(t, input, value) {
	return t.accept(new RenderValue(), {
		input,
		value
	});
}
var RenderValue = class extends Visitor {
	visitType(t, d) {
		d.input.ui.input.value = t.valueToString(d.value);
	}
	visitNull(_t, _d) {}
	visitText(_t, d) {
		d.input.ui.input.value = d.value;
	}
	visitRec(_t, ty, d) {
		renderValue(ty, d.input, d.value);
	}
	visitOpt(_t, ty, d) {
		if (d.value.length !== 0) {
			const form = d.input.ui.form;
			const open = form.ui.open;
			open.checked = true;
			open.dispatchEvent(new Event(form.ui.event));
			renderValue(ty, form.form[0], d.value[0]);
		}
	}
	visitRecord(_t, fields, d) {
		const form = d.input.ui.form;
		fields.forEach(([key, type], i) => {
			renderValue(type, form.form[i], d.value[key]);
		});
	}
	visitTuple(_t, components, d) {
		const form = d.input.ui.form;
		components.forEach((type, i) => {
			renderValue(type, form.form[i], d.value[i]);
		});
	}
	visitVariant(_t, fields, d) {
		const form = d.input.ui.form;
		const selected = Object.entries(d.value)[0];
		fields.forEach(([key, type], i) => {
			if (key === selected[0]) {
				const open = form.ui.open;
				open.selectedIndex = i;
				open.dispatchEvent(new Event(form.ui.event));
				renderValue(type, form.form[0], selected[1]);
			}
		});
	}
	visitVec(_t, ty, d) {
		const form = d.input.ui.form;
		const len = d.value.length;
		const open = form.ui.open;
		open.value = len;
		open.dispatchEvent(new Event(form.ui.event));
		d.value.forEach((v, i) => {
			renderValue(ty, form.form[i], v);
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/buffer.js
/**
* Returns a true Uint8Array from an ArrayBufferLike object.
* @param bufLike a buffer-like object
* @returns Uint8Array
*/
function uint8FromBufLike(bufLike) {
	if (!bufLike) throw new Error("Input cannot be null or undefined");
	if (bufLike instanceof Uint8Array) return bufLike;
	if (bufLike instanceof ArrayBuffer) return new Uint8Array(bufLike);
	if (Array.isArray(bufLike)) return new Uint8Array(bufLike);
	if ("buffer" in bufLike) return uint8FromBufLike(bufLike.buffer);
	return new Uint8Array(bufLike);
}
/**
* Compares two Uint8Arrays for equality.
* @param a The first Uint8Array.
* @param b The second Uint8Array.
* @returns True if the Uint8Arrays are equal, false otherwise.
*/
function uint8Equals(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/request_id.js
/**
*
* @param value unknown value
* @returns Uint8Array
*/
function hashValue(value) {
	if (typeof value === "string") return hashString(value);
	if (typeof value === "number") return sha256(lebEncode(value));
	if (value instanceof Uint8Array || ArrayBuffer.isView(value)) return sha256(uint8FromBufLike(value));
	if (Array.isArray(value)) return sha256(concatBytes(...value.map(hashValue)));
	if (value && typeof value === "object" && value._isPrincipal) return sha256(value.toUint8Array());
	if (typeof value === "object" && value !== null && typeof value.toHash === "function") return hashValue(value.toHash());
	if (typeof value === "object") return hashOfMap(value);
	if (typeof value === "bigint") return sha256(lebEncode(value));
	throw InputError.fromCode(new HashValueErrorCode(value));
}
var hashString = (value) => {
	return sha256(new TextEncoder().encode(value));
};
/**
* Get the RequestId of the provided ic-ref request.
* RequestId is the result of the representation-independent-hash function.
* https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
* @param request - ic-ref request to hash into RequestId
*/
function requestIdOf(request) {
	return hashOfMap(request);
}
/**
* Hash a map into a Uint8Array using the representation-independent-hash function.
* https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
* @param map - Any non-nested object
* @returns Uint8Array
*/
function hashOfMap(map) {
	return sha256(concatBytes(...Object.entries(map).filter(([, value]) => value !== void 0).map(([key, value]) => {
		return [hashString(key), hashValue(value)];
	}).sort(([k1], [k2]) => {
		return compare(k1, k2);
	}).map((x) => concatBytes(...x))));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/constants.js
/**
* The `\x0Dic-state-root` domain separator used in the root hash of IC certificates.
*/
var IC_STATE_ROOT_DOMAIN_SEPARATOR = new TextEncoder().encode("\ric-state-root");
/**
* The `\x0Aic-request` domain separator used in the signature of IC requests.
*/
var IC_REQUEST_DOMAIN_SEPARATOR = new TextEncoder().encode("\nic-request");
/**
* The `\x0Bic-response` domain separator used in the signature of IC responses.
*/
var IC_RESPONSE_DOMAIN_SEPARATOR = new TextEncoder().encode("\vic-response");
/**
* The `\x1Aic-request-auth-delegation` domain separator used in the signature of delegations.
*/
var IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR = new TextEncoder().encode("ic-request-auth-delegation");
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/auth.js
/**
* An Identity that can sign blobs.
*/
var SignIdentity = class {
	/**
	* Get the principal represented by this identity. Normally should be a
	* `Principal.selfAuthenticating()`.
	*/
	getPrincipal() {
		if (!this._principal) this._principal = Principal$1.selfAuthenticating(new Uint8Array(this.getPublicKey().toDer()));
		return this._principal;
	}
	/**
	* Transform a request into a signed version of the request. This is done last
	* after the transforms on the body of a request. The returned object can be
	* anything, but must be serializable to CBOR.
	* @param request - internet computer request to transform
	*/
	async transformRequest(request) {
		const { body, ...fields } = request;
		const requestId = requestIdOf(body);
		return {
			...fields,
			body: {
				content: body,
				sender_pubkey: this.getPublicKey().toDer(),
				sender_sig: await this.sign(concatBytes(IC_REQUEST_DOMAIN_SEPARATOR, requestId))
			}
		};
	}
};
var AnonymousIdentity = class {
	getPrincipal() {
		return Principal$1.anonymous();
	}
	async transformRequest(request) {
		return {
			...request,
			body: { content: request.body }
		};
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@dfinity+cbor@0.2.3/node_modules/@dfinity/cbor/dist/cbor.mjs
var w = class extends Error {
	constructor(e) {
		super(e), this.name = "DecodingError";
	}
};
var L = 55799;
var R = /* @__PURE__ */ Symbol("CBOR_STOP_CODE");
var u = /* @__PURE__ */ ((t) => (t[t.False = 20] = "False", t[t.True = 21] = "True", t[t.Null = 22] = "Null", t[t.Undefined = 23] = "Undefined", t[t.Break = 31] = "Break", t))(u || {});
var c = /* @__PURE__ */ ((t) => (t[t.UnsignedInteger = 0] = "UnsignedInteger", t[t.NegativeInteger = 1] = "NegativeInteger", t[t.ByteString = 2] = "ByteString", t[t.TextString = 3] = "TextString", t[t.Array = 4] = "Array", t[t.Map = 5] = "Map", t[t.Tag = 6] = "Tag", t[t.Simple = 7] = "Simple", t))(c || {});
var Y = 23;
var G = 255;
var P = 65535;
var H = 4294967295;
var W = BigInt("0xffffffffffffffff");
var f = /* @__PURE__ */ ((t) => (t[t.Value = 23] = "Value", t[t.OneByte = 24] = "OneByte", t[t.TwoBytes = 25] = "TwoBytes", t[t.FourBytes = 26] = "FourBytes", t[t.EightBytes = 27] = "EightBytes", t[t.Indefinite = 31] = "Indefinite", t))(f || {});
var l = !1;
function K(t) {
	return t == null;
}
function Z(t, e) {
	const n = new Uint8Array(e);
	return n.set(t), n;
}
var q = new TextDecoder();
function J(t) {
	return (t & 224) >> 5;
}
function Q(t) {
	return t & 31;
}
var S = /* @__PURE__ */ new Uint8Array();
var U;
var d = 0;
function ut(t, e) {
	S = t, d = 0;
	const n = B(e);
	return e?.(n) ?? n;
}
function B(t) {
	const [e, n] = N();
	switch (e) {
		case c.UnsignedInteger: return h(n);
		case c.NegativeInteger: return M(n);
		case c.ByteString: return $(n);
		case c.TextString: return F(n);
		case c.Array: return p(n, t);
		case c.Map: return j(n, t);
		case c.Tag: return v(n, t);
		case c.Simple: return b(n);
	}
	throw new w(`Unsupported major type: ${e}`);
}
function N() {
	const t = S.at(d);
	if (K(t)) throw new w("Provided CBOR data is empty");
	const e = J(t), n = Q(t);
	return d++, [e, n];
}
function p(t, e) {
	const n = h(t);
	if (n === 1 / 0) {
		const o = [];
		let i = B(e);
		for (; i !== R;) o.push(e?.(i) ?? i), i = B(e);
		return o;
	}
	const s = new Array(n);
	for (let o = 0; o < n; o++) {
		const i = B(e);
		s[o] = e?.(i) ?? i;
	}
	return s;
}
function b(t) {
	switch (t) {
		case u.False: return !1;
		case u.True: return !0;
		case u.Null: return null;
		case u.Undefined: return;
		case u.Break: return R;
	}
	throw new w(`Unrecognized simple type: ${t.toString(2)}`);
}
function j(t, e) {
	const n = h(t), s = {};
	if (n === 1 / 0) {
		let [o, i] = N();
		for (; o !== c.Simple && i !== u.Break;) {
			const A = F(i), I = B(e);
			s[A] = e?.(I, A) ?? I, [o, i] = N();
		}
		return s;
	}
	for (let o = 0; o < n; o++) {
		const [i, A] = N();
		if (i !== c.TextString) throw new w("Map keys must be text strings");
		const I = F(A), D = B(e);
		s[I] = e?.(D, I) ?? D;
	}
	return s;
}
function h(t) {
	if (t <= f.Value) return t;
	switch (U = new DataView(S.buffer, S.byteOffset + d), t) {
		case f.OneByte: return d++, U.getUint8(0);
		case f.TwoBytes: return d += 2, U.getUint16(0, l);
		case f.FourBytes: return d += 4, U.getUint32(0, l);
		case f.EightBytes: return d += 8, U.getBigUint64(0, l);
		case f.Indefinite: return 1 / 0;
		default: throw new w(`Unsupported integer info: ${t.toString(2)}`);
	}
}
function M(t) {
	const e = h(t);
	return typeof e == "number" ? -1 - e : -1n - e;
}
function $(t) {
	const e = h(t);
	if (e > Number.MAX_SAFE_INTEGER) throw new w("Byte length is too large");
	const n = Number(e);
	return d += n, S.slice(d - n, d);
}
function F(t) {
	const e = $(t);
	return q.decode(e);
}
function v(t, e) {
	const n = h(t);
	if (n === L) return B(e);
	throw new w(`Unsupported tag: ${n}.`);
}
var x = class extends Error {
	constructor(e) {
		super(e), this.name = "SerializationError";
	}
};
var C = 2048;
var V = 100;
var tt = new TextEncoder();
function y(t) {
	return t << 5;
}
var a = new Uint8Array(C);
var g = new DataView(a.buffer);
var r$1 = 0;
var O = [];
function gt(t, e) {
	r$1 = 0;
	return ft(L, e?.(t) ?? t, e), a.slice(0, r$1);
}
function k(t) {
	let e = a.length * 2;
	for (; e < t;) e *= 2;
	a = Z(a, e), g = new DataView(a.buffer);
}
function _(t, e) {
	if (t === !1 || t === !0 || t === null || t === void 0) {
		rt(t);
		return;
	}
	if (typeof t == "number" || typeof t == "bigint") {
		ot(t);
		return;
	}
	if (typeof t == "string") {
		z(t);
		return;
	}
	if (t instanceof Uint8Array) {
		m(t);
		return;
	}
	if (t instanceof ArrayBuffer) {
		m(new Uint8Array(t));
		return;
	}
	if (Array.isArray(t)) {
		et(t, e);
		return;
	}
	if (typeof t == "object") {
		nt(t, e);
		return;
	}
	throw new x(`Unsupported type: ${typeof t}`);
}
function et(t, e) {
	E(c.Array, t.length), t.forEach((n, s) => {
		_(e?.(n, s.toString()) ?? n, e);
	});
}
function nt(t, e) {
	O = Object.entries(t), E(c.Map, O.length), O.forEach(([n, s]) => {
		z(n), _(e?.(s, n) ?? s, e);
	});
}
function E(t, e) {
	if (r$1 > a.length - V && k(r$1 + V), e <= Y) {
		g.setUint8(r$1++, y(t) | Number(e));
		return;
	}
	if (e <= G) {
		g.setUint8(r$1++, y(t) | f.OneByte), g.setUint8(r$1, Number(e)), r$1 += 1;
		return;
	}
	if (e <= P) {
		g.setUint8(r$1++, y(t) | f.TwoBytes), g.setUint16(r$1, Number(e), l), r$1 += 2;
		return;
	}
	if (e <= H) {
		g.setUint8(r$1++, y(t) | f.FourBytes), g.setUint32(r$1, Number(e), l), r$1 += 4;
		return;
	}
	if (e <= W) {
		g.setUint8(r$1++, y(t) | f.EightBytes), g.setBigUint64(r$1, BigInt(e), l), r$1 += 8;
		return;
	}
	throw new x(`Value too large to encode: ${e}`);
}
function rt(t) {
	E(c.Simple, ct(t));
}
function ct(t) {
	if (t === !1) return u.False;
	if (t === !0) return u.True;
	if (t === null) return u.Null;
	if (t === void 0) return u.Undefined;
	throw new x(`Unrecognized simple value: ${t.toString()}`);
}
function T(t, e) {
	E(t, e.length), r$1 > a.length - e.length && k(r$1 + e.length), a.set(e, r$1), r$1 += e.length;
}
function X(t, e) {
	E(t, e);
}
function it(t) {
	X(c.UnsignedInteger, t);
}
function st(t) {
	X(c.NegativeInteger, typeof t == "bigint" ? -1n - t : -1 - t);
}
function ot(t) {
	t >= 0 ? it(t) : st(t);
}
function z(t) {
	T(c.TextString, tt.encode(t));
}
function m(t) {
	T(c.ByteString, t);
}
function ft(t, e, n) {
	E(c.Tag, t), _(e, n);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/http/expiry.js
var JSON_KEY_EXPIRY = "__expiry__";
var SECONDS_TO_MILLISECONDS = BigInt(1e3);
var MILLISECONDS_TO_NANOSECONDS = BigInt(1e6);
var MINUTES_TO_MILLISECONDS = BigInt(60) * SECONDS_TO_MILLISECONDS;
var EXPIRY_DELTA_THRESHOLD_MILLISECONDS = BigInt(1) * MINUTES_TO_MILLISECONDS;
function roundToSecond(millis) {
	return millis / SECONDS_TO_MILLISECONDS * SECONDS_TO_MILLISECONDS;
}
function roundToMinute(millis) {
	return millis / MINUTES_TO_MILLISECONDS * MINUTES_TO_MILLISECONDS;
}
var Expiry = class Expiry {
	constructor(__expiry__) {
		this.__expiry__ = __expiry__;
		this._isExpiry = true;
	}
	/**
	* Creates an Expiry object from a delta in milliseconds.
	* The expiry is calculated as: current_time + delta + clock_drift
	* The resulting expiry is then rounded:
	* - If rounding down to the nearest minute still provides at least 60 seconds in the future, use minute precision
	* - Otherwise, use second precision
	* @param deltaInMs The milliseconds to add to the current time.
	* @param clockDriftInMs The milliseconds to add to the current time, typically the clock drift between IC network clock and the client's clock. Defaults to `0` if not provided.
	* @returns {Expiry} The constructed Expiry object.
	*/
	static fromDeltaInMilliseconds(deltaInMs, clockDriftInMs = 0) {
		const correctedNowMs = BigInt(Date.now()) + BigInt(clockDriftInMs);
		const expiryMs = correctedNowMs + BigInt(deltaInMs);
		const roundedToMinute = roundToMinute(expiryMs);
		let roundedExpiryMs;
		if (roundedToMinute >= correctedNowMs + EXPIRY_DELTA_THRESHOLD_MILLISECONDS) roundedExpiryMs = roundedToMinute;
		else roundedExpiryMs = roundToSecond(expiryMs);
		return new Expiry(roundedExpiryMs * MILLISECONDS_TO_NANOSECONDS);
	}
	toBigInt() {
		return this.__expiry__;
	}
	toHash() {
		return lebEncode(this.__expiry__);
	}
	toString() {
		return this.__expiry__.toString();
	}
	/**
	* Serializes to JSON
	* @returns {JsonnableExpiry} a JSON object with a single key, {@link JSON_KEY_EXPIRY}, whose value is the expiry as a string
	*/
	toJSON() {
		return { [JSON_KEY_EXPIRY]: this.toString() };
	}
	/**
	* Deserializes a {@link JsonnableExpiry} object from a JSON string.
	* @param input The JSON string to deserialize.
	* @returns {Expiry} The deserialized Expiry object.
	*/
	static fromJSON(input) {
		const obj = JSON.parse(input);
		if (obj["__expiry__"]) try {
			const expiry = BigInt(obj[JSON_KEY_EXPIRY]);
			return new Expiry(expiry);
		} catch (error) {
			throw new InputError(new ExpiryJsonDeserializeErrorCode(`Not a valid BigInt: ${error}`));
		}
		throw new InputError(new ExpiryJsonDeserializeErrorCode(`The input does not contain the key ${JSON_KEY_EXPIRY}`));
	}
	static isExpiry(other) {
		return other instanceof Expiry || typeof other === "object" && other !== null && "_isExpiry" in other && other["_isExpiry"] === true && "__expiry__" in other && typeof other["__expiry__"] === "bigint";
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/cbor.js
function hasCborValueMethod(value) {
	return typeof value === "object" && value !== null && "toCborValue" in value;
}
/**
* Encode a JavaScript value into CBOR. If the value is an instance of {@link ToCborValue},
* the {@link ToCborValue.toCborValue} method will be called to get the value to encode.
* @param value The value to encode
*/
function encode(value) {
	try {
		return gt(value, (value) => {
			if (Principal$1.isPrincipal(value)) return value.toUint8Array();
			if (Expiry.isExpiry(value)) return value.toBigInt();
			if (hasCborValueMethod(value)) return value.toCborValue();
			return value;
		});
	} catch (error) {
		throw InputError.fromCode(new CborEncodeErrorCode(error, value));
	}
}
/**
* Decode a CBOR encoded value into a JavaScript value.
* @param input The CBOR encoded value
*/
function decode(input) {
	try {
		return ut(input);
	} catch (error) {
		throw InputError.fromCode(new CborDecodeErrorCode(error, input));
	}
}
var Cbor = {
	encode,
	decode
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/random.js
/**
* Generates a random unsigned 32-bit integer between 0 and 0xffffffff
* @returns {number} a random number
*/
var randomNumber = () => {
	if (typeof window !== "undefined" && !!window.crypto && !!window.crypto.getRandomValues) {
		const array = /* @__PURE__ */ new Uint32Array(1);
		window.crypto.getRandomValues(array);
		return array[0];
	}
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		const array = /* @__PURE__ */ new Uint32Array(1);
		crypto.getRandomValues(array);
		return array[0];
	}
	if (typeof crypto !== "undefined" && crypto.randomInt) return crypto.randomInt(0, 4294967295);
	return Math.floor(Math.random() * 4294967295);
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/http/types.js
/**
* @internal
*/
var Endpoint;
(function(Endpoint) {
	Endpoint["Query"] = "read";
	Endpoint["ReadState"] = "read_state";
	Endpoint["Call"] = "call";
})(Endpoint || (Endpoint = {}));
var SubmitRequestType;
(function(SubmitRequestType) {
	SubmitRequestType["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));
var ReadRequestType;
(function(ReadRequestType) {
	ReadRequestType["Query"] = "query";
	ReadRequestType["ReadState"] = "read_state";
})(ReadRequestType || (ReadRequestType = {}));
/**
* Possible values for the request status in the IC state tree.
* @see https://internetcomputer.org/docs/references/ic-interface-spec#state-tree-request-status
*/
var RequestStatusResponseStatus;
(function(RequestStatusResponseStatus) {
	/** The call has made it past the endpoint into the IC's state. */
	RequestStatusResponseStatus["Received"] = "received";
	/** The initial effect of the call has happened or will happen. */
	RequestStatusResponseStatus["Processing"] = "processing";
	/** The call completed successfully; the reply is available at `/request_status/<id>/reply`. */
	RequestStatusResponseStatus["Replied"] = "replied";
	/** The call failed; reject code and message are available at `/request_status/<id>/reject_code` and `/request_status/<id>/reject_message`. */
	RequestStatusResponseStatus["Rejected"] = "rejected";
	/** The request status path is absent from the state tree, the request is unknown to the IC (never received or pruned after expiry). */
	RequestStatusResponseStatus["Unknown"] = "unknown";
	/** The IC has pruned the response data but remembers the request to prevent replay attacks. */
	RequestStatusResponseStatus["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
/**
* Create a random Nonce, based on random values
*/
function makeNonce() {
	const buffer = /* @__PURE__ */ new ArrayBuffer(16);
	const view = new DataView(buffer);
	const rand1 = randomNumber();
	const rand2 = randomNumber();
	const rand3 = randomNumber();
	const rand4 = randomNumber();
	view.setUint32(0, rand1);
	view.setUint32(4, rand2);
	view.setUint32(8, rand3);
	view.setUint32(12, rand4);
	return Object.assign(new Uint8Array(buffer), { __nonce__: void 0 });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/http/transforms.js
/**
* Create a Nonce transform, which takes a function that returns a Buffer, and adds it
* as the nonce to every call requests.
* @param nonceFn A function that returns a buffer. By default uses a semi-random method.
*/
function makeNonceTransform(nonceFn = makeNonce) {
	return async (request) => {
		const headers = request.request.headers;
		request.request.headers = headers;
		if (request.endpoint === Endpoint.Call) request.body.nonce = nonceFn();
	};
}
/**
* Maps the default fetch headers field to the serializable HttpHeaderField.
* @param headers Fetch definition of the headers type
* @returns array of header fields
*/
function httpHeadersTransform(headers) {
	const headerFields = [];
	headers.forEach((value, key) => {
		headerFields.push([key, value]);
	});
	return headerFields;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/utils.js
/**
* Hex, bytes and number utilities.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$8 = /* @__PURE__ */ BigInt(0);
var _1n$8 = /* @__PURE__ */ BigInt(1);
function _abool2(value, title = "") {
	if (typeof value !== "boolean") {
		const prefix = title && `"${title}"`;
		throw new Error(prefix + "expected boolean, got type=" + typeof value);
	}
	return value;
}
/** Asserts something is Uint8Array. */
function _abytes2(value, length, title = "") {
	const bytes = isBytes(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
	}
	return value;
}
function hexToNumber(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	return hex === "" ? _0n$8 : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
	return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
	abytes(bytes);
	return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
	return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
	return numberToBytesBE(n, len).reverse();
}
/**
* Takes hex string or Uint8Array, converts to Uint8Array.
* Validates output length.
* Will throw error for other types.
* @param title descriptive title for an error e.g. 'secret key'
* @param hex hex string or Uint8Array
* @param expectedLength optional, will compare to result array's length
* @returns
*/
function ensureBytes(title, hex, expectedLength) {
	let res;
	if (typeof hex === "string") try {
		res = hexToBytes(hex);
	} catch (e) {
		throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
	}
	else if (isBytes(hex)) res = Uint8Array.from(hex);
	else throw new Error(title + " must be hex string or Uint8Array");
	const len = res.length;
	if (typeof expectedLength === "number" && len !== expectedLength) throw new Error(title + " of length " + expectedLength + " expected, got " + len);
	return res;
}
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
/**
* Copies Uint8Array. We can't use u8a.slice(), because u8a can be Buffer,
* and Buffer#slice creates mutable copy. Never use Buffers!
*/
function copyBytes(bytes) {
	return Uint8Array.from(bytes);
}
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
/**
* Converts bytes to string using UTF8 encoding.
* @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
*/
var isPosBig = (n) => typeof n === "bigint" && _0n$8 <= n;
function inRange(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts min <= n < max. NOTE: It's < max and not <= max.
* @example
* aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
*/
function aInRange(title, n, min, max) {
	if (!inRange(n, min, max)) throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
* TODO: merge with nLength in modular
*/
function bitLen(n) {
	let len = 0;
	for (; n > _0n$8; n >>= _1n$8, len += 1);
	return len;
}
/**
* Gets single bit at position.
* NOTE: first bit position is 0 (same as arrays)
* Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
*/
function bitGet(n, pos) {
	return n >> BigInt(pos) & _1n$8;
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
*/
var bitMask = (n) => (_1n$8 << BigInt(n)) - _1n$8;
function isHash(val) {
	return typeof val === "function" && Number.isSafeInteger(val.outputLen);
}
function _validateObject(object, fields, optFields = {}) {
	if (!object || typeof object !== "object") throw new Error("expected valid options object");
	function checkField(fieldName, expectedType, isOpt) {
		const val = object[fieldName];
		if (isOpt && val === void 0) return;
		const current = typeof val;
		if (current !== expectedType || val === null) throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
	}
	Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
	Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
/**
* throws not implemented error
*/
var notImplemented = () => {
	throw new Error("not implemented");
};
/**
* Memoizes (caches) computation result.
* Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
*/
function memoized(fn) {
	const map = /* @__PURE__ */ new WeakMap();
	return (arg, ...args) => {
		const val = map.get(arg);
		if (val !== void 0) return val;
		const computed = fn(arg, ...args);
		map.set(arg, computed);
		return computed;
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/modular.js
/**
* Utils for modular division and fields.
* Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$7 = BigInt(0);
var _1n$7 = BigInt(1);
var _2n$6 = /* @__PURE__ */ BigInt(2);
var _3n$4 = /* @__PURE__ */ BigInt(3);
var _4n$2 = /* @__PURE__ */ BigInt(4);
var _5n$1 = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n$2 = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
	const result = a % b;
	return result >= _0n$7 ? result : b + result;
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
	let res = x;
	while (power-- > _0n$7) {
		res *= res;
		res %= modulo;
	}
	return res;
}
/**
* Inverses number over modulo.
* Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
*/
function invert(number, modulo) {
	if (number === _0n$7) throw new Error("invert: expected non-zero number");
	if (modulo <= _0n$7) throw new Error("invert: expected positive modulus, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$7, y = _1n$7, u = _1n$7, v = _0n$7;
	while (a !== _0n$7) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	if (b !== _1n$7) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
	if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
	const p1div4 = (Fp.ORDER + _1n$7) / _4n$2;
	const root = Fp.pow(n, p1div4);
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt5mod8(Fp, n) {
	const p5div8 = (Fp.ORDER - _5n$1) / _8n$2;
	const n2 = Fp.mul(n, _2n$6);
	const v = Fp.pow(n2, p5div8);
	const nv = Fp.mul(n, v);
	const i = Fp.mul(Fp.mul(nv, _2n$6), v);
	const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt9mod16(P) {
	const Fp_ = Field(P);
	const tn = tonelliShanks(P);
	const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
	const c2 = tn(Fp_, c1);
	const c3 = tn(Fp_, Fp_.neg(c1));
	const c4 = (P + _7n) / _16n;
	return (Fp, n) => {
		let tv1 = Fp.pow(n, c4);
		let tv2 = Fp.mul(tv1, c1);
		const tv3 = Fp.mul(tv1, c2);
		const tv4 = Fp.mul(tv1, c3);
		const e1 = Fp.eql(Fp.sqr(tv2), n);
		const e2 = Fp.eql(Fp.sqr(tv3), n);
		tv1 = Fp.cmov(tv1, tv2, e1);
		tv2 = Fp.cmov(tv4, tv3, e2);
		const e3 = Fp.eql(Fp.sqr(tv2), n);
		const root = Fp.cmov(tv1, tv2, e3);
		assertIsSquare(Fp, root, n);
		return root;
	};
}
/**
* Tonelli-Shanks square root search algorithm.
* 1. https://eprint.iacr.org/2012/685.pdf (page 12)
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P field order
* @returns function that takes field Fp (created from P) and number n
*/
function tonelliShanks(P) {
	if (P < _3n$4) throw new Error("sqrt is not defined for small field");
	let Q = P - _1n$7;
	let S = 0;
	while (Q % _2n$6 === _0n$7) {
		Q /= _2n$6;
		S++;
	}
	let Z = _2n$6;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$7) / _2n$6;
	return function tonelliSlow(Fp, n) {
		if (Fp.is0(n)) return n;
		if (FpLegendre(Fp, n) !== 1) throw new Error("Cannot find square root");
		let M = S;
		let c = Fp.mul(Fp.ONE, cc);
		let t = Fp.pow(n, Q);
		let R = Fp.pow(n, Q1div2);
		while (!Fp.eql(t, Fp.ONE)) {
			if (Fp.is0(t)) return Fp.ZERO;
			let i = 1;
			let t_tmp = Fp.sqr(t);
			while (!Fp.eql(t_tmp, Fp.ONE)) {
				i++;
				t_tmp = Fp.sqr(t_tmp);
				if (i === M) throw new Error("Cannot find square root");
			}
			const exponent = _1n$7 << BigInt(M - i - 1);
			const b = Fp.pow(c, exponent);
			M = i;
			c = Fp.sqr(b);
			t = Fp.mul(t, c);
			R = Fp.mul(R, b);
		}
		return R;
	};
}
/**
* Square root for a finite field. Will try optimized versions first:
*
* 1. P ≡ 3 (mod 4)
* 2. P ≡ 5 (mod 8)
* 3. P ≡ 9 (mod 16)
* 4. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
*/
function FpSqrt(P) {
	if (P % _4n$2 === _3n$4) return sqrt3mod4;
	if (P % _8n$2 === _5n$1) return sqrt5mod8;
	if (P % _16n === _9n) return sqrt9mod16(P);
	return tonelliShanks(P);
}
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$7) === _1n$7;
var FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function validateField(field) {
	_validateObject(field, FIELD_FIELDS.reduce((map, val) => {
		map[val] = "function";
		return map;
	}, {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "number",
		BITS: "number"
	}));
	return field;
}
/**
* Same as `pow` but for Fp: non-constant-time.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
*/
function FpPow(Fp, num, power) {
	if (power < _0n$7) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$7) return Fp.ONE;
	if (power === _1n$7) return num;
	let p = Fp.ONE;
	let d = num;
	while (power > _0n$7) {
		if (power & _1n$7) p = Fp.mul(p, d);
		d = Fp.sqr(d);
		power >>= _1n$7;
	}
	return p;
}
/**
* Efficiently invert an array of Field elements.
* Exception-free. Will return `undefined` for 0 elements.
* @param passZero map 0 to 0 (instead of undefined)
*/
function FpInvertBatch(Fp, nums, passZero = false) {
	const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
	const multipliedAcc = nums.reduce((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = acc;
		return Fp.mul(acc, num);
	}, Fp.ONE);
	const invertedAcc = Fp.inv(multipliedAcc);
	nums.reduceRight((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = Fp.mul(acc, inverted[i]);
		return Fp.mul(acc, num);
	}, invertedAcc);
	return inverted;
}
/**
* Legendre symbol.
* Legendre constant is used to calculate Legendre symbol (a | p)
* which denotes the value of a^((p-1)/2) (mod p).
*
* * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
* * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
* * (a | p) ≡ 0    if a ≡ 0 (mod p)
*/
function FpLegendre(Fp, n) {
	const p1mod2 = (Fp.ORDER - _1n$7) / _2n$6;
	const powered = Fp.pow(n, p1mod2);
	const yes = Fp.eql(powered, Fp.ONE);
	const zero = Fp.eql(powered, Fp.ZERO);
	const no = Fp.eql(powered, Fp.neg(Fp.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber(nBitLength);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
/**
* Creates a finite field. Major performance optimizations:
* * 1. Denormalized operations like mulN instead of mul.
* * 2. Identical object shape: never add or remove keys.
* * 3. `Object.freeze`.
* Fragile: always run a benchmark on a change.
* Security note: operations don't check 'isValid' for all elements for performance reasons,
* it is caller responsibility to check this.
* This is low-level code, please make sure you know what you're doing.
*
* Note about field properties:
* * CHARACTERISTIC p = prime number, number of elements in main subgroup.
* * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
*
* @param ORDER field order, probably prime, or could be composite
* @param bitLen how many bits the field consumes
* @param isLE (default: false) if encoding / decoding should be in little-endian
* @param redef optional faster redefinitions of sqrt and other methods
*/
function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
	if (ORDER <= _0n$7) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
	let _nbitLength = void 0;
	let _sqrt = void 0;
	let modFromBytes = false;
	let allowedLengths = void 0;
	if (typeof bitLenOrOpts === "object" && bitLenOrOpts != null) {
		if (opts.sqrt || isLE) throw new Error("cannot specify opts in two arguments");
		const _opts = bitLenOrOpts;
		if (_opts.BITS) _nbitLength = _opts.BITS;
		if (_opts.sqrt) _sqrt = _opts.sqrt;
		if (typeof _opts.isLE === "boolean") isLE = _opts.isLE;
		if (typeof _opts.modFromBytes === "boolean") modFromBytes = _opts.modFromBytes;
		allowedLengths = _opts.allowedLengths;
	} else {
		if (typeof bitLenOrOpts === "number") _nbitLength = bitLenOrOpts;
		if (opts.sqrt) _sqrt = opts.sqrt;
	}
	const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
	if (BYTES > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let sqrtP;
	const f = Object.freeze({
		ORDER,
		isLE,
		BITS,
		BYTES,
		MASK: bitMask(BITS),
		ZERO: _0n$7,
		ONE: _1n$7,
		allowedLengths,
		create: (num) => mod(num, ORDER),
		isValid: (num) => {
			if (typeof num !== "bigint") throw new Error("invalid field element: expected bigint, got " + typeof num);
			return _0n$7 <= num && num < ORDER;
		},
		is0: (num) => num === _0n$7,
		isValidNot0: (num) => !f.is0(num) && f.isValid(num),
		isOdd: (num) => (num & _1n$7) === _1n$7,
		neg: (num) => mod(-num, ORDER),
		eql: (lhs, rhs) => lhs === rhs,
		sqr: (num) => mod(num * num, ORDER),
		add: (lhs, rhs) => mod(lhs + rhs, ORDER),
		sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
		mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
		pow: (num, power) => FpPow(f, num, power),
		div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
		sqrN: (num) => num * num,
		addN: (lhs, rhs) => lhs + rhs,
		subN: (lhs, rhs) => lhs - rhs,
		mulN: (lhs, rhs) => lhs * rhs,
		inv: (num) => invert(num, ORDER),
		sqrt: _sqrt || ((n) => {
			if (!sqrtP) sqrtP = FpSqrt(ORDER);
			return sqrtP(f, n);
		}),
		toBytes: (num) => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
		fromBytes: (bytes, skipValidation = true) => {
			if (allowedLengths) {
				if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
				const padded = new Uint8Array(BYTES);
				padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
				bytes = padded;
			}
			if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
			let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
			if (modFromBytes) scalar = mod(scalar, ORDER);
			if (!skipValidation) {
				if (!f.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
			}
			return scalar;
		},
		invertBatch: (lst) => FpInvertBatch(f, lst),
		cmov: (a, b, c) => c ? b : a
	});
	return Object.freeze(f);
}
/**
* Returns total number of bytes consumed by the field element.
* For example, 32 bytes for usual 256-bit weierstrass curve.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of field
*/
function getFieldBytesLength(fieldOrder) {
	if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
	const bitLength = fieldOrder.toString(2).length;
	return Math.ceil(bitLength / 8);
}
/**
* Returns minimal amount of bytes that can be safely reduced
* by field order.
* Should be 2^-128 for 128-bit curve such as P256.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of target hash
*/
function getMinHashLength(fieldOrder) {
	const length = getFieldBytesLength(fieldOrder);
	return length + Math.ceil(length / 2);
}
/**
* "Constant-time" private key generation utility.
* Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
* and convert them into private scalar, with the modulo bias being negligible.
* Needs at least 48 bytes of input for 32-byte private key.
* https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
* FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
* RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
* @param hash hash output from SHA3 or a similar function
* @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
* @param isLE interpret hash bytes as LE num
* @returns valid private scalar
*/
function mapHashToField(key, fieldOrder, isLE = false) {
	const len = key.length;
	const fieldLen = getFieldBytesLength(fieldOrder);
	const minLen = getMinHashLength(fieldOrder);
	if (len < 16 || len < minLen || len > 1024) throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
	const reduced = mod(isLE ? bytesToNumberLE(key) : bytesToNumberBE(key), fieldOrder - _1n$7) + _1n$7;
	return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF, pippenger.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$6 = BigInt(0);
var _1n$6 = BigInt(1);
function negateCt(condition, item) {
	const neg = item.negate();
	return condition ? neg : item;
}
/**
* Takes a bunch of Projective Points but executes only one
* inversion on all of them. Inversion is very slow operation,
* so this improves performance massively.
* Optimization: converts a list of projective points to a list of identical points with Z=1.
*/
function normalizeZ(c, points) {
	const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
	if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
	validateW(W, scalarBits);
	const windows = Math.ceil(scalarBits / W) + 1;
	const windowSize = 2 ** (W - 1);
	const maxNumber = 2 ** W;
	return {
		windows,
		windowSize,
		mask: bitMask(W),
		maxNumber,
		shiftBy: BigInt(W)
	};
}
function calcOffsets(n, window, wOpts) {
	const { windowSize, mask, maxNumber, shiftBy } = wOpts;
	let wbits = Number(n & mask);
	let nextN = n >> shiftBy;
	if (wbits > windowSize) {
		wbits -= maxNumber;
		nextN += _1n$6;
	}
	const offsetStart = window * windowSize;
	const offset = offsetStart + Math.abs(wbits) - 1;
	const isZero = wbits === 0;
	const isNeg = wbits < 0;
	const isNegF = window % 2 !== 0;
	return {
		nextN,
		offset,
		isZero,
		isNeg,
		isNegF,
		offsetF: offsetStart
	};
}
function validateMSMPoints(points, c) {
	if (!Array.isArray(points)) throw new Error("array expected");
	points.forEach((p, i) => {
		if (!(p instanceof c)) throw new Error("invalid point at index " + i);
	});
}
function validateMSMScalars(scalars, field) {
	if (!Array.isArray(scalars)) throw new Error("array of scalars expected");
	scalars.forEach((s, i) => {
		if (!field.isValid(s)) throw new Error("invalid scalar at index " + i);
	});
}
var pointPrecomputes = /* @__PURE__ */ new WeakMap();
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
	return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
	if (n !== _0n$6) throw new Error("invalid wNAF");
}
/**
* Elliptic curve multiplication of Point by scalar. Fragile.
* Table generation takes **30MB of ram and 10ms on high-end CPU**,
* but may take much longer on slow devices. Actual generation will happen on
* first call of `multiply()`. By default, `BASE` point is precomputed.
*
* Scalars should always be less than curve order: this should be checked inside of a curve itself.
* Creates precomputation tables for fast multiplication:
* - private scalar is split by fixed size windows of W bits
* - every window point is collected from window's table & added to accumulator
* - since windows are different, same point inside tables won't be accessed more than once per calc
* - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
* - +1 window is neccessary for wNAF
* - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
*
* @todo Research returning 2d JS array of windows, instead of a single window.
* This would allow windows to be in different memory locations
*/
var wNAF = class {
	constructor(Point, bits) {
		this.BASE = Point.BASE;
		this.ZERO = Point.ZERO;
		this.Fn = Point.Fn;
		this.bits = bits;
	}
	_unsafeLadder(elm, n, p = this.ZERO) {
		let d = elm;
		while (n > _0n$6) {
			if (n & _1n$6) p = p.add(d);
			d = d.double();
			n >>= _1n$6;
		}
		return p;
	}
	/**
	* Creates a wNAF precomputation window. Used for caching.
	* Default window size is set by `utils.precompute()` and is equal to 8.
	* Number of precomputed points depends on the curve size:
	* 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
	* - 𝑊 is the window size
	* - 𝑛 is the bitlength of the curve order.
	* For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
	* @param point Point instance
	* @param W window size
	* @returns precomputed point tables flattened to a single array
	*/
	precomputeWindow(point, W) {
		const { windows, windowSize } = calcWOpts(W, this.bits);
		const points = [];
		let p = point;
		let base = p;
		for (let window = 0; window < windows; window++) {
			base = p;
			points.push(base);
			for (let i = 1; i < windowSize; i++) {
				base = base.add(p);
				points.push(base);
			}
			p = base.double();
		}
		return points;
	}
	/**
	* Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
	* More compact implementation:
	* https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
	* @returns real and fake (for const-time) points
	*/
	wNAF(W, precomputes, n) {
		if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
		let p = this.ZERO;
		let f = this.BASE;
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) f = f.add(negateCt(isNegF, precomputes[offsetF]));
			else p = p.add(negateCt(isNeg, precomputes[offset]));
		}
		assert0(n);
		return {
			p,
			f
		};
	}
	/**
	* Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
	* @param acc accumulator point to add result of multiplication
	* @returns point
	*/
	wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			if (n === _0n$6) break;
			const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) continue;
			else {
				const item = precomputes[offset];
				acc = acc.add(isNeg ? item.negate() : item);
			}
		}
		assert0(n);
		return acc;
	}
	getPrecomputes(W, point, transform) {
		let comp = pointPrecomputes.get(point);
		if (!comp) {
			comp = this.precomputeWindow(point, W);
			if (W !== 1) {
				if (typeof transform === "function") comp = transform(comp);
				pointPrecomputes.set(point, comp);
			}
		}
		return comp;
	}
	cached(point, scalar, transform) {
		const W = getW(point);
		return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
	}
	unsafe(point, scalar, transform, prev) {
		const W = getW(point);
		if (W === 1) return this._unsafeLadder(point, scalar, prev);
		return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
	}
	createCache(P, W) {
		validateW(W, this.bits);
		pointWindowSizes.set(P, W);
		pointPrecomputes.delete(P);
	}
	hasCache(elm) {
		return getW(elm) !== 1;
	}
};
/**
* Endomorphism-specific multiplication for Koblitz curves.
* Cost: 128 dbl, 0-256 adds.
*/
function mulEndoUnsafe(Point, point, k1, k2) {
	let acc = point;
	let p1 = Point.ZERO;
	let p2 = Point.ZERO;
	while (k1 > _0n$6 || k2 > _0n$6) {
		if (k1 & _1n$6) p1 = p1.add(acc);
		if (k2 & _1n$6) p2 = p2.add(acc);
		acc = acc.double();
		k1 >>= _1n$6;
		k2 >>= _1n$6;
	}
	return {
		p1,
		p2
	};
}
/**
* Pippenger algorithm for multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
* 30x faster vs naive addition on L=4096, 10x faster than precomputes.
* For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
* Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
* @param c Curve Point constructor
* @param fieldN field over CURVE.N - important that it's not over CURVE.P
* @param points array of L curve points
* @param scalars array of L scalars (aka secret keys / bigints)
*/
function pippenger(c, fieldN, points, scalars) {
	validateMSMPoints(points, c);
	validateMSMScalars(scalars, fieldN);
	const plength = points.length;
	const slength = scalars.length;
	if (plength !== slength) throw new Error("arrays of points and scalars must have equal length");
	const zero = c.ZERO;
	const wbits = bitLen(BigInt(plength));
	let windowSize = 1;
	if (wbits > 12) windowSize = wbits - 3;
	else if (wbits > 4) windowSize = wbits - 2;
	else if (wbits > 0) windowSize = 2;
	const MASK = bitMask(windowSize);
	const buckets = new Array(Number(MASK) + 1).fill(zero);
	const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
	let sum = zero;
	for (let i = lastBits; i >= 0; i -= windowSize) {
		buckets.fill(zero);
		for (let j = 0; j < slength; j++) {
			const scalar = scalars[j];
			const wbits = Number(scalar >> BigInt(i) & MASK);
			buckets[wbits] = buckets[wbits].add(points[j]);
		}
		let resI = zero;
		for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
			sumI = sumI.add(buckets[j]);
			resI = resI.add(sumI);
		}
		sum = sum.add(resI);
		if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double();
	}
	return sum;
}
function createField(order, field, isLE) {
	if (field) {
		if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		validateField(field);
		return field;
	} else return Field(order, { isLE });
}
/** Validates CURVE opts and creates fields */
function _createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	if (FpFnLE === void 0) FpFnLE = type === "edwards";
	if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
	for (const p of [
		"p",
		"n",
		"h"
	]) {
		const val = CURVE[p];
		if (!(typeof val === "bigint" && val > _0n$6)) throw new Error(`CURVE.${p} must be positive bigint`);
	}
	const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	const params = [
		"Gx",
		"Gy",
		"a",
		type === "weierstrass" ? "b" : "d"
	];
	for (const p of params) if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	CURVE = Object.freeze(Object.assign({}, CURVE));
	return {
		CURVE,
		Fp,
		Fn
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/hash-to-curve.js
var os2ip = bytesToNumberBE;
function i2osp(value, length) {
	anum(value);
	anum(length);
	if (value < 0 || value >= 1 << 8 * length) throw new Error("invalid I2OSP input: " + value);
	const res = Array.from({ length }).fill(0);
	for (let i = length - 1; i >= 0; i--) {
		res[i] = value & 255;
		value >>>= 8;
	}
	return new Uint8Array(res);
}
function strxor(a, b) {
	const arr = new Uint8Array(a.length);
	for (let i = 0; i < a.length; i++) arr[i] = a[i] ^ b[i];
	return arr;
}
function anum(item) {
	if (!Number.isSafeInteger(item)) throw new Error("number expected");
}
function normDST(DST) {
	if (!isBytes(DST) && typeof DST !== "string") throw new Error("DST must be Uint8Array or string");
	return typeof DST === "string" ? utf8ToBytes(DST) : DST;
}
/**
* Produces a uniformly random byte string using a cryptographic hash function H that outputs b bits.
* [RFC 9380 5.3.1](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.1).
*/
function expand_message_xmd(msg, DST, lenInBytes, H) {
	abytes(msg);
	anum(lenInBytes);
	DST = normDST(DST);
	if (DST.length > 255) DST = H(concatBytes(utf8ToBytes("H2C-OVERSIZE-DST-"), DST));
	const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
	const ell = Math.ceil(lenInBytes / b_in_bytes);
	if (lenInBytes > 65535 || ell > 255) throw new Error("expand_message_xmd: invalid lenInBytes");
	const DST_prime = concatBytes(DST, i2osp(DST.length, 1));
	const Z_pad = i2osp(0, r_in_bytes);
	const l_i_b_str = i2osp(lenInBytes, 2);
	const b = new Array(ell);
	const b_0 = H(concatBytes(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
	b[0] = H(concatBytes(b_0, i2osp(1, 1), DST_prime));
	for (let i = 1; i <= ell; i++) {
		const args = [
			strxor(b_0, b[i - 1]),
			i2osp(i + 1, 1),
			DST_prime
		];
		b[i] = H(concatBytes(...args));
	}
	return concatBytes(...b).slice(0, lenInBytes);
}
/**
* Produces a uniformly random byte string using an extendable-output function (XOF) H.
* 1. The collision resistance of H MUST be at least k bits.
* 2. H MUST be an XOF that has been proved indifferentiable from
*    a random oracle under a reasonable cryptographic assumption.
* [RFC 9380 5.3.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.2).
*/
function expand_message_xof(msg, DST, lenInBytes, k, H) {
	abytes(msg);
	anum(lenInBytes);
	DST = normDST(DST);
	if (DST.length > 255) {
		const dkLen = Math.ceil(2 * k / 8);
		DST = H.create({ dkLen }).update(utf8ToBytes("H2C-OVERSIZE-DST-")).update(DST).digest();
	}
	if (lenInBytes > 65535 || DST.length > 255) throw new Error("expand_message_xof: invalid lenInBytes");
	return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
}
/**
* Hashes arbitrary-length byte strings to a list of one or more elements of a finite field F.
* [RFC 9380 5.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.2).
* @param msg a byte string containing the message to hash
* @param count the number of elements of F to output
* @param options `{DST: string, p: bigint, m: number, k: number, expand: 'xmd' | 'xof', hash: H}`, see above
* @returns [u_0, ..., u_(count - 1)], a list of field elements.
*/
function hash_to_field(msg, count, options) {
	_validateObject(options, {
		p: "bigint",
		m: "number",
		k: "number",
		hash: "function"
	});
	const { p, k, m, hash, expand, DST } = options;
	if (!isHash(options.hash)) throw new Error("expected valid hash");
	abytes(msg);
	anum(count);
	const log2p = p.toString(2).length;
	const L = Math.ceil((log2p + k) / 8);
	const len_in_bytes = count * m * L;
	let prb;
	if (expand === "xmd") prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
	else if (expand === "xof") prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
	else if (expand === "_internal_pass") prb = msg;
	else throw new Error("expand must be \"xmd\" or \"xof\"");
	const u = new Array(count);
	for (let i = 0; i < count; i++) {
		const e = new Array(m);
		for (let j = 0; j < m; j++) {
			const elm_offset = L * (j + i * m);
			const tv = prb.subarray(elm_offset, elm_offset + L);
			e[j] = mod(os2ip(tv), p);
		}
		u[i] = e;
	}
	return u;
}
function isogenyMap(field, map) {
	const coeff = map.map((i) => Array.from(i).reverse());
	return (x, y) => {
		const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
		const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
		x = field.mul(xn, xd_inv);
		y = field.mul(y, field.mul(yn, yd_inv));
		return {
			x,
			y
		};
	};
}
var _DST_scalar = utf8ToBytes("HashToScalar-");
/** Creates hash-to-curve methods from EC Point and mapToCurve function. See {@link H2CHasher}. */
function createHasher(Point, mapToCurve, defaults) {
	if (typeof mapToCurve !== "function") throw new Error("mapToCurve() must be defined");
	function map(num) {
		return Point.fromAffine(mapToCurve(num));
	}
	function clear(initial) {
		const P = initial.clearCofactor();
		if (P.equals(Point.ZERO)) return Point.ZERO;
		P.assertValidity();
		return P;
	}
	return {
		defaults,
		hashToCurve(msg, options) {
			const u = hash_to_field(msg, 2, Object.assign({}, defaults, options));
			const u0 = map(u[0]);
			const u1 = map(u[1]);
			return clear(u0.add(u1));
		},
		encodeToCurve(msg, options) {
			const optsDst = defaults.encodeDST ? { DST: defaults.encodeDST } : {};
			return clear(map(hash_to_field(msg, 1, Object.assign({}, defaults, optsDst, options))[0]));
		},
		/** See {@link H2CHasher} */
		mapToCurve(scalars) {
			if (!Array.isArray(scalars)) throw new Error("expected array of bigints");
			for (const i of scalars) if (typeof i !== "bigint") throw new Error("expected array of bigints");
			return clear(map(scalars));
		},
		hashToScalar(msg, options) {
			const N = Point.Fn.ORDER;
			return hash_to_field(msg, 1, Object.assign({}, defaults, {
				p: N,
				m: 1,
				DST: _DST_scalar
			}, options))[0][0];
		}
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/weierstrass.js
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n$5) / den;
/**
* Splits scalar for GLV endomorphism.
*/
function _splitEndoScalar(k, basis, n) {
	const [[a1, b1], [a2, b2]] = basis;
	const c1 = divNearest(b2 * k, n);
	const c2 = divNearest(-b1 * k, n);
	let k1 = k - c1 * a1 - c2 * a2;
	let k2 = -c1 * b1 - c2 * b2;
	const k1neg = k1 < _0n$5;
	const k2neg = k2 < _0n$5;
	if (k1neg) k1 = -k1;
	if (k2neg) k2 = -k2;
	const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n$5;
	if (k1 < _0n$5 || k1 >= MAX_NUM || k2 < _0n$5 || k2 >= MAX_NUM) throw new Error("splitScalar (endomorphism): failed, k=" + k);
	return {
		k1neg,
		k1,
		k2neg,
		k2
	};
}
var _0n$5 = BigInt(0);
var _1n$5 = BigInt(1);
var _2n$5 = BigInt(2);
var _3n$3 = BigInt(3);
var _4n$1 = BigInt(4);
function _normFnElement(Fn, key) {
	const { BYTES: expected } = Fn;
	let num;
	if (typeof key === "bigint") num = key;
	else {
		let bytes = ensureBytes("private key", key);
		try {
			num = Fn.fromBytes(bytes);
		} catch (error) {
			throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
		}
	}
	if (!Fn.isValidNot0(num)) throw new Error("invalid private key: out of range [1..N-1]");
	return num;
}
/**
* Creates weierstrass Point constructor, based on specified curve options.
*
* @example
```js
const opts = {
p: BigInt('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'),
n: BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
h: BigInt(1),
a: BigInt('0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc'),
b: BigInt('0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b'),
Gx: BigInt('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
Gy: BigInt('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
};
const p256_Point = weierstrass(opts);
```
*/
function weierstrassN(params, extraOpts = {}) {
	const validated = _createCurveFields("weierstrass", params, extraOpts);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor, n: CURVE_ORDER } = CURVE;
	_validateObject(extraOpts, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object",
		wrapPrivateKey: "boolean"
	});
	const { endo } = extraOpts;
	if (endo) {
		if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises)) throw new Error("invalid endo: expected \"beta\": bigint and \"basises\": array");
	}
	const lengths = getWLengths(Fp, Fn);
	function assertCompressionIsSupported() {
		if (!Fp.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
	}
	function pointToBytes(_c, point, isCompressed) {
		const { x, y } = point.toAffine();
		const bx = Fp.toBytes(x);
		_abool2(isCompressed, "isCompressed");
		if (isCompressed) {
			assertCompressionIsSupported();
			return concatBytes(pprefix(!Fp.isOdd(y)), bx);
		} else return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
	}
	function pointFromBytes(bytes) {
		_abytes2(bytes, void 0, "Point");
		const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
		const length = bytes.length;
		const head = bytes[0];
		const tail = bytes.subarray(1);
		if (length === comp && (head === 2 || head === 3)) {
			const x = Fp.fromBytes(tail);
			if (!Fp.isValid(x)) throw new Error("bad point: is not on curve, wrong x");
			const y2 = weierstrassEquation(x);
			let y;
			try {
				y = Fp.sqrt(y2);
			} catch (sqrtError) {
				const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
				throw new Error("bad point: is not on curve, sqrt error" + err);
			}
			assertCompressionIsSupported();
			const isYOdd = Fp.isOdd(y);
			if ((head & 1) === 1 !== isYOdd) y = Fp.neg(y);
			return {
				x,
				y
			};
		} else if (length === uncomp && head === 4) {
			const L = Fp.BYTES;
			const x = Fp.fromBytes(tail.subarray(0, L));
			const y = Fp.fromBytes(tail.subarray(L, L * 2));
			if (!isValidXY(x, y)) throw new Error("bad point: is not on curve");
			return {
				x,
				y
			};
		} else throw new Error(`bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`);
	}
	const encodePoint = extraOpts.toBytes || pointToBytes;
	const decodePoint = extraOpts.fromBytes || pointFromBytes;
	function weierstrassEquation(x) {
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
	}
	/** Checks whether equation holds for given x, y: y² == x³ + ax + b */
	function isValidXY(x, y) {
		const left = Fp.sqr(y);
		const right = weierstrassEquation(x);
		return Fp.eql(left, right);
	}
	if (!isValidXY(CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n$3), _4n$1);
	const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
	if (Fp.is0(Fp.add(_4a3, _27b2))) throw new Error("bad curve params: a or b");
	/** Asserts coordinate is valid: 0 <= n < Fp.ORDER. */
	function acoord(title, n, banZero = false) {
		if (!Fp.isValid(n) || banZero && Fp.is0(n)) throw new Error(`bad point coordinate ${title}`);
		return n;
	}
	function aprjpoint(other) {
		if (!(other instanceof Point)) throw new Error("ProjectivePoint expected");
	}
	function splitEndoScalarN(k) {
		if (!endo || !endo.basises) throw new Error("no endo");
		return _splitEndoScalar(k, endo.basises, Fn.ORDER);
	}
	const toAffineMemo = memoized((p, iz) => {
		const { X, Y, Z } = p;
		if (Fp.eql(Z, Fp.ONE)) return {
			x: X,
			y: Y
		};
		const is0 = p.is0();
		if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(Z);
		const x = Fp.mul(X, iz);
		const y = Fp.mul(Y, iz);
		const zz = Fp.mul(Z, iz);
		if (is0) return {
			x: Fp.ZERO,
			y: Fp.ZERO
		};
		if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
		return {
			x,
			y
		};
	});
	const assertValidMemo = memoized((p) => {
		if (p.is0()) {
			if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y)) return;
			throw new Error("bad point: ZERO");
		}
		const { x, y } = p.toAffine();
		if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not field elements");
		if (!isValidXY(x, y)) throw new Error("bad point: equation left != right");
		if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return true;
	});
	function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
		k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
		k1p = negateCt(k1neg, k1p);
		k2p = negateCt(k2neg, k2p);
		return k1p.add(k2p);
	}
	/**
	* Projective Point works in 3d / projective (homogeneous) coordinates:(X, Y, Z) ∋ (x=X/Z, y=Y/Z).
	* Default Point works in 2d / affine coordinates: (x, y).
	* We're doing calculations in projective, because its operations don't require costly inversion.
	*/
	class Point {
		/** Does NOT validate if the point is valid. Use `.assertValidity()`. */
		constructor(X, Y, Z) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y, true);
			this.Z = acoord("z", Z);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		/** Does NOT validate if the point is valid. Use `.assertValidity()`. */
		static fromAffine(p) {
			const { x, y } = p || {};
			if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
			if (p instanceof Point) throw new Error("projective point not allowed");
			if (Fp.is0(x) && Fp.is0(y)) return Point.ZERO;
			return new Point(x, y, Fp.ONE);
		}
		static fromBytes(bytes) {
			const P = Point.fromAffine(decodePoint(_abytes2(bytes, void 0, "point")));
			P.assertValidity();
			return P;
		}
		static fromHex(hex) {
			return Point.fromBytes(ensureBytes("pointHex", hex));
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		/**
		*
		* @param windowSize
		* @param isLazy true will defer table computation until the first multiplication
		* @returns
		*/
		precompute(windowSize = 8, isLazy = true) {
			wnaf.createCache(this, windowSize);
			if (!isLazy) this.multiply(_3n$3);
			return this;
		}
		/** A point on curve is valid if it conforms to equation. */
		assertValidity() {
			assertValidMemo(this);
		}
		hasEvenY() {
			const { y } = this.toAffine();
			if (!Fp.isOdd) throw new Error("Field doesn't support isOdd");
			return !Fp.isOdd(y);
		}
		/** Compare one point to another. */
		equals(other) {
			aprjpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
			const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
			return U1 && U2;
		}
		/** Flips point to one corresponding to (x, -y) in Affine coordinates. */
		negate() {
			return new Point(this.X, Fp.neg(this.Y), this.Z);
		}
		double() {
			const { a, b } = CURVE;
			const b3 = Fp.mul(b, _3n$3);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			let t0 = Fp.mul(X1, X1);
			let t1 = Fp.mul(Y1, Y1);
			let t2 = Fp.mul(Z1, Z1);
			let t3 = Fp.mul(X1, Y1);
			t3 = Fp.add(t3, t3);
			Z3 = Fp.mul(X1, Z1);
			Z3 = Fp.add(Z3, Z3);
			X3 = Fp.mul(a, Z3);
			Y3 = Fp.mul(b3, t2);
			Y3 = Fp.add(X3, Y3);
			X3 = Fp.sub(t1, Y3);
			Y3 = Fp.add(t1, Y3);
			Y3 = Fp.mul(X3, Y3);
			X3 = Fp.mul(t3, X3);
			Z3 = Fp.mul(b3, Z3);
			t2 = Fp.mul(a, t2);
			t3 = Fp.sub(t0, t2);
			t3 = Fp.mul(a, t3);
			t3 = Fp.add(t3, Z3);
			Z3 = Fp.add(t0, t0);
			t0 = Fp.add(Z3, t0);
			t0 = Fp.add(t0, t2);
			t0 = Fp.mul(t0, t3);
			Y3 = Fp.add(Y3, t0);
			t2 = Fp.mul(Y1, Z1);
			t2 = Fp.add(t2, t2);
			t0 = Fp.mul(t2, t3);
			X3 = Fp.sub(X3, t0);
			Z3 = Fp.mul(t2, t1);
			Z3 = Fp.add(Z3, Z3);
			Z3 = Fp.add(Z3, Z3);
			return new Point(X3, Y3, Z3);
		}
		add(other) {
			aprjpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
			const a = CURVE.a;
			const b3 = Fp.mul(CURVE.b, _3n$3);
			let t0 = Fp.mul(X1, X2);
			let t1 = Fp.mul(Y1, Y2);
			let t2 = Fp.mul(Z1, Z2);
			let t3 = Fp.add(X1, Y1);
			let t4 = Fp.add(X2, Y2);
			t3 = Fp.mul(t3, t4);
			t4 = Fp.add(t0, t1);
			t3 = Fp.sub(t3, t4);
			t4 = Fp.add(X1, Z1);
			let t5 = Fp.add(X2, Z2);
			t4 = Fp.mul(t4, t5);
			t5 = Fp.add(t0, t2);
			t4 = Fp.sub(t4, t5);
			t5 = Fp.add(Y1, Z1);
			X3 = Fp.add(Y2, Z2);
			t5 = Fp.mul(t5, X3);
			X3 = Fp.add(t1, t2);
			t5 = Fp.sub(t5, X3);
			Z3 = Fp.mul(a, t4);
			X3 = Fp.mul(b3, t2);
			Z3 = Fp.add(X3, Z3);
			X3 = Fp.sub(t1, Z3);
			Z3 = Fp.add(t1, Z3);
			Y3 = Fp.mul(X3, Z3);
			t1 = Fp.add(t0, t0);
			t1 = Fp.add(t1, t0);
			t2 = Fp.mul(a, t2);
			t4 = Fp.mul(b3, t4);
			t1 = Fp.add(t1, t2);
			t2 = Fp.sub(t0, t2);
			t2 = Fp.mul(a, t2);
			t4 = Fp.add(t4, t2);
			t0 = Fp.mul(t1, t4);
			Y3 = Fp.add(Y3, t0);
			t0 = Fp.mul(t5, t4);
			X3 = Fp.mul(t3, X3);
			X3 = Fp.sub(X3, t0);
			t0 = Fp.mul(t3, t1);
			Z3 = Fp.mul(t5, Z3);
			Z3 = Fp.add(Z3, t0);
			return new Point(X3, Y3, Z3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		/**
		* Constant time multiplication.
		* Uses wNAF method. Windowed method may be 10% faster,
		* but takes 2x longer to generate and consumes 2x memory.
		* Uses precomputes when available.
		* Uses endomorphism for Koblitz curves.
		* @param scalar by which the point would be multiplied
		* @returns New point
		*/
		multiply(scalar) {
			const { endo } = extraOpts;
			if (!Fn.isValidNot0(scalar)) throw new Error("invalid scalar: out of range");
			let point, fake;
			const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
			/** See docs for {@link EndomorphismOpts} */
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
				const { p: k1p, f: k1f } = mul(k1);
				const { p: k2p, f: k2f } = mul(k2);
				fake = k1f.add(k2f);
				point = finishEndo(endo.beta, k1p, k2p, k1neg, k2neg);
			} else {
				const { p, f } = mul(scalar);
				point = p;
				fake = f;
			}
			return normalizeZ(Point, [point, fake])[0];
		}
		/**
		* Non-constant-time multiplication. Uses double-and-add algorithm.
		* It's faster, but should only be used when you don't care about
		* an exposed secret key e.g. sig verification, which works over *public* keys.
		*/
		multiplyUnsafe(sc) {
			const { endo } = extraOpts;
			const p = this;
			if (!Fn.isValid(sc)) throw new Error("invalid scalar: out of range");
			if (sc === _0n$5 || p.is0()) return Point.ZERO;
			if (sc === _1n$5) return p;
			if (wnaf.hasCache(this)) return this.multiply(sc);
			if (endo) {
				const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
				const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
				return finishEndo(endo.beta, p1, p2, k1neg, k2neg);
			} else return wnaf.unsafe(p, sc);
		}
		multiplyAndAddUnsafe(Q, a, b) {
			const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
			return sum.is0() ? void 0 : sum;
		}
		/**
		* Converts Projective point to affine (x, y) coordinates.
		* @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
		*/
		toAffine(invertedZ) {
			return toAffineMemo(this, invertedZ);
		}
		/**
		* Checks whether Point is free of torsion elements (is in prime subgroup).
		* Always torsion-free for cofactor=1 curves.
		*/
		isTorsionFree() {
			const { isTorsionFree } = extraOpts;
			if (cofactor === _1n$5) return true;
			if (isTorsionFree) return isTorsionFree(Point, this);
			return wnaf.unsafe(this, CURVE_ORDER).is0();
		}
		clearCofactor() {
			const { clearCofactor } = extraOpts;
			if (cofactor === _1n$5) return this;
			if (clearCofactor) return clearCofactor(Point, this);
			return this.multiplyUnsafe(cofactor);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(cofactor).is0();
		}
		toBytes(isCompressed = true) {
			_abool2(isCompressed, "isCompressed");
			this.assertValidity();
			return encodePoint(Point, this, isCompressed);
		}
		toHex(isCompressed = true) {
			return bytesToHex(this.toBytes(isCompressed));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
		get px() {
			return this.X;
		}
		get py() {
			return this.X;
		}
		get pz() {
			return this.Z;
		}
		toRawBytes(isCompressed = true) {
			return this.toBytes(isCompressed);
		}
		_setWindowSize(windowSize) {
			this.precompute(windowSize);
		}
		static normalizeZ(points) {
			return normalizeZ(Point, points);
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		static fromPrivateKey(privateKey) {
			return Point.BASE.multiply(_normFnElement(Fn, privateKey));
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
	Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
	Point.Fp = Fp;
	Point.Fn = Fn;
	const bits = Fn.BITS;
	const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
	Point.BASE.precompute(8);
	return Point;
}
function pprefix(hasEvenY) {
	return Uint8Array.of(hasEvenY ? 2 : 3);
}
/**
* Implementation of the Shallue and van de Woestijne method for any weierstrass curve.
* TODO: check if there is a way to merge this with uvRatio in Edwards; move to modular.
* b = True and y = sqrt(u / v) if (u / v) is square in F, and
* b = False and y = sqrt(Z * (u / v)) otherwise.
* @param Fp
* @param Z
* @returns
*/
function SWUFpSqrtRatio(Fp, Z) {
	const q = Fp.ORDER;
	let l = _0n$5;
	for (let o = q - _1n$5; o % _2n$5 === _0n$5; o /= _2n$5) l += _1n$5;
	const c1 = l;
	const _2n_pow_c1_1 = _2n$5 << c1 - _1n$5 - _1n$5;
	const _2n_pow_c1 = _2n_pow_c1_1 * _2n$5;
	const c2 = (q - _1n$5) / _2n_pow_c1;
	const c3 = (c2 - _1n$5) / _2n$5;
	const c4 = _2n_pow_c1 - _1n$5;
	const c5 = _2n_pow_c1_1;
	const c6 = Fp.pow(Z, c2);
	const c7 = Fp.pow(Z, (c2 + _1n$5) / _2n$5);
	let sqrtRatio = (u, v) => {
		let tv1 = c6;
		let tv2 = Fp.pow(v, c4);
		let tv3 = Fp.sqr(tv2);
		tv3 = Fp.mul(tv3, v);
		let tv5 = Fp.mul(u, tv3);
		tv5 = Fp.pow(tv5, c3);
		tv5 = Fp.mul(tv5, tv2);
		tv2 = Fp.mul(tv5, v);
		tv3 = Fp.mul(tv5, u);
		let tv4 = Fp.mul(tv3, tv2);
		tv5 = Fp.pow(tv4, c5);
		let isQR = Fp.eql(tv5, Fp.ONE);
		tv2 = Fp.mul(tv3, c7);
		tv5 = Fp.mul(tv4, tv1);
		tv3 = Fp.cmov(tv2, tv3, isQR);
		tv4 = Fp.cmov(tv5, tv4, isQR);
		for (let i = c1; i > _1n$5; i--) {
			let tv5 = i - _2n$5;
			tv5 = _2n$5 << tv5 - _1n$5;
			let tvv5 = Fp.pow(tv4, tv5);
			const e1 = Fp.eql(tvv5, Fp.ONE);
			tv2 = Fp.mul(tv3, tv1);
			tv1 = Fp.mul(tv1, tv1);
			tvv5 = Fp.mul(tv4, tv1);
			tv3 = Fp.cmov(tv2, tv3, e1);
			tv4 = Fp.cmov(tvv5, tv4, e1);
		}
		return {
			isValid: isQR,
			value: tv3
		};
	};
	if (Fp.ORDER % _4n$1 === _3n$3) {
		const c1 = (Fp.ORDER - _3n$3) / _4n$1;
		const c2 = Fp.sqrt(Fp.neg(Z));
		sqrtRatio = (u, v) => {
			let tv1 = Fp.sqr(v);
			const tv2 = Fp.mul(u, v);
			tv1 = Fp.mul(tv1, tv2);
			let y1 = Fp.pow(tv1, c1);
			y1 = Fp.mul(y1, tv2);
			const y2 = Fp.mul(y1, c2);
			const tv3 = Fp.mul(Fp.sqr(y1), v);
			const isQR = Fp.eql(tv3, u);
			return {
				isValid: isQR,
				value: Fp.cmov(y2, y1, isQR)
			};
		};
	}
	return sqrtRatio;
}
/**
* Simplified Shallue-van de Woestijne-Ulas Method
* https://www.rfc-editor.org/rfc/rfc9380#section-6.6.2
*/
function mapToCurveSimpleSWU(Fp, opts) {
	validateField(Fp);
	const { A, B, Z } = opts;
	if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z)) throw new Error("mapToCurveSimpleSWU: invalid opts");
	const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
	if (!Fp.isOdd) throw new Error("Field does not have .isOdd()");
	return (u) => {
		let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
		tv1 = Fp.sqr(u);
		tv1 = Fp.mul(tv1, Z);
		tv2 = Fp.sqr(tv1);
		tv2 = Fp.add(tv2, tv1);
		tv3 = Fp.add(tv2, Fp.ONE);
		tv3 = Fp.mul(tv3, B);
		tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
		tv4 = Fp.mul(tv4, A);
		tv2 = Fp.sqr(tv3);
		tv6 = Fp.sqr(tv4);
		tv5 = Fp.mul(tv6, A);
		tv2 = Fp.add(tv2, tv5);
		tv2 = Fp.mul(tv2, tv3);
		tv6 = Fp.mul(tv6, tv4);
		tv5 = Fp.mul(tv6, B);
		tv2 = Fp.add(tv2, tv5);
		x = Fp.mul(tv1, tv3);
		const { isValid, value } = sqrtRatio(tv2, tv6);
		y = Fp.mul(tv1, u);
		y = Fp.mul(y, value);
		x = Fp.cmov(x, tv3, isValid);
		y = Fp.cmov(y, value, isValid);
		const e1 = Fp.isOdd(u) === Fp.isOdd(y);
		y = Fp.cmov(Fp.neg(y), y, e1);
		const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
		x = Fp.mul(x, tv4_inv);
		return {
			x,
			y
		};
	};
}
function getWLengths(Fp, Fn) {
	return {
		secretKey: Fn.BYTES,
		publicKey: 1 + Fp.BYTES,
		publicKeyUncompressed: 1 + 2 * Fp.BYTES,
		publicKeyHasPrefix: true,
		signature: 2 * Fn.BYTES
	};
}
/** @deprecated use `weierstrass` in newer releases */
function weierstrassPoints(c) {
	const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
	return _weierstrass_new_output_to_legacy(c, weierstrassN(CURVE, curveOpts));
}
function _weierstrass_legacy_opts_to_new(c) {
	const CURVE = {
		a: c.a,
		b: c.b,
		p: c.Fp.ORDER,
		n: c.n,
		h: c.h,
		Gx: c.Gx,
		Gy: c.Gy
	};
	const Fp = c.Fp;
	let allowedLengths = c.allowedPrivateKeyLengths ? Array.from(new Set(c.allowedPrivateKeyLengths.map((l) => Math.ceil(l / 2)))) : void 0;
	return {
		CURVE,
		curveOpts: {
			Fp,
			Fn: Field(CURVE.n, {
				BITS: c.nBitLength,
				allowedLengths,
				modFromBytes: c.wrapPrivateKey
			}),
			allowInfinityPoint: c.allowInfinityPoint,
			endo: c.endo,
			isTorsionFree: c.isTorsionFree,
			clearCofactor: c.clearCofactor,
			fromBytes: c.fromBytes,
			toBytes: c.toBytes
		}
	};
}
function _legacyHelperEquat(Fp, a, b) {
	/**
	* y² = x³ + ax + b: Short weierstrass curve formula. Takes x, returns y².
	* @returns y²
	*/
	function weierstrassEquation(x) {
		const x2 = Fp.sqr(x);
		const x3 = Fp.mul(x2, x);
		return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
	}
	return weierstrassEquation;
}
function _weierstrass_new_output_to_legacy(c, Point) {
	const { Fp, Fn } = Point;
	function isWithinCurveOrder(num) {
		return inRange(num, _1n$5, Fn.ORDER);
	}
	const weierstrassEquation = _legacyHelperEquat(Fp, c.a, c.b);
	return Object.assign({}, {
		CURVE: c,
		Point,
		ProjectivePoint: Point,
		normPrivateKeyToScalar: (key) => _normFnElement(Fn, key),
		weierstrassEquation,
		isWithinCurveOrder
	});
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/bls.js
/**
* BLS != BLS.
* The file implements BLS (Boneh-Lynn-Shacham) signatures.
* Used in both BLS (Barreto-Lynn-Scott) and BN (Barreto-Naehrig)
* families of pairing-friendly curves.
* Consists of two curves: G1 and G2:
* - G1 is a subgroup of (x, y) E(Fq) over y² = x³ + 4.
* - G2 is a subgroup of ((x₁, x₂+i), (y₁, y₂+i)) E(Fq²) over y² = x³ + 4(1 + i) where i is √-1
* - Gt, created by bilinear (ate) pairing e(G1, G2), consists of p-th roots of unity in
*   Fq^k where k is embedding degree. Only degree 12 is currently supported, 24 is not.
* Pairing is used to aggregate and verify signatures.
* There are two modes of operation:
* - Long signatures:  X-byte keys + 2X-byte sigs (G1 keys + G2 sigs).
* - Short signatures: 2X-byte keys + X-byte sigs (G2 keys + G1 sigs).
* @module
**/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$4 = BigInt(0);
var _1n$4 = BigInt(1);
var _2n$4 = BigInt(2);
var _3n$2 = BigInt(3);
function NAfDecomposition(a) {
	const res = [];
	for (; a > _1n$4; a >>= _1n$4) if ((a & _1n$4) === _0n$4) res.unshift(0);
	else if ((a & _3n$2) === _3n$2) {
		res.unshift(-1);
		a += _1n$4;
	} else res.unshift(1);
	return res;
}
function aNonEmpty(arr) {
	if (!Array.isArray(arr) || arr.length === 0) throw new Error("expected non-empty array");
}
function createBlsPairing(fields, G1, G2, params) {
	const { Fp2, Fp12 } = fields;
	const { twistType, ateLoopSize, xNegative, postPrecompute } = params;
	let lineFunction;
	if (twistType === "multiplicative") lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul014(f, c0, Fp2.mul(c1, Px), Fp2.mul(c2, Py));
	else if (twistType === "divisive") lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul034(f, Fp2.mul(c2, Py), Fp2.mul(c1, Px), c0);
	else throw new Error("bls: unknown twist type");
	const Fp2div2 = Fp2.div(Fp2.ONE, Fp2.mul(Fp2.ONE, _2n$4));
	function pointDouble(ell, Rx, Ry, Rz) {
		const t0 = Fp2.sqr(Ry);
		const t1 = Fp2.sqr(Rz);
		const t2 = Fp2.mulByB(Fp2.mul(t1, _3n$2));
		const t3 = Fp2.mul(t2, _3n$2);
		const t4 = Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(Ry, Rz)), t1), t0);
		const c0 = Fp2.sub(t2, t0);
		const c1 = Fp2.mul(Fp2.sqr(Rx), _3n$2);
		const c2 = Fp2.neg(t4);
		ell.push([
			c0,
			c1,
			c2
		]);
		Rx = Fp2.mul(Fp2.mul(Fp2.mul(Fp2.sub(t0, t3), Rx), Ry), Fp2div2);
		Ry = Fp2.sub(Fp2.sqr(Fp2.mul(Fp2.add(t0, t3), Fp2div2)), Fp2.mul(Fp2.sqr(t2), _3n$2));
		Rz = Fp2.mul(t0, t4);
		return {
			Rx,
			Ry,
			Rz
		};
	}
	function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
		const t0 = Fp2.sub(Ry, Fp2.mul(Qy, Rz));
		const t1 = Fp2.sub(Rx, Fp2.mul(Qx, Rz));
		const c0 = Fp2.sub(Fp2.mul(t0, Qx), Fp2.mul(t1, Qy));
		const c1 = Fp2.neg(t0);
		const c2 = t1;
		ell.push([
			c0,
			c1,
			c2
		]);
		const t2 = Fp2.sqr(t1);
		const t3 = Fp2.mul(t2, t1);
		const t4 = Fp2.mul(t2, Rx);
		const t5 = Fp2.add(Fp2.sub(t3, Fp2.mul(t4, _2n$4)), Fp2.mul(Fp2.sqr(t0), Rz));
		Rx = Fp2.mul(t1, t5);
		Ry = Fp2.sub(Fp2.mul(Fp2.sub(t4, t5), t0), Fp2.mul(t3, Ry));
		Rz = Fp2.mul(Rz, t3);
		return {
			Rx,
			Ry,
			Rz
		};
	}
	const ATE_NAF = NAfDecomposition(ateLoopSize);
	const calcPairingPrecomputes = memoized((point) => {
		const { x, y } = point.toAffine();
		const Qx = x, Qy = y, negQy = Fp2.neg(y);
		let Rx = Qx, Ry = Qy, Rz = Fp2.ONE;
		const ell = [];
		for (const bit of ATE_NAF) {
			const cur = [];
			({Rx, Ry, Rz} = pointDouble(cur, Rx, Ry, Rz));
			if (bit) ({Rx, Ry, Rz} = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
			ell.push(cur);
		}
		if (postPrecompute) {
			const last = ell[ell.length - 1];
			postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
		}
		return ell;
	});
	function millerLoopBatch(pairs, withFinalExponent = false) {
		let f12 = Fp12.ONE;
		if (pairs.length) {
			const ellLen = pairs[0][0].length;
			for (let i = 0; i < ellLen; i++) {
				f12 = Fp12.sqr(f12);
				for (const [ell, Px, Py] of pairs) for (const [c0, c1, c2] of ell[i]) f12 = lineFunction(c0, c1, c2, f12, Px, Py);
			}
		}
		if (xNegative) f12 = Fp12.conjugate(f12);
		return withFinalExponent ? Fp12.finalExponentiate(f12) : f12;
	}
	function pairingBatch(pairs, withFinalExponent = true) {
		const res = [];
		normalizeZ(G1, pairs.map(({ g1 }) => g1));
		normalizeZ(G2, pairs.map(({ g2 }) => g2));
		for (const { g1, g2 } of pairs) {
			if (g1.is0() || g2.is0()) throw new Error("pairing is not available for ZERO point");
			g1.assertValidity();
			g2.assertValidity();
			const Qa = g1.toAffine();
			res.push([
				calcPairingPrecomputes(g2),
				Qa.x,
				Qa.y
			]);
		}
		return millerLoopBatch(res, withFinalExponent);
	}
	function pairing(Q, P, withFinalExponent = true) {
		return pairingBatch([{
			g1: Q,
			g2: P
		}], withFinalExponent);
	}
	return {
		Fp12,
		millerLoopBatch,
		pairing,
		pairingBatch,
		calcPairingPrecomputes
	};
}
function createBlsSig(blsPairing, PubCurve, SigCurve, SignatureCoder, isSigG1) {
	const { Fp12, pairingBatch } = blsPairing;
	function normPub(point) {
		return point instanceof PubCurve.Point ? point : PubCurve.Point.fromHex(point);
	}
	function normSig(point) {
		return point instanceof SigCurve.Point ? point : SigCurve.Point.fromHex(point);
	}
	function amsg(m) {
		if (!(m instanceof SigCurve.Point)) throw new Error(`expected valid message hashed to ${!isSigG1 ? "G2" : "G1"} curve`);
		return m;
	}
	const pair = !isSigG1 ? (a, b) => ({
		g1: a,
		g2: b
	}) : (a, b) => ({
		g1: b,
		g2: a
	});
	return {
		getPublicKey(secretKey) {
			const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
			return PubCurve.Point.BASE.multiply(sec);
		},
		sign(message, secretKey, unusedArg) {
			if (unusedArg != null) throw new Error("sign() expects 2 arguments");
			const sec = _normFnElement(PubCurve.Point.Fn, secretKey);
			amsg(message).assertValidity();
			return message.multiply(sec);
		},
		verify(signature, message, publicKey, unusedArg) {
			if (unusedArg != null) throw new Error("verify() expects 3 arguments");
			signature = normSig(signature);
			publicKey = normPub(publicKey);
			const P = publicKey.negate();
			const G = PubCurve.Point.BASE;
			const Hm = amsg(message);
			const S = signature;
			const exp = pairingBatch([pair(P, Hm), pair(G, S)]);
			return Fp12.eql(exp, Fp12.ONE);
		},
		verifyBatch(signature, messages, publicKeys) {
			aNonEmpty(messages);
			if (publicKeys.length !== messages.length) throw new Error("amount of public keys and messages should be equal");
			const sig = normSig(signature);
			const nMessages = messages;
			const nPublicKeys = publicKeys.map(normPub);
			const messagePubKeyMap = /* @__PURE__ */ new Map();
			for (let i = 0; i < nPublicKeys.length; i++) {
				const pub = nPublicKeys[i];
				const msg = nMessages[i];
				let keys = messagePubKeyMap.get(msg);
				if (keys === void 0) {
					keys = [];
					messagePubKeyMap.set(msg, keys);
				}
				keys.push(pub);
			}
			const paired = [];
			const G = PubCurve.Point.BASE;
			try {
				for (const [msg, keys] of messagePubKeyMap) {
					const groupPublicKey = keys.reduce((acc, msg) => acc.add(msg));
					paired.push(pair(groupPublicKey, msg));
				}
				paired.push(pair(G.negate(), sig));
				return Fp12.eql(pairingBatch(paired), Fp12.ONE);
			} catch {
				return false;
			}
		},
		aggregatePublicKeys(publicKeys) {
			aNonEmpty(publicKeys);
			publicKeys = publicKeys.map((pub) => normPub(pub));
			const agg = publicKeys.reduce((sum, p) => sum.add(p), PubCurve.Point.ZERO);
			agg.assertValidity();
			return agg;
		},
		aggregateSignatures(signatures) {
			aNonEmpty(signatures);
			signatures = signatures.map((sig) => normSig(sig));
			const agg = signatures.reduce((sum, s) => sum.add(s), SigCurve.Point.ZERO);
			agg.assertValidity();
			return agg;
		},
		hash(messageBytes, DST) {
			abytes(messageBytes);
			const opts = DST ? { DST } : void 0;
			return SigCurve.hashToCurve(messageBytes, opts);
		},
		Signature: SignatureCoder
	};
}
function bls(CURVE) {
	const { Fp, Fr, Fp2, Fp6, Fp12 } = CURVE.fields;
	const G1_ = weierstrassPoints(CURVE.G1);
	const G1 = Object.assign(G1_, createHasher(G1_.Point, CURVE.G1.mapToCurve, {
		...CURVE.htfDefaults,
		...CURVE.G1.htfDefaults
	}));
	const G2_ = weierstrassPoints(CURVE.G2);
	const G2 = Object.assign(G2_, createHasher(G2_.Point, CURVE.G2.mapToCurve, {
		...CURVE.htfDefaults,
		...CURVE.G2.htfDefaults
	}));
	const pairingRes = createBlsPairing(CURVE.fields, G1.Point, G2.Point, {
		...CURVE.params,
		postPrecompute: CURVE.postPrecompute
	});
	const { millerLoopBatch, pairing, pairingBatch, calcPairingPrecomputes } = pairingRes;
	const longSignatures = createBlsSig(pairingRes, G1, G2, CURVE.G2.Signature, false);
	const shortSignatures = createBlsSig(pairingRes, G2, G1, CURVE.G1.ShortSignature, true);
	const rand = CURVE.randomBytes || randomBytes;
	const randomSecretKey = () => {
		const length = getMinHashLength(Fr.ORDER);
		return mapHashToField(rand(length), Fr.ORDER);
	};
	const utils = {
		randomSecretKey,
		randomPrivateKey: randomSecretKey,
		calcPairingPrecomputes
	};
	const { ShortSignature } = CURVE.G1;
	const { Signature } = CURVE.G2;
	function normP1Hash(point, htfOpts) {
		return point instanceof G1.Point ? point : shortSignatures.hash(ensureBytes("point", point), htfOpts?.DST);
	}
	function normP2Hash(point, htfOpts) {
		return point instanceof G2.Point ? point : longSignatures.hash(ensureBytes("point", point), htfOpts?.DST);
	}
	function getPublicKey(privateKey) {
		return longSignatures.getPublicKey(privateKey).toBytes(true);
	}
	function getPublicKeyForShortSignatures(privateKey) {
		return shortSignatures.getPublicKey(privateKey).toBytes(true);
	}
	function sign(message, privateKey, htfOpts) {
		const Hm = normP2Hash(message, htfOpts);
		const S = longSignatures.sign(Hm, privateKey);
		return message instanceof G2.Point ? S : Signature.toBytes(S);
	}
	function signShortSignature(message, privateKey, htfOpts) {
		const Hm = normP1Hash(message, htfOpts);
		const S = shortSignatures.sign(Hm, privateKey);
		return message instanceof G1.Point ? S : ShortSignature.toBytes(S);
	}
	function verify(signature, message, publicKey, htfOpts) {
		const Hm = normP2Hash(message, htfOpts);
		return longSignatures.verify(signature, Hm, publicKey);
	}
	function verifyShortSignature(signature, message, publicKey, htfOpts) {
		const Hm = normP1Hash(message, htfOpts);
		return shortSignatures.verify(signature, Hm, publicKey);
	}
	function aggregatePublicKeys(publicKeys) {
		const agg = longSignatures.aggregatePublicKeys(publicKeys);
		return publicKeys[0] instanceof G1.Point ? agg : agg.toBytes(true);
	}
	function aggregateSignatures(signatures) {
		const agg = longSignatures.aggregateSignatures(signatures);
		return signatures[0] instanceof G2.Point ? agg : Signature.toBytes(agg);
	}
	function aggregateShortSignatures(signatures) {
		const agg = shortSignatures.aggregateSignatures(signatures);
		return signatures[0] instanceof G1.Point ? agg : ShortSignature.toBytes(agg);
	}
	function verifyBatch(signature, messages, publicKeys, htfOpts) {
		const Hm = messages.map((m) => normP2Hash(m, htfOpts));
		return longSignatures.verifyBatch(signature, Hm, publicKeys);
	}
	G1.Point.BASE.precompute(4);
	return {
		longSignatures,
		shortSignatures,
		millerLoopBatch,
		pairing,
		pairingBatch,
		verifyBatch,
		fields: {
			Fr,
			Fp,
			Fp2,
			Fp6,
			Fp12
		},
		params: {
			ateLoopSize: CURVE.params.ateLoopSize,
			twistType: CURVE.params.twistType,
			r: CURVE.params.r,
			G1b: CURVE.G1.b,
			G2b: CURVE.G2.b
		},
		utils,
		getPublicKey,
		getPublicKeyForShortSignatures,
		sign,
		signShortSignature,
		verify,
		verifyShortSignature,
		aggregatePublicKeys,
		aggregateSignatures,
		aggregateShortSignatures,
		G1,
		G2,
		Signature,
		ShortSignature
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/tower.js
/**
* Towered extension fields.
* Rather than implementing a massive 12th-degree extension directly, it is more efficient
* to build it up from smaller extensions: a tower of extensions.
*
* For BLS12-381, the Fp12 field is implemented as a quadratic (degree two) extension,
* on top of a cubic (degree three) extension, on top of a quadratic extension of Fp.
*
* For more info: "Pairings for beginners" by Costello, section 7.3.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$3 = BigInt(0);
var _1n$3 = BigInt(1);
var _2n$3 = BigInt(2);
var _3n$1 = BigInt(3);
function calcFrobeniusCoefficients(Fp, nonResidue, modulus, degree, num = 1, divisor) {
	const _divisor = BigInt(divisor === void 0 ? degree : divisor);
	const towerModulus = modulus ** BigInt(degree);
	const res = [];
	for (let i = 0; i < num; i++) {
		const a = BigInt(i + 1);
		const powers = [];
		for (let j = 0, qPower = _1n$3; j < degree; j++) {
			const power = (a * qPower - a) / _divisor % towerModulus;
			powers.push(Fp.pow(nonResidue, power));
			qPower *= modulus;
		}
		res.push(powers);
	}
	return res;
}
function psiFrobenius(Fp, Fp2, base) {
	const PSI_X = Fp2.pow(base, (Fp.ORDER - _1n$3) / _3n$1);
	const PSI_Y = Fp2.pow(base, (Fp.ORDER - _1n$3) / _2n$3);
	function psi(x, y) {
		return [Fp2.mul(Fp2.frobeniusMap(x, 1), PSI_X), Fp2.mul(Fp2.frobeniusMap(y, 1), PSI_Y)];
	}
	const PSI2_X = Fp2.pow(base, (Fp.ORDER ** _2n$3 - _1n$3) / _3n$1);
	const PSI2_Y = Fp2.pow(base, (Fp.ORDER ** _2n$3 - _1n$3) / _2n$3);
	if (!Fp2.eql(PSI2_Y, Fp2.neg(Fp2.ONE))) throw new Error("psiFrobenius: PSI2_Y!==-1");
	function psi2(x, y) {
		return [Fp2.mul(x, PSI2_X), Fp2.neg(y)];
	}
	const mapAffine = (fn) => (c, P) => {
		const affine = P.toAffine();
		const p = fn(affine.x, affine.y);
		return c.fromAffine({
			x: p[0],
			y: p[1]
		});
	};
	return {
		psi,
		psi2,
		G2psi: mapAffine(psi),
		G2psi2: mapAffine(psi2),
		PSI_X,
		PSI_Y,
		PSI2_X,
		PSI2_Y
	};
}
var Fp2fromBigTuple = (Fp, tuple) => {
	if (tuple.length !== 2) throw new Error("invalid tuple");
	const fps = tuple.map((n) => Fp.create(n));
	return {
		c0: fps[0],
		c1: fps[1]
	};
};
var _Field2 = class {
	constructor(Fp, opts = {}) {
		this.MASK = _1n$3;
		const ORDER = Fp.ORDER;
		const FP2_ORDER = ORDER * ORDER;
		this.Fp = Fp;
		this.ORDER = FP2_ORDER;
		this.BITS = bitLen(FP2_ORDER);
		this.BYTES = Math.ceil(bitLen(FP2_ORDER) / 8);
		this.isLE = Fp.isLE;
		this.ZERO = {
			c0: Fp.ZERO,
			c1: Fp.ZERO
		};
		this.ONE = {
			c0: Fp.ONE,
			c1: Fp.ZERO
		};
		this.Fp_NONRESIDUE = Fp.create(opts.NONRESIDUE || BigInt(-1));
		this.Fp_div2 = Fp.div(Fp.ONE, _2n$3);
		this.NONRESIDUE = Fp2fromBigTuple(Fp, opts.FP2_NONRESIDUE);
		this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp, this.Fp_NONRESIDUE, Fp.ORDER, 2)[0];
		this.mulByB = opts.Fp2mulByB;
		Object.seal(this);
	}
	fromBigTuple(tuple) {
		return Fp2fromBigTuple(this.Fp, tuple);
	}
	create(num) {
		return num;
	}
	isValid({ c0, c1 }) {
		function isValidC(num, ORDER) {
			return typeof num === "bigint" && _0n$3 <= num && num < ORDER;
		}
		return isValidC(c0, this.ORDER) && isValidC(c1, this.ORDER);
	}
	is0({ c0, c1 }) {
		return this.Fp.is0(c0) && this.Fp.is0(c1);
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	eql({ c0, c1 }, { c0: r0, c1: r1 }) {
		return this.Fp.eql(c0, r0) && this.Fp.eql(c1, r1);
	}
	neg({ c0, c1 }) {
		return {
			c0: this.Fp.neg(c0),
			c1: this.Fp.neg(c1)
		};
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	invertBatch(nums) {
		return FpInvertBatch(this, nums);
	}
	add(f1, f2) {
		const { c0, c1 } = f1;
		const { c0: r0, c1: r1 } = f2;
		return {
			c0: this.Fp.add(c0, r0),
			c1: this.Fp.add(c1, r1)
		};
	}
	sub({ c0, c1 }, { c0: r0, c1: r1 }) {
		return {
			c0: this.Fp.sub(c0, r0),
			c1: this.Fp.sub(c1, r1)
		};
	}
	mul({ c0, c1 }, rhs) {
		const { Fp } = this;
		if (typeof rhs === "bigint") return {
			c0: Fp.mul(c0, rhs),
			c1: Fp.mul(c1, rhs)
		};
		const { c0: r0, c1: r1 } = rhs;
		let t1 = Fp.mul(c0, r0);
		let t2 = Fp.mul(c1, r1);
		return {
			c0: Fp.sub(t1, t2),
			c1: Fp.sub(Fp.mul(Fp.add(c0, c1), Fp.add(r0, r1)), Fp.add(t1, t2))
		};
	}
	sqr({ c0, c1 }) {
		const { Fp } = this;
		const a = Fp.add(c0, c1);
		const b = Fp.sub(c0, c1);
		const c = Fp.add(c0, c0);
		return {
			c0: Fp.mul(a, b),
			c1: Fp.mul(c, c1)
		};
	}
	addN(a, b) {
		return this.add(a, b);
	}
	subN(a, b) {
		return this.sub(a, b);
	}
	mulN(a, b) {
		return this.mul(a, b);
	}
	sqrN(a) {
		return this.sqr(a);
	}
	div(lhs, rhs) {
		const { Fp } = this;
		return this.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : this.inv(rhs));
	}
	inv({ c0: a, c1: b }) {
		const { Fp } = this;
		const factor = Fp.inv(Fp.create(a * a + b * b));
		return {
			c0: Fp.mul(factor, Fp.create(a)),
			c1: Fp.mul(factor, Fp.create(-b))
		};
	}
	sqrt(num) {
		const { Fp } = this;
		const Fp2 = this;
		const { c0, c1 } = num;
		if (Fp.is0(c1)) {
			if (FpLegendre(Fp, c0) === 1) return Fp2.create({
				c0: Fp.sqrt(c0),
				c1: Fp.ZERO
			});
			else return Fp2.create({
				c0: Fp.ZERO,
				c1: Fp.sqrt(Fp.div(c0, this.Fp_NONRESIDUE))
			});
		}
		const a = Fp.sqrt(Fp.sub(Fp.sqr(c0), Fp.mul(Fp.sqr(c1), this.Fp_NONRESIDUE)));
		let d = Fp.mul(Fp.add(a, c0), this.Fp_div2);
		if (FpLegendre(Fp, d) === -1) d = Fp.sub(d, a);
		const a0 = Fp.sqrt(d);
		const candidateSqrt = Fp2.create({
			c0: a0,
			c1: Fp.div(Fp.mul(c1, this.Fp_div2), a0)
		});
		if (!Fp2.eql(Fp2.sqr(candidateSqrt), num)) throw new Error("Cannot find square root");
		const x1 = candidateSqrt;
		const x2 = Fp2.neg(x1);
		const { re: re1, im: im1 } = Fp2.reim(x1);
		const { re: re2, im: im2 } = Fp2.reim(x2);
		if (im1 > im2 || im1 === im2 && re1 > re2) return x1;
		return x2;
	}
	isOdd(x) {
		const { re: x0, im: x1 } = this.reim(x);
		const sign_0 = x0 % _2n$3;
		const zero_0 = x0 === _0n$3;
		const sign_1 = x1 % _2n$3;
		return BigInt(sign_0 || zero_0 && sign_1) == _1n$3;
	}
	fromBytes(b) {
		const { Fp } = this;
		if (b.length !== this.BYTES) throw new Error("fromBytes invalid length=" + b.length);
		return {
			c0: Fp.fromBytes(b.subarray(0, Fp.BYTES)),
			c1: Fp.fromBytes(b.subarray(Fp.BYTES))
		};
	}
	toBytes({ c0, c1 }) {
		return concatBytes(this.Fp.toBytes(c0), this.Fp.toBytes(c1));
	}
	cmov({ c0, c1 }, { c0: r0, c1: r1 }, c) {
		return {
			c0: this.Fp.cmov(c0, r0, c),
			c1: this.Fp.cmov(c1, r1, c)
		};
	}
	reim({ c0, c1 }) {
		return {
			re: c0,
			im: c1
		};
	}
	Fp4Square(a, b) {
		const Fp2 = this;
		const a2 = Fp2.sqr(a);
		const b2 = Fp2.sqr(b);
		return {
			first: Fp2.add(Fp2.mulByNonresidue(b2), a2),
			second: Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(a, b)), a2), b2)
		};
	}
	mulByNonresidue({ c0, c1 }) {
		return this.mul({
			c0,
			c1
		}, this.NONRESIDUE);
	}
	frobeniusMap({ c0, c1 }, power) {
		return {
			c0,
			c1: this.Fp.mul(c1, this.FROBENIUS_COEFFICIENTS[power % 2])
		};
	}
};
var _Field6 = class {
	constructor(Fp2) {
		this.MASK = _1n$3;
		this.Fp2 = Fp2;
		this.ORDER = Fp2.ORDER;
		this.BITS = 3 * Fp2.BITS;
		this.BYTES = 3 * Fp2.BYTES;
		this.isLE = Fp2.isLE;
		this.ZERO = {
			c0: Fp2.ZERO,
			c1: Fp2.ZERO,
			c2: Fp2.ZERO
		};
		this.ONE = {
			c0: Fp2.ONE,
			c1: Fp2.ZERO,
			c2: Fp2.ZERO
		};
		const { Fp } = Fp2;
		const frob = calcFrobeniusCoefficients(Fp2, Fp2.NONRESIDUE, Fp.ORDER, 6, 2, 3);
		this.FROBENIUS_COEFFICIENTS_1 = frob[0];
		this.FROBENIUS_COEFFICIENTS_2 = frob[1];
		Object.seal(this);
	}
	add({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.add(c0, r0),
			c1: Fp2.add(c1, r1),
			c2: Fp2.add(c2, r2)
		};
	}
	sub({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.sub(c0, r0),
			c1: Fp2.sub(c1, r1),
			c2: Fp2.sub(c2, r2)
		};
	}
	mul({ c0, c1, c2 }, rhs) {
		const { Fp2 } = this;
		if (typeof rhs === "bigint") return {
			c0: Fp2.mul(c0, rhs),
			c1: Fp2.mul(c1, rhs),
			c2: Fp2.mul(c2, rhs)
		};
		const { c0: r0, c1: r1, c2: r2 } = rhs;
		const t0 = Fp2.mul(c0, r0);
		const t1 = Fp2.mul(c1, r1);
		const t2 = Fp2.mul(c2, r2);
		return {
			c0: Fp2.add(t0, Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), Fp2.add(r1, r2)), Fp2.add(t1, t2)))),
			c1: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c1), Fp2.add(r0, r1)), Fp2.add(t0, t1)), Fp2.mulByNonresidue(t2)),
			c2: Fp2.sub(Fp2.add(t1, Fp2.mul(Fp2.add(c0, c2), Fp2.add(r0, r2))), Fp2.add(t0, t2))
		};
	}
	sqr({ c0, c1, c2 }) {
		const { Fp2 } = this;
		let t0 = Fp2.sqr(c0);
		let t1 = Fp2.mul(Fp2.mul(c0, c1), _2n$3);
		let t3 = Fp2.mul(Fp2.mul(c1, c2), _2n$3);
		let t4 = Fp2.sqr(c2);
		return {
			c0: Fp2.add(Fp2.mulByNonresidue(t3), t0),
			c1: Fp2.add(Fp2.mulByNonresidue(t4), t1),
			c2: Fp2.sub(Fp2.sub(Fp2.add(Fp2.add(t1, Fp2.sqr(Fp2.add(Fp2.sub(c0, c1), c2))), t3), t0), t4)
		};
	}
	addN(a, b) {
		return this.add(a, b);
	}
	subN(a, b) {
		return this.sub(a, b);
	}
	mulN(a, b) {
		return this.mul(a, b);
	}
	sqrN(a) {
		return this.sqr(a);
	}
	create(num) {
		return num;
	}
	isValid({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return Fp2.isValid(c0) && Fp2.isValid(c1) && Fp2.isValid(c2);
	}
	is0({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return Fp2.is0(c0) && Fp2.is0(c1) && Fp2.is0(c2);
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	neg({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.neg(c0),
			c1: Fp2.neg(c1),
			c2: Fp2.neg(c2)
		};
	}
	eql({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) {
		const { Fp2 } = this;
		return Fp2.eql(c0, r0) && Fp2.eql(c1, r1) && Fp2.eql(c2, r2);
	}
	sqrt(_) {
		return notImplemented();
	}
	div(lhs, rhs) {
		const { Fp2 } = this;
		const { Fp } = Fp2;
		return this.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : this.inv(rhs));
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	invertBatch(nums) {
		return FpInvertBatch(this, nums);
	}
	inv({ c0, c1, c2 }) {
		const { Fp2 } = this;
		let t0 = Fp2.sub(Fp2.sqr(c0), Fp2.mulByNonresidue(Fp2.mul(c2, c1)));
		let t1 = Fp2.sub(Fp2.mulByNonresidue(Fp2.sqr(c2)), Fp2.mul(c0, c1));
		let t2 = Fp2.sub(Fp2.sqr(c1), Fp2.mul(c0, c2));
		let t4 = Fp2.inv(Fp2.add(Fp2.mulByNonresidue(Fp2.add(Fp2.mul(c2, t1), Fp2.mul(c1, t2))), Fp2.mul(c0, t0)));
		return {
			c0: Fp2.mul(t4, t0),
			c1: Fp2.mul(t4, t1),
			c2: Fp2.mul(t4, t2)
		};
	}
	fromBytes(b) {
		const { Fp2 } = this;
		if (b.length !== this.BYTES) throw new Error("fromBytes invalid length=" + b.length);
		const B2 = Fp2.BYTES;
		return {
			c0: Fp2.fromBytes(b.subarray(0, B2)),
			c1: Fp2.fromBytes(b.subarray(B2, B2 * 2)),
			c2: Fp2.fromBytes(b.subarray(2 * B2))
		};
	}
	toBytes({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return concatBytes(Fp2.toBytes(c0), Fp2.toBytes(c1), Fp2.toBytes(c2));
	}
	cmov({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c) {
		const { Fp2 } = this;
		return {
			c0: Fp2.cmov(c0, r0, c),
			c1: Fp2.cmov(c1, r1, c),
			c2: Fp2.cmov(c2, r2, c)
		};
	}
	fromBigSix(t) {
		const { Fp2 } = this;
		if (!Array.isArray(t) || t.length !== 6) throw new Error("invalid Fp6 usage");
		return {
			c0: Fp2.fromBigTuple(t.slice(0, 2)),
			c1: Fp2.fromBigTuple(t.slice(2, 4)),
			c2: Fp2.fromBigTuple(t.slice(4, 6))
		};
	}
	frobeniusMap({ c0, c1, c2 }, power) {
		const { Fp2 } = this;
		return {
			c0: Fp2.frobeniusMap(c0, power),
			c1: Fp2.mul(Fp2.frobeniusMap(c1, power), this.FROBENIUS_COEFFICIENTS_1[power % 6]),
			c2: Fp2.mul(Fp2.frobeniusMap(c2, power), this.FROBENIUS_COEFFICIENTS_2[power % 6])
		};
	}
	mulByFp2({ c0, c1, c2 }, rhs) {
		const { Fp2 } = this;
		return {
			c0: Fp2.mul(c0, rhs),
			c1: Fp2.mul(c1, rhs),
			c2: Fp2.mul(c2, rhs)
		};
	}
	mulByNonresidue({ c0, c1, c2 }) {
		const { Fp2 } = this;
		return {
			c0: Fp2.mulByNonresidue(c2),
			c1: c0,
			c2: c1
		};
	}
	mul1({ c0, c1, c2 }, b1) {
		const { Fp2 } = this;
		return {
			c0: Fp2.mulByNonresidue(Fp2.mul(c2, b1)),
			c1: Fp2.mul(c0, b1),
			c2: Fp2.mul(c1, b1)
		};
	}
	mul01({ c0, c1, c2 }, b0, b1) {
		const { Fp2 } = this;
		let t0 = Fp2.mul(c0, b0);
		let t1 = Fp2.mul(c1, b1);
		return {
			c0: Fp2.add(Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), b1), t1)), t0),
			c1: Fp2.sub(Fp2.sub(Fp2.mul(Fp2.add(b0, b1), Fp2.add(c0, c1)), t0), t1),
			c2: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c2), b0), t0), t1)
		};
	}
};
var _Field12 = class {
	constructor(Fp6, opts) {
		this.MASK = _1n$3;
		const { Fp2 } = Fp6;
		const { Fp } = Fp2;
		this.Fp6 = Fp6;
		this.ORDER = Fp2.ORDER;
		this.BITS = 2 * Fp6.BITS;
		this.BYTES = 2 * Fp6.BYTES;
		this.isLE = Fp6.isLE;
		this.ZERO = {
			c0: Fp6.ZERO,
			c1: Fp6.ZERO
		};
		this.ONE = {
			c0: Fp6.ONE,
			c1: Fp6.ZERO
		};
		this.FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp2, Fp2.NONRESIDUE, Fp.ORDER, 12, 1, 6)[0];
		this.X_LEN = opts.X_LEN;
		this.finalExponentiate = opts.Fp12finalExponentiate;
	}
	create(num) {
		return num;
	}
	isValid({ c0, c1 }) {
		const { Fp6 } = this;
		return Fp6.isValid(c0) && Fp6.isValid(c1);
	}
	is0({ c0, c1 }) {
		const { Fp6 } = this;
		return Fp6.is0(c0) && Fp6.is0(c1);
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	neg({ c0, c1 }) {
		const { Fp6 } = this;
		return {
			c0: Fp6.neg(c0),
			c1: Fp6.neg(c1)
		};
	}
	eql({ c0, c1 }, { c0: r0, c1: r1 }) {
		const { Fp6 } = this;
		return Fp6.eql(c0, r0) && Fp6.eql(c1, r1);
	}
	sqrt(_) {
		notImplemented();
	}
	inv({ c0, c1 }) {
		const { Fp6 } = this;
		let t = Fp6.inv(Fp6.sub(Fp6.sqr(c0), Fp6.mulByNonresidue(Fp6.sqr(c1))));
		return {
			c0: Fp6.mul(c0, t),
			c1: Fp6.neg(Fp6.mul(c1, t))
		};
	}
	div(lhs, rhs) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const { Fp } = Fp2;
		return this.mul(lhs, typeof rhs === "bigint" ? Fp.inv(Fp.create(rhs)) : this.inv(rhs));
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	invertBatch(nums) {
		return FpInvertBatch(this, nums);
	}
	add({ c0, c1 }, { c0: r0, c1: r1 }) {
		const { Fp6 } = this;
		return {
			c0: Fp6.add(c0, r0),
			c1: Fp6.add(c1, r1)
		};
	}
	sub({ c0, c1 }, { c0: r0, c1: r1 }) {
		const { Fp6 } = this;
		return {
			c0: Fp6.sub(c0, r0),
			c1: Fp6.sub(c1, r1)
		};
	}
	mul({ c0, c1 }, rhs) {
		const { Fp6 } = this;
		if (typeof rhs === "bigint") return {
			c0: Fp6.mul(c0, rhs),
			c1: Fp6.mul(c1, rhs)
		};
		let { c0: r0, c1: r1 } = rhs;
		let t1 = Fp6.mul(c0, r0);
		let t2 = Fp6.mul(c1, r1);
		return {
			c0: Fp6.add(t1, Fp6.mulByNonresidue(t2)),
			c1: Fp6.sub(Fp6.mul(Fp6.add(c0, c1), Fp6.add(r0, r1)), Fp6.add(t1, t2))
		};
	}
	sqr({ c0, c1 }) {
		const { Fp6 } = this;
		let ab = Fp6.mul(c0, c1);
		return {
			c0: Fp6.sub(Fp6.sub(Fp6.mul(Fp6.add(Fp6.mulByNonresidue(c1), c0), Fp6.add(c0, c1)), ab), Fp6.mulByNonresidue(ab)),
			c1: Fp6.add(ab, ab)
		};
	}
	addN(a, b) {
		return this.add(a, b);
	}
	subN(a, b) {
		return this.sub(a, b);
	}
	mulN(a, b) {
		return this.mul(a, b);
	}
	sqrN(a) {
		return this.sqr(a);
	}
	fromBytes(b) {
		const { Fp6 } = this;
		if (b.length !== this.BYTES) throw new Error("fromBytes invalid length=" + b.length);
		return {
			c0: Fp6.fromBytes(b.subarray(0, Fp6.BYTES)),
			c1: Fp6.fromBytes(b.subarray(Fp6.BYTES))
		};
	}
	toBytes({ c0, c1 }) {
		const { Fp6 } = this;
		return concatBytes(Fp6.toBytes(c0), Fp6.toBytes(c1));
	}
	cmov({ c0, c1 }, { c0: r0, c1: r1 }, c) {
		const { Fp6 } = this;
		return {
			c0: Fp6.cmov(c0, r0, c),
			c1: Fp6.cmov(c1, r1, c)
		};
	}
	fromBigTwelve(t) {
		const { Fp6 } = this;
		return {
			c0: Fp6.fromBigSix(t.slice(0, 6)),
			c1: Fp6.fromBigSix(t.slice(6, 12))
		};
	}
	frobeniusMap(lhs, power) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const { c0, c1, c2 } = Fp6.frobeniusMap(lhs.c1, power);
		const coeff = this.FROBENIUS_COEFFICIENTS[power % 12];
		return {
			c0: Fp6.frobeniusMap(lhs.c0, power),
			c1: Fp6.create({
				c0: Fp2.mul(c0, coeff),
				c1: Fp2.mul(c1, coeff),
				c2: Fp2.mul(c2, coeff)
			})
		};
	}
	mulByFp2({ c0, c1 }, rhs) {
		const { Fp6 } = this;
		return {
			c0: Fp6.mulByFp2(c0, rhs),
			c1: Fp6.mulByFp2(c1, rhs)
		};
	}
	conjugate({ c0, c1 }) {
		return {
			c0,
			c1: this.Fp6.neg(c1)
		};
	}
	mul014({ c0, c1 }, o0, o1, o4) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		let t0 = Fp6.mul01(c0, o0, o1);
		let t1 = Fp6.mul1(c1, o4);
		return {
			c0: Fp6.add(Fp6.mulByNonresidue(t1), t0),
			c1: Fp6.sub(Fp6.sub(Fp6.mul01(Fp6.add(c1, c0), o0, Fp2.add(o1, o4)), t0), t1)
		};
	}
	mul034({ c0, c1 }, o0, o3, o4) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const a = Fp6.create({
			c0: Fp2.mul(c0.c0, o0),
			c1: Fp2.mul(c0.c1, o0),
			c2: Fp2.mul(c0.c2, o0)
		});
		const b = Fp6.mul01(c1, o3, o4);
		const e = Fp6.mul01(Fp6.add(c0, c1), Fp2.add(o0, o3), o4);
		return {
			c0: Fp6.add(Fp6.mulByNonresidue(b), a),
			c1: Fp6.sub(e, Fp6.add(a, b))
		};
	}
	_cyclotomicSquare({ c0, c1 }) {
		const { Fp6 } = this;
		const { Fp2 } = Fp6;
		const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
		const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
		const { first: t3, second: t4 } = Fp2.Fp4Square(c0c0, c1c1);
		const { first: t5, second: t6 } = Fp2.Fp4Square(c1c0, c0c2);
		const { first: t7, second: t8 } = Fp2.Fp4Square(c0c1, c1c2);
		const t9 = Fp2.mulByNonresidue(t8);
		return {
			c0: Fp6.create({
				c0: Fp2.add(Fp2.mul(Fp2.sub(t3, c0c0), _2n$3), t3),
				c1: Fp2.add(Fp2.mul(Fp2.sub(t5, c0c1), _2n$3), t5),
				c2: Fp2.add(Fp2.mul(Fp2.sub(t7, c0c2), _2n$3), t7)
			}),
			c1: Fp6.create({
				c0: Fp2.add(Fp2.mul(Fp2.add(t9, c1c0), _2n$3), t9),
				c1: Fp2.add(Fp2.mul(Fp2.add(t4, c1c1), _2n$3), t4),
				c2: Fp2.add(Fp2.mul(Fp2.add(t6, c1c2), _2n$3), t6)
			})
		};
	}
	_cyclotomicExp(num, n) {
		let z = this.ONE;
		for (let i = this.X_LEN - 1; i >= 0; i--) {
			z = this._cyclotomicSquare(z);
			if (bitGet(n, i)) z = this.mul(z, num);
		}
		return z;
	}
};
function tower12(opts) {
	const Fp = Field(opts.ORDER);
	const Fp2 = new _Field2(Fp, opts);
	const Fp6 = new _Field6(Fp2);
	return {
		Fp,
		Fp2,
		Fp6,
		Fp12: new _Field12(Fp6, opts)
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/bls12-381.js
/**
* bls12-381 is pairing-friendly Barreto-Lynn-Scott elliptic curve construction allowing to:

* Construct zk-SNARKs at the ~120-bit security, as per [Barbulescu-Duquesne 2017](https://hal.science/hal-01534101/file/main.pdf)
* Efficiently verify N aggregate signatures with 1 pairing and N ec additions:
the Boneh-Lynn-Shacham signature scheme is orders of magnitude more efficient than Schnorr

BLS can mean 2 different things:

* Barreto-Lynn-Scott: BLS12, a Pairing Friendly Elliptic Curve
* Boneh-Lynn-Shacham: A Signature Scheme.

### Summary

1. BLS Relies on expensive bilinear pairing
2. Secret Keys: 32 bytes
3. Public Keys: 48 OR 96 bytes - big-endian x coordinate of point on G1 OR G2 curve
4. Signatures: 96 OR 48 bytes - big-endian x coordinate of point on G2 OR G1 curve
5. The 12 stands for the Embedding degree.

Modes of operation:

* Long signatures:  48-byte keys + 96-byte sigs (G1 keys + G2 sigs).
* Short signatures: 96-byte keys + 48-byte sigs (G2 keys + G1 sigs).

### Formulas

- `P = pk x G` - public keys
- `S = pk x H(m)` - signing, uses hash-to-curve on m
- `e(P, H(m)) == e(G, S)` - verification using pairings
- `e(G, S) = e(G, SUM(n)(Si)) = MUL(n)(e(G, Si))` - signature aggregation

### Curves

G1 is ordinary elliptic curve. G2 is extension field curve, think "over complex numbers".

- G1: y² = x³ + 4
- G2: y² = x³ + 4(u + 1) where u = √−1; r-order subgroup of E'(Fp²), M-type twist

### Towers

Pairing G1 + G2 produces element in Fp₁₂, 12-degree polynomial.
Fp₁₂ is usually implemented using tower of lower-degree polynomials for speed.

- Fp₁₂ = Fp₆² => Fp₂³
- Fp(u) / (u² - β) where β = -1
- Fp₂(v) / (v³ - ξ) where ξ = u + 1
- Fp₆(w) / (w² - γ) where γ = v
- Fp²[u] = Fp/u²+1
- Fp⁶[v] = Fp²/v³-1-u
- Fp¹²[w] = Fp⁶/w²-v

### Params

* Embedding degree (k): 12
* Seed is sometimes named x or t
* t = -15132376222941642752
* p = (t-1)² * (t⁴-t²+1)/3 + t
* r = t⁴-t²+1
* Ate loop size: X

To verify curve parameters, see
[pairing-friendly-curves spec](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves-11).
Basic math is done over finite fields over p.
More complicated math is done over polynominal extension fields.

### Compatibility and notes
1. It is compatible with Algorand, Chia, Dfinity, Ethereum, Filecoin, ZEC.
Filecoin uses little endian byte arrays for secret keys - make sure to reverse byte order.
2. Make sure to correctly select mode: "long signature" or "short signature".
3. Compatible with specs:
RFC 9380,
[cfrg-pairing-friendly-curves-11](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves-11),
[cfrg-bls-signature-05](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/).

*
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$2 = BigInt(0);
var _1n$2 = BigInt(1);
var _2n$2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var BLS_X = BigInt("0xd201000000010000");
var BLS_X_LEN = bitLen(BLS_X);
var bls12_381_CURVE_G1 = {
	p: BigInt("0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab"),
	n: BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001"),
	h: BigInt("0x396c8c005555e1568c00aaab0000aaab"),
	a: _0n$2,
	b: _4n,
	Gx: BigInt("0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb"),
	Gy: BigInt("0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1")
};
var bls12_381_Fr = Field(bls12_381_CURVE_G1.n, {
	modFromBytes: true,
	isLE: true
});
var { Fp: Fp$1, Fp2, Fp6, Fp12 } = tower12({
	ORDER: bls12_381_CURVE_G1.p,
	X_LEN: BLS_X_LEN,
	FP2_NONRESIDUE: [_1n$2, _1n$2],
	Fp2mulByB: ({ c0, c1 }) => {
		const t0 = Fp$1.mul(c0, _4n);
		const t1 = Fp$1.mul(c1, _4n);
		return {
			c0: Fp$1.sub(t0, t1),
			c1: Fp$1.add(t0, t1)
		};
	},
	Fp12finalExponentiate: (num) => {
		const x = BLS_X;
		const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
		const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
		const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x));
		const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
		const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x));
		const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x));
		const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x)), Fp12._cyclotomicSquare(t2));
		const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x));
		const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
		const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
		const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
		const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
		return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
	}
});
var { G2psi, G2psi2 } = psiFrobenius(Fp$1, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE));
/**
* Default hash_to_field / hash-to-curve for BLS.
* m: 1 for G1, 2 for G2
* k: target security level in bits
* hash: any function, e.g. BBS+ uses BLAKE2: see [github](https://github.com/hyperledger/aries-framework-go/issues/2247).
* Parameter values come from [section 8.8.2 of RFC 9380](https://www.rfc-editor.org/rfc/rfc9380#section-8.8.2).
*/
var htfDefaults = Object.freeze({
	DST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
	encodeDST: "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_",
	p: Fp$1.ORDER,
	m: 2,
	k: 128,
	expand: "xmd",
	hash: sha256
});
var bls12_381_CURVE_G2 = {
	p: Fp2.ORDER,
	n: bls12_381_CURVE_G1.n,
	h: BigInt("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5"),
	a: Fp2.ZERO,
	b: Fp2.fromBigTuple([_4n, _4n]),
	Gx: Fp2.fromBigTuple([BigInt("0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"), BigInt("0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e")]),
	Gy: Fp2.fromBigTuple([BigInt("0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801"), BigInt("0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be")])
};
var COMPZERO = setMask(Fp$1.toBytes(_0n$2), {
	infinity: true,
	compressed: true
});
function parseMask(bytes) {
	bytes = bytes.slice();
	const mask = bytes[0] & 224;
	const compressed = !!(mask >> 7 & 1);
	const infinity = !!(mask >> 6 & 1);
	const sort = !!(mask >> 5 & 1);
	bytes[0] &= 31;
	return {
		compressed,
		infinity,
		sort,
		value: bytes
	};
}
function setMask(bytes, mask) {
	if (bytes[0] & 224) throw new Error("setMask: non-empty mask");
	if (mask.compressed) bytes[0] |= 128;
	if (mask.infinity) bytes[0] |= 64;
	if (mask.sort) bytes[0] |= 32;
	return bytes;
}
function pointG1ToBytes(_c, point, isComp) {
	const { BYTES: L, ORDER: P } = Fp$1;
	const is0 = point.is0();
	const { x, y } = point.toAffine();
	if (isComp) {
		if (is0) return COMPZERO.slice();
		const sort = Boolean(y * _2n$2 / P);
		return setMask(numberToBytesBE(x, L), {
			compressed: true,
			sort
		});
	} else if (is0) return concatBytes(Uint8Array.of(64), new Uint8Array(2 * L - 1));
	else return concatBytes(numberToBytesBE(x, L), numberToBytesBE(y, L));
}
function signatureG1ToBytes(point) {
	point.assertValidity();
	const { BYTES: L, ORDER: P } = Fp$1;
	const { x, y } = point.toAffine();
	if (point.is0()) return COMPZERO.slice();
	const sort = Boolean(y * _2n$2 / P);
	return setMask(numberToBytesBE(x, L), {
		compressed: true,
		sort
	});
}
function pointG1FromBytes(bytes) {
	const { compressed, infinity, sort, value } = parseMask(bytes);
	const { BYTES: L, ORDER: P } = Fp$1;
	if (value.length === 48 && compressed) {
		const compressedValue = bytesToNumberBE(value);
		const x = Fp$1.create(compressedValue & bitMask(Fp$1.BITS));
		if (infinity) {
			if (x !== _0n$2) throw new Error("invalid G1 point: non-empty, at infinity, with compression");
			return {
				x: _0n$2,
				y: _0n$2
			};
		}
		const right = Fp$1.add(Fp$1.pow(x, _3n), Fp$1.create(bls12_381_CURVE_G1.b));
		let y = Fp$1.sqrt(right);
		if (!y) throw new Error("invalid G1 point: compressed point");
		if (y * _2n$2 / P !== BigInt(sort)) y = Fp$1.neg(y);
		return {
			x: Fp$1.create(x),
			y: Fp$1.create(y)
		};
	} else if (value.length === 96 && !compressed) {
		const x = bytesToNumberBE(value.subarray(0, L));
		const y = bytesToNumberBE(value.subarray(L));
		if (infinity) {
			if (x !== _0n$2 || y !== _0n$2) throw new Error("G1: non-empty point at infinity");
			return bls12_381.G1.Point.ZERO.toAffine();
		}
		return {
			x: Fp$1.create(x),
			y: Fp$1.create(y)
		};
	} else throw new Error("invalid G1 point: expected 48/96 bytes");
}
function signatureG1FromBytes(hex) {
	const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex, 48));
	const P = Fp$1.ORDER;
	const Point = bls12_381.G1.Point;
	const compressedValue = bytesToNumberBE(value);
	if (infinity) return Point.ZERO;
	const x = Fp$1.create(compressedValue & bitMask(Fp$1.BITS));
	const right = Fp$1.add(Fp$1.pow(x, _3n), Fp$1.create(bls12_381_CURVE_G1.b));
	let y = Fp$1.sqrt(right);
	if (!y) throw new Error("invalid G1 point: compressed");
	const aflag = BigInt(sort);
	if (y * _2n$2 / P !== aflag) y = Fp$1.neg(y);
	const point = Point.fromAffine({
		x,
		y
	});
	point.assertValidity();
	return point;
}
function pointG2ToBytes(_c, point, isComp) {
	const { BYTES: L, ORDER: P } = Fp$1;
	const is0 = point.is0();
	const { x, y } = point.toAffine();
	if (isComp) {
		if (is0) return concatBytes(COMPZERO, numberToBytesBE(_0n$2, L));
		const flag = Boolean(y.c1 === _0n$2 ? y.c0 * _2n$2 / P : y.c1 * _2n$2 / P);
		return concatBytes(setMask(numberToBytesBE(x.c1, L), {
			compressed: true,
			sort: flag
		}), numberToBytesBE(x.c0, L));
	} else {
		if (is0) return concatBytes(Uint8Array.of(64), new Uint8Array(4 * L - 1));
		const { re: x0, im: x1 } = Fp2.reim(x);
		const { re: y0, im: y1 } = Fp2.reim(y);
		return concatBytes(numberToBytesBE(x1, L), numberToBytesBE(x0, L), numberToBytesBE(y1, L), numberToBytesBE(y0, L));
	}
}
function signatureG2ToBytes(point) {
	point.assertValidity();
	const { BYTES: L } = Fp$1;
	if (point.is0()) return concatBytes(COMPZERO, numberToBytesBE(_0n$2, L));
	const { x, y } = point.toAffine();
	const { re: x0, im: x1 } = Fp2.reim(x);
	const { re: y0, im: y1 } = Fp2.reim(y);
	const tmp = y1 > _0n$2 ? y1 * _2n$2 : y0 * _2n$2;
	const sort = Boolean(tmp / Fp$1.ORDER & _1n$2);
	const z2 = x0;
	return concatBytes(setMask(numberToBytesBE(x1, L), {
		sort,
		compressed: true
	}), numberToBytesBE(z2, L));
}
function pointG2FromBytes(bytes) {
	const { BYTES: L, ORDER: P } = Fp$1;
	const { compressed, infinity, sort, value } = parseMask(bytes);
	if (!compressed && !infinity && sort || !compressed && infinity && sort || sort && infinity && compressed) throw new Error("invalid encoding flag: " + (bytes[0] & 224));
	const slc = (b, from, to) => bytesToNumberBE(b.slice(from, to));
	if (value.length === 96 && compressed) {
		if (infinity) {
			if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) throw new Error("invalid G2 point: compressed");
			return {
				x: Fp2.ZERO,
				y: Fp2.ZERO
			};
		}
		const x_1 = slc(value, 0, L);
		const x_0 = slc(value, L, 2 * L);
		const x = Fp2.create({
			c0: Fp$1.create(x_0),
			c1: Fp$1.create(x_1)
		});
		const right = Fp2.add(Fp2.pow(x, _3n), bls12_381_CURVE_G2.b);
		let y = Fp2.sqrt(right);
		const Y_bit = y.c1 === _0n$2 ? y.c0 * _2n$2 / P : y.c1 * _2n$2 / P ? _1n$2 : _0n$2;
		y = sort && Y_bit > 0 ? y : Fp2.neg(y);
		return {
			x,
			y
		};
	} else if (value.length === 192 && !compressed) {
		if (infinity) {
			if (value.reduce((p, c) => p !== 0 ? c + 1 : c, 0) > 0) throw new Error("invalid G2 point: uncompressed");
			return {
				x: Fp2.ZERO,
				y: Fp2.ZERO
			};
		}
		const x1 = slc(value, 0 * L, 1 * L);
		const x0 = slc(value, 1 * L, 2 * L);
		const y1 = slc(value, 2 * L, 3 * L);
		const y0 = slc(value, 3 * L, 4 * L);
		return {
			x: Fp2.fromBigTuple([x0, x1]),
			y: Fp2.fromBigTuple([y0, y1])
		};
	} else throw new Error("invalid G2 point: expected 96/192 bytes");
}
function signatureG2FromBytes(hex) {
	const { ORDER: P } = Fp$1;
	const { infinity, sort, value } = parseMask(ensureBytes("signatureHex", hex));
	const Point = bls12_381.G2.Point;
	const half = value.length / 2;
	if (half !== 48 && half !== 96) throw new Error("invalid compressed signature length, expected 96/192 bytes");
	const z1 = bytesToNumberBE(value.slice(0, half));
	const z2 = bytesToNumberBE(value.slice(half));
	if (infinity) return Point.ZERO;
	const x1 = Fp$1.create(z1 & bitMask(Fp$1.BITS));
	const x2 = Fp$1.create(z2);
	const x = Fp2.create({
		c0: x2,
		c1: x1
	});
	const y2 = Fp2.add(Fp2.pow(x, _3n), bls12_381_CURVE_G2.b);
	let y = Fp2.sqrt(y2);
	if (!y) throw new Error("Failed to find a square root");
	const { re: y0, im: y1 } = Fp2.reim(y);
	const aflag1 = BigInt(sort);
	const isGreater = y1 > _0n$2 && y1 * _2n$2 / P !== aflag1;
	const is0 = y1 === _0n$2 && y0 * _2n$2 / P !== aflag1;
	if (isGreater || is0) y = Fp2.neg(y);
	const point = Point.fromAffine({
		x,
		y
	});
	point.assertValidity();
	return point;
}
/**
* bls12-381 pairing-friendly curve.
* @example
* import { bls12_381 as bls } from '@noble/curves/bls12-381';
* // G1 keys, G2 signatures
* const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
* const message = '64726e3da8';
* const publicKey = bls.getPublicKey(privateKey);
* const signature = bls.sign(message, privateKey);
* const isValid = bls.verify(signature, message, publicKey);
*/
var bls12_381 = bls({
	fields: {
		Fp: Fp$1,
		Fp2,
		Fp6,
		Fp12,
		Fr: bls12_381_Fr
	},
	G1: {
		...bls12_381_CURVE_G1,
		Fp: Fp$1,
		htfDefaults: {
			...htfDefaults,
			m: 1,
			DST: "BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_"
		},
		wrapPrivateKey: true,
		allowInfinityPoint: true,
		isTorsionFree: (c, point) => {
			const beta = BigInt("0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe");
			const phi = new c(Fp$1.mul(point.X, beta), point.Y, point.Z);
			return point.multiplyUnsafe(BLS_X).negate().multiplyUnsafe(BLS_X).equals(phi);
		},
		clearCofactor: (_c, point) => {
			return point.multiplyUnsafe(BLS_X).add(point);
		},
		mapToCurve: mapToG1,
		fromBytes: pointG1FromBytes,
		toBytes: pointG1ToBytes,
		ShortSignature: {
			fromBytes(bytes) {
				abytes(bytes);
				return signatureG1FromBytes(bytes);
			},
			fromHex(hex) {
				return signatureG1FromBytes(hex);
			},
			toBytes(point) {
				return signatureG1ToBytes(point);
			},
			toRawBytes(point) {
				return signatureG1ToBytes(point);
			},
			toHex(point) {
				return bytesToHex(signatureG1ToBytes(point));
			}
		}
	},
	G2: {
		...bls12_381_CURVE_G2,
		Fp: Fp2,
		hEff: BigInt("0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551"),
		htfDefaults: { ...htfDefaults },
		wrapPrivateKey: true,
		allowInfinityPoint: true,
		mapToCurve: mapToG2,
		isTorsionFree: (c, P) => {
			return P.multiplyUnsafe(BLS_X).negate().equals(G2psi(c, P));
		},
		clearCofactor: (c, P) => {
			const x = BLS_X;
			let t1 = P.multiplyUnsafe(x).negate();
			let t2 = G2psi(c, P);
			let t3 = P.double();
			t3 = G2psi2(c, t3);
			t3 = t3.subtract(t2);
			t2 = t1.add(t2);
			t2 = t2.multiplyUnsafe(x).negate();
			t3 = t3.add(t2);
			t3 = t3.subtract(t1);
			return t3.subtract(P);
		},
		fromBytes: pointG2FromBytes,
		toBytes: pointG2ToBytes,
		Signature: {
			fromBytes(bytes) {
				abytes(bytes);
				return signatureG2FromBytes(bytes);
			},
			fromHex(hex) {
				return signatureG2FromBytes(hex);
			},
			toBytes(point) {
				return signatureG2ToBytes(point);
			},
			toRawBytes(point) {
				return signatureG2ToBytes(point);
			},
			toHex(point) {
				return bytesToHex(signatureG2ToBytes(point));
			}
		}
	},
	params: {
		ateLoopSize: BLS_X,
		r: bls12_381_CURVE_G1.n,
		xNegative: true,
		twistType: "multiplicative"
	},
	htfDefaults,
	hash: sha256
});
var isogenyMapG2 = isogenyMap(Fp2, [
	[
		["0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6", "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6"],
		["0x0", "0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a"],
		["0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e", "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d"],
		["0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1", "0x0"]
	],
	[
		["0x0", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63"],
		["0xc", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f"],
		["0x1", "0x0"]
	],
	[
		["0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706", "0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706"],
		["0x0", "0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be"],
		["0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c", "0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f"],
		["0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10", "0x0"]
	],
	[
		["0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb"],
		["0x0", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3"],
		["0x12", "0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99"],
		["0x1", "0x0"]
	]
].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
var isogenyMapG1 = isogenyMap(Fp$1, [
	[
		"0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7",
		"0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb",
		"0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0",
		"0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861",
		"0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9",
		"0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983",
		"0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84",
		"0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e",
		"0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317",
		"0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e",
		"0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b",
		"0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229"
	],
	[
		"0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c",
		"0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff",
		"0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19",
		"0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8",
		"0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e",
		"0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5",
		"0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a",
		"0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e",
		"0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641",
		"0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a",
		"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
	],
	[
		"0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33",
		"0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696",
		"0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6",
		"0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb",
		"0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb",
		"0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0",
		"0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2",
		"0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29",
		"0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587",
		"0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30",
		"0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132",
		"0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e",
		"0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8",
		"0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133",
		"0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b",
		"0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604"
	],
	[
		"0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1",
		"0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d",
		"0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2",
		"0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416",
		"0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d",
		"0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac",
		"0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c",
		"0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9",
		"0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a",
		"0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55",
		"0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8",
		"0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092",
		"0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc",
		"0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7",
		"0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f",
		"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
	]
].map((i) => i.map((j) => BigInt(j))));
var G1_SWU = mapToCurveSimpleSWU(Fp$1, {
	A: Fp$1.create(BigInt("0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d")),
	B: Fp$1.create(BigInt("0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0")),
	Z: Fp$1.create(BigInt(11))
});
var G2_SWU = mapToCurveSimpleSWU(Fp2, {
	A: Fp2.create({
		c0: Fp$1.create(_0n$2),
		c1: Fp$1.create(BigInt(240))
	}),
	B: Fp2.create({
		c0: Fp$1.create(BigInt(1012)),
		c1: Fp$1.create(BigInt(1012))
	}),
	Z: Fp2.create({
		c0: Fp$1.create(BigInt(-2)),
		c1: Fp$1.create(BigInt(-1))
	})
});
function mapToG1(scalars) {
	const { x, y } = G1_SWU(Fp$1.create(scalars[0]));
	return isogenyMapG1(x, y);
}
function mapToG2(scalars) {
	const { x, y } = G2_SWU(Fp2.fromBigTuple(scalars));
	return isogenyMapG2(x, y);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/bls.js
/**
*
* @param pk primary key: Uint8Array
* @param sig signature: Uint8Array
* @param msg message: Uint8Array
* @returns boolean
*/
function blsVerify(pk, sig, msg) {
	const primaryKey = typeof pk === "string" ? pk : bytesToHex(pk);
	const signature = typeof sig === "string" ? sig : bytesToHex(sig);
	const message = typeof msg === "string" ? msg : bytesToHex(msg);
	return bls12_381.verifyShortSignature(signature, message, primaryKey);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/leb.js
var MILLISECOND_TO_NANOSECONDS = BigInt(1e6);
var decodeLeb128 = (buf) => {
	return lebDecode(new PipeArrayBuffer(buf));
};
var decodeTime = (buf) => {
	const timestampMs = decodeLeb128(buf) / MILLISECOND_TO_NANOSECONDS;
	return new Date(Number(timestampMs));
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/certificate.js
var MINUTES_TO_MSEC = 6e4;
var DAYS_TO_MINUTES = 1440;
var DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES = 5;
var DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE = 5;
var DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES = 30 * DAYS_TO_MINUTES;
var NodeType;
(function(NodeType) {
	NodeType[NodeType["Empty"] = 0] = "Empty";
	NodeType[NodeType["Fork"] = 1] = "Fork";
	NodeType[NodeType["Labeled"] = 2] = "Labeled";
	NodeType[NodeType["Leaf"] = 3] = "Leaf";
	NodeType[NodeType["Pruned"] = 4] = "Pruned";
})(NodeType || (NodeType = {}));
function isBufferGreaterThan(a, b) {
	for (let i = 0; i < a.length; i++) if (a[i] > b[i]) return true;
	return false;
}
var Certificate = class Certificate {
	#disableTimeVerification = false;
	#agent = void 0;
	/**
	* Create a new instance of a certificate, automatically verifying it.
	* @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
	* @throws {Error} if the verification of the certificate fails
	*/
	static async create(options) {
		const cert = Certificate.createUnverified(options);
		await cert.verify();
		return cert;
	}
	static createUnverified(options) {
		return new Certificate(options.certificate, options.rootKey, options.principal, options.blsVerify ?? blsVerify, options.maxAgeInMinutes, options.disableTimeVerification, options.agent);
	}
	constructor(certificate, _rootKey, _principal, _blsVerify, _maxAgeInMinutes = DEFAULT_CERTIFICATE_MAX_AGE_IN_MINUTES, disableTimeVerification = false, agent) {
		this._rootKey = _rootKey;
		this._principal = _principal;
		this._blsVerify = _blsVerify;
		this._maxAgeInMinutes = _maxAgeInMinutes;
		this.#disableTimeVerification = disableTimeVerification;
		this.cert = decode(certificate);
		if (agent && "getTimeDiffMsecs" in agent && "hasSyncedTime" in agent && "syncTime" in agent && "syncTimeWithSubnet" in agent) this.#agent = agent;
	}
	/**
	* Lookup a path in the certificate tree, using {@link lookup_path}.
	* @param path The path to lookup.
	* @returns The result of the lookup.
	*/
	lookup_path(path) {
		return lookup_path(path, this.cert.tree);
	}
	/**
	* Lookup a subtree in the certificate tree, using {@link lookup_subtree}.
	* @param path The path to lookup.
	* @returns The result of the lookup.
	*/
	lookup_subtree(path) {
		return lookup_subtree(path, this.cert.tree);
	}
	async verify() {
		const rootHash = await reconstruct(this.cert.tree);
		const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
		const sig = this.cert.signature;
		const key = extractDER(derKey);
		const msg = concatBytes(IC_STATE_ROOT_DOMAIN_SEPARATOR, rootHash);
		const lookupTime = lookupResultToBuffer(this.lookup_path(["time"]));
		if (!lookupTime) throw ProtocolError.fromCode(new CertificateVerificationErrorCode("Certificate does not contain a time"));
		if (!this.#disableTimeVerification) {
			const timeDiffMsecs = this.#agent?.getTimeDiffMsecs() ?? 0;
			const maxAgeInMsec = this._maxAgeInMinutes * MINUTES_TO_MSEC;
			const now = /* @__PURE__ */ new Date();
			const adjustedNow = now.getTime() + timeDiffMsecs;
			const earliestCertificateTime = adjustedNow - maxAgeInMsec;
			const latestCertificateTime = adjustedNow + DEFAULT_CERTIFICATE_MAX_MINUTES_IN_FUTURE * MINUTES_TO_MSEC;
			const certTime = decodeTime(lookupTime);
			const isCertificateTimePast = certTime.getTime() < earliestCertificateTime;
			const isCertificateTimeFuture = certTime.getTime() > latestCertificateTime;
			if ((isCertificateTimePast || isCertificateTimeFuture) && this.#agent && !this.#agent.hasSyncedTime()) {
				await this._syncTime();
				return await this.verify();
			}
			if (isCertificateTimePast) throw TrustError.fromCode(new CertificateTimeErrorCode(this._maxAgeInMinutes, certTime, now, timeDiffMsecs, "past"));
			else if (isCertificateTimeFuture) {
				if (this.#agent?.hasSyncedTime()) throw UnknownError.fromCode(new UnexpectedErrorCode("System time has been synced with the IC network, but certificate is still too far in the future."));
				throw TrustError.fromCode(new CertificateTimeErrorCode(5, certTime, now, timeDiffMsecs, "future"));
			}
		}
		try {
			if (!await this._blsVerify(key, sig, msg)) throw TrustError.fromCode(new CertificateVerificationErrorCode("Invalid signature"));
		} catch (err) {
			throw TrustError.fromCode(new CertificateVerificationErrorCode("Signature verification failed", err));
		}
	}
	async _checkDelegationAndGetKey(d) {
		if (!d) return this._rootKey;
		const cert = Certificate.createUnverified({
			certificate: d.certificate,
			rootKey: this._rootKey,
			principal: this._principal,
			blsVerify: this._blsVerify,
			disableTimeVerification: this.#disableTimeVerification,
			maxAgeInMinutes: DEFAULT_CERTIFICATE_DELEGATION_MAX_AGE_IN_MINUTES,
			agent: this.#agent
		});
		if (cert.cert.delegation) throw ProtocolError.fromCode(new CertificateHasTooManyDelegationsErrorCode());
		await cert.verify();
		let subnetId;
		if (isCanisterPrincipal(this._principal)) {
			const canisterId = this._principal.canisterId;
			subnetId = Principal$1.fromUint8Array(d.subnet_id);
			if (!check_canister_ranges({
				canisterId,
				subnetId,
				tree: cert.cert.tree
			})) throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(canisterId, subnetId));
		} else if (isSubnetPrincipal(this._principal)) subnetId = this._principal.subnetId;
		else throw UNREACHABLE_ERROR;
		const publicKeyLookup = lookupResultToBuffer(cert.lookup_path([
			"subnet",
			subnetId.toUint8Array(),
			"public_key"
		]));
		if (!publicKeyLookup) {
			if (isSubnetPrincipal(this._principal)) throw TrustError.fromCode(new CertificateNotAuthorizedForSubnetErrorCode(subnetId));
			else throw TrustError.fromCode(new MissingLookupValueErrorCode(`Could not find subnet key for subnet ID ${subnetId.toText()}`));
		}
		return publicKeyLookup;
	}
	async _syncTime() {
		if (!this.#agent) return;
		if (isCanisterPrincipal(this._principal)) await this.#agent.syncTime(this._principal.canisterId);
		else await this.#agent.syncTimeWithSubnet(this._principal.subnetId);
	}
};
function isSubnetPrincipal(principal) {
	return "subnetId" in principal;
}
function isCanisterPrincipal(principal) {
	return "canisterId" in principal;
}
var DER_PREFIX = hexToBytes("308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100");
var KEY_LENGTH = 96;
function extractDER(buf) {
	const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
	if (buf.byteLength !== expectedLength) throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(expectedLength, buf.byteLength));
	const prefix = buf.slice(0, DER_PREFIX.byteLength);
	if (!uint8Equals(prefix, DER_PREFIX)) throw ProtocolError.fromCode(new DerPrefixMismatchErrorCode(DER_PREFIX, prefix));
	return buf.slice(DER_PREFIX.byteLength);
}
/**
* Utility function to constrain the type of a lookup result
* @param result the result of a lookup
* @returns {Uint8Array | undefined} the value if the lookup was found, `undefined` otherwise
*/
function lookupResultToBuffer(result) {
	if (result.status !== LookupPathStatus.Found) return;
	if (result.value instanceof Uint8Array) return result.value;
}
/**
* @param t The hash tree to reconstruct
*/
async function reconstruct(t) {
	switch (t[0]) {
		case NodeType.Empty: return sha256(domain_sep("ic-hashtree-empty"));
		case NodeType.Pruned: return t[1];
		case NodeType.Leaf: return sha256(concatBytes(domain_sep("ic-hashtree-leaf"), t[1]));
		case NodeType.Labeled: return sha256(concatBytes(domain_sep("ic-hashtree-labeled"), t[1], await reconstruct(t[2])));
		case NodeType.Fork: return sha256(concatBytes(domain_sep("ic-hashtree-fork"), await reconstruct(t[1]), await reconstruct(t[2])));
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* Creates a domain separator for hashing by encoding the input string
* with its length as a prefix.
* @param s - The input string to encode.
* @returns A Uint8Array containing the encoded domain separator.
*/
function domain_sep(s) {
	return concatBytes(new Uint8Array([s.length]), new TextEncoder().encode(s));
}
function pathToLabel(path) {
	return typeof path[0] === "string" ? utf8ToBytes(path[0]) : path[0];
}
var LookupPathStatus;
(function(LookupPathStatus) {
	LookupPathStatus["Unknown"] = "Unknown";
	LookupPathStatus["Absent"] = "Absent";
	LookupPathStatus["Found"] = "Found";
	LookupPathStatus["Error"] = "Error";
})(LookupPathStatus || (LookupPathStatus = {}));
var LookupSubtreeStatus;
(function(LookupSubtreeStatus) {
	LookupSubtreeStatus["Absent"] = "Absent";
	LookupSubtreeStatus["Unknown"] = "Unknown";
	LookupSubtreeStatus["Found"] = "Found";
})(LookupSubtreeStatus || (LookupSubtreeStatus = {}));
var LookupLabelStatus;
(function(LookupLabelStatus) {
	LookupLabelStatus["Absent"] = "Absent";
	LookupLabelStatus["Unknown"] = "Unknown";
	LookupLabelStatus["Found"] = "Found";
	LookupLabelStatus["Less"] = "Less";
	LookupLabelStatus["Greater"] = "Greater";
})(LookupLabelStatus || (LookupLabelStatus = {}));
/**
* Lookup a path in a tree. If the path is a subtree, use {@link lookup_subtree} instead.
* @param path the path to look up
* @param tree the tree to search
* @returns {LookupResult} the result of the lookup
*/
function lookup_path(path, tree) {
	if (path.length === 0) switch (tree[0]) {
		case NodeType.Empty: return { status: LookupPathStatus.Absent };
		case NodeType.Leaf:
			if (!tree[1]) throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid tree structure for leaf"));
			if (tree[1] instanceof Uint8Array) return {
				status: LookupPathStatus.Found,
				value: tree[1].slice(tree[1].byteOffset, tree[1].byteLength + tree[1].byteOffset)
			};
			throw UNREACHABLE_ERROR;
		case NodeType.Pruned: return { status: LookupPathStatus.Unknown };
		case NodeType.Labeled:
		case NodeType.Fork: return { status: LookupPathStatus.Error };
		default: throw UNREACHABLE_ERROR;
	}
	const lookupResult = find_label(pathToLabel(path), tree);
	switch (lookupResult.status) {
		case LookupLabelStatus.Found: return lookup_path(path.slice(1), lookupResult.value);
		case LookupLabelStatus.Absent:
		case LookupLabelStatus.Greater:
		case LookupLabelStatus.Less: return { status: LookupPathStatus.Absent };
		case LookupLabelStatus.Unknown: return { status: LookupPathStatus.Unknown };
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* Lookup a subtree in a tree.
* @param path the path to look up
* @param tree the tree to search
* @returns {SubtreeLookupResult} the result of the lookup
*/
function lookup_subtree(path, tree) {
	if (path.length === 0) return {
		status: LookupSubtreeStatus.Found,
		value: tree
	};
	const lookupResult = find_label(pathToLabel(path), tree);
	switch (lookupResult.status) {
		case LookupLabelStatus.Found: return lookup_subtree(path.slice(1), lookupResult.value);
		case LookupLabelStatus.Unknown: return { status: LookupSubtreeStatus.Unknown };
		case LookupLabelStatus.Absent:
		case LookupLabelStatus.Greater:
		case LookupLabelStatus.Less: return { status: LookupSubtreeStatus.Absent };
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* If the tree is a fork, flatten it into an array of trees
* @param {HashTree} t the tree to flatten
* @returns {HashTree[]} the flattened tree
*/
function flatten_forks(t) {
	switch (t[0]) {
		case NodeType.Empty: return [];
		case NodeType.Fork: return flatten_forks(t[1]).concat(flatten_forks(t[2]));
		default: return [t];
	}
}
/**
* Find a label in a tree
* @param label the label to find
* @param tree the tree to search
* @returns {LabelLookupResult} the result of the label lookup
*/
function find_label(label, tree) {
	switch (tree[0]) {
		case NodeType.Labeled:
			if (isBufferGreaterThan(label, tree[1])) return { status: LookupLabelStatus.Greater };
			if (uint8Equals(label, tree[1])) return {
				status: LookupLabelStatus.Found,
				value: tree[2]
			};
			return { status: LookupLabelStatus.Less };
		case NodeType.Fork: {
			const leftLookupResult = find_label(label, tree[1]);
			switch (leftLookupResult.status) {
				case LookupLabelStatus.Greater: {
					const rightLookupResult = find_label(label, tree[2]);
					if (rightLookupResult.status === LookupLabelStatus.Less) return { status: LookupLabelStatus.Absent };
					return rightLookupResult;
				}
				case LookupLabelStatus.Unknown: {
					const rightLookupResult = find_label(label, tree[2]);
					if (rightLookupResult.status === LookupLabelStatus.Less) return { status: LookupLabelStatus.Unknown };
					return rightLookupResult;
				}
				default: return leftLookupResult;
			}
		}
		case NodeType.Pruned: return { status: LookupLabelStatus.Unknown };
		default: return { status: LookupLabelStatus.Absent };
	}
}
/**
* Ported from https://github.com/dfinity/response-verification/blob/a4b8b46bcf93f44ac30b5698e60bfd245e33ad4e/packages/ic-certification/src/hash_tree/mod.rs#L527-L541.
* @param path the path to prepend to the paths of the tree
* @param tree the tree to list the paths of
* @returns the paths of the tree
*/
function list_paths(path, tree) {
	switch (tree[0]) {
		case NodeType.Empty | NodeType.Pruned: return [];
		case NodeType.Leaf: return [path];
		case NodeType.Fork: return list_paths(path, tree[1]).concat(list_paths(path, tree[2]));
		case NodeType.Labeled: {
			const label = tree[1];
			const subtree = tree[2];
			return list_paths([...path, label], subtree);
		}
		default: throw UNREACHABLE_ERROR;
	}
}
/**
* Check if a canister ID falls within the canister ranges of a given subnet
* @param params the parameters with which to check the canister ranges
* @param params.canisterId the canister ID to check
* @param params.subnetId the subnet ID from which to check the canister ranges
* @param params.tree the hash tree in which to lookup the subnet's canister ranges
* @returns {boolean} `true` if the canister is in the range, `false` otherwise
*/
function check_canister_ranges(params) {
	const ranges = decodeCanisterRanges(lookupCanisterRanges(params));
	const { canisterId } = params;
	return ranges.some((r) => r[0].ltEq(canisterId) && r[1].gtEq(canisterId));
}
/**
* Lookup the canister ranges using the `/canister_ranges/<subnet_id>/<ranges>` path.
* Certificates returned by `/api/v4/canister/<effective_canister_id>/call`
* and `/api/v3/canister/<effective_canister_id>/read_state` use this path.
*
* If the new lookup is not found, it tries the fallback lookup with {@link lookupCanisterRangesFallback}.
* @param params the parameters with which to lookup the canister ranges
* @param params.subnetId the subnet ID to lookup the canister ranges for
* @param params.tree the tree to search
* @param params.canisterId the canister ID to check
* @returns the encoded canister ranges. Use {@link decodeCanisterRanges} to decode them.
* @see https://internetcomputer.org/docs/references/ic-interface-spec#http-read-state
* @see https://internetcomputer.org/docs/references/ic-interface-spec#state-tree-canister-ranges
*/
function lookupCanisterRanges(params) {
	const { subnetId, tree, canisterId } = params;
	const canisterRangeShardsLookup = lookup_subtree(["canister_ranges", subnetId.toUint8Array()], tree);
	if (canisterRangeShardsLookup.status !== LookupSubtreeStatus.Found) return lookupCanisterRangesFallback(subnetId, tree);
	const canisterRangeShards = canisterRangeShardsLookup.value;
	const shardPaths = getCanisterRangeShardPaths(canisterRangeShards);
	if (shardPaths.length === 0) throw ProtocolError.fromCode(new CertificateNotAuthorizedErrorCode(canisterId, subnetId));
	shardPaths.sort(compare);
	const maxPotentialShard = shardPaths[getCanisterRangeShardPartitionPoint(shardPaths, canisterId)];
	return getCanisterRangeFromShards(maxPotentialShard, canisterRangeShards);
}
/**
* Lookup the canister ranges using the `/subnet/<subnet_id>/canister_ranges` path.
* Certificates returned by `/api/v3/canister/<effective_canister_id>/call`
* and `/api/v2/canister/<effective_canister_id>/read_state` use this path.
* @param subnetId the subnet ID to lookup the canister ranges for
* @param tree the tree to search
* @returns the encoded canister ranges. Use {@link decodeCanisterRanges} to decode them.
* @see https://internetcomputer.org/docs/references/ic-interface-spec#http-read-state
*/
function lookupCanisterRangesFallback(subnetId, tree) {
	const lookupResult = lookup_path([
		"subnet",
		subnetId.toUint8Array(),
		"canister_ranges"
	], tree);
	if (lookupResult.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode(`Could not find canister ranges for subnet ${subnetId.toText()}`, lookupResult.status));
	return lookupResult.value;
}
/**
* Decode canister ranges from CBOR-encoded buffer
* @param lookupValue the CBOR-encoded value read from the certificate
* @returns an array of canister range tuples [start, end]
*/
function decodeCanisterRanges(lookupValue) {
	return decode(lookupValue).map((v) => [Principal$1.fromUint8Array(v[0]), Principal$1.fromUint8Array(v[1])]);
}
function getCanisterRangeShardPaths(canisterRangeShards) {
	const shardPaths = [];
	for (const path of list_paths([], canisterRangeShards)) {
		const firstLabel = path[0];
		if (!firstLabel) throw ProtocolError.fromCode(new CertificateVerificationErrorCode("Path is invalid"));
		shardPaths.push(firstLabel);
	}
	return shardPaths;
}
/**
* Finds the partition point that divides shard paths into two groups based on canister ID comparison.
* Uses binary search to partition the array where:
* - Elements at indices [0, partitionPoint) have values >= canisterId
* - Elements at indices [partitionPoint, length) have values < canisterId
* @param shardPaths Sorted array of shard paths to search through
* @param canisterId The canister ID to compare against
* @returns The index of the first shard that is less than the canister ID, or last index if all shards are >= canisterId
*/
function getCanisterRangeShardPartitionPoint(shardPaths, canisterId) {
	const canisterIdBytes = canisterId.toUint8Array();
	let left = 0;
	let right = shardPaths.length - 1;
	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		if (compare(shardPaths[mid], canisterIdBytes) <= 0) right = mid;
		else left = mid + 1;
	}
	return left;
}
function getCanisterRangeFromShards(maxShardPath, canisterRangeShards) {
	const canisterRange = lookup_path([maxShardPath], canisterRangeShards);
	if (canisterRange.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode(`Could not find canister range for shard ${maxShardPath.toString()}`, canisterRange.status));
	return canisterRange.value;
}
/**
* Get the subnet ID from a certificate
* If the certificate has a delegation, it returns the subnet ID from the delegation.
* If the certificate has no delegation, it returns the root subnet ID.
* @param certificate the certificate to get the subnet ID from
* @param rootKey the root key to use to get the subnet ID
* @returns the subnet ID
*/
function getSubnetIdFromCertificate(certificate, rootKey) {
	if (certificate.delegation) return Principal$1.fromUint8Array(certificate.delegation.subnet_id);
	return Principal$1.selfAuthenticating(rootKey);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/readState.js
/**
* The root subnet ID for IC mainnet
*/
var IC_ROOT_SUBNET_ID = Principal$1.fromText("tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe");
/**
* Decode a value based on the specified strategy
* @param data the raw data to decode
* @param strategy the decode strategy to use
* @returns the decoded value
*/
function decodeValue(data, strategy) {
	switch (strategy) {
		case "raw": return data;
		case "leb128": return decodeLeb128(data);
		case "cbor": return decode(data);
		case "hex": return bytesToHex(data);
		case "utf-8": return new TextDecoder().decode(data);
	}
}
/**
* Decode controllers from CBOR-encoded buffer
* @param buf the CBOR-encoded buffer to decode
* @returns an array of principal IDs
*/
function decodeControllers(buf) {
	return decode(buf).map((buf) => {
		return Principal$1.fromUint8Array(buf);
	});
}
/**
* Encode a metadata path for canister metadata queries
* @param metaPath the metadata path (string or Uint8Array)
* @param canisterUint8Array the canister ID as Uint8Array
* @returns the encoded path
*/
function encodeMetadataPath(metaPath, canisterUint8Array) {
	const encoded = typeof metaPath === "string" ? utf8ToBytes(metaPath) : metaPath;
	return [
		utf8ToBytes("canister"),
		canisterUint8Array,
		utf8ToBytes("metadata"),
		encoded
	];
}
/**
* Check if a path object has custom path signature (has 'key' and 'path' properties)
* @param path the path to check
* @returns true if the path has custom path signature, false otherwise
*/
function isCustomPath(path) {
	return typeof path === "object" && path !== null && "key" in path && "path" in path;
}
/**
* Lookup node keys from a certificate for a given subnet
* This can be used for both canister and subnet status queries
* @param certificate the certificate to fetch node keys from
* @param subnetId the subnet ID to fetch node keys for
* @returns a map of node IDs to public keys
*/
function lookupNodeKeysFromCertificate(certificate, subnetId) {
	const subnetLookupResult = lookup_subtree([
		"subnet",
		subnetId.toUint8Array(),
		"node"
	], certificate.tree);
	if (subnetLookupResult.status !== LookupSubtreeStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode("Node not found", subnetLookupResult.status));
	if (subnetLookupResult.value instanceof Uint8Array) throw UnknownError.fromCode(new HashTreeDecodeErrorCode("Invalid node tree"));
	const nodeForks = flatten_forks(subnetLookupResult.value);
	const nodeKeys = /* @__PURE__ */ new Map();
	nodeForks.forEach((fork) => {
		const node_id = Principal$1.from(fork[1]).toText();
		const publicKeyLookupResult = lookup_path(["public_key"], fork[2]);
		if (publicKeyLookupResult.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode("Public key not found", publicKeyLookupResult.status));
		const derEncodedPublicKey = publicKeyLookupResult.value;
		if (derEncodedPublicKey.byteLength !== 44) throw ProtocolError.fromCode(new DerKeyLengthMismatchErrorCode(44, derEncodedPublicKey.byteLength));
		else nodeKeys.set(node_id, derEncodedPublicKey);
	});
	return nodeKeys;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/canisterStatus/index.js
/**
* Requests information from a canister's `read_state` endpoint.
* Can be used to request information about the canister's controllers, time, module hash, candid interface, and more.
*
* > [!WARNING]
* > Requesting the `subnet` path from the canister status might be deprecated in the future.
* > Use {@link https://js.icp.build/core/latest/libs/agent/api/namespaces/subnetstatus/functions/request | SubnetStatus.request} to fetch subnet information instead.
* @param {CanisterStatusOptions} options The configuration for the canister status request.
* @see {@link CanisterStatusOptions} for detailed options.
* @returns {Promise<StatusMap>} A map populated with data from the requested paths. Each path is a key in the map, and the value is the data obtained from the certificate for that path.
* @example
* const status = await canisterStatus({
*   paths: ['controllers', 'candid'],
*   ...options
* });
*
* const controllers = status.get('controllers');
*/
var request$1 = async (options) => {
	const { agent, paths, disableCertificateTimeVerification = false } = options;
	const canisterId = Principal$1.from(options.canisterId);
	const uniquePaths = [...new Set(paths)];
	const status = /* @__PURE__ */ new Map();
	const promises = uniquePaths.map((path, index) => {
		const encodedPath = encodePath$1(path, canisterId);
		return (async () => {
			try {
				if (agent.rootKey === null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
				const rootKey = agent.rootKey;
				const response = await agent.readState(canisterId, { paths: [encodedPath] });
				const certificate = await Certificate.create({
					certificate: response.certificate,
					rootKey,
					principal: { canisterId },
					disableTimeVerification: disableCertificateTimeVerification,
					agent
				});
				const lookup = (cert, path) => {
					if (path === "subnet") return {
						path,
						data: fetchNodeKeys(response.certificate, canisterId, rootKey)
					};
					return {
						path,
						data: lookupResultToBuffer(cert.lookup_path(encodedPath))
					};
				};
				const { path, data } = lookup(certificate, uniquePaths[index]);
				if (!data) {
					if (typeof path === "string") status.set(path, null);
					else status.set(path.key, null);
				} else switch (path) {
					case "time":
						status.set(path, decodeTime(data));
						break;
					case "controllers":
						status.set(path, decodeControllers(data));
						break;
					case "module_hash":
						status.set(path, bytesToHex(data));
						break;
					case "subnet":
						status.set(path, data);
						break;
					case "candid":
						status.set(path, new TextDecoder().decode(data));
						break;
					default: if (isCustomPath(path)) status.set(path.key, decodeValue(data, path.decodeStrategy));
				}
			} catch (error) {
				if (error instanceof AgentError && (error.hasCode(CertificateVerificationErrorCode) || error.hasCode(CertificateTimeErrorCode))) throw error;
				if (isCustomPath(path)) status.set(path.key, null);
				else status.set(path, null);
			}
		})();
	});
	await Promise.all(promises);
	return status;
};
/**
* Lookup node keys from a certificate for a given canister.
* The certificate is assumed to be already verified, including whether the canister is in range of the subnet.
* @param certificate the certificate to lookup node keys from
* @param canisterId the canister ID to lookup node keys for
* @param root_key the root key to use to lookup node keys
* @returns a map of node IDs to public keys
*/
var fetchNodeKeys = (certificate, canisterId, root_key) => {
	if (!canisterId._isPrincipal) throw InputError.fromCode(new UnexpectedErrorCode("Invalid canisterId"));
	const cert = decode(certificate);
	const { delegation } = cert;
	let subnetId;
	if (delegation && delegation.subnet_id) subnetId = Principal$1.fromUint8Array(new Uint8Array(delegation.subnet_id));
	else if (!delegation && typeof root_key !== "undefined") subnetId = Principal$1.selfAuthenticating(new Uint8Array(root_key));
	else subnetId = IC_ROOT_SUBNET_ID;
	const nodeKeys = lookupNodeKeysFromCertificate(cert, subnetId);
	return {
		subnetId: subnetId.toText(),
		nodeKeys
	};
};
var encodePath$1 = (path, canisterId) => {
	const canisterUint8Array = canisterId.toUint8Array();
	switch (path) {
		case "time": return [utf8ToBytes("time")];
		case "controllers": return [
			utf8ToBytes("canister"),
			canisterUint8Array,
			utf8ToBytes("controllers")
		];
		case "module_hash": return [
			utf8ToBytes("canister"),
			canisterUint8Array,
			utf8ToBytes("module_hash")
		];
		case "subnet": return [utf8ToBytes("subnet")];
		case "candid": return [
			utf8ToBytes("canister"),
			canisterUint8Array,
			utf8ToBytes("metadata"),
			utf8ToBytes("candid:service")
		];
		default: if (isCustomPath(path)) {
			if (typeof path["path"] === "string" || path["path"] instanceof Uint8Array) return encodeMetadataPath(path.path, canisterUint8Array);
			return path["path"];
		}
	}
	throw UnknownError.fromCode(new UnexpectedErrorCode(`Error while encoding your path for canister status. Please ensure that your path ${path} was formatted correctly.`));
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/subnetStatus/index.js
/**
* Requests information from a subnet's `read_state` endpoint.
* Can be used to request information about the subnet's time, canister ranges, public key, node keys, and metrics.
* @param {SubnetStatusOptions} options The configuration for the subnet status request.
* @see {@link SubnetStatusOptions} for detailed options.
* @returns {Promise<StatusMap>} A map populated with data from the requested paths. Each path is a key in the map, and the value is the data obtained from the certificate for that path.
* @example
* const status = await subnetStatus.request({
*   subnetId: IC_ROOT_SUBNET_ID,
*   paths: ['time', 'nodeKeys'],
*   agent,
* });
*
* const time = status.get('time');
* const nodeKeys = status.get('nodeKeys');
*/
async function request(options) {
	const { agent, paths, disableCertificateTimeVerification = false } = options;
	const subnetId = Principal$1.from(options.subnetId);
	const uniquePaths = [...new Set(paths)];
	const status = /* @__PURE__ */ new Map();
	const promises = uniquePaths.map((path, index) => {
		const encodedPath = encodePath(path, subnetId);
		return (async () => {
			try {
				if (agent.rootKey === null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
				const rootKey = agent.rootKey;
				const response = await agent.readSubnetState(subnetId, { paths: [encodedPath] });
				const certificate = await Certificate.create({
					certificate: response.certificate,
					rootKey,
					principal: { subnetId },
					disableTimeVerification: disableCertificateTimeVerification,
					agent
				});
				const lookup = (cert, lookupPath) => {
					if (lookupPath === "nodeKeys") return {
						path: lookupPath,
						data: lookupNodeKeysFromCertificate(cert.cert, subnetId)
					};
					return {
						path: lookupPath,
						data: lookupResultToBuffer(cert.lookup_path(encodedPath))
					};
				};
				const { path, data } = lookup(certificate, uniquePaths[index]);
				if (!data) {
					if (typeof path === "string") status.set(path, null);
					else status.set(path.key, null);
				} else switch (path) {
					case "time":
						status.set(path, decodeTime(data));
						break;
					case "canisterRanges":
						status.set(path, decodeCanisterRanges(data));
						break;
					case "publicKey":
						status.set(path, data);
						break;
					case "nodeKeys":
						status.set(path, data);
						break;
					default: if (isCustomPath(path)) status.set(path.key, decodeValue(data, path.decodeStrategy));
				}
			} catch (error) {
				if (error instanceof AgentError && (error.hasCode(CertificateVerificationErrorCode) || error.hasCode(CertificateTimeErrorCode))) throw error;
				if (isCustomPath(path)) status.set(path.key, null);
				else status.set(path, null);
			}
		})();
	});
	await Promise.all(promises);
	return status;
}
/**
* Encode a path for subnet state queries
* @param path the path to encode
* @param subnetId the subnet ID
* @returns the encoded path as an array of Uint8Arrays
*/
function encodePath(path, subnetId) {
	const subnetUint8Array = subnetId.toUint8Array();
	switch (path) {
		case "time": return [utf8ToBytes("time")];
		case "canisterRanges": return [utf8ToBytes("canister_ranges"), subnetUint8Array];
		case "publicKey": return [
			utf8ToBytes("subnet"),
			subnetUint8Array,
			utf8ToBytes("public_key")
		];
		case "nodeKeys": return [
			utf8ToBytes("subnet"),
			subnetUint8Array,
			utf8ToBytes("node")
		];
		default: if (isCustomPath(path)) {
			if (typeof path["path"] === "string" || path["path"] instanceof Uint8Array) {
				const encoded = typeof path["path"] === "string" ? utf8ToBytes(path["path"]) : path["path"];
				return [
					utf8ToBytes("subnet"),
					subnetUint8Array,
					encoded
				];
			}
			return path["path"];
		}
	}
	throw UnknownError.fromCode(new UnexpectedErrorCode(`Error while encoding your path for subnet status. Please ensure that your path ${path} was formatted correctly.`));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/certificateReject.js
/**
* Read certified reject details from a certificate at the given request status path.
* @param certificate The certificate to read reject details from.
* @param path The lookup path prefix (e.g. `['request_status', requestId]`).
* @param requestId The request ID associated with the rejection.
*/
function readCertifiedReject(certificate, path, requestId) {
	const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
	const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
	const errorCodeBuf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
	return new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/abstract/edwards.js
/**
* Twisted Edwards curve. The formula is: ax² + y² = 1 + dx²y².
* For design rationale of types / exports, see weierstrass module documentation.
* Untwisted Edwards curves exist, but they aren't used in real-world protocols.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$1 = BigInt(0);
var _1n$1 = BigInt(1);
var _2n$1 = BigInt(2);
var _8n$1 = BigInt(8);
function isEdValidXY(Fp, CURVE, x, y) {
	const x2 = Fp.sqr(x);
	const y2 = Fp.sqr(y);
	const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
	const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
	return Fp.eql(left, right);
}
function edwards(params, extraOpts = {}) {
	const validated = _createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor } = CURVE;
	_validateObject(extraOpts, {}, { uvRatio: "function" });
	const MASK = _2n$1 << BigInt(Fn.BYTES * 8) - _1n$1;
	const modP = (n) => Fp.create(n);
	const uvRatio = extraOpts.uvRatio || ((u, v) => {
		try {
			return {
				isValid: true,
				value: Fp.sqrt(Fp.div(u, v))
			};
		} catch (e) {
			return {
				isValid: false,
				value: _0n$1
			};
		}
	});
	if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	/**
	* Asserts coordinate is valid: 0 <= n < MASK.
	* Coordinates >= Fp.ORDER are allowed for zip215.
	*/
	function acoord(title, n, banZero = false) {
		const min = banZero ? _1n$1 : _0n$1;
		aInRange("coordinate " + title, n, min, MASK);
		return n;
	}
	function aextpoint(other) {
		if (!(other instanceof Point)) throw new Error("ExtendedPoint expected");
	}
	const toAffineMemo = memoized((p, iz) => {
		const { X, Y, Z } = p;
		const is0 = p.is0();
		if (iz == null) iz = is0 ? _8n$1 : Fp.inv(Z);
		const x = modP(X * iz);
		const y = modP(Y * iz);
		const zz = Fp.mul(Z, iz);
		if (is0) return {
			x: _0n$1,
			y: _1n$1
		};
		if (zz !== _1n$1) throw new Error("invZ was invalid");
		return {
			x,
			y
		};
	});
	const assertValidMemo = memoized((p) => {
		const { a, d } = CURVE;
		if (p.is0()) throw new Error("bad point: ZERO");
		const { X, Y, Z, T } = p;
		const X2 = modP(X * X);
		const Y2 = modP(Y * Y);
		const Z2 = modP(Z * Z);
		const Z4 = modP(Z2 * Z2);
		const aX2 = modP(X2 * a);
		if (modP(Z2 * modP(aX2 + Y2)) !== modP(Z4 + modP(d * modP(X2 * Y2)))) throw new Error("bad point: equation left != right (1)");
		if (modP(X * Y) !== modP(Z * T)) throw new Error("bad point: equation left != right (2)");
		return true;
	});
	class Point {
		constructor(X, Y, Z, T) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y);
			this.Z = acoord("z", Z, true);
			this.T = acoord("t", T);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		static fromAffine(p) {
			if (p instanceof Point) throw new Error("extended point not allowed");
			const { x, y } = p || {};
			acoord("x", x);
			acoord("y", y);
			return new Point(x, y, _1n$1, modP(x * y));
		}
		static fromBytes(bytes, zip215 = false) {
			const len = Fp.BYTES;
			const { a, d } = CURVE;
			bytes = copyBytes(_abytes2(bytes, len, "point"));
			_abool2(zip215, "zip215");
			const normed = copyBytes(bytes);
			const lastByte = bytes[len - 1];
			normed[len - 1] = lastByte & -129;
			const y = bytesToNumberLE(normed);
			aInRange("point.y", y, _0n$1, zip215 ? MASK : Fp.ORDER);
			const y2 = modP(y * y);
			const u = modP(y2 - _1n$1);
			const v = modP(d * y2 - a);
			let { isValid, value: x } = uvRatio(u, v);
			if (!isValid) throw new Error("bad point: invalid y coordinate");
			const isXOdd = (x & _1n$1) === _1n$1;
			const isLastByteOdd = (lastByte & 128) !== 0;
			if (!zip215 && x === _0n$1 && isLastByteOdd) throw new Error("bad point: x=0 and x_0=1");
			if (isLastByteOdd !== isXOdd) x = modP(-x);
			return Point.fromAffine({
				x,
				y
			});
		}
		static fromHex(bytes, zip215 = false) {
			return Point.fromBytes(ensureBytes("point", bytes), zip215);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(windowSize = 8, isLazy = true) {
			wnaf.createCache(this, windowSize);
			if (!isLazy) this.multiply(_2n$1);
			return this;
		}
		assertValidity() {
			assertValidMemo(this);
		}
		equals(other) {
			aextpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const X1Z2 = modP(X1 * Z2);
			const X2Z1 = modP(X2 * Z1);
			const Y1Z2 = modP(Y1 * Z2);
			const Y2Z1 = modP(Y2 * Z1);
			return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		negate() {
			return new Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
		}
		double() {
			const { a } = CURVE;
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const A = modP(X1 * X1);
			const B = modP(Y1 * Y1);
			const C = modP(_2n$1 * modP(Z1 * Z1));
			const D = modP(a * A);
			const x1y1 = X1 + Y1;
			const E = modP(modP(x1y1 * x1y1) - A - B);
			const G = D + B;
			const F = G - C;
			const H = D - B;
			const X3 = modP(E * F);
			const Y3 = modP(G * H);
			const T3 = modP(E * H);
			const Z3 = modP(F * G);
			return new Point(X3, Y3, Z3, T3);
		}
		add(other) {
			aextpoint(other);
			const { a, d } = CURVE;
			const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
			const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
			const A = modP(X1 * X2);
			const B = modP(Y1 * Y2);
			const C = modP(T1 * d * T2);
			const D = modP(Z1 * Z2);
			const E = modP((X1 + Y1) * (X2 + Y2) - A - B);
			const F = D - C;
			const G = D + C;
			const H = modP(B - a * A);
			const X3 = modP(E * F);
			const Y3 = modP(G * H);
			const T3 = modP(E * H);
			const Z3 = modP(F * G);
			return new Point(X3, Y3, Z3, T3);
		}
		subtract(other) {
			return this.add(other.negate());
		}
		multiply(scalar) {
			if (!Fn.isValidNot0(scalar)) throw new Error("invalid scalar: expected 1 <= sc < curve.n");
			const { p, f } = wnaf.cached(this, scalar, (p) => normalizeZ(Point, p));
			return normalizeZ(Point, [p, f])[0];
		}
		multiplyUnsafe(scalar, acc = Point.ZERO) {
			if (!Fn.isValid(scalar)) throw new Error("invalid scalar: expected 0 <= sc < curve.n");
			if (scalar === _0n$1) return Point.ZERO;
			if (this.is0() || scalar === _1n$1) return this;
			return wnaf.unsafe(this, scalar, (p) => normalizeZ(Point, p), acc);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(cofactor).is0();
		}
		isTorsionFree() {
			return wnaf.unsafe(this, CURVE.n).is0();
		}
		toAffine(invertedZ) {
			return toAffineMemo(this, invertedZ);
		}
		clearCofactor() {
			if (cofactor === _1n$1) return this;
			return this.multiplyUnsafe(cofactor);
		}
		toBytes() {
			const { x, y } = this.toAffine();
			const bytes = Fp.toBytes(y);
			bytes[bytes.length - 1] |= x & _1n$1 ? 128 : 0;
			return bytes;
		}
		toHex() {
			return bytesToHex(this.toBytes());
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
		get ex() {
			return this.X;
		}
		get ey() {
			return this.Y;
		}
		get ez() {
			return this.Z;
		}
		get et() {
			return this.T;
		}
		static normalizeZ(points) {
			return normalizeZ(Point, points);
		}
		static msm(points, scalars) {
			return pippenger(Point, Fn, points, scalars);
		}
		_setWindowSize(windowSize) {
			this.precompute(windowSize);
		}
		toRawBytes() {
			return this.toBytes();
		}
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n$1, modP(CURVE.Gx * CURVE.Gy));
	Point.ZERO = new Point(_0n$1, _1n$1, _1n$1, _0n$1);
	Point.Fp = Fp;
	Point.Fn = Fn;
	const wnaf = new wNAF(Point, Fn.BITS);
	Point.BASE.precompute(8);
	return Point;
}
/**
* Base class for prime-order points like Ristretto255 and Decaf448.
* These points eliminate cofactor issues by representing equivalence classes
* of Edwards curve points.
*/
var PrimeEdwardsPoint = class {
	constructor(ep) {
		this.ep = ep;
	}
	static fromBytes(_bytes) {
		notImplemented();
	}
	static fromHex(_hex) {
		notImplemented();
	}
	get x() {
		return this.toAffine().x;
	}
	get y() {
		return this.toAffine().y;
	}
	clearCofactor() {
		return this;
	}
	assertValidity() {
		this.ep.assertValidity();
	}
	toAffine(invertedZ) {
		return this.ep.toAffine(invertedZ);
	}
	toHex() {
		return bytesToHex(this.toBytes());
	}
	toString() {
		return this.toHex();
	}
	isTorsionFree() {
		return true;
	}
	isSmallOrder() {
		return false;
	}
	add(other) {
		this.assertSame(other);
		return this.init(this.ep.add(other.ep));
	}
	subtract(other) {
		this.assertSame(other);
		return this.init(this.ep.subtract(other.ep));
	}
	multiply(scalar) {
		return this.init(this.ep.multiply(scalar));
	}
	multiplyUnsafe(scalar) {
		return this.init(this.ep.multiplyUnsafe(scalar));
	}
	double() {
		return this.init(this.ep.double());
	}
	negate() {
		return this.init(this.ep.negate());
	}
	precompute(windowSize, isLazy) {
		return this.init(this.ep.precompute(windowSize, isLazy));
	}
	/** @deprecated use `toBytes` */
	toRawBytes() {
		return this.toBytes();
	}
};
/**
* Initializes EdDSA signatures over given Edwards curve.
*/
function eddsa(Point, cHash, eddsaOpts = {}) {
	if (typeof cHash !== "function") throw new Error("\"hash\" function param is required");
	_validateObject(eddsaOpts, {}, {
		adjustScalarBytes: "function",
		randomBytes: "function",
		domain: "function",
		prehash: "function",
		mapToCurve: "function"
	});
	const { prehash } = eddsaOpts;
	const { BASE, Fp, Fn } = Point;
	const randomBytes$1 = eddsaOpts.randomBytes || randomBytes;
	const adjustScalarBytes = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
	const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
		_abool2(phflag, "phflag");
		if (ctx.length || phflag) throw new Error("Contexts/pre-hash are not supported");
		return data;
	});
	function modN_LE(hash) {
		return Fn.create(bytesToNumberLE(hash));
	}
	function getPrivateScalar(key) {
		const len = lengths.secretKey;
		key = ensureBytes("private key", key, len);
		const hashed = ensureBytes("hashed private key", cHash(key), 2 * len);
		const head = adjustScalarBytes(hashed.slice(0, len));
		return {
			head,
			prefix: hashed.slice(len, 2 * len),
			scalar: modN_LE(head)
		};
	}
	/** Convenience method that creates public key from scalar. RFC8032 5.1.5 */
	function getExtendedPublicKey(secretKey) {
		const { head, prefix, scalar } = getPrivateScalar(secretKey);
		const point = BASE.multiply(scalar);
		return {
			head,
			prefix,
			scalar,
			point,
			pointBytes: point.toBytes()
		};
	}
	/** Calculates EdDSA pub key. RFC8032 5.1.5. */
	function getPublicKey(secretKey) {
		return getExtendedPublicKey(secretKey).pointBytes;
	}
	function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
		const msg = concatBytes(...msgs);
		return modN_LE(cHash(domain(msg, ensureBytes("context", context), !!prehash)));
	}
	/** Signs message with privateKey. RFC8032 5.1.6 */
	function sign(msg, secretKey, options = {}) {
		msg = ensureBytes("message", msg);
		if (prehash) msg = prehash(msg);
		const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
		const r = hashDomainToScalar(options.context, prefix, msg);
		const R = BASE.multiply(r).toBytes();
		const k = hashDomainToScalar(options.context, R, pointBytes, msg);
		const s = Fn.create(r + k * scalar);
		if (!Fn.isValid(s)) throw new Error("sign failed: invalid s");
		return _abytes2(concatBytes(R, Fn.toBytes(s)), lengths.signature, "result");
	}
	const verifyOpts = { zip215: true };
	/**
	* Verifies EdDSA signature against message and public key. RFC8032 5.1.7.
	* An extended group equation is checked.
	*/
	function verify(sig, msg, publicKey, options = verifyOpts) {
		const { context, zip215 } = options;
		const len = lengths.signature;
		sig = ensureBytes("signature", sig, len);
		msg = ensureBytes("message", msg);
		publicKey = ensureBytes("publicKey", publicKey, lengths.publicKey);
		if (zip215 !== void 0) _abool2(zip215, "zip215");
		if (prehash) msg = prehash(msg);
		const mid = len / 2;
		const r = sig.subarray(0, mid);
		const s = bytesToNumberLE(sig.subarray(mid, len));
		let A, R, SB;
		try {
			A = Point.fromBytes(publicKey, zip215);
			R = Point.fromBytes(r, zip215);
			SB = BASE.multiplyUnsafe(s);
		} catch (error) {
			return false;
		}
		if (!zip215 && A.isSmallOrder()) return false;
		const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
		return R.add(A.multiplyUnsafe(k)).subtract(SB).clearCofactor().is0();
	}
	const _size = Fp.BYTES;
	const lengths = {
		secretKey: _size,
		publicKey: _size,
		signature: 2 * _size,
		seed: _size
	};
	function randomSecretKey(seed = randomBytes$1(lengths.seed)) {
		return _abytes2(seed, lengths.seed, "seed");
	}
	function keygen(seed) {
		const secretKey = utils.randomSecretKey(seed);
		return {
			secretKey,
			publicKey: getPublicKey(secretKey)
		};
	}
	function isValidSecretKey(key) {
		return isBytes(key) && key.length === Fn.BYTES;
	}
	function isValidPublicKey(key, zip215) {
		try {
			return !!Point.fromBytes(key, zip215);
		} catch (error) {
			return false;
		}
	}
	const utils = {
		getExtendedPublicKey,
		randomSecretKey,
		isValidSecretKey,
		isValidPublicKey,
		/**
		* Converts ed public key to x public key. Uses formula:
		* - ed25519:
		*   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
		*   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
		* - ed448:
		*   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
		*   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
		*/
		toMontgomery(publicKey) {
			const { y } = Point.fromBytes(publicKey);
			const size = lengths.publicKey;
			const is25519 = size === 32;
			if (!is25519 && size !== 57) throw new Error("only defined for 25519 and 448");
			const u = is25519 ? Fp.div(_1n$1 + y, _1n$1 - y) : Fp.div(y - _1n$1, y + _1n$1);
			return Fp.toBytes(u);
		},
		toMontgomerySecret(secretKey) {
			const size = lengths.secretKey;
			_abytes2(secretKey, size);
			const hashed = cHash(secretKey.subarray(0, size));
			return adjustScalarBytes(hashed).subarray(0, size);
		},
		/** @deprecated */
		randomPrivateKey: randomSecretKey,
		/** @deprecated */
		precompute(windowSize = 8, point = Point.BASE) {
			return point.precompute(windowSize, false);
		}
	};
	return Object.freeze({
		keygen,
		getPublicKey,
		sign,
		verify,
		utils,
		Point,
		lengths
	});
}
function _eddsa_legacy_opts_to_new(c) {
	const CURVE = {
		a: c.a,
		d: c.d,
		p: c.Fp.ORDER,
		n: c.n,
		h: c.h,
		Gx: c.Gx,
		Gy: c.Gy
	};
	const curveOpts = {
		Fp: c.Fp,
		Fn: Field(CURVE.n, c.nBitLength, true),
		uvRatio: c.uvRatio
	};
	const eddsaOpts = {
		randomBytes: c.randomBytes,
		adjustScalarBytes: c.adjustScalarBytes,
		domain: c.domain,
		prehash: c.prehash,
		mapToCurve: c.mapToCurve
	};
	return {
		CURVE,
		curveOpts,
		hash: c.hash,
		eddsaOpts
	};
}
function _eddsa_new_output_to_legacy(c, eddsa) {
	const Point = eddsa.Point;
	return Object.assign({}, eddsa, {
		ExtendedPoint: Point,
		CURVE: c,
		nBitLength: Point.Fn.BITS,
		nByteLength: Point.Fn.BYTES
	});
}
function twistedEdwards(c) {
	const { CURVE, curveOpts, hash, eddsaOpts } = _eddsa_legacy_opts_to_new(c);
	return _eddsa_new_output_to_legacy(c, eddsa(edwards(CURVE, curveOpts), hash, eddsaOpts));
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@noble+curves@1.9.7/node_modules/@noble/curves/esm/ed25519.js
/**
* ed25519 Twisted Edwards curve with following addons:
* - X25519 ECDH
* - Ristretto cofactor elimination
* - Elligator hash-to-group / point indistinguishability
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _5n = BigInt(5);
var _8n = BigInt(8);
var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var ed25519_CURVE = /* @__PURE__ */ (() => ({
	p: ed25519_CURVE_p,
	n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
	h: _8n,
	a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
	d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
	Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
	Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x) {
	const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
	const P = ed25519_CURVE_p;
	const b2 = x * x % P * x % P;
	const b5 = pow2(pow2(b2, _2n, P) * b2 % P, _1n, P) * x % P;
	const b10 = pow2(b5, _5n, P) * b5 % P;
	const b20 = pow2(b10, _10n, P) * b10 % P;
	const b40 = pow2(b20, _20n, P) * b20 % P;
	const b80 = pow2(b40, _40n, P) * b40 % P;
	return {
		pow_p_5_8: pow2(pow2(pow2(pow2(b80, _80n, P) * b80 % P, _80n, P) * b80 % P, _10n, P) * b10 % P, _2n, P) * x % P,
		b2
	};
}
function adjustScalarBytes(bytes) {
	bytes[0] &= 248;
	bytes[31] &= 127;
	bytes[31] |= 64;
	return bytes;
}
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v) {
	const P = ed25519_CURVE_p;
	const v3 = mod(v * v * v, P);
	const pow = ed25519_pow_2_252_3(u * mod(v3 * v3 * v, P)).pow_p_5_8;
	let x = mod(u * v3 * pow, P);
	const vx2 = mod(v * x * x, P);
	const root1 = x;
	const root2 = mod(x * ED25519_SQRT_M1, P);
	const useRoot1 = vx2 === u;
	const useRoot2 = vx2 === mod(-u, P);
	const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
	if (useRoot1) x = root1;
	if (useRoot2 || noRoot) x = root2;
	if (isNegativeLE(x, P)) x = mod(-x, P);
	return {
		isValid: useRoot1 || useRoot2,
		value: x
	};
}
var Fp = /* @__PURE__ */ (() => Field(ed25519_CURVE.p, { isLE: true }))();
var Fn = /* @__PURE__ */ (() => Field(ed25519_CURVE.n, { isLE: true }))();
var ed25519Defaults = /* @__PURE__ */ (() => ({
	...ed25519_CURVE,
	Fp,
	hash: sha512,
	adjustScalarBytes,
	uvRatio
}))();
/**
* ed25519 curve with EdDSA signatures.
* @example
* import { ed25519 } from '@noble/curves/ed25519';
* const { secretKey, publicKey } = ed25519.keygen();
* const msg = new TextEncoder().encode('hello');
* const sig = ed25519.sign(msg, priv);
* ed25519.verify(sig, msg, pub); // Default mode: follows ZIP215
* ed25519.verify(sig, msg, pub, { zip215: false }); // RFC8032 / FIPS 186-5
*/
var ed25519 = /* @__PURE__ */ (() => twistedEdwards(ed25519Defaults))();
var SQRT_M1 = ED25519_SQRT_M1;
var SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235");
var INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578");
var ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838");
var D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952");
var invertSqrt = (number) => uvRatio(_1n, number);
var MAX_255B = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
var bytes255ToNumberLE = (bytes) => ed25519.Point.Fp.create(bytesToNumberLE(bytes) & MAX_255B);
/**
* Computes Elligator map for Ristretto255.
* Described in [RFC9380](https://www.rfc-editor.org/rfc/rfc9380#appendix-B) and on
* the [website](https://ristretto.group/formulas/elligator.html).
*/
function calcElligatorRistrettoMap(r0) {
	const { d } = ed25519_CURVE;
	const P = ed25519_CURVE_p;
	const mod = (n) => Fp.create(n);
	const r = mod(SQRT_M1 * r0 * r0);
	const Ns = mod((r + _1n) * ONE_MINUS_D_SQ);
	let c = BigInt(-1);
	const D = mod((c - d * r) * mod(r + d));
	let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D);
	let s_ = mod(s * r0);
	if (!isNegativeLE(s_, P)) s_ = mod(-s_);
	if (!Ns_D_is_sq) s = s_;
	if (!Ns_D_is_sq) c = r;
	const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D);
	const s2 = s * s;
	const W0 = mod((s + s) * D);
	const W1 = mod(Nt * SQRT_AD_MINUS_ONE);
	const W2 = mod(_1n - s2);
	const W3 = mod(_1n + s2);
	return new ed25519.Point(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
}
function ristretto255_map(bytes) {
	abytes(bytes, 64);
	const R1 = calcElligatorRistrettoMap(bytes255ToNumberLE(bytes.subarray(0, 32)));
	const R2 = calcElligatorRistrettoMap(bytes255ToNumberLE(bytes.subarray(32, 64)));
	return new _RistrettoPoint(R1.add(R2));
}
/**
* Wrapper over Edwards Point for ristretto255.
*
* Each ed25519/ExtendedPoint has 8 different equivalent points. This can be
* a source of bugs for protocols like ring signatures. Ristretto was created to solve this.
* Ristretto point operates in X:Y:Z:T extended coordinates like ExtendedPoint,
* but it should work in its own namespace: do not combine those two.
* See [RFC9496](https://www.rfc-editor.org/rfc/rfc9496).
*/
var _RistrettoPoint = class _RistrettoPoint extends PrimeEdwardsPoint {
	constructor(ep) {
		super(ep);
	}
	static fromAffine(ap) {
		return new _RistrettoPoint(ed25519.Point.fromAffine(ap));
	}
	assertSame(other) {
		if (!(other instanceof _RistrettoPoint)) throw new Error("RistrettoPoint expected");
	}
	init(ep) {
		return new _RistrettoPoint(ep);
	}
	/** @deprecated use `import { ristretto255_hasher } from '@noble/curves/ed25519.js';` */
	static hashToCurve(hex) {
		return ristretto255_map(ensureBytes("ristrettoHash", hex, 64));
	}
	static fromBytes(bytes) {
		abytes(bytes, 32);
		const { a, d } = ed25519_CURVE;
		const P = ed25519_CURVE_p;
		const mod = (n) => Fp.create(n);
		const s = bytes255ToNumberLE(bytes);
		if (!equalBytes(Fp.toBytes(s), bytes) || isNegativeLE(s, P)) throw new Error("invalid ristretto255 encoding 1");
		const s2 = mod(s * s);
		const u1 = mod(_1n + a * s2);
		const u2 = mod(_1n - a * s2);
		const u1_2 = mod(u1 * u1);
		const u2_2 = mod(u2 * u2);
		const v = mod(a * d * u1_2 - u2_2);
		const { isValid, value: I } = invertSqrt(mod(v * u2_2));
		const Dx = mod(I * u2);
		const Dy = mod(I * Dx * v);
		let x = mod((s + s) * Dx);
		if (isNegativeLE(x, P)) x = mod(-x);
		const y = mod(u1 * Dy);
		const t = mod(x * y);
		if (!isValid || isNegativeLE(t, P) || y === _0n) throw new Error("invalid ristretto255 encoding 2");
		return new _RistrettoPoint(new ed25519.Point(x, y, _1n, t));
	}
	/**
	* Converts ristretto-encoded string to ristretto point.
	* Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
	* @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
	*/
	static fromHex(hex) {
		return _RistrettoPoint.fromBytes(ensureBytes("ristrettoHex", hex, 32));
	}
	static msm(points, scalars) {
		return pippenger(_RistrettoPoint, ed25519.Point.Fn, points, scalars);
	}
	/**
	* Encodes ristretto point to Uint8Array.
	* Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
	*/
	toBytes() {
		let { X, Y, Z, T } = this.ep;
		const P = ed25519_CURVE_p;
		const mod = (n) => Fp.create(n);
		const u1 = mod(mod(Z + Y) * mod(Z - Y));
		const u2 = mod(X * Y);
		const { value: invsqrt } = invertSqrt(mod(u1 * mod(u2 * u2)));
		const D1 = mod(invsqrt * u1);
		const D2 = mod(invsqrt * u2);
		const zInv = mod(D1 * D2 * T);
		let D;
		if (isNegativeLE(T * zInv, P)) {
			let _x = mod(Y * SQRT_M1);
			let _y = mod(X * SQRT_M1);
			X = _x;
			Y = _y;
			D = mod(D1 * INVSQRT_A_MINUS_D);
		} else D = D2;
		if (isNegativeLE(X * zInv, P)) Y = mod(-Y);
		let s = mod((Z - Y) * D);
		if (isNegativeLE(s, P)) s = mod(-s);
		return Fp.toBytes(s);
	}
	/**
	* Compares two Ristretto points.
	* Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
	*/
	equals(other) {
		this.assertSame(other);
		const { X: X1, Y: Y1 } = this.ep;
		const { X: X2, Y: Y2 } = other.ep;
		const mod = (n) => Fp.create(n);
		const one = mod(X1 * Y2) === mod(Y1 * X2);
		const two = mod(Y1 * Y2) === mod(X1 * X2);
		return one || two;
	}
	is0() {
		return this.equals(_RistrettoPoint.ZERO);
	}
};
_RistrettoPoint.BASE = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.BASE))();
_RistrettoPoint.ZERO = /* @__PURE__ */ (() => new _RistrettoPoint(ed25519.Point.ZERO))();
_RistrettoPoint.Fp = /* @__PURE__ */ (() => Fp)();
_RistrettoPoint.Fn = /* @__PURE__ */ (() => Fn)();
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/expirableStore.js
/**
* Validates that expirationTime is a positive finite number.
* @param expirationTime - Time in milliseconds after which entries expire.
* @throws {Error} if expirationTime is not valid.
*/
function validateExpirationTime(expirationTime) {
	if (!Number.isFinite(expirationTime) || expirationTime <= 0) throw new Error(`expirationTime must be a positive finite number, got ${expirationTime}`);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/indexedDBExpirableStore.js
/**
* Key-value store backed by IndexedDB with time-based expiration.
* Enables sharing cached data across multiple instances and page reloads.
*/
var IndexedDBExpirableStore = class {
	#dbName;
	#storeName;
	#dbPromise = null;
	constructor(options) {
		if (typeof globalThis.indexedDB === "undefined") throw new Error("IndexedDBExpirableStore requires IndexedDB, which is not available in this environment");
		validateExpirationTime(options.expirationTime);
		this.#dbName = options.dbName;
		this.#storeName = options.storeName;
		this.expirationTime = options.expirationTime;
	}
	#getDb() {
		if (!this.#dbPromise) this.#dbPromise = this.#openDb().catch((error) => {
			this.#dbPromise = null;
			throw error;
		});
		return this.#dbPromise;
	}
	async #openDb() {
		const db = await this.#openRequest();
		if (db.objectStoreNames.contains(this.#storeName)) return db;
		const nextVersion = db.version + 1;
		db.close();
		return this.#openRequest(nextVersion);
	}
	#openRequest(version) {
		const storeName = this.#storeName;
		return new Promise((resolve, reject) => {
			const request = globalThis.indexedDB.open(this.#dbName, version);
			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: "key" });
			};
			request.onsuccess = () => {
				const db = request.result;
				db.onversionchange = () => {
					db.close();
					this.#dbPromise = null;
				};
				resolve(db);
			};
			request.onerror = () => reject(request.error);
		});
	}
	async get(key) {
		const db = await this.#getDb();
		return new Promise((resolve, reject) => {
			const request = db.transaction(this.#storeName, "readonly").objectStore(this.#storeName).get(key);
			request.onsuccess = () => {
				const record = request.result;
				if (!record) {
					resolve(void 0);
					return;
				}
				if (Date.now() - record.timestamp > this.expirationTime) {
					this.delete(key).then(() => resolve(void 0), () => resolve(void 0));
					return;
				}
				resolve(record.value);
			};
			request.onerror = () => reject(request.error);
		});
	}
	async set(key, value) {
		await this.#prune();
		const db = await this.#getDb();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.#storeName, "readwrite");
			const store = tx.objectStore(this.#storeName);
			const record = {
				key,
				value,
				timestamp: Date.now()
			};
			store.put(record);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}
	async delete(key) {
		const db = await this.#getDb();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.#storeName, "readwrite");
			tx.objectStore(this.#storeName).delete(key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}
	async #prune() {
		const db = await this.#getDb();
		const now = Date.now();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(this.#storeName, "readwrite");
			const request = tx.objectStore(this.#storeName).openCursor();
			request.onsuccess = () => {
				const cursor = request.result;
				if (!cursor) return;
				const record = cursor.value;
				if (now - record.timestamp > this.expirationTime) cursor.delete();
				cursor.continue();
			};
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/inMemoryExpirableStore.js
/**
* In-memory key-value store with timestamp-based expiration.
* Prunes all expired entries on every {@link set} call.
*/
var InMemoryExpirableStore = class {
	#entries;
	constructor(options) {
		validateExpirationTime(options.expirationTime);
		this.expirationTime = options.expirationTime;
		this.#entries = /* @__PURE__ */ new Map();
	}
	get(key) {
		const entry = this.#entries.get(key);
		if (!entry) return Promise.resolve(void 0);
		if (Date.now() - entry.timestamp > this.expirationTime) {
			this.#entries.delete(key);
			return Promise.resolve(void 0);
		}
		return Promise.resolve(entry.value);
	}
	set(key, value) {
		this.#prune();
		this.#entries.set(key, {
			value,
			timestamp: Date.now()
		});
		return Promise.resolve();
	}
	delete(key) {
		this.#entries.delete(key);
		return Promise.resolve();
	}
	#prune() {
		const now = Date.now();
		for (const [key, entry] of this.#entries) if (now - entry.timestamp > this.expirationTime) this.#entries.delete(key);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/utils/createExpirableStore.js
/**
* Creates an {@link ExpirableStore} with automatic runtime detection.
* Uses {@link IndexedDBExpirableStore} in browser environments (when IndexedDB is available),
* falls back to {@link InMemoryExpirableStore} otherwise.
* @param options - Configuration for the store (dbName, storeName, and expirationTime).
*/
function createExpirableStore(options) {
	if (typeof globalThis.indexedDB !== "undefined") return new IndexedDBExpirableStore(options);
	return new InMemoryExpirableStore({ expirationTime: options.expirationTime });
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/der.js
var encodeLenBytes = (len) => {
	if (len <= 127) return 1;
	if (len <= 255) return 2;
	if (len <= 65535) return 3;
	if (len <= 16777215) return 4;
	throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
};
var encodeLen = (buf, offset, len) => {
	if (len <= 127) {
		buf[offset] = len;
		return 1;
	}
	if (len <= 255) {
		buf[offset] = 129;
		buf[offset + 1] = len;
		return 2;
	}
	if (len <= 65535) {
		buf[offset] = 130;
		buf[offset + 1] = len >> 8;
		buf[offset + 2] = len;
		return 3;
	}
	if (len <= 16777215) {
		buf[offset] = 131;
		buf[offset + 1] = len >> 16;
		buf[offset + 2] = len >> 8;
		buf[offset + 3] = len;
		return 4;
	}
	throw InputError.fromCode(new DerEncodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLenBytes = (buf, offset) => {
	if (buf[offset] < 128) return 1;
	if (buf[offset] === 128) throw InputError.fromCode(new DerDecodeErrorCode("Invalid length 0"));
	if (buf[offset] === 129) return 2;
	if (buf[offset] === 130) return 3;
	if (buf[offset] === 131) return 4;
	throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
var decodeLen = (buf, offset) => {
	const lenBytes = decodeLenBytes(buf, offset);
	if (lenBytes === 1) return buf[offset];
	if (lenBytes === 2) return buf[offset + 1];
	if (lenBytes === 3) return (buf[offset + 1] << 8) + buf[offset + 2];
	if (lenBytes === 4) return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
	throw InputError.fromCode(new DerDecodeErrorCode("Length too long (> 4 bytes)"));
};
Uint8Array.from([
	...[48, 12],
	...[6, 10],
	...[
		43,
		6,
		1,
		4,
		1,
		131,
		184,
		67,
		1,
		1
	]
]);
/**
* A DER encoded `SEQUENCE(OID)` for the Ed25519 algorithm
*/
var ED25519_OID = Uint8Array.from([
	...[48, 5],
	...[6, 3],
	...[
		43,
		101,
		112
	]
]);
Uint8Array.from([
	...[48, 16],
	...[6, 7],
	...[
		42,
		134,
		72,
		206,
		61,
		2,
		1
	],
	...[6, 5],
	...[
		43,
		129,
		4,
		0,
		10
	]
]);
Uint8Array.from([
	...[48, 29],
	...[6, 13],
	...[
		43,
		6,
		1,
		4,
		1,
		130,
		220,
		124,
		5,
		3,
		1,
		2,
		1
	],
	...[6, 12],
	...[
		43,
		6,
		1,
		4,
		1,
		130,
		220,
		124,
		5,
		3,
		2,
		1
	]
]);
/**
* Wraps the given `payload` in a DER encoding tagged with the given encoded `oid` like so:
* `SEQUENCE(oid, BITSTRING(payload))`
* @param payload The payload to encode as the bit string
* @param oid The DER encoded (and SEQUENCE wrapped!) OID to tag the payload with
*/
function wrapDER(payload, oid) {
	const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
	const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
	let offset = 0;
	const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
	buf[offset++] = 48;
	offset += encodeLen(buf, offset, len);
	buf.set(oid, offset);
	offset += oid.byteLength;
	buf[offset++] = 3;
	offset += encodeLen(buf, offset, payload.byteLength + 1);
	buf[offset++] = 0;
	buf.set(new Uint8Array(payload), offset);
	return buf;
}
/**
* Extracts a payload from the given `derEncoded` data, and checks that it was tagged with the given `oid`.
*
* `derEncoded = SEQUENCE(oid, BITSTRING(payload))`
* @param derEncoded The DER encoded and tagged data
* @param oid The DER encoded (and SEQUENCE wrapped!) expected OID
* @returns The unwrapped payload
*/
var unwrapDER = (derEncoded, oid) => {
	let offset = 0;
	const expect = (n, msg) => {
		if (buf[offset++] !== n) throw InputError.fromCode(new DerDecodeErrorCode(`Expected ${msg} at offset ${offset}`));
	};
	const buf = new Uint8Array(derEncoded);
	expect(48, "sequence");
	offset += decodeLenBytes(buf, offset);
	if (!uint8Equals(buf.slice(offset, offset + oid.byteLength), oid)) throw InputError.fromCode(new DerDecodeErrorCode("Not the expected OID."));
	offset += oid.byteLength;
	expect(3, "bit string");
	const payloadLen = decodeLen(buf, offset) - 1;
	offset += decodeLenBytes(buf, offset);
	expect(0, "0 padding");
	const result = buf.slice(offset);
	if (payloadLen !== result.length) throw InputError.fromCode(new DerDecodeLengthMismatchErrorCode(payloadLen, result.length));
	return result;
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/public_key.js
var Ed25519PublicKey = class Ed25519PublicKey {
	static from(key) {
		return this.fromDer(key.toDer());
	}
	static fromRaw(rawKey) {
		return new Ed25519PublicKey(rawKey);
	}
	static fromDer(derKey) {
		return new Ed25519PublicKey(this.derDecode(derKey));
	}
	static {
		this.RAW_KEY_LENGTH = 32;
	}
	static derEncode(publicKey) {
		return wrapDER(publicKey, ED25519_OID);
	}
	static derDecode(key) {
		const unwrapped = unwrapDER(key, ED25519_OID);
		if (unwrapped.length !== this.RAW_KEY_LENGTH) throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
		return unwrapped;
	}
	#rawKey;
	get rawKey() {
		return this.#rawKey;
	}
	#derKey;
	get derKey() {
		return this.#derKey;
	}
	constructor(key) {
		if (key.byteLength !== Ed25519PublicKey.RAW_KEY_LENGTH) throw InputError.fromCode(new DerDecodeErrorCode("An Ed25519 public key must be exactly 32 bytes long"));
		this.#rawKey = key;
		this.#derKey = Ed25519PublicKey.derEncode(key);
	}
	toDer() {
		return this.derKey;
	}
	toRaw() {
		return this.rawKey;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/observable.js
var Observable = class {
	constructor() {
		this.observers = [];
	}
	subscribe(func) {
		this.observers.push(func);
	}
	unsubscribe(func) {
		this.observers = this.observers.filter((observer) => observer !== func);
	}
	notify(data, ...rest) {
		this.observers.forEach((observer) => observer(data, ...rest));
	}
};
var ObservableLog = class extends Observable {
	constructor() {
		super();
	}
	print(message, ...rest) {
		this.notify({
			message,
			level: "info"
		}, ...rest);
	}
	warn(message, ...rest) {
		this.notify({
			message,
			level: "warn"
		}, ...rest);
	}
	error(message, error, ...rest) {
		this.notify({
			message,
			level: "error",
			error
		}, ...rest);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/polling/backoff.js
var RANDOMIZATION_FACTOR = .5;
var MULTIPLIER = 1.5;
var INITIAL_INTERVAL_MSEC = 500;
var MAX_INTERVAL_MSEC = 6e4;
var MAX_ELAPSED_TIME_MSEC = 9e5;
var MAX_ITERATIONS = 10;
/**
* Exponential backoff strategy.
*/
var ExponentialBackoff = class ExponentialBackoff {
	#currentInterval;
	#randomizationFactor;
	#multiplier;
	#maxInterval;
	#startTime;
	#maxElapsedTime;
	#maxIterations;
	#date;
	#count = 0;
	static {
		this.default = {
			initialInterval: INITIAL_INTERVAL_MSEC,
			randomizationFactor: RANDOMIZATION_FACTOR,
			multiplier: MULTIPLIER,
			maxInterval: MAX_INTERVAL_MSEC,
			maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
			maxIterations: MAX_ITERATIONS,
			date: Date
		};
	}
	constructor(options = ExponentialBackoff.default) {
		const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date } = options;
		this.#currentInterval = initialInterval;
		this.#randomizationFactor = randomizationFactor;
		this.#multiplier = multiplier;
		this.#maxInterval = maxInterval;
		this.#date = date;
		this.#startTime = date.now();
		this.#maxElapsedTime = maxElapsedTime;
		this.#maxIterations = maxIterations;
	}
	get ellapsedTimeInMsec() {
		return this.#date.now() - this.#startTime;
	}
	get currentInterval() {
		return this.#currentInterval;
	}
	get count() {
		return this.#count;
	}
	get randomValueFromInterval() {
		const delta = this.#randomizationFactor * this.#currentInterval;
		const min = this.#currentInterval - delta;
		const max = this.#currentInterval + delta;
		return Math.random() * (max - min) + min;
	}
	incrementCurrentInterval() {
		this.#currentInterval = Math.min(this.#currentInterval * this.#multiplier, this.#maxInterval);
		this.#count++;
		return this.#currentInterval;
	}
	next() {
		if (this.ellapsedTimeInMsec >= this.#maxElapsedTime || this.#count >= this.#maxIterations) return null;
		this.incrementCurrentInterval();
		return this.randomValueFromInterval;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/polling/strategy.js
var FIVE_MINUTES_IN_MSEC = 3e5;
/**
* A best practices polling strategy: wait 2 seconds before the first poll, then 1 second
* with an exponential backoff factor of 1.2. Timeout after 5 minutes.
*
* Note that calling this function will create the strategy chain described above and already start the 5 minutes timeout.
* You should only call this function when you want to start the polling, and not before, to avoid exhausting the 5 minutes timeout in advance.
*/
function defaultStrategy() {
	return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
/**
* Predicate that returns true once.
*/
function once() {
	let first = true;
	return async () => {
		if (first) {
			first = false;
			return true;
		}
		return false;
	};
}
/**
* Delay the polling once.
* @param condition A predicate that indicates when to delay.
* @param timeInMsec The amount of time to delay.
*/
function conditionalDelay(condition, timeInMsec) {
	return async (canisterId, requestId, status) => {
		if (await condition(canisterId, requestId, status)) return new Promise((resolve) => setTimeout(resolve, timeInMsec));
	};
}
/**
* Reject a call after a certain amount of time.
* @param timeInMsec Time in milliseconds before the polling should be rejected.
*/
function timeout(timeInMsec) {
	const end = Date.now() + timeInMsec;
	return async (_canisterId, requestId, status) => {
		if (Date.now() > end) throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
	};
}
/**
* A strategy that throttle, but using an exponential backoff strategy.
* @param startingThrottleInMsec The throttle in milliseconds to start with.
* @param backoffFactor The factor to multiple the throttle time between every poll. For
*   example if using 2, the throttle will double between every run.
*/
function backoff(startingThrottleInMsec, backoffFactor) {
	let currentThrottling = startingThrottleInMsec;
	return () => new Promise((resolve) => setTimeout(() => {
		currentThrottling *= backoffFactor;
		resolve();
	}, currentThrottling));
}
/**
* Chain multiple polling strategy. This _chains_ the strategies, so if you pass in,
* say, two throttling strategy of 1 second, it will result in a throttle of 2 seconds.
* @param strategies A strategy list to chain.
*/
function chain(...strategies) {
	return async (canisterId, requestId, status) => {
		for (const a of strategies) await a(canisterId, requestId, status);
	};
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/polling/index.js
var DEFAULT_POLLING_OPTIONS = { preSignReadStateRequest: false };
/**
* Check if an object has a property
* @param value the object that might have the property
* @param property the key of property we're looking for
*/
function hasProperty(value, property) {
	return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
	return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
	return hasProperty(value, property) && typeof value[property] === "function";
}
/**
* Check if value is a signed read state request with expiry
* @param value to check
*/
function isSignedReadStateRequestWithExpiry(value) {
	return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
/**
* Polls the IC to check the status of the given request then
* returns the response bytes once the request has been processed.
* @param agent The agent to use to poll read_state.
* @param canisterId The effective canister ID.
* @param requestId The Request ID to poll status for.
* @param options polling options to control behavior
* @returns The certificate, reply bytes, and raw certificate bytes for the request.
* @throws {ExternalError} If the agent's root key is not available.
* @throws {RejectError} If the request was rejected by the canister.
* @throws {UnknownError} If the request reached `done` status without a reply.
*/
async function pollForResponse(agent, canisterId, requestId, options = {}) {
	const path = [utf8ToBytes("request_status"), requestId];
	let state;
	let currentRequest;
	if (options.preSignReadStateRequest ?? false) {
		currentRequest = await constructRequest({
			paths: [path],
			agent,
			pollingOptions: options
		});
		state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
	} else state = await agent.readState(canisterId, { paths: [path] });
	if (agent.rootKey == null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
	const cert = await Certificate.create({
		certificate: state.certificate,
		rootKey: agent.rootKey,
		principal: { canisterId },
		blsVerify: options.blsVerify,
		agent
	});
	const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
	let status;
	if (typeof maybeBuf === "undefined") status = RequestStatusResponseStatus.Unknown;
	else status = new TextDecoder().decode(maybeBuf);
	switch (status) {
		case RequestStatusResponseStatus.Replied: return {
			reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
			certificate: cert,
			rawCertificate: state.certificate
		};
		case RequestStatusResponseStatus.Received:
		case RequestStatusResponseStatus.Unknown:
		case RequestStatusResponseStatus.Processing: {
			const strategy = options.strategy ?? defaultStrategy();
			await strategy(canisterId, requestId, status);
			return pollForResponse(agent, canisterId, requestId, {
				...options,
				strategy,
				request: currentRequest
			});
		}
		case RequestStatusResponseStatus.Rejected: throw RejectError.fromCode(readCertifiedReject(cert, path, requestId));
		case RequestStatusResponseStatus.Done: throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
	}
	throw UNREACHABLE_ERROR;
}
/**
* Constructs a read state request for the given paths.
* If the request is already signed and has an expiry, it will be returned as is.
* Otherwise, a new request will be created.
* @param options The options to use for creating the request.
* @param options.paths The paths to read from.
* @param options.agent The agent to use to create the request.
* @param options.pollingOptions The options to use for creating the request.
* @returns The read state request.
*/
async function constructRequest(options) {
	const { paths, agent, pollingOptions } = options;
	if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) return pollingOptions.request;
	const request = await agent.createReadStateRequest?.({ paths }, void 0);
	if (!isSignedReadStateRequestWithExpiry(request)) throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
	return request;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/agent/http/index.js
var MINUTE_TO_MSECS = 6e4;
var MSECS_TO_NANOSECONDS = 1e6;
var DEFAULT_TIME_DIFF_MSECS = 0;
var IC_ROOT_KEY = "308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d9685f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484b01291091c5f87b98883463f98091a0baaae";
var IC0_DOMAIN = "ic0.app";
var IC0_SUB_DOMAIN = ".ic0.app";
var ICP0_DOMAIN = "icp0.io";
var ICP0_SUB_DOMAIN = ".icp0.io";
var ICP_API_DOMAIN = "icp-api.io";
var ICP_API_SUB_DOMAIN = ".icp-api.io";
var HTTP_STATUS_OK = 200;
var HTTP_STATUS_ACCEPTED = 202;
var HTTP_STATUS_NOT_FOUND = 404;
function determineHost(configuredHost) {
	let host;
	if (configuredHost !== void 0) {
		if (!configuredHost.match(/^[a-z]+:/) && typeof window !== "undefined") host = new URL(`${window.location.protocol}//${configuredHost}`);
		else host = new URL(configuredHost);
	} else {
		const knownHosts = [
			"ic0.app",
			"icp0.io",
			"127.0.0.1",
			"localhost"
		];
		const remoteHosts = [".github.dev", ".gitpod.io"];
		const location = typeof window !== "undefined" ? window.location : void 0;
		const hostname = location?.hostname;
		let knownHost;
		if (hostname && typeof hostname === "string") {
			if (remoteHosts.some((host) => hostname.endsWith(host))) knownHost = hostname;
			else knownHost = knownHosts.find((host) => hostname.endsWith(host));
		}
		if (location && knownHost) host = new URL(`${location.protocol}//${knownHost}${location.port ? `:${location.port}` : ""}`);
		else host = new URL("https://icp-api.io");
	}
	return host.toString();
}
/**
* A HTTP agent allows users to interact with a client of the internet computer
using the available methods. It exposes an API that closely follows the
public view of the internet computer, and is not intended to be exposed
directly to the majority of users due to its low-level interface.
* There is a pipeline to apply transformations to the request before sending
it to the client. This is to decouple signature, nonce generation and
other computations so that this class can stay as simple as possible while
allowing extensions.
*/
var HttpAgent = class HttpAgent {
	#rootKeyPromise;
	#shouldFetchRootKey;
	#timeDiffMsecs;
	#hasSyncedTime;
	#syncTimePromise;
	#shouldSyncTime;
	#identity;
	#fetch;
	#fetchOptions;
	#callOptions;
	#credentials;
	#retryTimes;
	#backoffStrategy;
	#maxIngressExpiryInMinutes;
	#subnetNodeKeyExpirableStore;
	get #maxIngressExpiryInMs() {
		return this.#maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
	}
	#queryPipeline;
	#updatePipeline;
	#subnetKeysFetching;
	#verifyQuerySignatures;
	/**
	* @param options - Options for the HttpAgent
	* @deprecated Use `HttpAgent.create` or `HttpAgent.createSync` instead
	*/
	constructor(options = {}) {
		this.#rootKeyPromise = null;
		this.#shouldFetchRootKey = false;
		this.#timeDiffMsecs = DEFAULT_TIME_DIFF_MSECS;
		this.#hasSyncedTime = false;
		this.#syncTimePromise = null;
		this.#shouldSyncTime = false;
		this._isAgent = true;
		this.config = {};
		this.log = new ObservableLog();
		this.#queryPipeline = [];
		this.#updatePipeline = [];
		this.#subnetKeysFetching = /* @__PURE__ */ new Map();
		this.#verifyQuerySignatures = true;
		/**
		* See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
		* @param queryResponse - The response from the query
		* @param subnetNodeKeys - The subnet node keys
		* @returns ApiQueryResponse
		*/
		this.#verifyQueryResponse = (queryResponse, subnetNodeKeys) => {
			if (this.#verifyQuerySignatures === false) return queryResponse;
			const { status, signatures = [], requestId } = queryResponse;
			const maxSignatures = subnetNodeKeys.size;
			if (signatures.length > maxSignatures) throw ProtocolError.fromCode(new ExcessiveSignaturesErrorCode(signatures.length, maxSignatures));
			for (const sig of signatures) {
				const { timestamp, identity } = sig;
				const nodeId = Principal$1.fromUint8Array(identity).toText();
				let hash;
				if (status === QueryResponseStatus.Replied) {
					const { reply } = queryResponse;
					hash = hashOfMap({
						status,
						reply,
						timestamp: BigInt(timestamp),
						request_id: requestId
					});
				} else if (status === QueryResponseStatus.Rejected) {
					const { reject_code, reject_message, error_code } = queryResponse;
					hash = hashOfMap({
						status,
						reject_code,
						reject_message,
						error_code,
						timestamp: BigInt(timestamp),
						request_id: requestId
					});
				} else throw UnknownError.fromCode(new UnexpectedErrorCode(`Unknown status: ${status}`));
				const separatorWithHash = concatBytes(IC_RESPONSE_DOMAIN_SEPARATOR, hash);
				const pubKey = subnetNodeKeys.get(nodeId);
				if (!pubKey) throw ProtocolError.fromCode(new MalformedPublicKeyErrorCode());
				const rawKey = Ed25519PublicKey.fromDer(pubKey).rawKey;
				if (!ed25519.verify(sig.signature, separatorWithHash, rawKey)) throw TrustError.fromCode(new QuerySignatureVerificationFailedErrorCode(nodeId));
			}
			return queryResponse;
		};
		this.config = options;
		if (options.fetch) this.#fetch = options.fetch;
		else {
			const globalFetch = globalThis.fetch;
			if (typeof globalFetch !== "function") throw InputError.fromCode(new MissingFetchErrorCode());
			this.#fetch = globalFetch.bind(globalThis);
		}
		this.#fetchOptions = options.fetchOptions;
		this.#callOptions = options.callOptions;
		this.#shouldFetchRootKey = options.shouldFetchRootKey ?? false;
		this.#shouldSyncTime = options.shouldSyncTime ?? false;
		if (options.rootKey) this.rootKey = options.rootKey;
		else if (this.#shouldFetchRootKey) this.rootKey = null;
		else this.rootKey = hexToBytes(IC_ROOT_KEY);
		const host = determineHost(options.host);
		this.host = new URL(host);
		if (this.host.hostname.endsWith(IC0_SUB_DOMAIN)) this.host.hostname = IC0_DOMAIN;
		else if (this.host.hostname.endsWith(ICP0_SUB_DOMAIN)) this.host.hostname = ICP0_DOMAIN;
		else if (this.host.hostname.endsWith(ICP_API_SUB_DOMAIN)) this.host.hostname = ICP_API_DOMAIN;
		if (options.verifyQuerySignatures !== void 0) this.#verifyQuerySignatures = options.verifyQuerySignatures;
		this.#subnetNodeKeyExpirableStore = options.subnetNodeKeyExpirableStore ?? createExpirableStore({
			dbName: `icp-sdk-${this.host.host}`,
			storeName: "subnetNodeKeys",
			expirationTime: 5 * MINUTE_TO_MSECS
		});
		this.#retryTimes = options.retryTimes ?? 3;
		const defaultBackoffFactory = () => new ExponentialBackoff({ maxIterations: this.#retryTimes });
		this.#backoffStrategy = options.backoffStrategy || defaultBackoffFactory;
		if (options.credentials) {
			const { name, password } = options.credentials;
			this.#credentials = `${name}${password ? `:${password}` : ""}`;
		}
		this.#identity = Promise.resolve(options.identity || new AnonymousIdentity());
		if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes > 5) throw InputError.fromCode(new IngressExpiryInvalidErrorCode("The maximum ingress expiry time is 5 minutes.", options.ingressExpiryInMinutes));
		if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes <= 0) throw InputError.fromCode(new IngressExpiryInvalidErrorCode("Ingress expiry time must be greater than 0.", options.ingressExpiryInMinutes));
		this.#maxIngressExpiryInMinutes = options.ingressExpiryInMinutes || 5;
		this.addTransform("update", makeNonceTransform(makeNonce));
		if (options.useQueryNonces) this.addTransform("query", makeNonceTransform(makeNonce));
		if (options.logToConsole) this.log.subscribe((log) => {
			if (log.level === "error") console.error(log.message);
			else if (log.level === "warn") console.warn(log.message);
			else console.log(log.message);
		});
	}
	static createSync(options = {}) {
		return new this({ ...options });
	}
	static async create(options = {}) {
		const agent = HttpAgent.createSync(options);
		await agent.#asyncGuard();
		return agent;
	}
	static async from(agent) {
		try {
			if ("config" in agent) return await HttpAgent.create(agent.config);
			return await HttpAgent.create({
				fetch: agent._fetch,
				fetchOptions: agent._fetchOptions,
				callOptions: agent._callOptions,
				host: agent._host.toString(),
				identity: agent._identity ?? void 0
			});
		} catch {
			throw InputError.fromCode(new CreateHttpAgentErrorCode());
		}
	}
	isLocal() {
		const hostname = this.host.hostname;
		return hostname === "127.0.0.1" || hostname.endsWith("127.0.0.1");
	}
	addTransform(type, fn, priority = fn.priority || 0) {
		if (type === "update") {
			const i = this.#updatePipeline.findIndex((x) => (x.priority || 0) < priority);
			this.#updatePipeline.splice(i >= 0 ? i : this.#updatePipeline.length, 0, Object.assign(fn, { priority }));
		} else if (type === "query") {
			const i = this.#queryPipeline.findIndex((x) => (x.priority || 0) < priority);
			this.#queryPipeline.splice(i >= 0 ? i : this.#queryPipeline.length, 0, Object.assign(fn, { priority }));
		}
	}
	async getPrincipal() {
		if (!this.#identity) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		return (await this.#identity).getPrincipal();
	}
	/**
	* Makes a call to a canister method.
	* @param canisterId - The ID of the canister to call. Can be a Principal or a string.
	* @param options - Options for the call.
	* @param identity - (Optional) The identity to use for the call. If not provided, the agent's current identity will be used.
	* @returns A promise that resolves to the response of the call, including the request ID and response details.
	*/
	async call(canisterId, options, identity) {
		const callSync = options.callSync ?? true;
		const id = await (identity ?? this.#identity);
		if (!id) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		const canister = Principal$1.from(canisterId);
		const ecid = options.effectiveCanisterId ? Principal$1.from(options.effectiveCanisterId) : canister;
		await this.#asyncGuard(ecid);
		const sender = id.getPrincipal();
		const ingress_expiry = calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs);
		const submit = {
			request_type: SubmitRequestType.Call,
			canister_id: canister,
			method_name: options.methodName,
			arg: options.arg,
			sender,
			ingress_expiry
		};
		let transformedRequest = await this._transform({
			request: {
				body: null,
				method: "POST",
				headers: {
					"Content-Type": "application/cbor",
					...this.#credentials ? { Authorization: `Basic ${btoa(this.#credentials)}` } : {}
				}
			},
			endpoint: Endpoint.Call,
			body: submit
		});
		let nonce;
		if (options?.nonce) nonce = toNonce(options.nonce);
		else if (transformedRequest.body.nonce) nonce = toNonce(transformedRequest.body.nonce);
		else nonce = void 0;
		submit.nonce = nonce;
		/**
		* Converts a Uint8Array to a Nonce type.
		* @param buf - The buffer to convert.
		* @returns The buffer as a Nonce.
		*/
		function toNonce(buf) {
			return Object.assign(buf, { __nonce__: void 0 });
		}
		transformedRequest = await id.transformRequest(transformedRequest);
		const requestId = requestIdOf(transformedRequest.body.content ?? submit);
		const body = encode(transformedRequest.body);
		const backoff = this.#backoffStrategy();
		try {
			const requestSync = () => {
				const url = new URL(`/api/v4/canister/${ecid.toText()}/call`, this.host);
				this.log.print(`fetching "${url.pathname}" with request:`, transformedRequest);
				return this.#fetch(url, {
					...this.#callOptions,
					...transformedRequest.request,
					body
				});
			};
			const requestAsync = () => {
				const url = new URL(`/api/v2/canister/${ecid.toText()}/call`, this.host);
				this.log.print(`fetching "${url.pathname}" with request:`, transformedRequest);
				return this.#fetch(url, {
					...this.#callOptions,
					...transformedRequest.request,
					body
				});
			};
			const requestFn = callSync ? requestSync : requestAsync;
			const { responseBodyBytes, ...response } = await this.#requestAndRetry({
				requestFn,
				backoff,
				tries: 0
			});
			const responseBody = responseBodyBytes.byteLength > 0 ? decode(responseBodyBytes) : null;
			return {
				requestId,
				response: {
					...response,
					body: responseBody
				},
				requestDetails: submit
			};
		} catch (error) {
			let callError;
			if (error instanceof AgentError) {
				if (error.hasCode(HttpV4ApiNotSupportedErrorCode)) {
					this.log.warn("v4 api not supported. Fall back to v2");
					return this.call(canisterId, {
						...options,
						callSync: false
					}, identity);
				}
				if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
					await this.syncTime(canister);
					return this.call(canister, options, identity);
				}
				error.code.requestContext = {
					requestId,
					senderPubKey: transformedRequest.body.sender_pubkey,
					senderSignature: transformedRequest.body.sender_sig,
					ingressExpiry: transformedRequest.body.content.ingress_expiry
				};
				callError = error;
			} else callError = UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error(`Error while making call: ${callError.message}`, callError);
			throw callError;
		}
	}
	/**
	* Executes an update call to a canister and returns the certified result.
	* @param canisterId The canister to call.
	* @param fields The call options (method name, arg, effective canister ID, optional nonce).
	* @param pollingOptions Optional polling configuration.
	* @returns The certified result including the certificate, reply bytes, and raw certificate bytes.
	*/
	async update(canisterId, fields, pollingOptions = {}) {
		const effectiveCanisterId = Principal$1.from(fields.effectiveCanisterId);
		const { requestId, response, requestDetails } = await this.call(canisterId, fields);
		const { body, ...httpDetails } = response;
		if (isV4ResponseBody(body)) return this.#handleV4SyncResponse(body, response, requestId, effectiveCanisterId, fields.methodName, httpDetails, requestDetails, pollingOptions, fields.onPollingStarted);
		if (isV2ResponseBody(body)) this.#handleV2Rejection(body, requestId, effectiveCanisterId, fields.methodName, httpDetails);
		if (response.status === HTTP_STATUS_ACCEPTED) {
			fields.onPollingStarted?.();
			return {
				...await pollForResponse(this, effectiveCanisterId, requestId, pollingOptions),
				requestDetails,
				callResponse: response
			};
		}
		const unexpectedErrorCode = new UnexpectedErrorCode(`Unexpected response from call: status ${response.status} with unrecognized body`);
		unexpectedErrorCode.callContext = {
			canisterId: effectiveCanisterId,
			methodName: fields.methodName,
			httpDetails
		};
		throw UnknownError.fromCode(unexpectedErrorCode);
	}
	async #handleV4SyncResponse(body, response, requestId, effectiveCanisterId, methodName, httpDetails, requestDetails, pollingOptions, onPollingStarted) {
		if (this.rootKey == null) throw ExternalError.fromCode(new MissingRootKeyErrorCode());
		const rawCertificate = body.certificate;
		const certificate = await Certificate.create({
			certificate: rawCertificate,
			rootKey: this.rootKey,
			principal: { canisterId: effectiveCanisterId },
			blsVerify: pollingOptions.blsVerify,
			agent: this
		});
		const path = [utf8ToBytes("request_status"), requestId];
		const maybeBuf = lookupResultToBuffer(certificate.lookup_path([...path, utf8ToBytes("status")]));
		const status = maybeBuf ? new TextDecoder().decode(maybeBuf) : void 0;
		switch (status) {
			case RequestStatusResponseStatus.Replied: return {
				reply: lookupResultToBuffer(certificate.lookup_path([...path, "reply"])),
				certificate,
				rawCertificate,
				requestDetails,
				callResponse: response
			};
			case RequestStatusResponseStatus.Rejected: {
				const error = readCertifiedReject(certificate, path, requestId);
				error.callContext = {
					canisterId: effectiveCanisterId,
					methodName,
					httpDetails
				};
				throw RejectError.fromCode(error);
			}
			case void 0:
				this.log.warn(`v4 sync response certificate does not contain request ID ${bytesToHex(requestId)} status. Falling back to polling.`);
				onPollingStarted?.();
				return {
					...await pollForResponse(this, effectiveCanisterId, requestId, pollingOptions),
					requestDetails,
					callResponse: response
				};
			default: {
				const errorCode = new UnexpectedV4StatusErrorCode(status, requestId, response, rawCertificate);
				errorCode.callContext = {
					canisterId: effectiveCanisterId,
					methodName,
					httpDetails
				};
				throw UnknownError.fromCode(errorCode);
			}
		}
	}
	#handleV2Rejection(body, requestId, effectiveCanisterId, methodName, httpDetails) {
		const { reject_code, reject_message, error_code } = body;
		const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
		errorCode.callContext = {
			canisterId: effectiveCanisterId,
			methodName,
			httpDetails
		};
		throw RejectError.fromCode(errorCode);
	}
	async #requestAndRetryQuery(args) {
		const { ecid, transformedRequest, body, requestId, backoff, tries } = args;
		const delay = tries === 0 ? 0 : backoff.next();
		const url = new URL(`/api/v3/canister/${ecid.toString()}/query`, this.host);
		this.log.print(`fetching "${url.pathname}" with tries:`, {
			tries,
			backoff,
			delay
		});
		if (delay === null) throw UnknownError.fromCode(new TimeoutWaitingForResponseErrorCode(`Backoff strategy exhausted after ${tries} attempts.`, requestId));
		if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
		let fetchResponse;
		try {
			this.log.print(`fetching "${url.pathname}" with request:`, transformedRequest);
			fetchResponse = await this.#fetch(url, {
				...this.#fetchOptions,
				...transformedRequest.request,
				body
			});
		} catch (error) {
			if (tries < this.#retryTimes) {
				this.log.warn(`Caught exception while attempting to make query:\n  ${error}\n  Retrying query.`);
				return await this.#requestAndRetryQuery({
					...args,
					tries: tries + 1
				});
			}
			throw TransportError.fromCode(new HttpFetchErrorCode(error));
		}
		const headers = httpHeadersTransform(fetchResponse.headers);
		if (fetchResponse.status !== HTTP_STATUS_OK) {
			const responseText = await fetchResponse.text();
			if (isIngressExpiryInvalidResponse(responseText)) throw InputError.fromCode(new IngressExpiryInvalidErrorCode(responseText, this.#maxIngressExpiryInMinutes));
			if (tries < this.#retryTimes) return await this.#requestAndRetryQuery({
				...args,
				tries: tries + 1
			});
			throw ProtocolError.fromCode(new HttpErrorCode(fetchResponse.status, fetchResponse.statusText, headers, responseText));
		}
		const response = {
			...decode(uint8FromBufLike(await fetchResponse.arrayBuffer())),
			httpDetails: {
				ok: fetchResponse.ok,
				status: fetchResponse.status,
				statusText: fetchResponse.statusText,
				headers
			},
			requestId
		};
		if (!this.#verifyQuerySignatures) return response;
		const signatureTimestampNs = response.signatures?.[0]?.timestamp;
		if (!signatureTimestampNs) throw ProtocolError.fromCode(new MalformedSignatureErrorCode("Timestamp not found in query response. This suggests a malformed or malicious response."));
		const signatureTimestampMs = Number(BigInt(signatureTimestampNs) / BigInt(MSECS_TO_NANOSECONDS));
		if (Date.now() + this.#timeDiffMsecs - signatureTimestampMs > this.#maxIngressExpiryInMs) {
			if (tries < this.#retryTimes) {
				this.log.warn("Timestamp is older than the max ingress expiry. Retrying query.", {
					requestId,
					signatureTimestampMs
				});
				await this.syncTime(ecid);
				return await this.#requestAndRetryQuery({
					...args,
					tries: tries + 1
				});
			}
			throw TrustError.fromCode(new CertificateOutdatedErrorCode(this.#maxIngressExpiryInMinutes, requestId, tries));
		}
		return response;
	}
	/**
	* Makes a request and retries if it fails.
	* @param args - The arguments for the request.
	* @param args.requestFn - A function that returns a Promise resolving to a Response.
	* @param args.backoff - The backoff strategy to use for retries.
	* @param args.tries - The number of retry attempts made so far.
	* @returns The response from the request, if the status is 200 or 202.
	* See the https://internetcomputer.org/docs/references/ic-interface-spec#http-interface for details on the response statuses.
	* @throws {ProtocolError} if the response status is not 200 or 202, and the retry limit has been reached.
	* @throws {TransportError} if the request fails, and the retry limit has been reached.
	*/
	async #requestAndRetry(args) {
		const { requestFn, backoff, tries } = args;
		const delay = tries === 0 ? 0 : backoff.next();
		if (delay === null) throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Retry strategy exhausted after ${tries} attempts.`));
		if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
		let response;
		let responseBodyBytes = /* @__PURE__ */ new Uint8Array();
		try {
			response = await requestFn();
			if (response.status === HTTP_STATUS_OK) responseBodyBytes = uint8FromBufLike(await response.clone().arrayBuffer());
		} catch (error) {
			if (tries < this.#retryTimes) {
				this.log.warn(`Caught exception while attempting to make request:\n  ${error}\n  Retrying request.`);
				return await this.#requestAndRetry({
					requestFn,
					backoff,
					tries: tries + 1
				});
			}
			throw TransportError.fromCode(new HttpFetchErrorCode(error));
		}
		const headers = httpHeadersTransform(response.headers);
		if (response.status === HTTP_STATUS_OK || response.status === HTTP_STATUS_ACCEPTED) return {
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			responseBodyBytes,
			headers
		};
		const responseText = await response.text();
		if (response.status === HTTP_STATUS_NOT_FOUND && response.url.includes("api/v4")) throw ProtocolError.fromCode(new HttpV4ApiNotSupportedErrorCode());
		if (isIngressExpiryInvalidResponse(responseText)) throw InputError.fromCode(new IngressExpiryInvalidErrorCode(responseText, this.#maxIngressExpiryInMinutes));
		if (tries < this.#retryTimes) return await this.#requestAndRetry({
			requestFn,
			backoff,
			tries: tries + 1
		});
		throw ProtocolError.fromCode(new HttpErrorCode(response.status, response.statusText, headers, responseText));
	}
	async query(canisterId, fields, identity) {
		const backoff = this.#backoffStrategy();
		const ecid = fields.effectiveCanisterId ? Principal$1.from(fields.effectiveCanisterId) : Principal$1.from(canisterId);
		await this.#asyncGuard(ecid);
		this.log.print(`ecid ${ecid.toString()}`);
		this.log.print(`canisterId ${canisterId.toString()}`);
		let transformedRequest;
		const id = await (identity ?? this.#identity);
		if (!id) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		const canister = Principal$1.from(canisterId);
		const sender = id.getPrincipal();
		const ingressExpiry = calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs);
		const request = {
			request_type: ReadRequestType.Query,
			canister_id: canister,
			method_name: fields.methodName,
			arg: fields.arg,
			sender,
			ingress_expiry: ingressExpiry
		};
		transformedRequest = await this._transform({
			request: {
				method: "POST",
				headers: {
					"Content-Type": "application/cbor",
					...this.#credentials ? { Authorization: `Basic ${btoa(this.#credentials)}` } : {}
				}
			},
			endpoint: Endpoint.Query,
			body: request
		});
		transformedRequest = await id.transformRequest(transformedRequest);
		const requestId = requestIdOf(transformedRequest.body.content ?? request);
		const body = encode(transformedRequest.body);
		const args = {
			canister: canister.toText(),
			ecid,
			transformedRequest,
			body,
			requestId,
			backoff,
			tries: 0
		};
		const makeQuery = async () => {
			const query = await this.#requestAndRetryQuery(args);
			return {
				requestDetails: request,
				...query
			};
		};
		try {
			if (!this.#verifyQuerySignatures) return await makeQuery();
			const [queryWithDetails, subnetNodeKeys] = await Promise.all([makeQuery(), this.fetchSubnetKeys(ecid)]);
			try {
				return this.#verifyQueryResponse(queryWithDetails, subnetNodeKeys);
			} catch {
				this.log.warn("Query response verification failed. Retrying with fresh subnet keys.");
				await this.#subnetNodeKeyExpirableStore.delete(ecid.toString());
				const updatedSubnetNodeKeys = await this.fetchSubnetKeys(ecid);
				return this.#verifyQueryResponse(queryWithDetails, updatedSubnetNodeKeys);
			}
		} catch (error) {
			let queryError;
			if (error instanceof AgentError) {
				if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
					await this.syncTime(ecid);
					return this.query(canisterId, fields, identity);
				}
				error.code.requestContext = {
					requestId,
					senderPubKey: transformedRequest.body.sender_pubkey,
					senderSignature: transformedRequest.body.sender_sig,
					ingressExpiry: transformedRequest.body.content.ingress_expiry
				};
				queryError = error;
			} else queryError = UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error(`Error while making query: ${queryError.message}`, queryError);
			throw queryError;
		}
	}
	/**
	* See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
	* @param queryResponse - The response from the query
	* @param subnetNodeKeys - The subnet node keys
	* @returns ApiQueryResponse
	*/
	#verifyQueryResponse;
	async createReadStateRequest(fields, identity) {
		await this.#asyncGuard();
		const id = await (identity ?? this.#identity);
		if (!id) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
		const sender = id.getPrincipal();
		const transformedRequest = await this._transform({
			request: {
				method: "POST",
				headers: {
					"Content-Type": "application/cbor",
					...this.#credentials ? { Authorization: `Basic ${btoa(this.#credentials)}` } : {}
				}
			},
			endpoint: Endpoint.ReadState,
			body: {
				request_type: ReadRequestType.ReadState,
				paths: fields.paths,
				sender,
				ingress_expiry: calculateIngressExpiry(this.#maxIngressExpiryInMinutes, this.#timeDiffMsecs)
			}
		});
		return id.transformRequest(transformedRequest);
	}
	async readState(canisterId, fields, _identity, request) {
		await this.#rootKeyGuard();
		const canister = Principal$1.from(canisterId);
		function getRequestId(options) {
			for (const path of options.paths) {
				const [pathName, value] = path;
				if (uint8Equals(pathName, new TextEncoder().encode("request_status"))) return value;
			}
		}
		let transformedRequest;
		let requestId;
		if (request) transformedRequest = request;
		else {
			requestId = getRequestId(fields);
			const identity = await this.#identity;
			if (!identity) throw ExternalError.fromCode(new IdentityInvalidErrorCode());
			transformedRequest = await this.createReadStateRequest(fields, identity);
		}
		const url = new URL(`/api/v3/canister/${canister.toString()}/read_state`, this.host);
		return await this.#readStateInner(url, { canisterId: canister }, transformedRequest, requestId);
	}
	/**
	* Reads the state of a subnet from the `/api/v3/subnet/{subnetId}/read_state` endpoint.
	* @param subnetId The ID of the subnet to read the state of. If you have a canister ID, you can use {@link HttpAgent.getSubnetIdFromCanister | getSubnetIdFromCanister} to get the subnet ID.
	* @param options The options for the read state request.
	* @returns The response from the read state request.
	*/
	async readSubnetState(subnetId, options) {
		await this.#rootKeyGuard();
		const subnet = Principal$1.from(subnetId);
		const url = new URL(`/api/v3/subnet/${subnet.toString()}/read_state`, this.host);
		const transformedRequest = await this.createReadStateRequest(options, this.#identity ?? void 0);
		return await this.#readStateInner(url, { subnetId: subnet }, transformedRequest);
	}
	async #readStateInner(url, principal, transformedRequest, requestId) {
		const backoff = this.#backoffStrategy();
		try {
			const { responseBodyBytes } = await this.#requestAndRetry({
				requestFn: () => this.#fetch(url, {
					...this.#fetchOptions,
					...transformedRequest.request,
					body: encode(transformedRequest.body)
				}),
				backoff,
				tries: 0
			});
			return decode(responseBodyBytes);
		} catch (error) {
			let readStateError;
			if (error instanceof AgentError) {
				if (error.hasCode(IngressExpiryInvalidErrorCode) && !this.#hasSyncedTime) {
					if ("canisterId" in principal) await this.syncTime(principal.canisterId);
					else if ("subnetId" in principal) await this.syncTimeWithSubnet(principal.subnetId);
					else throw UNREACHABLE_ERROR;
					return await this.#readStateInner(url, principal, transformedRequest, requestId);
				}
				error.code.requestContext = {
					requestId: requestId ?? requestIdOf(transformedRequest),
					senderPubKey: transformedRequest.body.sender_pubkey,
					senderSignature: transformedRequest.body.sender_sig,
					ingressExpiry: transformedRequest.body.content.ingress_expiry
				};
				readStateError = error;
			} else readStateError = UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error(`Error while making read state: ${readStateError.message}`, readStateError);
			throw readStateError;
		}
	}
	parseTimeFromResponse(response) {
		let tree;
		if (response.certificate) {
			const decoded = decode(response.certificate);
			if (decoded && "tree" in decoded) tree = decoded.tree;
			else throw ProtocolError.fromCode(new HashTreeDecodeErrorCode("Could not decode time from response"));
			const timeLookup = lookup_path(["time"], tree);
			if (timeLookup.status !== LookupPathStatus.Found) throw ProtocolError.fromCode(new LookupErrorCode("Time was not found in the response or was not in its expected format.", timeLookup.status));
			if (!(timeLookup.value instanceof Uint8Array) && !ArrayBuffer.isView(timeLookup)) throw ProtocolError.fromCode(new MalformedLookupFoundValueErrorCode("Time was not in its expected format."));
			const date = decodeTime(timeLookup.value);
			this.log.print("Time from response:", date);
			this.log.print("Time from response in milliseconds:", date.getTime());
			return date.getTime();
		}
		this.log.warn("No certificate found in response");
		return 0;
	}
	/**
	* Allows agent to sync its time with the network. Can be called during initialization or mid-lifecycle if the device's clock has drifted away from the network time. This is necessary to set the Expiry for a request
	* @param {Principal} canisterIdOverride - Pass a canister ID if you need to sync the time with a particular subnet. Uses the ICP ledger canister by default.
	*/
	async syncTime(canisterIdOverride) {
		this.#syncTimePromise = this.#syncTimePromise ?? (async () => {
			await this.#rootKeyGuard();
			const callTime = Date.now();
			try {
				if (!canisterIdOverride) this.log.print("Syncing time with the IC. No canisterId provided, so falling back to ryjl3-tyaaa-aaaaa-aaaba-cai");
				const canisterId = canisterIdOverride ?? Principal$1.from("ryjl3-tyaaa-aaaaa-aaaba-cai");
				const anonymousAgent = HttpAgent.createSync({
					identity: new AnonymousIdentity(),
					host: this.host.toString(),
					fetch: this.#fetch,
					retryTimes: 0,
					rootKey: this.rootKey ?? void 0,
					shouldSyncTime: false
				});
				const replicaTimes = await Promise.all(Array(3).fill(null).map(async () => {
					const date = (await request$1({
						canisterId,
						agent: anonymousAgent,
						paths: ["time"],
						disableCertificateTimeVerification: true
					})).get("time");
					if (date instanceof Date) return date.getTime();
				}, []));
				this.#setTimeDiffMsecs(callTime, replicaTimes);
			} catch (error) {
				const syncTimeError = error instanceof AgentError ? error : UnknownError.fromCode(new UnexpectedErrorCode(error));
				this.log.error("Caught exception while attempting to sync time", syncTimeError);
				throw syncTimeError;
			}
		})();
		await this.#syncTimePromise.finally(() => {
			this.#syncTimePromise = null;
		});
	}
	/**
	* Allows agent to sync its time with the network.
	* @param {Principal} subnetId - Pass the subnet ID you need to sync the time with.
	*/
	async syncTimeWithSubnet(subnetId) {
		await this.#rootKeyGuard();
		const callTime = Date.now();
		try {
			const anonymousAgent = HttpAgent.createSync({
				identity: new AnonymousIdentity(),
				host: this.host.toString(),
				fetch: this.#fetch,
				retryTimes: 0,
				rootKey: this.rootKey ?? void 0,
				shouldSyncTime: false
			});
			const replicaTimes = await Promise.all(Array(3).fill(null).map(async () => {
				const date = (await request({
					subnetId,
					agent: anonymousAgent,
					paths: ["time"],
					disableCertificateTimeVerification: true
				})).get("time");
				if (date instanceof Date) return date.getTime();
			}, []));
			this.#setTimeDiffMsecs(callTime, replicaTimes);
		} catch (error) {
			const syncTimeError = error instanceof AgentError ? error : UnknownError.fromCode(new UnexpectedErrorCode(error));
			this.log.error("Caught exception while attempting to sync time with subnet", syncTimeError);
			throw syncTimeError;
		}
	}
	#setTimeDiffMsecs(callTime, replicaTimes) {
		const maxReplicaTime = replicaTimes.reduce((max, current) => {
			return typeof current === "number" && current > max ? current : max;
		}, 0);
		if (maxReplicaTime > 0) {
			this.#timeDiffMsecs = maxReplicaTime - callTime;
			this.#hasSyncedTime = true;
			this.log.notify({
				message: `Syncing time: offset of ${this.#timeDiffMsecs}`,
				level: "info"
			});
		}
	}
	async status() {
		const headers = this.#credentials ? { Authorization: `Basic ${btoa(this.#credentials)}` } : {};
		const url = new URL(`/api/v2/status`, this.host);
		this.log.print(`fetching "${url.pathname}"`);
		const backoff = this.#backoffStrategy();
		const { responseBodyBytes } = await this.#requestAndRetry({
			backoff,
			requestFn: () => this.#fetch(url, {
				headers,
				...this.#fetchOptions
			}),
			tries: 0
		});
		return decode(responseBodyBytes);
	}
	async fetchRootKey() {
		this.#rootKeyPromise = this.#rootKeyPromise ?? (async () => {
			const value = await this.status();
			this.rootKey = value.root_key;
			return this.rootKey;
		})();
		return await this.#rootKeyPromise.finally(() => {
			this.#rootKeyPromise = null;
		});
	}
	async #asyncGuard(canisterIdOverride) {
		await Promise.all([this.#rootKeyGuard(), this.#syncTimeGuard(canisterIdOverride)]);
	}
	async #rootKeyGuard() {
		if (this.rootKey) return;
		if (this.rootKey === null && this.host.toString() !== "https://icp-api.io" && this.#shouldFetchRootKey) await this.fetchRootKey();
		else throw ExternalError.fromCode(new MissingRootKeyErrorCode(this.#shouldFetchRootKey));
	}
	async #syncTimeGuard(canisterIdOverride) {
		if (this.#shouldSyncTime && !this.hasSyncedTime()) await this.syncTime(canisterIdOverride);
	}
	invalidateIdentity() {
		this.#identity = null;
	}
	replaceIdentity(identity) {
		this.#identity = Promise.resolve(identity);
	}
	async fetchSubnetKeys(canisterId) {
		const effectiveCanisterId = Principal$1.from(canisterId);
		const cached = await this.#subnetNodeKeyExpirableStore.get(effectiveCanisterId.toText());
		if (cached) return cached;
		const inflight = this.#subnetKeysFetching.get(effectiveCanisterId.toText());
		if (inflight) return inflight;
		const fetchPromise = this.#doFetchSubnetKeys(effectiveCanisterId).finally(() => {
			this.#subnetKeysFetching.delete(effectiveCanisterId.toText());
		});
		this.#subnetKeysFetching.set(effectiveCanisterId.toText(), fetchPromise);
		return fetchPromise;
	}
	async #doFetchSubnetKeys(effectiveCanisterId) {
		await this.#asyncGuard(effectiveCanisterId);
		const rootKey = this.rootKey;
		const canisterReadState = await this.readState(effectiveCanisterId, { paths: [[utf8ToBytes("subnet")]] });
		const canisterCertificate = await Certificate.create({
			certificate: canisterReadState.certificate,
			rootKey,
			principal: { canisterId: effectiveCanisterId },
			agent: this
		});
		if (!canisterCertificate.cert.delegation) {
			const subnetId = Principal$1.selfAuthenticating(rootKey);
			if (!check_canister_ranges({
				canisterId: effectiveCanisterId,
				subnetId,
				tree: canisterCertificate.cert.tree
			})) throw TrustError.fromCode(new CertificateNotAuthorizedErrorCode(effectiveCanisterId, subnetId));
		}
		const subnetId = getSubnetIdFromCertificate(canisterCertificate.cert, rootKey);
		const nodeKeys = lookupNodeKeysFromCertificate(canisterCertificate.cert, subnetId);
		await this.#subnetNodeKeyExpirableStore.set(effectiveCanisterId.toText(), nodeKeys);
		return nodeKeys;
	}
	/**
	* Returns the subnet ID for a given canister ID, by looking at the certificate delegation
	* returned by the canister's state obtained by requesting the `/time` path with {@link HttpAgent.readState | readState}.
	* @param canisterId The canister ID to get the subnet ID for.
	* @returns The subnet ID for the given canister ID.
	*/
	async getSubnetIdFromCanister(canisterId) {
		const effectiveCanisterId = Principal$1.from(canisterId);
		await this.#asyncGuard(effectiveCanisterId);
		const canisterReadState = await this.readState(effectiveCanisterId, { paths: [[utf8ToBytes("time")]] });
		return getSubnetIdFromCertificate((await Certificate.create({
			certificate: canisterReadState.certificate,
			rootKey: this.rootKey,
			principal: { canisterId: effectiveCanisterId },
			agent: this
		})).cert, this.rootKey);
	}
	_transform(request) {
		let p = Promise.resolve(request);
		if (request.endpoint === Endpoint.Call) for (const fn of this.#updatePipeline) p = p.then((r) => fn(r).then((r2) => r2 || r));
		else for (const fn of this.#queryPipeline) p = p.then((r) => fn(r).then((r2) => r2 || r));
		return p;
	}
	/**
	* Returns the time difference in milliseconds between the IC network clock and the client's clock,
	* after the clock has been synced.
	*
	* If the time has not been synced, returns `0`.
	*/
	getTimeDiffMsecs() {
		return this.#timeDiffMsecs;
	}
	/**
	* Returns `true` if the time has been synced at least once with the IC network, `false` otherwise.
	*/
	hasSyncedTime() {
		return this.#hasSyncedTime;
	}
};
/**
* Calculates the ingress expiry time based on the maximum allowed expiry in minutes and the time difference in milliseconds.
* The expiry is rounded down according to the {@link Expiry.fromDeltaInMilliseconds} method.
* @param maxIngressExpiryInMinutes - The maximum ingress expiry time in minutes.
* @param timeDiffMsecs - The time difference in milliseconds to adjust the expiry.
* @returns The calculated ingress expiry as an Expiry object.
*/
function calculateIngressExpiry(maxIngressExpiryInMinutes, timeDiffMsecs) {
	const ingressExpiryMs = maxIngressExpiryInMinutes * MINUTE_TO_MSECS;
	return Expiry.fromDeltaInMilliseconds(ingressExpiryMs, timeDiffMsecs);
}
/**
* Checks if the response text is an ingress expiry invalid response.
* @see https://github.com/dfinity/ic/blob/23d5990bfc5277c32e54f0087b5a38fa412171e1/rs/validator/src/ingress_validation.rs#L233
* @param responseText The response body as string.
* @returns `true` if the response text is an ingress expiry invalid response, `false` otherwise.
*/
function isIngressExpiryInvalidResponse(responseText) {
	return responseText.includes("Invalid request expiry: ");
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@icp-sdk+core@5.4.0/node_modules/@icp-sdk/core/lib/esm/agent/actor.js
var metadataSymbol = Symbol.for("ic-agent-metadata");
/**
* An actor base class. An actor is an object containing only functions that will
* return a promise. These functions are derived from the IDL definition.
*/
var Actor = class {
	/**
	* Get the Agent class this Actor would call, or undefined if the Actor would use
	* the default agent (global.ic.agent).
	* @param actor The actor to get the agent of.
	*/
	static agentOf(actor) {
		return actor[metadataSymbol].config.agent;
	}
	/**
	* Get the interface of an actor, in the form of an instance of a Service.
	* @param actor The actor to get the interface of.
	*/
	static interfaceOf(actor) {
		return actor[metadataSymbol].service;
	}
	static canisterIdOf(actor) {
		return Principal$1.from(actor[metadataSymbol].config.canisterId);
	}
	static createActorClass(interfaceFactory, options) {
		const service = interfaceFactory({ IDL: idl_exports });
		class CanisterActor extends Actor {
			constructor(config) {
				if (!config.canisterId) throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
				const canisterId = typeof config.canisterId === "string" ? Principal$1.fromText(config.canisterId) : config.canisterId;
				super({
					config: {
						...DEFAULT_ACTOR_CONFIG,
						...config,
						canisterId
					},
					service
				});
				for (const [methodName, func] of service._fields) {
					if (options?.httpDetails) func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
					if (options?.certificate) func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
					this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
				}
			}
		}
		return CanisterActor;
	}
	/**
	* Creates an actor with the given interface factory and configuration.
	*
	* The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
	* @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
	* @param configuration - the configuration for the actor
	* @returns an actor with the given interface factory and configuration
	* @see The {@link https://js.icp.build/core/latest/canister-environment/ | Canister Environment Guide} for more details on how to configure an actor using the canister environment.
	* @example
	* Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
	* ```ts
	* import { Actor, HttpAgent } from '@icp-sdk/core/agent';
	* import { Principal } from '@icp-sdk/core/principal';
	* import { idlFactory } from './api/declarations/hello-world.did';
	*
	* // For a convenient way to get the canister ID,
	* // see the https://js.icp.build/core/latest/canister-environment/ guide.
	* const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
	*
	* const agent = await HttpAgent.create({
	*   host: 'https://icp-api.io',
	* });
	*
	* const actor = Actor.createActor(idlFactory, {
	*   agent,
	*   canisterId,
	* });
	*
	* const response = await actor.greet('world');
	* console.log(response);
	* ```
	* @example
	* Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
	* ```ts
	* import { HttpAgent } from '@icp-sdk/core/agent';
	* import { Principal } from '@icp-sdk/core/principal';
	* import { createActor } from './api/hello-world';
	*
	* // For a convenient way to get the canister ID,
	* // see the https://js.icp.build/core/latest/canister-environment/ guide.
	* const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
	*
	* const agent = await HttpAgent.create({
	*   host: 'https://icp-api.io',
	* });
	*
	* const actor = createActor(canisterId, {
	*   agent,
	* });
	*
	* const response = await actor.greet('world');
	* console.log(response);
	* ```
	*/
	static createActor(interfaceFactory, configuration) {
		if (!configuration.canisterId) throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
		return new (this.createActorClass(interfaceFactory))(configuration);
	}
	/**
	* Returns an actor with methods that return the http response details along with the result
	* @param interfaceFactory - the interface factory for the actor
	* @param configuration - the configuration for the actor
	* @deprecated - use createActor with actorClassOptions instead
	*/
	static createActorWithHttpDetails(interfaceFactory, configuration) {
		return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
	}
	/**
	* Returns an actor with methods that return the http response details along with the result
	* @param interfaceFactory - the interface factory for the actor
	* @param configuration - the configuration for the actor
	* @param actorClassOptions - options for the actor class extended details to return with the result
	*/
	static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
		httpDetails: true,
		certificate: true
	}) {
		return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
	}
	constructor(metadata) {
		this[metadataSymbol] = Object.freeze(metadata);
	}
};
function decodeReturnValue(types, msg) {
	const returnValues = decode$1(types, msg);
	switch (returnValues.length) {
		case 0: return;
		case 1: return returnValues[0];
		default: return returnValues;
	}
}
var DEFAULT_ACTOR_CONFIG = {
	pollingOptions: DEFAULT_POLLING_OPTIONS,
	queryStrategy: "query"
};
var ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
var ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
	let caller;
	const isQueryAnnotated = func.annotations.includes("query") || func.annotations.includes("composite_query");
	const queryStrategy = actor[metadataSymbol].config.queryStrategy;
	if (isQueryAnnotated && queryStrategy === "query") caller = async (options, ...args) => {
		options = {
			...options,
			...actor[metadataSymbol].config.queryTransform?.(methodName, args, {
				...actor[metadataSymbol].config,
				...options
			})
		};
		const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
		const cid = Principal$1.from(options.canisterId || actor[metadataSymbol].config.canisterId);
		const arg = encode$1(func.argTypes, args);
		const result = await agent.query(cid, {
			methodName,
			arg,
			effectiveCanisterId: options.effectiveCanisterId
		});
		const httpDetails = {
			...result.httpDetails,
			requestDetails: result.requestDetails
		};
		switch (result.status) {
			case QueryResponseStatus.Rejected: {
				const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
				uncertifiedRejectErrorCode.callContext = {
					canisterId: cid,
					methodName,
					httpDetails
				};
				throw RejectError.fromCode(uncertifiedRejectErrorCode);
			}
			case QueryResponseStatus.Replied: return func.annotations.includes("http-details") ? {
				httpDetails,
				result: decodeReturnValue(func.retTypes, result.reply.arg)
			} : decodeReturnValue(func.retTypes, result.reply.arg);
		}
	};
	else caller = async (options, ...args) => {
		options = {
			...options,
			...actor[metadataSymbol].config.callTransform?.(methodName, args, {
				...actor[metadataSymbol].config,
				...options
			})
		};
		const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
		const { canisterId, effectiveCanisterId, pollingOptions } = {
			...DEFAULT_ACTOR_CONFIG,
			...actor[metadataSymbol].config,
			...options
		};
		const cid = Principal$1.from(canisterId);
		const ecid = effectiveCanisterId !== void 0 ? Principal$1.from(effectiveCanisterId) : cid;
		const arg = encode$1(func.argTypes, args);
		let reply;
		let certificate;
		let callResponse;
		let requestDetails;
		try {
			({reply, certificate, callResponse, requestDetails} = await agent.update(cid, {
				methodName,
				arg,
				effectiveCanisterId: ecid,
				nonce: options.nonce
			}, {
				...pollingOptions,
				blsVerify
			}));
		} catch (e) {
			if (e instanceof RejectError) {
				const enrichedCode = Object.create(Object.getPrototypeOf(e.code), Object.getOwnPropertyDescriptors(e.code));
				enrichedCode.callContext = {
					...e.code.callContext,
					canisterId: cid,
					methodName
				};
				throw RejectError.fromCode(enrichedCode);
			}
			throw e;
		}
		const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
		const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
		const httpDetails = {
			...callResponse,
			requestDetails
		};
		if (shouldIncludeHttpDetails && shouldIncludeCertificate) return {
			httpDetails,
			certificate,
			result: decodeReturnValue(func.retTypes, reply)
		};
		if (shouldIncludeCertificate) return {
			certificate,
			result: decodeReturnValue(func.retTypes, reply)
		};
		if (shouldIncludeHttpDetails) return {
			httpDetails,
			result: decodeReturnValue(func.retTypes, reply)
		};
		return decodeReturnValue(func.retTypes, reply);
	};
	const handler = (...args) => caller({}, ...args);
	handler.withOptions = (options) => (...args) => caller(options, ...args);
	return handler;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/object-storage/dist/formatBlobContentDisposition.js
/** Value for the `Content-Disposition` blob-tree header (gateway-persisted metadata). */
function formatBlobContentDisposition(filename) {
	const trimmed = filename?.trim();
	if (!trimmed) return;
	if (/^[A-Za-z0-9._-]+$/.test(trimmed)) return `attachment; filename=${trimmed}`;
	if (/[^\x20-\x7E]/.test(trimmed)) return `attachment; filename*=UTF-8''${encodeURIComponent(trimmed)}`;
	return `attachment; filename="${trimmed.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/object-storage/dist/formatCertificateRejectionError.js
var CERTIFICATE_METHOD = "_immutableObjectStorageCreateCertificate";
/**
* Build an Error for a certified IC call rejection of
* `_immutableObjectStorageCreateCertificate`.
*
* Per the IC interface spec, reject_code is protocol-fixed:
* - DESTINATION_INVALID (3): invalid destination (missing canister/method)
* - CANISTER_REJECT (4): explicit canister reject
* - CANISTER_ERROR (5): trap / canister error
*
* Missing update methods surface as DESTINATION_INVALID with a message like
* `Canister has no update method '...'.` (see execution-errors "Method not found").
*/
function formatCertificateRejectionError(options) {
	const { rejectCode, rejectMessage, errorCode } = options;
	if (rejectCode === ReplicaRejectCode.DestinationInvalid && typeof rejectMessage === "string" && /has no update method/i.test(rejectMessage)) return /* @__PURE__ */ new Error(`method not found on backend canister; install the caffeineai-object-storage mops package`);
	const details = [
		rejectCode !== void 0 ? `reject_code=${rejectCode}` : void 0,
		rejectMessage ? `reject_message=${rejectMessage}` : void 0,
		errorCode ? `error_code=${errorCode}` : void 0
	].filter((part) => part !== void 0).join(", ");
	return /* @__PURE__ */ new Error(details.length > 0 ? `backend canister rejected ${CERTIFICATE_METHOD} (${details})` : `backend canister rejected ${CERTIFICATE_METHOD}`);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@borewit+text-codec@0.2.2/node_modules/@borewit/text-codec/lib/index.js
var WINDOWS_1252_EXTRA = {
	128: "€",
	130: "‚",
	131: "ƒ",
	132: "„",
	133: "…",
	134: "†",
	135: "‡",
	136: "ˆ",
	137: "‰",
	138: "Š",
	139: "‹",
	140: "Œ",
	142: "Ž",
	145: "‘",
	146: "’",
	147: "“",
	148: "”",
	149: "•",
	150: "–",
	151: "—",
	152: "˜",
	153: "™",
	154: "š",
	155: "›",
	156: "œ",
	158: "ž",
	159: "Ÿ"
};
var WINDOWS_1252_REVERSE = {};
for (const [code, char] of Object.entries(WINDOWS_1252_EXTRA)) WINDOWS_1252_REVERSE[char] = Number.parseInt(code, 10);
var _utf8Decoder;
function utf8Decoder() {
	if (typeof globalThis.TextDecoder === "undefined") return void 0;
	return _utf8Decoder !== null && _utf8Decoder !== void 0 ? _utf8Decoder : _utf8Decoder = new globalThis.TextDecoder("utf-8");
}
var CHUNK = 32768;
var REPLACEMENT = 65533;
/**
* Decode text from binary data
*/
function textDecode(bytes, encoding = "utf-8") {
	switch (encoding.toLowerCase()) {
		case "utf-8":
		case "utf8": {
			const dec = utf8Decoder();
			return dec ? dec.decode(bytes) : decodeUTF8(bytes);
		}
		case "utf-16le": return decodeUTF16LE(bytes);
		case "us-ascii":
		case "ascii": return decodeASCII(bytes);
		case "latin1":
		case "iso-8859-1": return decodeLatin1(bytes);
		case "windows-1252": return decodeWindows1252(bytes);
		default: throw new RangeError(`Encoding '${encoding}' not supported`);
	}
}
function flushChunk(parts, chunk) {
	if (chunk.length === 0) return;
	parts.push(String.fromCharCode.apply(null, chunk));
	chunk.length = 0;
}
function pushCodeUnit(parts, chunk, codeUnit) {
	chunk.push(codeUnit);
	if (chunk.length >= CHUNK) flushChunk(parts, chunk);
}
function pushCodePoint(parts, chunk, cp) {
	if (cp <= 65535) {
		pushCodeUnit(parts, chunk, cp);
		return;
	}
	cp -= 65536;
	pushCodeUnit(parts, chunk, 55296 + (cp >> 10));
	pushCodeUnit(parts, chunk, 56320 + (cp & 1023));
}
function decodeUTF8(bytes) {
	const parts = [];
	const chunk = [];
	let i = 0;
	if (bytes.length >= 3 && bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) i = 3;
	while (i < bytes.length) {
		const b1 = bytes[i];
		if (b1 <= 127) {
			pushCodeUnit(parts, chunk, b1);
			i++;
			continue;
		}
		if (b1 < 194 || b1 > 244) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			i++;
			continue;
		}
		if (b1 <= 223) {
			if (i + 1 >= bytes.length) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			const b2 = bytes[i + 1];
			if ((b2 & 192) !== 128) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			pushCodeUnit(parts, chunk, (b1 & 31) << 6 | b2 & 63);
			i += 2;
			continue;
		}
		if (b1 <= 239) {
			if (i + 2 >= bytes.length) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			const b2 = bytes[i + 1];
			const b3 = bytes[i + 2];
			if (!((b2 & 192) === 128 && (b3 & 192) === 128 && !(b1 === 224 && b2 < 160) && !(b1 === 237 && b2 >= 160))) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			pushCodeUnit(parts, chunk, (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63);
			i += 3;
			continue;
		}
		if (i + 3 >= bytes.length) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			i++;
			continue;
		}
		const b2 = bytes[i + 1];
		const b3 = bytes[i + 2];
		const b4 = bytes[i + 3];
		if (!((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128 && !(b1 === 240 && b2 < 144) && !(b1 === 244 && b2 > 143))) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			i++;
			continue;
		}
		pushCodePoint(parts, chunk, (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63);
		i += 4;
	}
	flushChunk(parts, chunk);
	return parts.join("");
}
function decodeUTF16LE(bytes) {
	const parts = [];
	const chunk = [];
	const len = bytes.length;
	let i = 0;
	while (i + 1 < len) {
		const u1 = bytes[i] | bytes[i + 1] << 8;
		i += 2;
		if (u1 >= 55296 && u1 <= 56319) {
			if (i + 1 < len) {
				const u2 = bytes[i] | bytes[i + 1] << 8;
				if (u2 >= 56320 && u2 <= 57343) {
					pushCodeUnit(parts, chunk, u1);
					pushCodeUnit(parts, chunk, u2);
					i += 2;
				} else pushCodeUnit(parts, chunk, REPLACEMENT);
			} else pushCodeUnit(parts, chunk, REPLACEMENT);
			continue;
		}
		if (u1 >= 56320 && u1 <= 57343) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			continue;
		}
		pushCodeUnit(parts, chunk, u1);
	}
	if (i < len) pushCodeUnit(parts, chunk, REPLACEMENT);
	flushChunk(parts, chunk);
	return parts.join("");
}
function decodeASCII(bytes) {
	const parts = [];
	for (let i = 0; i < bytes.length; i += CHUNK) {
		const end = Math.min(bytes.length, i + CHUNK);
		const codes = new Array(end - i);
		for (let j = i, k = 0; j < end; j++, k++) codes[k] = bytes[j] & 127;
		parts.push(String.fromCharCode.apply(null, codes));
	}
	return parts.join("");
}
function decodeLatin1(bytes) {
	const parts = [];
	for (let i = 0; i < bytes.length; i += CHUNK) {
		const end = Math.min(bytes.length, i + CHUNK);
		const codes = new Array(end - i);
		for (let j = i, k = 0; j < end; j++, k++) codes[k] = bytes[j];
		parts.push(String.fromCharCode.apply(null, codes));
	}
	return parts.join("");
}
function decodeWindows1252(bytes) {
	const parts = [];
	let out = "";
	for (let i = 0; i < bytes.length; i++) {
		const b = bytes[i];
		const extra = b >= 128 && b <= 159 ? WINDOWS_1252_EXTRA[b] : void 0;
		out += extra !== null && extra !== void 0 ? extra : String.fromCharCode(b);
		if (out.length >= CHUNK) {
			parts.push(out);
			out = "";
		}
	}
	if (out) parts.push(out);
	return parts.join("");
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/token-types@6.1.2/node_modules/token-types/lib/index.js
function dv(array) {
	return new DataView(array.buffer, array.byteOffset);
}
var UINT8 = {
	len: 1,
	get(array, offset) {
		return dv(array).getUint8(offset);
	},
	put(array, offset, value) {
		dv(array).setUint8(offset, value);
		return offset + 1;
	}
};
/**
* 16-bit unsigned integer, Little Endian byte order
*/
var UINT16_LE = {
	len: 2,
	get(array, offset) {
		return dv(array).getUint16(offset, true);
	},
	put(array, offset, value) {
		dv(array).setUint16(offset, value, true);
		return offset + 2;
	}
};
/**
* 16-bit unsigned integer, Big Endian byte order
*/
var UINT16_BE = {
	len: 2,
	get(array, offset) {
		return dv(array).getUint16(offset);
	},
	put(array, offset, value) {
		dv(array).setUint16(offset, value);
		return offset + 2;
	}
};
/**
* 32-bit unsigned integer, Little Endian byte order
*/
var UINT32_LE = {
	len: 4,
	get(array, offset) {
		return dv(array).getUint32(offset, true);
	},
	put(array, offset, value) {
		dv(array).setUint32(offset, value, true);
		return offset + 4;
	}
};
/**
* 32-bit unsigned integer, Big Endian byte order
*/
var UINT32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getUint32(offset);
	},
	put(array, offset, value) {
		dv(array).setUint32(offset, value);
		return offset + 4;
	}
};
/**
* 32-bit signed integer, Big Endian byte order
*/
var INT32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getInt32(offset);
	},
	put(array, offset, value) {
		dv(array).setInt32(offset, value);
		return offset + 4;
	}
};
/**
* 64-bit unsigned integer, Little Endian byte order
*/
var UINT64_LE = {
	len: 8,
	get(array, offset) {
		return dv(array).getBigUint64(offset, true);
	},
	put(array, offset, value) {
		dv(array).setBigUint64(offset, value, true);
		return offset + 8;
	}
};
/**
* Consume a fixed number of bytes from the stream and return a string with a specified encoding.
* Supports all encodings supported by TextDecoder, plus 'windows-1252'.
*/
var StringType = class {
	constructor(len, encoding) {
		this.len = len;
		this.encoding = encoding;
	}
	get(data, offset = 0) {
		return textDecode(data.subarray(offset, offset + this.len), this.encoding);
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/Errors.js
var defaultMessages = "End-Of-Stream";
/**
* Thrown on read operation of the end of file or stream has been reached
*/
var EndOfStreamError = class extends Error {
	constructor() {
		super(defaultMessages);
		this.name = "EndOfStreamError";
	}
};
var AbortError = class extends Error {
	constructor(message = "The operation was aborted") {
		super(message);
		this.name = "AbortError";
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/AbstractStreamReader.js
var AbstractStreamReader = class {
	constructor() {
		this.endOfStream = false;
		this.interrupted = false;
		/**
		* Store peeked data
		* @type {Array}
		*/
		this.peekQueue = [];
	}
	async peek(uint8Array, mayBeLess = false) {
		const bytesRead = await this.read(uint8Array, mayBeLess);
		this.peekQueue.push(uint8Array.subarray(0, bytesRead));
		return bytesRead;
	}
	async read(buffer, mayBeLess = false) {
		if (buffer.length === 0) return 0;
		let bytesRead = this.readFromPeekBuffer(buffer);
		if (!this.endOfStream) bytesRead += await this.readRemainderFromStream(buffer.subarray(bytesRead), mayBeLess);
		if (bytesRead === 0 && !mayBeLess) throw new EndOfStreamError();
		return bytesRead;
	}
	/**
	* Read chunk from stream
	* @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
	* @returns Number of bytes read
	*/
	readFromPeekBuffer(buffer) {
		let remaining = buffer.length;
		let bytesRead = 0;
		while (this.peekQueue.length > 0 && remaining > 0) {
			const peekData = this.peekQueue.pop();
			if (!peekData) throw new Error("peekData should be defined");
			const lenCopy = Math.min(peekData.length, remaining);
			buffer.set(peekData.subarray(0, lenCopy), bytesRead);
			bytesRead += lenCopy;
			remaining -= lenCopy;
			if (lenCopy < peekData.length) this.peekQueue.push(peekData.subarray(lenCopy));
		}
		return bytesRead;
	}
	async readRemainderFromStream(buffer, mayBeLess) {
		let bytesRead = 0;
		while (bytesRead < buffer.length && !this.endOfStream) {
			if (this.interrupted) throw new AbortError();
			const chunkLen = await this.readFromStream(buffer.subarray(bytesRead), mayBeLess);
			if (chunkLen === 0) break;
			bytesRead += chunkLen;
		}
		if (!mayBeLess && bytesRead < buffer.length) throw new EndOfStreamError();
		return bytesRead;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamReader.js
var WebStreamReader = class extends AbstractStreamReader {
	constructor(reader) {
		super();
		this.reader = reader;
	}
	async abort() {
		return this.close();
	}
	async close() {
		this.reader.releaseLock();
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamByobReader.js
/**
* Read from a WebStream using a BYOB reader
* Reference: https://nodejs.org/api/webstreams.html#class-readablestreambyobreader
*/
var WebStreamByobReader = class extends WebStreamReader {
	/**
	* Read from stream
	* @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
	* @param mayBeLess - If true, may fill the buffer partially
	* @protected Bytes read
	*/
	async readFromStream(buffer, mayBeLess) {
		if (buffer.length === 0) return 0;
		const result = await this.reader.read(new Uint8Array(buffer.length), { min: mayBeLess ? void 0 : buffer.length });
		if (result.done) this.endOfStream = result.done;
		if (result.value) {
			buffer.set(result.value);
			return result.value.length;
		}
		return 0;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamDefaultReader.js
var WebStreamDefaultReader = class extends AbstractStreamReader {
	constructor(reader) {
		super();
		this.reader = reader;
		this.buffer = null;
	}
	/**
	* Copy chunk to target, and store the remainder in this.buffer
	*/
	writeChunk(target, chunk) {
		const written = Math.min(chunk.length, target.length);
		target.set(chunk.subarray(0, written));
		if (written < chunk.length) this.buffer = chunk.subarray(written);
		else this.buffer = null;
		return written;
	}
	/**
	* Read from stream
	* @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
	* @param mayBeLess - If true, may fill the buffer partially
	* @protected Bytes read
	*/
	async readFromStream(buffer, mayBeLess) {
		if (buffer.length === 0) return 0;
		let totalBytesRead = 0;
		if (this.buffer) totalBytesRead += this.writeChunk(buffer, this.buffer);
		while (totalBytesRead < buffer.length && !this.endOfStream) {
			const result = await this.reader.read();
			if (result.done) {
				this.endOfStream = true;
				break;
			}
			if (result.value) totalBytesRead += this.writeChunk(buffer.subarray(totalBytesRead), result.value);
		}
		if (!mayBeLess && totalBytesRead === 0 && this.endOfStream) throw new EndOfStreamError();
		return totalBytesRead;
	}
	abort() {
		this.interrupted = true;
		return this.reader.cancel();
	}
	async close() {
		await this.abort();
		this.reader.releaseLock();
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/stream/WebStreamReaderFactory.js
function makeWebStreamReader(stream) {
	try {
		const reader = stream.getReader({ mode: "byob" });
		if (reader instanceof ReadableStreamDefaultReader) return new WebStreamDefaultReader(reader);
		return new WebStreamByobReader(reader);
	} catch (error) {
		if (error instanceof TypeError) return new WebStreamDefaultReader(stream.getReader());
		throw error;
	}
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/AbstractTokenizer.js
/**
* Core tokenizer
*/
var AbstractTokenizer = class {
	/**
	* Constructor
	* @param options Tokenizer options
	* @protected
	*/
	constructor(options) {
		this.numBuffer = /* @__PURE__ */ new Uint8Array(8);
		/**
		* Tokenizer-stream position
		*/
		this.position = 0;
		this.onClose = options?.onClose;
		if (options?.abortSignal) options.abortSignal.addEventListener("abort", () => {
			this.abort();
		});
	}
	/**
	* Read a token from the tokenizer-stream
	* @param token - The token to read
	* @param position - If provided, the desired position in the tokenizer-stream
	* @returns Promise with token data
	*/
	async readToken(token, position = this.position) {
		const uint8Array = new Uint8Array(token.len);
		if (await this.readBuffer(uint8Array, { position }) < token.len) throw new EndOfStreamError();
		return token.get(uint8Array, 0);
	}
	/**
	* Peek a token from the tokenizer-stream.
	* @param token - Token to peek from the tokenizer-stream.
	* @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
	* @returns Promise with token data
	*/
	async peekToken(token, position = this.position) {
		const uint8Array = new Uint8Array(token.len);
		if (await this.peekBuffer(uint8Array, { position }) < token.len) throw new EndOfStreamError();
		return token.get(uint8Array, 0);
	}
	/**
	* Read a numeric token from the stream
	* @param token - Numeric token
	* @returns Promise with number
	*/
	async readNumber(token) {
		if (await this.readBuffer(this.numBuffer, { length: token.len }) < token.len) throw new EndOfStreamError();
		return token.get(this.numBuffer, 0);
	}
	/**
	* Read a numeric token from the stream
	* @param token - Numeric token
	* @returns Promise with number
	*/
	async peekNumber(token) {
		if (await this.peekBuffer(this.numBuffer, { length: token.len }) < token.len) throw new EndOfStreamError();
		return token.get(this.numBuffer, 0);
	}
	/**
	* Ignore number of bytes, advances the pointer in under tokenizer-stream.
	* @param length - Number of bytes to ignore.  Must be ≥ 0.
	* @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
	*/
	async ignore(length) {
		if (length < 0) throw new RangeError("ignore length must be ≥ 0 bytes");
		if (this.fileInfo.size !== void 0) {
			const bytesLeft = this.fileInfo.size - this.position;
			if (length > bytesLeft) {
				this.position += bytesLeft;
				return bytesLeft;
			}
		}
		this.position += length;
		return length;
	}
	async close() {
		await this.abort();
		await this.onClose?.();
	}
	normalizeOptions(uint8Array, options) {
		if (!this.supportsRandomAccess() && options && options.position !== void 0 && options.position < this.position) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
		return {
			mayBeLess: false,
			offset: 0,
			length: uint8Array.length,
			position: this.position,
			...options
		};
	}
	abort() {
		return Promise.resolve();
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/ReadStreamTokenizer.js
var maxBufferSize = 256e3;
var ReadStreamTokenizer = class extends AbstractTokenizer {
	/**
	* Constructor
	* @param streamReader stream-reader to read from
	* @param options Tokenizer options
	*/
	constructor(streamReader, options) {
		super(options);
		this.streamReader = streamReader;
		this.fileInfo = options?.fileInfo ?? {};
	}
	/**
	* Read buffer from tokenizer
	* @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
	* @param options - Read behaviour options
	* @returns Promise with number of bytes read
	*/
	async readBuffer(uint8Array, options) {
		const normOptions = this.normalizeOptions(uint8Array, options);
		const skipBytes = normOptions.position - this.position;
		if (skipBytes > 0) {
			await this.ignore(skipBytes);
			return this.readBuffer(uint8Array, options);
		}
		if (skipBytes < 0) throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
		if (normOptions.length === 0) return 0;
		const bytesRead = await this.streamReader.read(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
		this.position += bytesRead;
		if ((!options || !options.mayBeLess) && bytesRead < normOptions.length) throw new EndOfStreamError();
		return bytesRead;
	}
	/**
	* Peek (read ahead) buffer from tokenizer
	* @param uint8Array - Uint8Array (or Buffer) to write data to
	* @param options - Read behaviour options
	* @returns Promise with number of bytes peeked
	*/
	async peekBuffer(uint8Array, options) {
		const normOptions = this.normalizeOptions(uint8Array, options);
		let bytesRead = 0;
		if (normOptions.position) {
			const skipBytes = normOptions.position - this.position;
			if (skipBytes > 0) {
				const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
				bytesRead = await this.peekBuffer(skipBuffer, { mayBeLess: normOptions.mayBeLess });
				uint8Array.set(skipBuffer.subarray(skipBytes));
				return bytesRead - skipBytes;
			}
			if (skipBytes < 0) throw new Error("Cannot peek from a negative offset in a stream");
		}
		if (normOptions.length > 0) {
			try {
				bytesRead = await this.streamReader.peek(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
			} catch (err) {
				if (options?.mayBeLess && err instanceof EndOfStreamError) return 0;
				throw err;
			}
			if (!normOptions.mayBeLess && bytesRead < normOptions.length) throw new EndOfStreamError();
		}
		return bytesRead;
	}
	/**
	* @param length Number of bytes to ignore. Must be ≥ 0.
	*/
	async ignore(length) {
		if (length < 0) throw new RangeError("ignore length must be ≥ 0 bytes");
		const bufSize = Math.min(maxBufferSize, length);
		const buf = new Uint8Array(bufSize);
		let totBytesRead = 0;
		while (totBytesRead < length) {
			const remaining = length - totBytesRead;
			const bytesRead = await this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
			if (bytesRead < 0) return bytesRead;
			totBytesRead += bytesRead;
		}
		return totBytesRead;
	}
	abort() {
		return this.streamReader.abort();
	}
	async close() {
		return this.streamReader.close();
	}
	supportsRandomAccess() {
		return false;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/BufferTokenizer.js
var BufferTokenizer = class extends AbstractTokenizer {
	/**
	* Construct BufferTokenizer
	* @param uint8Array - Uint8Array to tokenize
	* @param options Tokenizer options
	*/
	constructor(uint8Array, options) {
		super(options);
		this.uint8Array = uint8Array;
		this.fileInfo = {
			...options?.fileInfo ?? {},
			size: uint8Array.length
		};
	}
	/**
	* Read buffer from tokenizer
	* @param uint8Array - Uint8Array to tokenize
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async readBuffer(uint8Array, options) {
		if (options?.position) this.position = options.position;
		const bytesRead = await this.peekBuffer(uint8Array, options);
		this.position += bytesRead;
		return bytesRead;
	}
	/**
	* Peek (read ahead) buffer from tokenizer
	* @param uint8Array
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async peekBuffer(uint8Array, options) {
		const normOptions = this.normalizeOptions(uint8Array, options);
		const bytes2read = Math.min(this.uint8Array.length - normOptions.position, normOptions.length);
		if (!normOptions.mayBeLess && bytes2read < normOptions.length) throw new EndOfStreamError();
		uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read));
		return bytes2read;
	}
	close() {
		return super.close();
	}
	supportsRandomAccess() {
		return true;
	}
	setPosition(position) {
		this.position = position;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/BlobTokenizer.js
var BlobTokenizer = class extends AbstractTokenizer {
	/**
	* Construct BufferTokenizer
	* @param blob - Uint8Array to tokenize
	* @param options Tokenizer options
	*/
	constructor(blob, options) {
		super(options);
		this.blob = blob;
		this.fileInfo = {
			...options?.fileInfo ?? {},
			size: blob.size,
			mimeType: blob.type
		};
	}
	/**
	* Read buffer from tokenizer
	* @param uint8Array - Uint8Array to tokenize
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async readBuffer(uint8Array, options) {
		if (options?.position) this.position = options.position;
		const bytesRead = await this.peekBuffer(uint8Array, options);
		this.position += bytesRead;
		return bytesRead;
	}
	/**
	* Peek (read ahead) buffer from tokenizer
	* @param buffer
	* @param options - Read behaviour options
	* @returns {Promise<number>}
	*/
	async peekBuffer(buffer, options) {
		const normOptions = this.normalizeOptions(buffer, options);
		const bytes2read = Math.min(this.blob.size - normOptions.position, normOptions.length);
		if (!normOptions.mayBeLess && bytes2read < normOptions.length) throw new EndOfStreamError();
		const arrayBuffer = await this.blob.slice(normOptions.position, normOptions.position + bytes2read).arrayBuffer();
		buffer.set(new Uint8Array(arrayBuffer));
		return bytes2read;
	}
	close() {
		return super.close();
	}
	supportsRandomAccess() {
		return true;
	}
	setPosition(position) {
		this.position = position;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/strtok3@10.3.5/node_modules/strtok3/lib/core.js
/**
* Construct ReadStreamTokenizer from given ReadableStream (WebStream API).
* Will set fileSize, if provided given Stream has set the .path property/
* @param webStream - Read from Node.js Stream.Readable (must be a byte stream)
* @param options - Tokenizer options
* @returns ReadStreamTokenizer
*/
function fromWebStream(webStream, options) {
	const webStreamReader = makeWebStreamReader(webStream);
	const _options = options ?? {};
	const chainedClose = _options.onClose;
	_options.onClose = async () => {
		await webStreamReader.close();
		if (chainedClose) return chainedClose();
	};
	return new ReadStreamTokenizer(webStreamReader, _options);
}
/**
* Construct ReadStreamTokenizer from given Buffer.
* @param uint8Array - Uint8Array to tokenize
* @param options - Tokenizer options
* @returns BufferTokenizer
*/
function fromBuffer(uint8Array, options) {
	return new BufferTokenizer(uint8Array, options);
}
/**
* Construct ReadStreamTokenizer from given Blob.
* @param blob - Uint8Array to tokenize
* @param options - Tokenizer options
* @returns BufferTokenizer
*/
function fromBlob(blob, options) {
	return new BlobTokenizer(blob, options);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
				if (template[templateIndex] === "*") {
					starIndex = templateIndex;
					matchIndex = searchIndex;
					templateIndex++;
				} else {
					searchIndex++;
					templateIndex++;
				}
			} else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tokenizer+inflate@0.4.1/node_modules/@tokenizer/inflate/lib/ZipToken.js
var import_browser = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = {}.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
})))(), 1);
/**
* Ref https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
*/
var Signature = {
	LocalFileHeader: 67324752,
	DataDescriptor: 134695760,
	CentralFileHeader: 33639248,
	EndOfCentralDirectory: 101010256
};
var DataDescriptor = {
	get(array) {
		return {
			signature: UINT32_LE.get(array, 0),
			compressedSize: UINT32_LE.get(array, 8),
			uncompressedSize: UINT32_LE.get(array, 12)
		};
	},
	len: 16
};
/**
* First part of the ZIP Local File Header
* Offset | Bytes| Description
* -------|------+-------------------------------------------------------------------
*      0 |    4 | Signature (0x04034b50)
*      4 |    2 | Minimum version needed to extract
*      6 |    2 | Bit flag
*      8 |    2 | Compression method
*     10 |    2 | File last modification time (MS-DOS format)
*     12 |    2 | File last modification date (MS-DOS format)
*     14 |    4 | CRC-32 of uncompressed data
*     18 |    4 | Compressed size
*     22 |    4 | Uncompressed size
*     26 |    2 | File name length (n)
*     28 |    2 | Extra field length (m)
*     30 |    n | File name
* 30 + n |    m | Extra field
*/
var LocalFileHeaderToken = {
	get(array) {
		const flags = UINT16_LE.get(array, 6);
		return {
			signature: UINT32_LE.get(array, 0),
			minVersion: UINT16_LE.get(array, 4),
			dataDescriptor: !!(flags & 8),
			compressedMethod: UINT16_LE.get(array, 8),
			compressedSize: UINT32_LE.get(array, 18),
			uncompressedSize: UINT32_LE.get(array, 22),
			filenameLength: UINT16_LE.get(array, 26),
			extraFieldLength: UINT16_LE.get(array, 28),
			filename: null
		};
	},
	len: 30
};
/**
* 4.3.16  End of central directory record:
*  end of central dir signature (0x06064b50)                                      4 bytes
*  number of this disk                                                            2 bytes
*  number of the disk with the start of the central directory                     2 bytes
*  total number of entries in the central directory on this disk                  2 bytes
*  total number of entries in the size of the central directory                   2 bytes
*  sizeOfTheCentralDirectory                                                      4 bytes
*  offset of start of central directory with respect to the starting disk number  4 bytes
*  .ZIP file comment length                                                       2 bytes
*  .ZIP file comment       (variable size)
*/
var EndOfCentralDirectoryRecordToken = {
	get(array) {
		return {
			signature: UINT32_LE.get(array, 0),
			nrOfThisDisk: UINT16_LE.get(array, 4),
			nrOfThisDiskWithTheStart: UINT16_LE.get(array, 6),
			nrOfEntriesOnThisDisk: UINT16_LE.get(array, 8),
			nrOfEntriesOfSize: UINT16_LE.get(array, 10),
			sizeOfCd: UINT32_LE.get(array, 12),
			offsetOfStartOfCd: UINT32_LE.get(array, 16),
			zipFileCommentLength: UINT16_LE.get(array, 20)
		};
	},
	len: 22
};
/**
* File header:
*    central file header signature   4 bytes   0 (0x02014b50)
*    version made by                 2 bytes   4
*    version needed to extract       2 bytes   6
*    general purpose bit flag        2 bytes   8
*    compression method              2 bytes  10
*    last mod file time              2 bytes  12
*    last mod file date              2 bytes  14
*    crc-32                          4 bytes  16
*    compressed size                 4 bytes  20
*    uncompressed size               4 bytes  24
*    file name length                2 bytes  28
*    extra field length              2 bytes  30
*    file comment length             2 bytes  32
*    disk number start               2 bytes  34
*    internal file attributes        2 bytes  36
*    external file attributes        4 bytes  38
*    relative offset of local header 4 bytes  42
*/
var FileHeader = {
	get(array) {
		const flags = UINT16_LE.get(array, 8);
		return {
			signature: UINT32_LE.get(array, 0),
			minVersion: UINT16_LE.get(array, 6),
			dataDescriptor: !!(flags & 8),
			compressedMethod: UINT16_LE.get(array, 10),
			compressedSize: UINT32_LE.get(array, 20),
			uncompressedSize: UINT32_LE.get(array, 24),
			filenameLength: UINT16_LE.get(array, 28),
			extraFieldLength: UINT16_LE.get(array, 30),
			fileCommentLength: UINT16_LE.get(array, 32),
			relativeOffsetOfLocalHeader: UINT32_LE.get(array, 42),
			filename: null
		};
	},
	len: 46
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tokenizer+inflate@0.4.1/node_modules/@tokenizer/inflate/lib/ZipHandler.js
function signatureToArray(signature) {
	const signatureBytes = new Uint8Array(UINT32_LE.len);
	UINT32_LE.put(signatureBytes, 0, signature);
	return signatureBytes;
}
var debug = (0, import_browser.default)("tokenizer:inflate");
var syncBufferSize = 262144;
var ddSignatureArray = signatureToArray(Signature.DataDescriptor);
var eocdSignatureBytes = signatureToArray(Signature.EndOfCentralDirectory);
var ZipHandler = class ZipHandler {
	constructor(tokenizer) {
		this.tokenizer = tokenizer;
		this.syncBuffer = new Uint8Array(syncBufferSize);
	}
	async isZip() {
		return await this.peekSignature() === Signature.LocalFileHeader;
	}
	peekSignature() {
		return this.tokenizer.peekToken(UINT32_LE);
	}
	async findEndOfCentralDirectoryLocator() {
		const randomReadTokenizer = this.tokenizer;
		const chunkLength = Math.min(16384, randomReadTokenizer.fileInfo.size);
		const buffer = this.syncBuffer.subarray(0, chunkLength);
		await this.tokenizer.readBuffer(buffer, { position: randomReadTokenizer.fileInfo.size - chunkLength });
		for (let i = buffer.length - 4; i >= 0; i--) if (buffer[i] === eocdSignatureBytes[0] && buffer[i + 1] === eocdSignatureBytes[1] && buffer[i + 2] === eocdSignatureBytes[2] && buffer[i + 3] === eocdSignatureBytes[3]) return randomReadTokenizer.fileInfo.size - chunkLength + i;
		return -1;
	}
	async readCentralDirectory() {
		if (!this.tokenizer.supportsRandomAccess()) {
			debug("Cannot reading central-directory without random-read support");
			return;
		}
		debug("Reading central-directory...");
		const pos = this.tokenizer.position;
		const offset = await this.findEndOfCentralDirectoryLocator();
		if (offset > 0) {
			debug("Central-directory 32-bit signature found");
			const eocdHeader = await this.tokenizer.readToken(EndOfCentralDirectoryRecordToken, offset);
			const files = [];
			this.tokenizer.setPosition(eocdHeader.offsetOfStartOfCd);
			for (let n = 0; n < eocdHeader.nrOfEntriesOfSize; ++n) {
				const entry = await this.tokenizer.readToken(FileHeader);
				if (entry.signature !== Signature.CentralFileHeader) throw new Error("Expected Central-File-Header signature");
				entry.filename = await this.tokenizer.readToken(new StringType(entry.filenameLength, "utf-8"));
				await this.tokenizer.ignore(entry.extraFieldLength);
				await this.tokenizer.ignore(entry.fileCommentLength);
				files.push(entry);
				debug(`Add central-directory file-entry: n=${n + 1}/${files.length}: filename=${files[n].filename}`);
			}
			this.tokenizer.setPosition(pos);
			return files;
		}
		this.tokenizer.setPosition(pos);
	}
	async unzip(fileCb) {
		const entries = await this.readCentralDirectory();
		if (entries) return this.iterateOverCentralDirectory(entries, fileCb);
		let stop = false;
		do {
			const zipHeader = await this.readLocalFileHeader();
			if (!zipHeader) break;
			const next = fileCb(zipHeader);
			stop = !!next.stop;
			let fileData;
			await this.tokenizer.ignore(zipHeader.extraFieldLength);
			if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) {
				const chunks = [];
				let len = syncBufferSize;
				debug("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
				let nextHeaderIndex = -1;
				while (nextHeaderIndex < 0 && len === syncBufferSize) {
					len = await this.tokenizer.peekBuffer(this.syncBuffer, { mayBeLess: true });
					nextHeaderIndex = indexOf(this.syncBuffer.subarray(0, len), ddSignatureArray);
					const size = nextHeaderIndex >= 0 ? nextHeaderIndex : len;
					if (next.handler) {
						const data = new Uint8Array(size);
						await this.tokenizer.readBuffer(data);
						chunks.push(data);
					} else await this.tokenizer.ignore(size);
				}
				debug(`Found data-descriptor-signature at pos=${this.tokenizer.position}`);
				if (next.handler) await this.inflate(zipHeader, mergeArrays(chunks), next.handler);
			} else if (next.handler) {
				debug(`Reading compressed-file-data: ${zipHeader.compressedSize} bytes`);
				fileData = new Uint8Array(zipHeader.compressedSize);
				await this.tokenizer.readBuffer(fileData);
				await this.inflate(zipHeader, fileData, next.handler);
			} else {
				debug(`Ignoring compressed-file-data: ${zipHeader.compressedSize} bytes`);
				await this.tokenizer.ignore(zipHeader.compressedSize);
			}
			debug(`Reading data-descriptor at pos=${this.tokenizer.position}`);
			if (zipHeader.dataDescriptor) {
				if ((await this.tokenizer.readToken(DataDescriptor)).signature !== 134695760) throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - DataDescriptor.len}`);
			}
		} while (!stop);
	}
	async iterateOverCentralDirectory(entries, fileCb) {
		for (const fileHeader of entries) {
			const next = fileCb(fileHeader);
			if (next.handler) {
				this.tokenizer.setPosition(fileHeader.relativeOffsetOfLocalHeader);
				const zipHeader = await this.readLocalFileHeader();
				if (zipHeader) {
					await this.tokenizer.ignore(zipHeader.extraFieldLength);
					const fileData = new Uint8Array(fileHeader.compressedSize);
					await this.tokenizer.readBuffer(fileData);
					await this.inflate(zipHeader, fileData, next.handler);
				}
			}
			if (next.stop) break;
		}
	}
	async inflate(zipHeader, fileData, cb) {
		if (zipHeader.compressedMethod === 0) return cb(fileData);
		if (zipHeader.compressedMethod !== 8) throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
		debug(`Decompress filename=${zipHeader.filename}, compressed-size=${fileData.length}`);
		return cb(await ZipHandler.decompressDeflateRaw(fileData));
	}
	static async decompressDeflateRaw(data) {
		const input = new ReadableStream({ start(controller) {
			controller.enqueue(data);
			controller.close();
		} });
		const ds = new DecompressionStream("deflate-raw");
		const output = input.pipeThrough(ds);
		try {
			const buffer = await new Response(output).arrayBuffer();
			return new Uint8Array(buffer);
		} catch (err) {
			const message = err instanceof Error ? `Failed to deflate ZIP entry: ${err.message}` : "Unknown decompression error in ZIP entry";
			throw new TypeError(message);
		}
	}
	async readLocalFileHeader() {
		const signature = await this.tokenizer.peekToken(UINT32_LE);
		if (signature === Signature.LocalFileHeader) {
			const header = await this.tokenizer.readToken(LocalFileHeaderToken);
			header.filename = await this.tokenizer.readToken(new StringType(header.filenameLength, "utf-8"));
			return header;
		}
		if (signature === Signature.CentralFileHeader) return false;
		if (signature === 3759263696) throw new Error("Encrypted ZIP");
		throw new Error("Unexpected signature");
	}
};
function indexOf(buffer, portion) {
	const bufferLength = buffer.length;
	const portionLength = portion.length;
	if (portionLength > bufferLength) return -1;
	for (let i = 0; i <= bufferLength - portionLength; i++) {
		let found = true;
		for (let j = 0; j < portionLength; j++) if (buffer[i + j] !== portion[j]) {
			found = false;
			break;
		}
		if (found) return i;
	}
	return -1;
}
function mergeArrays(chunks) {
	const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
	const mergedArray = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		mergedArray.set(chunk, offset);
		offset += chunk.length;
	}
	return mergedArray;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@tokenizer+inflate@0.4.1/node_modules/@tokenizer/inflate/lib/GzipHandler.js
var GzipHandler = class {
	constructor(tokenizer) {
		this.tokenizer = tokenizer;
	}
	inflate() {
		const tokenizer = this.tokenizer;
		return new ReadableStream({ async pull(controller) {
			const buffer = /* @__PURE__ */ new Uint8Array(1024);
			const size = await tokenizer.readBuffer(buffer, { mayBeLess: true });
			if (size === 0) {
				controller.close();
				return;
			}
			controller.enqueue(buffer.subarray(0, size));
		} }).pipeThrough(new DecompressionStream("gzip"));
	}
};
new globalThis.TextDecoder("utf8");
new globalThis.TextEncoder();
Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));
/**
@param {DataView} view
@returns {number}
*/
function getUintBE(view) {
	const { byteLength } = view;
	if (byteLength === 6) return view.getUint16(0) * 2 ** 32 + view.getUint32(2);
	if (byteLength === 5) return view.getUint8(0) * 2 ** 32 + view.getUint32(1);
	if (byteLength === 4) return view.getUint32(0);
	if (byteLength === 3) return view.getUint8(0) * 2 ** 16 + view.getUint16(1);
	if (byteLength === 2) return view.getUint16(0);
	if (byteLength === 1) return view.getUint8(0);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/file-type@21.3.4/node_modules/file-type/util.js
function stringToBytes(string, encoding) {
	if (encoding === "utf-16le") {
		const bytes = [];
		for (let index = 0; index < string.length; index++) {
			const code = string.charCodeAt(index);
			bytes.push(code & 255, code >> 8 & 255);
		}
		return bytes;
	}
	if (encoding === "utf-16be") {
		const bytes = [];
		for (let index = 0; index < string.length; index++) {
			const code = string.charCodeAt(index);
			bytes.push(code >> 8 & 255, code & 255);
		}
		return bytes;
	}
	return [...string].map((character) => character.charCodeAt(0));
}
/**
Checks whether the TAR checksum is valid.

@param {Uint8Array} arrayBuffer - The TAR header `[offset ... offset + 512]`.
@param {number} offset - TAR header offset.
@returns {boolean} `true` if the TAR checksum is valid, otherwise `false`.
*/
function tarHeaderChecksumMatches(arrayBuffer, offset = 0) {
	const readSum = Number.parseInt(new StringType(6).get(arrayBuffer, 148).replace(/\0.*$/, "").trim(), 8);
	if (Number.isNaN(readSum)) return false;
	let sum = 256;
	for (let index = offset; index < offset + 148; index++) sum += arrayBuffer[index];
	for (let index = offset + 156; index < offset + 512; index++) sum += arrayBuffer[index];
	return readSum === sum;
}
/**
ID3 UINT32 sync-safe tokenizer token.
28 bits (representing up to 256MB) integer, the msb is 0 to avoid "false syncsignals".
*/
var uint32SyncSafeToken = {
	get: (buffer, offset) => buffer[offset + 3] & 127 | buffer[offset + 2] << 7 | buffer[offset + 1] << 14 | buffer[offset] << 21,
	len: 4
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/file-type@21.3.4/node_modules/file-type/supported.js
var extensions = [
	"jpg",
	"png",
	"apng",
	"gif",
	"webp",
	"flif",
	"xcf",
	"cr2",
	"cr3",
	"orf",
	"arw",
	"dng",
	"nef",
	"rw2",
	"raf",
	"tif",
	"bmp",
	"icns",
	"jxr",
	"psd",
	"indd",
	"zip",
	"tar",
	"rar",
	"gz",
	"bz2",
	"7z",
	"dmg",
	"mp4",
	"mid",
	"mkv",
	"webm",
	"mov",
	"avi",
	"mpg",
	"mp2",
	"mp3",
	"m4a",
	"oga",
	"ogg",
	"ogv",
	"opus",
	"flac",
	"wav",
	"spx",
	"amr",
	"pdf",
	"epub",
	"elf",
	"macho",
	"exe",
	"swf",
	"rtf",
	"wasm",
	"woff",
	"woff2",
	"eot",
	"ttf",
	"otf",
	"ttc",
	"ico",
	"flv",
	"ps",
	"xz",
	"sqlite",
	"nes",
	"crx",
	"xpi",
	"cab",
	"deb",
	"ar",
	"rpm",
	"Z",
	"lz",
	"cfb",
	"mxf",
	"mts",
	"blend",
	"bpg",
	"docx",
	"pptx",
	"xlsx",
	"3gp",
	"3g2",
	"j2c",
	"jp2",
	"jpm",
	"jpx",
	"mj2",
	"aif",
	"qcp",
	"odt",
	"ods",
	"odp",
	"xml",
	"mobi",
	"heic",
	"cur",
	"ktx",
	"ape",
	"wv",
	"dcm",
	"ics",
	"glb",
	"pcap",
	"dsf",
	"lnk",
	"alias",
	"voc",
	"ac3",
	"m4v",
	"m4p",
	"m4b",
	"f4v",
	"f4p",
	"f4b",
	"f4a",
	"mie",
	"asf",
	"ogm",
	"ogx",
	"mpc",
	"arrow",
	"shp",
	"aac",
	"mp1",
	"it",
	"s3m",
	"xm",
	"skp",
	"avif",
	"eps",
	"lzh",
	"pgp",
	"asar",
	"stl",
	"chm",
	"3mf",
	"zst",
	"jxl",
	"vcf",
	"jls",
	"pst",
	"dwg",
	"parquet",
	"class",
	"arj",
	"cpio",
	"ace",
	"avro",
	"icc",
	"fbx",
	"vsdx",
	"vtt",
	"apk",
	"drc",
	"lz4",
	"potx",
	"xltx",
	"dotx",
	"xltm",
	"ott",
	"ots",
	"otp",
	"odg",
	"otg",
	"xlsm",
	"docm",
	"dotm",
	"potm",
	"pptm",
	"jar",
	"jmp",
	"rm",
	"sav",
	"ppsm",
	"ppsx",
	"tar.gz",
	"reg",
	"dat"
];
var mimeTypes = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/flif",
	"image/x-xcf",
	"image/x-canon-cr2",
	"image/x-canon-cr3",
	"image/tiff",
	"image/bmp",
	"image/vnd.ms-photo",
	"image/vnd.adobe.photoshop",
	"application/x-indesign",
	"application/epub+zip",
	"application/x-xpinstall",
	"application/vnd.ms-powerpoint.slideshow.macroenabled.12",
	"application/vnd.oasis.opendocument.text",
	"application/vnd.oasis.opendocument.spreadsheet",
	"application/vnd.oasis.opendocument.presentation",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.openxmlformats-officedocument.presentationml.slideshow",
	"application/zip",
	"application/x-tar",
	"application/x-rar-compressed",
	"application/gzip",
	"application/x-bzip2",
	"application/x-7z-compressed",
	"application/x-apple-diskimage",
	"application/vnd.apache.arrow.file",
	"video/mp4",
	"audio/midi",
	"video/matroska",
	"video/webm",
	"video/quicktime",
	"video/vnd.avi",
	"audio/wav",
	"audio/qcelp",
	"audio/x-ms-asf",
	"video/x-ms-asf",
	"application/vnd.ms-asf",
	"video/mpeg",
	"video/3gpp",
	"audio/mpeg",
	"audio/mp4",
	"video/ogg",
	"audio/ogg",
	"audio/ogg; codecs=opus",
	"application/ogg",
	"audio/flac",
	"audio/ape",
	"audio/wavpack",
	"audio/amr",
	"application/pdf",
	"application/x-elf",
	"application/x-mach-binary",
	"application/x-msdownload",
	"application/x-shockwave-flash",
	"application/rtf",
	"application/wasm",
	"font/woff",
	"font/woff2",
	"application/vnd.ms-fontobject",
	"font/ttf",
	"font/otf",
	"font/collection",
	"image/x-icon",
	"video/x-flv",
	"application/postscript",
	"application/eps",
	"application/x-xz",
	"application/x-sqlite3",
	"application/x-nintendo-nes-rom",
	"application/x-google-chrome-extension",
	"application/vnd.ms-cab-compressed",
	"application/x-deb",
	"application/x-unix-archive",
	"application/x-rpm",
	"application/x-compress",
	"application/x-lzip",
	"application/x-cfb",
	"application/x-mie",
	"application/mxf",
	"video/mp2t",
	"application/x-blender",
	"image/bpg",
	"image/j2c",
	"image/jp2",
	"image/jpx",
	"image/jpm",
	"image/mj2",
	"audio/aiff",
	"application/xml",
	"application/x-mobipocket-ebook",
	"image/heif",
	"image/heif-sequence",
	"image/heic",
	"image/heic-sequence",
	"image/icns",
	"image/ktx",
	"application/dicom",
	"audio/x-musepack",
	"text/calendar",
	"text/vcard",
	"text/vtt",
	"model/gltf-binary",
	"application/vnd.tcpdump.pcap",
	"audio/x-dsf",
	"application/x.ms.shortcut",
	"application/x.apple.alias",
	"audio/x-voc",
	"audio/vnd.dolby.dd-raw",
	"audio/x-m4a",
	"image/apng",
	"image/x-olympus-orf",
	"image/x-sony-arw",
	"image/x-adobe-dng",
	"image/x-nikon-nef",
	"image/x-panasonic-rw2",
	"image/x-fujifilm-raf",
	"video/x-m4v",
	"video/3gpp2",
	"application/x-esri-shape",
	"audio/aac",
	"audio/x-it",
	"audio/x-s3m",
	"audio/x-xm",
	"video/MP1S",
	"video/MP2P",
	"application/vnd.sketchup.skp",
	"image/avif",
	"application/x-lzh-compressed",
	"application/pgp-encrypted",
	"application/x-asar",
	"model/stl",
	"application/vnd.ms-htmlhelp",
	"model/3mf",
	"image/jxl",
	"application/zstd",
	"image/jls",
	"application/vnd.ms-outlook",
	"image/vnd.dwg",
	"application/vnd.apache.parquet",
	"application/java-vm",
	"application/x-arj",
	"application/x-cpio",
	"application/x-ace-compressed",
	"application/avro",
	"application/vnd.iccprofile",
	"application/x.autodesk.fbx",
	"application/vnd.visio",
	"application/vnd.android.package-archive",
	"application/vnd.google.draco",
	"application/x-lz4",
	"application/vnd.openxmlformats-officedocument.presentationml.template",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.template",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.template",
	"application/vnd.ms-excel.template.macroenabled.12",
	"application/vnd.oasis.opendocument.text-template",
	"application/vnd.oasis.opendocument.spreadsheet-template",
	"application/vnd.oasis.opendocument.presentation-template",
	"application/vnd.oasis.opendocument.graphics",
	"application/vnd.oasis.opendocument.graphics-template",
	"application/vnd.ms-excel.sheet.macroenabled.12",
	"application/vnd.ms-word.document.macroenabled.12",
	"application/vnd.ms-word.template.macroenabled.12",
	"application/vnd.ms-powerpoint.template.macroenabled.12",
	"application/vnd.ms-powerpoint.presentation.macroenabled.12",
	"application/java-archive",
	"application/vnd.rn-realmedia",
	"application/x-spss-sav",
	"application/x-ms-regedit",
	"application/x-ft-windows-registry-hive",
	"application/x-jmp-data"
];
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/file-type@21.3.4/node_modules/file-type/core.js
/**
Primary entry point, Node.js specific entry point is index.js
*/
var reasonableDetectionSizeInBytes = 4100;
var maximumMpegOffsetTolerance = 4098;
var maximumZipEntrySizeInBytes = 1048576;
var maximumZipEntryCount = 1024;
var maximumZipBufferedReadSizeInBytes = 2 ** 31 - 1;
var maximumUntrustedSkipSizeInBytes = 16777216;
var maximumUnknownSizePayloadProbeSizeInBytes = maximumZipEntrySizeInBytes;
var maximumZipTextEntrySizeInBytes = maximumZipEntrySizeInBytes;
var maximumNestedGzipDetectionSizeInBytes = maximumUntrustedSkipSizeInBytes;
var maximumNestedGzipProbeDepth = 1;
var unknownSizeGzipProbeTimeoutInMilliseconds = 100;
var maximumId3HeaderSizeInBytes = maximumUntrustedSkipSizeInBytes;
var maximumEbmlDocumentTypeSizeInBytes = 64;
var maximumEbmlElementPayloadSizeInBytes = maximumUnknownSizePayloadProbeSizeInBytes;
var maximumEbmlElementCount = 256;
var maximumPngChunkCount = 512;
var maximumPngStreamScanBudgetInBytes = maximumUntrustedSkipSizeInBytes;
var maximumAsfHeaderObjectCount = 512;
var maximumTiffTagCount = 512;
var maximumDetectionReentryCount = 256;
var maximumPngChunkSizeInBytes = maximumUnknownSizePayloadProbeSizeInBytes;
var maximumAsfHeaderPayloadSizeInBytes = maximumUnknownSizePayloadProbeSizeInBytes;
var maximumTiffStreamIfdOffsetInBytes = maximumUnknownSizePayloadProbeSizeInBytes;
var maximumTiffIfdOffsetInBytes = maximumUntrustedSkipSizeInBytes;
var recoverableZipErrorMessages = /* @__PURE__ */ new Set([
	"Unexpected signature",
	"Encrypted ZIP",
	"Expected Central-File-Header signature"
]);
var recoverableZipErrorMessagePrefixes = [
	"ZIP entry count exceeds ",
	"Unsupported ZIP compression method:",
	"ZIP entry compressed data exceeds ",
	"ZIP entry decompressed data exceeds ",
	"Expected data-descriptor-signature at position "
];
var recoverableZipErrorCodes = /* @__PURE__ */ new Set([
	"Z_BUF_ERROR",
	"Z_DATA_ERROR",
	"ERR_INVALID_STATE"
]);
var ParserHardLimitError = class extends Error {};
function patchWebByobTokenizerClose(tokenizer) {
	const streamReader = tokenizer?.streamReader;
	if (streamReader?.constructor?.name !== "WebStreamByobReader") return tokenizer;
	const { reader } = streamReader;
	const cancelAndRelease = async () => {
		await reader.cancel();
		reader.releaseLock();
	};
	streamReader.close = cancelAndRelease;
	streamReader.abort = async () => {
		streamReader.interrupted = true;
		await cancelAndRelease();
	};
	return tokenizer;
}
function getSafeBound(value, maximum, reason) {
	if (!Number.isFinite(value) || value < 0 || value > maximum) throw new ParserHardLimitError(`${reason} has invalid size ${value} (maximum ${maximum} bytes)`);
	return value;
}
async function safeIgnore(tokenizer, length, { maximumLength = maximumUntrustedSkipSizeInBytes, reason = "skip" } = {}) {
	const safeLength = getSafeBound(length, maximumLength, reason);
	await tokenizer.ignore(safeLength);
}
async function safeReadBuffer(tokenizer, buffer, options, { maximumLength = buffer.length, reason = "read" } = {}) {
	const safeLength = getSafeBound(options?.length ?? buffer.length, maximumLength, reason);
	return tokenizer.readBuffer(buffer, {
		...options,
		length: safeLength
	});
}
async function decompressDeflateRawWithLimit(data, { maximumLength = maximumZipEntrySizeInBytes } = {}) {
	const reader = new ReadableStream({ start(controller) {
		controller.enqueue(data);
		controller.close();
	} }).pipeThrough(new DecompressionStream("deflate-raw")).getReader();
	const chunks = [];
	let totalLength = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			totalLength += value.length;
			if (totalLength > maximumLength) {
				await reader.cancel();
				throw new Error(`ZIP entry decompressed data exceeds ${maximumLength} bytes`);
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const uncompressedData = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		uncompressedData.set(chunk, offset);
		offset += chunk.length;
	}
	return uncompressedData;
}
var zipDataDescriptorSignature = 134695760;
var zipDataDescriptorLengthInBytes = 16;
var zipDataDescriptorOverlapLengthInBytes = 15;
function findZipDataDescriptorOffset(buffer, bytesConsumed) {
	if (buffer.length < zipDataDescriptorLengthInBytes) return -1;
	const lastPossibleDescriptorOffset = buffer.length - zipDataDescriptorLengthInBytes;
	for (let index = 0; index <= lastPossibleDescriptorOffset; index++) if (UINT32_LE.get(buffer, index) === zipDataDescriptorSignature && UINT32_LE.get(buffer, index + 8) === bytesConsumed + index) return index;
	return -1;
}
function isPngAncillaryChunk(type) {
	return (type.codePointAt(0) & 32) !== 0;
}
function mergeByteChunks(chunks, totalLength) {
	const merged = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		merged.set(chunk, offset);
		offset += chunk.length;
	}
	return merged;
}
async function readZipDataDescriptorEntryWithLimit(zipHandler, { shouldBuffer, maximumLength = maximumZipEntrySizeInBytes } = {}) {
	const { syncBuffer } = zipHandler;
	const { length: syncBufferLength } = syncBuffer;
	const chunks = [];
	let bytesConsumed = 0;
	for (;;) {
		const length = await zipHandler.tokenizer.peekBuffer(syncBuffer, { mayBeLess: true });
		const dataDescriptorOffset = findZipDataDescriptorOffset(syncBuffer.subarray(0, length), bytesConsumed);
		const retainedLength = dataDescriptorOffset >= 0 ? 0 : length === syncBufferLength ? Math.min(zipDataDescriptorOverlapLengthInBytes, length - 1) : 0;
		const chunkLength = dataDescriptorOffset >= 0 ? dataDescriptorOffset : length - retainedLength;
		if (chunkLength === 0) break;
		bytesConsumed += chunkLength;
		if (bytesConsumed > maximumLength) throw new Error(`ZIP entry compressed data exceeds ${maximumLength} bytes`);
		if (shouldBuffer) {
			const data = new Uint8Array(chunkLength);
			await zipHandler.tokenizer.readBuffer(data);
			chunks.push(data);
		} else await zipHandler.tokenizer.ignore(chunkLength);
		if (dataDescriptorOffset >= 0) break;
	}
	if (!hasUnknownFileSize(zipHandler.tokenizer)) zipHandler.knownSizeDescriptorScannedBytes += bytesConsumed;
	if (!shouldBuffer) return;
	return mergeByteChunks(chunks, bytesConsumed);
}
function getRemainingZipScanBudget(zipHandler, startOffset) {
	if (hasUnknownFileSize(zipHandler.tokenizer)) return Math.max(0, maximumUntrustedSkipSizeInBytes - (zipHandler.tokenizer.position - startOffset));
	return Math.max(0, maximumZipEntrySizeInBytes - zipHandler.knownSizeDescriptorScannedBytes);
}
async function readZipEntryData(zipHandler, zipHeader, { shouldBuffer, maximumDescriptorLength = maximumZipEntrySizeInBytes } = {}) {
	if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) return readZipDataDescriptorEntryWithLimit(zipHandler, {
		shouldBuffer,
		maximumLength: maximumDescriptorLength
	});
	if (!shouldBuffer) {
		await safeIgnore(zipHandler.tokenizer, zipHeader.compressedSize, {
			maximumLength: hasUnknownFileSize(zipHandler.tokenizer) ? maximumZipEntrySizeInBytes : zipHandler.tokenizer.fileInfo.size,
			reason: "ZIP entry compressed data"
		});
		return;
	}
	const maximumLength = getMaximumZipBufferedReadLength(zipHandler.tokenizer);
	if (!Number.isFinite(zipHeader.compressedSize) || zipHeader.compressedSize < 0 || zipHeader.compressedSize > maximumLength) throw new Error(`ZIP entry compressed data exceeds ${maximumLength} bytes`);
	const fileData = new Uint8Array(zipHeader.compressedSize);
	await zipHandler.tokenizer.readBuffer(fileData);
	return fileData;
}
ZipHandler.prototype.inflate = async function(zipHeader, fileData, callback) {
	if (zipHeader.compressedMethod === 0) return callback(fileData);
	if (zipHeader.compressedMethod !== 8) throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
	return callback(await decompressDeflateRawWithLimit(fileData, { maximumLength: maximumZipEntrySizeInBytes }));
};
ZipHandler.prototype.unzip = async function(fileCallback) {
	let stop = false;
	let zipEntryCount = 0;
	const zipScanStart = this.tokenizer.position;
	this.knownSizeDescriptorScannedBytes = 0;
	do {
		if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
		const zipHeader = await this.readLocalFileHeader();
		if (!zipHeader) break;
		zipEntryCount++;
		if (zipEntryCount > maximumZipEntryCount) throw new Error(`ZIP entry count exceeds ${maximumZipEntryCount}`);
		const next = fileCallback(zipHeader);
		stop = Boolean(next.stop);
		await this.tokenizer.ignore(zipHeader.extraFieldLength);
		const fileData = await readZipEntryData(this, zipHeader, {
			shouldBuffer: Boolean(next.handler),
			maximumDescriptorLength: Math.min(maximumZipEntrySizeInBytes, getRemainingZipScanBudget(this, zipScanStart))
		});
		if (next.handler) await this.inflate(zipHeader, fileData, next.handler);
		if (zipHeader.dataDescriptor) {
			const dataDescriptor = new Uint8Array(zipDataDescriptorLengthInBytes);
			await this.tokenizer.readBuffer(dataDescriptor);
			if (UINT32_LE.get(dataDescriptor, 0) !== zipDataDescriptorSignature) throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - dataDescriptor.length}`);
		}
		if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
	} while (!stop);
};
function createByteLimitedReadableStream(stream, maximumBytes) {
	const reader = stream.getReader();
	let emittedBytes = 0;
	let sourceDone = false;
	let sourceCanceled = false;
	const cancelSource = async (reason) => {
		if (sourceDone || sourceCanceled) return;
		sourceCanceled = true;
		await reader.cancel(reason);
	};
	return new ReadableStream({
		async pull(controller) {
			if (emittedBytes >= maximumBytes) {
				controller.close();
				await cancelSource();
				return;
			}
			const { done, value } = await reader.read();
			if (done || !value) {
				sourceDone = true;
				controller.close();
				return;
			}
			const remainingBytes = maximumBytes - emittedBytes;
			if (value.length > remainingBytes) {
				controller.enqueue(value.subarray(0, remainingBytes));
				emittedBytes += remainingBytes;
				controller.close();
				await cancelSource();
				return;
			}
			controller.enqueue(value);
			emittedBytes += value.length;
		},
		async cancel(reason) {
			await cancelSource(reason);
		}
	});
}
async function fileTypeFromBuffer(input, options) {
	return new FileTypeParser(options).fromBuffer(input);
}
function getFileTypeFromMimeType(mimeType) {
	mimeType = mimeType.toLowerCase();
	switch (mimeType) {
		case "application/epub+zip": return {
			ext: "epub",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.text": return {
			ext: "odt",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.text-template": return {
			ext: "ott",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.spreadsheet": return {
			ext: "ods",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.spreadsheet-template": return {
			ext: "ots",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.presentation": return {
			ext: "odp",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.presentation-template": return {
			ext: "otp",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.graphics": return {
			ext: "odg",
			mime: mimeType
		};
		case "application/vnd.oasis.opendocument.graphics-template": return {
			ext: "otg",
			mime: mimeType
		};
		case "application/vnd.openxmlformats-officedocument.presentationml.slideshow": return {
			ext: "ppsx",
			mime: mimeType
		};
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": return {
			ext: "xlsx",
			mime: mimeType
		};
		case "application/vnd.ms-excel.sheet.macroenabled": return {
			ext: "xlsm",
			mime: "application/vnd.ms-excel.sheet.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.template": return {
			ext: "xltx",
			mime: mimeType
		};
		case "application/vnd.ms-excel.template.macroenabled": return {
			ext: "xltm",
			mime: "application/vnd.ms-excel.template.macroenabled.12"
		};
		case "application/vnd.ms-powerpoint.slideshow.macroenabled": return {
			ext: "ppsm",
			mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": return {
			ext: "docx",
			mime: mimeType
		};
		case "application/vnd.ms-word.document.macroenabled": return {
			ext: "docm",
			mime: "application/vnd.ms-word.document.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.template": return {
			ext: "dotx",
			mime: mimeType
		};
		case "application/vnd.ms-word.template.macroenabledtemplate": return {
			ext: "dotm",
			mime: "application/vnd.ms-word.template.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.presentationml.template": return {
			ext: "potx",
			mime: mimeType
		};
		case "application/vnd.ms-powerpoint.template.macroenabled": return {
			ext: "potm",
			mime: "application/vnd.ms-powerpoint.template.macroenabled.12"
		};
		case "application/vnd.openxmlformats-officedocument.presentationml.presentation": return {
			ext: "pptx",
			mime: mimeType
		};
		case "application/vnd.ms-powerpoint.presentation.macroenabled": return {
			ext: "pptm",
			mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12"
		};
		case "application/vnd.ms-visio.drawing": return {
			ext: "vsdx",
			mime: "application/vnd.visio"
		};
		case "application/vnd.ms-package.3dmanufacturing-3dmodel+xml": return {
			ext: "3mf",
			mime: "model/3mf"
		};
	}
}
function _check(buffer, headers, options) {
	options = {
		offset: 0,
		...options
	};
	for (const [index, header] of headers.entries()) if (options.mask) {
		if (header !== (options.mask[index] & buffer[index + options.offset])) return false;
	} else if (header !== buffer[index + options.offset]) return false;
	return true;
}
function normalizeSampleSize(sampleSize) {
	if (!Number.isFinite(sampleSize)) return reasonableDetectionSizeInBytes;
	return Math.max(1, Math.trunc(sampleSize));
}
function readByobReaderWithSignal(reader, buffer, signal) {
	if (signal === void 0) return reader.read(buffer);
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			signal.removeEventListener("abort", onAbort);
		};
		const onAbort = () => {
			const abortReason = signal.reason;
			cleanup();
			(async () => {
				try {
					await reader.cancel(abortReason);
				} catch {}
			})();
			reject(abortReason);
		};
		signal.addEventListener("abort", onAbort, { once: true });
		(async () => {
			try {
				const result = await reader.read(buffer);
				cleanup();
				resolve(result);
			} catch (error) {
				cleanup();
				reject(error);
			}
		})();
	});
}
function normalizeMpegOffsetTolerance(mpegOffsetTolerance) {
	if (!Number.isFinite(mpegOffsetTolerance)) return 0;
	return Math.max(0, Math.min(maximumMpegOffsetTolerance, Math.trunc(mpegOffsetTolerance)));
}
function getKnownFileSizeOrMaximum(fileSize) {
	if (!Number.isFinite(fileSize)) return Number.MAX_SAFE_INTEGER;
	return Math.max(0, fileSize);
}
function hasUnknownFileSize(tokenizer) {
	const fileSize = tokenizer.fileInfo.size;
	return !Number.isFinite(fileSize) || fileSize === Number.MAX_SAFE_INTEGER;
}
function hasExceededUnknownSizeScanBudget(tokenizer, startOffset, maximumBytes) {
	return hasUnknownFileSize(tokenizer) && tokenizer.position - startOffset > maximumBytes;
}
function getMaximumZipBufferedReadLength(tokenizer) {
	const fileSize = tokenizer.fileInfo.size;
	const remainingBytes = Number.isFinite(fileSize) ? Math.max(0, fileSize - tokenizer.position) : Number.MAX_SAFE_INTEGER;
	return Math.min(remainingBytes, maximumZipBufferedReadSizeInBytes);
}
function isRecoverableZipError(error) {
	if (error instanceof EndOfStreamError) return true;
	if (error instanceof ParserHardLimitError) return true;
	if (!(error instanceof Error)) return false;
	if (recoverableZipErrorMessages.has(error.message)) return true;
	if (recoverableZipErrorCodes.has(error.code)) return true;
	for (const prefix of recoverableZipErrorMessagePrefixes) if (error.message.startsWith(prefix)) return true;
	return false;
}
function canReadZipEntryForDetection(zipHeader, maximumSize = maximumZipEntrySizeInBytes) {
	const sizes = [zipHeader.compressedSize, zipHeader.uncompressedSize];
	for (const size of sizes) if (!Number.isFinite(size) || size < 0 || size > maximumSize) return false;
	return true;
}
function createOpenXmlZipDetectionState() {
	return {
		hasContentTypesEntry: false,
		hasParsedContentTypesEntry: false,
		isParsingContentTypes: false,
		hasUnparseableContentTypes: false,
		hasWordDirectory: false,
		hasPresentationDirectory: false,
		hasSpreadsheetDirectory: false,
		hasThreeDimensionalModelEntry: false
	};
}
function updateOpenXmlZipDetectionStateFromFilename(openXmlState, filename) {
	if (filename.startsWith("word/")) openXmlState.hasWordDirectory = true;
	if (filename.startsWith("ppt/")) openXmlState.hasPresentationDirectory = true;
	if (filename.startsWith("xl/")) openXmlState.hasSpreadsheetDirectory = true;
	if (filename.startsWith("3D/") && filename.endsWith(".model")) openXmlState.hasThreeDimensionalModelEntry = true;
}
function getOpenXmlFileTypeFromZipEntries(openXmlState) {
	if (!openXmlState.hasContentTypesEntry || openXmlState.hasUnparseableContentTypes || openXmlState.isParsingContentTypes || openXmlState.hasParsedContentTypesEntry) return;
	if (openXmlState.hasWordDirectory) return {
		ext: "docx",
		mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	};
	if (openXmlState.hasPresentationDirectory) return {
		ext: "pptx",
		mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
	};
	if (openXmlState.hasSpreadsheetDirectory) return {
		ext: "xlsx",
		mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	};
	if (openXmlState.hasThreeDimensionalModelEntry) return {
		ext: "3mf",
		mime: "model/3mf"
	};
}
function getOpenXmlMimeTypeFromContentTypesXml(xmlContent) {
	const endPosition = xmlContent.indexOf(".main+xml\"");
	if (endPosition === -1) {
		const mimeType = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
		if (xmlContent.includes(`ContentType="${mimeType}"`)) return mimeType;
		return;
	}
	const truncatedContent = xmlContent.slice(0, endPosition);
	const firstQuotePosition = truncatedContent.lastIndexOf("\"");
	return truncatedContent.slice(firstQuotePosition + 1);
}
var FileTypeParser = class FileTypeParser {
	constructor(options) {
		const normalizedMpegOffsetTolerance = normalizeMpegOffsetTolerance(options?.mpegOffsetTolerance);
		this.options = {
			...options,
			mpegOffsetTolerance: normalizedMpegOffsetTolerance
		};
		this.detectors = [
			...this.options.customDetectors ?? [],
			{
				id: "core",
				detect: this.detectConfident
			},
			{
				id: "core.imprecise",
				detect: this.detectImprecise
			}
		];
		this.tokenizerOptions = { abortSignal: this.options.signal };
		this.gzipProbeDepth = 0;
	}
	getTokenizerOptions() {
		return { ...this.tokenizerOptions };
	}
	createTokenizerFromWebStream(stream) {
		return patchWebByobTokenizerClose(fromWebStream(stream, this.getTokenizerOptions()));
	}
	async parseTokenizer(tokenizer, detectionReentryCount = 0) {
		this.detectionReentryCount = detectionReentryCount;
		const initialPosition = tokenizer.position;
		for (const detector of this.detectors) {
			let fileType;
			try {
				fileType = await detector.detect(tokenizer);
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				if (error instanceof ParserHardLimitError) return;
				throw error;
			}
			if (fileType) return fileType;
			if (initialPosition !== tokenizer.position) return;
		}
	}
	async fromTokenizer(tokenizer) {
		try {
			return await this.parseTokenizer(tokenizer);
		} finally {
			await tokenizer.close();
		}
	}
	async fromBuffer(input) {
		if (!(input instanceof Uint8Array || input instanceof ArrayBuffer)) throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof input}\``);
		const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
		if (!(buffer?.length > 1)) return;
		return this.fromTokenizer(fromBuffer(buffer, this.getTokenizerOptions()));
	}
	async fromBlob(blob) {
		this.options.signal?.throwIfAborted();
		const tokenizer = fromBlob(blob, this.getTokenizerOptions());
		return this.fromTokenizer(tokenizer);
	}
	async fromStream(stream) {
		this.options.signal?.throwIfAborted();
		const tokenizer = this.createTokenizerFromWebStream(stream);
		return this.fromTokenizer(tokenizer);
	}
	async toDetectionStream(stream, options) {
		const sampleSize = normalizeSampleSize(options?.sampleSize ?? 4100);
		let detectedFileType;
		let firstChunk;
		const reader = stream.getReader({ mode: "byob" });
		try {
			const { value: chunk, done } = await readByobReaderWithSignal(reader, new Uint8Array(sampleSize), this.options.signal);
			firstChunk = chunk;
			if (!done && chunk) try {
				detectedFileType = await this.fromBuffer(chunk.subarray(0, sampleSize));
			} catch (error) {
				if (!(error instanceof EndOfStreamError)) throw error;
				detectedFileType = void 0;
			}
			firstChunk = chunk;
		} finally {
			reader.releaseLock();
		}
		const transformStream = new TransformStream({
			async start(controller) {
				controller.enqueue(firstChunk);
			},
			transform(chunk, controller) {
				controller.enqueue(chunk);
			}
		});
		const newStream = stream.pipeThrough(transformStream);
		newStream.fileType = detectedFileType;
		return newStream;
	}
	async detectGzip(tokenizer) {
		if (this.gzipProbeDepth >= maximumNestedGzipProbeDepth) return {
			ext: "gz",
			mime: "application/gzip"
		};
		const limitedInflatedStream = createByteLimitedReadableStream(new GzipHandler(tokenizer).inflate(), maximumNestedGzipDetectionSizeInBytes);
		const hasUnknownSize = hasUnknownFileSize(tokenizer);
		let timeout;
		let probeSignal;
		let probeParser;
		let compressedFileType;
		if (hasUnknownSize) {
			const timeoutController = new AbortController();
			timeout = setTimeout(() => {
				timeoutController.abort(new DOMException(`Operation timed out after ${unknownSizeGzipProbeTimeoutInMilliseconds} ms`, "TimeoutError"));
			}, unknownSizeGzipProbeTimeoutInMilliseconds);
			probeSignal = this.options.signal === void 0 ? timeoutController.signal : AbortSignal.any([this.options.signal, timeoutController.signal]);
			probeParser = new FileTypeParser({
				...this.options,
				signal: probeSignal
			});
			probeParser.gzipProbeDepth = this.gzipProbeDepth + 1;
		} else this.gzipProbeDepth++;
		try {
			compressedFileType = await (probeParser ?? this).fromStream(limitedInflatedStream);
		} catch (error) {
			if (error?.name === "AbortError" && probeSignal?.reason?.name !== "TimeoutError") throw error;
		} finally {
			clearTimeout(timeout);
			if (!hasUnknownSize) this.gzipProbeDepth--;
		}
		if (compressedFileType?.ext === "tar") return {
			ext: "tar.gz",
			mime: "application/gzip"
		};
		return {
			ext: "gz",
			mime: "application/gzip"
		};
	}
	check(header, options) {
		return _check(this.buffer, header, options);
	}
	checkString(header, options) {
		return this.check(stringToBytes(header, options?.encoding), options);
	}
	detectConfident = async (tokenizer) => {
		this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
		if (tokenizer.fileInfo.size === void 0) tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
		this.tokenizer = tokenizer;
		if (hasUnknownFileSize(tokenizer)) {
			await tokenizer.peekBuffer(this.buffer, {
				length: 3,
				mayBeLess: true
			});
			if (this.check([
				31,
				139,
				8
			])) return this.detectGzip(tokenizer);
		}
		await tokenizer.peekBuffer(this.buffer, {
			length: 32,
			mayBeLess: true
		});
		if (this.check([66, 77])) return {
			ext: "bmp",
			mime: "image/bmp"
		};
		if (this.check([11, 119])) return {
			ext: "ac3",
			mime: "audio/vnd.dolby.dd-raw"
		};
		if (this.check([120, 1])) return {
			ext: "dmg",
			mime: "application/x-apple-diskimage"
		};
		if (this.check([77, 90])) return {
			ext: "exe",
			mime: "application/x-msdownload"
		};
		if (this.check([37, 33])) {
			await tokenizer.peekBuffer(this.buffer, {
				length: 24,
				mayBeLess: true
			});
			if (this.checkString("PS-Adobe-", { offset: 2 }) && this.checkString(" EPSF-", { offset: 14 })) return {
				ext: "eps",
				mime: "application/eps"
			};
			return {
				ext: "ps",
				mime: "application/postscript"
			};
		}
		if (this.check([31, 160]) || this.check([31, 157])) return {
			ext: "Z",
			mime: "application/x-compress"
		};
		if (this.check([199, 113])) return {
			ext: "cpio",
			mime: "application/x-cpio"
		};
		if (this.check([96, 234])) return {
			ext: "arj",
			mime: "application/x-arj"
		};
		if (this.check([
			239,
			187,
			191
		])) {
			if (this.detectionReentryCount >= maximumDetectionReentryCount) return;
			this.detectionReentryCount++;
			await this.tokenizer.ignore(3);
			return this.detectConfident(tokenizer);
		}
		if (this.check([
			71,
			73,
			70
		])) return {
			ext: "gif",
			mime: "image/gif"
		};
		if (this.check([
			73,
			73,
			188
		])) return {
			ext: "jxr",
			mime: "image/vnd.ms-photo"
		};
		if (this.check([
			31,
			139,
			8
		])) return this.detectGzip(tokenizer);
		if (this.check([
			66,
			90,
			104
		])) return {
			ext: "bz2",
			mime: "application/x-bzip2"
		};
		if (this.checkString("ID3")) {
			await safeIgnore(tokenizer, 6, {
				maximumLength: 6,
				reason: "ID3 header prefix"
			});
			const id3HeaderLength = await tokenizer.readToken(uint32SyncSafeToken);
			const isUnknownFileSize = hasUnknownFileSize(tokenizer);
			if (!Number.isFinite(id3HeaderLength) || id3HeaderLength < 0 || isUnknownFileSize && (id3HeaderLength > maximumId3HeaderSizeInBytes || tokenizer.position + id3HeaderLength > maximumId3HeaderSizeInBytes)) return;
			if (tokenizer.position + id3HeaderLength > tokenizer.fileInfo.size) {
				if (isUnknownFileSize) return;
				return {
					ext: "mp3",
					mime: "audio/mpeg"
				};
			}
			try {
				await safeIgnore(tokenizer, id3HeaderLength, {
					maximumLength: isUnknownFileSize ? maximumId3HeaderSizeInBytes : tokenizer.fileInfo.size,
					reason: "ID3 payload"
				});
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				throw error;
			}
			if (this.detectionReentryCount >= maximumDetectionReentryCount) return;
			this.detectionReentryCount++;
			return this.parseTokenizer(tokenizer, this.detectionReentryCount);
		}
		if (this.checkString("MP+")) return {
			ext: "mpc",
			mime: "audio/x-musepack"
		};
		if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 })) return {
			ext: "swf",
			mime: "application/x-shockwave-flash"
		};
		if (this.check([
			255,
			216,
			255
		])) {
			if (this.check([247], { offset: 3 })) return {
				ext: "jls",
				mime: "image/jls"
			};
			return {
				ext: "jpg",
				mime: "image/jpeg"
			};
		}
		if (this.check([
			79,
			98,
			106,
			1
		])) return {
			ext: "avro",
			mime: "application/avro"
		};
		if (this.checkString("FLIF")) return {
			ext: "flif",
			mime: "image/flif"
		};
		if (this.checkString("8BPS")) return {
			ext: "psd",
			mime: "image/vnd.adobe.photoshop"
		};
		if (this.checkString("MPCK")) return {
			ext: "mpc",
			mime: "audio/x-musepack"
		};
		if (this.checkString("FORM")) return {
			ext: "aif",
			mime: "audio/aiff"
		};
		if (this.checkString("icns", { offset: 0 })) return {
			ext: "icns",
			mime: "image/icns"
		};
		if (this.check([
			80,
			75,
			3,
			4
		])) {
			let fileType;
			const openXmlState = createOpenXmlZipDetectionState();
			try {
				await new ZipHandler(tokenizer).unzip((zipHeader) => {
					updateOpenXmlZipDetectionStateFromFilename(openXmlState, zipHeader.filename);
					const isOpenXmlContentTypesEntry = zipHeader.filename === "[Content_Types].xml";
					const openXmlFileTypeFromEntries = getOpenXmlFileTypeFromZipEntries(openXmlState);
					if (!isOpenXmlContentTypesEntry && openXmlFileTypeFromEntries) {
						fileType = openXmlFileTypeFromEntries;
						return { stop: true };
					}
					switch (zipHeader.filename) {
						case "META-INF/mozilla.rsa":
							fileType = {
								ext: "xpi",
								mime: "application/x-xpinstall"
							};
							return { stop: true };
						case "META-INF/MANIFEST.MF":
							fileType = {
								ext: "jar",
								mime: "application/java-archive"
							};
							return { stop: true };
						case "mimetype":
							if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) return {};
							return {
								async handler(fileData) {
									fileType = getFileTypeFromMimeType(new TextDecoder("utf-8").decode(fileData).trim());
								},
								stop: true
							};
						case "[Content_Types].xml":
							openXmlState.hasContentTypesEntry = true;
							if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) {
								openXmlState.hasUnparseableContentTypes = true;
								return {};
							}
							openXmlState.isParsingContentTypes = true;
							return {
								async handler(fileData) {
									const mimeType = getOpenXmlMimeTypeFromContentTypesXml(new TextDecoder("utf-8").decode(fileData));
									if (mimeType) fileType = getFileTypeFromMimeType(mimeType);
									openXmlState.hasParsedContentTypesEntry = true;
									openXmlState.isParsingContentTypes = false;
								},
								stop: true
							};
						default:
							if (/classes\d*\.dex/.test(zipHeader.filename)) {
								fileType = {
									ext: "apk",
									mime: "application/vnd.android.package-archive"
								};
								return { stop: true };
							}
							return {};
					}
				});
			} catch (error) {
				if (!isRecoverableZipError(error)) throw error;
				if (openXmlState.isParsingContentTypes) {
					openXmlState.isParsingContentTypes = false;
					openXmlState.hasUnparseableContentTypes = true;
				}
			}
			return fileType ?? getOpenXmlFileTypeFromZipEntries(openXmlState) ?? {
				ext: "zip",
				mime: "application/zip"
			};
		}
		if (this.checkString("OggS")) {
			await tokenizer.ignore(28);
			const type = /* @__PURE__ */ new Uint8Array(8);
			await tokenizer.readBuffer(type);
			if (_check(type, [
				79,
				112,
				117,
				115,
				72,
				101,
				97,
				100
			])) return {
				ext: "opus",
				mime: "audio/ogg; codecs=opus"
			};
			if (_check(type, [
				128,
				116,
				104,
				101,
				111,
				114,
				97
			])) return {
				ext: "ogv",
				mime: "video/ogg"
			};
			if (_check(type, [
				1,
				118,
				105,
				100,
				101,
				111,
				0
			])) return {
				ext: "ogm",
				mime: "video/ogg"
			};
			if (_check(type, [
				127,
				70,
				76,
				65,
				67
			])) return {
				ext: "oga",
				mime: "audio/ogg"
			};
			if (_check(type, [
				83,
				112,
				101,
				101,
				120,
				32,
				32
			])) return {
				ext: "spx",
				mime: "audio/ogg"
			};
			if (_check(type, [
				1,
				118,
				111,
				114,
				98,
				105,
				115
			])) return {
				ext: "ogg",
				mime: "audio/ogg"
			};
			return {
				ext: "ogx",
				mime: "application/ogg"
			};
		}
		if (this.check([80, 75]) && (this.buffer[2] === 3 || this.buffer[2] === 5 || this.buffer[2] === 7) && (this.buffer[3] === 4 || this.buffer[3] === 6 || this.buffer[3] === 8)) return {
			ext: "zip",
			mime: "application/zip"
		};
		if (this.checkString("MThd")) return {
			ext: "mid",
			mime: "audio/midi"
		};
		if (this.checkString("wOFF") && (this.check([
			0,
			1,
			0,
			0
		], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) return {
			ext: "woff",
			mime: "font/woff"
		};
		if (this.checkString("wOF2") && (this.check([
			0,
			1,
			0,
			0
		], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) return {
			ext: "woff2",
			mime: "font/woff2"
		};
		if (this.check([
			212,
			195,
			178,
			161
		]) || this.check([
			161,
			178,
			195,
			212
		])) return {
			ext: "pcap",
			mime: "application/vnd.tcpdump.pcap"
		};
		if (this.checkString("DSD ")) return {
			ext: "dsf",
			mime: "audio/x-dsf"
		};
		if (this.checkString("LZIP")) return {
			ext: "lz",
			mime: "application/x-lzip"
		};
		if (this.checkString("fLaC")) return {
			ext: "flac",
			mime: "audio/flac"
		};
		if (this.check([
			66,
			80,
			71,
			251
		])) return {
			ext: "bpg",
			mime: "image/bpg"
		};
		if (this.checkString("wvpk")) return {
			ext: "wv",
			mime: "audio/wavpack"
		};
		if (this.checkString("%PDF")) return {
			ext: "pdf",
			mime: "application/pdf"
		};
		if (this.check([
			0,
			97,
			115,
			109
		])) return {
			ext: "wasm",
			mime: "application/wasm"
		};
		if (this.check([73, 73])) {
			const fileType = await this.readTiffHeader(false);
			if (fileType) return fileType;
		}
		if (this.check([77, 77])) {
			const fileType = await this.readTiffHeader(true);
			if (fileType) return fileType;
		}
		if (this.checkString("MAC ")) return {
			ext: "ape",
			mime: "audio/ape"
		};
		if (this.check([
			26,
			69,
			223,
			163
		])) {
			async function readField() {
				const msb = await tokenizer.peekNumber(UINT8);
				let mask = 128;
				let ic = 0;
				while ((msb & mask) === 0 && mask !== 0) {
					++ic;
					mask >>= 1;
				}
				const id = new Uint8Array(ic + 1);
				await safeReadBuffer(tokenizer, id, void 0, {
					maximumLength: id.length,
					reason: "EBML field"
				});
				return id;
			}
			async function readElement() {
				const idField = await readField();
				const lengthField = await readField();
				lengthField[0] ^= 128 >> lengthField.length - 1;
				const nrLength = Math.min(6, lengthField.length);
				const idView = new DataView(idField.buffer);
				const lengthView = new DataView(lengthField.buffer, lengthField.length - nrLength, nrLength);
				return {
					id: getUintBE(idView),
					len: getUintBE(lengthView)
				};
			}
			async function readChildren(children) {
				let ebmlElementCount = 0;
				while (children > 0) {
					ebmlElementCount++;
					if (ebmlElementCount > maximumEbmlElementCount) return;
					if (hasExceededUnknownSizeScanBudget(tokenizer, ebmlScanStart, maximumUntrustedSkipSizeInBytes)) return;
					const previousPosition = tokenizer.position;
					const element = await readElement();
					if (element.id === 17026) {
						if (element.len > maximumEbmlDocumentTypeSizeInBytes) return;
						const documentTypeLength = getSafeBound(element.len, maximumEbmlDocumentTypeSizeInBytes, "EBML DocType");
						return (await tokenizer.readToken(new StringType(documentTypeLength))).replaceAll(/\00.*$/g, "");
					}
					if (hasUnknownFileSize(tokenizer) && (!Number.isFinite(element.len) || element.len < 0 || element.len > maximumEbmlElementPayloadSizeInBytes)) return;
					await safeIgnore(tokenizer, element.len, {
						maximumLength: hasUnknownFileSize(tokenizer) ? maximumEbmlElementPayloadSizeInBytes : tokenizer.fileInfo.size,
						reason: "EBML payload"
					});
					--children;
					if (tokenizer.position <= previousPosition) return;
				}
			}
			const rootElement = await readElement();
			const ebmlScanStart = tokenizer.position;
			switch (await readChildren(rootElement.len)) {
				case "webm": return {
					ext: "webm",
					mime: "video/webm"
				};
				case "matroska": return {
					ext: "mkv",
					mime: "video/matroska"
				};
				default: return;
			}
		}
		if (this.checkString("SQLi")) return {
			ext: "sqlite",
			mime: "application/x-sqlite3"
		};
		if (this.check([
			78,
			69,
			83,
			26
		])) return {
			ext: "nes",
			mime: "application/x-nintendo-nes-rom"
		};
		if (this.checkString("Cr24")) return {
			ext: "crx",
			mime: "application/x-google-chrome-extension"
		};
		if (this.checkString("MSCF") || this.checkString("ISc(")) return {
			ext: "cab",
			mime: "application/vnd.ms-cab-compressed"
		};
		if (this.check([
			237,
			171,
			238,
			219
		])) return {
			ext: "rpm",
			mime: "application/x-rpm"
		};
		if (this.check([
			197,
			208,
			211,
			198
		])) return {
			ext: "eps",
			mime: "application/eps"
		};
		if (this.check([
			40,
			181,
			47,
			253
		])) return {
			ext: "zst",
			mime: "application/zstd"
		};
		if (this.check([
			127,
			69,
			76,
			70
		])) return {
			ext: "elf",
			mime: "application/x-elf"
		};
		if (this.check([
			33,
			66,
			68,
			78
		])) return {
			ext: "pst",
			mime: "application/vnd.ms-outlook"
		};
		if (this.checkString("PAR1") || this.checkString("PARE")) return {
			ext: "parquet",
			mime: "application/vnd.apache.parquet"
		};
		if (this.checkString("ttcf")) return {
			ext: "ttc",
			mime: "font/collection"
		};
		if (this.check([
			254,
			237,
			250,
			206
		]) || this.check([
			254,
			237,
			250,
			207
		]) || this.check([
			206,
			250,
			237,
			254
		]) || this.check([
			207,
			250,
			237,
			254
		])) return {
			ext: "macho",
			mime: "application/x-mach-binary"
		};
		if (this.check([
			4,
			34,
			77,
			24
		])) return {
			ext: "lz4",
			mime: "application/x-lz4"
		};
		if (this.checkString("regf")) return {
			ext: "dat",
			mime: "application/x-ft-windows-registry-hive"
		};
		if (this.checkString("$FL2") || this.checkString("$FL3")) return {
			ext: "sav",
			mime: "application/x-spss-sav"
		};
		if (this.check([
			79,
			84,
			84,
			79,
			0
		])) return {
			ext: "otf",
			mime: "font/otf"
		};
		if (this.checkString("#!AMR")) return {
			ext: "amr",
			mime: "audio/amr"
		};
		if (this.checkString("{\\rtf")) return {
			ext: "rtf",
			mime: "application/rtf"
		};
		if (this.check([
			70,
			76,
			86,
			1
		])) return {
			ext: "flv",
			mime: "video/x-flv"
		};
		if (this.checkString("IMPM")) return {
			ext: "it",
			mime: "audio/x-it"
		};
		if (this.checkString("-lh0-", { offset: 2 }) || this.checkString("-lh1-", { offset: 2 }) || this.checkString("-lh2-", { offset: 2 }) || this.checkString("-lh3-", { offset: 2 }) || this.checkString("-lh4-", { offset: 2 }) || this.checkString("-lh5-", { offset: 2 }) || this.checkString("-lh6-", { offset: 2 }) || this.checkString("-lh7-", { offset: 2 }) || this.checkString("-lzs-", { offset: 2 }) || this.checkString("-lz4-", { offset: 2 }) || this.checkString("-lz5-", { offset: 2 }) || this.checkString("-lhd-", { offset: 2 })) return {
			ext: "lzh",
			mime: "application/x-lzh-compressed"
		};
		if (this.check([
			0,
			0,
			1,
			186
		])) {
			if (this.check([33], {
				offset: 4,
				mask: [241]
			})) return {
				ext: "mpg",
				mime: "video/MP1S"
			};
			if (this.check([68], {
				offset: 4,
				mask: [196]
			})) return {
				ext: "mpg",
				mime: "video/MP2P"
			};
		}
		if (this.checkString("ITSF")) return {
			ext: "chm",
			mime: "application/vnd.ms-htmlhelp"
		};
		if (this.check([
			202,
			254,
			186,
			190
		])) {
			const machOArchitectureCount = UINT32_BE.get(this.buffer, 4);
			const javaClassFileMajorVersion = UINT16_BE.get(this.buffer, 6);
			if (machOArchitectureCount > 0 && machOArchitectureCount <= 30) return {
				ext: "macho",
				mime: "application/x-mach-binary"
			};
			if (javaClassFileMajorVersion > 30) return {
				ext: "class",
				mime: "application/java-vm"
			};
		}
		if (this.checkString(".RMF")) return {
			ext: "rm",
			mime: "application/vnd.rn-realmedia"
		};
		if (this.checkString("DRACO")) return {
			ext: "drc",
			mime: "application/vnd.google.draco"
		};
		if (this.check([
			253,
			55,
			122,
			88,
			90,
			0
		])) return {
			ext: "xz",
			mime: "application/x-xz"
		};
		if (this.checkString("<?xml ")) return {
			ext: "xml",
			mime: "application/xml"
		};
		if (this.check([
			55,
			122,
			188,
			175,
			39,
			28
		])) return {
			ext: "7z",
			mime: "application/x-7z-compressed"
		};
		if (this.check([
			82,
			97,
			114,
			33,
			26,
			7
		]) && (this.buffer[6] === 0 || this.buffer[6] === 1)) return {
			ext: "rar",
			mime: "application/x-rar-compressed"
		};
		if (this.checkString("solid ")) return {
			ext: "stl",
			mime: "model/stl"
		};
		if (this.checkString("AC")) {
			const version = new StringType(4, "latin1").get(this.buffer, 2);
			if (version.match("^d*") && version >= 1e3 && version <= 1050) return {
				ext: "dwg",
				mime: "image/vnd.dwg"
			};
		}
		if (this.checkString("070707")) return {
			ext: "cpio",
			mime: "application/x-cpio"
		};
		if (this.checkString("BLENDER")) return {
			ext: "blend",
			mime: "application/x-blender"
		};
		if (this.checkString("!<arch>")) {
			await tokenizer.ignore(8);
			if (await tokenizer.readToken(new StringType(13, "ascii")) === "debian-binary") return {
				ext: "deb",
				mime: "application/x-deb"
			};
			return {
				ext: "ar",
				mime: "application/x-unix-archive"
			};
		}
		if (this.checkString("WEBVTT") && [
			"\n",
			"\r",
			"	",
			" ",
			"\0"
		].some((char7) => this.checkString(char7, { offset: 6 }))) return {
			ext: "vtt",
			mime: "text/vtt"
		};
		if (this.check([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		])) {
			const pngFileType = {
				ext: "png",
				mime: "image/png"
			};
			const apngFileType = {
				ext: "apng",
				mime: "image/apng"
			};
			await tokenizer.ignore(8);
			async function readChunkHeader() {
				return {
					length: await tokenizer.readToken(INT32_BE),
					type: await tokenizer.readToken(new StringType(4, "latin1"))
				};
			}
			const isUnknownPngStream = hasUnknownFileSize(tokenizer);
			const pngScanStart = tokenizer.position;
			let pngChunkCount = 0;
			let hasSeenImageHeader = false;
			do {
				pngChunkCount++;
				if (pngChunkCount > maximumPngChunkCount) break;
				if (hasExceededUnknownSizeScanBudget(tokenizer, pngScanStart, maximumPngStreamScanBudgetInBytes)) break;
				const previousPosition = tokenizer.position;
				const chunk = await readChunkHeader();
				if (chunk.length < 0) return;
				if (chunk.type === "IHDR") {
					if (chunk.length !== 13) return;
					hasSeenImageHeader = true;
				}
				switch (chunk.type) {
					case "IDAT": return pngFileType;
					case "acTL": return apngFileType;
					default:
						if (!hasSeenImageHeader && chunk.type !== "CgBI") return;
						if (isUnknownPngStream && chunk.length > maximumPngChunkSizeInBytes) return hasSeenImageHeader && isPngAncillaryChunk(chunk.type) ? pngFileType : void 0;
						try {
							await safeIgnore(tokenizer, chunk.length + 4, {
								maximumLength: isUnknownPngStream ? 1048580 : tokenizer.fileInfo.size,
								reason: "PNG chunk payload"
							});
						} catch (error) {
							if (!isUnknownPngStream && (error instanceof ParserHardLimitError || error instanceof EndOfStreamError)) return pngFileType;
							throw error;
						}
				}
				if (tokenizer.position <= previousPosition) break;
			} while (tokenizer.position + 8 < tokenizer.fileInfo.size);
			return pngFileType;
		}
		if (this.check([
			65,
			82,
			82,
			79,
			87,
			49,
			0,
			0
		])) return {
			ext: "arrow",
			mime: "application/vnd.apache.arrow.file"
		};
		if (this.check([
			103,
			108,
			84,
			70,
			2,
			0,
			0,
			0
		])) return {
			ext: "glb",
			mime: "model/gltf-binary"
		};
		if (this.check([
			102,
			114,
			101,
			101
		], { offset: 4 }) || this.check([
			109,
			100,
			97,
			116
		], { offset: 4 }) || this.check([
			109,
			111,
			111,
			118
		], { offset: 4 }) || this.check([
			119,
			105,
			100,
			101
		], { offset: 4 })) return {
			ext: "mov",
			mime: "video/quicktime"
		};
		if (this.check([
			73,
			73,
			82,
			79,
			8,
			0,
			0,
			0,
			24
		])) return {
			ext: "orf",
			mime: "image/x-olympus-orf"
		};
		if (this.checkString("gimp xcf ")) return {
			ext: "xcf",
			mime: "image/x-xcf"
		};
		if (this.checkString("ftyp", { offset: 4 }) && (this.buffer[8] & 96) !== 0) {
			const brandMajor = new StringType(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
			switch (brandMajor) {
				case "avif":
				case "avis": return {
					ext: "avif",
					mime: "image/avif"
				};
				case "mif1": return {
					ext: "heic",
					mime: "image/heif"
				};
				case "msf1": return {
					ext: "heic",
					mime: "image/heif-sequence"
				};
				case "heic":
				case "heix": return {
					ext: "heic",
					mime: "image/heic"
				};
				case "hevc":
				case "hevx": return {
					ext: "heic",
					mime: "image/heic-sequence"
				};
				case "qt": return {
					ext: "mov",
					mime: "video/quicktime"
				};
				case "M4V":
				case "M4VH":
				case "M4VP": return {
					ext: "m4v",
					mime: "video/x-m4v"
				};
				case "M4P": return {
					ext: "m4p",
					mime: "video/mp4"
				};
				case "M4B": return {
					ext: "m4b",
					mime: "audio/mp4"
				};
				case "M4A": return {
					ext: "m4a",
					mime: "audio/x-m4a"
				};
				case "F4V": return {
					ext: "f4v",
					mime: "video/mp4"
				};
				case "F4P": return {
					ext: "f4p",
					mime: "video/mp4"
				};
				case "F4A": return {
					ext: "f4a",
					mime: "audio/mp4"
				};
				case "F4B": return {
					ext: "f4b",
					mime: "audio/mp4"
				};
				case "crx": return {
					ext: "cr3",
					mime: "image/x-canon-cr3"
				};
				default:
					if (brandMajor.startsWith("3g")) {
						if (brandMajor.startsWith("3g2")) return {
							ext: "3g2",
							mime: "video/3gpp2"
						};
						return {
							ext: "3gp",
							mime: "video/3gpp"
						};
					}
					return {
						ext: "mp4",
						mime: "video/mp4"
					};
			}
		}
		if (this.checkString("REGEDIT4\r\n")) return {
			ext: "reg",
			mime: "application/x-ms-regedit"
		};
		if (this.check([
			82,
			73,
			70,
			70
		])) {
			if (this.checkString("WEBP", { offset: 8 })) return {
				ext: "webp",
				mime: "image/webp"
			};
			if (this.check([
				65,
				86,
				73
			], { offset: 8 })) return {
				ext: "avi",
				mime: "video/vnd.avi"
			};
			if (this.check([
				87,
				65,
				86,
				69
			], { offset: 8 })) return {
				ext: "wav",
				mime: "audio/wav"
			};
			if (this.check([
				81,
				76,
				67,
				77
			], { offset: 8 })) return {
				ext: "qcp",
				mime: "audio/qcelp"
			};
		}
		if (this.check([
			73,
			73,
			85,
			0,
			24,
			0,
			0,
			0,
			136,
			231,
			116,
			216
		])) return {
			ext: "rw2",
			mime: "image/x-panasonic-rw2"
		};
		if (this.check([
			48,
			38,
			178,
			117,
			142,
			102,
			207,
			17,
			166,
			217
		])) {
			let isMalformedAsf = false;
			try {
				async function readHeader() {
					const guid = /* @__PURE__ */ new Uint8Array(16);
					await safeReadBuffer(tokenizer, guid, void 0, {
						maximumLength: guid.length,
						reason: "ASF header GUID"
					});
					return {
						id: guid,
						size: Number(await tokenizer.readToken(UINT64_LE))
					};
				}
				await safeIgnore(tokenizer, 30, {
					maximumLength: 30,
					reason: "ASF header prelude"
				});
				const isUnknownFileSize = hasUnknownFileSize(tokenizer);
				const asfHeaderScanStart = tokenizer.position;
				let asfHeaderObjectCount = 0;
				while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
					asfHeaderObjectCount++;
					if (asfHeaderObjectCount > maximumAsfHeaderObjectCount) break;
					if (hasExceededUnknownSizeScanBudget(tokenizer, asfHeaderScanStart, maximumUntrustedSkipSizeInBytes)) break;
					const previousPosition = tokenizer.position;
					const header = await readHeader();
					let payload = header.size - 24;
					if (!Number.isFinite(payload) || payload < 0) {
						isMalformedAsf = true;
						break;
					}
					if (_check(header.id, [
						145,
						7,
						220,
						183,
						183,
						169,
						207,
						17,
						142,
						230,
						0,
						192,
						12,
						32,
						83,
						101
					])) {
						const typeId = /* @__PURE__ */ new Uint8Array(16);
						payload -= await safeReadBuffer(tokenizer, typeId, void 0, {
							maximumLength: typeId.length,
							reason: "ASF stream type GUID"
						});
						if (_check(typeId, [
							64,
							158,
							105,
							248,
							77,
							91,
							207,
							17,
							168,
							253,
							0,
							128,
							95,
							92,
							68,
							43
						])) return {
							ext: "asf",
							mime: "audio/x-ms-asf"
						};
						if (_check(typeId, [
							192,
							239,
							25,
							188,
							77,
							91,
							207,
							17,
							168,
							253,
							0,
							128,
							95,
							92,
							68,
							43
						])) return {
							ext: "asf",
							mime: "video/x-ms-asf"
						};
						break;
					}
					if (isUnknownFileSize && payload > maximumAsfHeaderPayloadSizeInBytes) {
						isMalformedAsf = true;
						break;
					}
					await safeIgnore(tokenizer, payload, {
						maximumLength: isUnknownFileSize ? maximumAsfHeaderPayloadSizeInBytes : tokenizer.fileInfo.size,
						reason: "ASF header payload"
					});
					if (tokenizer.position <= previousPosition) {
						isMalformedAsf = true;
						break;
					}
				}
			} catch (error) {
				if (error instanceof EndOfStreamError || error instanceof ParserHardLimitError) {
					if (hasUnknownFileSize(tokenizer)) isMalformedAsf = true;
				} else throw error;
			}
			if (isMalformedAsf) return;
			return {
				ext: "asf",
				mime: "application/vnd.ms-asf"
			};
		}
		if (this.check([
			171,
			75,
			84,
			88,
			32,
			49,
			49,
			187,
			13,
			10,
			26,
			10
		])) return {
			ext: "ktx",
			mime: "image/ktx"
		};
		if ((this.check([
			126,
			16,
			4
		]) || this.check([
			126,
			24,
			4
		])) && this.check([
			48,
			77,
			73,
			69
		], { offset: 4 })) return {
			ext: "mie",
			mime: "application/x-mie"
		};
		if (this.check([
			39,
			10,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		], { offset: 2 })) return {
			ext: "shp",
			mime: "application/x-esri-shape"
		};
		if (this.check([
			255,
			79,
			255,
			81
		])) return {
			ext: "j2c",
			mime: "image/j2c"
		};
		if (this.check([
			0,
			0,
			0,
			12,
			106,
			80,
			32,
			32,
			13,
			10,
			135,
			10
		])) {
			await tokenizer.ignore(20);
			switch (await tokenizer.readToken(new StringType(4, "ascii"))) {
				case "jp2 ": return {
					ext: "jp2",
					mime: "image/jp2"
				};
				case "jpx ": return {
					ext: "jpx",
					mime: "image/jpx"
				};
				case "jpm ": return {
					ext: "jpm",
					mime: "image/jpm"
				};
				case "mjp2": return {
					ext: "mj2",
					mime: "image/mj2"
				};
				default: return;
			}
		}
		if (this.check([255, 10]) || this.check([
			0,
			0,
			0,
			12,
			74,
			88,
			76,
			32,
			13,
			10,
			135,
			10
		])) return {
			ext: "jxl",
			mime: "image/jxl"
		};
		if (this.check([254, 255])) {
			if (this.checkString("<?xml ", {
				offset: 2,
				encoding: "utf-16be"
			})) return {
				ext: "xml",
				mime: "application/xml"
			};
			return;
		}
		if (this.check([
			208,
			207,
			17,
			224,
			161,
			177,
			26,
			225
		])) return {
			ext: "cfb",
			mime: "application/x-cfb"
		};
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(256, tokenizer.fileInfo.size),
			mayBeLess: true
		});
		if (this.check([
			97,
			99,
			115,
			112
		], { offset: 36 })) return {
			ext: "icc",
			mime: "application/vnd.iccprofile"
		};
		if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 })) return {
			ext: "ace",
			mime: "application/x-ace-compressed"
		};
		if (this.checkString("BEGIN:")) {
			if (this.checkString("VCARD", { offset: 6 })) return {
				ext: "vcf",
				mime: "text/vcard"
			};
			if (this.checkString("VCALENDAR", { offset: 6 })) return {
				ext: "ics",
				mime: "text/calendar"
			};
		}
		if (this.checkString("FUJIFILMCCD-RAW")) return {
			ext: "raf",
			mime: "image/x-fujifilm-raf"
		};
		if (this.checkString("Extended Module:")) return {
			ext: "xm",
			mime: "audio/x-xm"
		};
		if (this.checkString("Creative Voice File")) return {
			ext: "voc",
			mime: "audio/x-voc"
		};
		if (this.check([
			4,
			0,
			0,
			0
		]) && this.buffer.length >= 16) {
			const jsonSize = new DataView(this.buffer.buffer).getUint32(12, true);
			if (jsonSize > 12 && this.buffer.length >= jsonSize + 16) try {
				const header = new TextDecoder().decode(this.buffer.subarray(16, jsonSize + 16));
				if (JSON.parse(header).files) return {
					ext: "asar",
					mime: "application/x-asar"
				};
			} catch {}
		}
		if (this.check([
			6,
			14,
			43,
			52,
			2,
			5,
			1,
			1,
			13,
			1,
			2,
			1,
			1,
			2
		])) return {
			ext: "mxf",
			mime: "application/mxf"
		};
		if (this.checkString("SCRM", { offset: 44 })) return {
			ext: "s3m",
			mime: "audio/x-s3m"
		};
		if (this.check([71]) && this.check([71], { offset: 188 })) return {
			ext: "mts",
			mime: "video/mp2t"
		};
		if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 })) return {
			ext: "mts",
			mime: "video/mp2t"
		};
		if (this.check([
			66,
			79,
			79,
			75,
			77,
			79,
			66,
			73
		], { offset: 60 })) return {
			ext: "mobi",
			mime: "application/x-mobipocket-ebook"
		};
		if (this.check([
			68,
			73,
			67,
			77
		], { offset: 128 })) return {
			ext: "dcm",
			mime: "application/dicom"
		};
		if (this.check([
			76,
			0,
			0,
			0,
			1,
			20,
			2,
			0,
			0,
			0,
			0,
			0,
			192,
			0,
			0,
			0,
			0,
			0,
			0,
			70
		])) return {
			ext: "lnk",
			mime: "application/x.ms.shortcut"
		};
		if (this.check([
			98,
			111,
			111,
			107,
			0,
			0,
			0,
			0,
			109,
			97,
			114,
			107,
			0,
			0,
			0,
			0
		])) return {
			ext: "alias",
			mime: "application/x.apple.alias"
		};
		if (this.checkString("Kaydara FBX Binary  \0")) return {
			ext: "fbx",
			mime: "application/x.autodesk.fbx"
		};
		if (this.check([76, 80], { offset: 34 }) && (this.check([
			0,
			0,
			1
		], { offset: 8 }) || this.check([
			1,
			0,
			2
		], { offset: 8 }) || this.check([
			2,
			0,
			2
		], { offset: 8 }))) return {
			ext: "eot",
			mime: "application/vnd.ms-fontobject"
		};
		if (this.check([
			6,
			6,
			237,
			245,
			216,
			29,
			70,
			229,
			189,
			49,
			239,
			231,
			254,
			116,
			183,
			29
		])) return {
			ext: "indd",
			mime: "application/x-indesign"
		};
		if (this.check([
			255,
			255,
			0,
			0,
			7,
			0,
			0,
			0,
			4,
			0,
			0,
			0,
			1,
			0,
			1,
			0
		]) || this.check([
			0,
			0,
			255,
			255,
			0,
			0,
			0,
			7,
			0,
			0,
			0,
			4,
			0,
			1,
			0,
			1
		])) return {
			ext: "jmp",
			mime: "application/x-jmp-data"
		};
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(512, tokenizer.fileInfo.size),
			mayBeLess: true
		});
		if (this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([
			0,
			0,
			0,
			0,
			0,
			0
		], { offset: 257 }) && tarHeaderChecksumMatches(this.buffer)) return {
			ext: "tar",
			mime: "application/x-tar"
		};
		if (this.check([255, 254])) {
			const encoding = "utf-16le";
			if (this.checkString("<?xml ", {
				offset: 2,
				encoding
			})) return {
				ext: "xml",
				mime: "application/xml"
			};
			if (this.check([255, 14], { offset: 2 }) && this.checkString("SketchUp Model", {
				offset: 4,
				encoding
			})) return {
				ext: "skp",
				mime: "application/vnd.sketchup.skp"
			};
			if (this.checkString("Windows Registry Editor Version 5.00\r\n", {
				offset: 2,
				encoding
			})) return {
				ext: "reg",
				mime: "application/x-ms-regedit"
			};
			return;
		}
		if (this.checkString("-----BEGIN PGP MESSAGE-----")) return {
			ext: "pgp",
			mime: "application/pgp-encrypted"
		};
	};
	detectImprecise = async (tokenizer) => {
		this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
		const fileSize = getKnownFileSizeOrMaximum(tokenizer.fileInfo.size);
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(8, fileSize),
			mayBeLess: true
		});
		if (this.check([
			0,
			0,
			1,
			186
		]) || this.check([
			0,
			0,
			1,
			179
		])) return {
			ext: "mpg",
			mime: "video/mpeg"
		};
		if (this.check([
			0,
			1,
			0,
			0,
			0
		])) return {
			ext: "ttf",
			mime: "font/ttf"
		};
		if (this.check([
			0,
			0,
			1,
			0
		])) return {
			ext: "ico",
			mime: "image/x-icon"
		};
		if (this.check([
			0,
			0,
			2,
			0
		])) return {
			ext: "cur",
			mime: "image/x-icon"
		};
		await tokenizer.peekBuffer(this.buffer, {
			length: Math.min(2 + this.options.mpegOffsetTolerance, fileSize),
			mayBeLess: true
		});
		if (this.buffer.length >= 2 + this.options.mpegOffsetTolerance) for (let depth = 0; depth <= this.options.mpegOffsetTolerance; ++depth) {
			const type = this.scanMpeg(depth);
			if (type) return type;
		}
	};
	async readTiffTag(bigEndian) {
		const tagId = await this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
		await this.tokenizer.ignore(10);
		switch (tagId) {
			case 50341: return {
				ext: "arw",
				mime: "image/x-sony-arw"
			};
			case 50706: return {
				ext: "dng",
				mime: "image/x-adobe-dng"
			};
		}
	}
	async readTiffIFD(bigEndian) {
		const numberOfTags = await this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
		if (numberOfTags > maximumTiffTagCount) return;
		if (hasUnknownFileSize(this.tokenizer) && 2 + numberOfTags * 12 > maximumTiffIfdOffsetInBytes) return;
		for (let n = 0; n < numberOfTags; ++n) {
			const fileType = await this.readTiffTag(bigEndian);
			if (fileType) return fileType;
		}
	}
	async readTiffHeader(bigEndian) {
		const tiffFileType = {
			ext: "tif",
			mime: "image/tiff"
		};
		const version = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 2);
		const ifdOffset = (bigEndian ? UINT32_BE : UINT32_LE).get(this.buffer, 4);
		if (version === 42) {
			if (ifdOffset >= 6) {
				if (this.checkString("CR", { offset: 8 })) return {
					ext: "cr2",
					mime: "image/x-canon-cr2"
				};
				if (ifdOffset >= 8) {
					const someId1 = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 8);
					const someId2 = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 10);
					if (someId1 === 28 && someId2 === 254 || someId1 === 31 && someId2 === 11) return {
						ext: "nef",
						mime: "image/x-nikon-nef"
					};
				}
			}
			if (hasUnknownFileSize(this.tokenizer) && ifdOffset > maximumTiffStreamIfdOffsetInBytes) return tiffFileType;
			const maximumTiffOffset = hasUnknownFileSize(this.tokenizer) ? maximumTiffIfdOffsetInBytes : this.tokenizer.fileInfo.size;
			try {
				await safeIgnore(this.tokenizer, ifdOffset, {
					maximumLength: maximumTiffOffset,
					reason: "TIFF IFD offset"
				});
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				throw error;
			}
			let fileType;
			try {
				fileType = await this.readTiffIFD(bigEndian);
			} catch (error) {
				if (error instanceof EndOfStreamError) return;
				throw error;
			}
			return fileType ?? tiffFileType;
		}
		if (version === 43) return tiffFileType;
	}
	/**
	Scan check MPEG 1 or 2 Layer 3 header, or 'layer 0' for ADTS (MPEG sync-word 0xFFE).
	
	@param offset - Offset to scan for sync-preamble.
	@returns {{ext: string, mime: string}}
	*/
	scanMpeg(offset) {
		if (this.check([255, 224], {
			offset,
			mask: [255, 224]
		})) {
			if (this.check([16], {
				offset: offset + 1,
				mask: [22]
			})) {
				if (this.check([8], {
					offset: offset + 1,
					mask: [8]
				})) return {
					ext: "aac",
					mime: "audio/aac"
				};
				return {
					ext: "aac",
					mime: "audio/aac"
				};
			}
			if (this.check([2], {
				offset: offset + 1,
				mask: [6]
			})) return {
				ext: "mp3",
				mime: "audio/mpeg"
			};
			if (this.check([4], {
				offset: offset + 1,
				mask: [6]
			})) return {
				ext: "mp2",
				mime: "audio/mpeg"
			};
			if (this.check([6], {
				offset: offset + 1,
				mask: [6]
			})) return {
				ext: "mp1",
				mime: "audio/mpeg"
			};
		}
	}
};
new Set(extensions);
new Set(mimeTypes);
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/object-storage/dist/resolveBlobContentType.js
var DEFAULT_CONTENT_TYPE = "application/octet-stream";
function isUsableContentType(contentType) {
	if (!contentType) return false;
	const trimmed = contentType.trim();
	return trimmed.length > 0 && trimmed !== DEFAULT_CONTENT_TYPE;
}
async function resolveBlobContentType(bytes, hint) {
	if (isUsableContentType(hint)) return hint.trim();
	return (await fileTypeFromBuffer(bytes))?.mime ?? DEFAULT_CONTENT_TYPE;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/@caffeineai+object-storage@1.1.2/node_modules/@caffeineai/object-storage/dist/StorageClient.js
var MAXIMUM_CONCURRENT_UPLOADS = 10;
var MAX_RETRIES = 3;
var BASE_DELAY_MS = 1e3;
var MAX_DELAY_MS = 3e4;
var GATEWAY_VERSION = "v1";
var HASH_ALGORITHM = "SHA-256";
var SHA256_PREFIX = "sha256:";
var DOMAIN_SEPARATOR_FOR_CHUNKS = new TextEncoder().encode("icfs-chunk/");
var DOMAIN_SEPARATOR_FOR_METADATA = new TextEncoder().encode("icfs-metadata/");
var DOMAIN_SEPARATOR_FOR_NODES = new TextEncoder().encode("ynode/");
async function withRetry(operation) {
	let lastError;
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) try {
		return await operation();
	} catch (error) {
		lastError = error instanceof Error ? error : new Error(String(error));
		const shouldRetry = isRetriableError(error);
		if (attempt === MAX_RETRIES || !shouldRetry) {
			if (!shouldRetry && attempt < MAX_RETRIES) console.warn(`Non-retriable error encountered: ${lastError.message}. Not retrying.`);
			throw error;
		}
		const delay = Math.min(BASE_DELAY_MS * 2 ** attempt + Math.random() * 1e3, MAX_DELAY_MS);
		console.warn(`Request failed (attempt ${attempt + 1}/4): ${lastError.message}. Retrying in ${Math.round(delay)}ms...`);
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
	throw lastError || /* @__PURE__ */ new Error("Unknown error occurred during retry attempts");
}
function isRetriableError(error) {
	const errorMessage = error?.message?.toLowerCase() || "";
	if (error?.response?.status) {
		const status = error.response.status;
		if (status === 408 || status === 429) return true;
		if (status >= 400 && status < 500) return false;
		if (status >= 500) return true;
	}
	if (errorMessage.includes("ssl") || errorMessage.includes("tls") || errorMessage.includes("network error") || errorMessage.includes("connection") || errorMessage.includes("timeout") || errorMessage.includes("fetch")) return true;
	if (errorMessage.includes("validation") || errorMessage.includes("invalid") || errorMessage.includes("malformed") || errorMessage.includes("unauthorized") || errorMessage.includes("forbidden") || errorMessage.includes("not found")) return false;
	return true;
}
function validateHashFormat(hash, context) {
	if (!hash) throw new Error(`${context}: Hash cannot be empty`);
	if (!hash.startsWith(SHA256_PREFIX)) throw new Error(`${context}: Invalid hash format. Expected format: ${SHA256_PREFIX}<64-char-hex>, got: ${hash}`);
	const hexPart = hash.substring(7);
	if (hexPart.length !== 64) throw new Error(`${context}: Invalid hash format. Expected 64 hex characters after ${SHA256_PREFIX}, got ${hexPart.length} characters: ${hash}`);
	if (!/^[0-9a-f]{64}$/i.test(hexPart)) throw new Error(`${context}: Invalid hash format. Hash must contain only hex characters (0-9, a-f), got: ${hash}`);
}
var YHash = class YHash {
	bytes;
	constructor(bytes) {
		if (bytes.length !== 32) throw new Error(`YHash must be exactly 32 bytes, got ${bytes.length}`);
		this.bytes = new Uint8Array(bytes);
	}
	static async fromNodes(left, right) {
		const leftBytes = left instanceof YHash ? left.bytes : new TextEncoder().encode("UNBALANCED");
		const rightBytes = right instanceof YHash ? right.bytes : new TextEncoder().encode("UNBALANCED");
		const combined = new Uint8Array(DOMAIN_SEPARATOR_FOR_NODES.length + leftBytes.length + rightBytes.length);
		const arrays = [
			DOMAIN_SEPARATOR_FOR_NODES,
			leftBytes,
			rightBytes
		];
		let offset = 0;
		for (const data of arrays) {
			combined.set(data, offset);
			offset += data.length;
		}
		const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, combined);
		return new YHash(new Uint8Array(hashBuffer));
	}
	static async fromChunk(data) {
		return YHash.fromBytes(DOMAIN_SEPARATOR_FOR_CHUNKS, data);
	}
	static async fromHeaders(headers) {
		const headerLines = [];
		for (const [key, value] of Object.entries(headers)) headerLines.push(`${key.trim()}: ${value.trim()}\n`);
		headerLines.sort();
		return await YHash.fromBytes(DOMAIN_SEPARATOR_FOR_METADATA, new TextEncoder().encode(headerLines.join("")));
	}
	static async fromBytes(domainSeparator, data) {
		const combined = new Uint8Array(domainSeparator.length + data.length);
		combined.set(domainSeparator);
		combined.set(data, domainSeparator.length);
		const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, combined);
		return new YHash(new Uint8Array(hashBuffer));
	}
	static fromHex(hexString) {
		const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => Number.parseInt(byte, 16)));
		return new YHash(bytes);
	}
	toShaString() {
		return `${SHA256_PREFIX}${this.toHex()}`;
	}
	toString() {
		throw new Error("toString is not supported for YHash");
	}
	toHex() {
		return Array.from(this.bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
};
function nodeToJSON(node) {
	return {
		hash: node.hash.toShaString(),
		left: node.left ? nodeToJSON(node.left) : null,
		right: node.right ? nodeToJSON(node.right) : null
	};
}
var BlobHashTree = class BlobHashTree {
	tree_type;
	chunk_hashes;
	tree;
	headers;
	constructor(chunk_hashes, tree, headers = null) {
		this.tree_type = "DSBMTWH";
		this.chunk_hashes = chunk_hashes;
		this.tree = tree;
		if (headers == null) this.headers = [];
		else if (Array.isArray(headers)) this.headers = headers;
		else this.headers = Object.entries(headers).map(([key, value]) => `${key.trim()}: ${value.trim()}`);
		this.headers.sort();
	}
	static async build(chunkHashes, headers = {}) {
		if (chunkHashes.length === 0) {
			const bytes = new TextEncoder().encode("8b8e620f084e48da0be2287fd12c5aaa4dbe14b468fd2e360f48d741fe7628a0");
			chunkHashes.push(new YHash(bytes));
		}
		let level = chunkHashes.map((hash) => ({
			hash,
			left: null,
			right: null
		}));
		while (level.length > 1) {
			const nextLevel = [];
			for (let i = 0; i < level.length; i += 2) {
				const left = level[i];
				const right = level[i + 1] || null;
				const parentHash = await YHash.fromNodes(left.hash, right ? right.hash : null);
				nextLevel.push({
					hash: parentHash,
					left,
					right
				});
			}
			level = nextLevel;
		}
		const chunksRoot = level[0];
		if (headers && Object.keys(headers).length > 0) {
			const metadataRoot = {
				hash: await YHash.fromHeaders(headers),
				left: null,
				right: null
			};
			const combinedRoot = {
				hash: await YHash.fromNodes(chunksRoot.hash, metadataRoot.hash),
				left: chunksRoot,
				right: metadataRoot
			};
			return new BlobHashTree(chunkHashes, combinedRoot, headers);
		}
		return new BlobHashTree(chunkHashes, chunksRoot, headers);
	}
	toJSON() {
		return {
			tree_type: this.tree_type,
			chunk_hashes: this.chunk_hashes.map((h) => h.toShaString()),
			tree: nodeToJSON(this.tree),
			headers: this.headers
		};
	}
};
var StorageGatewayClient = class {
	storageGatewayUrl;
	constructor(storageGatewayUrl) {
		this.storageGatewayUrl = storageGatewayUrl;
	}
	getStorageGatewayUrl() {
		return this.storageGatewayUrl;
	}
	async uploadChunk(params) {
		const blobHashString = params.blobRootHash.toShaString();
		const chunkHashString = params.chunkHash.toShaString();
		validateHashFormat(blobHashString, `uploadChunk[${params.chunkIndex}] blob_hash`);
		validateHashFormat(chunkHashString, `uploadChunk[${params.chunkIndex}] chunk_hash`);
		return await withRetry(async () => {
			const queryParams = new URLSearchParams({
				owner_id: params.owner,
				blob_hash: blobHashString,
				chunk_hash: chunkHashString,
				chunk_index: params.chunkIndex.toString(),
				bucket_name: params.bucketName,
				project_id: params.projectId
			});
			const url = `${this.storageGatewayUrl}/${GATEWAY_VERSION}/chunk/?${queryParams.toString()}`;
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/octet-stream",
					"X-Caffeine-Project-ID": params.projectId
				},
				body: params.chunkData
			});
			if (!response.ok) {
				const errorText = await response.text();
				const error = /* @__PURE__ */ new Error(`Failed to upload chunk ${params.chunkIndex}: ${response.status} ${response.statusText} - ${errorText}`);
				error.response = { status: response.status };
				throw error;
			}
			return { isComplete: (await response.json()).status === "blob_complete" };
		});
	}
	async uploadBlobTree(blobHashTree, bucketName, numBlobBytes, owner, projectId, certificateBytes) {
		const treeJSON = blobHashTree.toJSON();
		validateHashFormat(treeJSON.tree.hash, "uploadBlobTree root hash");
		treeJSON.chunk_hashes.forEach((hash, index) => {
			validateHashFormat(hash, `uploadBlobTree chunk_hash[${index}]`);
		});
		return await withRetry(async () => {
			const url = `${this.storageGatewayUrl}/${GATEWAY_VERSION}/blob-tree/`;
			const requestBody = {
				blob_tree: treeJSON,
				bucket_name: bucketName,
				num_blob_bytes: numBlobBytes,
				owner,
				project_id: projectId,
				headers: blobHashTree.headers,
				auth: { OwnerEgressSignature: Array.from(certificateBytes) }
			};
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-Caffeine-Project-ID": projectId
				},
				body: JSON.stringify(requestBody)
			});
			if (!response.ok) {
				const errorText = await response.text();
				const error = /* @__PURE__ */ new Error(`Failed to upload blob tree: ${response.status} ${response.statusText} - ${errorText}`);
				error.response = { status: response.status };
				throw error;
			}
		});
	}
};
var StorageClient = class {
	bucket;
	backendCanisterId;
	projectId;
	agent;
	storageGatewayClient;
	constructor(bucket, storageGatewayUrl, backendCanisterId, projectId, agent) {
		this.bucket = bucket;
		this.backendCanisterId = backendCanisterId;
		this.projectId = projectId;
		this.agent = agent;
		this.storageGatewayClient = new StorageGatewayClient(storageGatewayUrl);
	}
	async getCertificate(hash) {
		const args = encode$1([Text], [hash]);
		const result = await this.agent.call(this.backendCanisterId, {
			methodName: "_immutableObjectStorageCreateCertificate",
			arg: args,
			effectiveCanisterId: this.backendCanisterId
		});
		const respone = result.response.body;
		if (isV4ResponseBody(respone)) {
			const certBytes = respone.certificate;
			const decoded = Cbor.decode(certBytes);
			if (decoded.tree) {
				const requestStatusPath = [new TextEncoder().encode("request_status"), result.requestId];
				const statusLookup = lookup_path([...requestStatusPath, new TextEncoder().encode("status")], decoded.tree);
				if (statusLookup.status === LookupPathStatus.Found && new TextDecoder().decode(statusLookup.value) === "rejected") {
					const rejectCodeBytes = lookupResultToBuffer(lookup_path([...requestStatusPath, new TextEncoder().encode("reject_code")], decoded.tree));
					const rejectMessageBytes = lookupResultToBuffer(lookup_path([...requestStatusPath, new TextEncoder().encode("reject_message")], decoded.tree));
					const errorCodeBytes = lookupResultToBuffer(lookup_path([...requestStatusPath, new TextEncoder().encode("error_code")], decoded.tree));
					throw formatCertificateRejectionError({
						rejectCode: rejectCodeBytes?.[0],
						rejectMessage: rejectMessageBytes ? new TextDecoder().decode(rejectMessageBytes) : void 0,
						errorCode: errorCodeBytes ? new TextDecoder().decode(errorCodeBytes) : void 0
					});
				}
			}
			return certBytes;
		}
		throw new Error("Expected v4 response body");
	}
	async putFile(blobBytes, onProgress, contentTypeHint, filenameHint) {
		const httpHeaders = { "Content-Type": "application/json" };
		const contentType = await resolveBlobContentType(blobBytes, contentTypeHint);
		const file = new Blob([new Uint8Array(blobBytes)], { type: contentType });
		const fileHeaders = {
			"Content-Type": contentType,
			"Content-Length": file.size.toString()
		};
		const contentDisposition = formatBlobContentDisposition(filenameHint);
		if (contentDisposition) fileHeaders["Content-Disposition"] = contentDisposition;
		const { chunks, chunkHashes, blobHashTree } = await this.processFileForUpload(file, fileHeaders);
		const blobRootHash = blobHashTree.tree.hash;
		const hashString = blobRootHash.toShaString();
		const certificateBytes = await this.getCertificate(hashString);
		await this.storageGatewayClient.uploadBlobTree(blobHashTree, this.bucket, file.size, this.backendCanisterId, this.projectId, certificateBytes);
		await this.parallelUpload(chunks, chunkHashes, blobRootHash, httpHeaders, onProgress);
		return { hash: hashString };
	}
	async getDirectURL(hash) {
		if (!hash) throw new Error("Hash must not be empty");
		validateHashFormat(hash, `getDirectURL for path '${hash}'`);
		return `${this.storageGatewayClient.getStorageGatewayUrl()}/${GATEWAY_VERSION}/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(this.backendCanisterId)}&project_id=${encodeURIComponent(this.projectId)}`;
	}
	async processFileForUpload(file, headers) {
		const chunks = this.createFileChunks(file);
		const chunkHashes = [];
		for (let i = 0; i < chunks.length; i++) {
			const chunkData = new Uint8Array(await chunks[i].arrayBuffer());
			const hash = await YHash.fromChunk(chunkData);
			chunkHashes.push(hash);
		}
		return {
			chunks,
			chunkHashes,
			blobHashTree: await BlobHashTree.build(chunkHashes, headers)
		};
	}
	async parallelUpload(chunks, chunkHashes, blobRootHash, httpHeaders, onProgress) {
		let completedChunks = 0;
		const uploadSingleChunk = async (index) => {
			const chunkData = new Uint8Array(await chunks[index].arrayBuffer());
			const chunkHash = chunkHashes[index];
			await this.storageGatewayClient.uploadChunk({
				blobRootHash,
				chunkHash,
				chunkIndex: index,
				chunkData,
				bucketName: this.bucket,
				owner: this.backendCanisterId,
				projectId: this.projectId,
				httpHeaders
			});
			const currentCompleted = ++completedChunks;
			if (onProgress != null) onProgress(chunks.length === 0 ? 100 : Math.round(currentCompleted / chunks.length * 100));
		};
		await Promise.all(Array.from({ length: MAXIMUM_CONCURRENT_UPLOADS }, async (_, workerId) => {
			for (let i = workerId; i < chunks.length; i += MAXIMUM_CONCURRENT_UPLOADS) await uploadSingleChunk(i);
		}));
	}
	createFileChunks(file, chunkSize = 1048576) {
		const chunks = [];
		const totalChunks = Math.ceil(file.size / chunkSize);
		for (let index = 0; index < totalChunks; index++) {
			const start = index * chunkSize;
			const end = Math.min(start + chunkSize, file.size);
			const chunk = file.slice(start, end);
			chunks.push(chunk);
		}
		return chunks;
	}
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null,
		V: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, self, source, owner, props) {
		self = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== self ? self : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, void 0, void 0, void 0, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function noop$1() {}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	function noop() {}
	exports.Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key, owner = void 0;
		if (null != config) for (propName in void 0 !== config.ref && (owner = void 0), void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, void 0, void 0, owner, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, void 0, void 0, null, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, createDeps, update) {
		var dispatcher = ReactSharedInternals.H;
		if ("function" === typeof update) throw Error("useEffect CRUD overload is not enabled in this build of React.");
		return dispatcher.useEffect(create, createDeps);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.1.5";
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react@19.1.5/node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react-dom@19.1.5_react@19.1.5/node_modules/react-dom/cjs/react-dom.production.js
/**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function noop() {}
	var Internals = {
		d: {
			f: noop,
			r: function() {
				throw Error(formatProdErrorMessage(522));
			},
			D: noop,
			C: noop,
			L: noop,
			m: noop,
			X: noop,
			S: noop,
			M: noop
		},
		p: 0,
		findDOMNode: null
	};
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
		var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: REACT_PORTAL_TYPE,
			key: null == key ? null : "" + key,
			children,
			containerInfo,
			implementation
		};
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
		if ("font" === as) return "";
		if ("string" === typeof input) return "use-credentials" === input ? input : "";
	}
	exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
	exports.createPortal = function(children, container) {
		var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
		return createPortal$1(children, container, null, key);
	};
	exports.flushSync = function(fn) {
		var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
		try {
			if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
		} finally {
			ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
		}
	};
	exports.preconnect = function(href, options) {
		"string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
	};
	exports.prefetchDNS = function(href) {
		"string" === typeof href && Internals.d.D(href);
	};
	exports.preinit = function(href, options) {
		if ("string" === typeof href && options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
			"style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
				crossOrigin,
				integrity,
				fetchPriority
			}) : "script" === as && Internals.d.X(href, {
				crossOrigin,
				integrity,
				fetchPriority,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0
			});
		}
	};
	exports.preinitModule = function(href, options) {
		if ("string" === typeof href) if ("object" === typeof options && null !== options) {
			if (null == options.as || "script" === options.as) {
				var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
				Internals.d.M(href, {
					crossOrigin,
					integrity: "string" === typeof options.integrity ? options.integrity : void 0,
					nonce: "string" === typeof options.nonce ? options.nonce : void 0
				});
			}
		} else options ?? Internals.d.M(href);
	};
	exports.preload = function(href, options) {
		if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
			Internals.d.L(href, as, {
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0,
				type: "string" === typeof options.type ? options.type : void 0,
				fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
				referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
				imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
				imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
				media: "string" === typeof options.media ? options.media : void 0
			});
		}
	};
	exports.preloadModule = function(href, options) {
		if ("string" === typeof href) if (options) {
			var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
			Internals.d.m(href, {
				as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0
			});
		} else Internals.d.m(href);
	};
	exports.requestFormReset = function(form) {
		Internals.d.r(form);
	};
	exports.unstable_batchedUpdates = function(fn, a) {
		return fn(a);
	};
	exports.useFormState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	exports.useFormStatus = function() {
		return ReactSharedInternals.H.useHostTransitionStatus();
	};
	exports.version = "19.1.5";
}));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/react-dom@19.1.5_react@19.1.5/node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production();
}));
// src/declarations/backend.did.js
var _ImmutableObjectStorageCreateCertificateResult = Record({
	"method": Text,
	"blob_hash": Text
});
var _ImmutableObjectStorageRefillInformation = Record({ "proposed_top_up_amount": Opt(Nat) });
var _ImmutableObjectStorageRefillResult = Record({
	"success": Opt(Bool),
	"topped_up_amount": Opt(Nat)
});
var Result_21 = Variant({
	"ok": Null,
	"err": Variant({
		"FrontendOriginsNotConfigured": Null,
		"MixedSsoSources": Record({
			"otherKeys": Vec(Text),
			"ssoKeys": Vec(Text)
		}),
		"Stale": Record({ "ageNs": Nat }),
		"MalformedCandid": Null,
		"AmbiguousAttribute": Record({
			"field": Text,
			"sources": Vec(Text)
		}),
		"NoAttributes": Null,
		"UnknownNonce": Null,
		"UntrustedSsoSource": Record({ "domain": Text }),
		"MissingField": Text,
		"FrontendOriginMismatch": Record({
			"got": Text,
			"expected": Vec(Text)
		})
	})
});
var ReferenceCode = Text;
var JobId = Nat;
var JobStatus$1 = Variant({
	"scheduled": Null,
	"requested": Null,
	"cancelled": Null,
	"completed": Null,
	"quoted": Null,
	"inProgress": Null
});
var Timestamp = Int;
var Review = Record({
	"createdAt": Timestamp,
	"comment": Text,
	"rating": Nat
});
var PackageEnrollment = Record({
	"startedAt": Timestamp,
	"active": Bool,
	"monthlyPrice": Nat,
	"includedVisits": Nat
});
var Appointment = Record({
	"confirmed": Bool,
	"scheduledAt": Timestamp
});
var QuoteStatus$1 = Variant({
	"sent": Null,
	"approved": Null,
	"declined": Null,
	"draft": Null
});
var QuoteLineItem = Record({
	"description": Text,
	"quantity": Nat,
	"unitPrice": Nat
});
var DiscountId = Nat;
var QuotePricing = Record({
	"depositAmount": Nat,
	"adjustedSubtotal": Nat,
	"discountAmount": Nat,
	"finalTotal": Nat,
	"remainingBalance": Nat,
	"originalSubtotal": Nat,
	"discount": Record({
		"ruleName": Text,
		"ruleId": Opt(DiscountId),
		"applied": Bool,
		"reason": Text
	}),
	"taxAmount": Nat
});
var Quote = Record({
	"status": QuoteStatus$1,
	"lineItems": Vec(QuoteLineItem),
	"total": Nat,
	"expiresAt": Opt(Timestamp),
	"laborCharge": Nat,
	"discountApplied": Bool,
	"discountAmount": Nat,
	"note": Text,
	"createdAt": Timestamp,
	"quoteNumber": Text,
	"sentAt": Timestamp,
	"workDescription": Text,
	"pricing": Opt(QuotePricing),
	"remainingBalance": Nat,
	"materialsCharge": Nat,
	"amount": Nat,
	"depositRequired": Nat,
	"subtotal": Nat
});
var PhotoId = Text;
var DepositStatus$1 = Variant({
	"verified": Null,
	"submitted": Null,
	"pending": Null,
	"rejected": Null
});
var PaymentMethod$1 = Variant({
	"stripe": Null,
	"venmo": Null,
	"chime": Null,
	"cashApp": Null,
	"payPal": Null
});
var Deposit = Record({
	"status": DepositStatus$1,
	"method": PaymentMethod$1,
	"paid": Bool,
	"submittedAt": Opt(Timestamp),
	"stripeSessionId": Opt(Text),
	"amount": Nat,
	"verifiedAt": Opt(Timestamp),
	"paidAt": Opt(Timestamp)
});
var ServiceCategory$1 = Variant({
	"fixIt": Null,
	"showMe": Null,
	"house": Null,
	"cleanOrganize": Null,
	"mowing": Null,
	"errands": Null,
	"moveLift": Null,
	"yardPlants": Null
});
var BeeId = Nat;
var JobRequestView = Record({
	"id": JobId,
	"customerName": Text,
	"status": JobStatus$1,
	"completedAt": Opt(Timestamp),
	"review": Opt(Review),
	"packageEnrollment": Opt(PackageEnrollment),
	"preferredTiming": Text,
	"appointment": Opt(Appointment),
	"createdAt": Timestamp,
	"quote": Opt(Quote),
	"description": Text,
	"photoIds": Vec(PhotoId),
	"deposit": Opt(Deposit),
	"ownParts": Bool,
	"email": Text,
	"referenceCode": ReferenceCode,
	"category": ServiceCategory$1,
	"assignedBeeName": Opt(Text),
	"phone": Text,
	"assignedBeeId": Opt(BeeId)
});
var JobError = Variant({
	"paymentError": Text,
	"invalidState": Text,
	"notAuthorized": Null,
	"notFound": Null
});
var Result = Variant({
	"ok": JobRequestView,
	"err": JobError
});
var CustomerId = Nat;
var CustomerStatus$1 = Variant({
	"active": Null,
	"inactive": Null,
	"archived": Null
});
var PreferredContact$1 = Variant({
	"sms": Null,
	"email": Null,
	"phone": Null
});
var CustomerView = Record({
	"id": CustomerId,
	"status": CustomerStatus$1,
	"serviceAddress": Text,
	"createdAt": Timestamp,
	"fullName": Text,
	"email": Text,
	"preferredContact": PreferredContact$1,
	"notes": Vec(Record({
		"id": Nat,
		"body": Text,
		"createdAt": Timestamp
	})),
	"phone": Text,
	"adminNotes": Text
});
var Result_2 = Variant({
	"ok": CustomerView,
	"err": Variant({
		"notAuthorized": Null,
		"invalidInput": Text,
		"notFound": Null
	})
});
var JobRecordId = Nat;
var JobRecordView = Record({
	"id": JobRecordId,
	"customerName": Text,
	"status": Variant({
		"scheduled": Null,
		"cancelled": Null,
		"completed": Null,
		"inProgress": Null
	}),
	"completedAt": Opt(Timestamp),
	"serviceAddress": Text,
	"createdAt": Timestamp,
	"quote": Opt(Quote),
	"deposit": Opt(Deposit),
	"jobRequestId": JobId,
	"pricing": Opt(QuotePricing),
	"referenceCode": ReferenceCode,
	"remainingBalance": Nat,
	"category": ServiceCategory$1,
	"customerId": CustomerId,
	"scheduledAt": Timestamp
});
var Result_19 = Variant({
	"ok": JobRecordView,
	"err": JobError
});
var BeeError = Variant({
	"invalidState": Text,
	"notAuthorized": Null,
	"notFound": Null
});
var Result_7 = Variant({
	"ok": JobRequestView,
	"err": BeeError
});
var UserRole = Variant({
	"admin": Null,
	"user": Null,
	"guest": Null
});
var BeeInput = Record({
	"name": Text,
	"specialty": Text
});
var BeeView = Record({
	"id": BeeId,
	"name": Text,
	"createdAt": Timestamp,
	"specialty": Text
});
var Result_3 = Variant({
	"ok": BeeView,
	"err": BeeError
});
var ShoppingItem = Record({
	"productName": Text,
	"currency": Text,
	"quantity": Nat,
	"priceInCents": Nat,
	"productDescription": Text
});
var CustomerInput = Record({
	"serviceAddress": Text,
	"fullName": Text,
	"email": Text,
	"preferredContact": PreferredContact$1,
	"phone": Text
});
var Result_20 = Variant({
	"ok": Text,
	"err": JobError
});
var DiscountKind$1 = Variant({
	"fixed": Null,
	"percentage": Null
});
var DiscountEligibility$1 = Variant({
	"all": Null,
	"returningCustomer": Null,
	"ownParts": Null
});
var DiscountRuleInput = Record({
	"active": Bool,
	"minPurchase": Nat,
	"maxDiscount": Nat,
	"value": Nat,
	"startAt": Opt(Timestamp),
	"kind": DiscountKind$1,
	"name": Text,
	"endAt": Opt(Timestamp),
	"eligibility": DiscountEligibility$1
});
var DiscountRule = Record({
	"id": DiscountId,
	"active": Bool,
	"minPurchase": Nat,
	"maxDiscount": Nat,
	"value": Nat,
	"startAt": Opt(Timestamp),
	"kind": DiscountKind$1,
	"name": Text,
	"createdAt": Timestamp,
	"endAt": Opt(Timestamp),
	"eligibility": DiscountEligibility$1
});
var SettingsError = Variant({
	"notAuthorized": Null,
	"invalidInput": Text,
	"notFound": Null
});
var Result_1 = Variant({
	"ok": DiscountRule,
	"err": SettingsError
});
var JobRequestInput = Record({
	"customerName": Text,
	"preferredTiming": Text,
	"description": Text,
	"photoIds": Vec(PhotoId),
	"ownParts": Bool,
	"email": Text,
	"category": ServiceCategory$1,
	"phone": Text,
	"packageInterest": Bool
});
var Result_18 = Variant({
	"ok": Null,
	"err": SettingsError
});
var QuoteInput = Record({
	"lineItems": Vec(QuoteLineItem),
	"expiresAt": Opt(Timestamp),
	"laborCharge": Nat,
	"note": Text,
	"workDescription": Text,
	"materialsCharge": Nat,
	"depositRequired": Nat
});
var Result__1 = Record({
	"hasMore": Bool,
	"rows": Vec(Vec(Record({
		"value": Variant({
			"int": Int,
			"nat": Nat,
			"float": Float64,
			"bool": Bool,
			"null": Null,
			"text": Text
		}),
		"name": Text
	})))
});
var MessageView = Record({
	"id": Nat,
	"body": Text,
	"createdAt": Timestamp,
	"jobId": Opt(JobId),
	"customerId": CustomerId,
	"fromAdmin": Bool
});
var PaymentHistory = Record({
	"id": Nat,
	"depositAmount": Nat,
	"paymentMethod": PaymentMethod$1,
	"depositStatus": DepositStatus$1,
	"discountAmount": Nat,
	"createdAt": Timestamp,
	"totalPaid": Nat,
	"jobRequestId": JobId,
	"finalPayment": Nat,
	"referenceCode": ReferenceCode,
	"updatedAt": Timestamp,
	"finalQuote": Nat,
	"remainingBalance": Nat,
	"customerId": CustomerId,
	"originalQuote": Nat
});
var MessageView__1 = Record({
	"id": Nat,
	"body": Text,
	"createdAt": Timestamp,
	"jobId": Opt(JobId),
	"customerId": CustomerId,
	"fromAdmin": Bool
});
var CustomerProfileView = Record({
	"completedJobs": Vec(JobRequestView),
	"payments": Vec(PaymentHistory),
	"customer": CustomerView,
	"messages": Vec(MessageView__1),
	"jobs": Vec(JobRequestView),
	"photoIds": Vec(PhotoId),
	"appointments": Vec(Appointment),
	"cancelledJobs": Vec(JobRequestView),
	"deposits": Vec(Deposit),
	"pendingJobs": Vec(JobRequestView),
	"quotes": Vec(Quote),
	"jobRecords": Vec(JobRecordView)
});
var VisitRecord = Record({
	"service": ServiceCategory$1,
	"completedAt": Timestamp,
	"jobId": JobId,
	"referenceCode": ReferenceCode,
	"beeName": Opt(Text),
	"beeId": Opt(BeeId)
});
var DashboardStats = Record({
	"reviewsCount": Nat,
	"depositsCollected": Nat,
	"newRequests": Nat,
	"upcomingAppointments": Nat,
	"activeJobs": Nat
});
var PaymentSummaryView = Record({
	"customerName": Text,
	"depositAmount": Nat,
	"chimeHandle": Text,
	"adjustedSubtotal": Nat,
	"venmoHandle": Text,
	"depositStatus": DepositStatus$1,
	"depositMethod": Opt(PaymentMethod$1),
	"discountAmount": Nat,
	"finalTotal": Nat,
	"appointmentConfirmed": Bool,
	"serviceDescription": Text,
	"discountReason": Text,
	"referenceCode": ReferenceCode,
	"payPalHandle": Text,
	"cashAppHandle": Text,
	"remainingBalance": Nat,
	"originalSubtotal": Nat,
	"acceptedMethods": Vec(PaymentMethod$1),
	"taxAmount": Nat,
	"appointmentAt": Opt(Timestamp)
});
var QuoteView = Record({
	"status": QuoteStatus$1,
	"lineItems": Vec(QuoteLineItem),
	"total": Nat,
	"expiresAt": Opt(Timestamp),
	"expired": Bool,
	"laborCharge": Nat,
	"discountApplied": Bool,
	"discountAmount": Nat,
	"note": Text,
	"quoteNumber": Text,
	"workDescription": Text,
	"pricing": Opt(QuotePricing),
	"referenceCode": ReferenceCode,
	"remainingBalance": Nat,
	"materialsCharge": Nat,
	"depositRequired": Nat,
	"subtotal": Nat
});
var TaxSetting = Record({
	"enabled": Bool,
	"ratePercent": Nat
});
var AdminSettings = Record({
	"appointmentReminders": Bool,
	"notificationSound": Bool,
	"messageAlerts": Bool,
	"pushNotifications": Bool,
	"customerRequestAlerts": Bool
});
var QuoteSettings = Record({
	"terms": Text,
	"validityDays": Nat
});
var DepositSetting = Record({ "percent": Nat });
var BusinessSettings = Record({
	"businessName": Text,
	"businessEmail": Text,
	"businessAddress": Text,
	"businessPhone": Text
});
var PaymentSettings = Record({
	"chimeHandle": Text,
	"venmoHandle": Text,
	"payPalHandle": Text,
	"cashAppHandle": Text,
	"acceptedMethods": Vec(PaymentMethod$1)
});
var SettingsBundle = Record({
	"tax": TaxSetting,
	"admin": AdminSettings,
	"quote": QuoteSettings,
	"deposit": DepositSetting,
	"business": BusinessSettings,
	"payment": PaymentSettings
});
var StripeSessionStatus = Variant({
	"completed": Record({
		"userPrincipal": Opt(Text),
		"response": Text
	}),
	"failed": Record({ "error": Text })
});
var TwilioConfigStatus = Record({
	"configured": Bool,
	"fromNumber": Text
});
var CustomerSummary = Record({
	"id": CustomerId,
	"status": CustomerStatus$1,
	"serviceAddress": Text,
	"fullName": Text,
	"email": Text,
	"phone": Text,
	"jobCount": Nat
});
var NotificationId = Nat;
var NotificationKind$1 = Variant({
	"appointmentReminder": Null,
	"depositReceived": Null,
	"returningCustomerRequest": Null,
	"depositVerified": Null,
	"depositSubmitted": Null,
	"appointmentConfirmed": Null,
	"newCustomer": Null,
	"quoteApproved": Null,
	"newRequest": Null,
	"appointmentChanged": Null,
	"customerMessage": Null,
	"paymentReceived": Null,
	"quoteDeclined": Null,
	"newMessage": Null,
	"bookingApproval": Null
});
var NotificationView = Record({
	"id": NotificationId,
	"title": Text,
	"relatedCustomerId": Opt(CustomerId),
	"body": Text,
	"kind": NotificationKind$1,
	"createdAt": Timestamp,
	"read": Bool,
	"relatedJobId": Opt(JobId)
});
var Result_17 = Variant({
	"ok": Null,
	"err": Variant({
		"notAuthorized": Null,
		"notFound": Null
	})
});
var Result_16 = Variant({
	"ok": MessageView,
	"err": Variant({
		"notAuthorized": Null,
		"invalidInput": Text,
		"notFound": Null
	})
});
var Result_15 = Variant({
	"ok": PaymentHistory,
	"err": JobError
});
var Result_14 = Variant({
	"ok": Record({
		"view": JobRequestView,
		"email": Variant({
			"sent": Null,
			"failed": Text
		})
	}),
	"err": JobError
});
var ChannelResult = Variant({
	"sent": Null,
	"failed": Text
});
var TestAlertResult = Record({
	"sms": ChannelResult,
	"email": ChannelResult
});
var Result_13 = Variant({
	"ok": AdminSettings,
	"err": SettingsError
});
var Result_12 = Variant({
	"ok": BusinessSettings,
	"err": SettingsError
});
var Result_11 = Variant({
	"ok": DepositSetting,
	"err": SettingsError
});
var Result_10 = Variant({
	"ok": Text,
	"err": Variant({ "invalidOrigin": Text })
});
var Result_9 = Variant({
	"ok": Text,
	"err": Variant({
		"invalidEmail": Text,
		"sendFailed": Text
	})
});
var Result_8 = Variant({
	"ok": Text,
	"err": Variant({
		"invalidPhone": Text,
		"sendFailed": Text
	})
});
var Result_6 = Variant({
	"ok": PaymentSettings,
	"err": SettingsError
});
var Result_5 = Variant({
	"ok": QuoteSettings,
	"err": SettingsError
});
var StripeConfiguration = Record({
	"allowedCountries": Vec(Text),
	"secretKey": Text
});
var Result_4 = Variant({
	"ok": TaxSetting,
	"err": SettingsError
});
var HttpHeader = Record({
	"value": Text,
	"name": Text
});
var HttpRequestResult = Record({
	"status": Nat,
	"body": Vec(Nat8),
	"headers": Vec(HttpHeader)
});
var TransformationInput = Record({
	"context": Vec(Nat8),
	"response": HttpRequestResult
});
var TransformationOutput = Record({
	"status": Nat,
	"body": Vec(Nat8),
	"headers": Vec(HttpHeader)
});
Service({
	"_immutableObjectStorageBlobsAreLive": Func([Vec(Vec(Nat8))], [Vec(Bool)], ["query"]),
	"_immutableObjectStorageBlobsToDelete": Func([], [Vec(Vec(Nat8))], ["query"]),
	"_immutableObjectStorageConfirmBlobDeletion": Func([Vec(Vec(Nat8))], [], []),
	"_immutableObjectStorageCreateCertificate": Func([Text], [_ImmutableObjectStorageCreateCertificateResult], []),
	"_immutableObjectStorageRefillCashier": Func([Opt(_ImmutableObjectStorageRefillInformation)], [_ImmutableObjectStorageRefillResult], []),
	"_immutableObjectStorageUpdateGatewayPrincipals": Func([], [], []),
	"_initialize_access_control": Func([], [], []),
	"_internet_identity_sign_in_finish": Func([], [Result_21], []),
	"_internet_identity_sign_in_start": Func([], [Vec(Nat8)], []),
	"acceptQuote": Func([ReferenceCode], [Result], []),
	"addCustomerNote": Func([CustomerId, Text], [Result_2], []),
	"advanceJobRecord": Func([JobRecordId], [Result_19], []),
	"advanceStatus": Func([JobId], [Result], []),
	"approveQuote": Func([JobId], [Result], []),
	"archiveCustomer": Func([CustomerId], [Result_2], []),
	"assignBeeToJob": Func([JobId, BeeId], [Result_7], []),
	"assignCallerUserRole": Func([Principal, UserRole], [], []),
	"cancelJob": Func([JobId], [Result], []),
	"cancelJobRecord": Func([JobRecordId], [Result_19], []),
	"completeJobRecord": Func([JobRecordId], [Result_19], []),
	"confirmAppointment": Func([ReferenceCode], [Result], []),
	"confirmDepositPayment": Func([ReferenceCode], [Result], []),
	"convertQuoteToJob": Func([JobId, Timestamp], [Result], []),
	"createBee": Func([BeeInput], [Result_3], []),
	"createCheckoutSession": Func([
		Vec(ShoppingItem),
		Text,
		Text
	], [Text], []),
	"createCustomer": Func([CustomerInput], [Result_2], []),
	"createDepositCheckoutSession": Func([
		ReferenceCode,
		Text,
		Text
	], [Result_20], []),
	"createDiscount": Func([DiscountRuleInput], [Result_1], []),
	"createJobForCustomer": Func([CustomerId, JobRequestInput], [Result], []),
	"createJobRecord": Func([JobId, Timestamp], [Result_19], []),
	"declineQuote": Func([JobId], [Result], []),
	"declineQuoteByReference": Func([ReferenceCode], [Result], []),
	"deleteDiscount": Func([DiscountId], [Result_18], []),
	"editQuote": Func([JobId, QuoteInput], [Result], []),
	"execute": Func([Text], [Result__1], ["query"]),
	"exportCustomersCsv": Func([], [Text], ["query"]),
	"getApiDoc": Func([], [Text], ["query"]),
	"getCallerUserRole": Func([], [UserRole], ["query"]),
	"getCustomer": Func([CustomerId], [Opt(CustomerView)], ["query"]),
	"getCustomerMessages": Func([Text], [Vec(MessageView)], ["query"]),
	"getCustomerProfile": Func([CustomerId], [Opt(CustomerProfileView)], ["query"]),
	"getCustomerVisitHistory": Func([JobId], [Vec(VisitRecord)], ["query"]),
	"getDashboardStats": Func([], [DashboardStats], ["query"]),
	"getFrontendOrigin": Func([], [Text], ["query"]),
	"getJobRecord": Func([JobRecordId], [Opt(JobRecordView)], ["query"]),
	"getOwnerAlertEmail": Func([], [Text], ["query"]),
	"getOwnerAlertPhone": Func([], [Text], ["query"]),
	"getPaymentHistoryForJob": Func([JobId], [Opt(PaymentHistory)], ["query"]),
	"getPaymentSummary": Func([ReferenceCode], [Opt(PaymentSummaryView)], ["query"]),
	"getQuoteByReference": Func([ReferenceCode], [Opt(QuoteView)], ["query"]),
	"getRequest": Func([JobId], [Opt(JobRequestView)], ["query"]),
	"getRequestByReference": Func([ReferenceCode], [Opt(JobRequestView)], ["query"]),
	"getSettings": Func([], [SettingsBundle], ["query"]),
	"getStripeSessionStatus": Func([Text], [StripeSessionStatus], []),
	"getTwilioConfigStatus": Func([], [TwilioConfigStatus], ["query"]),
	"getUnreadNotificationCount": Func([], [Nat], ["query"]),
	"getVisitHistory": Func([ReferenceCode], [Vec(VisitRecord)], ["query"]),
	"isCallerAdmin": Func([], [Bool], ["query"]),
	"isStripeConfigured": Func([], [Bool], ["query"]),
	"listBees": Func([], [Vec(BeeView)], ["query"]),
	"listCustomerMessages": Func([CustomerId], [Vec(MessageView)], ["query"]),
	"listCustomers": Func([Bool], [Vec(CustomerSummary)], ["query"]),
	"listDiscounts": Func([], [Vec(DiscountRule)], ["query"]),
	"listJobRecords": Func([], [Vec(JobRecordView)], ["query"]),
	"listNotifications": Func([], [Vec(NotificationView)], ["query"]),
	"listPaymentHistory": Func([], [Vec(PaymentHistory)], ["query"]),
	"listRequests": Func([], [Vec(JobRequestView)], ["query"]),
	"markAllNotificationsRead": Func([], [], []),
	"markNotificationRead": Func([NotificationId], [Result_17], []),
	"postAdminMessage": Func([
		CustomerId,
		Opt(JobId),
		Text
	], [Result_16], []),
	"postCustomerMessage": Func([Text, Text], [Result_16], []),
	"raiseNotification": Func([
		NotificationKind$1,
		Text,
		Text,
		Opt(JobId),
		Opt(CustomerId)
	], [NotificationId], []),
	"recordDeposit": Func([ReferenceCode, PaymentMethod$1], [Result], []),
	"recordFinalPayment": Func([
		JobId,
		Nat,
		PaymentMethod$1
	], [Result_15], []),
	"rejectDeposit": Func([ReferenceCode], [Result], []),
	"resolveOrCreateCustomer": Func([
		Text,
		Text,
		Text,
		Text
	], [CustomerId], []),
	"restoreCustomer": Func([CustomerId], [Result_2], []),
	"scheduleAppointment": Func([JobId, Timestamp], [Result], []),
	"schema": Func([], [Text], ["query"]),
	"searchCustomers": Func([Text], [Vec(CustomerSummary)], ["query"]),
	"sendAppointmentReminder": Func([JobId], [Result], []),
	"sendQuote": Func([JobId], [Result_14], []),
	"sendTestAlert": Func([], [TestAlertResult], []),
	"setAdminSettings": Func([AdminSettings], [Result_13], []),
	"setBusinessSettings": Func([BusinessSettings], [Result_12], []),
	"setCustomerStatus": Func([CustomerId, CustomerStatus$1], [Result_2], []),
	"setDepositSetting": Func([DepositSetting], [Result_11], []),
	"setDiscountActive": Func([DiscountId, Bool], [Result_1], []),
	"setFrontendOrigin": Func([Text], [Result_10], []),
	"setOwnerAlertEmail": Func([Text], [Result_9], []),
	"setOwnerAlertPhone": Func([Text], [Result_8], []),
	"setPackageEnrollment": Func([JobId, Bool], [Result_7], []),
	"setPaymentSettings": Func([PaymentSettings], [Result_6], []),
	"setQuote": Func([
		JobId,
		Nat,
		Text
	], [Result], []),
	"setQuoteSettings": Func([QuoteSettings], [Result_5], []),
	"setStripeConfiguration": Func([StripeConfiguration], [], []),
	"setTaxSetting": Func([TaxSetting], [Result_4], []),
	"setTwilioCredentials": Func([
		Text,
		Text,
		Text,
		Text
	], [], []),
	"submitDeposit": Func([ReferenceCode, PaymentMethod$1], [Result], []),
	"submitRequest": Func([JobRequestInput], [ReferenceCode], []),
	"submitReview": Func([
		ReferenceCode,
		Nat,
		Text
	], [Result], []),
	"transform": Func([TransformationInput], [TransformationOutput], ["query"]),
	"updateBee": Func([BeeId, BeeInput], [Result_3], []),
	"updateCustomer": Func([CustomerId, CustomerInput], [Result_2], []),
	"updateDiscount": Func([DiscountId, DiscountRuleInput], [Result_1], []),
	"verifyDeposit": Func([ReferenceCode], [Result], [])
});
var idlFactory = ({ IDL }) => {
	const _ImmutableObjectStorageCreateCertificateResult = IDL.Record({
		"method": IDL.Text,
		"blob_hash": IDL.Text
	});
	const _ImmutableObjectStorageRefillInformation = IDL.Record({ "proposed_top_up_amount": IDL.Opt(IDL.Nat) });
	const _ImmutableObjectStorageRefillResult = IDL.Record({
		"success": IDL.Opt(IDL.Bool),
		"topped_up_amount": IDL.Opt(IDL.Nat)
	});
	const Error = IDL.Variant({
		"FrontendOriginsNotConfigured": IDL.Null,
		"MixedSsoSources": IDL.Record({
			"otherKeys": IDL.Vec(IDL.Text),
			"ssoKeys": IDL.Vec(IDL.Text)
		}),
		"Stale": IDL.Record({ "ageNs": IDL.Nat }),
		"MalformedCandid": IDL.Null,
		"AmbiguousAttribute": IDL.Record({
			"field": IDL.Text,
			"sources": IDL.Vec(IDL.Text)
		}),
		"NoAttributes": IDL.Null,
		"UnknownNonce": IDL.Null,
		"UntrustedSsoSource": IDL.Record({ "domain": IDL.Text }),
		"MissingField": IDL.Text,
		"FrontendOriginMismatch": IDL.Record({
			"got": IDL.Text,
			"expected": IDL.Vec(IDL.Text)
		})
	});
	const Result_21 = IDL.Variant({
		"ok": IDL.Null,
		"err": Error
	});
	const ReferenceCode = IDL.Text;
	const JobId = IDL.Nat;
	const JobStatus = IDL.Variant({
		"scheduled": IDL.Null,
		"requested": IDL.Null,
		"cancelled": IDL.Null,
		"completed": IDL.Null,
		"quoted": IDL.Null,
		"inProgress": IDL.Null
	});
	const Timestamp = IDL.Int;
	const Review = IDL.Record({
		"createdAt": Timestamp,
		"comment": IDL.Text,
		"rating": IDL.Nat
	});
	const PackageEnrollment = IDL.Record({
		"startedAt": Timestamp,
		"active": IDL.Bool,
		"monthlyPrice": IDL.Nat,
		"includedVisits": IDL.Nat
	});
	const Appointment = IDL.Record({
		"confirmed": IDL.Bool,
		"scheduledAt": Timestamp
	});
	const QuoteStatus = IDL.Variant({
		"sent": IDL.Null,
		"approved": IDL.Null,
		"declined": IDL.Null,
		"draft": IDL.Null
	});
	const QuoteLineItem = IDL.Record({
		"description": IDL.Text,
		"quantity": IDL.Nat,
		"unitPrice": IDL.Nat
	});
	const DiscountId = IDL.Nat;
	const DiscountApplication = IDL.Record({
		"ruleName": IDL.Text,
		"ruleId": IDL.Opt(DiscountId),
		"applied": IDL.Bool,
		"reason": IDL.Text
	});
	const QuotePricing = IDL.Record({
		"depositAmount": IDL.Nat,
		"adjustedSubtotal": IDL.Nat,
		"discountAmount": IDL.Nat,
		"finalTotal": IDL.Nat,
		"remainingBalance": IDL.Nat,
		"originalSubtotal": IDL.Nat,
		"discount": DiscountApplication,
		"taxAmount": IDL.Nat
	});
	const Quote = IDL.Record({
		"status": QuoteStatus,
		"lineItems": IDL.Vec(QuoteLineItem),
		"total": IDL.Nat,
		"expiresAt": IDL.Opt(Timestamp),
		"laborCharge": IDL.Nat,
		"discountApplied": IDL.Bool,
		"discountAmount": IDL.Nat,
		"note": IDL.Text,
		"createdAt": Timestamp,
		"quoteNumber": IDL.Text,
		"sentAt": Timestamp,
		"workDescription": IDL.Text,
		"pricing": IDL.Opt(QuotePricing),
		"remainingBalance": IDL.Nat,
		"materialsCharge": IDL.Nat,
		"amount": IDL.Nat,
		"depositRequired": IDL.Nat,
		"subtotal": IDL.Nat
	});
	const PhotoId = IDL.Text;
	const DepositStatus = IDL.Variant({
		"verified": IDL.Null,
		"submitted": IDL.Null,
		"pending": IDL.Null,
		"rejected": IDL.Null
	});
	const PaymentMethod = IDL.Variant({
		"stripe": IDL.Null,
		"venmo": IDL.Null,
		"chime": IDL.Null,
		"cashApp": IDL.Null,
		"payPal": IDL.Null
	});
	const Deposit = IDL.Record({
		"status": DepositStatus,
		"method": PaymentMethod,
		"paid": IDL.Bool,
		"submittedAt": IDL.Opt(Timestamp),
		"stripeSessionId": IDL.Opt(IDL.Text),
		"amount": IDL.Nat,
		"verifiedAt": IDL.Opt(Timestamp),
		"paidAt": IDL.Opt(Timestamp)
	});
	const ServiceCategory = IDL.Variant({
		"fixIt": IDL.Null,
		"showMe": IDL.Null,
		"house": IDL.Null,
		"cleanOrganize": IDL.Null,
		"mowing": IDL.Null,
		"errands": IDL.Null,
		"moveLift": IDL.Null,
		"yardPlants": IDL.Null
	});
	const BeeId = IDL.Nat;
	const JobRequestView = IDL.Record({
		"id": JobId,
		"customerName": IDL.Text,
		"status": JobStatus,
		"completedAt": IDL.Opt(Timestamp),
		"review": IDL.Opt(Review),
		"packageEnrollment": IDL.Opt(PackageEnrollment),
		"preferredTiming": IDL.Text,
		"appointment": IDL.Opt(Appointment),
		"createdAt": Timestamp,
		"quote": IDL.Opt(Quote),
		"description": IDL.Text,
		"photoIds": IDL.Vec(PhotoId),
		"deposit": IDL.Opt(Deposit),
		"ownParts": IDL.Bool,
		"email": IDL.Text,
		"referenceCode": ReferenceCode,
		"category": ServiceCategory,
		"assignedBeeName": IDL.Opt(IDL.Text),
		"phone": IDL.Text,
		"assignedBeeId": IDL.Opt(BeeId)
	});
	const JobError = IDL.Variant({
		"paymentError": IDL.Text,
		"invalidState": IDL.Text,
		"notAuthorized": IDL.Null,
		"notFound": IDL.Null
	});
	const Result = IDL.Variant({
		"ok": JobRequestView,
		"err": JobError
	});
	const CustomerId = IDL.Nat;
	const CustomerStatus = IDL.Variant({
		"active": IDL.Null,
		"inactive": IDL.Null,
		"archived": IDL.Null
	});
	const PreferredContact = IDL.Variant({
		"sms": IDL.Null,
		"email": IDL.Null,
		"phone": IDL.Null
	});
	const CustomerNote = IDL.Record({
		"id": IDL.Nat,
		"body": IDL.Text,
		"createdAt": Timestamp
	});
	const CustomerView = IDL.Record({
		"id": CustomerId,
		"status": CustomerStatus,
		"serviceAddress": IDL.Text,
		"createdAt": Timestamp,
		"fullName": IDL.Text,
		"email": IDL.Text,
		"preferredContact": PreferredContact,
		"notes": IDL.Vec(CustomerNote),
		"phone": IDL.Text,
		"adminNotes": IDL.Text
	});
	const CustomerError = IDL.Variant({
		"notAuthorized": IDL.Null,
		"invalidInput": IDL.Text,
		"notFound": IDL.Null
	});
	const Result_2 = IDL.Variant({
		"ok": CustomerView,
		"err": CustomerError
	});
	const JobRecordId = IDL.Nat;
	const JobRecordStatus = IDL.Variant({
		"scheduled": IDL.Null,
		"cancelled": IDL.Null,
		"completed": IDL.Null,
		"inProgress": IDL.Null
	});
	const JobRecordView = IDL.Record({
		"id": JobRecordId,
		"customerName": IDL.Text,
		"status": JobRecordStatus,
		"completedAt": IDL.Opt(Timestamp),
		"serviceAddress": IDL.Text,
		"createdAt": Timestamp,
		"quote": IDL.Opt(Quote),
		"deposit": IDL.Opt(Deposit),
		"jobRequestId": JobId,
		"pricing": IDL.Opt(QuotePricing),
		"referenceCode": ReferenceCode,
		"remainingBalance": IDL.Nat,
		"category": ServiceCategory,
		"customerId": CustomerId,
		"scheduledAt": Timestamp
	});
	const Result_19 = IDL.Variant({
		"ok": JobRecordView,
		"err": JobError
	});
	const BeeError = IDL.Variant({
		"invalidState": IDL.Text,
		"notAuthorized": IDL.Null,
		"notFound": IDL.Null
	});
	const Result_7 = IDL.Variant({
		"ok": JobRequestView,
		"err": BeeError
	});
	const UserRole = IDL.Variant({
		"admin": IDL.Null,
		"user": IDL.Null,
		"guest": IDL.Null
	});
	const BeeInput = IDL.Record({
		"name": IDL.Text,
		"specialty": IDL.Text
	});
	const BeeView = IDL.Record({
		"id": BeeId,
		"name": IDL.Text,
		"createdAt": Timestamp,
		"specialty": IDL.Text
	});
	const Result_3 = IDL.Variant({
		"ok": BeeView,
		"err": BeeError
	});
	const ShoppingItem = IDL.Record({
		"productName": IDL.Text,
		"currency": IDL.Text,
		"quantity": IDL.Nat,
		"priceInCents": IDL.Nat,
		"productDescription": IDL.Text
	});
	const CustomerInput = IDL.Record({
		"serviceAddress": IDL.Text,
		"fullName": IDL.Text,
		"email": IDL.Text,
		"preferredContact": PreferredContact,
		"phone": IDL.Text
	});
	const Result_20 = IDL.Variant({
		"ok": IDL.Text,
		"err": JobError
	});
	const DiscountKind = IDL.Variant({
		"fixed": IDL.Null,
		"percentage": IDL.Null
	});
	const DiscountEligibility = IDL.Variant({
		"all": IDL.Null,
		"returningCustomer": IDL.Null,
		"ownParts": IDL.Null
	});
	const DiscountRuleInput = IDL.Record({
		"active": IDL.Bool,
		"minPurchase": IDL.Nat,
		"maxDiscount": IDL.Nat,
		"value": IDL.Nat,
		"startAt": IDL.Opt(Timestamp),
		"kind": DiscountKind,
		"name": IDL.Text,
		"endAt": IDL.Opt(Timestamp),
		"eligibility": DiscountEligibility
	});
	const DiscountRule = IDL.Record({
		"id": DiscountId,
		"active": IDL.Bool,
		"minPurchase": IDL.Nat,
		"maxDiscount": IDL.Nat,
		"value": IDL.Nat,
		"startAt": IDL.Opt(Timestamp),
		"kind": DiscountKind,
		"name": IDL.Text,
		"createdAt": Timestamp,
		"endAt": IDL.Opt(Timestamp),
		"eligibility": DiscountEligibility
	});
	const SettingsError = IDL.Variant({
		"notAuthorized": IDL.Null,
		"invalidInput": IDL.Text,
		"notFound": IDL.Null
	});
	const Result_1 = IDL.Variant({
		"ok": DiscountRule,
		"err": SettingsError
	});
	const JobRequestInput = IDL.Record({
		"customerName": IDL.Text,
		"preferredTiming": IDL.Text,
		"description": IDL.Text,
		"photoIds": IDL.Vec(PhotoId),
		"ownParts": IDL.Bool,
		"email": IDL.Text,
		"category": ServiceCategory,
		"phone": IDL.Text,
		"packageInterest": IDL.Bool
	});
	const Result_18 = IDL.Variant({
		"ok": IDL.Null,
		"err": SettingsError
	});
	const QuoteInput = IDL.Record({
		"lineItems": IDL.Vec(QuoteLineItem),
		"expiresAt": IDL.Opt(Timestamp),
		"laborCharge": IDL.Nat,
		"note": IDL.Text,
		"workDescription": IDL.Text,
		"materialsCharge": IDL.Nat,
		"depositRequired": IDL.Nat
	});
	const Value = IDL.Variant({
		"int": IDL.Int,
		"nat": IDL.Nat,
		"float": IDL.Float64,
		"bool": IDL.Bool,
		"null": IDL.Null,
		"text": IDL.Text
	});
	const Cell = IDL.Record({
		"value": Value,
		"name": IDL.Text
	});
	const Result__1 = IDL.Record({
		"hasMore": IDL.Bool,
		"rows": IDL.Vec(IDL.Vec(Cell))
	});
	const MessageId = IDL.Nat;
	const MessageView = IDL.Record({
		"id": MessageId,
		"body": IDL.Text,
		"createdAt": Timestamp,
		"jobId": IDL.Opt(JobId),
		"customerId": CustomerId,
		"fromAdmin": IDL.Bool
	});
	const PaymentId = IDL.Nat;
	const PaymentHistory = IDL.Record({
		"id": PaymentId,
		"depositAmount": IDL.Nat,
		"paymentMethod": PaymentMethod,
		"depositStatus": DepositStatus,
		"discountAmount": IDL.Nat,
		"createdAt": Timestamp,
		"totalPaid": IDL.Nat,
		"jobRequestId": JobId,
		"finalPayment": IDL.Nat,
		"referenceCode": ReferenceCode,
		"updatedAt": Timestamp,
		"finalQuote": IDL.Nat,
		"remainingBalance": IDL.Nat,
		"customerId": CustomerId,
		"originalQuote": IDL.Nat
	});
	const MessageView__1 = IDL.Record({
		"id": IDL.Nat,
		"body": IDL.Text,
		"createdAt": Timestamp,
		"jobId": IDL.Opt(JobId),
		"customerId": CustomerId,
		"fromAdmin": IDL.Bool
	});
	const CustomerProfileView = IDL.Record({
		"completedJobs": IDL.Vec(JobRequestView),
		"payments": IDL.Vec(PaymentHistory),
		"customer": CustomerView,
		"messages": IDL.Vec(MessageView__1),
		"jobs": IDL.Vec(JobRequestView),
		"photoIds": IDL.Vec(PhotoId),
		"appointments": IDL.Vec(Appointment),
		"cancelledJobs": IDL.Vec(JobRequestView),
		"deposits": IDL.Vec(Deposit),
		"pendingJobs": IDL.Vec(JobRequestView),
		"quotes": IDL.Vec(Quote),
		"jobRecords": IDL.Vec(JobRecordView)
	});
	const VisitRecord = IDL.Record({
		"service": ServiceCategory,
		"completedAt": Timestamp,
		"jobId": JobId,
		"referenceCode": ReferenceCode,
		"beeName": IDL.Opt(IDL.Text),
		"beeId": IDL.Opt(BeeId)
	});
	const DashboardStats = IDL.Record({
		"reviewsCount": IDL.Nat,
		"depositsCollected": IDL.Nat,
		"newRequests": IDL.Nat,
		"upcomingAppointments": IDL.Nat,
		"activeJobs": IDL.Nat
	});
	const PaymentSummaryView = IDL.Record({
		"customerName": IDL.Text,
		"depositAmount": IDL.Nat,
		"chimeHandle": IDL.Text,
		"adjustedSubtotal": IDL.Nat,
		"venmoHandle": IDL.Text,
		"depositStatus": DepositStatus,
		"depositMethod": IDL.Opt(PaymentMethod),
		"discountAmount": IDL.Nat,
		"finalTotal": IDL.Nat,
		"appointmentConfirmed": IDL.Bool,
		"serviceDescription": IDL.Text,
		"discountReason": IDL.Text,
		"referenceCode": ReferenceCode,
		"payPalHandle": IDL.Text,
		"cashAppHandle": IDL.Text,
		"remainingBalance": IDL.Nat,
		"originalSubtotal": IDL.Nat,
		"acceptedMethods": IDL.Vec(PaymentMethod),
		"taxAmount": IDL.Nat,
		"appointmentAt": IDL.Opt(Timestamp)
	});
	const QuoteView = IDL.Record({
		"status": QuoteStatus,
		"lineItems": IDL.Vec(QuoteLineItem),
		"total": IDL.Nat,
		"expiresAt": IDL.Opt(Timestamp),
		"expired": IDL.Bool,
		"laborCharge": IDL.Nat,
		"discountApplied": IDL.Bool,
		"discountAmount": IDL.Nat,
		"note": IDL.Text,
		"quoteNumber": IDL.Text,
		"workDescription": IDL.Text,
		"pricing": IDL.Opt(QuotePricing),
		"referenceCode": ReferenceCode,
		"remainingBalance": IDL.Nat,
		"materialsCharge": IDL.Nat,
		"depositRequired": IDL.Nat,
		"subtotal": IDL.Nat
	});
	const TaxSetting = IDL.Record({
		"enabled": IDL.Bool,
		"ratePercent": IDL.Nat
	});
	const AdminSettings = IDL.Record({
		"appointmentReminders": IDL.Bool,
		"notificationSound": IDL.Bool,
		"messageAlerts": IDL.Bool,
		"pushNotifications": IDL.Bool,
		"customerRequestAlerts": IDL.Bool
	});
	const QuoteSettings = IDL.Record({
		"terms": IDL.Text,
		"validityDays": IDL.Nat
	});
	const DepositSetting = IDL.Record({ "percent": IDL.Nat });
	const BusinessSettings = IDL.Record({
		"businessName": IDL.Text,
		"businessEmail": IDL.Text,
		"businessAddress": IDL.Text,
		"businessPhone": IDL.Text
	});
	const PaymentSettings = IDL.Record({
		"chimeHandle": IDL.Text,
		"venmoHandle": IDL.Text,
		"payPalHandle": IDL.Text,
		"cashAppHandle": IDL.Text,
		"acceptedMethods": IDL.Vec(PaymentMethod)
	});
	const SettingsBundle = IDL.Record({
		"tax": TaxSetting,
		"admin": AdminSettings,
		"quote": QuoteSettings,
		"deposit": DepositSetting,
		"business": BusinessSettings,
		"payment": PaymentSettings
	});
	const StripeSessionStatus = IDL.Variant({
		"completed": IDL.Record({
			"userPrincipal": IDL.Opt(IDL.Text),
			"response": IDL.Text
		}),
		"failed": IDL.Record({ "error": IDL.Text })
	});
	const TwilioConfigStatus = IDL.Record({
		"configured": IDL.Bool,
		"fromNumber": IDL.Text
	});
	const CustomerSummary = IDL.Record({
		"id": CustomerId,
		"status": CustomerStatus,
		"serviceAddress": IDL.Text,
		"fullName": IDL.Text,
		"email": IDL.Text,
		"phone": IDL.Text,
		"jobCount": IDL.Nat
	});
	const NotificationId = IDL.Nat;
	const NotificationKind = IDL.Variant({
		"appointmentReminder": IDL.Null,
		"depositReceived": IDL.Null,
		"returningCustomerRequest": IDL.Null,
		"depositVerified": IDL.Null,
		"depositSubmitted": IDL.Null,
		"appointmentConfirmed": IDL.Null,
		"newCustomer": IDL.Null,
		"quoteApproved": IDL.Null,
		"newRequest": IDL.Null,
		"appointmentChanged": IDL.Null,
		"customerMessage": IDL.Null,
		"paymentReceived": IDL.Null,
		"quoteDeclined": IDL.Null,
		"newMessage": IDL.Null,
		"bookingApproval": IDL.Null
	});
	const NotificationView = IDL.Record({
		"id": NotificationId,
		"title": IDL.Text,
		"relatedCustomerId": IDL.Opt(CustomerId),
		"body": IDL.Text,
		"kind": NotificationKind,
		"createdAt": Timestamp,
		"read": IDL.Bool,
		"relatedJobId": IDL.Opt(JobId)
	});
	const NotificationError = IDL.Variant({
		"notAuthorized": IDL.Null,
		"notFound": IDL.Null
	});
	const Result_17 = IDL.Variant({
		"ok": IDL.Null,
		"err": NotificationError
	});
	const MessageError = IDL.Variant({
		"notAuthorized": IDL.Null,
		"invalidInput": IDL.Text,
		"notFound": IDL.Null
	});
	const Result_16 = IDL.Variant({
		"ok": MessageView,
		"err": MessageError
	});
	const Result_15 = IDL.Variant({
		"ok": PaymentHistory,
		"err": JobError
	});
	const QuoteEmailResult = IDL.Variant({
		"sent": IDL.Null,
		"failed": IDL.Text
	});
	const QuoteSendResult = IDL.Record({
		"view": JobRequestView,
		"email": QuoteEmailResult
	});
	const Result_14 = IDL.Variant({
		"ok": QuoteSendResult,
		"err": JobError
	});
	const ChannelResult = IDL.Variant({
		"sent": IDL.Null,
		"failed": IDL.Text
	});
	const TestAlertResult = IDL.Record({
		"sms": ChannelResult,
		"email": ChannelResult
	});
	const Result_13 = IDL.Variant({
		"ok": AdminSettings,
		"err": SettingsError
	});
	const Result_12 = IDL.Variant({
		"ok": BusinessSettings,
		"err": SettingsError
	});
	const Result_11 = IDL.Variant({
		"ok": DepositSetting,
		"err": SettingsError
	});
	const FrontendOriginError = IDL.Variant({ "invalidOrigin": IDL.Text });
	const Result_10 = IDL.Variant({
		"ok": IDL.Text,
		"err": FrontendOriginError
	});
	const OwnerAlertError = IDL.Variant({
		"invalidEmail": IDL.Text,
		"sendFailed": IDL.Text
	});
	const Result_9 = IDL.Variant({
		"ok": IDL.Text,
		"err": OwnerAlertError
	});
	const OwnerAlertPhoneError = IDL.Variant({
		"invalidPhone": IDL.Text,
		"sendFailed": IDL.Text
	});
	const Result_8 = IDL.Variant({
		"ok": IDL.Text,
		"err": OwnerAlertPhoneError
	});
	const Result_6 = IDL.Variant({
		"ok": PaymentSettings,
		"err": SettingsError
	});
	const Result_5 = IDL.Variant({
		"ok": QuoteSettings,
		"err": SettingsError
	});
	const StripeConfiguration = IDL.Record({
		"allowedCountries": IDL.Vec(IDL.Text),
		"secretKey": IDL.Text
	});
	const Result_4 = IDL.Variant({
		"ok": TaxSetting,
		"err": SettingsError
	});
	const HttpHeader = IDL.Record({
		"value": IDL.Text,
		"name": IDL.Text
	});
	const HttpRequestResult = IDL.Record({
		"status": IDL.Nat,
		"body": IDL.Vec(IDL.Nat8),
		"headers": IDL.Vec(HttpHeader)
	});
	const TransformationInput = IDL.Record({
		"context": IDL.Vec(IDL.Nat8),
		"response": HttpRequestResult
	});
	const TransformationOutput = IDL.Record({
		"status": IDL.Nat,
		"body": IDL.Vec(IDL.Nat8),
		"headers": IDL.Vec(HttpHeader)
	});
	return IDL.Service({
		"_immutableObjectStorageBlobsAreLive": IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [IDL.Vec(IDL.Bool)], ["query"]),
		"_immutableObjectStorageBlobsToDelete": IDL.Func([], [IDL.Vec(IDL.Vec(IDL.Nat8))], ["query"]),
		"_immutableObjectStorageConfirmBlobDeletion": IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
		"_immutableObjectStorageCreateCertificate": IDL.Func([IDL.Text], [_ImmutableObjectStorageCreateCertificateResult], []),
		"_immutableObjectStorageRefillCashier": IDL.Func([IDL.Opt(_ImmutableObjectStorageRefillInformation)], [_ImmutableObjectStorageRefillResult], []),
		"_immutableObjectStorageUpdateGatewayPrincipals": IDL.Func([], [], []),
		"_initialize_access_control": IDL.Func([], [], []),
		"_internet_identity_sign_in_finish": IDL.Func([], [Result_21], []),
		"_internet_identity_sign_in_start": IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
		"acceptQuote": IDL.Func([ReferenceCode], [Result], []),
		"addCustomerNote": IDL.Func([CustomerId, IDL.Text], [Result_2], []),
		"advanceJobRecord": IDL.Func([JobRecordId], [Result_19], []),
		"advanceStatus": IDL.Func([JobId], [Result], []),
		"approveQuote": IDL.Func([JobId], [Result], []),
		"archiveCustomer": IDL.Func([CustomerId], [Result_2], []),
		"assignBeeToJob": IDL.Func([JobId, BeeId], [Result_7], []),
		"assignCallerUserRole": IDL.Func([IDL.Principal, UserRole], [], []),
		"cancelJob": IDL.Func([JobId], [Result], []),
		"cancelJobRecord": IDL.Func([JobRecordId], [Result_19], []),
		"completeJobRecord": IDL.Func([JobRecordId], [Result_19], []),
		"confirmAppointment": IDL.Func([ReferenceCode], [Result], []),
		"confirmDepositPayment": IDL.Func([ReferenceCode], [Result], []),
		"convertQuoteToJob": IDL.Func([JobId, Timestamp], [Result], []),
		"createBee": IDL.Func([BeeInput], [Result_3], []),
		"createCheckoutSession": IDL.Func([
			IDL.Vec(ShoppingItem),
			IDL.Text,
			IDL.Text
		], [IDL.Text], []),
		"createCustomer": IDL.Func([CustomerInput], [Result_2], []),
		"createDepositCheckoutSession": IDL.Func([
			ReferenceCode,
			IDL.Text,
			IDL.Text
		], [Result_20], []),
		"createDiscount": IDL.Func([DiscountRuleInput], [Result_1], []),
		"createJobForCustomer": IDL.Func([CustomerId, JobRequestInput], [Result], []),
		"createJobRecord": IDL.Func([JobId, Timestamp], [Result_19], []),
		"declineQuote": IDL.Func([JobId], [Result], []),
		"declineQuoteByReference": IDL.Func([ReferenceCode], [Result], []),
		"deleteDiscount": IDL.Func([DiscountId], [Result_18], []),
		"editQuote": IDL.Func([JobId, QuoteInput], [Result], []),
		"execute": IDL.Func([IDL.Text], [Result__1], ["query"]),
		"exportCustomersCsv": IDL.Func([], [IDL.Text], ["query"]),
		"getApiDoc": IDL.Func([], [IDL.Text], ["query"]),
		"getCallerUserRole": IDL.Func([], [UserRole], ["query"]),
		"getCustomer": IDL.Func([CustomerId], [IDL.Opt(CustomerView)], ["query"]),
		"getCustomerMessages": IDL.Func([IDL.Text], [IDL.Vec(MessageView)], ["query"]),
		"getCustomerProfile": IDL.Func([CustomerId], [IDL.Opt(CustomerProfileView)], ["query"]),
		"getCustomerVisitHistory": IDL.Func([JobId], [IDL.Vec(VisitRecord)], ["query"]),
		"getDashboardStats": IDL.Func([], [DashboardStats], ["query"]),
		"getFrontendOrigin": IDL.Func([], [IDL.Text], ["query"]),
		"getJobRecord": IDL.Func([JobRecordId], [IDL.Opt(JobRecordView)], ["query"]),
		"getOwnerAlertEmail": IDL.Func([], [IDL.Text], ["query"]),
		"getOwnerAlertPhone": IDL.Func([], [IDL.Text], ["query"]),
		"getPaymentHistoryForJob": IDL.Func([JobId], [IDL.Opt(PaymentHistory)], ["query"]),
		"getPaymentSummary": IDL.Func([ReferenceCode], [IDL.Opt(PaymentSummaryView)], ["query"]),
		"getQuoteByReference": IDL.Func([ReferenceCode], [IDL.Opt(QuoteView)], ["query"]),
		"getRequest": IDL.Func([JobId], [IDL.Opt(JobRequestView)], ["query"]),
		"getRequestByReference": IDL.Func([ReferenceCode], [IDL.Opt(JobRequestView)], ["query"]),
		"getSettings": IDL.Func([], [SettingsBundle], ["query"]),
		"getStripeSessionStatus": IDL.Func([IDL.Text], [StripeSessionStatus], []),
		"getTwilioConfigStatus": IDL.Func([], [TwilioConfigStatus], ["query"]),
		"getUnreadNotificationCount": IDL.Func([], [IDL.Nat], ["query"]),
		"getVisitHistory": IDL.Func([ReferenceCode], [IDL.Vec(VisitRecord)], ["query"]),
		"isCallerAdmin": IDL.Func([], [IDL.Bool], ["query"]),
		"isStripeConfigured": IDL.Func([], [IDL.Bool], ["query"]),
		"listBees": IDL.Func([], [IDL.Vec(BeeView)], ["query"]),
		"listCustomerMessages": IDL.Func([CustomerId], [IDL.Vec(MessageView)], ["query"]),
		"listCustomers": IDL.Func([IDL.Bool], [IDL.Vec(CustomerSummary)], ["query"]),
		"listDiscounts": IDL.Func([], [IDL.Vec(DiscountRule)], ["query"]),
		"listJobRecords": IDL.Func([], [IDL.Vec(JobRecordView)], ["query"]),
		"listNotifications": IDL.Func([], [IDL.Vec(NotificationView)], ["query"]),
		"listPaymentHistory": IDL.Func([], [IDL.Vec(PaymentHistory)], ["query"]),
		"listRequests": IDL.Func([], [IDL.Vec(JobRequestView)], ["query"]),
		"markAllNotificationsRead": IDL.Func([], [], []),
		"markNotificationRead": IDL.Func([NotificationId], [Result_17], []),
		"postAdminMessage": IDL.Func([
			CustomerId,
			IDL.Opt(JobId),
			IDL.Text
		], [Result_16], []),
		"postCustomerMessage": IDL.Func([IDL.Text, IDL.Text], [Result_16], []),
		"raiseNotification": IDL.Func([
			NotificationKind,
			IDL.Text,
			IDL.Text,
			IDL.Opt(JobId),
			IDL.Opt(CustomerId)
		], [NotificationId], []),
		"recordDeposit": IDL.Func([ReferenceCode, PaymentMethod], [Result], []),
		"recordFinalPayment": IDL.Func([
			JobId,
			IDL.Nat,
			PaymentMethod
		], [Result_15], []),
		"rejectDeposit": IDL.Func([ReferenceCode], [Result], []),
		"resolveOrCreateCustomer": IDL.Func([
			IDL.Text,
			IDL.Text,
			IDL.Text,
			IDL.Text
		], [CustomerId], []),
		"restoreCustomer": IDL.Func([CustomerId], [Result_2], []),
		"scheduleAppointment": IDL.Func([JobId, Timestamp], [Result], []),
		"schema": IDL.Func([], [IDL.Text], ["query"]),
		"searchCustomers": IDL.Func([IDL.Text], [IDL.Vec(CustomerSummary)], ["query"]),
		"sendAppointmentReminder": IDL.Func([JobId], [Result], []),
		"sendQuote": IDL.Func([JobId], [Result_14], []),
		"sendTestAlert": IDL.Func([], [TestAlertResult], []),
		"setAdminSettings": IDL.Func([AdminSettings], [Result_13], []),
		"setBusinessSettings": IDL.Func([BusinessSettings], [Result_12], []),
		"setCustomerStatus": IDL.Func([CustomerId, CustomerStatus], [Result_2], []),
		"setDepositSetting": IDL.Func([DepositSetting], [Result_11], []),
		"setDiscountActive": IDL.Func([DiscountId, IDL.Bool], [Result_1], []),
		"setFrontendOrigin": IDL.Func([IDL.Text], [Result_10], []),
		"setOwnerAlertEmail": IDL.Func([IDL.Text], [Result_9], []),
		"setOwnerAlertPhone": IDL.Func([IDL.Text], [Result_8], []),
		"setPackageEnrollment": IDL.Func([JobId, IDL.Bool], [Result_7], []),
		"setPaymentSettings": IDL.Func([PaymentSettings], [Result_6], []),
		"setQuote": IDL.Func([
			JobId,
			IDL.Nat,
			IDL.Text
		], [Result], []),
		"setQuoteSettings": IDL.Func([QuoteSettings], [Result_5], []),
		"setStripeConfiguration": IDL.Func([StripeConfiguration], [], []),
		"setTaxSetting": IDL.Func([TaxSetting], [Result_4], []),
		"setTwilioCredentials": IDL.Func([
			IDL.Text,
			IDL.Text,
			IDL.Text,
			IDL.Text
		], [], []),
		"submitDeposit": IDL.Func([ReferenceCode, PaymentMethod], [Result], []),
		"submitRequest": IDL.Func([JobRequestInput], [ReferenceCode], []),
		"submitReview": IDL.Func([
			ReferenceCode,
			IDL.Nat,
			IDL.Text
		], [Result], []),
		"transform": IDL.Func([TransformationInput], [TransformationOutput], ["query"]),
		"updateBee": IDL.Func([BeeId, BeeInput], [Result_3], []),
		"updateCustomer": IDL.Func([CustomerId, CustomerInput], [Result_2], []),
		"updateDiscount": IDL.Func([DiscountId, DiscountRuleInput], [Result_1], []),
		"verifyDeposit": IDL.Func([ReferenceCode], [Result], [])
	});
};
// src/backend.ts
function candid_some(value) {
	return [value];
}
function candid_none() {
	return [];
}
function record_opt_to_undefined(arg) {
	return arg == null ? void 0 : arg;
}
var CustomerStatus = /* @__PURE__ */ function(CustomerStatus) {
	CustomerStatus["active"] = "active";
	CustomerStatus["inactive"] = "inactive";
	CustomerStatus["archived"] = "archived";
	return CustomerStatus;
}({});
var DepositStatus = /* @__PURE__ */ function(DepositStatus) {
	DepositStatus["verified"] = "verified";
	DepositStatus["submitted"] = "submitted";
	DepositStatus["pending"] = "pending";
	DepositStatus["rejected"] = "rejected";
	return DepositStatus;
}({});
var DiscountEligibility = /* @__PURE__ */ function(DiscountEligibility) {
	DiscountEligibility["all"] = "all";
	DiscountEligibility["returningCustomer"] = "returningCustomer";
	DiscountEligibility["ownParts"] = "ownParts";
	return DiscountEligibility;
}({});
var DiscountKind = /* @__PURE__ */ function(DiscountKind) {
	DiscountKind["fixed"] = "fixed";
	DiscountKind["percentage"] = "percentage";
	return DiscountKind;
}({});
var JobRecordStatus = /* @__PURE__ */ function(JobRecordStatus) {
	JobRecordStatus["scheduled"] = "scheduled";
	JobRecordStatus["cancelled"] = "cancelled";
	JobRecordStatus["completed"] = "completed";
	JobRecordStatus["inProgress"] = "inProgress";
	return JobRecordStatus;
}({});
var JobStatus = /* @__PURE__ */ function(JobStatus) {
	JobStatus["scheduled"] = "scheduled";
	JobStatus["requested"] = "requested";
	JobStatus["cancelled"] = "cancelled";
	JobStatus["completed"] = "completed";
	JobStatus["quoted"] = "quoted";
	JobStatus["inProgress"] = "inProgress";
	return JobStatus;
}({});
var NotificationKind = /* @__PURE__ */ function(NotificationKind) {
	NotificationKind["appointmentReminder"] = "appointmentReminder";
	NotificationKind["depositReceived"] = "depositReceived";
	NotificationKind["returningCustomerRequest"] = "returningCustomerRequest";
	NotificationKind["depositVerified"] = "depositVerified";
	NotificationKind["depositSubmitted"] = "depositSubmitted";
	NotificationKind["appointmentConfirmed"] = "appointmentConfirmed";
	NotificationKind["newCustomer"] = "newCustomer";
	NotificationKind["quoteApproved"] = "quoteApproved";
	NotificationKind["newRequest"] = "newRequest";
	NotificationKind["appointmentChanged"] = "appointmentChanged";
	NotificationKind["customerMessage"] = "customerMessage";
	NotificationKind["paymentReceived"] = "paymentReceived";
	NotificationKind["quoteDeclined"] = "quoteDeclined";
	NotificationKind["newMessage"] = "newMessage";
	NotificationKind["bookingApproval"] = "bookingApproval";
	return NotificationKind;
}({});
var PaymentMethod = /* @__PURE__ */ function(PaymentMethod) {
	PaymentMethod["stripe"] = "stripe";
	PaymentMethod["venmo"] = "venmo";
	PaymentMethod["chime"] = "chime";
	PaymentMethod["cashApp"] = "cashApp";
	PaymentMethod["payPal"] = "payPal";
	return PaymentMethod;
}({});
var PreferredContact = /* @__PURE__ */ function(PreferredContact) {
	PreferredContact["sms"] = "sms";
	PreferredContact["email"] = "email";
	PreferredContact["phone"] = "phone";
	return PreferredContact;
}({});
var QuoteStatus = /* @__PURE__ */ function(QuoteStatus) {
	QuoteStatus["sent"] = "sent";
	QuoteStatus["approved"] = "approved";
	QuoteStatus["declined"] = "declined";
	QuoteStatus["draft"] = "draft";
	return QuoteStatus;
}({});
var ServiceCategory = /* @__PURE__ */ function(ServiceCategory) {
	ServiceCategory["fixIt"] = "fixIt";
	ServiceCategory["showMe"] = "showMe";
	ServiceCategory["house"] = "house";
	ServiceCategory["cleanOrganize"] = "cleanOrganize";
	ServiceCategory["mowing"] = "mowing";
	ServiceCategory["errands"] = "errands";
	ServiceCategory["moveLift"] = "moveLift";
	ServiceCategory["yardPlants"] = "yardPlants";
	return ServiceCategory;
}({});
var Backend = class {
	actor;
	_uploadFile;
	_downloadFile;
	processError;
	constructor(actor, _uploadFile, _downloadFile, processError) {
		this.actor = actor;
		this._uploadFile = _uploadFile;
		this._downloadFile = _downloadFile;
		this.processError = processError;
	}
	async _immutableObjectStorageBlobsAreLive(arg0) {
		if (this.processError) try {
			return await this.actor._immutableObjectStorageBlobsAreLive(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._immutableObjectStorageBlobsAreLive(arg0);
	}
	async _immutableObjectStorageBlobsToDelete() {
		if (this.processError) try {
			return await this.actor._immutableObjectStorageBlobsToDelete();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._immutableObjectStorageBlobsToDelete();
	}
	async _immutableObjectStorageConfirmBlobDeletion(arg0) {
		if (this.processError) try {
			return await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
	}
	async _immutableObjectStorageCreateCertificate(arg0) {
		if (this.processError) try {
			return await this.actor._immutableObjectStorageCreateCertificate(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._immutableObjectStorageCreateCertificate(arg0);
	}
	async _immutableObjectStorageRefillCashier(arg0) {
		if (this.processError) try {
			const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
			return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
			return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
		}
	}
	async _immutableObjectStorageUpdateGatewayPrincipals() {
		if (this.processError) try {
			return await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
	}
	async _initialize_access_control() {
		if (this.processError) try {
			return await this.actor._initialize_access_control();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._initialize_access_control();
	}
	async _internet_identity_sign_in_finish() {
		if (this.processError) try {
			const result = await this.actor._internet_identity_sign_in_finish();
			return from_candid_Result_21_n8(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor._internet_identity_sign_in_finish();
			return from_candid_Result_21_n8(this._uploadFile, this._downloadFile, result);
		}
	}
	async _internet_identity_sign_in_start() {
		if (this.processError) try {
			return await this.actor._internet_identity_sign_in_start();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor._internet_identity_sign_in_start();
	}
	async acceptQuote(arg0) {
		if (this.processError) try {
			const result = await this.actor.acceptQuote(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.acceptQuote(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async addCustomerNote(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.addCustomerNote(arg0, arg1);
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.addCustomerNote(arg0, arg1);
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		}
	}
	async advanceJobRecord(arg0) {
		if (this.processError) try {
			const result = await this.actor.advanceJobRecord(arg0);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.advanceJobRecord(arg0);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		}
	}
	async advanceStatus(arg0) {
		if (this.processError) try {
			const result = await this.actor.advanceStatus(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.advanceStatus(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async approveQuote(arg0) {
		if (this.processError) try {
			const result = await this.actor.approveQuote(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.approveQuote(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async archiveCustomer(arg0) {
		if (this.processError) try {
			const result = await this.actor.archiveCustomer(arg0);
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.archiveCustomer(arg0);
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		}
	}
	async assignBeeToJob(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.assignBeeToJob(arg0, arg1);
			return from_candid_Result_7_n54(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.assignBeeToJob(arg0, arg1);
			return from_candid_Result_7_n54(this._uploadFile, this._downloadFile, result);
		}
	}
	async assignCallerUserRole(arg0, arg1) {
		if (this.processError) try {
			return await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n58(this._uploadFile, this._downloadFile, arg1));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n58(this._uploadFile, this._downloadFile, arg1));
	}
	async cancelJob(arg0) {
		if (this.processError) try {
			const result = await this.actor.cancelJob(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.cancelJob(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async cancelJobRecord(arg0) {
		if (this.processError) try {
			const result = await this.actor.cancelJobRecord(arg0);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.cancelJobRecord(arg0);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		}
	}
	async completeJobRecord(arg0) {
		if (this.processError) try {
			const result = await this.actor.completeJobRecord(arg0);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.completeJobRecord(arg0);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		}
	}
	async confirmAppointment(arg0) {
		if (this.processError) try {
			const result = await this.actor.confirmAppointment(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.confirmAppointment(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async confirmDepositPayment(arg0) {
		if (this.processError) try {
			const result = await this.actor.confirmDepositPayment(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.confirmDepositPayment(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async convertQuoteToJob(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.convertQuoteToJob(arg0, arg1);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.convertQuoteToJob(arg0, arg1);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async createBee(arg0) {
		if (this.processError) try {
			const result = await this.actor.createBee(arg0);
			return from_candid_Result_3_n59(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.createBee(arg0);
			return from_candid_Result_3_n59(this._uploadFile, this._downloadFile, result);
		}
	}
	async createCheckoutSession(arg0, arg1, arg2) {
		if (this.processError) try {
			return await this.actor.createCheckoutSession(arg0, arg1, arg2);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.createCheckoutSession(arg0, arg1, arg2);
	}
	async createCustomer(arg0) {
		if (this.processError) try {
			const result = await this.actor.createCustomer(to_candid_CustomerInput_n61(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.createCustomer(to_candid_CustomerInput_n61(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		}
	}
	async createDepositCheckoutSession(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.createDepositCheckoutSession(arg0, arg1, arg2);
			return from_candid_Result_20_n64(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.createDepositCheckoutSession(arg0, arg1, arg2);
			return from_candid_Result_20_n64(this._uploadFile, this._downloadFile, result);
		}
	}
	async createDiscount(arg0) {
		if (this.processError) try {
			const result = await this.actor.createDiscount(to_candid_DiscountRuleInput_n66(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n70(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.createDiscount(to_candid_DiscountRuleInput_n66(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_1_n70(this._uploadFile, this._downloadFile, result);
		}
	}
	async createJobForCustomer(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.createJobForCustomer(arg0, to_candid_JobRequestInput_n77(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.createJobForCustomer(arg0, to_candid_JobRequestInput_n77(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async createJobRecord(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.createJobRecord(arg0, arg1);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.createJobRecord(arg0, arg1);
			return from_candid_Result_19_n49(this._uploadFile, this._downloadFile, result);
		}
	}
	async declineQuote(arg0) {
		if (this.processError) try {
			const result = await this.actor.declineQuote(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.declineQuote(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async declineQuoteByReference(arg0) {
		if (this.processError) try {
			const result = await this.actor.declineQuoteByReference(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.declineQuoteByReference(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async deleteDiscount(arg0) {
		if (this.processError) try {
			const result = await this.actor.deleteDiscount(arg0);
			return from_candid_Result_18_n80(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.deleteDiscount(arg0);
			return from_candid_Result_18_n80(this._uploadFile, this._downloadFile, result);
		}
	}
	async editQuote(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.editQuote(arg0, to_candid_QuoteInput_n82(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.editQuote(arg0, to_candid_QuoteInput_n82(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async execute(arg0) {
		if (this.processError) try {
			const result = await this.actor.execute(arg0);
			return from_candid_Result__1_n84(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.execute(arg0);
			return from_candid_Result__1_n84(this._uploadFile, this._downloadFile, result);
		}
	}
	async exportCustomersCsv() {
		if (this.processError) try {
			return await this.actor.exportCustomersCsv();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.exportCustomersCsv();
	}
	async getApiDoc() {
		if (this.processError) try {
			return await this.actor.getApiDoc();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getApiDoc();
	}
	async getCallerUserRole() {
		if (this.processError) try {
			const result = await this.actor.getCallerUserRole();
			return from_candid_UserRole_n92(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCallerUserRole();
			return from_candid_UserRole_n92(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCustomer(arg0) {
		if (this.processError) try {
			const result = await this.actor.getCustomer(arg0);
			return from_candid_opt_n93(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCustomer(arg0);
			return from_candid_opt_n93(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCustomerMessages(arg0) {
		if (this.processError) try {
			const result = await this.actor.getCustomerMessages(arg0);
			return from_candid_vec_n94(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCustomerMessages(arg0);
			return from_candid_vec_n94(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCustomerProfile(arg0) {
		if (this.processError) try {
			const result = await this.actor.getCustomerProfile(arg0);
			return from_candid_opt_n98(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCustomerProfile(arg0);
			return from_candid_opt_n98(this._uploadFile, this._downloadFile, result);
		}
	}
	async getCustomerVisitHistory(arg0) {
		if (this.processError) try {
			const result = await this.actor.getCustomerVisitHistory(arg0);
			return from_candid_vec_n111(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getCustomerVisitHistory(arg0);
			return from_candid_vec_n111(this._uploadFile, this._downloadFile, result);
		}
	}
	async getDashboardStats() {
		if (this.processError) try {
			return await this.actor.getDashboardStats();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getDashboardStats();
	}
	async getFrontendOrigin() {
		if (this.processError) try {
			return await this.actor.getFrontendOrigin();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getFrontendOrigin();
	}
	async getJobRecord(arg0) {
		if (this.processError) try {
			const result = await this.actor.getJobRecord(arg0);
			return from_candid_opt_n114(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getJobRecord(arg0);
			return from_candid_opt_n114(this._uploadFile, this._downloadFile, result);
		}
	}
	async getOwnerAlertEmail() {
		if (this.processError) try {
			return await this.actor.getOwnerAlertEmail();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getOwnerAlertEmail();
	}
	async getOwnerAlertPhone() {
		if (this.processError) try {
			return await this.actor.getOwnerAlertPhone();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getOwnerAlertPhone();
	}
	async getPaymentHistoryForJob(arg0) {
		if (this.processError) try {
			const result = await this.actor.getPaymentHistoryForJob(arg0);
			return from_candid_opt_n115(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getPaymentHistoryForJob(arg0);
			return from_candid_opt_n115(this._uploadFile, this._downloadFile, result);
		}
	}
	async getPaymentSummary(arg0) {
		if (this.processError) try {
			const result = await this.actor.getPaymentSummary(arg0);
			return from_candid_opt_n116(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getPaymentSummary(arg0);
			return from_candid_opt_n116(this._uploadFile, this._downloadFile, result);
		}
	}
	async getQuoteByReference(arg0) {
		if (this.processError) try {
			const result = await this.actor.getQuoteByReference(arg0);
			return from_candid_opt_n121(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getQuoteByReference(arg0);
			return from_candid_opt_n121(this._uploadFile, this._downloadFile, result);
		}
	}
	async getRequest(arg0) {
		if (this.processError) try {
			const result = await this.actor.getRequest(arg0);
			return from_candid_opt_n124(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getRequest(arg0);
			return from_candid_opt_n124(this._uploadFile, this._downloadFile, result);
		}
	}
	async getRequestByReference(arg0) {
		if (this.processError) try {
			const result = await this.actor.getRequestByReference(arg0);
			return from_candid_opt_n124(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getRequestByReference(arg0);
			return from_candid_opt_n124(this._uploadFile, this._downloadFile, result);
		}
	}
	async getSettings() {
		if (this.processError) try {
			const result = await this.actor.getSettings();
			return from_candid_SettingsBundle_n125(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getSettings();
			return from_candid_SettingsBundle_n125(this._uploadFile, this._downloadFile, result);
		}
	}
	async getStripeSessionStatus(arg0) {
		if (this.processError) try {
			const result = await this.actor.getStripeSessionStatus(arg0);
			return from_candid_StripeSessionStatus_n129(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getStripeSessionStatus(arg0);
			return from_candid_StripeSessionStatus_n129(this._uploadFile, this._downloadFile, result);
		}
	}
	async getTwilioConfigStatus() {
		if (this.processError) try {
			return await this.actor.getTwilioConfigStatus();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getTwilioConfigStatus();
	}
	async getUnreadNotificationCount() {
		if (this.processError) try {
			return await this.actor.getUnreadNotificationCount();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.getUnreadNotificationCount();
	}
	async getVisitHistory(arg0) {
		if (this.processError) try {
			const result = await this.actor.getVisitHistory(arg0);
			return from_candid_vec_n111(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.getVisitHistory(arg0);
			return from_candid_vec_n111(this._uploadFile, this._downloadFile, result);
		}
	}
	async isCallerAdmin() {
		if (this.processError) try {
			return await this.actor.isCallerAdmin();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.isCallerAdmin();
	}
	async isStripeConfigured() {
		if (this.processError) try {
			return await this.actor.isStripeConfigured();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.isStripeConfigured();
	}
	async listBees() {
		if (this.processError) try {
			return await this.actor.listBees();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.listBees();
	}
	async listCustomerMessages(arg0) {
		if (this.processError) try {
			const result = await this.actor.listCustomerMessages(arg0);
			return from_candid_vec_n94(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listCustomerMessages(arg0);
			return from_candid_vec_n94(this._uploadFile, this._downloadFile, result);
		}
	}
	async listCustomers(arg0) {
		if (this.processError) try {
			const result = await this.actor.listCustomers(arg0);
			return from_candid_vec_n132(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listCustomers(arg0);
			return from_candid_vec_n132(this._uploadFile, this._downloadFile, result);
		}
	}
	async listDiscounts() {
		if (this.processError) try {
			const result = await this.actor.listDiscounts();
			return from_candid_vec_n135(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listDiscounts();
			return from_candid_vec_n135(this._uploadFile, this._downloadFile, result);
		}
	}
	async listJobRecords() {
		if (this.processError) try {
			const result = await this.actor.listJobRecords();
			return from_candid_vec_n110(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listJobRecords();
			return from_candid_vec_n110(this._uploadFile, this._downloadFile, result);
		}
	}
	async listNotifications() {
		if (this.processError) try {
			const result = await this.actor.listNotifications();
			return from_candid_vec_n136(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listNotifications();
			return from_candid_vec_n136(this._uploadFile, this._downloadFile, result);
		}
	}
	async listPaymentHistory() {
		if (this.processError) try {
			const result = await this.actor.listPaymentHistory();
			return from_candid_vec_n102(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listPaymentHistory();
			return from_candid_vec_n102(this._uploadFile, this._downloadFile, result);
		}
	}
	async listRequests() {
		if (this.processError) try {
			const result = await this.actor.listRequests();
			return from_candid_vec_n101(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.listRequests();
			return from_candid_vec_n101(this._uploadFile, this._downloadFile, result);
		}
	}
	async markAllNotificationsRead() {
		if (this.processError) try {
			return await this.actor.markAllNotificationsRead();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.markAllNotificationsRead();
	}
	async markNotificationRead(arg0) {
		if (this.processError) try {
			const result = await this.actor.markNotificationRead(arg0);
			return from_candid_Result_17_n141(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.markNotificationRead(arg0);
			return from_candid_Result_17_n141(this._uploadFile, this._downloadFile, result);
		}
	}
	async postAdminMessage(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.postAdminMessage(arg0, to_candid_opt_n144(this._uploadFile, this._downloadFile, arg1), arg2);
			return from_candid_Result_16_n145(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.postAdminMessage(arg0, to_candid_opt_n144(this._uploadFile, this._downloadFile, arg1), arg2);
			return from_candid_Result_16_n145(this._uploadFile, this._downloadFile, result);
		}
	}
	async postCustomerMessage(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.postCustomerMessage(arg0, arg1);
			return from_candid_Result_16_n145(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.postCustomerMessage(arg0, arg1);
			return from_candid_Result_16_n145(this._uploadFile, this._downloadFile, result);
		}
	}
	async raiseNotification(arg0, arg1, arg2, arg3, arg4) {
		if (this.processError) try {
			return await this.actor.raiseNotification(to_candid_NotificationKind_n148(this._uploadFile, this._downloadFile, arg0), arg1, arg2, to_candid_opt_n144(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n149(this._uploadFile, this._downloadFile, arg4));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.raiseNotification(to_candid_NotificationKind_n148(this._uploadFile, this._downloadFile, arg0), arg1, arg2, to_candid_opt_n144(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n149(this._uploadFile, this._downloadFile, arg4));
	}
	async recordDeposit(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.recordDeposit(arg0, to_candid_PaymentMethod_n150(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.recordDeposit(arg0, to_candid_PaymentMethod_n150(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async recordFinalPayment(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.recordFinalPayment(arg0, arg1, to_candid_PaymentMethod_n150(this._uploadFile, this._downloadFile, arg2));
			return from_candid_Result_15_n151(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.recordFinalPayment(arg0, arg1, to_candid_PaymentMethod_n150(this._uploadFile, this._downloadFile, arg2));
			return from_candid_Result_15_n151(this._uploadFile, this._downloadFile, result);
		}
	}
	async rejectDeposit(arg0) {
		if (this.processError) try {
			const result = await this.actor.rejectDeposit(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.rejectDeposit(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async resolveOrCreateCustomer(arg0, arg1, arg2, arg3) {
		if (this.processError) try {
			return await this.actor.resolveOrCreateCustomer(arg0, arg1, arg2, arg3);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.resolveOrCreateCustomer(arg0, arg1, arg2, arg3);
	}
	async restoreCustomer(arg0) {
		if (this.processError) try {
			const result = await this.actor.restoreCustomer(arg0);
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.restoreCustomer(arg0);
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		}
	}
	async scheduleAppointment(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.scheduleAppointment(arg0, arg1);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.scheduleAppointment(arg0, arg1);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async schema() {
		if (this.processError) try {
			return await this.actor.schema();
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.schema();
	}
	async searchCustomers(arg0) {
		if (this.processError) try {
			const result = await this.actor.searchCustomers(arg0);
			return from_candid_vec_n132(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.searchCustomers(arg0);
			return from_candid_vec_n132(this._uploadFile, this._downloadFile, result);
		}
	}
	async sendAppointmentReminder(arg0) {
		if (this.processError) try {
			const result = await this.actor.sendAppointmentReminder(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.sendAppointmentReminder(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async sendQuote(arg0) {
		if (this.processError) try {
			const result = await this.actor.sendQuote(arg0);
			return from_candid_Result_14_n153(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.sendQuote(arg0);
			return from_candid_Result_14_n153(this._uploadFile, this._downloadFile, result);
		}
	}
	async sendTestAlert() {
		if (this.processError) try {
			const result = await this.actor.sendTestAlert();
			return from_candid_TestAlertResult_n159(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.sendTestAlert();
			return from_candid_TestAlertResult_n159(this._uploadFile, this._downloadFile, result);
		}
	}
	async setAdminSettings(arg0) {
		if (this.processError) try {
			const result = await this.actor.setAdminSettings(arg0);
			return from_candid_Result_13_n162(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setAdminSettings(arg0);
			return from_candid_Result_13_n162(this._uploadFile, this._downloadFile, result);
		}
	}
	async setBusinessSettings(arg0) {
		if (this.processError) try {
			const result = await this.actor.setBusinessSettings(arg0);
			return from_candid_Result_12_n164(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setBusinessSettings(arg0);
			return from_candid_Result_12_n164(this._uploadFile, this._downloadFile, result);
		}
	}
	async setCustomerStatus(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.setCustomerStatus(arg0, to_candid_CustomerStatus_n166(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setCustomerStatus(arg0, to_candid_CustomerStatus_n166(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		}
	}
	async setDepositSetting(arg0) {
		if (this.processError) try {
			const result = await this.actor.setDepositSetting(arg0);
			return from_candid_Result_11_n167(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setDepositSetting(arg0);
			return from_candid_Result_11_n167(this._uploadFile, this._downloadFile, result);
		}
	}
	async setDiscountActive(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.setDiscountActive(arg0, arg1);
			return from_candid_Result_1_n70(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setDiscountActive(arg0, arg1);
			return from_candid_Result_1_n70(this._uploadFile, this._downloadFile, result);
		}
	}
	async setFrontendOrigin(arg0) {
		if (this.processError) try {
			const result = await this.actor.setFrontendOrigin(arg0);
			return from_candid_Result_10_n169(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setFrontendOrigin(arg0);
			return from_candid_Result_10_n169(this._uploadFile, this._downloadFile, result);
		}
	}
	async setOwnerAlertEmail(arg0) {
		if (this.processError) try {
			const result = await this.actor.setOwnerAlertEmail(arg0);
			return from_candid_Result_9_n173(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setOwnerAlertEmail(arg0);
			return from_candid_Result_9_n173(this._uploadFile, this._downloadFile, result);
		}
	}
	async setOwnerAlertPhone(arg0) {
		if (this.processError) try {
			const result = await this.actor.setOwnerAlertPhone(arg0);
			return from_candid_Result_8_n177(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setOwnerAlertPhone(arg0);
			return from_candid_Result_8_n177(this._uploadFile, this._downloadFile, result);
		}
	}
	async setPackageEnrollment(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.setPackageEnrollment(arg0, arg1);
			return from_candid_Result_7_n54(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setPackageEnrollment(arg0, arg1);
			return from_candid_Result_7_n54(this._uploadFile, this._downloadFile, result);
		}
	}
	async setPaymentSettings(arg0) {
		if (this.processError) try {
			const result = await this.actor.setPaymentSettings(to_candid_PaymentSettings_n181(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_6_n184(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setPaymentSettings(to_candid_PaymentSettings_n181(this._uploadFile, this._downloadFile, arg0));
			return from_candid_Result_6_n184(this._uploadFile, this._downloadFile, result);
		}
	}
	async setQuote(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.setQuote(arg0, arg1, arg2);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setQuote(arg0, arg1, arg2);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async setQuoteSettings(arg0) {
		if (this.processError) try {
			const result = await this.actor.setQuoteSettings(arg0);
			return from_candid_Result_5_n186(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setQuoteSettings(arg0);
			return from_candid_Result_5_n186(this._uploadFile, this._downloadFile, result);
		}
	}
	async setStripeConfiguration(arg0) {
		if (this.processError) try {
			return await this.actor.setStripeConfiguration(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.setStripeConfiguration(arg0);
	}
	async setTaxSetting(arg0) {
		if (this.processError) try {
			const result = await this.actor.setTaxSetting(arg0);
			return from_candid_Result_4_n188(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.setTaxSetting(arg0);
			return from_candid_Result_4_n188(this._uploadFile, this._downloadFile, result);
		}
	}
	async setTwilioCredentials(arg0, arg1, arg2, arg3) {
		if (this.processError) try {
			return await this.actor.setTwilioCredentials(arg0, arg1, arg2, arg3);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.setTwilioCredentials(arg0, arg1, arg2, arg3);
	}
	async submitDeposit(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.submitDeposit(arg0, to_candid_PaymentMethod_n150(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.submitDeposit(arg0, to_candid_PaymentMethod_n150(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async submitRequest(arg0) {
		if (this.processError) try {
			return await this.actor.submitRequest(to_candid_JobRequestInput_n77(this._uploadFile, this._downloadFile, arg0));
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.submitRequest(to_candid_JobRequestInput_n77(this._uploadFile, this._downloadFile, arg0));
	}
	async submitReview(arg0, arg1, arg2) {
		if (this.processError) try {
			const result = await this.actor.submitReview(arg0, arg1, arg2);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.submitReview(arg0, arg1, arg2);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
	async transform(arg0) {
		if (this.processError) try {
			return await this.actor.transform(arg0);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else return await this.actor.transform(arg0);
	}
	async updateBee(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.updateBee(arg0, arg1);
			return from_candid_Result_3_n59(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.updateBee(arg0, arg1);
			return from_candid_Result_3_n59(this._uploadFile, this._downloadFile, result);
		}
	}
	async updateCustomer(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.updateCustomer(arg0, to_candid_CustomerInput_n61(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.updateCustomer(arg0, to_candid_CustomerInput_n61(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_2_n41(this._uploadFile, this._downloadFile, result);
		}
	}
	async updateDiscount(arg0, arg1) {
		if (this.processError) try {
			const result = await this.actor.updateDiscount(arg0, to_candid_DiscountRuleInput_n66(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_1_n70(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.updateDiscount(arg0, to_candid_DiscountRuleInput_n66(this._uploadFile, this._downloadFile, arg1));
			return from_candid_Result_1_n70(this._uploadFile, this._downloadFile, result);
		}
	}
	async verifyDeposit(arg0) {
		if (this.processError) try {
			const result = await this.actor.verifyDeposit(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		} catch (e) {
			this.processError(e);
			throw new Error("unreachable");
		}
		else {
			const result = await this.actor.verifyDeposit(arg0);
			return from_candid_Result_n12(this._uploadFile, this._downloadFile, result);
		}
	}
};
function from_candid_BeeError_n56(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n57(_uploadFile, _downloadFile, value);
}
function from_candid_Cell_n88(_uploadFile, _downloadFile, value) {
	return from_candid_record_n89(_uploadFile, _downloadFile, value);
}
function from_candid_ChannelResult_n161(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n158(_uploadFile, _downloadFile, value);
}
function from_candid_CustomerError_n47(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n48(_uploadFile, _downloadFile, value);
}
function from_candid_CustomerProfileView_n99(_uploadFile, _downloadFile, value) {
	return from_candid_record_n100(_uploadFile, _downloadFile, value);
}
function from_candid_CustomerStatus_n45(_uploadFile, _downloadFile, value) {
	return "active" in value ? "active" : "inactive" in value ? "inactive" : "archived" in value ? "archived" : value;
}
function from_candid_CustomerSummary_n133(_uploadFile, _downloadFile, value) {
	return from_candid_record_n134(_uploadFile, _downloadFile, value);
}
function from_candid_CustomerView_n43(_uploadFile, _downloadFile, value) {
	return from_candid_record_n44(_uploadFile, _downloadFile, value);
}
function from_candid_DepositStatus_n34(_uploadFile, _downloadFile, value) {
	return "verified" in value ? "verified" : "submitted" in value ? "submitted" : "pending" in value ? "pending" : "rejected" in value ? "rejected" : value;
}
function from_candid_Deposit_n32(_uploadFile, _downloadFile, value) {
	return from_candid_record_n33(_uploadFile, _downloadFile, value);
}
function from_candid_DiscountApplication_n28(_uploadFile, _downloadFile, value) {
	return from_candid_record_n29(_uploadFile, _downloadFile, value);
}
function from_candid_DiscountEligibility_n75(_uploadFile, _downloadFile, value) {
	return "all" in value ? "all" : "returningCustomer" in value ? "returningCustomer" : "ownParts" in value ? "ownParts" : value;
}
function from_candid_DiscountKind_n74(_uploadFile, _downloadFile, value) {
	return "fixed" in value ? "fixed" : "percentage" in value ? "percentage" : value;
}
function from_candid_DiscountRule_n72(_uploadFile, _downloadFile, value) {
	return from_candid_record_n73(_uploadFile, _downloadFile, value);
}
function from_candid_Error_n10(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n11(_uploadFile, _downloadFile, value);
}
function from_candid_FrontendOriginError_n171(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n172(_uploadFile, _downloadFile, value);
}
function from_candid_JobError_n39(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n40(_uploadFile, _downloadFile, value);
}
function from_candid_JobRecordStatus_n53(_uploadFile, _downloadFile, value) {
	return "scheduled" in value ? "scheduled" : "cancelled" in value ? "cancelled" : "completed" in value ? "completed" : "inProgress" in value ? "inProgress" : value;
}
function from_candid_JobRecordView_n51(_uploadFile, _downloadFile, value) {
	return from_candid_record_n52(_uploadFile, _downloadFile, value);
}
function from_candid_JobRequestView_n14(_uploadFile, _downloadFile, value) {
	return from_candid_record_n15(_uploadFile, _downloadFile, value);
}
function from_candid_JobStatus_n16(_uploadFile, _downloadFile, value) {
	return "scheduled" in value ? "scheduled" : "requested" in value ? "requested" : "cancelled" in value ? "cancelled" : "completed" in value ? "completed" : "quoted" in value ? "quoted" : "inProgress" in value ? "inProgress" : value;
}
function from_candid_MessageError_n147(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n48(_uploadFile, _downloadFile, value);
}
function from_candid_MessageView__1_n106(_uploadFile, _downloadFile, value) {
	return from_candid_record_n107(_uploadFile, _downloadFile, value);
}
function from_candid_MessageView_n95(_uploadFile, _downloadFile, value) {
	return from_candid_record_n96(_uploadFile, _downloadFile, value);
}
function from_candid_NotificationError_n143(_uploadFile, _downloadFile, value) {
	return "notAuthorized" in value ? "notAuthorized" : "notFound" in value ? "notFound" : value;
}
function from_candid_NotificationKind_n140(_uploadFile, _downloadFile, value) {
	return "appointmentReminder" in value ? "appointmentReminder" : "depositReceived" in value ? "depositReceived" : "returningCustomerRequest" in value ? "returningCustomerRequest" : "depositVerified" in value ? "depositVerified" : "depositSubmitted" in value ? "depositSubmitted" : "appointmentConfirmed" in value ? "appointmentConfirmed" : "newCustomer" in value ? "newCustomer" : "quoteApproved" in value ? "quoteApproved" : "newRequest" in value ? "newRequest" : "appointmentChanged" in value ? "appointmentChanged" : "customerMessage" in value ? "customerMessage" : "paymentReceived" in value ? "paymentReceived" : "quoteDeclined" in value ? "quoteDeclined" : "newMessage" in value ? "newMessage" : "bookingApproval" in value ? "bookingApproval" : value;
}
function from_candid_NotificationView_n137(_uploadFile, _downloadFile, value) {
	return from_candid_record_n138(_uploadFile, _downloadFile, value);
}
function from_candid_OwnerAlertError_n175(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n176(_uploadFile, _downloadFile, value);
}
function from_candid_OwnerAlertPhoneError_n179(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n180(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentHistory_n103(_uploadFile, _downloadFile, value) {
	return from_candid_record_n104(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentMethod_n35(_uploadFile, _downloadFile, value) {
	return "stripe" in value ? "stripe" : "venmo" in value ? "venmo" : "chime" in value ? "chime" : "cashApp" in value ? "cashApp" : "payPal" in value ? "payPal" : value;
}
function from_candid_PaymentSettings_n127(_uploadFile, _downloadFile, value) {
	return from_candid_record_n128(_uploadFile, _downloadFile, value);
}
function from_candid_PaymentSummaryView_n117(_uploadFile, _downloadFile, value) {
	return from_candid_record_n118(_uploadFile, _downloadFile, value);
}
function from_candid_PreferredContact_n46(_uploadFile, _downloadFile, value) {
	return "sms" in value ? "sms" : "email" in value ? "email" : "phone" in value ? "phone" : value;
}
function from_candid_QuoteEmailResult_n157(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n158(_uploadFile, _downloadFile, value);
}
function from_candid_QuotePricing_n26(_uploadFile, _downloadFile, value) {
	return from_candid_record_n27(_uploadFile, _downloadFile, value);
}
function from_candid_QuoteSendResult_n155(_uploadFile, _downloadFile, value) {
	return from_candid_record_n156(_uploadFile, _downloadFile, value);
}
function from_candid_QuoteStatus_n24(_uploadFile, _downloadFile, value) {
	return "sent" in value ? "sent" : "approved" in value ? "approved" : "declined" in value ? "declined" : "draft" in value ? "draft" : value;
}
function from_candid_QuoteView_n122(_uploadFile, _downloadFile, value) {
	return from_candid_record_n123(_uploadFile, _downloadFile, value);
}
function from_candid_Quote_n22(_uploadFile, _downloadFile, value) {
	return from_candid_record_n23(_uploadFile, _downloadFile, value);
}
function from_candid_Result_10_n169(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n170(_uploadFile, _downloadFile, value);
}
function from_candid_Result_11_n167(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n168(_uploadFile, _downloadFile, value);
}
function from_candid_Result_12_n164(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n165(_uploadFile, _downloadFile, value);
}
function from_candid_Result_13_n162(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n163(_uploadFile, _downloadFile, value);
}
function from_candid_Result_14_n153(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n154(_uploadFile, _downloadFile, value);
}
function from_candid_Result_15_n151(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n152(_uploadFile, _downloadFile, value);
}
function from_candid_Result_16_n145(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n146(_uploadFile, _downloadFile, value);
}
function from_candid_Result_17_n141(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n142(_uploadFile, _downloadFile, value);
}
function from_candid_Result_18_n80(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n81(_uploadFile, _downloadFile, value);
}
function from_candid_Result_19_n49(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n50(_uploadFile, _downloadFile, value);
}
function from_candid_Result_1_n70(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n71(_uploadFile, _downloadFile, value);
}
function from_candid_Result_20_n64(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n65(_uploadFile, _downloadFile, value);
}
function from_candid_Result_21_n8(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function from_candid_Result_2_n41(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n42(_uploadFile, _downloadFile, value);
}
function from_candid_Result_3_n59(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n60(_uploadFile, _downloadFile, value);
}
function from_candid_Result_4_n188(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n189(_uploadFile, _downloadFile, value);
}
function from_candid_Result_5_n186(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n187(_uploadFile, _downloadFile, value);
}
function from_candid_Result_6_n184(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n185(_uploadFile, _downloadFile, value);
}
function from_candid_Result_7_n54(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n55(_uploadFile, _downloadFile, value);
}
function from_candid_Result_8_n177(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n178(_uploadFile, _downloadFile, value);
}
function from_candid_Result_9_n173(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n174(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n84(_uploadFile, _downloadFile, value) {
	return from_candid_record_n85(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n12(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n13(_uploadFile, _downloadFile, value);
}
function from_candid_ServiceCategory_n37(_uploadFile, _downloadFile, value) {
	return "fixIt" in value ? "fixIt" : "showMe" in value ? "showMe" : "house" in value ? "house" : "cleanOrganize" in value ? "cleanOrganize" : "mowing" in value ? "mowing" : "errands" in value ? "errands" : "moveLift" in value ? "moveLift" : "yardPlants" in value ? "yardPlants" : value;
}
function from_candid_SettingsBundle_n125(_uploadFile, _downloadFile, value) {
	return from_candid_record_n126(_uploadFile, _downloadFile, value);
}
function from_candid_SettingsError_n76(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n48(_uploadFile, _downloadFile, value);
}
function from_candid_StripeSessionStatus_n129(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n130(_uploadFile, _downloadFile, value);
}
function from_candid_TestAlertResult_n159(_uploadFile, _downloadFile, value) {
	return from_candid_record_n160(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n92(_uploadFile, _downloadFile, value) {
	return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_Value_n90(_uploadFile, _downloadFile, value) {
	return from_candid_variant_n91(_uploadFile, _downloadFile, value);
}
function from_candid_VisitRecord_n112(_uploadFile, _downloadFile, value) {
	return from_candid_record_n113(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
	return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n114(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_JobRecordView_n51(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n115(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_PaymentHistory_n103(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n116(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_PaymentSummaryView_n117(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n119(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_PaymentMethod_n35(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n121(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_QuoteView_n122(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n124(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_JobRequestView_n14(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n139(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n17(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n18(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n19(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n20(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n21(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_Quote_n22(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n25(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_QuotePricing_n26(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n30(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n31(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_Deposit_n32(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n36(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n38(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n93(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_CustomerView_n43(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n97(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : value[0];
}
function from_candid_opt_n98(_uploadFile, _downloadFile, value) {
	return value.length === 0 ? null : from_candid_CustomerProfileView_n99(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n100(_uploadFile, _downloadFile, value) {
	return {
		completedJobs: from_candid_vec_n101(_uploadFile, _downloadFile, value.completedJobs),
		payments: from_candid_vec_n102(_uploadFile, _downloadFile, value.payments),
		customer: from_candid_CustomerView_n43(_uploadFile, _downloadFile, value.customer),
		messages: from_candid_vec_n105(_uploadFile, _downloadFile, value.messages),
		jobs: from_candid_vec_n101(_uploadFile, _downloadFile, value.jobs),
		photoIds: value.photoIds,
		appointments: value.appointments,
		cancelledJobs: from_candid_vec_n101(_uploadFile, _downloadFile, value.cancelledJobs),
		deposits: from_candid_vec_n108(_uploadFile, _downloadFile, value.deposits),
		pendingJobs: from_candid_vec_n101(_uploadFile, _downloadFile, value.pendingJobs),
		quotes: from_candid_vec_n109(_uploadFile, _downloadFile, value.quotes),
		jobRecords: from_candid_vec_n110(_uploadFile, _downloadFile, value.jobRecords)
	};
}
function from_candid_record_n104(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		depositAmount: value.depositAmount,
		paymentMethod: from_candid_PaymentMethod_n35(_uploadFile, _downloadFile, value.paymentMethod),
		depositStatus: from_candid_DepositStatus_n34(_uploadFile, _downloadFile, value.depositStatus),
		discountAmount: value.discountAmount,
		createdAt: value.createdAt,
		totalPaid: value.totalPaid,
		jobRequestId: value.jobRequestId,
		finalPayment: value.finalPayment,
		referenceCode: value.referenceCode,
		updatedAt: value.updatedAt,
		finalQuote: value.finalQuote,
		remainingBalance: value.remainingBalance,
		customerId: value.customerId,
		originalQuote: value.originalQuote
	};
}
function from_candid_record_n107(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		body: value.body,
		createdAt: value.createdAt,
		jobId: record_opt_to_undefined(from_candid_opt_n97(_uploadFile, _downloadFile, value.jobId)),
		customerId: value.customerId,
		fromAdmin: value.fromAdmin
	};
}
function from_candid_record_n113(_uploadFile, _downloadFile, value) {
	return {
		service: from_candid_ServiceCategory_n37(_uploadFile, _downloadFile, value.service),
		completedAt: value.completedAt,
		jobId: value.jobId,
		referenceCode: value.referenceCode,
		beeName: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.beeName)),
		beeId: record_opt_to_undefined(from_candid_opt_n38(_uploadFile, _downloadFile, value.beeId))
	};
}
function from_candid_record_n118(_uploadFile, _downloadFile, value) {
	return {
		customerName: value.customerName,
		depositAmount: value.depositAmount,
		chimeHandle: value.chimeHandle,
		adjustedSubtotal: value.adjustedSubtotal,
		venmoHandle: value.venmoHandle,
		depositStatus: from_candid_DepositStatus_n34(_uploadFile, _downloadFile, value.depositStatus),
		depositMethod: record_opt_to_undefined(from_candid_opt_n119(_uploadFile, _downloadFile, value.depositMethod)),
		discountAmount: value.discountAmount,
		finalTotal: value.finalTotal,
		appointmentConfirmed: value.appointmentConfirmed,
		serviceDescription: value.serviceDescription,
		discountReason: value.discountReason,
		referenceCode: value.referenceCode,
		payPalHandle: value.payPalHandle,
		cashAppHandle: value.cashAppHandle,
		remainingBalance: value.remainingBalance,
		originalSubtotal: value.originalSubtotal,
		acceptedMethods: from_candid_vec_n120(_uploadFile, _downloadFile, value.acceptedMethods),
		taxAmount: value.taxAmount,
		appointmentAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.appointmentAt))
	};
}
function from_candid_record_n123(_uploadFile, _downloadFile, value) {
	return {
		status: from_candid_QuoteStatus_n24(_uploadFile, _downloadFile, value.status),
		lineItems: value.lineItems,
		total: value.total,
		expiresAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.expiresAt)),
		expired: value.expired,
		laborCharge: value.laborCharge,
		discountApplied: value.discountApplied,
		discountAmount: value.discountAmount,
		note: value.note,
		quoteNumber: value.quoteNumber,
		workDescription: value.workDescription,
		pricing: record_opt_to_undefined(from_candid_opt_n25(_uploadFile, _downloadFile, value.pricing)),
		referenceCode: value.referenceCode,
		remainingBalance: value.remainingBalance,
		materialsCharge: value.materialsCharge,
		depositRequired: value.depositRequired,
		subtotal: value.subtotal
	};
}
function from_candid_record_n126(_uploadFile, _downloadFile, value) {
	return {
		tax: value.tax,
		admin: value.admin,
		quote: value.quote,
		deposit: value.deposit,
		business: value.business,
		payment: from_candid_PaymentSettings_n127(_uploadFile, _downloadFile, value.payment)
	};
}
function from_candid_record_n128(_uploadFile, _downloadFile, value) {
	return {
		chimeHandle: value.chimeHandle,
		venmoHandle: value.venmoHandle,
		payPalHandle: value.payPalHandle,
		cashAppHandle: value.cashAppHandle,
		acceptedMethods: from_candid_vec_n120(_uploadFile, _downloadFile, value.acceptedMethods)
	};
}
function from_candid_record_n131(_uploadFile, _downloadFile, value) {
	return {
		userPrincipal: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.userPrincipal)),
		response: value.response
	};
}
function from_candid_record_n134(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		status: from_candid_CustomerStatus_n45(_uploadFile, _downloadFile, value.status),
		serviceAddress: value.serviceAddress,
		fullName: value.fullName,
		email: value.email,
		phone: value.phone,
		jobCount: value.jobCount
	};
}
function from_candid_record_n138(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		title: value.title,
		relatedCustomerId: record_opt_to_undefined(from_candid_opt_n139(_uploadFile, _downloadFile, value.relatedCustomerId)),
		body: value.body,
		kind: from_candid_NotificationKind_n140(_uploadFile, _downloadFile, value.kind),
		createdAt: value.createdAt,
		read: value.read,
		relatedJobId: record_opt_to_undefined(from_candid_opt_n97(_uploadFile, _downloadFile, value.relatedJobId))
	};
}
function from_candid_record_n15(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		customerName: value.customerName,
		status: from_candid_JobStatus_n16(_uploadFile, _downloadFile, value.status),
		completedAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.completedAt)),
		review: record_opt_to_undefined(from_candid_opt_n18(_uploadFile, _downloadFile, value.review)),
		packageEnrollment: record_opt_to_undefined(from_candid_opt_n19(_uploadFile, _downloadFile, value.packageEnrollment)),
		preferredTiming: value.preferredTiming,
		appointment: record_opt_to_undefined(from_candid_opt_n20(_uploadFile, _downloadFile, value.appointment)),
		createdAt: value.createdAt,
		quote: record_opt_to_undefined(from_candid_opt_n21(_uploadFile, _downloadFile, value.quote)),
		description: value.description,
		photoIds: value.photoIds,
		deposit: record_opt_to_undefined(from_candid_opt_n31(_uploadFile, _downloadFile, value.deposit)),
		ownParts: value.ownParts,
		email: value.email,
		referenceCode: value.referenceCode,
		category: from_candid_ServiceCategory_n37(_uploadFile, _downloadFile, value.category),
		assignedBeeName: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.assignedBeeName)),
		phone: value.phone,
		assignedBeeId: record_opt_to_undefined(from_candid_opt_n38(_uploadFile, _downloadFile, value.assignedBeeId))
	};
}
function from_candid_record_n156(_uploadFile, _downloadFile, value) {
	return {
		view: from_candid_JobRequestView_n14(_uploadFile, _downloadFile, value.view),
		email: from_candid_QuoteEmailResult_n157(_uploadFile, _downloadFile, value.email)
	};
}
function from_candid_record_n160(_uploadFile, _downloadFile, value) {
	return {
		sms: from_candid_ChannelResult_n161(_uploadFile, _downloadFile, value.sms),
		email: from_candid_ChannelResult_n161(_uploadFile, _downloadFile, value.email)
	};
}
function from_candid_record_n23(_uploadFile, _downloadFile, value) {
	return {
		status: from_candid_QuoteStatus_n24(_uploadFile, _downloadFile, value.status),
		lineItems: value.lineItems,
		total: value.total,
		expiresAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.expiresAt)),
		laborCharge: value.laborCharge,
		discountApplied: value.discountApplied,
		discountAmount: value.discountAmount,
		note: value.note,
		createdAt: value.createdAt,
		quoteNumber: value.quoteNumber,
		sentAt: value.sentAt,
		workDescription: value.workDescription,
		pricing: record_opt_to_undefined(from_candid_opt_n25(_uploadFile, _downloadFile, value.pricing)),
		remainingBalance: value.remainingBalance,
		materialsCharge: value.materialsCharge,
		amount: value.amount,
		depositRequired: value.depositRequired,
		subtotal: value.subtotal
	};
}
function from_candid_record_n27(_uploadFile, _downloadFile, value) {
	return {
		depositAmount: value.depositAmount,
		adjustedSubtotal: value.adjustedSubtotal,
		discountAmount: value.discountAmount,
		finalTotal: value.finalTotal,
		remainingBalance: value.remainingBalance,
		originalSubtotal: value.originalSubtotal,
		discount: from_candid_DiscountApplication_n28(_uploadFile, _downloadFile, value.discount),
		taxAmount: value.taxAmount
	};
}
function from_candid_record_n29(_uploadFile, _downloadFile, value) {
	return {
		ruleName: value.ruleName,
		ruleId: record_opt_to_undefined(from_candid_opt_n30(_uploadFile, _downloadFile, value.ruleId)),
		applied: value.applied,
		reason: value.reason
	};
}
function from_candid_record_n33(_uploadFile, _downloadFile, value) {
	return {
		status: from_candid_DepositStatus_n34(_uploadFile, _downloadFile, value.status),
		method: from_candid_PaymentMethod_n35(_uploadFile, _downloadFile, value.method),
		paid: value.paid,
		submittedAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.submittedAt)),
		stripeSessionId: record_opt_to_undefined(from_candid_opt_n36(_uploadFile, _downloadFile, value.stripeSessionId)),
		amount: value.amount,
		verifiedAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.verifiedAt)),
		paidAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.paidAt))
	};
}
function from_candid_record_n44(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		status: from_candid_CustomerStatus_n45(_uploadFile, _downloadFile, value.status),
		serviceAddress: value.serviceAddress,
		createdAt: value.createdAt,
		fullName: value.fullName,
		email: value.email,
		preferredContact: from_candid_PreferredContact_n46(_uploadFile, _downloadFile, value.preferredContact),
		notes: value.notes,
		phone: value.phone,
		adminNotes: value.adminNotes
	};
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
	return {
		success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
		topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
	};
}
function from_candid_record_n52(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		customerName: value.customerName,
		status: from_candid_JobRecordStatus_n53(_uploadFile, _downloadFile, value.status),
		completedAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.completedAt)),
		serviceAddress: value.serviceAddress,
		createdAt: value.createdAt,
		quote: record_opt_to_undefined(from_candid_opt_n21(_uploadFile, _downloadFile, value.quote)),
		deposit: record_opt_to_undefined(from_candid_opt_n31(_uploadFile, _downloadFile, value.deposit)),
		jobRequestId: value.jobRequestId,
		pricing: record_opt_to_undefined(from_candid_opt_n25(_uploadFile, _downloadFile, value.pricing)),
		referenceCode: value.referenceCode,
		remainingBalance: value.remainingBalance,
		category: from_candid_ServiceCategory_n37(_uploadFile, _downloadFile, value.category),
		customerId: value.customerId,
		scheduledAt: value.scheduledAt
	};
}
function from_candid_record_n73(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		active: value.active,
		minPurchase: value.minPurchase,
		maxDiscount: value.maxDiscount,
		value: value.value,
		startAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.startAt)),
		kind: from_candid_DiscountKind_n74(_uploadFile, _downloadFile, value.kind),
		name: value.name,
		createdAt: value.createdAt,
		endAt: record_opt_to_undefined(from_candid_opt_n17(_uploadFile, _downloadFile, value.endAt)),
		eligibility: from_candid_DiscountEligibility_n75(_uploadFile, _downloadFile, value.eligibility)
	};
}
function from_candid_record_n85(_uploadFile, _downloadFile, value) {
	return {
		hasMore: value.hasMore,
		rows: from_candid_vec_n86(_uploadFile, _downloadFile, value.rows)
	};
}
function from_candid_record_n89(_uploadFile, _downloadFile, value) {
	return {
		value: from_candid_Value_n90(_uploadFile, _downloadFile, value.value),
		name: value.name
	};
}
function from_candid_record_n96(_uploadFile, _downloadFile, value) {
	return {
		id: value.id,
		body: value.body,
		createdAt: value.createdAt,
		jobId: record_opt_to_undefined(from_candid_opt_n97(_uploadFile, _downloadFile, value.jobId)),
		customerId: value.customerId,
		fromAdmin: value.fromAdmin
	};
}
function from_candid_variant_n11(_uploadFile, _downloadFile, value) {
	return "FrontendOriginsNotConfigured" in value ? {
		__kind__: "FrontendOriginsNotConfigured",
		FrontendOriginsNotConfigured: value.FrontendOriginsNotConfigured
	} : "MixedSsoSources" in value ? {
		__kind__: "MixedSsoSources",
		MixedSsoSources: value.MixedSsoSources
	} : "Stale" in value ? {
		__kind__: "Stale",
		Stale: value.Stale
	} : "MalformedCandid" in value ? {
		__kind__: "MalformedCandid",
		MalformedCandid: value.MalformedCandid
	} : "AmbiguousAttribute" in value ? {
		__kind__: "AmbiguousAttribute",
		AmbiguousAttribute: value.AmbiguousAttribute
	} : "NoAttributes" in value ? {
		__kind__: "NoAttributes",
		NoAttributes: value.NoAttributes
	} : "UnknownNonce" in value ? {
		__kind__: "UnknownNonce",
		UnknownNonce: value.UnknownNonce
	} : "UntrustedSsoSource" in value ? {
		__kind__: "UntrustedSsoSource",
		UntrustedSsoSource: value.UntrustedSsoSource
	} : "MissingField" in value ? {
		__kind__: "MissingField",
		MissingField: value.MissingField
	} : "FrontendOriginMismatch" in value ? {
		__kind__: "FrontendOriginMismatch",
		FrontendOriginMismatch: value.FrontendOriginMismatch
	} : value;
}
function from_candid_variant_n13(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_JobRequestView_n14(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_JobError_n39(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n130(_uploadFile, _downloadFile, value) {
	return "completed" in value ? {
		__kind__: "completed",
		completed: from_candid_record_n131(_uploadFile, _downloadFile, value.completed)
	} : "failed" in value ? {
		__kind__: "failed",
		failed: value.failed
	} : value;
}
function from_candid_variant_n142(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_NotificationError_n143(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n146(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_MessageView_n95(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_MessageError_n147(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n152(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_PaymentHistory_n103(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_JobError_n39(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n154(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_QuoteSendResult_n155(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_JobError_n39(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n158(_uploadFile, _downloadFile, value) {
	return "sent" in value ? {
		__kind__: "sent",
		sent: value.sent
	} : "failed" in value ? {
		__kind__: "failed",
		failed: value.failed
	} : value;
}
function from_candid_variant_n163(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n165(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n168(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n170(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_FrontendOriginError_n171(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n172(_uploadFile, _downloadFile, value) {
	return "invalidOrigin" in value ? {
		__kind__: "invalidOrigin",
		invalidOrigin: value.invalidOrigin
	} : value;
}
function from_candid_variant_n174(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_OwnerAlertError_n175(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n176(_uploadFile, _downloadFile, value) {
	return "invalidEmail" in value ? {
		__kind__: "invalidEmail",
		invalidEmail: value.invalidEmail
	} : "sendFailed" in value ? {
		__kind__: "sendFailed",
		sendFailed: value.sendFailed
	} : value;
}
function from_candid_variant_n178(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_OwnerAlertPhoneError_n179(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n180(_uploadFile, _downloadFile, value) {
	return "invalidPhone" in value ? {
		__kind__: "invalidPhone",
		invalidPhone: value.invalidPhone
	} : "sendFailed" in value ? {
		__kind__: "sendFailed",
		sendFailed: value.sendFailed
	} : value;
}
function from_candid_variant_n185(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_PaymentSettings_n127(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n187(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n189(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n40(_uploadFile, _downloadFile, value) {
	return "paymentError" in value ? {
		__kind__: "paymentError",
		paymentError: value.paymentError
	} : "invalidState" in value ? {
		__kind__: "invalidState",
		invalidState: value.invalidState
	} : "notAuthorized" in value ? {
		__kind__: "notAuthorized",
		notAuthorized: value.notAuthorized
	} : "notFound" in value ? {
		__kind__: "notFound",
		notFound: value.notFound
	} : value;
}
function from_candid_variant_n42(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_CustomerView_n43(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_CustomerError_n47(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n48(_uploadFile, _downloadFile, value) {
	return "notAuthorized" in value ? {
		__kind__: "notAuthorized",
		notAuthorized: value.notAuthorized
	} : "invalidInput" in value ? {
		__kind__: "invalidInput",
		invalidInput: value.invalidInput
	} : "notFound" in value ? {
		__kind__: "notFound",
		notFound: value.notFound
	} : value;
}
function from_candid_variant_n50(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_JobRecordView_n51(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_JobError_n39(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n55(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_JobRequestView_n14(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_BeeError_n56(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n57(_uploadFile, _downloadFile, value) {
	return "invalidState" in value ? {
		__kind__: "invalidState",
		invalidState: value.invalidState
	} : "notAuthorized" in value ? {
		__kind__: "notAuthorized",
		notAuthorized: value.notAuthorized
	} : "notFound" in value ? {
		__kind__: "notFound",
		notFound: value.notFound
	} : value;
}
function from_candid_variant_n60(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_BeeError_n56(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n65(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_JobError_n39(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n71(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: from_candid_DiscountRule_n72(_uploadFile, _downloadFile, value.ok)
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n81(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_SettingsError_n76(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n9(_uploadFile, _downloadFile, value) {
	return "ok" in value ? {
		__kind__: "ok",
		ok: value.ok
	} : "err" in value ? {
		__kind__: "err",
		err: from_candid_Error_n10(_uploadFile, _downloadFile, value.err)
	} : value;
}
function from_candid_variant_n91(_uploadFile, _downloadFile, value) {
	return "int" in value ? {
		__kind__: "int",
		int: value.int
	} : "nat" in value ? {
		__kind__: "nat",
		nat: value.nat
	} : "float" in value ? {
		__kind__: "float",
		float: value.float
	} : "bool" in value ? {
		__kind__: "bool",
		bool: value.bool
	} : "null" in value ? {
		__kind__: "null",
		null: value.null
	} : "text" in value ? {
		__kind__: "text",
		text: value.text
	} : value;
}
function from_candid_vec_n101(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_JobRequestView_n14(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n102(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_PaymentHistory_n103(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n105(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_MessageView__1_n106(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n108(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_Deposit_n32(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n109(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_Quote_n22(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n110(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_JobRecordView_n51(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n111(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_VisitRecord_n112(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n120(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_PaymentMethod_n35(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n132(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_CustomerSummary_n133(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n135(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_DiscountRule_n72(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n136(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_NotificationView_n137(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n86(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_vec_n87(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n87(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_Cell_n88(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n94(_uploadFile, _downloadFile, value) {
	return value.map((x) => from_candid_MessageView_n95(_uploadFile, _downloadFile, x));
}
function to_candid_CustomerInput_n61(_uploadFile, _downloadFile, value) {
	return to_candid_record_n62(_uploadFile, _downloadFile, value);
}
function to_candid_CustomerStatus_n166(_uploadFile, _downloadFile, value) {
	return value == "active" ? { active: null } : value == "inactive" ? { inactive: null } : value == "archived" ? { archived: null } : value;
}
function to_candid_DiscountEligibility_n69(_uploadFile, _downloadFile, value) {
	return value == "all" ? { all: null } : value == "returningCustomer" ? { returningCustomer: null } : value == "ownParts" ? { ownParts: null } : value;
}
function to_candid_DiscountKind_n68(_uploadFile, _downloadFile, value) {
	return value == "fixed" ? { fixed: null } : value == "percentage" ? { percentage: null } : value;
}
function to_candid_DiscountRuleInput_n66(_uploadFile, _downloadFile, value) {
	return to_candid_record_n67(_uploadFile, _downloadFile, value);
}
function to_candid_JobRequestInput_n77(_uploadFile, _downloadFile, value) {
	return to_candid_record_n78(_uploadFile, _downloadFile, value);
}
function to_candid_NotificationKind_n148(_uploadFile, _downloadFile, value) {
	return value == "appointmentReminder" ? { appointmentReminder: null } : value == "depositReceived" ? { depositReceived: null } : value == "returningCustomerRequest" ? { returningCustomerRequest: null } : value == "depositVerified" ? { depositVerified: null } : value == "depositSubmitted" ? { depositSubmitted: null } : value == "appointmentConfirmed" ? { appointmentConfirmed: null } : value == "newCustomer" ? { newCustomer: null } : value == "quoteApproved" ? { quoteApproved: null } : value == "newRequest" ? { newRequest: null } : value == "appointmentChanged" ? { appointmentChanged: null } : value == "customerMessage" ? { customerMessage: null } : value == "paymentReceived" ? { paymentReceived: null } : value == "quoteDeclined" ? { quoteDeclined: null } : value == "newMessage" ? { newMessage: null } : value == "bookingApproval" ? { bookingApproval: null } : value;
}
function to_candid_PaymentMethod_n150(_uploadFile, _downloadFile, value) {
	return value == "stripe" ? { stripe: null } : value == "venmo" ? { venmo: null } : value == "chime" ? { chime: null } : value == "cashApp" ? { cashApp: null } : value == "payPal" ? { payPal: null } : value;
}
function to_candid_PaymentSettings_n181(_uploadFile, _downloadFile, value) {
	return to_candid_record_n182(_uploadFile, _downloadFile, value);
}
function to_candid_PreferredContact_n63(_uploadFile, _downloadFile, value) {
	return value == "sms" ? { sms: null } : value == "email" ? { email: null } : value == "phone" ? { phone: null } : value;
}
function to_candid_QuoteInput_n82(_uploadFile, _downloadFile, value) {
	return to_candid_record_n83(_uploadFile, _downloadFile, value);
}
function to_candid_ServiceCategory_n79(_uploadFile, _downloadFile, value) {
	return value == "fixIt" ? { fixIt: null } : value == "showMe" ? { showMe: null } : value == "house" ? { house: null } : value == "cleanOrganize" ? { cleanOrganize: null } : value == "mowing" ? { mowing: null } : value == "errands" ? { errands: null } : value == "moveLift" ? { moveLift: null } : value == "yardPlants" ? { yardPlants: null } : value;
}
function to_candid_UserRole_n58(_uploadFile, _downloadFile, value) {
	return value == "admin" ? { admin: null } : value == "user" ? { user: null } : value == "guest" ? { guest: null } : value;
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
	return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
	return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n144(_uploadFile, _downloadFile, value) {
	return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n149(_uploadFile, _downloadFile, value) {
	return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n182(_uploadFile, _downloadFile, value) {
	return {
		chimeHandle: value.chimeHandle,
		venmoHandle: value.venmoHandle,
		payPalHandle: value.payPalHandle,
		cashAppHandle: value.cashAppHandle,
		acceptedMethods: to_candid_vec_n183(_uploadFile, _downloadFile, value.acceptedMethods)
	};
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
	return { proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none() };
}
function to_candid_record_n62(_uploadFile, _downloadFile, value) {
	return {
		serviceAddress: value.serviceAddress,
		fullName: value.fullName,
		email: value.email,
		preferredContact: to_candid_PreferredContact_n63(_uploadFile, _downloadFile, value.preferredContact),
		phone: value.phone
	};
}
function to_candid_record_n67(_uploadFile, _downloadFile, value) {
	return {
		active: value.active,
		minPurchase: value.minPurchase,
		maxDiscount: value.maxDiscount,
		value: value.value,
		startAt: value.startAt ? candid_some(value.startAt) : candid_none(),
		kind: to_candid_DiscountKind_n68(_uploadFile, _downloadFile, value.kind),
		name: value.name,
		endAt: value.endAt ? candid_some(value.endAt) : candid_none(),
		eligibility: to_candid_DiscountEligibility_n69(_uploadFile, _downloadFile, value.eligibility)
	};
}
function to_candid_record_n78(_uploadFile, _downloadFile, value) {
	return {
		customerName: value.customerName,
		preferredTiming: value.preferredTiming,
		description: value.description,
		photoIds: value.photoIds,
		ownParts: value.ownParts,
		email: value.email,
		category: to_candid_ServiceCategory_n79(_uploadFile, _downloadFile, value.category),
		phone: value.phone,
		packageInterest: value.packageInterest
	};
}
function to_candid_record_n83(_uploadFile, _downloadFile, value) {
	return {
		lineItems: value.lineItems,
		expiresAt: value.expiresAt ? candid_some(value.expiresAt) : candid_none(),
		laborCharge: value.laborCharge,
		note: value.note,
		workDescription: value.workDescription,
		materialsCharge: value.materialsCharge,
		depositRequired: value.depositRequired
	};
}
function to_candid_vec_n183(_uploadFile, _downloadFile, value) {
	return value.map((x) => to_candid_PaymentMethod_n150(_uploadFile, _downloadFile, x));
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
	const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
	if (options.agent && options.agentOptions) console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
	return new Backend(Actor.createActor(idlFactory, {
		agent,
		canisterId,
		...options.actorOptions
	}), _uploadFile, _downloadFile, options.processError);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/tailwind-merge@2.6.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs
var CLASS_PART_SEPARATOR = "-";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		const classParts = className.split(CLASS_PART_SEPARATOR);
		if (classParts[0] === "" && classParts.length !== 1) classParts.shift();
		return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		const conflicts = conflictingClassGroups[classGroupId] || [];
		if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
		return conflicts;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, classPartObject) => {
	if (classParts.length === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[0];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
	if (classGroupFromNextClassPart) return classGroupFromNextClassPart;
	if (classPartObject.validators.length === 0) return;
	const classRest = classParts.join(CLASS_PART_SEPARATOR);
	return classPartObject.validators.find(({ validator }) => validator(classRest))?.classGroupId;
};
var arbitraryPropertyRegex = /^\[(.+)\]$/;
var getGroupIdForArbitraryProperty = (className) => {
	if (arbitraryPropertyRegex.test(className)) {
		const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
		const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
		if (property) return "arbitrary.." + property;
	}
};
/**
* Exported for testing only
*/
var createClassMap = (config) => {
	const { theme, prefix } = config;
	const classMap = {
		nextPart: /* @__PURE__ */ new Map(),
		validators: []
	};
	getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix).forEach(([classGroupId, classGroup]) => {
		processClassesRecursively(classGroup, classMap, classGroupId, theme);
	});
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	classGroup.forEach((classDefinition) => {
		if (typeof classDefinition === "string") {
			const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
			classPartObjectToEdit.classGroupId = classGroupId;
			return;
		}
		if (typeof classDefinition === "function") {
			if (isThemeGetter(classDefinition)) {
				processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
				return;
			}
			classPartObject.validators.push({
				validator: classDefinition,
				classGroupId
			});
			return;
		}
		Object.entries(classDefinition).forEach(([key, classGroup]) => {
			processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
		});
	});
};
var getPart = (classPartObject, path) => {
	let currentClassPartObject = classPartObject;
	path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
		if (!currentClassPartObject.nextPart.has(pathPart)) currentClassPartObject.nextPart.set(pathPart, {
			nextPart: /* @__PURE__ */ new Map(),
			validators: []
		});
		currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
	});
	return currentClassPartObject;
};
var isThemeGetter = (func) => func.isThemeGetter;
var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
	if (!prefix) return classGroupEntries;
	return classGroupEntries.map(([classGroupId, classGroup]) => {
		return [classGroupId, classGroup.map((classDefinition) => {
			if (typeof classDefinition === "string") return prefix + classDefinition;
			if (typeof classDefinition === "object") return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
			return classDefinition;
		})];
	});
};
var createLruCache = (maxCacheSize) => {
	if (maxCacheSize < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let cacheSize = 0;
	let cache = /* @__PURE__ */ new Map();
	let previousCache = /* @__PURE__ */ new Map();
	const update = (key, value) => {
		cache.set(key, value);
		cacheSize++;
		if (cacheSize > maxCacheSize) {
			cacheSize = 0;
			previousCache = cache;
			cache = /* @__PURE__ */ new Map();
		}
	};
	return {
		get(key) {
			let value = cache.get(key);
			if (value !== void 0) return value;
			if ((value = previousCache.get(key)) !== void 0) {
				update(key, value);
				return value;
			}
		},
		set(key, value) {
			if (cache.has(key)) cache.set(key, value);
			else update(key, value);
		}
	};
};
var IMPORTANT_MODIFIER = "!";
var createParseClassName = (config) => {
	const { separator, experimentalParseClassName } = config;
	const isSeparatorSingleCharacter = separator.length === 1;
	const firstSeparatorCharacter = separator[0];
	const separatorLength = separator.length;
	const parseClassName = (className) => {
		const modifiers = [];
		let bracketDepth = 0;
		let modifierStart = 0;
		let postfixModifierPosition;
		for (let index = 0; index < className.length; index++) {
			let currentCharacter = className[index];
			if (bracketDepth === 0) {
				if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
					modifiers.push(className.slice(modifierStart, index));
					modifierStart = index + separatorLength;
					continue;
				}
				if (currentCharacter === "/") {
					postfixModifierPosition = index;
					continue;
				}
			}
			if (currentCharacter === "[") bracketDepth++;
			else if (currentCharacter === "]") bracketDepth--;
		}
		const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
		const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
		return {
			modifiers,
			hasImportantModifier,
			baseClassName: hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier,
			maybePostfixModifierPosition: postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0
		};
	};
	if (experimentalParseClassName) return (className) => experimentalParseClassName({
		className,
		parseClassName
	});
	return parseClassName;
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
var sortModifiers = (modifiers) => {
	if (modifiers.length <= 1) return modifiers;
	const sortedModifiers = [];
	let unsortedModifiers = [];
	modifiers.forEach((modifier) => {
		if (modifier[0] === "[") {
			sortedModifiers.push(...unsortedModifiers.sort(), modifier);
			unsortedModifiers = [];
		} else unsortedModifiers.push(modifier);
	});
	sortedModifiers.push(...unsortedModifiers.sort());
	return sortedModifiers;
};
var createConfigUtils = (config) => ({
	cache: createLruCache(config.cacheSize),
	parseClassName: createParseClassName(config),
	...createClassGroupUtils(config)
});
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
	const { parseClassName, getClassGroupId, getConflictingClassGroupIds } = configUtils;
	/**
	* Set of classGroupIds in following format:
	* `{importantModifier}{variantModifiers}{classGroupId}`
	* @example 'float'
	* @example 'hover:focus:bg-color'
	* @example 'md:!pr'
	*/
	const classGroupsInConflict = [];
	const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
	let result = "";
	for (let index = classNames.length - 1; index >= 0; index -= 1) {
		const originalClassName = classNames[index];
		const { modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
		let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			hasPostfixModifier = false;
		}
		const variantModifier = sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const classId = modifierId + classGroupId;
		if (classGroupsInConflict.includes(classId)) continue;
		classGroupsInConflict.push(classId);
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		for (let i = 0; i < conflictGroups.length; ++i) {
			const group = conflictGroups[i];
			classGroupsInConflict.push(modifierId + group);
		}
		result = originalClassName + (result.length > 0 ? " " + result : result);
	}
	return result;
};
/**
* The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
*
* Specifically:
* - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
* - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
*
* Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
*/
function twJoin() {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < arguments.length) if (argument = arguments[index++]) {
		if (resolvedValue = toValue(argument)) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
}
var toValue = (mix) => {
	if (typeof mix === "string") return mix;
	let resolvedValue;
	let string = "";
	for (let k = 0; k < mix.length; k++) if (mix[k]) {
		if (resolvedValue = toValue(mix[k])) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
	let configUtils;
	let cacheGet;
	let cacheSet;
	let functionToCall = initTailwindMerge;
	function initTailwindMerge(classList) {
		configUtils = createConfigUtils(createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst()));
		cacheGet = configUtils.cache.get;
		cacheSet = configUtils.cache.set;
		functionToCall = tailwindMerge;
		return tailwindMerge(classList);
	}
	function tailwindMerge(classList) {
		const cachedResult = cacheGet(classList);
		if (cachedResult) return cachedResult;
		const result = mergeClassList(classList, configUtils);
		cacheSet(classList, result);
		return result;
	}
	return function callTailwindMerge() {
		return functionToCall(twJoin.apply(null, arguments));
	};
}
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || [];
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
var fractionRegex = /^\d+\/\d+$/;
var stringLengths = /*#__PURE__*/ new Set([
	"px",
	"full",
	"screen"
]);
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
var isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var sizeLabels = /*#__PURE__*/ new Set([
	"length",
	"size",
	"percentage"
]);
var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
var imageLabels = /*#__PURE__*/ new Set(["image", "url"]);
var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
var isAny = () => true;
var getIsArbitraryValue = (value, label, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return typeof label === "string" ? result[1] === label : label.has(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var getDefaultConfig = () => {
	const colors = fromTheme("colors");
	const spacing = fromTheme("spacing");
	const blur = fromTheme("blur");
	const brightness = fromTheme("brightness");
	const borderColor = fromTheme("borderColor");
	const borderRadius = fromTheme("borderRadius");
	const borderSpacing = fromTheme("borderSpacing");
	const borderWidth = fromTheme("borderWidth");
	const contrast = fromTheme("contrast");
	const grayscale = fromTheme("grayscale");
	const hueRotate = fromTheme("hueRotate");
	const invert = fromTheme("invert");
	const gap = fromTheme("gap");
	const gradientColorStops = fromTheme("gradientColorStops");
	const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
	const inset = fromTheme("inset");
	const margin = fromTheme("margin");
	const opacity = fromTheme("opacity");
	const padding = fromTheme("padding");
	const saturate = fromTheme("saturate");
	const scale = fromTheme("scale");
	const sepia = fromTheme("sepia");
	const skew = fromTheme("skew");
	const space = fromTheme("space");
	const translate = fromTheme("translate");
	const getOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const getOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const getSpacingWithAutoAndArbitrary = () => [
		"auto",
		isArbitraryValue,
		spacing
	];
	const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
	const getLengthWithEmptyAndArbitrary = () => [
		"",
		isLength,
		isArbitraryLength
	];
	const getNumberWithAutoAndArbitrary = () => [
		"auto",
		isNumber,
		isArbitraryValue
	];
	const getPositions = () => [
		"bottom",
		"center",
		"left",
		"left-bottom",
		"left-top",
		"right",
		"right-bottom",
		"right-top",
		"top"
	];
	const getLineStyles = () => [
		"solid",
		"dashed",
		"dotted",
		"double",
		"none"
	];
	const getBlendModes = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const getAlign = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch"
	];
	const getZeroAndEmpty = () => [
		"",
		"0",
		isArbitraryValue
	];
	const getBreaks = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
	return {
		cacheSize: 500,
		separator: ":",
		theme: {
			colors: [isAny],
			spacing: [isLength, isArbitraryLength],
			blur: [
				"none",
				"",
				isTshirtSize,
				isArbitraryValue
			],
			brightness: getNumberAndArbitrary(),
			borderColor: [colors],
			borderRadius: [
				"none",
				"",
				"full",
				isTshirtSize,
				isArbitraryValue
			],
			borderSpacing: getSpacingWithArbitrary(),
			borderWidth: getLengthWithEmptyAndArbitrary(),
			contrast: getNumberAndArbitrary(),
			grayscale: getZeroAndEmpty(),
			hueRotate: getNumberAndArbitrary(),
			invert: getZeroAndEmpty(),
			gap: getSpacingWithArbitrary(),
			gradientColorStops: [colors],
			gradientColorStopPositions: [isPercent, isArbitraryLength],
			inset: getSpacingWithAutoAndArbitrary(),
			margin: getSpacingWithAutoAndArbitrary(),
			opacity: getNumberAndArbitrary(),
			padding: getSpacingWithArbitrary(),
			saturate: getNumberAndArbitrary(),
			scale: getNumberAndArbitrary(),
			sepia: getZeroAndEmpty(),
			skew: getNumberAndArbitrary(),
			space: getSpacingWithArbitrary(),
			translate: getSpacingWithArbitrary()
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				"video",
				isArbitraryValue
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			*/
			container: ["container"],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [isTshirtSize] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": getBreaks() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": getBreaks() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: [...getPositions(), isArbitraryValue] }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: getOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": getOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": getOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: getOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": getOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": getOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Top / Right / Bottom / Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: [inset] }],
			/**
			* Right / Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": [inset] }],
			/**
			* Top / Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": [inset] }],
			/**
			* Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			start: [{ start: [inset] }],
			/**
			* End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			end: [{ end: [inset] }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: [inset] }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: [inset] }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: [inset] }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: [inset] }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				"auto",
				isInteger,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: getSpacingWithAutoAndArbitrary() }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"wrap",
				"wrap-reverse",
				"nowrap"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				"1",
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: getZeroAndEmpty() }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: getZeroAndEmpty() }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				"first",
				"last",
				"none",
				isInteger,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": [isAny] }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: [
				"auto",
				{ span: [
					"full",
					isInteger,
					isArbitraryValue
				] },
				isArbitraryValue
			] }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": getNumberWithAutoAndArbitrary() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": getNumberWithAutoAndArbitrary() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": [isAny] }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: [
				"auto",
				{ span: [isInteger, isArbitraryValue] },
				isArbitraryValue
			] }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": getNumberWithAutoAndArbitrary() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": getNumberWithAutoAndArbitrary() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": [
				"auto",
				"min",
				"max",
				"fr",
				isArbitraryValue
			] }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": [
				"auto",
				"min",
				"max",
				"fr",
				isArbitraryValue
			] }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: [gap] }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": [gap] }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": [gap] }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: ["normal", ...getAlign()] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [
				"start",
				"end",
				"center",
				"stretch"
			] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": [
				"auto",
				"start",
				"end",
				"center",
				"stretch"
			] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: [
				"normal",
				...getAlign(),
				"baseline"
			] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [
				"start",
				"end",
				"center",
				"baseline",
				"stretch"
			] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				"start",
				"end",
				"center",
				"stretch",
				"baseline"
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": [...getAlign(), "baseline"] }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [
				"start",
				"end",
				"center",
				"baseline",
				"stretch"
			] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": [
				"auto",
				"start",
				"end",
				"center",
				"stretch"
			] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: [padding] }],
			/**
			* Padding X
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: [padding] }],
			/**
			* Padding Y
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: [padding] }],
			/**
			* Padding Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: [padding] }],
			/**
			* Padding End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: [padding] }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: [padding] }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: [padding] }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: [padding] }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: [padding] }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: [margin] }],
			/**
			* Margin X
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: [margin] }],
			/**
			* Margin Y
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: [margin] }],
			/**
			* Margin Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: [margin] }],
			/**
			* Margin End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: [margin] }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: [margin] }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: [margin] }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: [margin] }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: [margin] }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/space
			*/
			"space-x": [{ "space-x": [space] }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/space
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/space
			*/
			"space-y": [{ "space-y": [space] }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/space
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				"auto",
				"min",
				"max",
				"fit",
				"svw",
				"lvw",
				"dvw",
				isArbitraryValue,
				spacing
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				isArbitraryValue,
				spacing,
				"min",
				"max",
				"fit"
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				isArbitraryValue,
				spacing,
				"none",
				"full",
				"min",
				"max",
				"fit",
				"prose",
				{ screen: [isTshirtSize] },
				isTshirtSize
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				isArbitraryValue,
				spacing,
				"auto",
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				isArbitraryValue,
				spacing,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				isArbitraryValue,
				spacing,
				"min",
				"max",
				"fit",
				"svh",
				"lvh",
				"dvh"
			] }],
			/**
			* Size
			* @see https://tailwindcss.com/docs/size
			*/
			size: [{ size: [
				isArbitraryValue,
				spacing,
				"auto",
				"min",
				"max",
				"fit"
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				isTshirtSize,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black",
				isArbitraryNumber
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [isAny] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest",
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				"none",
				isNumber,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose",
				isLength,
				isArbitraryValue
			] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": ["none", isArbitraryValue] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"none",
				"disc",
				"decimal",
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: [colors] }],
			/**
			* Placeholder Opacity
			* @see https://tailwindcss.com/docs/placeholder-opacity
			*/
			"placeholder-opacity": [{ "placeholder-opacity": [opacity] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: [colors] }],
			/**
			* Text Opacity
			* @see https://tailwindcss.com/docs/text-opacity
			*/
			"text-opacity": [{ "text-opacity": [opacity] }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...getLineStyles(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				"auto",
				"from-font",
				isLength,
				isArbitraryLength
			] }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				"auto",
				isLength,
				isArbitraryValue
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: [colors] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: getSpacingWithArbitrary() }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: ["none", isArbitraryValue] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Opacity
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://tailwindcss.com/docs/background-opacity
			*/
			"bg-opacity": [{ "bg-opacity": [opacity] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: [...getPositions(), isArbitraryPosition] }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: ["no-repeat", { repeat: [
				"",
				"x",
				"y",
				"round",
				"space"
			] }] }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: [
				"auto",
				"cover",
				"contain",
				isArbitrarySize
			] }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{ "gradient-to": [
					"t",
					"tr",
					"r",
					"br",
					"b",
					"bl",
					"l",
					"tl"
				] },
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: [colors] }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: [gradientColorStopPositions] }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: [gradientColorStopPositions] }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: [gradientColorStopPositions] }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: [gradientColorStops] }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: [gradientColorStops] }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: [gradientColorStops] }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: [borderRadius] }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": [borderRadius] }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": [borderRadius] }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": [borderRadius] }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": [borderRadius] }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": [borderRadius] }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": [borderRadius] }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": [borderRadius] }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": [borderRadius] }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": [borderRadius] }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": [borderRadius] }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": [borderRadius] }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": [borderRadius] }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": [borderRadius] }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": [borderRadius] }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: [borderWidth] }],
			/**
			* Border Width X
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": [borderWidth] }],
			/**
			* Border Width Y
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": [borderWidth] }],
			/**
			* Border Width Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": [borderWidth] }],
			/**
			* Border Width End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": [borderWidth] }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": [borderWidth] }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": [borderWidth] }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": [borderWidth] }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": [borderWidth] }],
			/**
			* Border Opacity
			* @see https://tailwindcss.com/docs/border-opacity
			*/
			"border-opacity": [{ "border-opacity": [opacity] }],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [...getLineStyles(), "hidden"] }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/divide-width
			*/
			"divide-x": [{ "divide-x": [borderWidth] }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/divide-width
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/divide-width
			*/
			"divide-y": [{ "divide-y": [borderWidth] }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/divide-width
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Divide Opacity
			* @see https://tailwindcss.com/docs/divide-opacity
			*/
			"divide-opacity": [{ "divide-opacity": [opacity] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/divide-style
			*/
			"divide-style": [{ divide: getLineStyles() }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: [borderColor] }],
			/**
			* Border Color X
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": [borderColor] }],
			/**
			* Border Color Y
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": [borderColor] }],
			/**
			* Border Color S
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": [borderColor] }],
			/**
			* Border Color E
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": [borderColor] }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": [borderColor] }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": [borderColor] }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": [borderColor] }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": [borderColor] }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: [borderColor] }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: ["", ...getLineStyles()] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [isLength, isArbitraryValue] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [isLength, isArbitraryLength] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: [colors] }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/ring-width
			*/
			"ring-w": [{ ring: getLengthWithEmptyAndArbitrary() }],
			/**
			* Ring Width Inset
			* @see https://tailwindcss.com/docs/ring-width
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/ring-color
			*/
			"ring-color": [{ ring: [colors] }],
			/**
			* Ring Opacity
			* @see https://tailwindcss.com/docs/ring-opacity
			*/
			"ring-opacity": [{ "ring-opacity": [opacity] }],
			/**
			* Ring Offset Width
			* @see https://tailwindcss.com/docs/ring-offset-width
			*/
			"ring-offset-w": [{ "ring-offset": [isLength, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://tailwindcss.com/docs/ring-offset-color
			*/
			"ring-offset-color": [{ "ring-offset": [colors] }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"inner",
				"none",
				isTshirtSize,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow-color
			*/
			"shadow-color": [{ shadow: [isAny] }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [opacity] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...getBlendModes(),
				"plus-lighter",
				"plus-darker"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": getBlendModes() }],
			/**
			* Filter
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: ["", "none"] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: [blur] }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [brightness] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [contrast] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				isTshirtSize,
				isArbitraryValue
			] }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [grayscale] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [hueRotate] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [invert] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [saturate] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [sepia] }],
			/**
			* Backdrop Filter
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": [blur] }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [brightness] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [contrast] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [grayscale] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [hueRotate] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [invert] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [opacity] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [saturate] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [sepia] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": [borderSpacing] }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": [borderSpacing] }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": [borderSpacing] }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Tranisition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"none",
				"all",
				"",
				"colors",
				"opacity",
				"shadow",
				"transform",
				isArbitraryValue
			] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: getNumberAndArbitrary() }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"in",
				"out",
				"in-out",
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: getNumberAndArbitrary() }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				"spin",
				"ping",
				"pulse",
				"bounce",
				isArbitraryValue
			] }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				"",
				"gpu",
				"none"
			] }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: [scale] }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": [scale] }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": [scale] }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: [isInteger, isArbitraryValue] }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": [translate] }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": [translate] }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": [skew] }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": [skew] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: [
				"center",
				"top",
				"top-right",
				"right",
				"bottom-right",
				"bottom",
				"bottom-left",
				"left",
				"top-left",
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: ["auto", colors] }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryValue
			] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: [colors] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["none", "auto"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"y",
				"x",
				""
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin X
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin Y
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": getSpacingWithArbitrary() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding X
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding Y
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": getSpacingWithArbitrary() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": getSpacingWithArbitrary() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: [colors, "none"] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: [colors, "none"] }],
			/**
			* Screen Readers
			* @see https://tailwindcss.com/docs/screen-readers
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-s",
				"border-w-e",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-s",
				"border-color-e",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] }
	};
};
var twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
// src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
// src/lib/services.ts
/**
* The eight Honey Do's service categories, in the exact order they appear on
* the home honeycomb grid. Icons are lucide-react names resolved by the
* consumer.
*/
var SERVICES = [
	{
		category: ServiceCategory.house,
		label: "House",
		blurb: "Painting, patching, and small repairs.",
		icon: "PaintRoller"
	},
	{
		category: ServiceCategory.yardPlants,
		label: "Yard & Plants",
		blurb: "Planting, weeding, and garden love.",
		icon: "Flower2"
	},
	{
		category: ServiceCategory.fixIt,
		label: "Fix It",
		blurb: "Squeaky doors, wobbly shelves, and small repairs.",
		icon: "Wrench"
	},
	{
		category: ServiceCategory.cleanOrganize,
		label: "Clean & Organize",
		blurb: "Declutter, deep clean, and reset.",
		icon: "Sparkles"
	},
	{
		category: ServiceCategory.moveLift,
		label: "Move & Lift",
		blurb: "Heavy lifting and furniture moves.",
		icon: "Package"
	},
	{
		category: ServiceCategory.errands,
		label: "Errands",
		blurb: "Pickups, drop-offs, and to-do runs.",
		icon: "ShoppingBag"
	},
	{
		category: ServiceCategory.mowing,
		label: "Mowing",
		blurb: "Edging, trimming, and a tidy lawn.",
		icon: "Sprout"
	},
	{
		category: ServiceCategory.showMe,
		label: "Show Me",
		blurb: "Friendly help learning a new task.",
		icon: "Lightbulb"
	}
];
var SERVICE_BY_CATEGORY = new Map(SERVICES.map((service) => [service.category, service]));
function getService(category) {
	return SERVICE_BY_CATEGORY.get(category) ?? {
		category,
		label: "Honey Do",
		blurb: "A little help around the home.",
		icon: "Wrench"
	};
}
// src/lib/jobs.ts
var STATUS_META = {
	[JobStatus.requested]: {
		label: "Requested",
		description: "We have your request and will be in touch shortly.",
		chipClass: "border-primary/50 bg-primary/15 text-primary",
		hexClass: "border-primary/60 bg-primary/25 text-primary"
	},
	[JobStatus.quoted]: {
		label: "Quoted",
		description: "Your quote is ready to review and accept.",
		chipClass: "border-accent/60 bg-accent/15 text-accent",
		hexClass: "border-accent/60 bg-accent/25 text-accent"
	},
	[JobStatus.scheduled]: {
		label: "Scheduled",
		description: "Your appointment is on the calendar.",
		chipClass: "border-primary/50 bg-primary/15 text-primary",
		hexClass: "border-primary/60 bg-primary/25 text-primary"
	},
	[JobStatus.inProgress]: {
		label: "In Progress",
		description: "Your Honey Do is underway right now.",
		chipClass: "border-warning/60 bg-warning/15 text-warning",
		hexClass: "border-warning/60 bg-warning/25 text-warning"
	},
	[JobStatus.completed]: {
		label: "Completed",
		description: "All done — we hope it brought relief.",
		chipClass: "border-success/60 bg-success/15 text-success",
		hexClass: "border-success/60 bg-success/25 text-success"
	},
	[JobStatus.cancelled]: {
		label: "Cancelled",
		description: "This request was cancelled.",
		chipClass: "border-destructive/50 bg-destructive/15 text-destructive",
		hexClass: "border-destructive/50 bg-destructive/25 text-destructive"
	}
};
function getStatusMeta(status) {
	return STATUS_META[status] ?? {
		label: "Requested",
		description: "We have your request and will be in touch shortly.",
		chipClass: "border-primary/50 bg-primary/15 text-primary",
		hexClass: "border-primary/60 bg-primary/25 text-primary"
	};
}
/** Ordered lifecycle used by the admin advance action and the status timeline. */
var STATUS_ORDER = [
	JobStatus.requested,
	JobStatus.quoted,
	JobStatus.scheduled,
	JobStatus.inProgress,
	JobStatus.completed
];
/** Zero-based position of a status in the lifecycle, or -1 when unknown. */
function statusIndex(status) {
	return STATUS_ORDER.indexOf(status);
}
/** Motoko Time.now() is nanoseconds; convert before any Date operation. */
function timestampToDate(timestamp) {
	const date = new Date(Number(timestamp / 1000000n));
	return Number.isNaN(date.getTime()) ? null : date;
}
function formatDateTime(timestamp) {
	const date = timestampToDate(timestamp);
	if (!date) return "Date to be confirmed";
	return date.toLocaleString(void 0, {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatDate(timestamp) {
	const date = timestampToDate(timestamp);
	if (!date) return "Date to be confirmed";
	return date.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
/** Quote and deposit amounts are stored in whole cents. */
function formatMoney(cents) {
	return (Number(cents) / 100).toLocaleString(void 0, {
		style: "currency",
		currency: "USD"
	});
}
function formatReference(code) {
	return code.toUpperCase();
}
var QUOTE_STATUS_META = {
	[QuoteStatus.draft]: {
		label: "Draft",
		description: "Not sent to the customer yet.",
		chipClass: "border-border bg-muted/60 text-muted-foreground"
	},
	[QuoteStatus.sent]: {
		label: "Sent",
		description: "Waiting on the customer's decision.",
		chipClass: "border-accent/60 bg-accent/15 text-accent"
	},
	[QuoteStatus.approved]: {
		label: "Approved",
		description: "The customer approved this quote.",
		chipClass: "border-success/60 bg-success/15 text-success"
	},
	[QuoteStatus.declined]: {
		label: "Declined",
		description: "The customer declined this quote.",
		chipClass: "border-destructive/50 bg-destructive/15 text-destructive"
	}
};
function getQuoteStatusMeta(status) {
	return QUOTE_STATUS_META[status] ?? QUOTE_STATUS_META[QuoteStatus.draft];
}
QuoteStatus.draft, QuoteStatus.sent, QuoteStatus.approved, QuoteStatus.declined;
/** Whether a quote has passed its expiration date. */
function isQuoteExpired(quote, now = /* @__PURE__ */ new Date()) {
	if (!quote?.expiresAt) return false;
	const expires = timestampToDate(quote.expiresAt);
	if (!expires) return false;
	return expires.getTime() < now.getTime();
}
/** Expiration label for a quote, or null when it never expires. */
function quoteExpiresLabel(quote) {
	if (!quote?.expiresAt) return null;
	return `Expires ${formatDate(quote.expiresAt)}`;
}
/** The quote's stored total, falling back to the legacy amount field. */
function quoteTotal(quote) {
	if (!quote) return 0n;
	return quote.total > 0n ? quote.total : quote.amount;
}
/** The quote's stored remaining balance, falling back to total minus deposit. */
function quoteRemainingBalance(quote) {
	if (!quote) return 0n;
	if (quote.remainingBalance > 0n) return quote.remainingBalance;
	return quoteTotal(quote) - quote.depositRequired;
}
/** Line-item extended price (quantity × unit price). */
function lineItemTotal(item) {
	return item.quantity * item.unitPrice;
}
/** Sum of every line item's extended price. */
function lineItemsSubtotal(items) {
	return items.reduce((sum, item) => sum + lineItemTotal(item), 0n);
}
/**
* Adapt the guest `QuoteView` (returned by `getQuoteByReference`) into the
* `Quote` shape the Track page's `QuotePanel` already renders.
*
* The emailed link and the reference-code lookup read the same quote record, so
* the two views must present identically. `QuoteView` omits the legacy `amount`
* and `sentAt` fields; `amount` falls back to the stored total and `sentAt` to
* the quote's creation time, which is what the customer sees for a sent quote.
*/
function quoteViewToQuote(view) {
	return {
		amount: view.total,
		note: view.note,
		sentAt: 0n,
		discountApplied: view.discountApplied,
		discountAmount: view.discountAmount,
		status: view.status,
		lineItems: view.lineItems,
		total: view.total,
		laborCharge: view.laborCharge,
		createdAt: 0n,
		quoteNumber: view.quoteNumber,
		workDescription: view.workDescription,
		remainingBalance: view.remainingBalance,
		materialsCharge: view.materialsCharge,
		depositRequired: view.depositRequired,
		subtotal: view.subtotal,
		expiresAt: view.expiresAt
	};
}
/**
* Whether a `QuoteView` is past its expiration.
*
* The backend derives an `expired` flag against its own clock; this mirrors it
* for the client so the emailed quote can disable acceptance without a round
* trip. An expired quote can never be accepted.
*/
function isQuoteViewExpired(view) {
	return view.expired;
}
/** Human label for the per-channel email outcome of `sendQuote`. */
function quoteEmailOutcomeLabel(email) {
	return email.__kind__ === "sent" ? "Quote sent to the customer." : `The quote was saved, but the email could not be delivered: ${email.failed}`;
}
/** Whether the `sendQuote` email actually reached the customer. */
function quoteEmailDelivered(email) {
	return email.__kind__ === "sent";
}
/** The deposit is always half of the accepted quote total. */
function depositAmount(quoteTotal) {
	return quoteTotal / 2n;
}
/** Remaining balance after the deposit has been paid. */
function balanceDue(quoteTotal) {
	return quoteTotal - depositAmount(quoteTotal);
}
/**
* Cash App handle. Cash App stays fully available and unchanged; the other
* manual options are added alongside it, never replacing it.
*/
var CASHAPP_HANDLE = "$thebirdhouse2";
/** Venmo handle customers send the deposit to. */
var VENMO_HANDLE = "@Lavona-Wright";
/** PayPal account name customers send the deposit to. */
var PAYPAL_ACCOUNT = "tanae Wright";
/** Chime sign-in tag customers send the deposit to. */
var CHIME_HANDLE = "$Tanae-Wright-2";
/** The four manual deposit options, in display order. */
var DEPOSIT_OPTIONS = [
	{
		id: "cashapp",
		label: "Cash App",
		handle: CASHAPP_HANDLE,
		hint: "Open Cash App and send the deposit to this $cashtag.",
		url: "https://cash.app/$thebirdhouse2",
		method: PaymentMethod.cashApp
	},
	{
		id: "venmo",
		label: "Venmo",
		handle: VENMO_HANDLE,
		hint: "Open Venmo and send the deposit to this username.",
		url: `https://venmo.com/${VENMO_HANDLE.replace(/^@/, "")}`,
		method: PaymentMethod.venmo
	},
	{
		id: "paypal",
		label: "PayPal",
		handle: PAYPAL_ACCOUNT,
		hint: "Send the deposit to this PayPal account name.",
		url: null,
		method: PaymentMethod.payPal
	},
	{
		id: "chime",
		label: "Chime",
		handle: CHIME_HANDLE,
		hint: "Open Chime and send the deposit to this $ChimeSign.",
		url: null,
		method: PaymentMethod.chime
	}
];
/** The deposit option matching a recorded backend payment method. */
function depositOptionForMethod(method) {
	if (!method) return null;
	return DEPOSIT_OPTIONS.find((option) => option.method === method) ?? null;
}
/** Human label for a recorded deposit method, or null when unknown. */
function depositMethodLabel(method) {
	return depositOptionForMethod(method)?.label ?? null;
}
var DEPOSIT_STATUS_META = {
	[DepositStatus.pending]: {
		label: "Deposit due",
		description: "Send your deposit to secure your spot.",
		chipClass: "border-warning/60 bg-warning/15 text-warning"
	},
	[DepositStatus.submitted]: {
		label: "Deposit submitted — verifying",
		description: "We have your deposit and are verifying it. You'll be notified once it clears.",
		chipClass: "border-accent/60 bg-accent/15 text-accent"
	},
	[DepositStatus.verified]: {
		label: "Deposit verified",
		description: "Your deposit is confirmed — your spot is secured.",
		chipClass: "border-success/60 bg-success/15 text-success"
	},
	[DepositStatus.rejected]: {
		label: "Deposit not received",
		description: "We couldn't find your deposit. Please resubmit it with the correct details.",
		chipClass: "border-destructive/50 bg-destructive/15 text-destructive"
	}
};
function getDepositStatusMeta(status) {
	return DEPOSIT_STATUS_META[status ?? DepositStatus.pending] ?? DEPOSIT_STATUS_META[DepositStatus.pending];
}
/** Whether a deposit is awaiting the owner's verification. */
function isDepositSubmitted(status) {
	return status === DepositStatus.submitted;
}
/** Whether a deposit has been verified and paid. */
function isDepositVerified(status) {
	return status === DepositStatus.verified;
}
/** Whether a deposit was rejected and the customer may resubmit. */
function isDepositRejected(status) {
	return status === DepositStatus.rejected;
}
/** Whether a quote carries the own-parts discount. */
function hasQuoteDiscount(quote) {
	return quote?.discountApplied === true && quote.discountAmount > 0n;
}
/** Human label for the service performed on a visit. */
function visitServiceLabel(visit) {
	return getService(visit.service).label;
}
/** The bee credited with a visit, or a friendly fallback. */
function visitBeeName(visit) {
	const name = visit.beeName?.trim();
	return name && name.length > 0 ? name : "Honey Do's bee";
}
/** Short date for a visit row, e.g. "Mar 4, 2026". */
function formatVisitDate(visit) {
	return formatDate(visit.completedAt);
}
/** Newest-first ordering guard for visit history arrays. */
function sortVisitsNewestFirst(visits) {
	return [...visits].sort((a, b) => a.completedAt === b.completedAt ? 0 : a.completedAt > b.completedAt ? -1 : 1);
}
/** The monthly package is a manual owner-managed deal, never auto-billed. */
var PACKAGE_BILLING_NOTE = "Billed monthly by the owner — no automatic recurring charges.";
/** Whether a job currently has an active monthly package enrollment. */
function isPackageActive(enrollment) {
	return enrollment?.active === true;
}
/**
* Monthly price label for an enrollment, or null when not enrolled.
*
* The package is priced per individual customer, so no dollar amount is ever
* shown. The label states that a monthly rate exists and is set with the owner.
*/
function packagePriceLabel(enrollment) {
	if (!enrollment) return null;
	return "Priced for your home";
}
/** Included-visits label for an enrollment, or null when not enrolled. */
function packageVisitsLabel(enrollment) {
	if (!enrollment) return null;
	const visits = Number(enrollment.includedVisits);
	return `${visits} ${visits === 1 ? "visit" : "visits"} included each month`;
}
/** When the enrollment started, or null when not enrolled. */
function packageStartedLabel(enrollment) {
	if (!enrollment) return null;
	return `Member since ${formatDate(enrollment.startedAt)}`;
}
/**
* A request still waiting on the owner's quote.
*
* These are the requests the owner must act on first, so the dashboard groups
* them at the top and marks them as awaiting a quote.
*/
function isAwaitingQuote(job) {
	return job.status === JobStatus.requested;
}
/** How many requests are still awaiting the owner's quote. */
function countAwaitingQuote(jobs) {
	return jobs.reduce((total, job) => isAwaitingQuote(job) ? total + 1 : total, 0);
}
/**
* Compact "time since" label for the dashboard's last-updated indicator.
*
* Falls back to an absolute date once the gap passes a day so the label never
* grows unbounded.
*/
function formatRelativeTime(date, now = /* @__PURE__ */ new Date()) {
	const seconds = Math.round((now.getTime() - date.getTime()) / 1e3);
	if (seconds < 5) return "just now";
	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return formatDate(BigInt(date.getTime()) * 1000000n);
}
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/shared/src/utils.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/Icon.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon = (0, import_react.forwardRef)(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => (0, import_react.createElement)("svg", {
	ref,
	...defaultAttributes,
	width: size,
	height: size,
	stroke: color,
	strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
	className: mergeClasses("lucide", className),
	...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
	...rest
}, [...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]));
// ../../../../../../opt/pnpm-templates/build_template/node_modules/.pnpm/lucide-react@0.511.0_react@19.1.5/node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
* @license lucide-react v0.511.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) => (0, import_react.createElement)(Icon, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
export { JobStatus as $, packagePriceLabel as A, statusIndex as B, isDepositSubmitted as C, uint8FromBufLike$1 as Ct, isQuoteViewExpired as D, isQuoteExpired as E, hexToBytes as Et, quoteExpiresLabel as F, getService as G, visitBeeName as H, quoteRemainingBalance as I, CustomerStatus as J, cn as K, quoteTotal as L, packageVisitsLabel as M, quoteEmailDelivered as N, lineItemTotal as O, quoteEmailOutcomeLabel as P, JobRecordStatus as Q, quoteViewToQuote as R, isDepositRejected as S, uint8Equals$1 as St, isPackageActive as T, bytesToHex as Tt, visitServiceLabel as U, timestampToDate as V, SERVICES as W, DiscountEligibility as X, DepositStatus as Y, DiscountKind as Z, formatVisitDate as _, AnonymousIdentity as _t, PACKAGE_BILLING_NOTE as a, createActor as at, getStatusMeta as b, IC_REQUEST_DOMAIN_SEPARATOR as bt, balanceDue as c, require_react as ct, depositMethodLabel as d, HttpAgent as dt, NotificationKind as et, formatDate as f, ED25519_OID as ft, formatRelativeTime as g, Endpoint as gt, formatReference as h, ed25519 as ht, DEPOSIT_OPTIONS as i, ServiceCategory as it, packageStartedLabel as j, lineItemsSubtotal as k, countAwaitingQuote as l, StorageClient as lt, formatMoney as m, wrapDER as mt, CASHAPP_HANDLE as n, PreferredContact as nt, PAYPAL_ACCOUNT as o, require_react_dom as ot, formatDateTime as p, unwrapDER as pt, clsx as q, CHIME_HANDLE as r, QuoteStatus as rt, VENMO_HANDLE as s, require_jsx_runtime as st, createLucideIcon as t, PaymentMethod as tt, depositAmount as u, Actor as ut, getDepositStatusMeta as v, SignIdentity as vt, isDepositVerified as w, Principal$1 as wt, hasQuoteDiscount as x, requestIdOf as xt, getQuoteStatusMeta as y, IC_REQUEST_AUTH_DELEGATION_DOMAIN_SEPARATOR as yt, sortVisitsNewestFirst as z };
