import numpy as np

class Perceptron:
    """
    Perceptron classifier.
    Parameters
    ------------
    eta : float
    Learning rate (between 0.0 and 1.0)
    n_iter : int
    Passes over the training dataset.
    random_state : int
    Random number generator seed for random weight
    initialization.
    Attributes
    -----------
    w_ : 1d-array
    Weights after fitting.
    b_ : Scalar
    Bias unit after fitting.
    errors_ : list
    Number of misclassifications (updates) in each epoch.
    """
    def __init__(self, eta=0.01, n_iter=10, random_state=1):
        self.eta = eta
        self.n_iter = n_iter
        self.random_state = random_state

    def fit(self, X, y) -> 'Perceptron':
        self.initialize_weights_and_bias(weight_shape=X.shape[1])
        self.errors_ = []

        for _ in range(self.n_iter):
            errors = 0
            """
                X: [
                    [5.1, 2.3],
                    ...
                ]
                y: [0, 1, 0, 0, 1]


                xi: [5.1, 2.3]
                target: 0/1
            """
            for xi, target in zip(X, y):
                delta = self.eta * (target - self.predict(xi))
                self.w_ += delta * xi  # Update weights
                self.b_ += delta       # Update bias
                errors += int(delta != 0.0)
            self.errors_.append(errors)
            
        return self
    
    def initialize_weights_and_bias(self, weight_shape ):
        rgen = np.random.RandomState(self.random_state)
        self.w_ = rgen.normal(loc=0.0, scale=0.01, size=weight_shape)
        self.b_ = np.float64(0.)

    def predict(self, X):
        return self.threshold_function(X)

    def net_z(self, X: np.ndarray) -> np.float32:
        return np.dot(X, self.w_) + self.b_  # Use bias separately
    
    def threshold_function(self, X):
        return np.where(self.net_z(X) >= 0.0, 1, 0)
