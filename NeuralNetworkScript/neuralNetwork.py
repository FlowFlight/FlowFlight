import numpy as np

class NeuralNetwork:
    def __init__(self, learning_rate):
        with open('weights.txt', 'r') as saves_file:
            saves = [float(x) for x in saves_file.read().split('\n')]
        self.weights = np.array(saves[0:-1])
        self.bias = saves[-1]
        self.learning_rate = learning_rate
    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def _sigmoid_deriv(self, x):
        return self._sigmoid(x) * (1 - self._sigmoid(x))

    def predict(self, input_vector_array) -> list[float]:
        predictions_array = []
        for input_vector in input_vector_array:
            layer_1 = np.dot(input_vector, self.weights)/5 + self.bias
            layer_2 = self._sigmoid(layer_1)
            result = layer_2
            predictions_array.append(result)
        return predictions_array

    def _compute_gradients(self, input_vectors, targets):
        
        derror_dbias_batch = 0
        derror_dweights_batch = np.zeros_like(self.weights)
        
        for input_vector, target in zip(input_vectors, targets):
            #zprint(input_vector)
            #input_vector = np.array(input_vector)  # Convert to numpy array if it's not already
            print(input_vector)
            layer_1 = np.dot(input_vector, self.weights) + self.bias
            layer_2 = self._sigmoid(layer_1)
            print(layer_1)


            derror_dprediction = 2 * (layer_2 - target)
            dprediction_dlayer1 = self._sigmoid_deriv(layer_1)
            dlayer1_dbias = 1
            dlayer1_dweights = input_vector

            derror_dbias = derror_dprediction * dprediction_dlayer1 * dlayer1_dbias
            derror_dweights = np.multiply(derror_dprediction * dprediction_dlayer1, dlayer1_dweights)
            # Accumulate gradients for the entire batch
            derror_dbias_batch += derror_dbias
            
            derror_dweights_batch = np.add(derror_dweights, derror_dweights_batch)

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
                    for vector_data_instance_index in range(len(input_vector[data_instance_index])):    
                        data_point = input_vectors[data_instance_index]
                        target = targets[data_instance_index][vector_data_instance_index]

                        prediction = self.predict(data_point)[data_instance_index]
                        error = np.square(prediction - target)

                        cumulative_error = cumulative_error + error
                    cumulative_errors.append(cumulative_error)

        with open('weights.txt', 'w') as saves_file:
            for weight in self.weights:
                saves_file.write(str(weight) + '\n')
            saves_file.write(str(self.bias))
        return cumulative_errors   