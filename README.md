# TalaveraStocks

A React Native mobile application for tracking stock prices with offline support.

## Features

- Real-time stock price tracking
- Offline mode with cached data
- Favorite stocks management
- Search and sort functionality
- Smooth animations and transitions

## Setup and Installation

1. Clone the repository: 
bash
git clone https://github.com/carlos-ra/talaverastocks
cd talaverastocks

2. Install dependencies:
bash
npm install

3. Start the development server:
bash
npx expo start

or using bun
bun start ios

4. Run on your preferred platform:
bash
iOS
npm run ios
Android
npm run android


## Development Decisions & Trade-offs

### Offline Support
- Implemented local storage caching using AsyncStorage
- Stores last known stock data and timestamps
- Auto-detects network status and switches modes seamlessly
- Trade-off: Potentially stale data in offline mode, but ensures app usability

### Data Management
- Used React Context for global state management
- Trade-off: Chose Context over Redux for simplicity and smaller bundle size
- Implemented optimistic updates for favorites to improve perceived performance

### Testing
- Unit tests for core functionality
- Mock implementations for external services
- Trade-off: Focused on business logic testing over UI testing for time efficiency

### UI/UX
- Atomic Design pattern for component organization (PENDING)
- Smooth animations for better user experience
- Responsive layout that works across different screen sizes

## Requirements Implementation

### Core Features
- Display list of stocks
- Show stock details
- Basic navigation
- Type safety with TypeScript

### Enhanced Features
- Search functionality
- Sort by price
- Offline support
- Favorites system
- Loading states
- Error handling

### Extra Features
- Animations
- Unit tests
- Atomic Design pattern (PENDING)
- Network status indicator
- Data persistence

## Testing

Run the test suite:
bash
npm test

## Project Structure
talaverastocks/
├── app/ # Expo Router pages
├── components/
├── context/ # Global state management
├── utils/ # Helper functions
└── tests/ # Test files


## Technologies Used

- React Native
- Expo
- TypeScript
- Jest & Testing Library
- AsyncStorage
- NetInfo