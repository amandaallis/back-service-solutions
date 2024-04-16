export default function validateCNPJ(cnpj) {
    // Remove caracteres não numéricos do CNPJ
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14)
        return false;

    if (/^(\d)\1+$/.test(cnpj))
        return false;

    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso++;
        if (peso === 10)
            peso = 2;
    }
    let digitoVerificador1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (parseInt(cnpj.charAt(12)) !== digitoVerificador1)
        return false;

    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
        soma += parseInt(cnpj.charAt(i)) * peso;
        peso++;
        if (peso === 10)
            peso = 2;
    }
    let digitoVerificador2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (parseInt(cnpj.charAt(13)) !== digitoVerificador2)
        return false;

    return true;
}
