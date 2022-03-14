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

const Frequency = ({ className, ...rest }) => {
  const classes = useStyles();
  let frequency = null;
  let diff = null;

  return (
    <UserContext.Consumer>
    {(context) => (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      ref={() => {
        frequency = context.precision.frequency;
        const last_freq = context.precision.last_freq;
        diff = (frequency - last_freq) / last_freq * 100;
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
              FREQUENCY
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {frequency}
            </Typography>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {/* <ArrowUpwardIcon className={classes.differenceIcon} /> */}
          {diff != null && <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {diff.toFixed(1)}%
          </Typography>
          }
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last day
          </Typography>
        </Box>
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
