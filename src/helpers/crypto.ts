import hmacSHA1 from 'crypto-js/hmac-sha1';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import encHex from 'crypto-js/enc-hex'

export function toHmacSha1(data: string, secret: string): string {
    return hmacSHA1(data, secret).toString(encHex);
}

export function toHmacSha256(data: string, secret: string): string {
    return hmacSHA256(data, secret).toString(encHex);
}