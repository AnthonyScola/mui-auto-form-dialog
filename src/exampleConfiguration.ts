import { AutoDialogDataProps } from "./components/AutoDialog/interfacesAndTypes";

export const exampleConfiguration: AutoDialogDataProps = {
  action: 'post',
  query: '',
  formComponents: [
    {
      controlType: 'TextField',
      size: {
        sx: 6,
      },
      controlProps: {
        id: 'fName',
        label: 'First Name',
        required: true,
      },
    },
    {
      controlType: 'TextField',
      size: {
        sx: 6,
      },
      controlProps: {
        id: 'lName',
        label: 'Last Name',
        required: true,
      },
    },
    {
      controlType: 'Autocomplete',
      size: {
        sx: 4,
      },
      controlProps: {
        id: 'gender',
        label: 'Gender',
        required: true,
        noOptionsText: "No Genders?",
        options: ["male","female","other"]
        
      },
    },
    {
      controlType: 'NumberField',
      size: {
        sx: 2,
      },
      controlProps: {
        id: 'age',
        label: 'age',
        required: true,
        min: 1,
        max: 120,
        disalowedValues: [69],
        helperText: "Enter your age in years",
        errorText: "Invalid age",
      },
    },
    {
      controlType: 'TextField',
      size: {
        sx: 12,
      },
      controlProps: {
        id: 'email',
        label: 'e-mail',
        required: true,
      },
    },
  ]
}