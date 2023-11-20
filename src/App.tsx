import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import AutoDialog from './components/AutoDialog/AutoDialog';

import { exampleConfiguration } from './exampleConfiguration';

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
          data={exampleConfiguration}
          onClose={()=>setShowAutoDialog(false)}
        />
      )}
      <Button variant='contained' onClick={openAutoDialog}>Launch Dialog</Button>
    </Grid>
  );
}
