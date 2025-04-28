import { ADD_binToInt,SUB_binToInt,SLT_U_binToInt,intToBin32,AND_bin,OR_bin,XOR_bin,SLL_bin,SR_LA_bin} from "./OperationModule.js";


export function registerStoring(registers, reg, data){
    if (data.length !==32){
        console.log('No se recibió un número de 32bits');
    }else{
        registers[reg] = data;
    }
}
export function intructionExecution(descInst, registers){
    let opcode = descInst.opcode;
    let rd;
    if ('rd' in descInst) {
        rd = descInst.rd;
    }
    let rs1;
    if ('rs1' in descInst) {
        rs1 = descInst.rs1;
    }
    let rs2;
    if ('rs2' in descInst) {
        rs2 = descInst.rs2;
    }
    let funct3;
    if ('funct3' in descInst) {
        funct3 = descInst.funct3;
    }
    let funct7;
    if ('funct3' in descInst) {
        funct7 = descInst.funct7;
    }
    let imm;
    if ('funct3' in descInst) {
        imm = descInst.imm;
    }

    switch(opcode){
        case "0110011": //TIPO-R
            switch(funct7){
                case "0100000":
                    if (funct3=="000"){ // sub ✔?
                        registerStoring(registers, rd, intToBin32(SUB_binToInt(registers[rs1],registers[rs2])))
                    }
                    if (funct3=="101"){ // sra ✔?
                        registerStoring(registers, rd, SR_LA_bin(registers[rs1],registers[rs2],1));
                    }
                    break;
                case "0000000":
                    switch(funct3){
                        case "000": // add ✔?
                            registerStoring(registers, rd, intToBin32(ADD_binToInt(registers[rs1],registers[rs2])));
                            break;
                        case "001": // sll ✔?
                            registerStoring(registers, rd, SLL_bin(registers[rs1],registers[rs2]));
                            break;
                        case "010": // slt ✔?
                            registerStoring(registers, rd, intToBin32(SLT_U_binToInt(registers[rs1],registers[rs2])));
                            break;
                        case "011": // sltu ✔?
                            registerStoring(registers, rd, intToBin32(SLT_U_binToInt(registers[rs1],registers[rs2])));
                            break;
                        case "100": // xor ✔?
                            registerStoring(registers, rd, XOR_bin(registers[rs1],registers[rs2]));
                            break;
                        case "101": // srl ✔?
                            registerStoring(registers, rd, SR_LA_bin(registers[rs1],registers[rs2]));
                            break;
                        case "110": // or ✔?
                            registerStoring(registers, rd, OR_bin(registers[rs1],registers[rs2]));
                            break;
                        case "111": // and ✔?
                            registerStoring(registers, rd, AND_bin(registers[rs1],registers[rs2]));
                            break;
                    }
                    break;
            }
            break;
    }
}

let regs = {
    "00000": "11111111111111111111111111111111",
    "00001": "11111000000000000000000100000011",
    "00010": "11000000000000000000000000000011",
    "00011": "00000000000000000000000000000000",
    "00100": "00000000000000000000000000000000",
    "00101": "00000000000000000000000000000000",
    "00110": "00000000000000000000000000000000",
    "00111": "00000000000000000000000000000000",
    "01000": "00000000000000000000000000000000",
    "01001": "00000000000000000000000000000000",
    "01010": "00000000000000000000000000000000",
    "01011": "00000000000000000000000000000000",
    "01100": "00000000000000000000000000000000",
    "01101": "00000000000000000000000000000000",
    "01110": "00000000000000000000000000000000",
    "01111": "00000000000000000000000000000000",
    "10000": "00000000000000000000000000000000",
    "10001": "00000000000000000000000000000000",
    "10010": "00000000000000000000000000000000",
    "10011": "00000000000000000000000000000000",
    "10100": "00000000000000000000000000000000",
    "10101": "00000000000000000000000000000000",
    "10110": "00000000000000000000000000000000",
    "10111": "00000000000000000000000000000000",
    "11000": "00000000000000000000000000000000",
    "11001": "00000000000000000000000000000000",
    "11010": "00000000000000000000000000000000",
    "11011": "00000000000000000000000000000000",
    "11100": "00000000000000000000000000000000",
    "11101": "00000000000000000000000000000000",
    "11110": "00000000000000000000000000000000",
    "11111": "00000000000000000000000000000000",
}

let prueba = {
    "opcode": "0110011",
    "rd": "00000",
    "rs1": "00001",
    "rs2": "00010",
    "funct7": "0100000",
    "funct3": "101",
}

intructionExecution(prueba, regs)
console.log(regs["00001"])
console.log(regs["00000"])