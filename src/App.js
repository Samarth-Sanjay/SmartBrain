import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import Clarifai from 'clarifai';
import Register from './components/Register/Register';



const app = new Clarifai.App({
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'
    //Please visit clarifai.com for the api key. Cannot share the personal api key.
});

const particlesOptions = {
    particles: {
        number:{
            value:80,
            density:{
                enable:true,
                value_area:900
            }
        }
    }
};

class App extends Component {
    constructor(){
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false
        }
    }
calculateFaceLocation = (data) => {
 const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
 const image = document.getElementById('inputImage');
 // const clarifaiFace = console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
const width = Number(image.width);
    const height = Number(image.height);
return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height),
}
}
displayFaceBox = (box) => {
        this.setState({box:box});
}
    onInputChange = (event) =>{
        this.setState({input: event.target.value});;
    };
    onButtonSubmit = () => {
        this.setState({imageUrl:this.state.input});

        app.models
            .predict(
                "a403429f2ddf4b49b307e318f00e528b",
                this.state.input)
            .then(response =>  this.displayFaceBox(this.calculateFaceLocation(response)))
                .catch(err => console.log(err))

    }
    onRouteChange = (route) => {
        if(route ==='signout'){
            this.setState({isSignedIn: false})
        }else if(route==='home'){
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }
  render(){
      const {isSignedIn, imageUrl, route, box} = this.state;
    return (

      <div className="App">
          <Particles className='particles'params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          {route === 'home'
              ? <div>
                  <Logo />
                  <Rank />
                  <ImageLinkForm
                      onInputChange={this.onInputChange}
                      onButtonSubmit={this.onButtonSubmit} />

                  <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
              :
              (
                  route === 'signin'
                  ? <SignIn onRouteChange={this.onRouteChange}/>
                  : <Register onRouteChange={this.onRouteChange}/>
              )

          }



        </div>
    );
  }
}

export default App;
