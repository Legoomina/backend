import express from 'express';
import cors from 'cors';


const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send({ message: 'Hello From Express' });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});