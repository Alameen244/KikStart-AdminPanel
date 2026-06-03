import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  People,
  Article,
  Visibility,
  TrendingUp,
} from '@mui/icons-material';
import RevenueAnalyticsPage from './RevenueAnalyticsPage';

export default function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <People />, color: '#ED1C24' },
    { title: 'Content Pages', value: '8', icon: <Article />, color: '#2196F3' },
    { title: 'Active Sessions', value: '89', icon: <Visibility />, color: '#4CAF50' },
    { title: 'Monthly Growth', value: '+12%', icon: <TrendingUp />, color: '#FF9800' },
  ];

  return (
    <DashboardContainer>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: 'dark.main' }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'dark.main' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'semiDark.main' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{
                    backgroundColor: `${stat.color}15`,
                    borderRadius: '50%',
                    p: 1,
                    color: stat.color
                  }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No recent activity to display.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Use the sidebar to manage content and users.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <RevenueSection>
      <RevenueAnalyticsPage />
      </RevenueSection>
    </DashboardContainer>
  );
}


const DashboardContainer = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
});

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const RevenueSection = styled(Box)({
  margin: '50px 0',
});
