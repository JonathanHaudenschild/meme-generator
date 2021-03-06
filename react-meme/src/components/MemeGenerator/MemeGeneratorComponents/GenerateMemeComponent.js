import Store from '../../../redux/store';
import { blobToBase64 } from '../../../utils/ImageUtils';
import { retrieveImage } from '../../../utils/CanvasUtils';
/**
 * react-share is a library which provides share buttons in addition to their respective icons of various platform. It allows us to
 * share links and content
 */
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    EmailIcon,
    TwitterIcon,
} from "react-share";
const React = require('react');

// This Component handles the actual meme generation - share, publish, drafts, templates
class GenerateMemeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            accessToken: null,
            isSignedIn: Store.getState().user.isSignedIn,
            shareURL: '',
        }
    }

    componentDidMount() {
        Store.subscribe(() => this.setState({ isSignedIn: Store.getState().user.isSignedIn, accessToken: Store.getState().user.accessToken }))

    }

    /**
     * 
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState) {

        // Checks for button presses
        if (this.props.memeCreationEvent !== prevProps.memeCreationEvent) {
            if (this.props.memeCreationEvent.target.name === "imgFlipGenerate") {
                this.generateMemeImageFlip();
            }
            if (this.props.memeCreationEvent.target.name === "download") {
                this.downloadImage();
            }
            if (this.props.memeCreationEvent.target.name === "publish") {
                this.publishMeme()
            }
            if (this.props.memeCreationEvent.target.name === "save") {
                this.saveDraft();
            }
            if (this.props.memeCreationEvent.target.name === "share") {
                this.shareMeme();
            }
        }
    }

    /**
     * Handles download image button presses via a boolean that is passed to the child
     */
    downloadImage() {
        retrieveImage('all', this.props.canvasWidth, this.props.canvasHeight, parseInt(this.props.maxImageSize) * 1000, 1).then((imageData) => {
            let canvasdata = imageData.replace("image/png", "image/octet-stream");
            const a = document.createElement("a");
            a.download = this.props.currentTemplate.name + '.png';
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        })
    }

    publishMeme() {
        this.publishImage();
    }

    /**
     * Publishes the meme depending on the format of the file
     */
    publishImage = () => {
        return new Promise((resolve, reject) => {

            if (this.props.currentTemplate.formatType === 'image') {
                retrieveImage('all', this.props.canvasWidth, this.props.canvasHeight, parseInt(this.props.maxImageSize) * 1000, 1).then((imageData) => {
                    console.log(imageData)
                    this.sendCreatedMemeToServer(imageData).then(result => {
                        console.log(result)
                        resolve(result)
                    })
                })
            } else if (this.props.currentTemplate.formatType === 'video' || this.props.currentTemplate.formatType === 'gif') {
                console.log(this.props.dynamicBlob)
                blobToBase64(this.props.dynamicBlob).then((objData) => {
                    this.sendCreatedMemeToServer(objData).then(result => {
                        console.log(result)
                        resolve(result)
                    })
                })
            }
        })
    }

    /**
     * 
     * @param {*} data
     * Sends the base 64 data in an object to the server
     *  
     */
    sendCreatedMemeToServer = (data) => {
        return new Promise((resolve, reject) => {
            var object2Publish = {};
            object2Publish.title = this.props.currentTemplate.name;
            object2Publish.memeTemplate = this.props.currentTemplate;
            object2Publish.base64 = data;
            object2Publish.visibility = this.props.memeVisibility;


            console.log(object2Publish)
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.state.accessToken
                },
                body: JSON.stringify(object2Publish)
            };
            fetch(this.props.URL + '/memes/publishMeme', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log(data)
                    resolve(data);
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
        })
    }

    /**
     * Sends a Post request to the server with the current meme state and etc
     */
    saveDraft() {
        retrieveImage('background', this.props.canvasWidth, this.props.canvasHeight, -1, 1).then((imageData) => {
            var object2Save = {};
            object2Save.title = this.props.currentTemplate.name;
            object2Save.currentMeme = this.props.currentTemplate;
            object2Save.base64 = imageData;
            object2Save.inputBoxes = this.props.inputBoxes;
            object2Save.drawPaths = this.props.drawPaths;
            console.log(this.props.additionalImages);
            object2Save.additionalImages = this.props.additionalImages;

            console.log(object2Save)

            // POST request using fetch with error handling

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.state.accessToken
                },
                body: JSON.stringify(object2Save)
            };
            fetch(this.props.URL + '/drafts/savedraft', requestOptions)
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
                    alert(error)
                    console.error('There was an error!', error);
                });
        })
    }


    /**
     * Creates a shareable link
     */
    shareMeme() {
        console.log("share")
        this.publishImage().then(data => {
            console.log(data)
            const url = 'http://localhost:3006/meme/' + data.memeId;
            //  const url = 'http://github.com'
            console.log(url)
            this.setState({
                shareURL: url
            })
        });
    }

    /**
     * 
     * Sends Post request to server with enough data to generate a meme via image flip and open another tab which displays the meme
     * 
     */
    generateMemeImageFlip() {
        var object2Generate = {};
        object2Generate.id = this.props.currentTemplate.id;
        object2Generate.inputBoxes = this.props.inputBoxes

        console.log(object2Generate)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object2Generate)
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
                window.open(tmp.url, "_blank")


            })
            .catch(error => {
                this.setState({
                    errorMessage: error.toString()
                });
                console.error('There was an error!', error);
            });
    }

    // Only render share buttons
    render() {
        return <div>
            <div id="share" className="modal-window">
                <div>
                    <a href="/#" title="Close" id="share-window-close" className="modal-close">Close</a>
                    <FacebookShareButton
                        url={this.state.shareURL}
                        quote={this.props.currentTemplate.name}
                        className="share-button"
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <EmailShareButton
                        url={this.state.shareURL}
                        body={"Share Now"}
                        subject={this.props.currentTemplate.name}
                        className="share-button"
                    >
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                    <TwitterShareButton
                        url={this.state.shareURL}
                        title={this.props.currentTemplate.name}
                        className="share-button"
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>
            </div>
        </div>
    }
}
export default GenerateMemeComponent;