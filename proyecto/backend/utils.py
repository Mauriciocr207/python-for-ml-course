import tensorflow as tf
import os
import sys

def load_model() -> tf.keras.Model:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "models", "model.keras")
    model = tf.keras.models.load_model(model_path)

    return model