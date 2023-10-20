import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import AutoDialog from './components/AutoDialog/AutoDialog';

export default function App() {

  const [showAutoDialog, setShowAutoDialog] = useState<boolean>(false);

  const openAutoDialog = () => {
    setShowAutoDialog(true);
  }

  return (
    <Grid
      container
      direction='row'
      justifyContent='center'
      alignItems='center'
      sx={{height: '100vh'}}
    >
      {showAutoDialog && (
        <AutoDialog
          open={showAutoDialog} 
          title={'Auto Dialog'} 
          details={'This Dialog should help you develope faster!!'}
          data={{
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
          }}
          onClose={()=>setShowAutoDialog(false)}
        />
      )}
      <Button variant='contained' onClick={openAutoDialog}>Launch Dialog</Button>
    </Grid>
  );
}
