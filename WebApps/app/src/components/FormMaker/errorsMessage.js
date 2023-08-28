const msgs = (key, val) => {
    switch (key) {
        case "required":
            return "Este campo es obligatorio";
        case "disabled":
            return "Este campo está deshablitado";
        case "maxLength":
            return `Debe tener máximo ${val} caracteres`;
        case "minLength":
            return `Debe tener mínimo ${val} caracteres`;
        case "max":
            return `Debe ser máximo ${val}`;
        case "min":
            return `Debe ser mínimo ${val}`;
        case "pattern":
            return "El valor ingresado no es válido";
        default:
            return "El valor ingresado no es válido";
    }
}

export const mapErrorMessages = (object) => {
    for (const key in object) {
        if (!(object[key]?.message) && !(["value", "disabled", "validate", "deps"].includes(key))) {
            object[key] = { value: object[key], message: msgs(key, object[key]) };
        }
    }
    return object;
}