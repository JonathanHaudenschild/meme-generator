
window.addEventListener('DOMContentLoaded', function () {
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');

    const URL = "https://api.imgflip.com/get_memes";

    var request = new XMLHttpRequest();

    fetch(URL)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) {
            let memes = data.data.memes

            const numberOfImages = () => memes.length;
            // this is a counter that holds the id / number of the currently displayed image.
            let currentImageID = 1;

            /**
             * shows the image by giving it the 'current' class
             * the CSS in the <style> block above specifies that only the slides
             * with the .current class are shown, the rest has display: none
             *
             * @param number {Number} id of the image.
             */


            function showImage(number) {
                let meme = memes[number]
                document.getElementById('slideShowImages').innerHTML = ''
                document.getElementById('slideShowImages').append(renderImage(meme.url, meme.width, meme.height, meme.name))

                console.log(`showing image ${number}`)
            }

            function renderImage(url, width, height, name) {
                const figure = document.createElement('figure');
                figure.className = "slidecurrent";
                const newImage = document.createElement('img');
                newImage.src = url;
                newImage.width = width;
                newImage.height = height;
                const figCaption = document.createElement('figcaption');
                figCaption.innerHTML = `${name}   ${url}`;

                figure.appendChild(newImage);
                figure.appendChild(figCaption);

                return figure
            }



            backButton.addEventListener('click', function () {
                currentImageID = currentImageID == 0 ? numberOfImages() - 1 : currentImageID - 1;
                showImage(currentImageID);
            });
            nextButton.addEventListener('click', function () {
                currentImageID = currentImageID == numberOfImages() - 1 ? 0 : currentImageID + 1;
                showImage(currentImageID);
            });

            /**
            (re)loads the images for the current filter config
            */
            function loadImageUrls() {
                // TODO load meme template images from the Imgflip API
                showImage(0)
            }

            loadImageUrls();

        })
});

function generateMeme() {
    const url = "https://api.imgflip.com/caption_image";
    fetch(url, {
        method: "POST",
        body: new FormData(document.getElementById("inputform")),
        // -- or --
        // body : JSON.stringify({
        // user : document.getElementById('user').value,
        // ...
        // })
    }).then(
        response => response.text() // .json(), etc.
        // same as function(response) {return response.text();}
    ).then(
        html => console.log(html)
    );
}