function setRoutes(app) {
    const analysisController = require('../controllers/analysisController');

    app.post('/api/analyze-speech', analysisController.analyzeSpeech);
    app.get('/api/feedback/:id', analysisController.getFeedback);
}

module.exports = setRoutes;