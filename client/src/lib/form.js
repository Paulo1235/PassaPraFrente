import * as yup from 'yup';

// Form validate with yup
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Email Invalido')
        .required('Obrigatorio'),
    password: yup
        .string()
        .min(3, 'A palavra-passe tem de ser maior que 3')
        .required('Obrigatorio'),
});



const SendEmailSchema = yup.object().shape({
    email: yup
        .string()
        .email('Email Invalido')
        .required('Obrigatorio'),
});




const UpdatePasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(3, 'A palavra-passe tem de ser maior que 3')
        .required('Obrigatorio'),
    confirmPassword: yup
        .string()
        .min(3, 'A palavra-passe tem de ser maior que 3')
        .required('Obrigatorio'),
});

export { SendEmailSchema, loginSchema,UpdatePasswordSchema };