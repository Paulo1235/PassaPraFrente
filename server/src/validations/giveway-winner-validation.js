import {zod} from 'zod';

const user = zod.object({
    nota:zod.coerce.int().number().lte(5).gte(1),
});
