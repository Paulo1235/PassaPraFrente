import * as yup from "yup";

// Form validate with yup
const loginSchema = yup.object().shape({
  email: yup.string().email("Email Invalido").required("Obrigatorio"),
  password: yup
    .string()
    .min(6, "A palavra-passe tem de ser maior que 6")
    .required("Obrigatorio"),
});

const SendEmailSchema = yup.object().shape({
  email: yup.string().email("Email Invalido").required("Obrigatorio"),
});

const UpdatePasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(3, "A palavra-passe tem de ser maior que 3")
    .required("Obrigatorio"),
  confirmPassword: yup
    .string()
    .min(3, "A palavra-passe tem de ser maior que 3")
    .required("Obrigatorio"),
});

const EditAccountSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  phone: yup.string().required("O telefone é obrigatório"),
  address: yup.string().required("A morada é obrigatória"),
});

const CreateSaleSchema = yup.object().shape({
  title: yup
    .string()
    .required("Título é obrigatório")
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: yup
    .string()
    .required("Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),

  price: yup
    .number()
    .typeError("Valor deve ser um número")
    .positive("Valor deve ser positivo")
    .required("Valor é obrigatório"),

  condition: yup.string().required("Condição é obrigatória"),

  category: yup.string().required("Categoria é obrigatória"),

  // photos: yup.array()
  //   .min(1, "Pelo menos 1 foto é obrigatória")
  //   .max(3, "Máximo de 3 fotos permitido"),
});

const CreateLoanSchema = yup.object().shape({
  title: yup.string()
      .required("Título é obrigatório")
      .min(5, "Título deve ter pelo menos 5 caracteres")
      .max(100, "Título deve ter no máximo 100 caracteres"),

  description: yup.string()
      .required("Descrição é obrigatória")
      .min(10, "Descrição deve ter pelo menos 10 caracteres"),

  price: yup.number()
      .typeError("Valor deve ser um número")
      .required("Valor é obrigatório")
      .positive("Valor deve ser positivo"),

  condition: yup.string()
      .required("Condição é obrigatória"),

  category: yup.string()
      .required("Categoria é obrigatória"),

  startDate: yup.date()
      .required("Data de início é obrigatória"),

  endDate: yup.date()
      .required("Data de fim é obrigatória")
      .min(yup.ref('startDate'), "Data de fim deve ser posterior à data de início"),

  // Descomente se for usar validação de fotos:
  // photos: yup.array()
  //     .min(1, "Pelo menos 1 foto é obrigatória")
  //     .max(3, "Máximo de 3 fotos permitido")
});

const CreateDrawSchema = yup.object().shape({
  title: yup.string()
    .required("Título é obrigatório")
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: yup.string()
    .required("Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),

  condition: yup.string()
    .required("Condição é obrigatória"),

  category: yup.string()
    .required("Categoria é obrigatória"),

  startDate: yup.date()
    .required("Data de início é obrigatória"),

  endDate: yup.date()
    .required("Data de fim é obrigatória")
    .when("startDate", (startDate, schema) => 
      startDate
        ? schema.min(startDate, "Data de fim deve ser posterior à data de início")
        : schema
    ),

  // Descomente caso deseje validar o campo de fotos:
  // photos: yup.array()
  //   .min(1, "Pelo menos 1 foto é obrigatória")
  //   .max(3, "Máximo de 3 fotos permitido")
});

export {
  SendEmailSchema,
  loginSchema,
  UpdatePasswordSchema,
  EditAccountSchema,
  CreateSaleSchema,
  CreateLoanSchema,
  CreateDrawSchema,
};
