class AnalysisController {
    constructor(speechService) {
        this.speechService = speechService;
    }

    async processSpeech(req, res) {
        try {
            const { speechInput } = req.body;
            const transcript = await this.speechService.generateTranscript(speechInput);
            const grammarAnalysis = await this.speechService.analyzeGrammar(transcript);
            const sentimentAnalysis = await this.speechService.analyzeSentiment(transcript);

            const feedback = {
                transcript,
                grammar: grammarAnalysis,
                sentiment: sentimentAnalysis,
                score: this.calculateScore(grammarAnalysis, sentimentAnalysis)
            };

            res.status(200).json(feedback);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while processing the speech.' });
        }
    }

    calculateScore(grammarAnalysis, sentimentAnalysis) {
        // Example scoring logic based on grammar and sentiment analysis
        const grammarScore = grammarAnalysis.correctnessScore || 0;
        const sentimentScore = sentimentAnalysis.sentimentScore || 0;
        return (grammarScore + sentimentScore) / 2; // Average score
    }
}

export default AnalysisController;