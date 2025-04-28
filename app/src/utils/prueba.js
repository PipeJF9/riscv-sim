import {translateRISCV} from './Compilator.js';


const instructions = [
    "add t1, t2, t3",
    "sub x5, x6, x31",
    "lw x8, 3(x9)",
    "sw x10, 16(x11)",
    "beq x12, x13, 8",
    "jal x14, 1024",
    "lui x15, 4096"
];

const instructionhex = [
    "00E302B3",
    "00A30293",
    "00532323",
    "00532663",
    "123452B7",
    "020002EF"
];
for (let i = 0; i < instructionhex.length; i++) {
    const ins = instructionhex[i];
    console.log(`Instruction: ${ins}`);
    const translated = translateRISCV({hex:ins});
    console.log(`binary: ${translated.binary}`);
    console.log(`Hexadecimal: ${translated.hex}`);
    console.log(`Instruction: ${translated.instruction}`);
    console.log('---');
}