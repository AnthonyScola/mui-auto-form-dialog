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

  if(typeof(value) === 'number'){
    if('disalowedValues' in Control.controlProps && Control.controlProps.disalowedValues !== undefined){
      if(Control.controlProps.disalowedValues.includes(value) && !errorsArray.includes(controlId)){
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
//     disalowedValues: [69],
//     helperText: "Enter your age in years",
//     errorText: "Please enter a valid age",
//     disalowedValuesText: "You may not enter {{disalowedValues}} as your age",
//   },
// },

export function getHelperText(control: Control, value: FormDataTypes) {
  console.log(control.controlProps);
  if (control.controlType === "NumberField" && typeof value === "number") {
    if (control.controlProps.disalowedValueshelperText && control.controlProps.disalowedValues && control.controlProps.disalowedValues.includes(value)) {
      return control.controlProps.disalowedValueshelperText;
    }
    if (control.controlProps.errorText && control.controlProps.min && value < control.controlProps.min) {
      return control.controlProps.errorText;
    }
    if (control.controlProps.errorText && control.controlProps.max && value > control.controlProps.max) {
      return control.controlProps.errorText;
    }
  }
  if (control.controlProps.helperText) {
    return control.controlProps.helperText;
  }
  return "";
}