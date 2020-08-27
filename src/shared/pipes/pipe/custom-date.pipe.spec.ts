import { CustomDatePipe } from './custom-date.pipe';
var d = new Date();
var currentDate = d.toISOString();
/*here I am using "-30" to subtract 30 minutes from the current time to get 30 mins before date.*/
var minute=d.setMinutes(d.getMinutes()-30); 
var extract30Minutes =new Date(minute);
var currentDate2 = extract30Minutes.toISOString();
describe('CustomDatePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDatePipe();
    expect(pipe).toBeTruthy();
  });
  it('returns formatted value for Just now', () => {
    const pipe = new CustomDatePipe();
    const result = pipe.transform(currentDate);
    expect(result).toBe('Just now');
  });
  it('returns formatted value for 30 minutes ago', () => {
    const pipe = new CustomDatePipe();
    const result = pipe.transform(currentDate2);
    expect(result).toBe('30 minutes ago');
  });
});
