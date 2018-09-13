# watch-together
watch-together is a simple and made with material design Watch2Gether clone.
I do not came up with this idea. This is just a simple clone of a already existing project, called Watch Together.
So please notice, that I am not the founder of this. This project is just for learning purposes.

## Test the project
You can test it on the github page or you can install it by yourself (Coming Soon).
Just do the following:
### Running without Docker
Navigate to your favourite directory and clone the repository.
```sh
git clone https://github.com/FlorianWoelki/watch-together.git
```

After that, you need to install all necessary modules for this project.
```sh
npm install
```

Now you have a fully working project. You can start the project in your directory.
```sh
npm start
```

### Running with Docker
Navigate to your favourite directory and clone the repository.
```sh
git clone https://github.com/FlorianWoelki/watch-together.git
```

Now you need to build the image. Make sure that you are in the project directory.
```sh
docker build -t <username>/watch-together .
```

Let's run the docker container.
```sh
docker run -p 5000:5000 -d <username>/watch-together
```

The server is now up and running.

You just need to navigate to localhost:5000 or to your website and you are good to go!

## Tech
| Library | Link |
| ------ | ------ |
|Node JS|https://nodejs.org/en/|
|MaterializeCSS|https://materializecss.com/|
|SocketIO|https://socket.io/|

## Authors
* **[FlorianWoelki](https://github.com/FlorianWoelki)** - *Initial work*

## License
This project is licensed to the MIT license.

*Free Software, Hell Yeah!*

## Acknowledgments
* Thanks to Watch2Gether for this good practice example!
* Thanks to MaterializeCSS for this awesome framework!

## ToDo
- [ ] Add Vue?
- [x] Add Dockerfile
- [ ] Add docker-compose file for database?