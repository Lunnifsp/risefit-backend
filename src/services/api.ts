const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface CheckoutPayload {
    usuario: {
        nome: string;
        email: string;
        senha: string;
        dataNascimento: string;
        telefone: string;
        cpf: string;
        sexo: string;
    };
    endereco: {
        cep: string;
        estado: string;
        cidade: string;
        bairro: string;
        rua: string;
        numero: string;
        complemento?: string;
    };
    formaPagamento: 'credito' | 'debito';
    pagamento: {
        token: string;
        bandeira: string;
        ultimosDigitos: string;
    };
}

export async function processarCheckoutAPI(payload: CheckoutPayload) {
    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.message || 'Ocorreu um erro ao processar o cadastro e pagamento.'
        );
    }

    return response.json();
}