import React, { useEffect, useState, useReducer } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextFieldProps,
  AutocompleteProps,
  Grid,
  TextField,
  Autocomplete
} from '@mui/material';
import axios from 'axios';

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
  };
}

interface AutocompleteFieldControl {
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
  } & Omit<AutocompleteProps<string, false, false, false, 'div'>, 'renderInput'>;
}


export type Control =
  | TextFieldControl
  | AutocompleteFieldControl
  ;

export interface AutoDialogProps {
  open: boolean;
  title: string;
  details?: string;
  data: {
    action: 'post'|'put'|'patch'|'delete';
    query: string;
    formComponents: Control[];
  };
  onClose: (callback?: () => void) => void;
}

export type FormData = {
  [key: string]: null | string | string[];
};

export default function AutoDialog({
  open,
  title,
  details,
  data,
  onClose
}: AutoDialogProps) {
  const [formData, setFormData] = useState<FormData>(
    Object.assign({}, ...data.formComponents.map(control => ({ [control.controlProps.id]: control.controlProps.defaultValue })))
  );
  const [errorsArray, setErrors] = useState<string[]>(
    Object.keys(formData)
  );
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const checkValidity = (Control: Control, value: string | string[] | null) => {
    if(Control.controlProps.required === false){
      return;
    }
    if(value === null) value = '';
    const controlId = Control.controlProps.id;
    if((value.length < 1) && !errorsArray.includes(controlId)){
      setErrors([...errorsArray, controlId]);
    }
    if((value.length > 0) && errorsArray.includes(controlId)){
      setErrors(errorsArray.filter(item => item !== controlId));
    }
  };

  useEffect(()=>{
    setReadyToSubmit(errorsArray.length < 1);
  },[errorsArray]);

  const handleClose = () => {
    setFormData({});
    setErrors([]);
    setLoading(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!data.action) return;
    setLoading(true);

    axios[data.action](data.query, formData, {
      withCredentials: true,
    }).then(() => {
      console.log('Success!');
    })
    .catch(() => {
      console.log('Request Failed!');
    })
    .finally(()=>{
      handleClose();
    });
  };


  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      { isLoading ?(
        <>
          <DialogTitle>Loading</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ pb: 2.5 }}>Please wait while your request is being processed</DialogContentText>
          </DialogContent>
        </>
      ):(
        <>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {details && (
            <DialogContentText sx={{ pb: 2.5 }}>{details}</DialogContentText>
          )}
          <Grid container spacing={1.5}>
            {data.formComponents.map((control) => (
              <Grid
                item
                xs={control.size.sx}
                sm={control.size.sm}
                md={control.size.md}
                lg={control.size.lg}
                xl={control.size.xl}
                key={control.controlProps.id}
                sx={{ display: `${control.hidden === true && 'none'}` }}
              >
                {control.controlType === 'TextField' && (
                  <TextField
                    {...control.controlProps}
                    onChange={(event) => {
                      const newValue = event.target.value;
                      setFormData((prevData) => ({
                        ...prevData,
                        [control.controlProps.id]: newValue,
                      }));
                      checkValidity(control, newValue);
                    }}
                    error={
                      control.controlProps?.required &&
                      !formData[control.controlProps.id]
                    }
                    fullWidth
                  />
                )}
                {control.controlType === 'Autocomplete' && (
                  <Autocomplete
                  sx={{ mt: 1 }}
                  {...control.controlProps}
                  options={control.controlProps.options}
                  onChange={(event, value) =>{
                    setFormData((data) => ({
                      ...data,
                      [control.controlProps.id]: value,
                    }));
                    checkValidity(control, value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={control.controlProps?.required}
                      label={control.controlProps.label}
                      variant="outlined"
                      error={
                        control.controlProps?.required &&
                        !formData[control.controlProps.id]
                      }
                      fullWidth
                    />
                  )}
                />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          {(data.action === 'post' || data.action === 'put' || data.action === 'patch') && (
            <>
              <Button
                onClick={handleClose}
                variant='outlined'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant='contained'
                disabled={!readyToSubmit}
              >
                Submit
              </Button>
            </>
          )}
          {data.action === 'delete' && (
            <>
              <Button
                onClick={handleSubmit}
                color='error'
                variant='outlined'
              >
                Delete
              </Button>
              <Button
                onClick={handleClose}
                variant='contained'
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </>
      )}
    </Dialog>
  );
}