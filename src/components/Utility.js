import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import QueryCount from 'src/views/reports/DashboardView/QueryCount';
import Frequency from 'src/views/reports/DashboardView/Frequency';
// import Sales from 'src/views/reports/DashboardView/Sales';
import ClusterPattern from 'src/views/reports/DashboardView/ClusterAccuracy';
// import { Score } from 'src/views/reports/DashboardView/Score';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(1)
  },
  container: {
    padding: 0
  }
}));

const Utility = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Utility"
    >
      <Container className={classes.container} maxWidth={false}>
        <Grid
          container
          spacing={3}
          direction="column"
        >
          <Grid
            item
            xs={12}
          >
            <QueryCount />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Frequency />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <ClusterPattern />
          </Grid>
          {/* <Grid
            item
            xs={12}
          >
            <Accuracy />
          </Grid> */}
          <Grid
            item
            xs={12}
          >
            {/* <Score /> */}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Utility;
