// Meme Class
class Meme {
    constructor(url, id, width, height, name, boxCount, inputBoxes, drawPaths, additionalImages, formatType, statistics) {
      this.url = url;
      this.id = id;
      this.width = width;
      this.height = height;
      this.name = name;
      this.boxCount = boxCount;
      this.inputBoxes = inputBoxes;
      this.drawPaths = drawPaths;
      this.additionalImages = additionalImages;
      this.formatType = formatType;
      this.statistics = statistics;
    }
  }

  export default Meme