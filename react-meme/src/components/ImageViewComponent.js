import ControlsComponent from './ImageViewComponents/ControlsComponent';
import ImageComponent from './ImageViewComponents/ImageComponent';
import PreviewComponent from './PreviewComponent';
import Store from '../redux/store';
const React = require('react');
require('./ImageViewComponent.css');


// This component handles the current Meme State and all surver communication
class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      currentMeme: '',
      generatedMeme: '',
      // Index of array
      index: 0,

      isSignedIn: Store.getState().user.isSignedIn,

      //Handle inputTextBoxes
      inputBoxes: [
        {
          textID: '',
          text: '',
          color: '#000000',
        }
      ],
    }

    // Binds
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.saveMeme = this.saveMeme.bind(this);
  }

  // Initialize
  componentDidMount() {
    this.setCurrentMemeState(0);
  }

  // Set Current Meme State with index
  setCurrentMemeState(index) {
    var newInputBoxesArray = [];
    for (var i = 0; i < this.props.samplesMemeArray[index].box_count; i++) {
      // Check if box is undefined
      if (this.state.inputBoxes[i] !== undefined) {
        newInputBoxesArray.push({ textID: i, text: this.state.inputBoxes[i].text, color: this.state.inputBoxes[i].color });
      } else {
        newInputBoxesArray.push({ textID: i, text: '', color: '#000000' });
      }
    }

    this.setState({
      currentMeme: this.props.samplesMemeArray[index],
      index: index,
      inputBoxes: newInputBoxesArray,
    })
  }

  // Handle Events when Text or Color Input changed and store it in the inputBoxesStates
  handleChange(i, event) {
    this.setState(prevState => ({
      inputBoxes: prevState.inputBoxes.map(
        obj => (obj.textID === i ? Object.assign(obj, { [event.target.type]: event.target.value }) : obj)
      )
    }));
  }



  //Generate Meme
  generateMeme() {

    // POST request using fetch with error handling
    var memeObject = {};
    memeObject.id = this.state.currentMeme.id;
    memeObject.inputBoxes = this.state.inputBoxes

    console.log(memeObject)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memeObject)
    };
    fetch(this.props.URL + '/memes/generateMeme', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(data);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        var tmp = {};
        tmp.url = data.data.url;


        this.setState({
          generatedMeme: tmp,
        })
      })
      .catch(error => {
        this.setState({
          errorMessage: error.toString()
        });
        console.error('There was an error!', error);
      });
  }

  // Save Meme / Send to server
  saveMeme() {
    // POST request using fetch with error handling
    console.log(this.state.generatedMeme + "access Token: " + this.props.accessToken)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.generatedMeme)
    };
    fetch(this.props.URL + '/memes/saveMeme', requestOptions)
      .then(async response => {
        const data = await response.json();
        console.log(data);
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .catch(error => {
        this.setState({
          errorMessage: error.toString()
        });
        console.error('There was an error!', error);
      });
  }

  // Render
  render() {
    // Redux: Update Signed in State
    Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))

    return (
      <div class="generator-view">
        <div class="outer-container">
          <ControlsComponent URL={this.state.URL} inputBoxes={this.state.inputBoxes} index={this.state.index} samplesMemeArray={this.props.samplesMemeArray} setCurrentMemeState={newIndex => this.setCurrentMemeState(newIndex)} generateMeme={() => this.generateMeme()} handleChange={(i) => this.handleChange.bind(this, i)} />
          <ImageComponent currentMeme={this.state.currentMeme} inputBoxes={this.state.inputBoxes} />

          <div class="image-view" id="right-container">
            <h2 id="generated-title"> Generated Image: {this.state.generatedName}</h2>
            <div className="image-display" >
              <img src={this.state.generatedMeme.url} onError={i => i.target.src = ''} alt="Generated" id="image-template" /></div>
            <div className="button-view" >
              {this.state.isSignedIn ?
                <button onClick={this.saveMeme} id="save-button" class="button" > Save Meme </button> : <button class="button"> Sign in to save! </button>}

            </div>
          </div >
        </div>

        <PreviewComponent samplesMemeArray={this.props.samplesMemeArray} indexPos={this.state.index} setCurrentMemeState={this.setCurrentMemeState} />
      </div>
    )
  }
}

export default ImageViewComponent;