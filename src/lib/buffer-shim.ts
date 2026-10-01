// The browser `buffer` package lacks Node's BigInt read/write methods, which @aztec/bb.js needs.
import { Buffer as BaseBuffer } from 'buffer';

if (typeof BaseBuffer.prototype.writeBigUInt64BE !== 'function') {
    BaseBuffer.prototype.writeBigUInt64BE = function (value: bigint, offset: number = 0): number {
        const hi = Number(value >> BigInt(32));
        const lo = Number(value & BigInt(0xffffffff));
        this.writeUInt32BE(hi, offset);
        this.writeUInt32BE(lo, offset + 4);
        return offset + 8;
    };
}

if (typeof BaseBuffer.prototype.writeBigInt64BE !== 'function') {
    BaseBuffer.prototype.writeBigInt64BE = function (value: bigint, offset: number = 0): number {
        return this.writeBigUInt64BE(BigInt.asUintN(64, value), offset);
    };
}

if (typeof BaseBuffer.prototype.writeBigUInt64LE !== 'function') {
    BaseBuffer.prototype.writeBigUInt64LE = function (value: bigint, offset: number = 0): number {
        const lo = Number(value & BigInt(0xffffffff));
        const hi = Number(value >> BigInt(32));
        this.writeUInt32LE(lo, offset);
        this.writeUInt32LE(hi, offset + 4);
        return offset + 8;
    };
}

if (typeof BaseBuffer.prototype.writeBigInt64LE !== 'function') {
    BaseBuffer.prototype.writeBigInt64LE = function (value: bigint, offset: number = 0): number {
        return this.writeBigUInt64LE(BigInt.asUintN(64, value), offset);
    };
}

if (typeof BaseBuffer.prototype.readBigUInt64BE !== 'function') {
    BaseBuffer.prototype.readBigUInt64BE = function (offset: number = 0): bigint {
        const hi = BigInt(this.readUInt32BE(offset));
        const lo = BigInt(this.readUInt32BE(offset + 4));
        return (hi << BigInt(32)) | lo;
    };
}

if (typeof BaseBuffer.prototype.readBigInt64BE !== 'function') {
    BaseBuffer.prototype.readBigInt64BE = function (offset: number = 0): bigint {
        const value = this.readBigUInt64BE(offset);
        return BigInt.asIntN(64, value);
    };
}

if (typeof BaseBuffer.prototype.readBigUInt64LE !== 'function') {
    BaseBuffer.prototype.readBigUInt64LE = function (offset: number = 0): bigint {
        const lo = BigInt(this.readUInt32LE(offset));
        const hi = BigInt(this.readUInt32LE(offset + 4));
        return (hi << BigInt(32)) | lo;
    };
}

if (typeof BaseBuffer.prototype.readBigInt64LE !== 'function') {
    BaseBuffer.prototype.readBigInt64LE = function (offset: number = 0): bigint {
        const value = this.readBigUInt64LE(offset);
        return BigInt.asIntN(64, value);
    };
}

// Expose globally so lazily loaded SDK chunks see the patched Buffer.
(globalThis as { Buffer?: unknown }).Buffer = BaseBuffer;

export { BaseBuffer as Buffer };
export default BaseBuffer;
