import React from 'react';
import { CardActions, CardHeader, Card, Button, CardContent, Paper, Typography } from '@mui/material';
import { AlignVerticalCenter } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { useStyles } from '@mui/material'

export default function CalloutCard(props) {
  const { header, content, buttonText, buttonLink, key, sx } = props;
  const theme = useTheme();

  return (
    <>
      <Card key={key} 
      sx={{
        borderRadius: 2,
        dropShadow: '0px 4px 8px rgba(0.5, 0.5)', 
        height: 300,
          p: 1  ,
//          backgroundColor: //theme.palette.grey[150],
          "&:hover": {
 //           backgroundColor: //theme.palette.grey[200],
            boxShadow: '0px 4px 8px rgba(0.5, 0.5, 0.5, 0.5)',
            backgroundColor:'#fbfeff',
            cursor: "pointer",
            "& .addIcon": {
              color: "purple"
            }
          }
        }}
       >
        <CardHeader title={header}><Typography fontFamily={'open sans'}>{header}</Typography></CardHeader>
        <CardContent><Typography fontFamily={'open sans'}>{content}</Typography></CardContent>
        <CardActions
          sx={{

            justifyContent: 'center',
          }}
        >
          <Button variant={'outlined'} href={buttonLink}>
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
