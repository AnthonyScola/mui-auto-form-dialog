import { FormDataTypes, Control } from "./interfacesAndTypes";


export const validateControl = (Control: Control, value: FormDataTypes, errorsArray: string[], setErrors: React.Dispatch<React.SetStateAction<string[]>>) => {
  if(Control.controlProps.required === false){
    return;
  }

  if(value === null) value = '';
  const controlId = Control.controlProps.id;
  if(typeof(value) === 'string'){
    if((value.length < 1) && !errorsArray.includes(controlId)){
      setErrors([...errorsArray, controlId]);
    }
    if((value.length > 0) && errorsArray.includes(controlId)){
      setErrors(errorsArray.filter(item => item !== controlId));
    }
  }

  if(typeof(value) === 'number' && Control.controlType === 'NumberField'){
    if('disallowedValues' in Control.controlProps && Control.controlProps.disallowedValues !== undefined){
      if(Control.controlProps.disallowedValues.includes(value) && !errorsArray.includes(controlId)){
        setErrors([...errorsArray, controlId]);
        return;
      }
    }
    if('min' in Control.controlProps && Control.controlProps.min !== undefined){
      if((value < Control.controlProps.min)){
        !errorsArray.includes(controlId) && setErrors([...errorsArray, controlId]);
        return;
      }
      if(errorsArray.includes(controlId)){
        setErrors(errorsArray.filter(error => error !== controlId));
        return;
      }
    }
    if ('max' in Control.controlProps && Control.controlProps.max !== undefined){
      if((value > Control.controlProps.max) && !errorsArray.includes(controlId)){
        !errorsArray.includes(controlId) && setErrors([...errorsArray, controlId]);
        return;
      }
      if(errorsArray.includes(controlId)){
        setErrors(errorsArray.filter(error => error !== controlId));
        return;
      }
    }
  }
};


// {
//   controlType: 'NumberField',
//   size: {
//     sx: 2,
//   },
//   controlProps: {
//     id: 'age',
//     label: 'age',
//     required: true,
//     min: 1,
//     max: 120,
//     disallowedValues: [69],
//     helperText: "Enter your age in years",
//     errorText: "Please enter a valid age between {{min}} and {{max}}",
//     disallowedValuesText: "You may not enter {{disallowedValues}} as your age",
//   },
// },

export function getHelperText(control: Control, value: FormDataTypes) {
  console.log(control.controlProps);
  let result = "";
  if (control.controlType === "NumberField" && typeof value === "number") {
    if (control.controlProps.disallowedValueshelperText && control.controlProps.disallowedValues && control.controlProps.disallowedValues.includes(value)) {
      result = control.controlProps.disallowedValueshelperText;
    }
    if (control.controlProps.errorText && control.controlProps.min && value < control.controlProps.min) {
      result = control.controlProps.errorText;
    }
    if (control.controlProps.errorText && control.controlProps.max && value > control.controlProps.max) {
      result = control.controlProps.errorText;
    }
  }
  if (control.controlProps.helperText) {
    result = control.controlProps.helperText;
  }
  for (let key in control.controlProps) {
    let placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(control.controlProps[key as keyof typeof control.controlProps]));
  }
  return result;
}