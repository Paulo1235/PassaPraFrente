import {zod} from 'zod';

const user = zod.object({
    titulo:zod.string().max(50).min(1).trim(),
    descricao:zod.string().min(10).max(255),
    valor:zod.number().trim().gte(1),
    dataInicio:zod.date(),
    dataFim:zod.date(),
});

