import quickSort from "../sort-algo/quicksort";
export class DateGenerator {
  protected currDate: Date;
  protected today: {
    time: number;
    dayType: number;
    day: number;
    month: number;
    year: number;
  };
  constructor() {
    this.currDate = new Date();
    this.today = {
      time: this.currDate.getTime(),
      dayType: this.currDate.getDay(),
      day: this.currDate.getDate(),
      month: this.currDate.getMonth(),
      year: this.currDate.getFullYear(),
    };
  } // declare a real time Date

  timeStamp = (difference: number) => {
    const multiplier = 1000 * 60 * 60 * 24;
    const newDate = this.today.time + multiplier * difference;
    return new Date(newDate);
  };
  formatDate = (date: Date) => {
    const style: Intl.DateTimeFormatOptions = { dateStyle: "medium" };
    const f = new Intl.DateTimeFormat("en-us", style);
    return f.format(date);
  }; // Format Date into standard prefixes
  formatTime = (time: Date) => {
    const style: Intl.DateTimeFormatOptions = { timeStyle: "medium" };
    const f = new Intl.DateTimeFormat("en-us", style);
    return f.format(time);
  };
}

export class DatePreset extends DateGenerator {
  // PRIVATE VARS FOR ONLY GETTING BELOW DAYS
  private WEDNESDAY = { name: "wednesday", code: 3 };
  private SATURDAY = { name: "saturday", code: 6 };
  private SUNDAY = { name: "sunday", code: 0 };
  private MAXREQUIRED = 6; // Max number of required predetermined data
  private WEEK = 7;
  constructor() {
    super();
  }
  init_day = (day: string) => {
    const this_name = day.toLowerCase();
    switch (this_name) {
      case this.WEDNESDAY.name:
        return this.WEDNESDAY.code;
      case this.SATURDAY.name:
        return this.SATURDAY.code;
      case this.SUNDAY.name:
        return this.SUNDAY.code;
      default:
        return 0;
    }
  }; // INIT_DAY : defined desired days

  INSPECT_NEAREST_DAY = () => {
    const DICT = [
      { flag: this.WEDNESDAY.name, value: null },
      { flag: this.SATURDAY.name, value: null },
      { flag: this.SUNDAY.name, value: null },
    ];
    const temp = DICT.map((date) => {
      return { ...date, value: this.DATE_THIS_WEEK(date.flag) };
    });
    const sorted = quickSort(temp, 0, temp.length - 1);
    const BluePrint = sorted.map((item) => item.flag);
    return BluePrint;
  }; // INSPECT_NEAREST_DAY : Check the nearest to perform autocycle

  DATE_THIS_WEEK = (day: string) => {
    const TIMEGAP = this.init_day(day) - this.today.dayType;
    return TIMEGAP >= 0 ? TIMEGAP : this.WEEK + TIMEGAP;
  }; // DATE_THIS_WEEK : Get this week date

  DATE_NEXT_WEEK = (day: string) => {
    const TIMEGAP = this.init_day(day) - this.today.dayType;
    return TIMEGAP >= 0 ? this.WEEK + TIMEGAP : this.WEEK * 2 + TIMEGAP;
  }; // DATE_NEXT_WEEK : Get next week earlier

  GET_DRAW_DATE = () => {
    let content = [];
    const day = this.INSPECT_NEAREST_DAY();
    let count = 0;
    let time: Date | undefined;
    for (let i = 0; i < this.MAXREQUIRED; i++) {
      if (i > 2) time = this.timeStamp(this.DATE_NEXT_WEEK(day[count]));
      if (i <= 2) time = this.timeStamp(this.DATE_THIS_WEEK(day[count]));
      if (time) content.push(this.formatDate(time));
      if (count == 2) count = 0;
      else count++;
    }
    return content;
  }; // GET_DRAW_DATE : Get 6 sets of draw dates
}
