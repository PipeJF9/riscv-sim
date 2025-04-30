import { ADD_binToInt,SUB_binToInt,SLT_U_binToInt,intToBin32,AND_bin,OR_bin,XOR_bin,SLL_bin,SR_LA_bin, signedExtTo32} from "./OperationModule.js";

// ✖
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
    if ('funct7' in descInst) {
        funct7 = descInst.funct7;
    }
    let imm;
    if ('imm' in descInst) {
        imm = descInst.imm;
    }

    switch(opcode){
        case "0110011": //TIPO-R -> | funct7 |  rs2  |  rs1  | funct3 |   rd   | opcode |
            switch(funct7){
                case "0100000":
                    if (funct3=="000"){ // sub ✔?
                        registerStoring(registers, rd, intToBin32(SUB_binToInt(registers[rs1],registers[rs2])));
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
                            registerStoring(registers, rd, intToBin32(SLT_U_binToInt(registers[rs1],registers[rs2],1)));
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
        case "0010011": //TIPO-I ARITMETICAS -> |  imm[11:0]  |  rs1  | funct3 |  rd   | opcode |
            funct7 = imm.slice(0,7);
            let bExt = signedExtTo32(imm);
            switch(funct3){
                case "000": // addi ✔?
                    registerStoring(registers, rd, intToBin32(ADD_binToInt(registers[rs1], bExt)));
                    break;
                case "001":
                    if (funct7 == "0000000"){ // slli ✔?
                        registerStoring(registers, rd, SLL_bin(registers[rs1],imm));}
                    break;
                case "010": // slti ✔?
                    registerStoring(registers, rd, intToBin32(SLT_U_binToInt(registers[rs1], bExt)));
                    break;
                case "011": // sltiu ✔?
                    registerStoring(registers, rd, intToBin32(SLT_U_binToInt(registers[rs1], bExt, 1)));
                    break;
                case "100": // xori ✔?
                    registerStoring(registers, rd, XOR_bin(registers[rs1], bExt));
                    break;
                case "101":
                    if (funct7 == "0000000"){ // srli ✔?
                        registerStoring(registers, rd, SR_LA_bin(registers[rs1],imm));}
                    if (funct7 == "0100000"){ // srai ✔?
                        registerStoring(registers, rd, SR_LA_bin(registers[rs1],imm,1));}
                    break;
                case "110": // ori ✔?
                    registerStoring(registers, rd, OR_bin(registers[rs1], bExt));
                    break;
                case "111": // andi ✔?
                    registerStoring(registers, rd, AND_bin(registers[rs1], bExt));
                    break;
            }
            break;
        case "0110111": // lui ✔?
            registerStoring(registers, rd, SLL_bin(intToBin32(parseInt(imm,2)), "1100"));
            break; 
        case "0010111": // aupic ✔?
            registerStoring(registers, rd, intToBin32(ADD_binToInt(registers["PC"],SLL_bin(intToBin32(parseInt(imm,2)), "1100"))));
            break;
        case "1101111": // jal ✔?
            let num = signedExtTo32(imm.slice(0,1) + imm.slice(12,20) + imm.slice(11,12) + imm.slice(1,11) + "0");
            num = intToBin32(parseInt(num,2)*2);
            registerStoring(registers, rd, intToBin32(ADD_binToInt(registers["PC"],"100")));
            registerStoring(registers,"PC", intToBin32(ADD_binToInt(num, registers["PC"])));
            break;
        case "1100111": // jalr ✔?
            if (funct3 == "000"){
                const dir = intToBin32(ADD_binToInt(signedExtTo32(imm), registers[rs1]));
                registerStoring(registers, rd, intToBin32(ADD_binToInt(registers["PC"],"100")));
                registerStoring(registers,"PC",dir.slice(0,31) + "0");
            }
            break;
    }
}

let regs = {
    "PC":"00000000000000000000000000000000",
    "00000": "00000000000000000000000000000000",
    "00001": "00000000000000000000000000000000",
    "00010": "00000000000000000000000000000000",
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

//|        TIPO-I          |          TIPO-U y J          |
// immx12 = 1000000000011, immx20 = 00000000000000000000
let prueba = {
    "opcode": "1100111",
    "rd": "00000",
    "rs1": "00001",
    "rs2": "00010",
    //"funct7": "0100000",
    "funct3": "000",
    "imm":"0000000001011"
}

intructionExecution(prueba, regs)
console.log(regs["PC"])