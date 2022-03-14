import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import { UserContext } from '../../../components/UserContext';
import LinearDeterminate from './Bar';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const Score = ({ className, ...rest }) => {
  const classes = useStyles();
  let kascore = null;
  let dfscore = null;

  return (
    <UserContext.Consumer>
    {(context) => (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      ref={() => {
        const { precision,  utility } = context;
        kascore = precision.kanonymityLoss == undefined ? 0 : precision.kanonymityLoss.toFixed(4),
        dfscore = utility === null || utility === undefined || utility === '' ? 0 : utility.toFixed(4)
      }}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          spacing={5}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h5"
            >
              Anonymity Score
            </Typography>
            <LinearDeterminate value={kascore} />
          </Grid>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h5"
            >
              Differential Privacy Score
            </Typography>
            <LinearDeterminate value={dpscore} />
          </Grid>
        </Grid>
        
      </CardContent>
    </Card>
    )}
    </UserContext.Consumer>
  );
};

Frequency.propTypes = {
  className: PropTypes.string
};

export default Frequency;
