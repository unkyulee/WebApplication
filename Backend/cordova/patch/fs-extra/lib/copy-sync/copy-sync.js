"use strict";

const fs = require("graceful-fs");
const path = require("path");
const mkdirpSync = require("../mkdirs").mkdirsSync;
const utimesSync = require("../util/utimes.js.js").utimesMillisSync;

const notExist = Symbol("notExist");

function copySync(src, dest, opts) {
  if (typeof opts === "function") {
    opts = { filter: opts };
  }

  opts = opts || {};
  opts.clobber = "clobber" in opts ? !!opts.clobber : true; // default to true for now
  opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber; // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === "ia32") {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`);
  }

  const destStat = checkPaths(src, dest);

  if (opts.filter && !opts.filter(src, dest)) return;

  const destParent = path.dirname(dest);
  if (!fs.existsSync(destParent)) mkdirpSync(destParent);
  return startCopy(destStat, src, dest, opts);
}

function startCopy(destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return;
  return getStats(destStat, src, dest, opts);
}

function getStats(destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs.statSync : fs.lstatSync;
  const srcStat = statSync(src);

  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
  else if (
    srcStat.isFile() ||
    srcStat.isCharacterDevice() ||
    srcStat.isBlockDevice()
  )
    return onFile(srcStat, destStat, src, dest, opts);
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
}

function onFile(srcStat, destStat, src, dest, opts) {
  if (destStat === notExist) return copyFile(srcStat, src, dest, opts);
  return mayCopyFile(srcStat, src, dest, opts);
}

function mayCopyFile(srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs.unlinkSync(dest);
    return copyFile(srcStat, src, dest, opts);
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`);
  }
}

function copyFile(srcStat, src, dest, opts) {
  if (typeof fs.copyFileSync === "function") {
    fs.copyFileSync(src, dest);
    fs.chmodSync(dest, srcStat.mode);
    if (opts.preserveTimestamps) {
      return utimesSync(dest, srcStat.atime, srcStat.mtime);
    }
    return;
  }
  return copyFileFallback(srcStat, src, dest, opts);
}

function copyFileFallback(srcStat, src, dest, opts) {
  const BUF_LENGTH = 64 * 1024;
  const _buff = require("../util/buffer")(BUF_LENGTH);

  const fdr = fs.openSync(src, "r");
  const fdw = fs.openSync(dest, "w", srcStat.mode);
  let pos = 0;

  while (pos < srcStat.size) {
    const bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, _buff, 0, bytesRead);
    pos += bytesRead;
  }

  if (opts.preserveTimestamps)
    fs.futimesSync(fdw, srcStat.atime, srcStat.mtime);

  fs.closeSync(fdr);
  fs.closeSync(fdw);
}

function onDir(srcStat, destStat, src, dest, opts) {
  if (destStat === notExist) return mkDirAndCopy(srcStat, src, dest, opts);
  if (destStat && !destStat.isDirectory()) {
    throw new Error(
      `Cannot overwrite non-directory '${dest}' with directory '${src}'.`
    );
  }
  return copyDir(src, dest, opts);
}

function mkDirAndCopy(srcStat, src, dest, opts) {
  fs.mkdirSync(dest);
  copyDir(src, dest, opts);
  return fs.chmodSync(dest, srcStat.mode);
}

function copyDir(src, dest, opts) {
  fs.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
}

function copyDirItem(item, src, dest, opts) {
  const srcItem = path.join(src, item);
  const destItem = path.join(dest, item);
  const destStat = checkPaths(srcItem, destItem);
  return startCopy(destStat, srcItem, destItem, opts);
}

function onLink(destStat, src, dest, opts) {
  let resolvedSrc = fs.readlinkSync(src);

  if (opts.dereference) {
    resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
  }

  if (destStat === notExist) {
    return fs.symlinkSync(resolvedSrc, dest);
  } else {
    let resolvedDest;
    try {
      resolvedDest = fs.readlinkSync(dest);
    } catch (err) {
      // dest exists and is a regular file or directory,
      // Windows may throw UNKNOWN error. If dest already exists,
      // fs throws error anyway, so no need to guard against it here.
      if (err.code === "EINVAL" || err.code === "UNKNOWN")
        return fs.symlinkSync(resolvedSrc, dest);
      throw err;
    }
    if (opts.dereference) {
      resolvedDest = path.resolve(process.cwd(), resolvedDest);
    }
    if (isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(
        `Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`
      );
    }

    // prevent copy if src is a subdir of dest since unlinking
    // dest in this case would result in removing src contents
    // and therefore a broken symlink would be created.
    if (
      fs.statSync(dest).isDirectory() &&
      isSrcSubdir(resolvedDest, resolvedSrc)
    ) {
      throw new Error(
        `Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`
      );
    }
    return copyLink(resolvedSrc, dest);
  }
}

function copyLink(resolvedSrc, dest) {
  fs.unlinkSync(dest);
  return fs.symlinkSync(resolvedSrc, dest);
}

// return true if dest is a subdir of src, otherwise false.
function isSrcSubdir(src, dest) {
  const srcArray = path.resolve(src).split(path.sep);
  const destArray = path.resolve(dest).split(path.sep);
  return srcArray.reduce(
    (acc, current, i) => acc && destArray[i] === current,
    true
  );
}

function checkStats(src, dest) {
  const srcStat = fs.statSync(src);
  let destStat;
  try {
    destStat = fs.statSync(dest);
  } catch (err) {
    if (err.code === "ENOENT") return { srcStat, destStat: notExist };
    throw err;
  }
  return { srcStat, destStat };
}

function checkPaths(src, dest) {
  const { srcStat, destStat } = checkStats(src, dest);
  if (destStat.ino && destStat.ino === srcStat.ino) {
    //throw new Error('Source and destination must not be the same.')
  }
  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(
      `Cannot copy '${src}' to a subdirectory of itself, '${dest}'.`
    );
  }
  return destStat;
}

module.exports = copySync;
