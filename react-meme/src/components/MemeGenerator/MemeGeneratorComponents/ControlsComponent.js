import GetImagesComponents from './GetImagesComponent';
const React = require('react');
require('./ControlsComponent.css');

class ControlsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      imageMemeArray: null,
      index: 0,
      searchText: '',
      titleText: '',
    };

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.searchTemplate = this.searchTemplate.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.updateText = this.updateText.bind(this);
    this.createUI = this.createUI.bind(this);
    this.generateMemeButton = this.generateMemeButton.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.addTextBoxes = this.addTextBoxes.bind(this);
  }

  /**
   * 
   * @param {Array of Meme Objects} memeArray 
   * Called whenever a new source of images are loaded. 
   * Initializes the new array of meme objects and stores them in a state
   * 
   */
  setImagesArray = (memeArray) => {
    this.setState({
      imageMemeArray: memeArray,
      index: 0,
    }, () => this.resetMemeState())

  }


  /**
   * 
   * @param {number} index The index of the target meme
   * Creates a new Meme state: Called whenever the user changes the meme template
   * 
   */
  setCurrentMemeState(index) {
    if (this.state.imageMemeArray !== undefined && this.state.imageMemeArray !== null) {
      this.setState({
        index: index,
      }, () => {
        this.props.setCurrentMeme(this.state.imageMemeArray[this.state.index]);
        //this.props.setInputBoxes(this.state.imageMemeArray[this.state.index].inputBoxes);
      })
    }
  }

  /**
   * resets meme index to 0
   */
  resetMemeState() {
    this.setCurrentMemeState(0);
  }


  /**
   * 
   * @param {number} step How large a step is 
   * If the user wants an adjacent template, the step would be 1
   * 
   */
  setNewIndexWithStep(step) {
    try {
      var newIndex = (this.state.index + step + (this.state.imageMemeArray.length)) % (this.state.imageMemeArray.length);
      this.setCurrentMemeState(newIndex);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Previous and next buttons
   */
  prevButton() {
    this.setNewIndexWithStep(-1)
  }
  nextButton() {
    this.setNewIndexWithStep(1)
  }


  /**
   * This function is called whenever the user wants to search for a template
   */
  searchTemplate() {
    for (var i = 0; i < this.state.imageMemeArray.length; i++) {
      if (this.state.imageMemeArray[i].name.toLowerCase().includes(this.state.searchText.toLowerCase())) {
        console.log("found " + i)
        this.setCurrentMemeState(i)
      }
    }
  }

  /**
   * This function is called whenever the user wants to change the title
   */
  changeTitle() {
    this.state.imageMemeArray[this.state.index].name = this.state.titleText;
    this.props.setCurrentMeme(this.state.imageMemeArray[this.state.index])
  }

  /**
  *  Handles text inputs from search & title change
  */
  updateText(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  /**
   * 
   * @param {number} i The index number of the text box
   * @param {Event} event The event which is triggering this function
   * This function passes the index, event name and event value to the Meme Generator Component, which then handles the change of the input boxes
   * 
   */
  handleChange(i, event) {
    this.props.handleInputBoxesChange(i, event.target.name, event.target.value);
  }

  /**
   *  This function adds input boxes dynamically.
   *  It adds as many text boxes as defined by the meme object.
   * 
   */
  createUI() {
    if (this.state.imageMemeArray !== null) {
      return this.props.currentInputBoxes.map((el, i) =>
        <div key={i}>
          <input type="text" placeholder="Text" name="text" value={this.props.currentInputBoxes[i].text} className="input-box" onChange={this.handleChange.bind(this, i)} />
          <input type="text" placeholder="50" name="fontSize" value={this.props.currentInputBoxes[i].fontSize} className="number-input-box" min="1" max="100" maxLength="2" onChange={this.handleChange.bind(this, i)} />
          <select name="fontFamily" className="input-box" value={this.props.currentInputBoxes[i].fontFamily} onChange={this.handleChange.bind(this, i)}>
            <option value="Impact">Impact</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier">Courier</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input type="color" name="fontColor" className="color-input-box" value={this.props.currentInputBoxes[i].fontColor} onChange={this.handleChange.bind(this, i)} />
          <input type="text" placeholder="3" name="outlineWidth" value={this.props.currentInputBoxes[i].outlineWidth} className="number-input-box" min="1" max="20" onChange={this.handleChange.bind(this, i)} />
          <input type="color"  name="outlineColor" value={this.props.currentInputBoxes[i].outlineColor} className="color-input-box" onChange={this.handleChange.bind(this, i)} />
          <input type="number" placeholder="200" name="textPosX" value={this.props.currentInputBoxes[i].textPosX} className="dimension-input-box" min="1" max={this.state.imageMemeArray[this.state.index].width} maxLength="2" onChange={this.handleChange.bind(this, i)} />
          <input type="number" placeholder="200" name="textPosY" value={this.props.currentInputBoxes[i].textPosY} className="dimension-input-box" min="1" max={this.state.imageMemeArray[this.state.index].height} maxLength="2" onChange={this.handleChange.bind(this, i)} />
        </div>)
    } else {
      return;
    }
  }

  addTextBoxes() {
    this.props.addTextBoxes();
  }


  //Generate Meme Button
  generateMemeButton() {
    this.props.generateMeme();
  }

  render() {
    return (
      <div id="control-view">
        <div className="inner-grid" id="left-container">
          <h1 id="header-text"> Meme Generator </h1>
          <div id="select-img-buttons">
            <GetImagesComponents setImagesArray={this.setImagesArray} URL={this.props.URL} />
          </div>
          <input type="text" name="searchText" id="search-text-box" class="input-box" onChange={this.updateText} />
          <button id="search-button" class="button" onClick={this.searchTemplate}> Search </button>
          <button onClick={this.prevButton} id="prev-button" className="button" > Back </button>
          <button onClick={this.nextButton} id="next-button" className="button" > Next </button>
          <button onClick={this.generateMemeButton} id="generate-button" className="button" > Generate</button>
        </div>
        <p>Insert text below </p>
        <input type="text" name="titleText" className="input-box" onChange={this.updateText} />
        <button id="change-title-button" class="button" onClick={this.changeTitle}> Change Meme Title </button>
        <div id="ui-buttons-description"> <div>Text</div><div>Font Size</div><div>Font Family</div><div>Font Color</div><div>Outline Width</div><div>Outline Color</div><div>Pos X</div><div>Pos Y</div></div>
        <div id="ui-buttons"> {this.createUI()}</div>
        <button onClick={this.addTextBoxes} id="add-textboxes-button" className="button" > Add Text </button>
      </div>
    )
  }
}

export default ControlsComponent;