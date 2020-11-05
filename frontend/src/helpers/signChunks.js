export default function loading(file, callbackProgress, callbackFinal) {
  let chunkSize = 1024 * 1024; // bytes
  let offset = 0;
  let size = chunkSize;
  let partial;
  let index = 0;
  let lastOffset = 0;
  let chunkTotal = 0;
  let previous = [];
  let chunkReorder = 0;

  if (file.size === 0) {
    callbackFinal();
  }
  while (offset < file.size) {
    partial = file.slice(offset, offset + size);
    let reader = new FileReader();
    reader.size = chunkSize;
    reader.offset = offset;
    reader.index = index;
    reader.onload = function (evt) {
      callbackRead_buffered(reader, file, evt, callbackProgress, callbackFinal);
    };
    reader.readAsArrayBuffer(partial);
    offset += chunkSize;
    index += 1;
  }
  function callbackRead_buffered(
    reader,
    file,
    evt,
    callbackProgress,
    callbackFinal
  ) {
    chunkTotal++;

    if (lastOffset !== reader.offset) {
      // out of order
      console.log(
        "[",
        reader.size,
        "]",
        reader.offset,
        "->",
        reader.offset + reader.size,
        ">>buffer"
      );
      previous.push({
        offset: reader.offset,
        size: reader.size,
        result: reader.result,
      });
      chunkReorder++;
      return;
    }

    function parseResult(offset, size, result) {
      lastOffset = offset + size;
      callbackProgress(result);
      if (offset + size >= file.size) {
        lastOffset = 0;
        callbackFinal();
      }
    }

    // in order
    console.log(
      "[",
      reader.size,
      "]",
      reader.offset,
      "->",
      reader.offset + reader.size,
      ""
    );
    parseResult(reader.offset, reader.size, reader.result);

    // resolve previous buffered
    var buffered = [{}];
    while (buffered.length > 0) {
      buffered = previous.filter(function (item) {
        return item.offset === lastOffset;
      });
      buffered.forEach(function (item) {
        console.log(
          "[",
          item.size,
          "]",
          item.offset,
          "->",
          item.offset + item.size,
          "<<buffer"
        );
        parseResult(item.offset, item.size, item.result);
        remove(previous, item);
      });
    }
  }
}

function remove(arr, item) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
}
