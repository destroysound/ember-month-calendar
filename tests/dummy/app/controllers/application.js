import Controller from '@ember/controller';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set("data", {
      users: [
        {
          name: "User1",
          blocks: [
            {start: "10/01/2019", numMonths: 3, color: "#C00"},
            {start: "01/01/2020", numMonths: 1, color: "#0C0"},
          ]
        },
        {
          name: "User2",
          blocks: [
            {start: "08/01/2019", numMonths: 3, color: "#C00"},
            {start: "11/01/2019", numMonths: 12, color: "#00C"},
          ]
        },
        {
          name: "User3",
          blocks: [
            {start: "05/01/2019", numMonths: 12, color: "#00C"},
            {start: "05/01/2020", numMonths: 1, color: "#0C0"},
          ]
        },
        {
          name: "User4",
          blocks: [
            {start: "04/01/2019", numMonths: 3, color: "#C00"},
            {start: "07/01/2019", numMonths: 3, color: "#C00"},
          ]
        },
        {
          name: "User5",
          blocks: [
            {start: "02/01/2019", numMonths: 3, color: "#C00"},
            {start: "05/01/2019", numMonths: 3, color: "#C00"},
          ]
        }
      ]
    })
  }
});
