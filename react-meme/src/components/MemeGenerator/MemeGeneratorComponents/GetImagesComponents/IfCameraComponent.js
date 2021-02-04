import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
const React = require('react')
// This component enables the user to upload images from the local s
class IfUrlComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            isCamera: false,
            dataUri: '',
        }
        this.takePhoto = this.takePhoto.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.closeCamera = this.closeCamera.bind(this);
        this.handleTakePhoto = this.handleTakePhoto.bind(this);
    }

    takePhoto() {
        console.log(this.state.dataUri);
        this.setState({
            isPhoto: true,
        })

    }

    openCamera() {
        this.setState({
            isCamera: true,
            dataUri: '',
        })
    }


    closeCamera() {
        this.setState({
            isCamera: false,
            dataUri: '',
        })
    }

    handleTakePhoto(uri) {
        fetch(uri)
            .then(res => res.blob()).then(
                res => {
                    var tmpArr = [];
                    tmpArr.push({
                        id: 1,
                        name: 'Camera',
                        box_count: 2,
                        width: 400,
                        height: 400,
                        url: URL.createObjectURL(res),
                    })
                    this.props.setImagesArray(tmpArr, this.state.isFetching)
                })

        this.setState({
            dataUri: uri,
        })
    }


    render() {

        return (
            <div id="make-photo-container" >
                { (this.state.dataUri || !this.state.isCamera) ?
                    <div className="camera-container">
                        <img src={this.state.dataUri} className="sample-images" />
                    </div> :
                    <div className="camera-container">
                        <Camera
                            onTakePhoto={(dataUri) => { this.handleTakePhoto(dataUri); }}
                        />
                    </div>
                }
                {(this.state.isCamera) ?
                    <button id="open-camera-button" className="button" onClick={this.closeCamera}> Close Camera </button> :
                    <button id="open-camera-button" className="button" onClick={this.openCamera}> Open Camera </button>}
            </div>
        );
    }
}

export default IfUrlComponent