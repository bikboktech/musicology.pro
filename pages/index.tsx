import React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const Modern = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <PageContainer>
      <Box>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} lg={12}>
            {/* <TopCards /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={8}>
            {/* <RevenueUpdates /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={12}>
                {/* <YearlyBreakup /> */}
              </Grid>
              <Grid item xs={12} sm={6} lg={12}>
                {/* <MonthlyEarnings /> */}
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            {/* <EmployeeSalary /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {/* <Customers /> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <Projects /> */}
              </Grid>
              <Grid item xs={12}>
                {/* <Social /> */}
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            {/* <SellingProducts /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            {/* <WeeklyStats /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={8}>
            {/* <TopPerformers /> */}
          </Grid>
        </Grid>
        {/* column */}
        {/* <Welcome /> */}
      </Box>
    </PageContainer>
  );
};

export default Modern;
