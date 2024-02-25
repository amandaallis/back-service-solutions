export default function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
  
    if (cpf.length !== 11) {
        return false;
    }
  
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }
  
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = (remainder >= 10) ? 0 : remainder;
  
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = (remainder >= 10) ? 0 : remainder;
  
    return (parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2);
  }