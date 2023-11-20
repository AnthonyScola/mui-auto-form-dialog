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
