// import { legend } from "@d3/color-legend";
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import * as d3 from 'd3';
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { UserContext } from './UserContext';
// import {mapData, doAnonymity} from './kanomity';

const fetch = require('d3-fetch');

// WZ Phone
// const minValue = 700;
// const maxValue = 13512;

// SG EZLink
// const minValue = 1;
const maxValue = 72607;

// we divide the value into 8 segments
// const size = (maxValue - minValue) / 7;

const colors = ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824'];
function colorFn(value) {
  let index = 0;
  if (value > 100 && value <= 300) index = 1;
  else if (value > 300 && value <= 500) index = 2;
  else if (value > 500 && value <= 700) index = 3;
  else if (value > 700 && value <= 1200) index = 4;
  else if (value > 1200 && value <= 1700) index = 5;
  else if (value > 1700) index = 6;
  return colors[index];
}
// const countDay = (d) => d.getUTCDay();
// const timeDay = d3.utcHour;
// const formatDay = (d) => ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'][d.getUTCDay()];

const useStyles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
    borderColor: 'grey.500',
    border: 1,
    padding: '5px',
    // overflow: 'auto'
  },
  view: {
    minHeight: '20%',
    height: '30vh',
    overflow: 'scroll',
    border: '1px solid RGB(216,214,218)'
  }
});

class ColorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIsReturned: false
    };
    this.myRef = React.createRef();
    this.minValue = 999;
    this.maxValue = 0;
    this.cellValues = null;
    this.cellId = 0;
    this.stateChanger = props.stateChanger;
  }

  componentDidMount() {
    fetchPolyfill().then(async () => {
      // const obj = await fetch.csv('http://localhost:3000/data/hour.csv');
      const obj = await fetch.csv('http://localhost:3000/data/count_by_date.csv');
      const hourValues = obj.map((dv) => ({
        hour: Number(dv.hour),
        cell: Number(dv.cell),
        value: Number(dv.count)
      }));
      this.cellValues = d3.group(hourValues, (d) => {
        return d.cell;
      });

      this.setState({ dataIsReturned: true });
    }).catch((err) => console.error(err));
  }

  // processClick(target, data, hours) {
  //   this.context.setCountCellHour({hour: data.hour, count: data.value, diff: data.value-hours[data.hour-1].value});
  //   d3.select(target).attr('stroke', 'black');
  //   //   // hour.attr('stroke', (dd) => {
  //   //   //   const f = d.hour == dd.hour;
  //   //   //   return f ? 'black':'white';
  //   //   // }bind(this) ));
  //   //   e.target.style.stroke = 'black';

  //     // show sankey diagram: compare.js
  //     this.stateChanger(true);
  // }

  drawMap(cells, cellHour) {
    const cellSize = 10;
    const dayHeight = cellSize * 5 + 15;
    const dayWidth = cellSize * 7 + 20;
    const num = 7;  // number of calendars in a line
    const that = this;

    let dh = -1;
    if (cellHour != null || cellHour != undefined) dh = cellHour.hour;

    d3.select(this.myRef)
      .selectAll('svg')
      .remove();
    const svg = d3.select(this.myRef)
      .append('svg')
      .attr('viewBox', [-5, 0, dayWidth * num, cells.length * dayHeight / num + cellSize * 3])
      .attr('font-family', 'sans-serif')
      .attr('font-size', 3);
    cells.forEach((cellId, i) => {
      const hours = this.cellValues.get(cellId);
      if (hours === undefined || hours.length === 0) return;
      hours.sort((a, b) => a.hour - b.hour);

      svg.append('g')
      .attr('transform', `translate(${dayWidth * (i%num)}, ${dayHeight * Math.floor(i/num) + cellSize})`)
      .selectAll('rect')
      .data(hours)
      .join(
        (enter) => {
          return enter.append('rect');
        },
        (update) => {
          return update.attr('fill', (d) => {
            return colorFn(d.value);
          });
        }
      )
      .attr('width', cellSize - 1.5)
      .attr('height', cellSize - 1.5)
      .attr('x', (d) => {
        var time = new Date(d.hour * 1000);
        let date = time.getDate();
        return (date % 7) * cellSize + 10;
      })
      .attr('y', (d) => {
        var time = new Date(d.hour * 1000);
        let date = time.getDate();
        return Math.floor(date / 7) * cellSize + 0.5;
      })
      .attr('fill', (d) => {
        return colorFn(d.value)
      })
      .style('stroke', (d) => d.hour === dh ? '#f16913' : '')
      .on('click', function(e, d) {
        let time = new Date(d.hour * 1000);
        let date = time.getDate();
        // cell is not a single but multiple cells
        const { setDate, setCountCellHour, setRefresh } = that.context;
        setDate(date);
        that.stateChanger(true);
        setCountCellHour({hour: d.hour, count: 0, diff: 0});
        setRefresh(true);
      });
        // let month = time.getMonth()+1;
        
        // TODO get data on the day
        // const dataURL = 'http://localhost:3000/data/ezlink_count_2012-' + month + '-' + date + '.json';
        
      //   fetchPolyfill().then(async () => {
      //     const _tracks = await d3.json(dataURL);
          
      //     const trackMap = new Map();     // all tracks (points) start from a cell (key)
      //     const trackCellMap = new Map(); // all tracks (cell number) start from a cell


      //     // aggregate to gathering and scattering
      //     const {gatherMap, scatterMap} = mapData(_tracks, trackMap, trackCellMap, cellMap);

      //     let trackSet = [];
      //     let gatherAmount = 0.0;
      //     let scatterAmount = 0.0;
      //     let lossAmount = 0.0;
      //     cells.forEach( (c) => {
      //       const tempTracks = trackCellMap.get(c);
      //       if (tempTracks === undefined || tempTracks === null) return;

      //       // we need to change values of tracks, without changing the original tracks
      //       const mytracks = tempTracks.map(a => ({...a}));
      //       if (mytracks === undefined || mytracks.length === 0) return;

      //       // do anonymity, do not change the original tracks
      //       const {tracks, pointTracks, lossAmountAnonymity} 
      //         = doAnonymity(c, mytracks, 20, map, cellMap, gatherMap, scatterMap);
      //       trackSet.push(tracks);
      //       drawLines(map, pointTracks);

      //       // calculate # people of gather, scatter, as well as loss of gather scatter
      //       gatherAmount += gatherMap.get(c);
      //       scatterAmount += scatterMap.get(c);
      //       lossAmount += lossAmountAnonymity;

      //       const cellValueDay = that.cellValues.get(cellId);

      //       countHourCurrent += cellValueDay[date].value;
      //       countHourLast += cellValueDay[date-1].value;
      //     });

      //     // differential privacy, here we just set original tracks while process in the backend
      //     // setDprivacy(tempTracks);

      //     // console.log(this.context.kvalue);

      //     // show Sankey Diagrams
      //     setKanomity(trackSet);

      //     // K-Anonymity loss
      //     setPrecision({gather: gatherAmount, scatter: scatterAmount, 
      //       fresh: true, kanonymityLoss: lossAmount/(gatherAmount+scatterAmount)});
      //     // show sankey diagram: compare.js
      //   });
      // });

      svg.append('text')
      .attr('x', -dayHeight/2+cellSize)
      .attr('y', 5)
      .attr('text-anchor', 'end')
      .attr('font-size', 8)
      // .attr('transform', `translate(0, ${i * dayHeight + cellSize})rotate(270)`)
      .attr('transform', `translate(${dayWidth * (i%num)}, ${dayHeight * Math.floor(i/num) + cellSize})rotate(270)`)
      .text(cellId);
    });

    // display legennd
    const legend = svg.append('g')
      .attr('transform', `translate(10, ${cells.length * dayHeight / num + dayHeight+ 2 * cellSize})`);
    const categoriesCount = 10;
    const legendWidth = 15;

    const categories = [...Array(categoriesCount)].map((_, i) => {
      const upperBound = (maxValue / categoriesCount) * (i + 1);
      const lowerBound = (maxValue / categoriesCount) * i;

      return {
        upperBound,
        lowerBound,
        color: d3.interpolateBuGn(upperBound / maxValue)
      };
    });

    function toggle(leg) {
      const { /*lowerBound, upperBound,*/ selected } = leg;
      leg.selected = !selected;

      // hour.attr('fill', (d) => {
      //   const f = d.value > lowerBound && d.value <= upperBound;
      //   return leg.selected && f ? colorFn(d.value) : 'white';
      // });
    }

    legend
      .selectAll('rect')
      .data(categories)
      .enter()
      .append('rect')
      .attr('fill', (d) => d.color)
      .attr('x', (d, i) => legendWidth * i)
      .attr('width', legendWidth)
      .attr('height', 8)
      .on('click', (e, d) => {
        toggle(d);
      });

    // legend
    //   .selectAll('text')
    //   .data(categories)
    //   .join('text')
    //   .attr('transform', 'rotate(90)')
    //   .attr('y', (d, i) => -legendWidth * i)
    //   .attr('dy', -30)
    //   .attr('x', 18)
    //   .attr('text-anchor', 'start')
    //   .attr('font-size', 4)
    //   .text((d) => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);

    legend
      .append('text')
      .attr('dy', -5)
      .attr('font-size', 6)
      // .attr('text-decoration', 'underline')
      .text('Category');
  }

  render() {
    const { dataIsReturned } = this.state;
    const { classes } = this.props;
    if (!dataIsReturned) return <h1>Loading</h1>;
    return (
      <UserContext.Consumer>
        {(context) => (
          <Paper variant="outlined" className={classes.root}>
            <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="h5"
                >
               Daily Pattern
            </Typography>
            <div
              className={classes.view}
              ref={(el) => {
                this.myRef = el;
                this.context = context;
                const { cells, countCellHour } = this.context;
                if (cells !== '0') {
                  this.drawMap(cells, countCellHour);
                }
              }}
            />
          </Paper>
        )}
      </UserContext.Consumer>
    );
  }
}

ColorMap.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(ColorMap);
