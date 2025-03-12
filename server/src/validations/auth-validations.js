import {zod} from 'zod';

const user = zod.object({
    email:zod.email().trim(),
    emailConfirmar:zod.boolean(),
});
