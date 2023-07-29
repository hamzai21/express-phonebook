require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

const app = express();

app.use(cors());
app.use(express.static('build'))
app.use(express.json());

const postLog = morgan.token('postBody', request => {
    if (request.body.name)
    {
        return JSON.stringify(request.body);
    }
    else {
        return " ";
    }
})

const getCount = async () => {
    return await Person.count({});
}

app.use(morgan(":method :url :status :res[content-length] :response-time ms :postBody"));

app.use((req, res, next) => {
    req.requestTime = new Date();
    next();
});

app.get('/info', (request, res) => {
    const requestTime = request.requestTime;
    const test = request.test;
    getCount()
        .then(result => {
            res.send(
                '<div> <p>Phonebook has info for ' + result + ' people </p>'
                + requestTime + '</div>'
            )
        })
});

app.get('/api/persons/', (request, response) => {
    Person.find({}).then(person => {
        response.json(person);
    })
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    
    const person = Person.findById(id);
    if (person)
    {
        response.json(person);
    }
    else 
    {
        response.status(404).end();
    }
});

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    
    if (!body.name === undefined) {
        return response.status(400).json({error: 'name misisng'});
    }

    const newPerson = new Person({
        name: body.name,
        phoneNumber: body.phoneNumber
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson);
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    people = people.filter(person => person.id !== id);
    
    response.status(204).end();
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
