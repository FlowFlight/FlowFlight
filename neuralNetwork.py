import numpy as np

class NeuralNetwork:
    def __init__(self, learning_rate):
        self.weights = np.array([np.random.randn(), np.random.randn(), np.random.randn()])
        self.bias = np.random.randn()
        self.learning_rate = learning_rate

    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def _sigmoid_deriv(self, x):
        return self._sigmoid(x) * (1 - self._sigmoid(x))

    def predict(self, input_vector_array) -> list[float]:
        predictions_array = []
        for input_vector in input_vector_array:
            layer_1 = np.dot(input_vector, self.weights) + self.bias
            layer_2 = self._sigmoid(layer_1)
            result = layer_2
            predictions_array.append(result)
        return predictions_array

    def _compute_gradients(self, input_vectors, target):
        # Calculate gradients for each input vector in the batch
        derror_dbias_batch = 0
        derror_dweights_batch = np.zeros_like(self.weights)
        
        predictions_array = self.predict(input_vectors)
        for input_vector in input_vectors:
            layer_1 = np.dot(input_vector, self.weights) + self.bias

            derror_dprediction = 2 * (predictions_array - target)
            dprediction_dlayer1 = self._sigmoid_deriv(layer_1)
            dlayer1_dbias = 1
            dlayer1_dweights = input_vector

            derror_dbias = derror_dprediction * dprediction_dlayer1 * dlayer1_dbias
            derror_dweights = derror_dprediction * dprediction_dlayer1 * dlayer1_dweights

            # Accumulate gradients for the entire batch
            derror_dbias_batch += derror_dbias
            derror_dweights_batch += derror_dweights

        # Average the gradients for the batch
        derror_dbias_batch /= len(input_vectors)
        derror_dweights_batch /= len(input_vectors)

        return derror_dbias_batch, derror_dweights_batch

    def _update_parameters(self, derror_dbias, derror_dweights):
        self.bias = self.bias - (derror_dbias * self.learning_rate)
        self.weights = self.weights - (
            derror_dweights * self.learning_rate
        )

    def train(self, input_vectors, targets, iterations):
        cumulative_errors = []
        for current_iteration in range(iterations):
            # Pick a data instance at random
            random_data_index = np.random.randint(len(input_vectors))

            input_vector = input_vectors[random_data_index]
            target = targets[random_data_index]

            # Compute the gradients and update the weights
            derror_dbias, derror_dweights = self._compute_gradients(
                input_vector, target
            )

            self._update_parameters(derror_dbias, derror_dweights)

            # Measure the cumulative error for all the instances
            if current_iteration % 100 == 0:
                cumulative_error = 0
                # Loop through all the instances to measure the error
                for data_instance_index in range(len(input_vectors)):
                    data_point = input_vectors[data_instance_index]
                    target = targets[data_instance_index]

                    prediction = self.predict(data_point)
                    error = np.square(prediction - target)

                    cumulative_error = cumulative_error + error
                cumulative_errors.append(cumulative_error)

        return cumulative_errors