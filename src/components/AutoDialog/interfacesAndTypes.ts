import {
  TextFieldProps,
  AutocompleteProps
} from '@mui/material';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface gridSize {
  sx?: GridCols;
  sm?: GridCols;
  md?: GridCols;
  lg?: GridCols;
  xl?: GridCols;
}


interface TextFieldControl {
  controlType: 'TextField';
  size: gridSize;
  hidden?: boolean;
  controlProps: TextFieldProps & {
    id: string;
    required?: boolean;
    label?: string;
    disalowedValues?: string[];
    disalowedValueshelperText?: string;
    helperText?: string;
    errorText?: string;
  };
}

interface NumberFieldControl {
  controlType: 'NumberField';
  size: gridSize;
  hidden?: boolean;
  controlProps: TextFieldProps & {
    id: string;
    required?: boolean;
    label?: string;
    min?: number;
    max?: number;
    disalowedValues?: number[];
    disalowedValueshelperText?: string;
    helperText?: string;
    errorText?: string;
  };
}

export interface AutocompleteFieldControl {
  controlType: 'Autocomplete';
  size: gridSize;
  hidden?: boolean;
  controlProps: {
    id: string;
    required?: boolean;
    label?: string;
    defaultValue?: string | Record<string, string>[];
    defaultValues?: string[] | Record<string, string>[];
    noOptionsText: string;
    options: string[] | Record<string, string>[];
    helperText?: string;
    errorText?: string;
  } & Omit<AutocompleteProps<string, false, false, false, 'div'>, 'renderInput'>;
}


export type Control =
  | TextFieldControl
  | NumberFieldControl
  | AutocompleteFieldControl
  ;

export interface AutoDialogDataProps {
  action: "post"|"put"|"patch"|"delete";
  query: string;
  formComponents: Control[];
}

export interface AutoDialogProps {
  open: boolean;
  title: string;
  details?: string;
  data: AutoDialogDataProps;
  onClose: (callback?: () => void) => void;
}

export type FormDataTypes = null | number | number[] | string | string[];

export type FormData = {
  [key: string]: FormDataTypes;
};