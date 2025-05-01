import {translateRISCV} from './Compilator.js';


const instructions = [
    "add t1, t2, t3",
    "sub x5, x6, x31",
    "addi x5, x6, 10",
    "lw x8, 3(x9)",
    "sw x10, 16(x11)",
    "beq x12, x13, 8",
    "jal x14, 1024",
    "lui x15, 4096",
    "jalr x1, 0(x10)"
];

const instructionhex = [
    "00E302B3",
    "00A30293",
    "00532323",
    "123452B7",
    "020002EF",
    "000500e7"
];
for (let i = 0; i < instructions.length; i++) {
    const ins = instructions[i];
    const translated = translateRISCV({instruction:ins});
    console.log(`Instruction: ${ins}`);
    console.log(`binary: ${translated.binary}`);
    console.log(`Hexadecimal: ${translated.hex}`);
    console.log(`Instruction: ${translated.instruction}`);
    console.log(`binary parts: ${JSON.stringify(translated.binary_parts, null, 2)}`); // Properly format binary_parts
    console.log('---');
}