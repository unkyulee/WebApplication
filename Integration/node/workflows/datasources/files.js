const fs = require('fs');
const path = require('path');

function walkSync (dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = walkSync(dirFile, filelist);
        }
        catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
            else throw err;
        }
    });
    return filelist;
}

class FILES_DataSource {
    constructor(context, property) {
        this.context = context
        this.property = property
    }

    async init() {
        this.count = 0
    }

    async finish() {
    }

    async start() {

        let filelist = walkSync(this.property.folder)
        for(let file of filelist) {
            // filter by extensions
            if(this.property.extensions) {
                let extension = path.extname(file)
                if(this.property.extensions.includes(extension) == false)
                    continue
            }

            // stats
            this.count++
            let stats = fs.statSync(file)
            stats['filepath'] = file 
            stats['root'] = this.property.folder
            await this.context.event.emit(this.property.id, this.count, stats)       
        }
            
    }

}

module.exports = FILES_DataSource