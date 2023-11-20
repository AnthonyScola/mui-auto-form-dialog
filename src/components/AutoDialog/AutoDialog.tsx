import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Autocomplete
} from '@mui/material';
import axios from 'axios';
import { AutoDialogProps, FormData } from './interfacesAndTypes';
import { validateControl } from './helpers';


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
                      validateControl(control, newValue, errorsArray, setErrors);
                    }}
                    error={
                      control.controlProps?.required &&
                      !formData[control.controlProps.id]
                    }
                    fullWidth
                  />
                )}

                {control.controlType === 'NumberField' && (
                  <TextField
                    {...control.controlProps}
                    type='number'
                    inputProps={{
                      min: control.controlProps?.min,
                      max: control.controlProps?.max
                    }}
                    onChange={(event) => {
                      const newValue = event.target.value === '' ? '' : Number(event.target.value);
                      setFormData((prevData) => ({
                        ...prevData,
                        [control.controlProps.id]: newValue,
                      }));
                      validateControl(control, newValue, errorsArray, setErrors);
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
                    {...control.controlProps}
                    options={control.controlProps.options}
                    onChange={(event, value) =>{
                      setFormData((data) => ({
                        ...data,
                        [control.controlProps.id]: value,
                      }));
                      validateControl(control, value, errorsArray, setErrors);
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