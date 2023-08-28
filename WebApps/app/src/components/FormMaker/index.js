// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { fieldMaker } from "./Form";
// import { useForm } from 'react-hook-form';

// const formMaker = (forms) => {
//     console.log(forms)
//     const { register, formState: { errors }, handleSubmit } = useForm();

//     forms = forms.map(item => {
//         return <>
//             {item.map(field => fieldMaker(field))}
//         </>
//     })

//     return {
//         forms,
//         onsubmit: () => {
//             console.log("submit")
//         },
//         oncancel: () => { },
//     };
// }

// const fieldMaker = (field) => {
//     console.log(field);
//     return <div className={`form-group col-12 ${field.classGroup}`} key={field.id}>
//         <label htmlFor={field.id}>{field.label}</label>
//         <input type={field.type} className={`form-control ${field.classInput}`} id={field.id} name={field.id} />
//     </div>
// }

// export default formMaker;