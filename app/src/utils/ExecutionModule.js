import { ADD_binToInt,SUB_binToInt,SLT_U_binToInt,intToBin32,AND_bin,OR_bin,XOR_bin,SLL_bin,SR_LA_bin, signedExtTo32, isNegBin} from "./OperationModule.js";

// ✖
export function Storing(storage, src, data){
    if (data.length != 32){
        console.log('No se recibió un número de 32bits');
    }else{
        storage[src] = data;
    }
}
export function intructionExecution(descInst, regs, mem){
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
                        Storing(regs, rd, intToBin32(SUB_binToInt(regs[rs1],regs[rs2])));
                    }
                    if (funct3=="101"){ // sra ✔?
                        Storing(regs, rd, SR_LA_bin(regs[rs1],regs[rs2],1));
                    }
                    break;
                case "0000000":
                    switch(funct3){
                        case "000": // add ✔?
                            Storing(regs, rd, intToBin32(ADD_binToInt(regs[rs1],regs[rs2])));
                            break;
                        case "001": // sll ✔?
                            Storing(regs, rd, SLL_bin(regs[rs1],regs[rs2]));
                            break;
                        case "010": // slt ✔?
                            Storing(regs, rd, intToBin32(SLT_U_binToInt(regs[rs1],regs[rs2])));
                            break;
                        case "011": // sltu ✔?
                            Storing(regs, rd, intToBin32(SLT_U_binToInt(regs[rs1],regs[rs2],1)));
                            break;
                        case "100": // xor ✔?
                            Storing(regs, rd, XOR_bin(regs[rs1],regs[rs2]));
                            break;
                        case "101": // srl ✔?
                            Storing(regs, rd, SR_LA_bin(regs[rs1],regs[rs2]));
                            break;
                        case "110": // or ✔?
                            Storing(regs, rd, OR_bin(regs[rs1],regs[rs2]));
                            break;
                        case "111": // and ✔?
                            Storing(regs, rd, AND_bin(regs[rs1],regs[rs2]));
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
                    Storing(regs, rd, intToBin32(ADD_binToInt(regs[rs1], bExt)));
                    break;
                case "001":
                    if (funct7 == "0000000"){ // slli ✔?
                        Storing(regs, rd, SLL_bin(regs[rs1],imm));}
                    break;
                case "010": // slti ✔?
                    Storing(regs, rd, intToBin32(SLT_U_binToInt(regs[rs1], bExt)));
                    break;
                case "011": // sltiu ✔?
                    Storing(regs, rd, intToBin32(SLT_U_binToInt(regs[rs1], bExt, 1)));
                    break;
                case "100": // xori ✔?
                    Storing(regs, rd, XOR_bin(regs[rs1], bExt));
                    break;
                case "101":
                    if (funct7 == "0000000"){ // srli ✔?
                        Storing(regs, rd, SR_LA_bin(regs[rs1],imm));}
                    if (funct7 == "0100000"){ // srai ✔?
                        Storing(regs, rd, SR_LA_bin(regs[rs1],imm,1));}
                    break;
                case "110": // ori ✔?
                    Storing(regs, rd, OR_bin(regs[rs1], bExt));
                    break;
                case "111": // andi ✔?
                    Storing(regs, rd, AND_bin(regs[rs1], bExt));
                    break;
            }
            break;
        case "0110111": // lui ✔?
            Storing(regs, rd, SLL_bin(intToBin32(parseInt(imm,2)), "1100"));
            break; 
        case "0010111": // aupic ✔?
            Storing(regs, rd, intToBin32(ADD_binToInt(regs["PC"],SLL_bin(intToBin32(parseInt(imm,2)), "1100"))));
            break;
        case "1101111": // jal ✔?
            let num = signedExtTo32(imm.slice(0,1) + imm.slice(12,20) + imm.slice(11,12) + imm.slice(1,11) + "0");
            num = intToBin32(parseInt(num,2)*2);
            Storing(regs, rd, intToBin32(ADD_binToInt(regs["PC"],"100")));
            Storing(regs,"PC", intToBin32(ADD_binToInt(num, regs["PC"])));
            break;
        case "1100111": // jalr ✔?
            if (funct3 == "000"){
                const dir = intToBin32(ADD_binToInt(signedExtTo32(imm), regs[rs1]));
                if (parseInt(dir.slice(0,31) + "0",2)%4 == 0) {
                    Storing(regs, rd, intToBin32(ADD_binToInt(regs["PC"],"100")));
                    Storing(regs,"PC",dir.slice(0,31) + "0");
                } else {
                    return "Dirección calculada no válida";
                }
            }
            break;
        case "1100011": //TIPO-B -> | imm[12|10:5] | rs2  | rs1  | funct3 | imm[4:1|11] | opcode |
            let dir = signedExtTo32(imm.slice(0,1) + imm.slice(11,12) + imm.slice(1,7) + imm.slice(7,11) + "0");
            dir = intToBin32(ADD_binToInt(intToBin32(parseInt(dir,2)*2),regs["PC"]));
            let n1 = parseInt(regs[rs1],2);
            let n2 = parseInt(regs[rs2],2);
            switch(funct3){
                case "000": // beq ✔?
                    if (n1 == n2){
                        Storing(regs, "PC", dir);
                    }
                    break;
                case "001": // bne ✔?
                    if (n1 != n2){
                        Storing(regs, "PC", dir);
                    }
                    break;
                case "100": // blt ✔?
                    if ((isNegBin(regs[rs1])==1 & isNegBin(regs[rs2])==-1) | (isNegBin(regs[rs1])==-1 & isNegBin(regs[rs2])==1)){
                        n1 = n1*isNegBin(regs[rs1]);
                        n2 = n2*isNegBin(regs[rs2]);
                    }
                    if (n1 < n2){
                        Storing(regs, "PC", dir);
                    }
                    break;
                case "101": // bge ✔?
                    if ((isNegBin(regs[rs1])==1 & isNegBin(regs[rs2])==-1) | (isNegBin(regs[rs1])==-1 & isNegBin(regs[rs2])==1)){
                        n1 = n1*isNegBin(regs[rs1]);
                        n2 = n2*isNegBin(regs[rs2]);
                    }
                    if (n1 >= n2){
                        Storing(regs, "PC", dir);
                    }
                    break;
                case "110": // bltu ✔?
                    if (n1 < n2){
                        Storing(regs, "PC", dir);
                    }
                    break;
                case "111": // bgeu ✔?
                    if (n1 >= n2){
                        Storing(regs, "PC", dir);
                    }
                    break;
            }
            break;
        case "0000011": //TIPO-I LOAD -> | imm[11:0] | rs1  | funct3 | rd   | opcode |
            const memdirL = intToBin32(ADD_binToInt(signedExtTo32(imm), regs[rs1]));
            if (parseInt(memdirL,2)%4 == 0){
                if (memdirL in mem){
                    switch(funct3){
                        case "000": // lb ✔?
                            Storing(regs, rd, signedExtTo32(mem[memdirL].slice(-8)));
                            break;
                        case "001": // lh ✔?
                            Storing(regs, rd, signedExtTo32(mem[memdirL].slice(-16)));
                            break;
                        case "010": // lw ✔?
                            Storing(regs, rd, mem[memdirL]);
                            break;
                        case "100": // lbu ✔?
                            Storing(regs, rd, intToBin32(parseInt(mem[memdirL].slice(-8),2)));
                            break;
                        case "101": // lhu ✔?
                            Storing(regs, rd, intToBin32(parseInt(mem[memdirL].slice(-16),2)));
                            break;
                    }
                } else {
                    console.log(memdirL)
                    Storing(regs, rd, intToBin32(0));
                }
            } else {
                return "Dirección calculada no válida";
            }
            
            break;
        case "0100011": //TIPO-S -> | imm[11:5] | rs2  | rs1  | funct3 | imm[4:0] | opcode |
            const memdirS = intToBin32(ADD_binToInt(signedExtTo32(imm), regs[rs1]));
            console.log(memdirS)
            if (parseInt(memdirS,2)%4 == 0){
                switch(funct3){
                    case "000": // sb ✔?
                        Storing(mem, memdirS, intToBin32(parseInt(regs[rs2].slice(-8),2)));
                        break;
                    case "001": //sh ✔?
                        Storing(mem, memdirS, intToBin32(parseInt(regs[rs2].slice(-16),2)));
                        break;
                    case "010": //sw ✔?
                        Storing(mem, memdirS, regs[rs2]);
                        break;
                }
            }else{
                return "Dirección calculada no válida";
            }
            break;
    }
}

let registers = {
    "PC":"00000000000000000000000000000010",
    "00000": "00000000000000000000000000000000",
    "00001": "00000000000000000000000000000001",
    "00010": "10000000000000011000000110000000",
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

let memory = {
    "00000000000000000000000000000000": "00000000000000000000000000000000",
    "00000000000000000000000000001000": "11111111111111111111111111111111"
}

//|        TIPO-I          |          TIPO-U y J          |
// immx12 = 1000000000011, immx20 = 00000000000000000000
let prueba = {
    "opcode": "0100011",
    "rd": "00000",
    "rs1": "00001",
    "rs2": "00010",
    //"funct7": "0100000",
    "funct3": "000",
    "imm":"000000000111"
} 

function main (){
    intructionExecution(prueba, registers, memory)
    console.log(memory["00000000000000000000000000001000"])
}

main()
