import Component from '@ember/component';
import layout from '../templates/components/month-calendar';
import moment from 'moment';

export default Component.extend({
  tagName: 'canvas',
  width: 1000,
  height: 1000,
  blockOffset: 8,
  blockSize: 40,
  firstColumnWidth: 80,
  attributeBindings: ['width','height'],
  didInsertElement: function() {
    // gotta set ctxf here instead of in init because
    // the element might not be in the dom yet in init
    this.set('ctx', this.get('element').getContext('2d'));
    this._empty();
    this.draw();
  },

  draw: Ember.observer("data", function () {
    this._empty();
    var ctx = this.get('ctx');
    let data = this.get('data');
    this._drawHeaderRow();
    for (let i = 0; i < data.users.length; i++) {
      this._drawUserRow(i, data.users[i]);
    }
  }),

  _drawHeaderRow: function () {
    var ctx = this.get('ctx');
    ctx.strokeStyle = '#000000';
    ctx.textAlign = "center";
    let monthList = moment.monthsShort();
    let curr = moment();
    let currmonth = curr.format('MMM');
    let firstColumnWidth = this.get('firstColumnWidth');
    let blockSize = this.get('blockSize');

    // First find the month that corresponds to the current month
    let monthIndex = 0;
    for (let j = 0; j < monthList.length; j++) {
      if (monthList[j] == currmonth) {
        monthIndex = j;
      }
    }
    // Now draw all of the month headers for the current year
    let startColumn = 0;
    for (let i = monthIndex; i < monthList.length; i++) {
      if (i % 2) {
        ctx.fillStyle = "#DFDFDF";
        ctx.fillRect(firstColumnWidth+startColumn*blockSize, 0, blockSize, this.get('width'));
      }
      else {
        ctx.fillStyle = "#F3F3F3";
        ctx.fillRect(firstColumnWidth+startColumn*blockSize, 0, blockSize, this.get('width'));
      }
      ctx.strokeText(monthList[i], firstColumnWidth+startColumn*blockSize+blockSize/2, 15);
      ctx.strokeText(curr.format('YYYY'), firstColumnWidth+startColumn*blockSize+blockSize/2, 25);
      startColumn++;
    }
    // Now keep filling in columns for the next years until we have enough to
    // fill in the entire chart.
    let i = 0;
    let next = curr.add(1, 'year');
    while (startColumn < 24) {
      if ((startColumn+1) % 2) {
        ctx.fillStyle = "#DFDFDF";
        ctx.fillRect(firstColumnWidth+startColumn*blockSize, 0, blockSize, this.get('width'));
      }
      else {
        ctx.fillStyle = "#F0F0F0";
        ctx.fillRect(firstColumnWidth+startColumn*blockSize, 0, blockSize, this.get('width'));
      }
      ctx.strokeText(monthList[i], firstColumnWidth+startColumn*blockSize+blockSize/2, 15);
      ctx.strokeText(curr.format('YYYY'), firstColumnWidth+startColumn*blockSize+blockSize/2, 25);
      startColumn++;
      i++;
      if (i == 12) {
        i = 0;
        next = next.add(1, 'year');
      }
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 35, this.get('width'), 2)
  },

  _drawUserRow: function (offset, user) {
    var ctx = this.get('ctx');
    let blockSize = this.get('blockSize');
    ctx.strokeStyle = '#000000';
    ctx.textAlign = "left"
    if (offset % 2) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, blockSize+offset*blockSize, this.get('width'), blockSize);
    }
    ctx.strokeText(user.name, 0, blockSize+offset*blockSize+blockSize/2+4)
    for (let i = 0; i < user.blocks.length; i++) {
      this._drawBlock(offset, user.blocks[i]);
    }
  },

  _drawBlock: function (offset, block) {
    var ctx = this.get('ctx');
    let curr = moment();
    let start = moment(block.start);
    let diff = Math.ceil(start.diff(curr, 'months', true));
    let firstColumnWidth = this.get('firstColumnWidth');
    let blockSize = this.get('blockSize');
    let blockOffset = this.get('blockOffset');
    let blockMoment = start;
    ctx.lineStyle = "#000";
    for (let i = diff; i < block.numMonths+diff; i++) {
      if (blockMoment.format('YYYYMM') >= curr.format('YYYYMM')) {
        if (i < block.numMonths+diff && i > diff) {
           ctx.fillStyle = "#000";
           if (blockMoment.format('YYYYMM') == curr.format('YYYYMM')) {
             ctx.fillRect(
               (firstColumnWidth+i*blockSize)-blockOffset+7,
               blockOffset+blockSize+offset*blockSize+(blockSize/4),
               20,
               4
             );
          }
          else {
            ctx.fillRect(
              (firstColumnWidth+i*blockSize)-blockOffset,
              blockOffset+blockSize+offset*blockSize+(blockSize/4),
              20,
              4
            );
          }
        }
        ctx.fillStyle = block.color;
        ctx.fillRect(blockOffset+firstColumnWidth+i*blockSize,
          blockOffset+blockSize+offset*blockSize,
          blockSize-blockOffset*2,
          blockSize-blockOffset*2);
        ctx.strokeRect(blockOffset+firstColumnWidth+i*blockSize,
          blockOffset+blockSize+offset*blockSize,
          blockSize-blockOffset*2,
          blockSize-blockOffset*2);
      }
      blockMoment = blockMoment.add(1, 'month');
    }
  },

  _empty: function() {
    var ctx = this.get('ctx');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.get('width'), this.get('height'));
  }
});
