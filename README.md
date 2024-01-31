# Apollo
## Project Details
### AWS
<pre>
http://apollo-iot.eba-vhyi2hmd.eu-central-1.elasticbeanstalk.com
</pre>
### Postman Collection
<pre>
https://api.postman.com/collections/5306575-e90dd2a0-57e6-4ef8-8b9d-99cd8f600c07?access_key=PMAT-01HMZT2HVDG506Z5BY34NK722E
</pre>
## Project Setup
Firstly, you need to clone git repo. (Run it in your terminal)
```bash
git clone https://github.com/meteoguzhan/apollo.git
```
After clone project, you need to install packages. (Make sure your system exists npm)
```bash
cd apollo && npm install
```
You need to copy env file and rename it as .env
```bash
cp .env.example .env
```
Open .env file, Give your updated details of MongoDB connection string.
<pre>
MONGO_URI="link+collection"
PRIVATE_KEY="Apollo"
PORT=3000
</pre>
You can test the project.
```bash
npm run test
```
You can start the project. (Make sure your system exists nodemon)
```bash
npm run dev
```

