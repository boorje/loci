# Loci

Loci is a mobile app that allows you to quickly and easily find the best nearby restuarants and cafés. You can find places by a search bar, taking an image of the restuarants logo or choosing one of many nearby places suggested based on your position. You can find all revelant information about a place, including name, location, rating, images and reviews by other users - everything powered by Google Places API. 

![screenshot-1](https://github.com/boorje/loci/blob/master/assets/Screenshot-1.png)


## Installation

The project is built using React Native and has focus on iOS. 

### Clone from repository
```bash
# cloning the repo
git clone https://github.com/boorje/loci.git
cd loci

# installing dependencies
npm install

# installing CocoaPods dependencies
cd ios
pod install

# add Google API key inside src/constants/apiKeys.js 
export const {GOOGLE_API_KEY} = "YOUR API KEY";

# running the project (from the root directory)
react-native run-ios
```

## License
This project is open source and available under the [MIT License](https://github.com/boorje/loci/blob/master/LICENSE).
