import ControlsComponent from './MemeGeneratorComponents/ControlsComponent';
import ImageComponent from './MemeGeneratorComponents/ImageComponent';
import TextUIComponent from './MemeGeneratorComponents/TextUIComponent';
import GenerateMemeComponent from './MemeGeneratorComponents/GenerateMemeComponent';
import { textToSpeech } from '../../utils/TextToSpeech'
import { authenticateUser } from './../../redux/action'
import { connect } from 'react-redux';
import TextBoxes from './TextBoxes';
import Store from './../../redux/store';
require('./MemeGenerator.css');
const React = require('react');

// Redux: AUTHENTICATE USER
function mapDispatchToProps(dispatch) {
  return {
    authenticateUser: user => dispatch(authenticateUser(user))
  };
}

const initializeText = {
  textID: 0,
  text: '',
  textPosX: 100,
  textPosY: 100,
  fontColor: '#ffffff',
  fontFamily: 'Impact',
  fontSize: '50',
  outlineWidth: '3',
  outlineColor: '#000000',
  isItalic: false,
  isBold: false,
  isVisible: true,
  start: 0,
  end: -1,
  duration: 1,
}


/**
 * Component which handles and displays the Meme Generator
 */
class MemeGenerator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      URL: 'http://localhost:3000',
      currentTemplate: '',
      inputBoxes: [],
      drawPaths: [],
      additionalImages: [],
      inputBoxesUpdated: false,
      tmpInputTextBoxesArray: [],
      canvasWidth: 0,
      canvasHeight: 0,
      memeCreationEvent: 0,
      memeVisibility: 2,
      maxImageSize: '',
      textToSpeechActive: false,
      dynamicBlob: null,
    }

    this.moveInputBox = this.moveInputBox.bind(this)
    this.handleInputBoxesChange = this.handleInputBoxesChange.bind(this);
    this.handleCanvasChange = this.handleCanvasChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addTextBoxes = this.addTextBoxes.bind(this);
    this.addAdditionalImages = this.addAdditionalImages.bind(this);
    this.addPath = this.addPath.bind(this);
    this.undoDrawing = this.undoDrawing.bind(this);
    this.clearDrawing = this.clearDrawing.bind(this);
    this.clearImages = this.clearImages.bind(this);
    this.createMeme = this.createMeme.bind(this);
    this.setDynamicBlob = this.setDynamicBlob.bind(this);

  }

  componentDidMount() {
    window.speechSynthesis.getVoices();
    this.props.authenticateUser({ username: localStorage.getItem('username'), email: localStorage.getItem('email'), accessToken: localStorage.getItem('token'), isSignedIn: true })

  }

  /**
   * 
   * @param {*} event 
   * @param {*} memeVisibility 
   * @param {*} maxImageSize 
   * Handle event triggers of the meme creation buttons
   * 
   */
  createMeme(event, memeVisibility, maxImageSize) {
    if (event === undefined)
      return;
    this.setState({
      memeCreationEvent: event,
      memeVisibility: memeVisibility,
      maxImageSize: maxImageSize,
    })
  }

  /**
   * retrieves Blob when a gif or video has been created
   */
  setDynamicBlob(blob) {
    this.setState({
      dynamicBlob: blob,
    })
  }

  /**
   * 
   * @param {Meme} currentMemeFromChild 
   * Sets current Meme
   */
  setCurrentMeme = (currentMemeFromChild) => {

    var wrh = currentMemeFromChild.width / currentMemeFromChild.height;
    var newWidth = currentMemeFromChild.width;
    var newHeight = currentMemeFromChild.height;
    var maxWidth = 500;
    var maxHeight = 500;
    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = newWidth / wrh;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = newHeight * wrh;
    }
    console.log(currentMemeFromChild)
    this.setState({
      currentTemplate: currentMemeFromChild,
      inputBoxes: currentMemeFromChild.inputBoxes,
      canvasWidth: newWidth,
      canvasHeight: newHeight,
      drawPaths: currentMemeFromChild.drawPaths,
      additionalImages: currentMemeFromChild.additionalImages,
    }, () => {
      var voices = window.speechSynthesis.getVoices();
      this.assignNewText2Textboxes(this.state.tmpInputTextBoxesArray)
      console.log(voices)
      textToSpeech(this.state.currentTemplate.name, voices[1], this.state.textToSpeechActive);
    })
  }

  /**
  * 
  * @param {array} textBoxesArray 
  * This function assigns input textboxes with values from an array which consists of input text box objects that were stored previously
  *  
  */
  assignNewText2Textboxes(textBoxesArray) {
    let inputBoxes = [...this.state.inputBoxes]
    inputBoxes.map(
      obj => {
        if (obj.text === '' && textBoxesArray[obj.textID] !== undefined) {
          return (Object.assign(obj, textBoxesArray[obj.textID]))
        } else {
          return obj;
        }
      }
    )
    this.setState({ inputBoxes })
  }


  /**
   * 
   * @param {*} path Array of position objects with x and y coordinates
   * Adds a new array of positions to the draw path arrau
   * 
   */
  addPath(path) {
    console.log(path)
    if (path.length > 0) {
      this.setState(prevState => ({
        drawPaths: [...prevState.drawPaths, path]
      }))
    }
  }

  /**
   *  Removes last added drawn path
   */
  undoDrawing() {
    let drawPaths = [...this.state.drawPaths];
    drawPaths.pop();
    this.setState({ drawPaths });
  }

  /**
   * Removes all drawn paths
   */
  clearDrawing() {
    this.setState({
      drawPaths: [],
    })
  }


  /**
   * 
   * @param {*} image
   * Add additional images
   *  
   */
  addAdditionalImages(image) {
    this.setState(prevState => ({
      additionalImages: [...prevState.additionalImages, image]
    }))
  }

  /**
   * Clear Additional Images
   */
  clearImages() {
    this.setState({
      additionalImages: [],
    })
  }


  /**
   * 
   * @param {*} event 
   * Handle changes in canvas setting such as height and width of canvas
   * 
   * 
   */
  handleCanvasChange(event) {
    console.log(parseInt(event.target.value))
    if (event.target.value !== '') {
      this.setState({ [event.target.name]: parseInt(event.target.value) })
    } else {
      this.setState({ [event.target.name]: 0 })
    }
  }

  /**
   *  Handle changes of additional Images 
   * */
  handleImageChange(image) {
    let additionalImages = [...this.state.additionalImages]
    Object.assign(this.state.additionalImages[image.id], image)
    this.setState({
      additionalImages
    })
  }

  /**
  * 
  * @param {number} i The index number of the text box
  * @param {Event} event The event name which is triggering this function
  * This function handles events whenever text, color or other settings of the text boxes are changed. 
  * The changed input boxes of the meme are updated and the current input box state is saved in an array in order to 
  * keep the data for future memes that the user might switch to
  * 
  */
  handleInputBoxesChange(i, event) {
    let inputBoxes = [...this.state.inputBoxes]
    let tmpInputTextBoxesArray = [...this.state.tmpInputTextBoxesArray]
    Object.assign(inputBoxes[i], { [event.target.name]: event.target.value })
    if (this.state.tmpInputTextBoxesArray[i] !== undefined) {
      Object.assign(tmpInputTextBoxesArray[i], { [event.target.name]: event.target.value })
    } else {
      tmpInputTextBoxesArray[i] = { [event.target.name]: event.target.value }
    }

    //Text To Speech
      var voices = window.speechSynthesis.getVoices();
      textToSpeech( event.target.value, voices[1], this.state.textToSpeechActive);
    this.setState({
      inputBoxes,
      tmpInputTextBoxesArray,
      inputBoxesUpdated: !this.state.inputBoxesUpdated,
    })
  }

  /**
   * 
   * @param {*} i 
   * @param {*} direction 
   * Gives the user to control the position of the text via voice
   * 
   */
  moveInputBox(i, direction){
    if(direction === 'up')
    this.handleInputBoxesChange(i, {target: {name: 'textPosY', value: parseInt(this.state.inputBoxes[i].textPosY) - 50}})
    if(direction === 'down')
    this.handleInputBoxesChange(i, {target: {name: 'textPosY', value: parseInt(this.state.inputBoxes[i].textPosY) + 50}})
    if(direction === 'right')
    this.handleInputBoxesChange(i, {target: {name: 'textPosX', value: parseInt(this.state.inputBoxes[i].textPosX) + 50}})
    if(direction === 'left')
    this.handleInputBoxesChange(i, {target: {name: 'textPosX', value: parseInt(this.state.inputBoxes[i].textPosX) - 50}})
  }

  /**
   * Adds a new Text Box
   */
  addTextBoxes() {
    this.setState(prevState => ({
      inputBoxes: [...prevState.inputBoxes, new TextBoxes(
        this.state.inputBoxes.length,
        initializeText.text,
        initializeText.textPosX,
        this.state.inputBoxes.length * initializeText.textPosY + 50,
        initializeText.fontColor,
        initializeText.fontFamily,
        initializeText.fontSize,
        initializeText.outlineWidth,
        initializeText.outlineColor,
        initializeText.isBold,
        initializeText.isItalic,
        initializeText.isVisible,
        initializeText.start,
        initializeText.end,
        initializeText.duration,
      )]
    }))
  }

  render() {
    Store.subscribe(() => this.setState({ textToSpeechActive: Store.getState().speech.textToSpeechActive}))
  
    // Redux: Update Signed in State
    return (
      <div className="generator-view">
        <ControlsComponent
          URL={this.state.URL}
          generateMeme={this.generateMeme}
          handleCanvasChange={this.handleCanvasChange}
          setCurrentMeme={this.setCurrentMeme}
          createMeme={this.createMeme}
          currentTemplate={this.state.currentTemplate}
          handleInputBoxesChange={this.handleInputBoxesChange}
          moveInputBox={this.moveInputBox}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight} />
        <ImageComponent
          generateMeme={this.generateMeme}
          currentTemplate={this.state.currentTemplate}
          inputBoxes={this.state.inputBoxes}
          inputBoxesUpdated={this.state.inputBoxesUpdated}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight}
          additionalImages={this.state.additionalImages}
          addAdditionalImages={this.addAdditionalImages}
          handleImageChange={this.handleImageChange}
          clearImages={this.clearImages}
          drawPaths={this.state.drawPaths}
          addPath={this.addPath}
          handleInputBoxesChange={this.handleInputBoxesChange}
          clearDrawing={this.clearDrawing}
          undoDrawing={this.undoDrawing}
          setDynamicBlob={this.setDynamicBlob}
        />
        <TextUIComponent
          handleInputBoxesChange={this.handleInputBoxesChange}
          currentInputBoxes={this.state.inputBoxes}
          setInputBoxes={this.setInputBoxes}
          addTextBoxes={this.addTextBoxes}
        />
        <GenerateMemeComponent
          URL={this.state.URL}
          inputBoxes={this.state.inputBoxes}
          drawPaths={this.state.drawPaths}
          additionalImages={this.state.additionalImages}
          memeCreationEvent={this.state.memeCreationEvent}
          memeVisibility={this.state.memeVisibility}
          maxImageSize={this.state.maxImageSize}
          currentTemplate={this.state.currentTemplate}
          canvasWidth={this.state.canvasWidth}
          canvasHeight={this.state.canvasHeight}
          dynamicBlob={this.state.dynamicBlob}
        />

      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(MemeGenerator);