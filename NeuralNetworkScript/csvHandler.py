import csv
class csvHandler:
    test_input = []
    test_output = []

    def add_data(self, input_filename, output_filename):
        self.load_input(self.read(input_filename))
        self.load_output(self.read(output_filename))

    def read(self, filename):
        with open("TestData/"+filename, "r") as file:
            reader = csv.reader(file)
            data = []
            for line in reader:
                data.append([float(value) for value in line])
            return data
        
    def load_input(self, data):
        min_time = self.find_min_time(data)
        result = []
        for i in range(len(data)):
            result.append([
                (data[i][0]-min_time+data[i][1])/60,
                (data[i][1])/60,
                data[i][2],
                (0 if i == 0 else data[i-1][0]-min_time+data[i-1][1])/60,
                (1 if i == len(data)-1 else data[i+1][0]-min_time+data[i+1][1])/60,
            ])
        self.test_input.append(result)

    def load_output(self, data):
        self.test_output.append([value/len(data) for value in data[0]])
    
    def find_min_time(self, data):
        min_time = 1440
        for vector in data:
            if vector[0] < min_time:
                min_time = vector[0]
        return min_time