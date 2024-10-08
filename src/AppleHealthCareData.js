/**
 * @classdesc
 * Apple Health Care Data convert xml to csv
 * usage :
 * const ahcd = new AppleHealthCareData(xml);
 * ahcd.analyze().writeCsvs();
 * ahcd.keys().forEach((k) => console.log(ahcd.csv(k)));
 *
 */
class AppleHealthCareData {
  /**
   * @constructor
   * @desc
   * this.nodes : parse by using sax-parser
   * this.results : {}
   * this.csvs : {}
   */
  constructor(){
    this.results = {};
    this.csvs = {};

    this.parser = require('sax').createStream(true);
    this.parser.on("opentag", (node) => {
      if ('Record' === node.name && node.attributes['type']) {
        const match = node.attributes['type'].match(/^HK.*TypeIdentifier(.+)$/);
        if(!match || 0 === match.length) return;
        const key = match[1];
        // initialize this.results[key]
        if(!this.results[key]){
          this.results[key] = {header :[] , records:[]};
          Object
            .keys(node.attributes)
            .filter((k) => 'type' !== k)
            .forEach((k) => this.results[key].header.push({id:k,title:k}));
        }
        const record = {};
        this.results[key].header.forEach((h) => {
          record[h.id] = node.attributes[h.id];
        });
        this.results[key].records.push(record);        
      }
    });
  }
  /**
   * analyze
   * @returns {AppleHealthCareData} this This object
   * @desc
   * crawl this.nodes to fillout this.results
   *
   */
  async analyze(readStream){
    this.results = {};
    readStream.pipe(this.parser);
    await new Promise(resolve => {
      if (this.parser.closed) {
        resolve()
      } else {
        readStream.on("finish", resolve);
        this.parser.on("end", resolve);
      }
    });
    return this;
  }
  /**
   * writeCsvs
   * @returns {AppleHealthCareData} this This object
   * @desc
   * crawl this.results to fillout this.csvs
   *
   */
  writeCsvs(){
    const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
    Object.keys(this.results).forEach((k) => {
      const csvWriter = createCsvWriter({
        header: this.results[k].header
      });
      //await csvWriter.writeRecords(this.results[k].records);
      this.csvs[k] =
        csvWriter.getHeaderString() +
        csvWriter.stringifyRecords(this.results[k].records);
    });
    return this;
  }

  /**
   * csv
   * @params {string} key
   * @returns {string} csv string
   *
   */
  csv(key){
    return this.csvs[key];
  }

  /**
   * keys
   * @returns {array} all keys
   *
   */
  keys(){
    return Object.keys(this.csvs);
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = AppleHealthCareData;
} else {
  window.AppleHealthCareData = AppleHealthCareData;
}
