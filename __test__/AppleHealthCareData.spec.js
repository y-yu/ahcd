const AppleHealthCareData = require('../src/AppleHealthCareData');

describe('AppleHealthCareData', () => {
  let ahcd = undefined;
  beforeEach(() =>{
    ahcd = new AppleHealthCareData();
  });
  it(' analyze() : can analyze this.nodes then create this.results', async () => {
    expect(ahcd.analyze).toBeInstanceOf(Function);
    expect(await ahcd.analyze(require('fs').createReadStream('__test__/export.xml','utf-8'))).toBeInstanceOf(AppleHealthCareData);
    const expected = {
      HeartRate: {header:7,records:1},
      BodyMassIndex: {header:7,records:2},
      BloodPressureSystolic: {header:7,records:7},
    };
    Object.keys(expected).forEach((k) => {
      expect(ahcd.results[k].header.length).toEqual(expected[k].header);
      expect(ahcd.results[k].records.length).toEqual(expected[k].records);
    });
  });
  it(' writeCsvs() : can write from this.results to fill out this.csvs', async () => {
    await ahcd.analyze(require('fs').createReadStream('__test__/export.xml','utf-8'));
    expect(ahcd.writeCsvs).toBeInstanceOf(Function);
    expect(ahcd.writeCsvs()).toBeInstanceOf(AppleHealthCareData);
    const expected = {
      HeartRate: 3,
      BodyMassIndex: 4,
      BloodPressureSystolic: 9
    };
    Object.keys(expected).forEach((k) => {
      expect(ahcd.csvs[k].split("\n").length).toEqual(expected[k]);
    });
  });
  it(' csv(key) : can extract this.csvs[key]', async () => {
    (await ahcd.analyze(require('fs').createReadStream('__test__/export.xml','utf-8'))).writeCsvs();
    expect(ahcd.csv).toBeInstanceOf(Function);
    expect(ahcd.csv('HeatRate')).toBeUndefined();
    expect(ahcd.csv('HeartRate')).not.toBeUndefined();
  });
  it(' keys() : can return all keys', async () => {
    (await ahcd.analyze(require('fs').createReadStream('__test__/export.xml','utf-8'))).writeCsvs();
    expect(ahcd.keys).toBeInstanceOf(Function);
    expect(ahcd.keys()).toBeInstanceOf(Array);
    expect(ahcd.keys().length).toEqual(4);
  });
});
