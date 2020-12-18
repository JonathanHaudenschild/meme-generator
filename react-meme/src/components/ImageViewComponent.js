const React = require('react');
const {
  default: ResultComponent
} = require('./ResultComponent');
require('./ImageViewComponent.css');


class ImageViewComponent extends React.Component {

  constructor(props) {
    super(props);

    // Init state
    this.state = {
      currentMeme: '',
      // Index of array
      index: 0,

      //Handle inputTextBoxes
      inputBoxes: [
        {
          textID: '',
          text: '',
          color: '',
        }
      ],
    }

    // Binds
    this.prevButton = this.prevButton.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.setCurrentMemeState = this.setCurrentMemeState.bind(this);
    this.searchImage = this.searchImage.bind(this);
    this.createUI = this.createUI.bind(this);
  }

  // Initialize
  componentDidMount() {
    this.setCurrentMemeState(0);
  }

  // Set Current Meme State
  setCurrentMemeState(step) {
    var newIndex = this.state.index + step
    var newInputBoxesArray = [];

    for (var i = 0; i < this.props.samplesMemeArray[newIndex].box_count; i++) {
      newInputBoxesArray.push({ textID: i, text: '', color: '' });
    }

    this.setState({
      currentMeme: this.props.samplesMemeArray[newIndex],
      index: (newIndex + (this.props.samplesMemeArray.length)) % (this.props.samplesMemeArray.length),
      inputBoxes: newInputBoxesArray,
    })
  }

  // Previous Button
  prevButton() {
    this.setCurrentMemeState(-1)
  }

  // Next Button
  nextButton() {
    this.setCurrentMemeState(1)
  }

  // Search Function
  searchImage() {
    for (var i = 0; i < this.props.samplesMemeArray.length; i++) {
      if (this.props.samplesMemeArray[i].name.toLowerCase().includes(document.getElementById('searchText').value.toLowerCase())) {
        console.log("found")
        this.setCurrentMemeState(i);
      }
    }
  }

  // Add Input Boxes (Text & Color) depending on the meme boxcount
  createUI() {
    return this.state.inputBoxes.map((el, i) =>
      <div key={i}>
        <input type="text" onChange={this.handleChange.bind(this, i)} />
        <input type="color" onChange={this.handleChange.bind(this, i)} />
      </div>)
  }

  // Handle Events when Text or Color Input changed and store it in the inputBoxesStates
  handleChange(i, event) {
    this.setState(prevState => ({
      inputBoxes: prevState.inputBoxes.map(
        obj => (obj.textID === i ? Object.assign(obj, { [event.target.type]: event.target.value }) : obj)
      )
    }));
  }

  // Render
  render() {
    return (<div>
      <div>
        <input type="text" id="searchText" />
        <button id="searchButton" onClick={this.searchImage}> Search </button>
      </div>

      <div className="Create" >
        <div id="slideShowImages" >
          <h2 > {this.state.currentMeme.name} </h2>

          <div className="imageNumber" > </div>
          <img src={this.state.currentMeme.url}
            alt="Target" />
        </div>

        <button onClick={this.prevButton} id="prevButton" > ❮ </button>
        <button onClick={this.nextButton} id="nextButton" > ❯ </button>

        <div id="dynamicInput">
          {this.createUI()}
        </div>

        <div id="inputText" > </div>
        <div id="inputColor" > </div>
      </div>
      <ResultComponent URL={this.props.URL} currentMeme={this.state.currentMeme} inputBoxes={this.state.inputBoxes}/> </div>
    )
  }
}

export default ImageViewComponent;