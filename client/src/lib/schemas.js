import * as yup from "yup";

// Form validate with yup
const LoginSchema = yup.object().shape({
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
    .min(6, "A palavra-passe tem de ser maior que 6")
    .required("Obrigatorio"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "As palavras-passe têm de coincidir")
    .required("Obrigatorio"),
});

const EditAccountSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  phone:  yup.string().matches(/^\+351(91|92|93|96)\d{7}$/,"O número deve começar com +351 e ser português")
              .required("Contacto é obrigatório")
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

  photos: yup
    .array()
    .min(1, "Pelo menos 1 foto é obrigatória")
    .max(3, "Máximo de 3 fotos permitido")
    .required("Imagens são obrigatórias."),
});

const CreateLoanSchema = yup.object().shape({
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
    .required("Valor é obrigatório")
    .positive("Valor deve ser positivo"),

  condition: yup.string().required("Condição é obrigatória"),

  category: yup.string().required("Categoria é obrigatória"),

  startDate: yup.date().required("Data de início é obrigatória"),

  endDate: yup
    .date()
    .required("Data de fim é obrigatória")
    .min(
      yup.ref("startDate"),
      "Data de fim deve ser posterior à data de início"
    ),

  photos: yup
    .array()
    .min(1, "Pelo menos 1 foto é obrigatória")
    .max(3, "Máximo de 3 fotos permitido")
    .required("Imagens são obrigatórias."),
});

const CreateDrawSchema = yup.object().shape({
  title: yup
    .string()
    .required("Título é obrigatório")
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),

  description: yup
    .string()
    .required("Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),

  condition: yup.string().required("Condição é obrigatória"),

  category: yup.string().required("Categoria é obrigatória"),

  startDate: yup.date().required("Data de início é obrigatória"),

  endDate: yup
    .date()
    .required("Data de fim é obrigatória")
    .when("startDate", (startDate, schema) =>
      startDate
        ? schema.min(
            startDate,
            "Data de fim deve ser posterior à data de início"
          )
        : schema
    ),
  photos: yup
    .array()
    .min(1, "Pelo menos 1 foto é obrigatória")
    .max(3, "Máximo de 3 fotos permitido")
    .required("Imagens são obrigatórias."),
});

const CreateProposalSaleSchema = yup.object().shape({
  price: yup
    .number()
    .typeError("Valor deve ser um número")
    .positive("Valor deve ser positivo")
    .optional("Valor é obrigatório"),
});

const CreateProposalLoanSchema = yup.object().shape({
  price: yup
    .number()
    .optional("O preço é obrigatório")
    .positive("O preço deve ser positivo")
    .typeError("O preço deve ser um número"),
  dataInicio: yup
    .date()
    .optional("A data de início é obrigatória")
    .typeError("Data inválida"),
  dataFim: yup
    .date()
    .optional("A data de fim é obrigatória")
    .min(
      yup.ref("dataInicio"),
      "A data de fim deve ser posterior à data de início"
    )
    .typeError("Data inválida"),
});

export {
  SendEmailSchema,
  LoginSchema,
  UpdatePasswordSchema,
  EditAccountSchema,
  CreateSaleSchema,
  CreateLoanSchema,
  CreateDrawSchema,
  CreateProposalSaleSchema,
  CreateProposalLoanSchema,
};
