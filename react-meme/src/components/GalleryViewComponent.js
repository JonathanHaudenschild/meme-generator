import upvote from '../pictures/upvote.png'
import downvote from '../pictures/downvote.png'
import share from '../pictures/share.png'
import download from '../pictures/download.png'
import Store from '../redux/store';
const React = require('react');
require('./GalleryViewComponent.css');

class GalleryViewComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allMemes: [],
            //comments: this.props.location.meme.comments,
            //currentmeme: this.props.location.meme,
            currentMeme: {},
            title: "",
            index: this.props.location.index,
            accessToken: Store.getState().user.accessToken, 
        }
    }

    componentDidMount(){
        this.getAllMemes()                
    }


    /**
     * Memes Array sorted by time of creation
     * reused -> here with Promise
     */
    getAllMemes(){
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/memes/browsememes')
            .then(async response => {
                const data = await response.json();
                resolve(data)
                //console.log("data: " + JSON.stringify(data))
                this.setState({allMemes: data, title: data[0].title}, () => this.setInfo())
        
            }).catch(error => {
            console.log(error);
            });
        });
    }

    /**
     * change Meme info on the basis of where the user comes from 
     * browse sends an index to GalleryViewComponent -> if the user does not come from browse there is no index -> normal order
     */
    setInfo(){
        if(this.state.currentMeme !== {}){
            if(this.state.index !== undefined){
                this.setState({currentMeme: this.state.allMemes[this.state.index]})
            }
            else{
                //this.setState({index: 0})
                this.setState({index: 0, currentMeme: this.state.allMemes[0]})
            }
            console.log("setInfo currentMeme " + JSON.stringify(this.state.currentMeme))
        }
    }

    numberOfComments() {
        if (this.state.currentMeme.comments != undefined) {
            return this.state.currentMeme.comments.length
        }
        else {
            return 0
        }
    }


    showComments(){
        console.log("comments: "+ JSON.stringify(this.state.currentMeme.comments))
        
        if(this.state.currentMeme.comments !== undefined){
            return(
                this.state.currentMeme.comments.map((object)=> (
                <div>
                    <div className= "comments_user-date_container">
                        <div className="comment_username">{object.userId}</div>
                        <div className="date">{object.date}</div>
                    </div>
                
                {object.text}
                </div>))
            )
        }
    }

    sendComment(){
        var comment2Publish = {};
                comment2Publish.memeId = this.state.currentMeme._id;;
                //comment2Publish.userId = 
                comment2Publish.comment = document.querySelector(".input-text").value;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.state.accessToken
            },
            body: JSON.stringify(comment2Publish)
        };
        fetch('http://localhost:3000/memes/comment', requestOptions)
            .then(async response => {
                const data = await response.json();
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    /**
     * after > was clicked
     */
    goRight(){
        var myIndex = this.state.index
        //start over if last meme in array is reached -> example: array with 3 memes, end =2 -> (2+1+3) % 3 = 0
        var newIndex = (myIndex + 1 + this.state.allMemes.length) % this.state.allMemes.length
        this.setState({index: newIndex, currentMeme: this.state.allMemes[newIndex]})
    }

    /**
     * after < was clicked
     */
    goLeft(){
        var myIndex = this.state.index
        //start over from end of array if first meme is reached -> example: array with 3 memes, end =2 -> (0-1+3) % 3 = 2
        var newIndex = (myIndex - 1 + this.state.allMemes.length) % this.state.allMemes.length
        this.setState({index: newIndex, currentMeme: this.state.allMemes[newIndex]})
    }



    render() {
        
        return (
            <div className="gallery_container">
            <button className="myButton" onClick={() => this.goLeft()}>&lsaquo;</button>
            <div className= "g_container">
                <div className="left_container">
                    <div className= "g_user-date_container">
                        <p className="username">Username</p>
                        <p className="date">{this.state.currentMeme.dateCreated}</p>
                    </div>
                    <div className= "g_above-image_container">
                        <h1 className="g_image-titel">{this.state.currentMeme.title}</h1>
                        <div className="g_options-top_container">
                            <div className="g_share-download">
                                <button className="option-button"> <img src= {download} className="icon"/> </button>
                                <button className="option-button"> <img src= {share} className="icon"/> </button>
                            </div>
                        </div>
                    </div>
                    <div className="g_image_container">
                        <img src= {this.state.currentMeme.base64} className="image" />
                    </div>
                    <div className="g_points-commits">
                        <p className= "voting-point">Points:  {this.state.currentMeme.upvotes - this.state.currentMeme.downvotes}</p>
                        <p className= "voting-point">Comments: {this.numberOfComments()}</p>
                    </div>
                    <div className="g_option_container">
                        <button className="option-button"><img src= {upvote} className="icon" /></button>
                        <button className="option-button"><img src= {downvote} className="icon" /></button>
                    </div>    
                </div>    

                <div className="right_container">
                    <div className="g_comments">
                        <input className="input-text" placeholder="Leave a comment"/>
                        <button className="send" onClick={() => this.sendComment()}>Send</button>
                        <div className="commets_container"></div>
                    </div>
                    {this.showComments()}
                </div>
                
            </div>
            <button className="myButton" onClick={() => this.goRight()}>&rsaquo;</button>
            </div>
        );
    }
}
    
    
    
    
export default GalleryViewComponent;