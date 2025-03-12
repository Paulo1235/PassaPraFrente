import {zod} from 'zod';

const user = zod.object({
    nomeCategoria:zod.string().max(20).min(1).trim(),
});