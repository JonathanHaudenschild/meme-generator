import CanvasComponent from './CanvasComponent';
import Store from '../../redux/store';
const React = require('react');
require('./ImageComponent.css');

class ImageComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSignedIn: Store.getState().user.isSignedIn,
            downloadImageTrigger: false,
        }
        this.downloadImage = this.downloadImage.bind(this)
    }

    downloadImage(){
        this.setState(prevState => ({ downloadImageTrigger: !prevState.downloadImageTrigger }))
    }

    render() {
        //<img src={this.props.currentMeme.url} onError={i => i.target.src = ''} id="image-template" class="meme-template-image" />
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn }))
        return (
            <div class="image-view" id="center-container">
                <div class="image-container">
                    <h2 > {this.props.currentMeme.name} </h2>
                    <CanvasComponent currentImage={this.props.currentMeme} inputBoxes={this.props.inputBoxes} downloadImageTrigger = {this.state.downloadImageTrigger} />
                    <div className="button-view" >
                        <button onClick={this.generateMeme} id="generate-button" class="button" > Generate Meme with Imgflip </button>
                        {this.state.isSignedIn ?
                            <button onClick={this.saveMeme} id="save-button" class="button" > Save Meme </button> : <button class="button"> Sign in to save </button>}
                        <button onClick={() => this.downloadImage()} className="button">Download Meme!</button>
                    </div>
                </div>
            </div>)
    }
}

export default ImageComponent;