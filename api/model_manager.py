import logging

logger = logging.getLogger(__name__)

# Verified free models on OpenRouter
FREE_MODELS = [
    "google/gemma-4-31b-it:free",
    "liquid/lfm-2.5-2.6b:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "openrouter/free"
]

class ModelManager:
    def __init__(self, limit=50):
        self.request_limit = limit
        self.current_model_index = 0
        self.request_count = 0
        self.models = FREE_MODELS
        
    def get_current_model(self):
        return self.models[self.current_model_index]
        
    def increment_and_check_rotation(self):
        """Increments request count. If limit reached, rotates to next model."""
        self.request_count += 1
        if self.request_count >= self.request_limit:
            self.rotate_model("Limit reached")

    def rotate_model(self, reason=""):
        """Rotates to the next model and resets the request count."""
        old_model = self.models[self.current_model_index]
        self.current_model_index = (self.current_model_index + 1) % len(self.models)
        self.request_count = 0
        new_model = self.models[self.current_model_index]
        logger.info(f"Rotated model from {old_model} to {new_model}. Reason: {reason}")
        
    def fallback_to_next_model(self):
        """Used when a model fails (e.g. 503, 429). Instantly switches to the next."""
        self.rotate_model("Fallback due to API error")
        return self.get_current_model()

# Singleton instance
model_manager = ModelManager()
