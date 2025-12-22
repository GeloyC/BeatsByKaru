import bcrypt from 'bcrypt';

const password = "beatsbykaruadmin2025";
const salt_rounds = 12;

const hash = await bcrypt.hash(password, salt_rounds);
console.log(hash);