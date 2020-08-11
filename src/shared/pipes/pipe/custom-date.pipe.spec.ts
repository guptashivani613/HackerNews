import { CustomDatePipe } from './custom-date.pipe';
var d = new Date();
var currentDate = d.toISOString();
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

  // it('returns formatted value for 5 hours ago', () => {
  //   const pipe = new CustomDatePipe();
  //   const result = pipe.transform(currentDate2);
  //   expect(result).toBe('26 minutes ago');
  // });
});
