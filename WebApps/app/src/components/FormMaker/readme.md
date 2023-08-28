# Fields Structure

### Validations attr
- Is used to specify the validations to the field

validations: {
    value: any, //Default value to the field
    disabled: boolean,
    required: boolean,
    maxLength: number,
    minLength: number, 
    max: number, 
    min: number,
    pattern: RegExp like /[A-Za-z]{3}/,
    validate: (value)=>{return boolean}
}


### attrs attr
- Is used to specify the optionals attributes to the field, each one depends by the field

attrs:{
    handleChange: func(e){...},
    fetchValues: funct(val){...},
    cols: number,
    rows: number, 
    placeholder: string, 
    disabled: boolean, 
    type: string,
    ...
}


### label attr
- The label text to the field

label: string


### classInput attr
- Is used to define the classes for the field

classInput: string


### classLabel attr
- Is used to define the classes for the group label-field, like de col-[sm/md/lg/xl]-[1-12] 

classLabel: string


### inline attr
- Inline attr add the fields one nexto to other one (Only valid for check or radio input)

inline: boolean

*------------------------------------------------------------*


## Input [Text, Number, Email, Tel, Password] - Base
{ tag: "input",
    label: "...",
    id: "...",
    classInput: "...",
    classLabel: "...",
    classGroup: "...",
    attrs: {...},
    validations: {...}
}

## Select, Radio, Check
{ ...Base,
    validations:{ ...,
        min: number //Indicate the min number of items selectable, if is not especified all options will be requireds (Apply only for checkbox with options),
        max: number //Indicate the max number of items selectable
    }
    inline: boolean, 
    options: ["", "", ""] or [{label: "", value: any}, {label: "", value: any}, {label: "", value: any}],
    requiredOptions:
}

* EXAMPLE Checkbox group: 
    {
        tag: "checkbox",
        label: "Periodo",
        id: "period",
        classGroup: "col-md-6",
        inline: true,
        attrs: {},
        options: ["2021-02", "2021-01", "2020-02"],
        validations: {
            required: true,
            min: 1,
            max: 2
        }
    }

* EXAMPLE checkbox simple:
    {  
        tag: "checkbox",
        label: <span>Acepto <a href="/#">términos</a> y condiciones</span>,
        id: "terms",
        classGroup: "col-md-12",
        attrs: {},
        validations: {
            required: true,
        }
    }