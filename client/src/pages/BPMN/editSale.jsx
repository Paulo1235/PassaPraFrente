import { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Undo2, Plus, X } from "lucide-react";

// Custom validation function for Formik
const validateForm = (values) => {
    const errors = {};

    // Title validation
    if (!values.title) {
        errors.title = "Título é obrigatório";
    } else if (values.title.length < 5) {
        errors.title = "Título deve ter pelo menos 5 caracteres";
    } else if (values.title.length > 100) {
        errors.title = "Título deve ter no máximo 100 caracteres";
    }

    // Description validation
    if (!values.description) {
        errors.description = "Descrição é obrigatória";
    } else if (values.description.length < 10) {
        errors.description = "Descrição deve ter pelo menos 10 caracteres";
    }

    // Price validation
    if (!values.price) {
        errors.price = "Valor é obrigatório";
    } else {
        const priceNumber = Number.parseFloat(values.price);
        if (isNaN(priceNumber)) {
            errors.price = "Valor deve ser um número";
        } else if (priceNumber <= 0) {
            errors.price = "Valor deve ser positivo";
        }
    }

    // Condition validation
    if (!values.condition) {
        errors.condition = "Condição é obrigatória";
    }

    // Category validation
    if (!values.category) {
        errors.category = "Categoria é obrigatória";
    }

    // Photos validation
    if (!values.photos || values.photos.length === 0) {
        errors.photos = "Pelo menos 1 foto é obrigatória";
    } else if (values.photos.length > 3) {
        errors.photos = "Máximo de 3 fotos permitido";
    }

    return errors;
};

export default function EditSale() {
    const fileInputRef = useRef(null);

    // Initial form values
    const initialValues = {
        title: "Camisola Quentinha Tigresa - XS",
        description: "Quentinha, usada poucas vezes\nTamanho XS\nCor castanho",
        price: "10",
        condition: "Como novo",
        category: "Roupa",
        photos: [],
    };

    // Handle form submission
    const handleSubmit = (values) => {
        console.log();
        // Here you would typically send the data to your API
        alert(JSON.parse(values));
    };

    return (
        <div className="flex flex-row">
            <div className="App w-screen flex flex-col">
                <div className="modal-sale w-full max-w-[1500px] h-auto min-h-[800px] bg-[#FFFAEE] mx-auto my-10 rounded-xl flex flex-col p-6">
                    <div className="button-back flex flex-col items-end">
                        <a href="/index">
                            <button className="flex flex-row gap-2 items-center hover:underline">
                                <Undo2 className="h-5 w-5" />
                                <span>Voltar</span>
                            </button>
                        </a>
                    </div>

                    <h1 className="text-3xl font-medium text-[#CAAD7E] text-center my-6">Editar Venda</h1>

                    <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleSubmit}>
                        {({ values, errors, touched, setFieldValue }) => (
                            <Form className="w-full">
                                <p className="text-center text-sm text-gray-500 mb-2">
                                    Mínimo 1 Foto, Máximo 3{values.photos.length > 0 && ` (${values.photos.length}/3)`}
                                </p>

                                {/* Error message for photos */}
                                {errors.photos && touched.photos && (
                                    <p className="text-red-500 text-center text-sm mb-4">{errors.photos}</p>
                                )}

                                <div className="images flex flex-row gap-4 justify-center flex-wrap mb-10">
                                    {/* Render uploaded photos */}
                                    {values.photos.map((photo, index) => (
                                        <div
                                            key={index}
                                            className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-white rounded-md overflow-hidden border border-gray-200"
                                        >
                                            <img
                                                src={photo || "/placeholder.svg"}
                                                width={200}
                                                height={200}
                                                alt={`Product image ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                                                onClick={() => {
                                                    const newPhotos = [...values.photos];
                                                    // Revoke the object URL to avoid memory leaks
                                                    URL.revokeObjectURL(newPhotos[index]);
                                                    newPhotos.splice(index, 1);
                                                    setFieldValue("photos", newPhotos);
                                                }}
                                            >
                                                <X className="h-4 w-4 text-white" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add photo button - only show if less than 3 photos */}
                                    {values.photos.length < 3 && (
                                        <div
                                            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-gray-100 rounded-md flex items-center justify-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
                                            onClick={() => {
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.click();
                                                }
                                            }}
                                        >
                                            <Plus className="h-10 w-10 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const file = e.target.files[0];

                                                if (values.photos.length >= 3) {
                                                    alert("Máximo de 3 fotos permitido.");
                                                    return;
                                                }

                                                // Create a URL for the selected file
                                                const imageUrl = URL.createObjectURL(file);
                                                setFieldValue("photos", [...values.photos, imageUrl]);

                                                // Reset the input value so the same file can be selected again if needed
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                </div>

                                <div className="form-container space-y-6 max-w-3xl mx-auto w-full">
                                    <div className="form-group">
                                        <label htmlFor="title" className="block text-sm font-medium mb-2">
                                            Título:
                                        </label>
                                        <Field
                                            id="title"
                                            name="title"
                                            type="text"
                                            className={`w-full p-2 border ${errors.title && touched.title ? "border-red-500" : "border-gray-300"} rounded-md`}
                                        />
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                                            Descrição:
                                        </label>
                                        <Field
                                            as="textarea"
                                            id="description"
                                            name="description"
                                            className={`w-full p-2 border ${errors.description && touched.description ? "border-red-500" : "border-gray-300"} rounded-md min-h-[100px]`}
                                        />
                                        <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label htmlFor="price" className="block text-sm font-medium mb-2">
                                                Valor:
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    className={`w-full p-2 border ${errors.price && touched.price ? "border-red-500" : "border-gray-300"} rounded-md pl-8`}
                                                />
                                                <span className="absolute left-3 top-2.5">€</span>
                                            </div>
                                            <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="condition" className="block text-sm font-medium mb-2">
                                                Condição:
                                            </label>
                                            <Field
                                                as="select"
                                                id="condition"
                                                name="condition"
                                                className={`w-full p-2 border ${errors.condition && touched.condition ? "border-red-500" : "border-gray-300"} rounded-md appearance-none bg-white`}
                                            >
                                                <option value="Como novo">Como novo</option>
                                                <option value="Bom Estado">Bom Estado</option>
                                                <option value="Usado">Usado</option>
                                                <option value="Com defeito">Com defeito</option>
                                            </Field>
                                            <ErrorMessage name="condition" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category" className="block text-sm font-medium mb-2">
                                            Categoria:
                                        </label>
                                        <Field
                                            as="select"
                                            id="category"
                                            name="category"
                                            className={`w-full p-2 border ${errors.category && touched.category ? "border-red-500" : "border-gray-300"} rounded-md appearance-none bg-white`}
                                        >
                                            <option value="Roupa">Roupa</option>
                                            <option value="Calçado">Calçado</option>
                                            <option value="Acessórios">Acessórios</option>
                                            <option value="Outros">Outros</option>
                                        </Field>
                                        <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>

                                    <div className="flex justify-center mt-10">
                                        <button
                                            type="submit"
                                            className="bg-[#CAAD7E] rounded-lg px-8 py-3 text-white font-medium hover:bg-[#b99c6f] transition-colors"
                                        >
                                           Editar Publicação
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
