import { verifyKey } from 'discord-interactions';

const publicKey = '550fdf02663759d9e13af36694235c02b751739b969fd1a35c14c5b01f3deb99';
const body = '{"type":1}';
const signature = 'dummy';
const timestamp = '0';

const isValid = await verifyKey(body, signature, timestamp, publicKey);
console.log('Is valid:', isValid);
