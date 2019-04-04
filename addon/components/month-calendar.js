import Component from '@ember/component';
import layout from '../templates/components/month-calendar';
import moment from 'moment';

export default Component.extend({
  tagName: 'canvas',
  width: 1000,
  height: 200,
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
      ctx.strokeText(monthList[i], firstColumnWidth+startColumn*blockSize+blockSize/2, 10);
      startColumn++;
    }
    // Now keep filling in columns for the next years until we have enough to
    // fill in the entire chart.
    let i = 0;
    while (startColumn < 24) {
      ctx.strokeText(monthList[i], firstColumnWidth+startColumn*blockSize+blockSize/2, 10);
      startColumn++;
      i++;
      if (i == 12) {
        i = 0;
      }
    }
  },

  _drawUserRow: function (offset, user) {
    var ctx = this.get('ctx');
    let blockSize = this.get('blockSize');
    ctx.strokeStyle = '#000000';
    ctx.textAlign = "left"
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
    ctx.fillStyle = block.color;
    for (let i = diff; i < block.numMonths+diff; i++) {
      ctx.fillRect(blockOffset+firstColumnWidth+i*blockSize,
        blockOffset+blockSize+offset*blockSize,
        blockSize-blockOffset,
        blockSize-blockOffset);
      if (i != block.numMonths+diff-1) {
         ctx.fillRect(
           firstColumnWidth+i*blockSize+blockSize,
           blockOffset+blockSize+offset*blockSize+(blockSize/3),
           10,
           4
         );
      }
    }
  },

  _empty: function() {
    var ctx = this.get('ctx');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.get('width'), this.get('height'));
  }
});
