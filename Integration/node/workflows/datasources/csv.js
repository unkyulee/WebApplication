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

  async start() {
    // run through csv file and emit for each row
    console.log(`CSV_DataSource::start ${this.property.filepath}`)
    this.inputStream = fs.createReadStream(this.property.filepath)
      .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1252' }));

    // start reading
    let that = this
    let count = 0

    let rows = []
    this.inputStream
      .pipe(CsvReadableStream(this.property.options))
      .on('data', function (row) {
        count++ // increase the row count

        // process first row as header        
        if (count == 1 && that.property.header != false) {
          that.property.header = row
        }
        else {
          let data = {}

          // csv with header
          if (that.property.header != false) {
            for (let column of that.property.header) {
              let index = that.property.header.indexOf(column)
              data[column] = row[index]
            }
            rows.push(data)
          }

          // csv without header
          else {
            rows.push(row)
          }
        }

      }).on('end', async function (data) {
        console.log(`CSV_DataSource::start - ${count} read`)
        
        // start sending rows
        count = 0
        for (let row of rows) {
          await that.context.event.emit(that.property.id, ++count, row)
        }
        console.log(`CSV_DataSource::finished`)
        that.context.event.emit('finish')

      });
  }

}

module.exports = CSV_DataSource