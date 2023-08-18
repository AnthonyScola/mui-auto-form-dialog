import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextFieldProps,
  Grid,
  TextField,
  debounce,
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

export type Control =
  | TextFieldControl
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
  [key: string]: string | string[];
};

export default function AutoDialog({
  open,
  title,
  details,
  data,
  onClose
}: AutoDialogProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const checkValidity = (formDataToCheck: FormData) => {
    const required: { [key: string]: boolean | undefined } = {};
    data.formComponents.forEach((component) => {
      required[component.controlProps.id] = component.controlProps?.required;
    });

    const isInvalidArray: string[] = [];

    Object.keys(required).forEach((key) => {
      if (required[key] && (formDataToCheck[key] ?? '').length <= 0) {
        isInvalidArray.push(key);
      }
    });

    setReadyToSubmit(isInvalidArray.length < 1)
  };

  const debouncedSetFormData = debounce((fieldId, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
    checkValidity({
      ...formData,
      [fieldId]: value
    });
  }, 200);

  useEffect(() => {
    if (open) {
      const newFormData: FormData = {};
      data.formComponents.forEach((control) => {
        switch (control.controlType) {
          case 'TextField':
            newFormData[control.controlProps.id] = (
              control.controlProps.defaultValue ?? ''
            ).toString();
            break;
        }
      });
      setFormData(newFormData);
    }
  }, [open, data.formComponents]);

  const handleClose = () => {
    setFormData({});
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
                        debouncedSetFormData(control.controlProps.id, newValue);
                      }}
                      error={
                        control.controlProps?.required &&
                        !formData[control.controlProps.id]
                      }
                      fullWidth
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