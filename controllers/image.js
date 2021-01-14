import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: process.env.API_CLARIFAI
});

export const handleClarifaiApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(error => res.status(400).json('unable to work with API'))
}