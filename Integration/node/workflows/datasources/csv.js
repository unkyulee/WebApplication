var fs = require('fs');
var CsvReadableStream = require('csv-reader');
var AutoDetectDecoderStream = require('autodetect-decoder-stream');

class CSV_DataSource {
  constructor(context, property) {    
    this.context = context
    this.property = property
  }

  // initialized
  init() {        
  }

  finish() {    
  }

  start() {
    // run through csv file and emit for each row
    console.log(`CSV_DataSource::start ${this.property.filepath}`)    
    this.inputStream = fs.createReadStream(this.property.filepath)
      .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1252' })); 

    // start reading
    let that = this
    let count = 0
    this.inputStream
      .pipe(CsvReadableStream(this.property.options))
      .on('data', function (row) {

        // process first row as header
        if( count == 0 && that.property.header != false) {
          that.property.header = row            
        }
        else {
          // merge with header
          let data = {}
          if(that.property.header != false) {
            for(let column of that.property.header) {
              let index = that.property.header.indexOf(column)
              data[column] = row[index]
            }                   
            that.context.event.emit(that.property.id, count, data)              
          } else {
            that.context.event.emit(that.property.id, count, row)
          }            
        }

        // increase counter
        count += 1
        
      }).on('end', function (data) {       
        console.log(`CSV_DataSource::start - ${count} read`)      
        that.context.event.emit('finish')
      });     
  }

}

module.exports = CSV_DataSource