from neuralNetwork import NeuralNetwork
from csvHandler import csvHandler

brain = NeuralNetwork(0.1)

ch = csvHandler()

ch.add_data('data1.csv', 'target1.csv')
#ch.add_data('data2.csv', 'target2.csv')
#ch.add_data('data3.csv', 'target3.csv')
#ch.add_data('data4.csv', 'target4.csv')
#ch.add_data('data5.csv', 'target5.csv')
#ch.add_data('data6.csv', 'target6.csv')
#ch.add_data('data7.csv', 'target7.csv')
#ch.add_data('data8.csv', 'target8.csv')
#ch.add_data('data9.csv', 'target9.csv')


#print(ch.test_input, ch.test_output, sep='\n\n')

print(brain.train(ch.test_input, ch.test_output, 1))

#print(brain.predict(ch.test_input[0]))