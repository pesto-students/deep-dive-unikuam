import React, {
  Component
} from 'react';
import * as defaultConfig from './common';
import './bar.css';
import _ from 'lodash';

class Bar extends Component {
  constructor(props) {
    super(props);
    this.barCanvas = React.createRef();
    this.tooltipCanvas = React.createRef();
    this.state = {
      gotTooltipForBar: false
    }
  }

  componentDidMount() {
    const {
      labels,
      datasets
    } = this.props.data;
    if (labels.length != datasets[0].data.length) {
      throw new Error('Invalid params provided. Labels & data length should be equal');
    }
    if (labels.length !== new Set(labels).size) {
      throw new Error('Lables can not contain duplicate values.');
    }
    const barCanvas = this.barCanvas.current;
    let ctx = barCanvas.getContext("2d");
    let tooltipData = [];
    // TODO: SETTING BAR WIDTH & MARGIN ACCORDING TO NUMBER OF DATA
    const { factor, difference } = this.generateVerticleTicks(datasets[0].data, ctx);
    const {
      dynamicWidth,
      dynamicMargin
    } = this.adjustCanvasBar(datasets[0].data);
    let rightShift = 0 + dynamicMargin;
    for (const barLabel of labels) {
      //get current index
      const index = labels.indexOf(barLabel);
      //fill bar with given backgroundColor
      ctx.fillStyle = datasets[0].backgroundColor[index] || 'rgba(0, 0, 255, 0.5)';
      //create bar according to calculated coordinates
      let x = defaultConfig.DSTARTPOINT + rightShift;
      let y = (defaultConfig.CHEIGHT) - defaultConfig.LINEGAP;
      ctx.fillRect(x, y, dynamicWidth, -Math.round(datasets[0].data[index] * factor));
      //set labels
      let labelName = `${barLabel.charAt(0).toUpperCase()}${barLabel.slice(1, barLabel.length)}`; //make first letter capital
      ctx.fillStyle = "black";
      ctx.font = "14px";
      ctx.fillText(labelName, x, y + 15);
      //fill tooltip data
      tooltipData.push({
        label: labelName,
        xLeft: x,
        xRight: dynamicWidth,
        yUpper: Math.round(datasets[0].data[index] * factor),
        yLower: y,
        text: `${datasets[0].label ? datasets[0].label+': ': ''}${datasets[0].data[index]}`
      });
      //make right shift to next bar
      rightShift += dynamicWidth + defaultConfig.BARMARGIN;
    }
    barCanvas.addEventListener('mousemove', (event) => this.handleMouseMove(event, tooltipData))
    ctx.moveTo(50, 50); //verticle line start point
    ctx.lineTo(50, 450); //verticle line end point
    // ctx.stroke(); //400
    ctx.moveTo(50, 450); //horizontal line start point
    ctx.lineTo(450, 450); //horizontal line end point
    ctx.stroke(); //400
  }

  adjustCanvasBar(barData) {
    const {
      DBARWIDTH,
      HORIZONH,
      BARMARGIN
    } = defaultConfig;
    let dynamicWidth;
    let dynamicMargin;
    let occupiedWidth = barData.length * (DBARWIDTH + BARMARGIN);
    if (defaultConfig.HORIZONH < occupiedWidth) {
      for (let i = DBARWIDTH; i >= 1; i--) {
        dynamicWidth = i;
        if ((parseInt(i) + parseInt(BARMARGIN)) * parseInt(barData.length) <= HORIZONH) {
          break;
        }
      }
      for (let i = BARMARGIN; i >= 0; i--) {
        dynamicMargin = i;
        if ((parseInt(dynamicWidth) + parseInt(i)) * parseInt(barData.length) <= HORIZONH) {
          break;
        }
      }
    } else {
      dynamicWidth = DBARWIDTH;
      dynamicMargin = BARMARGIN;
    }
    return {
      dynamicWidth,
      dynamicMargin
    }
  }

  generateVerticleTicks(barData, ctx) {
    let {
      tickData,
      factor,
      difference
    } = this.getVerticleTicksRange(barData);
    for (const {
        tick,
        pixel
      } of tickData) {
      ctx.font = "10px";
      ctx.fillRect(defaultConfig.DSTARTPOINT,
        (defaultConfig.CHEIGHT - defaultConfig.LINEGAP) - pixel,
        -defaultConfig.MARKERW,
        defaultConfig.MARKERH);
      ctx.fillText(tick,
        defaultConfig.DSTARTPOINT - (20 + tick.toString().length * 2),
        (defaultConfig.CHEIGHT - defaultConfig.LINEGAP) - pixel + 5);
    }
    return {
      factor,
      difference
    }
  }

  getRoundedOffTick(data) {
    let lastDigit = +data % 10; //find last digit
    if (data % 5 !== 0 && lastDigit > 0 && lastDigit < 5) {
      data = data + (5 - lastDigit);
    }
    return data;
  }

  calculateDiffBarTick(start, end) {
    //// TODO: Need to wrap into a separate function
    let digitLength = start.toString().length;
    let startBase = '1';
    for (let i = 1; i <= digitLength; i++) {
      startBase += '0';
    }

    let enddigitLength = end.toString().length;
    let endBase = '1';
    for (let i = 1; i <= enddigitLength; i++) {
      endBase += '0';
    }

    if (startBase.length === endBase.length) {
      return +(startBase.slice(0, startBase.length - 1));
    } else {
      return +(endBase.slice(0, endBase.length - 1));
    }
  }

  getVerticleTicksRange(data) {
    let sortedBarData = _.cloneDeep(data);
    sortedBarData.sort((currentTick, nextTick) => currentTick - nextTick);
    let start = this.getRoundedOffTick(sortedBarData[0]);
    // start: logic for finding base
    if (start % 10 !== 0) {
      let digitLength = start.toString().length;
      let base = '1';
      for (let i = 1; i <= digitLength; i++) {
        base += '0';
      }
      let middleNumber = +base / 2;
      if (middleNumber <= start) {
        start = middleNumber;
      } else if (middleNumber > start) {
        start = base.slice(0, base.length - 1);
      }
    }
    // end: logic for finding base
    let end = this.getRoundedOffTick(sortedBarData[sortedBarData.length - 1]);
    let difference = this.calculateDiffBarTick(start, end);
    let factor = defaultConfig.VERTICALH / end;
    let tickData = [];
    for (const tick of _.range(start, end, difference)) {
      tickData.push({
        tick,
        pixel: Math.round(tick * factor)
      });
    }
    return {
      tickData,
      factor,
      difference
    };
  }

  barStyles = {
    border: "1px solid black",
  }

  handleMouseMove(event, tooltipData) {
    let rect = this.barCanvas.current.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    let data = tooltipData.find(obj => {
      return (mouseX > obj.xLeft && mouseX < obj.xLeft + obj.xRight) &&
        (mouseY < obj.yLower && mouseY > obj.yLower - obj.yUpper);
    })
    let tooltipCanvas = this.tooltipCanvas.current;
    let ttx = tooltipCanvas.getContext("2d");
    //// TODO: Calculate x axis tootip position for now its hardcoded 140
    if (!this.state.gotTooltipForBar) {
      if (data) {
        this.setState({
          gotTooltipForBar: true
        }, () => {
          tooltipCanvas.style.position = 'absolute';
          tooltipCanvas.style.left = ((data.xLeft + data.xRight) + 140) + "px";
          tooltipCanvas.style.display = 'block';
          tooltipCanvas.style.top = (data.yLower - data.yUpper) + "px";
          ttx.clearRect(0, 0, defaultConfig.TWIDTH, defaultConfig.THEIGHT);
          ttx.fillText(data.text, 5, 15);
          ttx.fillText(data.label, 15, 25);
        })
      }
    } else {
      if (!data) {
        this.setState({
          gotTooltipForBar: false
        }, () => {
          tooltipCanvas.style.display = 'none';
          ttx.clearRect(0, 0, defaultConfig.TWIDTH, defaultConfig.THEIGHT);
        })
      }
    }
  }

  tooltipStyle = {
    border: '1px',
    background: 'aliceblue',
    borderRadius: '16%',
    borderColor: '#555 transparent transparent transparent',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    display: 'none',
    fontSize: '20px'
  }

  render() {
    return ( <
      div className = "bar-canvas" >
      <
      canvas id = "bar-visualizer"
      ref = {
        this.barCanvas
      }
      width = {
        defaultConfig.CWIDTH
      }
      height = {
        defaultConfig.CHEIGHT
      }
      style = {
        this.barStyles
      } >
      <
      /canvas> <
      canvas id = "tooltipCanvas"
      ref = {
        this.tooltipCanvas
      }
      width = {
        defaultConfig.TWIDTH
      }
      height = {
        defaultConfig.THEIGHT
      }
      style = {
        this.tooltipStyle
      } >
      <
      /canvas> <
      /div>

    );
  }
}

export default Bar;
