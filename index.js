const express = require('express');
const morgan = require('morgan');
const app = express();
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

app.use(morgan(":method :url :status :res[content-length] :response-time ms :postBody"));

let people = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use((req, res, next) => {
    req.requestTime = new Date();
    next();
});

app.get('/info', (request, response) => {
    const requestTime = request.requestTime;
    response.send(
        '<div> <p>Phonebook has info for ' + people.length + ' people </p>'
        + requestTime + '</div>'
    )
});

app.get('/api/persons', (request, response) => {
    response.json(people);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    
    const person = people.find(person => person.id === id);
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
    const contained = people.filter(person => person.name === body.name);

    if(!body.name || !body.number)
    {
        return response.status(400).json({
            error : "content missing"
        })
    }
    else if(contained.length > 0)
    {
        return response.status(400).json({
            error: "name already contained in phonebook"
        })
    }

    const randomId = Math.floor(Math.random() * (999999999 - 4) + 5);

    const newPerson = {
        id : randomId,
        name : body.name,
        number : body.number
    };

    people = people.concat(newPerson);
    response.json(newPerson);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    people = people.filter(person => person.id !== id);
    
    response.status(204).end();
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
