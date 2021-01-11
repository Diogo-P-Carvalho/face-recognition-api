import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '598c4e1089a84886a1140d51257b9f96'
});

export const handleClarifaiApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(error => res.status(400).json('unable to work with API'))
}