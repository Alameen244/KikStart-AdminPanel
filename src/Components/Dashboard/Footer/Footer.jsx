import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export default function Footer() {
  return (
    <FooterWrapper>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © 2024 KikStart Admin Panel. All rights reserved.
      </Typography>
    </FooterWrapper>
  );
}

const FooterWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  padding: '0 24px',
}));
